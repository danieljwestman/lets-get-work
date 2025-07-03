export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          opportunity_id: string
          page_url: string
          referrer: string | null
          session_id: string
          theme_id: string | null
          user_agent: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          opportunity_id: string
          page_url: string
          referrer?: string | null
          session_id: string
          theme_id?: string | null
          user_agent: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          opportunity_id?: string
          page_url?: string
          referrer?: string | null
          session_id?: string
          theme_id?: string | null
          user_agent?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_domains: {
        Row: {
          created_at: string
          dns_configured: boolean
          domain: string
          id: string
          is_verified: boolean
          ssl_status: string | null
          target_opportunity_id: string | null
          target_profile_id: string | null
          target_type: string
          updated_at: string
          user_id: string
          verification_token: string | null
        }
        Insert: {
          created_at?: string
          dns_configured?: boolean
          domain: string
          id?: string
          is_verified?: boolean
          ssl_status?: string | null
          target_opportunity_id?: string | null
          target_profile_id?: string | null
          target_type: string
          updated_at?: string
          user_id: string
          verification_token?: string | null
        }
        Update: {
          created_at?: string
          dns_configured?: boolean
          domain?: string
          id?: string
          is_verified?: boolean
          ssl_status?: string | null
          target_opportunity_id?: string | null
          target_profile_id?: string | null
          target_type?: string
          updated_at?: string
          user_id?: string
          verification_token?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          conversation_context: string | null
          created_at: string | null
          email_id: string | null
          email_sent_successfully: boolean | null
          id: string
          inquiry_type: string | null
          ip_address: unknown | null
          message: string
          opportunity_id: string | null
          sender_email: string
          sender_name: string
          source: string
          subject: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          conversation_context?: string | null
          created_at?: string | null
          email_id?: string | null
          email_sent_successfully?: boolean | null
          id?: string
          inquiry_type?: string | null
          ip_address?: unknown | null
          message: string
          opportunity_id?: string | null
          sender_email: string
          sender_name: string
          source: string
          subject?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          conversation_context?: string | null
          created_at?: string | null
          email_id?: string | null
          email_sent_successfully?: boolean | null
          id?: string
          inquiry_type?: string | null
          ip_address?: unknown | null
          message?: string
          opportunity_id?: string | null
          sender_email?: string
          sender_name?: string
          source?: string
          subject?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          metadata: Json | null
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          metadata?: Json | null
          title: string
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          metadata?: Json | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunities: {
        Row: {
          access_passcode: string | null
          company_name: string | null
          contact_person: string | null
          created_at: string | null
          id: string
          intro_video_url_en: string | null
          intro_video_url_sv: string | null
          is_passcode_protected: boolean | null
          name: string
          notes: string | null
          opportunity_id: string
          status: string | null
          target_role: string | null
          theme_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_passcode?: string | null
          company_name?: string | null
          contact_person?: string | null
          created_at?: string | null
          id?: string
          intro_video_url_en?: string | null
          intro_video_url_sv?: string | null
          is_passcode_protected?: boolean | null
          name: string
          notes?: string | null
          opportunity_id: string
          status?: string | null
          target_role?: string | null
          theme_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_passcode?: string | null
          company_name?: string | null
          contact_person?: string | null
          created_at?: string | null
          id?: string
          intro_video_url_en?: string | null
          intro_video_url_sv?: string | null
          is_passcode_protected?: boolean | null
          name?: string
          notes?: string | null
          opportunity_id?: string
          status?: string | null
          target_role?: string | null
          theme_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["theme_id"]
          },
          {
            foreignKeyName: "opportunities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          assistant_name: string | null
          avatar_url: string | null
          birth_date: string | null
          created_at: string
          debug_tools_enabled: boolean | null
          email: string | null
          full_name: string | null
          id: string
          intro_video_url_en: string | null
          intro_video_url_sv: string | null
          notification_preferences: Json | null
          profile_id: string | null
          timezone: string | null
          updated_at: string
        }
        Insert: {
          assistant_name?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string
          debug_tools_enabled?: boolean | null
          email?: string | null
          full_name?: string | null
          id: string
          intro_video_url_en?: string | null
          intro_video_url_sv?: string | null
          notification_preferences?: Json | null
          profile_id?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          assistant_name?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string
          debug_tools_enabled?: boolean | null
          email?: string | null
          full_name?: string | null
          id?: string
          intro_video_url_en?: string | null
          intro_video_url_sv?: string | null
          notification_preferences?: Json | null
          profile_id?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      rate_limit: {
        Row: {
          count: number
          created_at: string
          id: string
          ip_address: unknown
          timestamp: string
        }
        Insert: {
          count?: number
          created_at?: string
          id?: string
          ip_address: unknown
          timestamp?: string
        }
        Update: {
          count?: number
          created_at?: string
          id?: string
          ip_address?: unknown
          timestamp?: string
        }
        Relationships: []
      }
      themes: {
        Row: {
          branding: Json
          browser_title: string | null
          content: Json
          created_at: string | null
          danibot: Json
          id: string
          name: string
          theme_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          branding?: Json
          browser_title?: string | null
          content?: Json
          created_at?: string | null
          danibot?: Json
          id?: string
          name: string
          theme_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          branding?: Json
          browser_title?: string | null
          content?: Json
          created_at?: string | null
          danibot?: Json
          id?: string
          name?: string
          theme_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "themes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      translations: {
        Row: {
          created_at: string
          draft_value: string | null
          id: string
          language: string
          published_value: string
          theme_id: string
          translation_key: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          draft_value?: string | null
          id?: string
          language: string
          published_value: string
          theme_id: string
          translation_key: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          draft_value?: string | null
          id?: string
          language?: string
          published_value?: string
          theme_id?: string
          translation_key?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "translations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      analytics_summary: {
        Row: {
          date: string | null
          event_count: number | null
          event_type: string | null
          opportunity_id: string | null
          unique_sessions: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      message_analytics: {
        Row: {
          date: string | null
          inquiry_type: string | null
          message_count: number | null
          source: string | null
          successful_sends: number | null
          unique_senders: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      cleanup_old_rate_limits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_system_notification: {
        Args: {
          target_user_id: string
          notification_title: string
          notification_message: string
          notification_type?: string
          notification_metadata?: Json
        }
        Returns: string
      }
      get_public_opportunity: {
        Args: { subdomain_param: string }
        Returns: {
          opportunity_id: string
          name: string
          subdomain: string
          theme_id: string
          company_name: string
          target_role: string
          status: string
        }[]
      }
      get_public_opportunity_by_profile: {
        Args: { profile_id_param: string; opportunity_id_param: string }
        Returns: {
          id: string
          opportunity_id: string
          name: string
          theme_id: string
          company_name: string
          target_role: string
          status: string
          user_id: string
          is_passcode_protected: boolean
          access_passcode: string
          intro_video_url_en: string
          intro_video_url_sv: string
        }[]
      }
      get_public_opportunity_with_id: {
        Args: { subdomain_param: string }
        Returns: {
          id: string
          opportunity_id: string
          name: string
          theme_id: string
          company_name: string
          target_role: string
          status: string
          user_id: string
          is_passcode_protected: boolean
          access_passcode: string
          intro_video_url_en: string
          intro_video_url_sv: string
        }[]
      }
      get_public_profile_by_profile_id: {
        Args: { profile_id_param: string }
        Returns: {
          id: string
          profile_id: string
          full_name: string
        }[]
      }
      get_public_profile_name: {
        Args: { user_id_param: string }
        Returns: {
          full_name: string
        }[]
      }
      get_public_profile_videos: {
        Args: { user_id_param: string }
        Returns: {
          intro_video_url_en: string
          intro_video_url_sv: string
          full_name: string
        }[]
      }
      get_public_theme: {
        Args: { theme_id_param: string }
        Returns: {
          theme_id: string
          name: string
          browser_title: string
          branding: Json
          content: Json
          danibot: Json
        }[]
      }
      get_public_translations: {
        Args: { theme_id_param: string; language_param: string }
        Returns: {
          translation_key: string
          published_value: string
        }[]
      }
      get_user_from_opportunity: {
        Args: { opp_subdomain: string }
        Returns: string
      }
      get_user_from_opportunity_secure: {
        Args: { opp_id: string }
        Returns: string
      }
      get_user_from_theme: {
        Args: { theme_id_param: string }
        Returns: string
      }
      get_user_from_theme_secure: {
        Args: { theme_id_param: string }
        Returns: string
      }
      resolve_custom_domain: {
        Args: { domain_param: string }
        Returns: {
          user_id: string
          target_type: string
          target_profile_id: string
          target_opportunity_id: string
          is_verified: boolean
        }[]
      }
      verify_opportunity_passcode: {
        Args: {
          profile_id_param: string
          opportunity_id_param: string
          passcode_param: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
