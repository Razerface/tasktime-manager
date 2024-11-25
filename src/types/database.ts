export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          created_at: string;
          isPremium: boolean;
          earnedTime: number;
          allowedCategories: number[];
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          created_at?: string;
          isPremium?: boolean;
          earnedTime?: number;
          allowedCategories?: number[];
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          created_at?: string;
          isPremium?: boolean;
          earnedTime?: number;
          allowedCategories?: number[];
        };
      };
    };
  };
}