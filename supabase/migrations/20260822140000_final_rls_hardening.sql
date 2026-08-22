-- ==============================================================================
-- MIGRATION: 20260822140000_final_rls_hardening.sql
-- DESCRIPTION: Definitive PostgreSQL RLS & Schema Hardening for PUB ECOM / PubecomHub
-- TARGETS:
--   1. Suppliers: Base table restricted to MASTER and owning supplier. Public view for all others.
--   2. Master Products: Base table restricted to MASTER and owning supplier. Commercial view with sanitized metadata.
--   3. Products: Base table restricted to MASTER and store owner. Public storefront view strictly excluding cost/margins.
--   4. Customers: Strict multi-tenant isolation. No cross-tenant INSERTs.
--   5. Marketing Events: Strict store isolation + customer relational consistency.
--   6. Orders: Base table restricted to store owner & MASTER. View for influencers/affiliates excluding cost/profit.
-- ==============================================================================

-- 1. SUPPLIERS HARDENING
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS profile_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL;

DROP POLICY IF EXISTS "Authenticated users can view suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Authorized users can view suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Master and suppliers can manage suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Suppliers base table select policy" ON public.suppliers;
DROP POLICY IF EXISTS "Suppliers base table insert policy" ON public.suppliers;
DROP POLICY IF EXISTS "Suppliers base table update policy" ON public.suppliers;
DROP POLICY IF EXISTS "Suppliers base table delete policy" ON public.suppliers;

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

-- Base table restricted exclusively to MASTER and the supplier owner
CREATE POLICY "Suppliers base table access policy"
ON public.suppliers FOR ALL TO authenticated
USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'MASTER')
    OR (profile_id IS NOT NULL AND profile_id = auth.uid())
)
WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'MASTER')
    OR (profile_id IS NOT NULL AND profile_id = auth.uid())
);

-- Public Suppliers View (for Lojistas catalog and public storefronts)
CREATE OR REPLACE VIEW public.public_suppliers WITH (security_invoker = false) AS
SELECT 
    id,
    name,
    category,
    created_at
FROM public.suppliers;

GRANT SELECT ON public.public_suppliers TO anon, authenticated;


-- 2. MASTER PRODUCTS HARDENING
DROP POLICY IF EXISTS "Master products are viewable by all authenticated users" ON public.master_products;
DROP POLICY IF EXISTS "Master and suppliers can view full master products" ON public.master_products;
DROP POLICY IF EXISTS "Master and suppliers can manage master products" ON public.master_products;
DROP POLICY IF EXISTS "Master products base select policy" ON public.master_products;
DROP POLICY IF EXISTS "Master products base insert policy" ON public.master_products;
DROP POLICY IF EXISTS "Master products base update policy" ON public.master_products;
DROP POLICY IF EXISTS "Master products base delete policy" ON public.master_products;

ALTER TABLE public.master_products ENABLE ROW LEVEL SECURITY;

-- Base table restricted to MASTER and the owning supplier
CREATE POLICY "Master products base table policy"
ON public.master_products FOR ALL TO authenticated
USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'MASTER')
    OR (
        supplier_id IS NOT NULL 
        AND EXISTS (
            SELECT 1 FROM public.suppliers s 
            WHERE s.id = master_products.supplier_id AND s.profile_id = auth.uid()
        )
    )
)
WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'MASTER')
    OR (
        supplier_id IS NOT NULL 
        AND EXISTS (
            SELECT 1 FROM public.suppliers s 
            WHERE s.id = master_products.supplier_id AND s.profile_id = auth.uid()
        )
    )
);

-- Commercial Master Products View (for Lojistas / Catalog Browsing)
-- Excludes supplier_cost and purges any internal/sensitive keys from metadata JSONB
CREATE OR REPLACE VIEW public.available_master_products WITH (security_invoker = false) AS
SELECT 
    id,
    sku,
    name,
    description,
    image_url,
    category,
    base_price_pub,
    status,
    is_available,
    jsonb_strip_nulls(
        jsonb_build_object(
            'external_id', metadata->>'external_id',
            'brand', metadata->>'brand',
            'attributes', metadata->'attributes'
        )
    ) AS metadata,
    created_at,
    updated_at
