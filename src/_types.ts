export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      actions: {
        Row: {
          action_point_cost: number
          approved: boolean
          classification_id: string
          created_at: string
          id: string
          name: string
          type: Database["public"]["Enums"]["action_type"]
        }
        Insert: {
          action_point_cost: number
          approved?: boolean
          classification_id: string
          created_at?: string
          id?: string
          name: string
          type: Database["public"]["Enums"]["action_type"]
        }
        Update: {
          action_point_cost?: number
          approved?: boolean
          classification_id?: string
          created_at?: string
          id?: string
          name?: string
          type?: Database["public"]["Enums"]["action_type"]
        }
      }
      classifications: {
        Row: {
          approved: boolean
          area: number
          autonomous: boolean
          container: boolean
          created_at: string
          icon: string
          id: string
          name: string
        }
        Insert: {
          approved?: boolean
          area: number
          autonomous: boolean
          container: boolean
          created_at?: string
          icon: string
          id?: string
          name: string
        }
        Update: {
          approved?: boolean
          area?: number
          autonomous?: boolean
          container?: boolean
          created_at?: string
          icon?: string
          id?: string
          name?: string
        }
      }
      players: {
        Row: {
          color: number
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          color?: number
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          color?: number
          created_at?: string
          id?: string
          user_id?: string | null
        }
      }
      units: {
        Row: {
          classification_id: string
          created_at: string
          id: string
          owner_id: string | null
          position: unknown
          timestamp: string
        }
        Insert: {
          classification_id: string
          created_at?: string
          id?: string
          owner_id?: string | null
          position: unknown
          timestamp?: string
        }
        Update: {
          classification_id?: string
          created_at?: string
          id?: string
          owner_id?: string | null
          position?: unknown
          timestamp?: string
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
          target_unit_id: string
          operator_unit_id: string
          action_id: string
          direction: Database["public"]["Enums"]["direction"]
        }
        Returns: undefined
      }
      update_timestamp: {
        Args: {
          current: string
          action_points: number
        }
        Returns: string
      }
    }
    Enums: {
      action_type: "move"
      direction: "north" | "east" | "south" | "west"
    }
    CompositeTypes: {
      move_unit_props: {
        unit_id: string
        current_position: unknown
        new_position: unknown
        action_point_cost: number
      }
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
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

