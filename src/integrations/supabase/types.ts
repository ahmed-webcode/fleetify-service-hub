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
      analytics: {
        Row: {
          id: string
          metrics: Json
          platform: string
          timestamp: string | null
          user_id: string | null
          video_id: string | null
        }
        Insert: {
          id?: string
          metrics: Json
          platform: string
          timestamp?: string | null
          user_id?: string | null
          video_id?: string | null
        }
        Update: {
          id?: string
          metrics?: Json
          platform?: string
          timestamp?: string | null
          user_id?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          created_at: string | null
          driver_license: string
          id: string
          staff_id: string | null
          status: string | null
          university_id: string
          updated_at: string | null
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string | null
          driver_license: string
          id?: string
          staff_id?: string | null
          status?: string | null
          university_id: string
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string | null
          driver_license?: string
          id?: string
          staff_id?: string | null
          status?: string | null
          university_id?: string
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drivers_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drivers_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      fuel_records: {
        Row: {
          amount: number
          cost: number
          created_at: string | null
          driver_id: string | null
          fuel_type: string
          id: string
          odometer_reading: number | null
          station_name: string | null
          updated_at: string | null
          vehicle_id: string | null
        }
        Insert: {
          amount: number
          cost: number
          created_at?: string | null
          driver_id?: string | null
          fuel_type: string
          id?: string
          odometer_reading?: number | null
          station_name?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Update: {
          amount?: number
          cost?: number
          created_at?: string | null
          driver_id?: string | null
          fuel_type?: string
          id?: string
          odometer_reading?: number | null
          station_name?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fuel_records_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fuel_records_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          parent_location_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          parent_location_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          parent_location_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_parent_location_id_fkey"
            columns: ["parent_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_records: {
        Row: {
          cost: number | null
          created_at: string | null
          description: string | null
          id: string
          next_service_date: string | null
          odometer_reading: number | null
          service_date: string
          service_provider: string | null
          status: string | null
          type: string
          updated_at: string | null
          vehicle_id: string | null
        }
        Insert: {
          cost?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          next_service_date?: string | null
          odometer_reading?: number | null
          service_date: string
          service_provider?: string | null
          status?: string | null
          type: string
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Update: {
          cost?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          next_service_date?: string | null
          odometer_reading?: number | null
          service_date?: string
          service_provider?: string | null
          status?: string | null
          type?: string
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_records_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      ml_insights: {
        Row: {
          confidence: number | null
          created_at: string | null
          data: Json
          id: string
          insight_type: string
          theme_id: string | null
          user_id: string | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string | null
          data: Json
          id?: string
          insight_type: string
          theme_id?: string | null
          user_id?: string | null
        }
        Update: {
          confidence?: number | null
          created_at?: string | null
          data?: Json
          id?: string
          insight_type?: string
          theme_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ml_insights_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
        ]
      }
      positions: {
        Row: {
          created_at: string | null
          description: string | null
          fuel_quota: number | null
          id: string
          location_id: string | null
          name: string
          updated_at: string | null
          vehicle_eligibility: boolean | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          fuel_quota?: number | null
          id?: string
          location_id?: string | null
          name: string
          updated_at?: string | null
          vehicle_eligibility?: boolean | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          fuel_quota?: number | null
          id?: string
          location_id?: string | null
          name?: string
          updated_at?: string | null
          vehicle_eligibility?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "positions_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string | null
          generated_by: string | null
          id: string
          parameters: Json | null
          report_data: Json | null
          type: string
        }
        Insert: {
          created_at?: string | null
          generated_by?: string | null
          id?: string
          parameters?: Json | null
          report_data?: Json | null
          type: string
        }
        Update: {
          created_at?: string | null
          generated_by?: string | null
          id?: string
          parameters?: Json | null
          report_data?: Json | null
          type?: string
        }
        Relationships: []
      }
      schedules: {
        Row: {
          created_at: string | null
          id: string
          platform: string
          scheduled_time: string
          status: string | null
          updated_at: string | null
          user_id: string | null
          video_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          platform: string
          scheduled_time: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          video_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          platform?: string
          scheduled_time?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedules_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      staff: {
        Row: {
          created_at: string | null
          driving_license: string | null
          gender: string | null
          id: string
          name: string
          phone_number: string | null
          position_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          driving_license?: string | null
          gender?: string | null
          id?: string
          name: string
          phone_number?: string | null
          position_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          driving_license?: string | null
          gender?: string | null
          id?: string
          name?: string
          phone_number?: string | null
          position_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
        ]
      }
      themes: {
        Row: {
          content_style: Json | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          target_audience: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content_style?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          target_audience?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content_style?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          target_audience?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      trips: {
        Row: {
          created_at: string | null
          driver_id: string | null
          end_location: string
          end_odometer: number | null
          end_time: string | null
          id: string
          purpose: string
          start_location: string
          start_odometer: number | null
          start_time: string
          status: string | null
          updated_at: string | null
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string | null
          driver_id?: string | null
          end_location: string
          end_odometer?: number | null
          end_time?: string | null
          id?: string
          purpose: string
          start_location: string
          start_odometer?: number | null
          start_time: string
          status?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string | null
          driver_id?: string | null
          end_location?: string
          end_odometer?: number | null
          end_time?: string | null
          id?: string
          purpose?: string
          start_location?: string
          start_odometer?: number | null
          start_time?: string
          status?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trips_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          axle_count: number | null
          chassis_number: string | null
          color: string | null
          created_at: string | null
          cylinder_count: number | null
          fuel_consumption: number | null
          fuel_type: string
          horse_power: number | null
          id: string
          is_private: boolean | null
          km_reading: number | null
          location_id: string | null
          made_in: string | null
          model: string | null
          motor_number: string | null
          ownership: string
          plate_number: string
          position_id: string | null
          single_weight: number | null
          status: string | null
          total_weight: number | null
          type: string
          updated_at: string | null
          year: number | null
        }
        Insert: {
          axle_count?: number | null
          chassis_number?: string | null
          color?: string | null
          created_at?: string | null
          cylinder_count?: number | null
          fuel_consumption?: number | null
          fuel_type: string
          horse_power?: number | null
          id?: string
          is_private?: boolean | null
          km_reading?: number | null
          location_id?: string | null
          made_in?: string | null
          model?: string | null
          motor_number?: string | null
          ownership: string
          plate_number: string
          position_id?: string | null
          single_weight?: number | null
          status?: string | null
          total_weight?: number | null
          type: string
          updated_at?: string | null
          year?: number | null
        }
        Update: {
          axle_count?: number | null
          chassis_number?: string | null
          color?: string | null
          created_at?: string | null
          cylinder_count?: number | null
          fuel_consumption?: number | null
          fuel_type?: string
          horse_power?: number | null
          id?: string
          is_private?: boolean | null
          km_reading?: number | null
          location_id?: string | null
          made_in?: string | null
          model?: string | null
          motor_number?: string | null
          ownership?: string
          plate_number?: string
          position_id?: string | null
          single_weight?: number | null
          status?: string | null
          total_weight?: number | null
          type?: string
          updated_at?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          created_at: string | null
          description: string | null
          generation_params: Json | null
          id: string
          metrics: Json | null
          platform: string
          published_at: string | null
          status: string | null
          theme_id: string | null
          title: string
          updated_at: string | null
          url: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          generation_params?: Json | null
          id?: string
          metrics?: Json | null
          platform: string
          published_at?: string | null
          status?: string | null
          theme_id?: string | null
          title: string
          updated_at?: string | null
          url?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          generation_params?: Json | null
          id?: string
          metrics?: Json | null
          platform?: string
          published_at?: string | null
          status?: string | null
          theme_id?: string | null
          title?: string
          updated_at?: string | null
          url?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "videos_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
        ]
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