FROM public.master_products
WHERE is_available = true AND status = 'active';

GRANT SELECT ON public.available_master_products TO authenticated;


-- 3. STORE PRODUCTS HARDENING
DROP POLICY IF EXISTS "Public can view products" ON public.products;
DROP POLICY IF EXISTS "Store owners can manage products" ON public.products;
DROP POLICY IF EXISTS "Store owners and master can manage products" ON public.products;
DROP POLICY IF EXISTS "Store products base policy" ON public.products;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Base table restricted to MASTER and store owner
CREATE POLICY "Store products base policy"
ON public.products FOR ALL TO authenticated
USING (
    EXISTS (SELECT 1 FROM public.stores s WHERE s.id = products.store_id AND s.owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'MASTER')
)
WITH CHECK (
    EXISTS (SELECT 1 FROM public.stores s WHERE s.id = products.store_id AND s.owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'MASTER')
);

-- Storefront Products View (strictly excluding cost, profit_margin, and supplier_id)
CREATE OR REPLACE VIEW public.public_store_products WITH (security_invoker = false) AS
SELECT 
    id,
    store_id,
    master_product_id,
    COALESCE(custom_name, name) AS name,
    COALESCE(custom_description, '') AS description,
    price,
    stock,
    COALESCE(custom_image_url, image_url) AS image_url,
    status,
    created_at,
    updated_at
FROM public.products
WHERE status = 'active';

GRANT SELECT ON public.public_store_products TO anon, authenticated;


-- 4. CUSTOMERS HARDENING
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS store_id uuid REFERENCES public.stores(id) ON DELETE CASCADE;

DROP POLICY IF EXISTS "Authenticated users can view customers" ON public.customers;
DROP POLICY IF EXISTS "Store owners can view their customers" ON public.customers;
DROP POLICY IF EXISTS "Store owners and master can view customers" ON public.customers;
DROP POLICY IF EXISTS "Store owners and checkout can insert customers" ON public.customers;
DROP POLICY IF EXISTS "Store owners and master can update customers" ON public.customers;
DROP POLICY IF EXISTS "Store owners and master can delete customers" ON public.customers;
DROP POLICY IF EXISTS "Customers select policy" ON public.customers;
DROP POLICY IF EXISTS "Customers authenticated insert policy" ON public.customers;
DROP POLICY IF EXISTS "Customers anonymous checkout insert policy" ON public.customers;
DROP POLICY IF EXISTS "Customers update policy" ON public.customers;
DROP POLICY IF EXISTS "Customers delete policy" ON public.customers;

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers select policy"
ON public.customers FOR SELECT TO authenticated
USING (
    (store_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.stores s WHERE s.id = customers.store_id AND s.owner_id = auth.uid()
    ))
    OR EXISTS (
        SELECT 1 FROM public.orders o
        JOIN public.stores s ON o.store_id = s.id
        WHERE o.customer_id = customers.id AND s.owner_id = auth.uid()
    )
    OR EXISTS (
        SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'MASTER'
    )
);

CREATE POLICY "Customers authenticated insert policy"
ON public.customers FOR INSERT TO authenticated
WITH CHECK (
    (store_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.stores s WHERE s.id = store_id AND s.owner_id = auth.uid()
    ))
    OR EXISTS (
        SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'MASTER'
    )
);

CREATE POLICY "Customers anonymous checkout insert policy"
ON public.customers FOR INSERT TO anon
WITH CHECK (
    store_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.stores s WHERE s.id = store_id AND s.status = 'active'
    )
);

CREATE POLICY "Customers update policy"
ON public.customers FOR UPDATE TO authenticated
USING (
    (store_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.stores s WHERE s.id = customers.store_id AND s.owner_id = auth.uid()
    ))
    OR EXISTS (
        SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'MASTER'
    )
);

CREATE POLICY "Customers delete policy"
ON public.customers FOR DELETE TO authenticated
USING (
    (store_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.stores s WHERE s.id = customers.store_id AND s.owner_id = auth.uid()
    ))
    OR EXISTS (
        SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'MASTER'
    )
);


