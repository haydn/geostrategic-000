export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      actions: {
        Row: {
          id: string
          type: Database["public"]["Enums"]["action_type"]
          name: string
          action_point_cost: number
          approved: boolean
          created_at: string
        }
        Insert: {
          id?: string
          type: Database["public"]["Enums"]["action_type"]
          name: string
          action_point_cost: number
          approved?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          type?: Database["public"]["Enums"]["action_type"]
          name?: string
          action_point_cost?: number
          approved?: boolean
          created_at?: string
        }
      }
      classification_actions: {
        Row: {
          id: string
          classification_id: string
          action_id: string
        }
        Insert: {
          id?: string
          classification_id: string
          action_id: string
        }
        Update: {
          id?: string
          classification_id?: string
          action_id?: string
        }
      }
      classifications: {
        Row: {
          id: string
          name: string
          area: number
          icon: string
          approved: boolean
          autonomous: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          area: number
          icon: string
          approved?: boolean
          autonomous: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          area?: number
          icon?: string
          approved?: boolean
          autonomous?: boolean
          created_at?: string
        }
      }
      players: {
        Row: {
          id: string
          user_id: string | null
          color: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          color?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          color?: number
          created_at?: string
        }
      }
      units: {
        Row: {
          id: string
          classification_id: string
          owner_id: string | null
          position: unknown
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          classification_id: string
          owner_id?: string | null
          position: unknown
          timestamp?: string
          created_at?: string
        }
        Update: {
          id?: string
          classification_id?: string
          owner_id?: string | null
          position?: unknown
          timestamp?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      join_game: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      move_unit: {
        Args: {
          unit_id: string
          action_id: string
          direction: Database["public"]["Enums"]["direction"]
        }
        Returns: undefined
      }
      update_timestamp: {
        Args: { current: string; action_points: number }
        Returns: string
      }
    }
    Enums: {
      action_type: "move"
      direction: "north" | "east" | "south" | "west"
    }
  }
}

