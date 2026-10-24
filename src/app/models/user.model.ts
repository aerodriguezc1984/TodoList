export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthSession {
  user: Omit<User, 'password'>;
  token: string;
  loginAt: string;
}