-- 5. MARKETING EVENTS HARDENING
ALTER TABLE public.marketing_events ADD COLUMN IF NOT EXISTS store_id uuid REFERENCES public.stores(id) ON DELETE CASCADE;

DROP POLICY IF EXISTS "Authenticated users can manage marketing events" ON public.marketing_events;
DROP POLICY IF EXISTS "Store owners and master can view marketing events" ON public.marketing_events;
DROP POLICY IF EXISTS "Authorized users can insert marketing events" ON public.marketing_events;
DROP POLICY IF EXISTS "Store owners and master can update marketing events" ON public.marketing_events;
DROP POLICY IF EXISTS "Store owners and master can delete marketing events" ON public.marketing_events;
DROP POLICY IF EXISTS "Marketing events select policy" ON public.marketing_events;
DROP POLICY IF EXISTS "Marketing events authenticated insert policy" ON public.marketing_events;
DROP POLICY IF EXISTS "Marketing events anonymous tracking insert policy" ON public.marketing_events;
DROP POLICY IF EXISTS "Marketing events update policy" ON public.marketing_events;
DROP POLICY IF EXISTS "Marketing events delete policy" ON public.marketing_events;

ALTER TABLE public.marketing_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Marketing events select policy"
ON public.marketing_events FOR SELECT TO authenticated
USING (
    (store_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.stores s WHERE s.id = marketing_events.store_id AND s.owner_id = auth.uid()
    ))
    OR EXISTS (
        SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'MASTER'
    )
);

CREATE POLICY "Marketing events authenticated insert policy"
ON public.marketing_events FOR INSERT TO authenticated
WITH CHECK (
    (store_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.stores s WHERE s.id = store_id AND s.owner_id = auth.uid()
    ))
    OR EXISTS (
        SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'MASTER'
    )
);

CREATE POLICY "Marketing events anonymous tracking insert policy"
ON public.marketing_events FOR INSERT TO anon
WITH CHECK (
    store_id IS NOT NULL 
    AND EXISTS (SELECT 1 FROM public.stores s WHERE s.id = store_id AND s.status = 'active')
    AND EXISTS (SELECT 1 FROM public.customers c WHERE c.id = customer_id AND c.store_id = store_id)
);

CREATE POLICY "Marketing events update policy"
ON public.marketing_events FOR UPDATE TO authenticated
USING (
    (store_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.stores s WHERE s.id = marketing_events.store_id AND s.owner_id = auth.uid()
    ))
    OR EXISTS (
        SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'MASTER'
    )
);

CREATE POLICY "Marketing events delete policy"
ON public.marketing_events FOR DELETE TO authenticated
USING (
    (store_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.stores s WHERE s.id = marketing_events.store_id AND s.owner_id = auth.uid()
    ))
    OR EXISTS (
        SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'MASTER'
    )
);


-- 6. ORDERS HARDENING & INFLUENCER/AFFILIATE VIEW
DROP POLICY IF EXISTS "Store owners can view their orders" ON public.orders;
DROP POLICY IF EXISTS "Influencers can view their orders" ON public.orders;
DROP POLICY IF EXISTS "Orders base table access policy" ON public.orders;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Base table restricted to store owner and MASTER
CREATE POLICY "Orders base table access policy"
ON public.orders FOR ALL TO authenticated
USING (
    EXISTS (SELECT 1 FROM public.stores s WHERE s.id = orders.store_id AND s.owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'MASTER')
)
WITH CHECK (
    EXISTS (SELECT 1 FROM public.stores s WHERE s.id = orders.store_id AND s.owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'MASTER')
);

-- View for Influencers & Affiliates (strictly omitting cost, net_profit, and financial_metadata)
CREATE OR REPLACE VIEW public.influencer_orders WITH (security_invoker = false) AS
SELECT 
    id,
    external_id,
    store_id,
    customer_id,
    influencer_id,
    affiliate_id,
    amount,
    shipping,
    tax,
    discount,
    status,
    fulfillment_status,
    tracking_code,
    created_at
FROM public.orders;

GRANT SELECT ON public.influencer_orders TO authenticated;
