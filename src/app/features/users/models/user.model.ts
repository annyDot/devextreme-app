export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  gender: string;
  workplace: string;
  email: string;
  country: string;
  city: string;
  role: string[];
  address?: string;
  notes?: string;
  phone?: string;
  password?: string;
}
