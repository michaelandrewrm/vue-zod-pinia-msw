export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  phone?: string;
  company?: string;
  department?: string;
  location?: string;
  bio?: string;
  joinDate?: string;
  status?: 'active' | 'inactive' | 'pending';
}
