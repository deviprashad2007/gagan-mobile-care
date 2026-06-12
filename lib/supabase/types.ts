export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          deleted_at: string | null
          email: string
          id: string
          invited_by: string | null
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          email: string
          id?: string
          invited_by?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          email?: string
          id?: string
          invited_by?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          id: string
          ip_address: unknown
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          content: string
          cover_image_url: string | null
          cover_storage_path: string | null
          created_at: string
          deleted_at: string | null
          excerpt: string | null
          id: string
          published: boolean
          published_at: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          cover_image_url?: string | null
          cover_storage_path?: string | null
          created_at?: string
          deleted_at?: string | null
          excerpt?: string | null
          id?: string
          published?: boolean
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          cover_image_url?: string | null
          cover_storage_path?: string | null
          created_at?: string
          deleted_at?: string | null
          excerpt?: string | null
          id?: string
          published?: boolean
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          booking_ref: string
          brand_id: string | null
          brand_name: string | null
          confirmed_price: number | null
          created_at: string
          customer_id: string | null
          customer_name: string
          customer_phone: string
          deleted_at: string | null
          estimated_price_max: number | null
          estimated_price_min: number | null
          id: string
          issue_ids: string[]
          issue_text: string | null
          model_id: string | null
          model_text: string | null
          notes: string | null
          service_type: string
          source: string
          status: string
          updated_at: string
        }
        Insert: {
          booking_ref: string
          brand_id?: string | null
          brand_name?: string | null
          confirmed_price?: number | null
          created_at?: string
          customer_id?: string | null
          customer_name: string
          customer_phone: string
          deleted_at?: string | null
          estimated_price_max?: number | null
          estimated_price_min?: number | null
          id?: string
          issue_ids: string[]
          issue_text?: string | null
          model_id?: string | null
          model_text?: string | null
          notes?: string | null
          service_type: string
          source?: string
          status?: string
          updated_at?: string
        }
        Update: {
          booking_ref?: string
          brand_id?: string | null
          brand_name?: string | null
          confirmed_price?: number | null
          created_at?: string
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string
          deleted_at?: string | null
          estimated_price_max?: number | null
          estimated_price_min?: number | null
          id?: string
          issue_ids?: string[]
          issue_text?: string | null
          model_id?: string | null
          model_text?: string | null
          notes?: string | null
          service_type?: string
          source?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      brands: {
        Row: {
          category_id: string | null
          created_at: string
          deleted_at: string | null
          glyph: string
          id: string
          logo_storage_path: string | null
          logo_url: string | null
          name: string
          slug: string
          sort_order: number
          tone: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          deleted_at?: string | null
          glyph: string
          id?: string
          logo_storage_path?: string | null
          logo_url?: string | null
          name: string
          slug: string
          sort_order?: number
          tone: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          deleted_at?: string | null
          glyph?: string
          id?: string
          logo_storage_path?: string | null
          logo_url?: string | null
          name?: string
          slug?: string
          sort_order?: number
          tone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "brands_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          deleted_at: string | null
          description: string | null
          icon: string
          id: string
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          icon?: string
          id?: string
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          icon?: string
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          last_visit_at: string | null
          name: string
          notes: string | null
          phone: string
          total_spend: number
          total_visits: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          last_visit_at?: string | null
          name: string
          notes?: string | null
          phone: string
          total_spend?: number
          total_visits?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          last_visit_at?: string | null
          name?: string
          notes?: string | null
          phone?: string
          total_spend?: number
          total_visits?: number
          updated_at?: string
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          caption: string | null
          created_at: string
          deleted_at: string | null
          id: string
          sort_order: number
          storage_path: string
          updated_at: string
          url: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          sort_order?: number
          storage_path: string
          updated_at?: string
          url: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          sort_order?: number
          storage_path?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      issues: {
        Row: {
          created_at: string
          deleted_at: string | null
          description: string | null
          id: string
          is_common: boolean
          name: string
          range_max: number
          range_min: number
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_common?: boolean
          name: string
          range_max: number
          range_min: number
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_common?: boolean
          name?: string
          range_max?: number
          range_min?: number
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          body_snapshot: string | null
          booking_id: string | null
          channel: string
          created_at: string
          deleted_at: string | null
          error: string | null
          id: string
          msg91_request_id: string | null
          recipient_phone: string
          repair_id: string | null
          sent_at: string | null
          status: string
          template_id: string | null
          updated_at: string
        }
        Insert: {
          body_snapshot?: string | null
          booking_id?: string | null
          channel: string
          created_at?: string
          deleted_at?: string | null
          error?: string | null
          id?: string
          msg91_request_id?: string | null
          recipient_phone: string
          repair_id?: string | null
          sent_at?: string | null
          status?: string
          template_id?: string | null
          updated_at?: string
        }
        Update: {
          body_snapshot?: string | null
          booking_id?: string | null
          channel?: string
          created_at?: string
          deleted_at?: string | null
          error?: string | null
          id?: string
          msg91_request_id?: string | null
          recipient_phone?: string
          repair_id?: string | null
          sent_at?: string | null
          status?: string
          template_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_repair_id_fkey"
            columns: ["repair_id"]
            isOneToOne: false
            referencedRelation: "repairs"
            referencedColumns: ["id"]
          },
        ]
      }
      models: {
        Row: {
          brand_id: string
          created_at: string
          deleted_at: string | null
          id: string
          name: string
          release_year: number | null
          series: string | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          brand_id: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          name: string
          release_year?: number | null
          series?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          brand_id?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          name?: string
          release_year?: number | null
          series?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "models_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      prices: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          issue_id: string
          model_id: string
          notes: string | null
          price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          issue_id: string
          model_id: string
          notes?: string | null
          price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          issue_id?: string
          model_id?: string
          notes?: string | null
          price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "prices_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prices_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      repairs: {
        Row: {
          amount: number | null
          booking_id: string | null
          completed_at: string | null
          created_at: string
          customer_id: string | null
          customer_name: string
          customer_phone: string
          deleted_at: string | null
          eta_at: string | null
          id: string
          intake_at: string
          issue_text: string
          model_id: string | null
          model_text: string | null
          notes: string | null
          repair_ref: string
          service_type: string
          status: string
          updated_at: string
        }
        Insert: {
          amount?: number | null
          booking_id?: string | null
          completed_at?: string | null
          created_at?: string
          customer_id?: string | null
          customer_name: string
          customer_phone: string
          deleted_at?: string | null
          eta_at?: string | null
          id?: string
          intake_at?: string
          issue_text: string
          model_id?: string | null
          model_text?: string | null
          notes?: string | null
          repair_ref: string
          service_type?: string
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number | null
          booking_id?: string | null
          completed_at?: string | null
          created_at?: string
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string
          deleted_at?: string | null
          eta_at?: string | null
          id?: string
          intake_at?: string
          issue_text?: string
          model_id?: string | null
          model_text?: string | null
          notes?: string | null
          repair_ref?: string
          service_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "repairs_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repairs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repairs_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          created_at: string
          customer_name: string
          customer_phone: string
          deleted_at: string | null
          discount: number
          id: string
          invoice_number: string
          items: Json
          model_text: string | null
          notes: string | null
          payment_method: string
          repair_id: string | null
          subtotal: number
          total: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_name: string
          customer_phone: string
          deleted_at?: string | null
          discount?: number
          id?: string
          invoice_number: string
          items: Json
          model_text?: string | null
          notes?: string | null
          payment_method?: string
          repair_id?: string | null
          subtotal: number
          total: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_name?: string
          customer_phone?: string
          deleted_at?: string | null
          discount?: number
          id?: string
          invoice_number?: string
          items?: Json
          model_text?: string | null
          notes?: string | null
          payment_method?: string
          repair_id?: string | null
          subtotal?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_repair_id_fkey"
            columns: ["repair_id"]
            isOneToOne: false
            referencedRelation: "repairs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_booking_ref: { Args: never; Returns: string }
      generate_invoice_ref: { Args: never; Returns: string }
      generate_repair_ref: { Args: never; Returns: string }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
