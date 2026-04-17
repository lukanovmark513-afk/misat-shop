export interface User {
  id: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: 'user' | 'admin' | 'manager';
  is_active: boolean;
  created_at: Date;
}