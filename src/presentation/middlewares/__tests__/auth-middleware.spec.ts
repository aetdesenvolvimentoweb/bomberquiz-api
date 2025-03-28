import { InvalidParamError } from "@/domain/errors";
import { JwtPayload, JwtProvider } from "@/domain/providers";
import { AuthMiddleware } from "@/presentation/middlewares";
import { HttpResponse, Middleware } from "@/presentation/protocols";

interface SutResponse {
  sut: Middleware;
  jwtProvider: JwtProvider;
}

const makeSut = (): SutResponse => {
  const jwtProvider = jest.mocked<JwtProvider>({
    sign: jest.fn(),
    verify: jest.fn(),
  });

  const sut = new AuthMiddleware({
    jwtProvider,
  });

  return { sut, jwtProvider };
};

describe("AuthMiddleware", () => {
  it("should return a 400 if no token is provided", async () => {
    const { sut } = makeSut();

    const httpRequest = {
      headers: {},
    };

    const httpResponse: HttpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.errorMessage).toBe(
      "Parâmetro obrigatório não informado: token de autenticação",
    );
  });

  it("should return a 400 if token is invalid", async () => {
    const { sut } = makeSut();

    const httpRequest = {
      headers: {
        authorization: "invalid_token",
      },
    };

    const httpResponse: HttpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.errorMessage).toBe(
      "Parâmetro inválido: Token. Formato inválido.",
    );
  });

  it("should return 401 if token verification fails", async () => {
    const { sut, jwtProvider } = makeSut();
    jest.spyOn(jwtProvider, "verify").mockImplementationOnce(() => {
      throw new InvalidParamError("token", "expirado ou inválido");
    });

    const httpRequest = {
      headers: {
        authorization: "Bearer invalid_token",
      },
    };

    const httpResponse: HttpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.success).toBeFalsy();
    expect(httpResponse.body.errorMessage).toContain(
      "Parâmetro inválido: Token. Expirado ou inválido.",
    );
  });

  it("should return next if token is valid", async () => {
    const { sut, jwtProvider } = makeSut();
    jest.spyOn(jwtProvider, "verify").mockResolvedValue(
      Promise.resolve({
        userId: "any_id",
        role: "cliente",
      } as JwtPayload),
    );

    const httpRequest = {
      headers: {
        authorization: "Bearer valid_token",
      },
    };

    const httpResponse: HttpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body.success).toBeTruthy();
  });
});
