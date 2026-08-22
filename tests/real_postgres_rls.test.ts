import { describe, it, expect, beforeAll } from 'vitest';
import { PGlite } from '@electric-sql/pglite';

describe('Real PostgreSQL Engine RLS Hardening Suite (PGlite)', () => {
  let pg: PGlite;

  const MASTER_UID = '00000000-0000-0000-0000-000000000001';
  const LOJISTA_A_UID = '11111111-1111-1111-1111-111111111111';
  const LOJISTA_B_UID = '22222222-2222-2222-2222-222222222222';
  const FORNECEDOR_A_UID = '33333333-3333-3333-3333-333333333333';
  const FORNECEDOR_B_UID = '44444444-4444-4444-4444-444444444444';
  const INFLUENCER_UID = '55555555-5555-5555-5555-555555555555';

  const STORE_A_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  const STORE_B_ID = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
  const SUPPLIER_A_ID = 'caaaaaaa-0000-0000-0000-000000000001';
  const SUPPLIER_B_ID = 'cbbbbbbb-0000-0000-0000-000000000002';

  const MP_A_ID = 'baaaaaaa-0000-0000-0000-000000000001';
  const MP_B_ID = 'baaaaaaa-0000-0000-0000-000000000002';

  const PROD_A_ID = 'daaaaaaa-0000-0000-0000-000000000001';
  const PROD_B_ID = 'daaaaaaa-0000-0000-0000-000000000002';

  const CUST_A_ID = 'eaaaaaaa-0000-0000-0000-000000000001';
  const CUST_B_ID = 'eaaaaaaa-0000-0000-0000-000000000002';

  const EVT_A_ID = 'faaaaaaa-0000-0000-0000-000000000001';
  const EVT_B_ID = 'faaaaaaa-0000-0000-0000-000000000002';

  async function asUser(uid: string | null, role: 'authenticated' | 'anon' = 'authenticated') {
    await pg.exec(`SET ROLE web_user;`);
    if (uid) {
      await pg.query(`SELECT set_config('request.jwt.claim.sub', '${uid}', false)`);
      await pg.query(`SELECT set_config('request.jwt.claim.role', '${role}', false)`);
    } else {
      await pg.query(`SELECT set_config('request.jwt.claim.sub', '', false)`);
      await pg.query(`SELECT set_config('request.jwt.claim.role', 'anon', false)`);
    }
  }

  beforeAll(async () => {
    pg = new PGlite();

    // 1. Setup mock auth schema in PostgreSQL
    await pg.exec(`
      CREATE SCHEMA IF NOT EXISTS auth;
      CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid AS $$
        SELECT NULLIF(current_setting('request.jwt.claim.sub', true), '')::uuid;
      $$ LANGUAGE sql STABLE;

      CREATE OR REPLACE FUNCTION auth.role() RETURNS text AS $$
        SELECT COALESCE(NULLIF(current_setting('request.jwt.claim.role', true), ''), 'anon');
      $$ LANGUAGE sql STABLE;
    `);

    // 2. Setup Base Tables
    await pg.exec(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
          CREATE TYPE public.app_role AS enum ('MASTER', 'LOJISTA', 'FORNECEDOR', 'AFILIADO', 'INFLUENCER');
        END IF;
      END $$;

      CREATE TABLE public.profiles (
        id uuid PRIMARY KEY,
        name text NOT NULL,
        email text NOT NULL,
        role public.app_role NOT NULL DEFAULT 'LOJISTA',
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      );

      CREATE TABLE public.stores (
        id uuid PRIMARY KEY,
        name text NOT NULL,
        owner_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
        subdomain text UNIQUE NOT NULL,
        status text NOT NULL DEFAULT 'active',
        created_at timestamptz DEFAULT now()
      );

      CREATE TABLE public.suppliers (
        id uuid PRIMARY KEY,
        name text NOT NULL,
        category text,
        profile_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
        created_at timestamptz DEFAULT now()
      );

      CREATE TABLE public.master_products (
        id uuid PRIMARY KEY,
        supplier_id uuid REFERENCES public.suppliers(id) ON DELETE SET NULL,
        sku text UNIQUE NOT NULL,
        name text NOT NULL,
        description text,
        image_url text,
        category text,
        supplier_cost numeric(10,2) NOT NULL DEFAULT 0,
        base_price_pub numeric(10,2) NOT NULL DEFAULT 0,
        status text NOT NULL DEFAULT 'active',
        is_available boolean NOT NULL DEFAULT true,
        metadata jsonb DEFAULT '{}',
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      );

      CREATE TABLE public.products (
        id uuid PRIMARY KEY,
        name text NOT NULL,
        price decimal(12,2) NOT NULL,
        cost decimal(12,2) NOT NULL,
        profit_margin decimal(12,2) DEFAULT 0,
        supplier_id uuid REFERENCES public.suppliers(id),
        store_id uuid REFERENCES public.stores(id) ON DELETE CASCADE,
        master_product_id uuid REFERENCES public.master_products(id),
        custom_name text,
        custom_description text,
        custom_image_url text,
        stock integer NOT NULL DEFAULT 0,
        status text DEFAULT 'active',
        image_url text,
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      );

      CREATE TABLE public.customers (
        id uuid PRIMARY KEY,
        store_id uuid REFERENCES public.stores(id) ON DELETE CASCADE,
        name text NOT NULL,
        email text NOT NULL,
        phone text,
        created_at timestamptz DEFAULT now()
      );

      CREATE TABLE public.orders (
        id uuid PRIMARY KEY,
        external_id text,
        store_id uuid NOT NULL REFERENCES public.stores(id),
        customer_id uuid NOT NULL REFERENCES public.customers(id),
        influencer_id uuid REFERENCES public.profiles(id),
        affiliate_id uuid REFERENCES public.profiles(id),
        amount decimal(12,2) NOT NULL,
        cost decimal(12,2) NOT NULL,
        shipping decimal(12,2) NOT NULL DEFAULT 0,
        tax decimal(12,2) NOT NULL DEFAULT 0,
        discount decimal(12,2) NOT NULL DEFAULT 0,
        status text NOT NULL DEFAULT 'pending',
        fulfillment_status text DEFAULT 'pending',
        tracking_code text,
        financial_metadata jsonb DEFAULT '{}',
        net_profit decimal(12,2) GENERATED ALWAYS AS (amount - cost - shipping - tax - discount) STORED,
        created_at timestamptz DEFAULT now()
      );

      CREATE TABLE public.marketing_events (
        id uuid PRIMARY KEY,
        store_id uuid REFERENCES public.stores(id) ON DELETE CASCADE,
        customer_id uuid REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
        event_type text NOT NULL,
        metadata jsonb DEFAULT '{}',
        created_at timestamptz DEFAULT now()
      );
    `);

    // 3. Apply Hardening RLS Policies & Views in PostgreSQL (with security_invoker = false)
    await pg.exec(`
      -- A. SUPPLIERS RLS
      ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
      CREATE POLICY "Suppliers base table access policy" ON public.suppliers FOR ALL
      USING (
        EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'MASTER')
        OR (profile_id IS NOT NULL AND profile_id = auth.uid())
      )
      WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'MASTER')
        OR (profile_id IS NOT NULL AND profile_id = auth.uid())
      );

      CREATE OR REPLACE VIEW public.public_suppliers WITH (security_invoker = false) AS
      SELECT id, name, category, created_at FROM public.suppliers;

      -- B. MASTER PRODUCTS RLS
      ALTER TABLE public.master_products ENABLE ROW LEVEL SECURITY;
      CREATE POLICY "Master products base table policy" ON public.master_products FOR ALL
      USING (
        EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'MASTER')
        OR (
          supplier_id IS NOT NULL 
          AND EXISTS (SELECT 1 FROM public.suppliers s WHERE s.id = master_products.supplier_id AND s.profile_id = auth.uid())
        )
      )
      WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'MASTER')
        OR (
          supplier_id IS NOT NULL 
          AND EXISTS (SELECT 1 FROM public.suppliers s WHERE s.id = master_products.supplier_id AND s.profile_id = auth.uid())
        )
      );

      CREATE OR REPLACE VIEW public.available_master_products WITH (security_invoker = false) AS
      SELECT 
        id, sku, name, description, image_url, category, base_price_pub, status, is_available,
        jsonb_strip_nulls(
          jsonb_build_object(
            'external_id', metadata->>'external_id',
            'brand', metadata->>'brand',
            'attributes', metadata->'attributes'
          )
        ) AS metadata,
        created_at, updated_at
      FROM public.master_products
      WHERE is_available = true AND status = 'active';

      -- C. STORE PRODUCTS RLS
      ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
      CREATE POLICY "Store products base policy" ON public.products FOR ALL
      USING (
        EXISTS (SELECT 1 FROM public.stores s WHERE s.id = products.store_id AND s.owner_id = auth.uid())
        OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'MASTER')
      )
      WITH CHECK (
        EXISTS (SELECT 1 FROM public.stores s WHERE s.id = products.store_id AND s.owner_id = auth.uid())
        OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'MASTER')
      );

      CREATE OR REPLACE VIEW public.public_store_products WITH (security_invoker = false) AS
      SELECT id, store_id, master_product_id, COALESCE(custom_name, name) AS name, COALESCE(custom_description, '') AS description, price, stock, COALESCE(custom_image_url, image_url) AS image_url, status, created_at, updated_at
      FROM public.products WHERE status = 'active';

      -- D. CUSTOMERS RLS
      ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
      CREATE POLICY "Customers select policy" ON public.customers FOR SELECT
      USING (
        (store_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.stores s WHERE s.id = customers.store_id AND s.owner_id = auth.uid()))
        OR EXISTS (SELECT 1 FROM public.orders o JOIN public.stores s ON o.store_id = s.id WHERE o.customer_id = customers.id AND s.owner_id = auth.uid())
        OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'MASTER')
      );

      CREATE POLICY "Customers authenticated insert policy" ON public.customers FOR INSERT
      WITH CHECK (
        (store_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.stores s WHERE s.id = store_id AND s.owner_id = auth.uid()))
        OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'MASTER')
      );

      -- E. MARKETING EVENTS RLS
      ALTER TABLE public.marketing_events ENABLE ROW LEVEL SECURITY;
      CREATE POLICY "Marketing events select policy" ON public.marketing_events FOR SELECT
      USING (
        (store_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.stores s WHERE s.id = marketing_events.store_id AND s.owner_id = auth.uid()))
        OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'MASTER')
      );

      CREATE POLICY "Marketing events authenticated insert policy" ON public.marketing_events FOR INSERT
      WITH CHECK (
        (store_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.stores s WHERE s.id = store_id AND s.owner_id = auth.uid()))
        OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'MASTER')
      );

      -- F. ORDERS RLS
      ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
      CREATE POLICY "Orders base table access policy" ON public.orders FOR ALL
      USING (
        EXISTS (SELECT 1 FROM public.stores s WHERE s.id = orders.store_id AND s.owner_id = auth.uid())
        OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'MASTER')
      )
      WITH CHECK (
        EXISTS (SELECT 1 FROM public.stores s WHERE s.id = orders.store_id AND s.owner_id = auth.uid())
        OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'MASTER')
      );

      CREATE OR REPLACE VIEW public.influencer_orders WITH (security_invoker = false) AS
      SELECT id, external_id, store_id, customer_id, influencer_id, affiliate_id, amount, shipping, tax, discount, status, fulfillment_status, tracking_code, created_at
      FROM public.orders;
    `);

    // 4. Seed database (as superuser before dropping to web_user)
    await pg.exec(`
      INSERT INTO public.profiles (id, name, email, role) VALUES
        ('${MASTER_UID}', 'Admin Master', 'admin@pubholding.com', 'MASTER'),
        ('${LOJISTA_A_UID}', 'Lojista Alpha', 'lojista.a@store.com', 'LOJISTA'),
        ('${LOJISTA_B_UID}', 'Lojista Beta', 'lojista.b@store.com', 'LOJISTA'),
        ('${FORNECEDOR_A_UID}', 'Fornecedor A', 'forn.a@supplier.com', 'FORNECEDOR'),
        ('${FORNECEDOR_B_UID}', 'Fornecedor B', 'forn.b@supplier.com', 'FORNECEDOR'),
        ('${INFLUENCER_UID}', 'Influencer Star', 'influencer@media.com', 'INFLUENCER');

      INSERT INTO public.stores (id, name, owner_id, subdomain, status) VALUES
        ('${STORE_A_ID}', 'Loja Alpha', '${LOJISTA_A_UID}', 'alpha', 'active'),
        ('${STORE_B_ID}', 'Loja Beta', '${LOJISTA_B_UID}', 'beta', 'active');

      INSERT INTO public.suppliers (id, name, category, profile_id) VALUES
        ('${SUPPLIER_A_ID}', 'Fornecedor A LTDA', 'Calçados', '${FORNECEDOR_A_UID}'),
        ('${SUPPLIER_B_ID}', 'Fornecedor B LTDA', 'Eletrônicos', '${FORNECEDOR_B_UID}');

      INSERT INTO public.master_products (id, supplier_id, sku, name, supplier_cost, base_price_pub, status, is_available, metadata) VALUES
        ('${MP_A_ID}', '${SUPPLIER_A_ID}', 'SKU-A1', 'Babuche Alpha Zentta', 18.50, 39.90, 'active', true, '{"external_id": "1729928484", "brand": "Zentta", "supplier_secret_note": "Confidencial"}'),
        ('${MP_B_ID}', '${SUPPLIER_B_ID}', 'SKU-B1', 'Smartwatch Beta Lux', 45.00, 99.00, 'active', true, '{"external_id": "888888", "internal_tax": 0.15}');

      INSERT INTO public.products (id, store_id, supplier_id, name, price, cost, profit_margin, stock, status) VALUES
        ('${PROD_A_ID}', '${STORE_A_ID}', '${SUPPLIER_A_ID}', 'Babuche Conforto Alpha', 79.90, 39.90, 40.00, 100, 'active'),
        ('${PROD_B_ID}', '${STORE_B_ID}', '${SUPPLIER_B_ID}', 'Smartwatch Beta Edition', 189.90, 99.00, 90.90, 50, 'active');

      INSERT INTO public.customers (id, store_id, name, email, phone) VALUES
        ('${CUST_A_ID}', '${STORE_A_ID}', 'Cliente Alpha Privado', 'cliente.a@privado.com', '+5511999990001'),
        ('${CUST_B_ID}', '${STORE_B_ID}', 'Cliente Beta Privado', 'cliente.b@privado.com', '+5521999990002');

      INSERT INTO public.orders (id, store_id, customer_id, influencer_id, amount, cost, shipping, status) VALUES
        ('10000000-0000-0000-0000-000000000001', '${STORE_A_ID}', '${CUST_A_ID}', '${INFLUENCER_UID}', 79.90, 39.90, 10.00, 'paid'),
        ('10000000-0000-0000-0000-000000000002', '${STORE_B_ID}', '${CUST_B_ID}', NULL, 189.90, 99.00, 15.00, 'paid');

      INSERT INTO public.marketing_events (id, store_id, customer_id, event_type) VALUES
        ('${EVT_A_ID}', '${STORE_A_ID}', '${CUST_A_ID}', 'PAGE_VIEW'),
        ('${EVT_B_ID}', '${STORE_B_ID}', '${CUST_B_ID}', 'CHECKOUT_STARTED');
    `);

    // 5. Setup web_user role without bypassrls
    await pg.exec(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'web_user') THEN
          CREATE ROLE web_user NOSUPERUSER NOBYPASSRLS;
        END IF;
      END $$;

      GRANT USAGE ON SCHEMA public TO web_user;
      GRANT ALL ON ALL TABLES IN SCHEMA public TO web_user;
      GRANT ALL ON ALL ROUTINES IN SCHEMA public TO web_user;
      GRANT USAGE ON SCHEMA auth TO web_user;
      GRANT ALL ON ALL ROUTINES IN SCHEMA auth TO web_user;
    `);
  });

  describe('1. Marketing Events Multi-Tenant SQL Isolation (CRITICAL)', () => {
    it('Lojista A can SELECT only events from Store A in real PostgreSQL engine', async () => {
      await asUser(LOJISTA_A_UID);
      const res = await pg.query<{ id: string; store_id: string }>('SELECT id, store_id FROM public.marketing_events');
      expect(res.rows.length).toBe(1);
      expect(res.rows[0].id).toBe(EVT_A_ID);
      expect(res.rows[0].store_id).toBe(STORE_A_ID);
    });

    it('Lojista A is DENIED by PostgreSQL RLS when inserting event into Store B', async () => {
      await asUser(LOJISTA_A_UID);
      let errorThrown = false;
      try {
        await pg.query(`
          INSERT INTO public.marketing_events (id, store_id, customer_id, event_type)
          VALUES ('faaaaaaa-0000-0000-0000-000000000099', '${STORE_B_ID}', '${CUST_B_ID}', 'ATTACK_EVENT')
        `);
      } catch (err: any) {
        errorThrown = true;
        expect(err.message).toContain('violates row-level security policy');
      }
      expect(errorThrown).toBe(true);
    });
  });

  describe('2. Customer Contact Information SQL Isolation (CRITICAL)', () => {
    it('Lojista A can SELECT only customers from Store A, getting 0 rows for Store B', async () => {
      await asUser(LOJISTA_A_UID);
      const res = await pg.query<{ email: string; store_id: string }>('SELECT email, store_id FROM public.customers');
      expect(res.rows.length).toBe(1);
      expect(res.rows[0].email).toBe('cliente.a@privado.com');
      expect(res.rows[0].store_id).toBe(STORE_A_ID);
    });

    it('Lojista A is DENIED by PostgreSQL RLS when inserting customer into Store B', async () => {
      await asUser(LOJISTA_A_UID);
      let errorThrown = false;
      try {
        await pg.query(`
          INSERT INTO public.customers (id, store_id, name, email, phone)
          VALUES ('eaaaaaaa-0000-0000-0000-000000000099', '${STORE_B_ID}', 'Hacker', 'hacker@bad.com', '000')
        `);
      } catch (err: any) {
        errorThrown = true;
        expect(err.message).toContain('violates row-level security policy');
      }
      expect(errorThrown).toBe(true);
    });
  });

  describe('3. Product Cost & Profit Margin SQL Protection (WARNING)', () => {
    it('Lojista A sees cost & profit_margin for Store A, but 0 rows for Store B', async () => {
      await asUser(LOJISTA_A_UID);
      const res = await pg.query<{ cost: number; profit_margin: number; store_id: string }>('SELECT cost, profit_margin, store_id FROM public.products');
      expect(res.rows.length).toBe(1);
      expect(Number(res.rows[0].cost)).toBe(39.90);
      expect(Number(res.rows[0].profit_margin)).toBe(40.00);
      expect(res.rows[0].store_id).toBe(STORE_A_ID);
    });

    it('Public storefront view public_store_products does not contain cost or profit_margin columns in SQL query', async () => {
      await asUser(null, 'anon');
      const res = await pg.query<any>(`SELECT * FROM public.public_store_products WHERE store_id = '${STORE_A_ID}'`);
      expect(res.rows.length).toBe(1);
      expect(res.rows[0].name).toBe('Babuche Conforto Alpha');
      expect(Number(res.rows[0].price)).toBe(79.90);
      expect(res.rows[0].cost).toBeUndefined();
      expect(res.rows[0].profit_margin).toBeUndefined();
      expect(res.rows[0].supplier_id).toBeUndefined();
    });
  });

  describe('4. Master Catalog Supplier Cost & Metadata Sanitization (WARNING)', () => {
    it('Fornecedor A can query base master_products and see supplier_cost for their own products only', async () => {
      await asUser(FORNECEDOR_A_UID);
      const res = await pg.query<{ sku: string; supplier_cost: number }>('SELECT sku, supplier_cost FROM public.master_products');
      expect(res.rows.length).toBe(1);
      expect(res.rows[0].sku).toBe('SKU-A1');
      expect(Number(res.rows[0].supplier_cost)).toBe(18.50);
    });

    it('Lojista A gets 0 rows on base master_products table (direct supplier_cost access DENIED)', async () => {
      await asUser(LOJISTA_A_UID);
      const res = await pg.query('SELECT * FROM public.master_products');
      expect(res.rows.length).toBe(0);
    });

    it('Lojista A queries available_master_products view and receives sanitized metadata without secret notes', async () => {
      await asUser(LOJISTA_A_UID);
      const res = await pg.query<any>('SELECT * FROM public.available_master_products');
      expect(res.rows.length).toBe(2);
      expect(res.rows[0].supplier_cost).toBeUndefined();
      expect(Number(res.rows[0].base_price_pub)).toBe(39.90);
      expect(res.rows[0].metadata?.external_id).toBe('1729928484');
      expect(res.rows[0].metadata?.brand).toBe('Zentta');
      expect(res.rows[0].metadata?.supplier_secret_note).toBeUndefined();
    });
  });

  describe('5. Suppliers Directory Access & Ownership (WARNING)', () => {
    it('Fornecedor A sees only their own supplier record on base table', async () => {
      await asUser(FORNECEDOR_A_UID);
      const res = await pg.query<{ id: string; name: string }>('SELECT id, name FROM public.suppliers');
      expect(res.rows.length).toBe(1);
      expect(res.rows[0].id).toBe(SUPPLIER_A_ID);
    });

    it('Public view public_suppliers exposes only non-sensitive fields (id, name, category)', async () => {
      await asUser(null, 'anon');
      const res = await pg.query<any>('SELECT * FROM public.public_suppliers');
      expect(res.rows.length).toBe(2);
      expect(res.rows[0].name).toBe('Fornecedor A LTDA');
      expect(res.rows[0].profile_id).toBeUndefined();
    });
  });

  describe('6. Orders Base Table & Influencer View RLS', () => {
    it('Lojista A sees full order with net_profit and cost for Store A', async () => {
      await asUser(LOJISTA_A_UID);
      const res = await pg.query<{ amount: number; cost: number; net_profit: number }>('SELECT amount, cost, net_profit FROM public.orders');
      expect(res.rows.length).toBe(1);
      expect(Number(res.rows[0].amount)).toBe(79.90);
      expect(Number(res.rows[0].cost)).toBe(39.90);
      expect(Number(res.rows[0].net_profit)).toBe(30.00); // 79.90 - 39.90 - 10.00 shipping
    });

    it('Influencer view strictly omits cost and net_profit columns', async () => {
      await asUser(INFLUENCER_UID);
      const res = await pg.query<any>(`SELECT * FROM public.influencer_orders WHERE influencer_id = '${INFLUENCER_UID}'`);
      expect(res.rows.length).toBe(1);
      expect(Number(res.rows[0].amount)).toBe(79.90);
      expect(res.rows[0].cost).toBeUndefined();
      expect(res.rows[0].net_profit).toBeUndefined();
      expect(res.rows[0].financial_metadata).toBeUndefined();
    });
  });

});
