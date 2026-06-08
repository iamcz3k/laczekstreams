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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_broadcast_responses: {
        Row: {
          broadcast_id: string
          created_at: string
          dismissed: boolean
          id: string
          name: string | null
          rating: number | null
          response_text: string | null
          session_key: string
        }
        Insert: {
          broadcast_id: string
          created_at?: string
          dismissed?: boolean
          id?: string
          name?: string | null
          rating?: number | null
          response_text?: string | null
          session_key: string
        }
        Update: {
          broadcast_id?: string
          created_at?: string
          dismissed?: boolean
          id?: string
          name?: string | null
          rating?: number | null
          response_text?: string | null
          session_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_broadcast_responses_broadcast_id_fkey"
            columns: ["broadcast_id"]
            isOneToOne: false
            referencedRelation: "admin_broadcasts"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_broadcasts: {
        Row: {
          active: boolean
          created_at: string
          id: string
          kind: string
          message: string
          target_name: string | null
          target_session_key: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          kind: string
          message: string
          target_name?: string | null
          target_session_key?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          kind?: string
          message?: string
          target_name?: string | null
          target_session_key?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      admin_changelog: {
        Row: {
          active: boolean
          created_at: string
          detail: string | null
          id: string
          image_path: string | null
          image_url: string | null
          kind: string
          published_at: string
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          detail?: string | null
          id?: string
          image_path?: string | null
          image_url?: string | null
          kind?: string
          published_at?: string
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          detail?: string | null
          id?: string
          image_path?: string | null
          image_url?: string | null
          kind?: string
          published_at?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      downloadable_titles: {
        Row: {
          created_at: string
          description: string | null
          duration_seconds: number | null
          episode: number | null
          id: string
          kind: string
          mime: string
          poster_url: string | null
          season: number | null
          size_bytes: number
          storage_path: string
          title: string
          tmdb_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          episode?: number | null
          id?: string
          kind: string
          mime?: string
          poster_url?: string | null
          season?: number | null
          size_bytes?: number
          storage_path: string
          title: string
          tmdb_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          episode?: number | null
          id?: string
          kind?: string
          mime?: string
          poster_url?: string | null
          season?: number | null
          size_bytes?: number
          storage_path?: string
          title?: string
          tmdb_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      feature_flags: {
        Row: {
          description: string | null
          enabled: boolean
          key: string
          updated_at: string
        }
        Insert: {
          description?: string | null
          enabled?: boolean
          key: string
          updated_at?: string
        }
        Update: {
          description?: string | null
          enabled?: boolean
          key?: string
          updated_at?: string
        }
        Relationships: []
      }
      featured_events: {
        Row: {
          active: boolean
          away_flag: string | null
          away_team: string | null
          created_at: string
          ends_at: string | null
          home_flag: string | null
          home_team: string | null
          id: string
          image_url: string | null
          kind: string
          link_url: string
          priority: number
          sport: string | null
          starts_at: string | null
          subtitle: string | null
          timer_mode: string
          timer_target_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          away_flag?: string | null
          away_team?: string | null
          created_at?: string
          ends_at?: string | null
          home_flag?: string | null
          home_team?: string | null
          id?: string
          image_url?: string | null
          kind?: string
          link_url: string
          priority?: number
          sport?: string | null
          starts_at?: string | null
          subtitle?: string | null
          timer_mode?: string
          timer_target_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          away_flag?: string | null
          away_team?: string | null
          created_at?: string
          ends_at?: string | null
          home_flag?: string | null
          home_team?: string | null
          id?: string
          image_url?: string | null
          kind?: string
          link_url?: string
          priority?: number
          sport?: string | null
          starts_at?: string | null
          subtitle?: string | null
          timer_mode?: string
          timer_target_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      match_chats: {
        Row: {
          created_at: string
          id: string
          match_id: string
          message: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          match_id: string
          message: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          match_id?: string
          message?: string
          name?: string
        }
        Relationships: []
      }
      user_downloads: {
        Row: {
          bytes_downloaded: number
          completed_at: string | null
          device_label: string | null
          id: string
          started_at: string
          status: string
          title_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          bytes_downloaded?: number
          completed_at?: string | null
          device_label?: string | null
          id?: string
          started_at?: string
          status?: string
          title_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          bytes_downloaded?: number
          completed_at?: string | null
          device_label?: string | null
          id?: string
          started_at?: string
          status?: string
          title_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_downloads_title_id_fkey"
            columns: ["title_id"]
            isOneToOne: false
            referencedRelation: "downloadable_titles"
            referencedColumns: ["id"]
          },
        ]
      }
      visitor_sessions: {
        Row: {
          city: string | null
          country: string | null
          current_path: string | null
          device: string | null
          duration_seconds: number
          id: string
          ip: string | null
          last_seen_at: string
          name: string | null
          page_views: number
          path_log: Json
          searches: Json
          session_key: string
          started_at: string
          user_agent: string | null
          watched: Json
        }
        Insert: {
          city?: string | null
          country?: string | null
          current_path?: string | null
          device?: string | null
          duration_seconds?: number
          id?: string
          ip?: string | null
          last_seen_at?: string
          name?: string | null
          page_views?: number
          path_log?: Json
          searches?: Json
          session_key: string
          started_at?: string
          user_agent?: string | null
          watched?: Json
        }
        Update: {
          city?: string | null
          country?: string | null
          current_path?: string | null
          device?: string | null
          duration_seconds?: number
          id?: string
          ip?: string | null
          last_seen_at?: string
          name?: string | null
          page_views?: number
          path_log?: Json
          searches?: Json
          session_key?: string
          started_at?: string
          user_agent?: string | null
          watched?: Json
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
