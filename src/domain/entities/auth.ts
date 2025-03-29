import { User } from "@/domain/entities";

export interface AuthData {
  email: string;
  password: string;
}

export interface AuthResult {
  user: Omit<User, "password">;
  accessToken: string;
}
