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
      adoption_listings: {
        Row: {
          age: string | null
          animal_name: string
          breed: string | null
          clinic_address: string | null
          clinic_city: string | null
          clinic_name: string | null
          clinic_phone: string | null
          created_at: string
          description: string | null
          id: string
          photo_url: string | null
          species: string
          status: string
          updated_at: string
          vet_id: string
        }
        Insert: {
          age?: string | null
          animal_name: string
          breed?: string | null
          clinic_address?: string | null
          clinic_city?: string | null
          clinic_name?: string | null
          clinic_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          photo_url?: string | null
          species: string
          status?: string
          updated_at?: string
          vet_id: string
        }
        Update: {
          age?: string | null
          animal_name?: string
          breed?: string | null
          clinic_address?: string | null
          clinic_city?: string | null
          clinic_name?: string | null
          clinic_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          photo_url?: string | null
          species?: string
          status?: string
          updated_at?: string
          vet_id?: string
        }
        Relationships: []
      }
      animals: {
        Row: {
          birth_date: string | null
          breed: string | null
          created_at: string
          id: string
          insured: boolean | null
          name: string
          owner_id: string
          sex: string | null
          species: string
          sterilized: boolean | null
        }
        Insert: {
          birth_date?: string | null
          breed?: string | null
          created_at?: string
          id?: string
          insured?: boolean | null
          name: string
          owner_id: string
          sex?: string | null
          species: string
          sterilized?: boolean | null
        }
        Update: {
          birth_date?: string | null
          breed?: string | null
          created_at?: string
          id?: string
          insured?: boolean | null
          name?: string
          owner_id?: string
          sex?: string | null
          species?: string
          sterilized?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "animals_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          animal_id: string | null
          appointment_date: string
          appointment_time: string
          clinic_address: string | null
          clinic_city: string | null
          clinic_id: string
          clinic_name: string
          clinic_phone: string | null
          created_at: string
          id: string
          notes: string | null
          owner_id: string
          reason: string | null
          status: string
          vet_name: string | null
        }
        Insert: {
          animal_id?: string | null
          appointment_date: string
          appointment_time: string
          clinic_address?: string | null
          clinic_city?: string | null
          clinic_id: string
          clinic_name: string
          clinic_phone?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          owner_id: string
          reason?: string | null
          status?: string
          vet_name?: string | null
        }
        Update: {
          animal_id?: string | null
          appointment_date?: string
          appointment_time?: string
          clinic_address?: string | null
          clinic_city?: string | null
          clinic_id?: string
          clinic_name?: string
          clinic_phone?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          owner_id?: string
          reason?: string | null
          status?: string
          vet_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          link: string | null
          read: boolean
          related_appointment_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean
          related_appointment_id?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean
          related_appointment_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          city: string | null
          clinic_name: string | null
          created_at: string
          email: string | null
          emergency_24_7: boolean | null
          full_name: string | null
          home_visit: boolean | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          clinic_name?: string | null
          created_at?: string
          email?: string | null
          emergency_24_7?: boolean | null
          full_name?: string | null
          home_visit?: boolean | null
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          clinic_name?: string | null
          created_at?: string
          email?: string | null
          emergency_24_7?: boolean | null
          full_name?: string | null
          home_visit?: boolean | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
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
      user_role: "client" | "veto"
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
      user_role: ["client", "veto"],
    },
  },
} as const
