export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      commissions: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          order_id: string
          profile_id: string
          status: string
          type: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          order_id: string
          profile_id: string
          status?: string
          type: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          order_id?: string
          profile_id?: string
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "commissions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string | null
          store_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name: string
          phone?: string | null
          store_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          store_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          order_id: string | null
          store_id: string
          type: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          order_id?: string | null
          store_id: string
          type: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          order_id?: string | null
          store_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_events: {
        Row: {
          created_at: string | null
          customer_id: string
          event_type: string
          id: string
          metadata: Json | null
          store_id: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          event_type: string
          id?: string
          metadata?: Json | null
          store_id?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          store_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketing_events_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketing_events_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      master_products: {
        Row: {
          base_price_pub: number
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean
          metadata: Json | null
          name: string
          sku: string
          status: string
          supplier_cost: number
          supplier_id: string | null
          updated_at: string | null
        }
        Insert: {
          base_price_pub?: number
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          metadata?: Json | null
          name: string
          sku: string
          status?: string
          supplier_cost?: number
          supplier_id?: string | null
          updated_at?: string | null
        }
        Update: {
          base_price_pub?: number
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          metadata?: Json | null
          name?: string
          sku?: string
          status?: string
          supplier_cost?: number
          supplier_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "master_products_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      order_tracking: {
        Row: {
          created_at: string | null
          id: string
          message: string | null
          metadata: Json | null
          order_id: string
          status: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
          metadata?: Json | null
          order_id: string
          status: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
          metadata?: Json | null
          order_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_tracking_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          affiliate_id: string | null
          amount: number
          cost: number
          created_at: string | null
          customer_id: string
          discount: number
          external_id: string | null
          financial_metadata: Json | null
          fulfillment_status: string | null
          id: string
          influencer_id: string | null
          master_product_id: string | null
          net_profit: number | null
          payment_method: string | null
          shipping: number
          status: string
          store_id: string
          tax: number
          tracking_code: string | null
        }
        Insert: {
          affiliate_id?: string | null
          amount: number
          cost: number
          created_at?: string | null
          customer_id: string
          discount?: number
          external_id?: string | null
          financial_metadata?: Json | null
          fulfillment_status?: string | null
          id?: string
          influencer_id?: string | null
          master_product_id?: string | null
          net_profit?: number | null
          payment_method?: string | null
          shipping?: number
          status?: string
          store_id: string
          tax?: number
          tracking_code?: string | null
        }
        Update: {
          affiliate_id?: string | null
          amount?: number
          cost?: number
          created_at?: string | null
          customer_id?: string
          discount?: number
          external_id?: string | null
          financial_metadata?: Json | null
          fulfillment_status?: string | null
          id?: string
          influencer_id?: string | null
          master_product_id?: string | null
          net_profit?: number | null
          payment_method?: string | null
          shipping?: number
          status?: string
          store_id?: string
          tax?: number
          tracking_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_master_product_id_fkey"
            columns: ["master_product_id"]
            isOneToOne: false
            referencedRelation: "master_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          cost: number
          created_at: string | null
          custom_description: string | null
          custom_image_url: string | null
          custom_name: string | null
          id: string
          image_url: string | null
          master_product_id: string | null
          name: string
          price: number
          profit_margin: number | null
          status: string | null
          stock: number
          store_id: string | null
          supplier_id: string | null
          updated_at: string | null
        }
        Insert: {
          cost: number
          created_at?: string | null
          custom_description?: string | null
          custom_image_url?: string | null
          custom_name?: string | null
          id?: string
          image_url?: string | null
          master_product_id?: string | null
          name: string
          price: number
          profit_margin?: number | null
          status?: string | null
          stock?: number
          store_id?: string | null
          supplier_id?: string | null
          updated_at?: string | null
        }
        Update: {
          cost?: number
          created_at?: string | null
          custom_description?: string | null
          custom_image_url?: string | null
          custom_name?: string | null
          id?: string
          image_url?: string | null
          master_product_id?: string | null
          name?: string
          price?: number
          profit_margin?: number | null
          status?: string | null
          stock?: number
          store_id?: string | null
          supplier_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_master_product_id_fkey"
            columns: ["master_product_id"]
            isOneToOne: false
            referencedRelation: "master_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          name: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      stores: {
        Row: {
          created_at: string | null
          id: string
          name: string
          owner_id: string
          status: string
          subdomain: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          owner_id: string
          status?: string
          subdomain: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          owner_id?: string
          status?: string
          subdomain?: string
        }
        Relationships: [
          {
            foreignKeyName: "stores_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          reference_id: string | null
          reference_type: string | null
          type: string
          wallet_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          type: string
          wallet_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          type?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance: number
          currency: string
          id: string
          profile_id: string
          updated_at: string | null
        }
        Insert: {
          balance?: number
          currency?: string
          id?: string
          profile_id: string
          updated_at?: string | null
        }
        Update: {
          balance?: number
          currency?: string
          id?: string
          profile_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallets_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      public_store_products: {
        Row: {
          id: string
          store_id: string | null
          master_product_id: string | null
          name: string
          description: string | null
          price: number
          stock: number
          image_url: string | null
          status: string | null
          created_at: string | null
          updated_at: string | null
        }
        Relationships: []
      }
      available_master_products: {
        Row: {
          id: string
          sku: string
          name: string
          description: string | null
          image_url: string | null
          category: string | null
          base_price_pub: number
          status: string
          is_available: boolean
          metadata: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "MASTER" | "LOJISTA" | "FORNECEDOR" | "AFILIADO" | "INFLUENCER"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["MASTER", "LOJISTA", "FORNECEDOR", "AFILIADO", "INFLUENCER"],
    },
  },
} as const
