import { AuthData, AuthResult } from "@/domain/entities";

export interface AuthenticateUseCase {
  authenticate: (data: AuthData) => Promise<AuthResult>;
}
