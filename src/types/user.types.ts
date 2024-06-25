export interface User {
  id: string;
  name: string;
  surname: string;
  username: string;
  email: string;
  password: string;
  profile_image: 0 | 1;
  phone: string;
  google_registred: 0 | 1;
  credit: number;
  subscription_type: string;
  role: string;
  is_active: 0 | 1;
  created_at: Date;
  updated_at: Date;
}