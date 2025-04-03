import { makeAuthenticateService } from "@/infra/factories";
import { AuthenticateController } from "@/presentation/controllers";
import { Controller } from "@/presentation/protocols";

export const makeAuthenticateController = (): Controller => {
  const authenticateService = makeAuthenticateService();

  return new AuthenticateController({
    authenticateService,
  });
};
