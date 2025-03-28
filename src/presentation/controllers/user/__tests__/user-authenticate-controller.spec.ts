import { InMemoryUserRepository } from "@/data/repositories";
import { UserAuthenticateService } from "@/data/services";
import { UserCreateData } from "@/domain/entities";
import { InvalidCredentialsError, MissingParamError } from "@/domain/errors";
import { HashProvider, JwtProvider, LoggerProvider } from "@/domain/providers";
import { UserRepository } from "@/domain/repositories";
import { UserAuthenticationResult } from "@/domain/usecases";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "@/presentation/protocols";

import { UserAuthenticateController } from "../user-authenticate-controller";

// Tipos e interfaces
interface SutResponse {
  sut: Controller;
  userRepository: UserRepository;
  hashProvider: HashProvider;
  jwtProvider: JwtProvider;
}

// Factory para criar o sistema sob teste (SUT)
const makeSut = (): SutResponse => {
  // Mocks das dependências
  const hashProvider = jest.mocked<HashProvider>({
    compare: jest.fn().mockResolvedValue(true),
    hash: jest.fn(),
    withOptions: jest.fn(),
  });

  const jwtProvider = jest.mocked<JwtProvider>({
    sign: jest.fn().mockResolvedValue("any_token"),
    verify: jest.fn().mockResolvedValue({ userId: "any_user_id" }),
  });

  const loggerProvider = jest.mocked<LoggerProvider>({
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
    trace: jest.fn(),
    withContext: jest.fn(),
  });

  const userRepository = new InMemoryUserRepository();

  // Criação do serviço com as dependências mockadas
  const userAuthenticateService = new UserAuthenticateService({
    hashProvider,
    jwtProvider,
    loggerProvider,
    userRepository,
  });

  // Criação do controlador (SUT)
  const sut = new UserAuthenticateController({
    userAuthenticateService,
  });

  return { sut, userRepository, hashProvider, jwtProvider };
};

describe("UserAuthenticateController", () => {
  it("should return 400 if no body is provided", async () => {
    // Arrange
    const { sut } = makeSut();
    const httpRequest: HttpRequest = {
      body: undefined,
    };

    // Act
    const httpResponse = await sut.handle(httpRequest);

    // Assert
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.errorMessage).toEqual(
      new MissingParamError("corpo da requisição não informado").message,
    );
  });

  it("should return 401 if no email is provided", async () => {
    // Arrange
    const { sut } = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        password: "any_password",
      },
    };

    // Act
    const httpResponse = await sut.handle(httpRequest);

    // Assert
    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body.errorMessage).toEqual(
      new InvalidCredentialsError().message,
    );
  });

  it("should return 401 if no password is provided", async () => {
    // Arrange
    const { sut } = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        email: "any_email@mail.com",
      },
    };

    // Act
    const httpResponse = await sut.handle(httpRequest);

    // Assert
    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body.errorMessage).toEqual(
      new InvalidCredentialsError().message,
    );
  });

  it("should return 401 if password does not match", async () => {
    // Arrange
    const { sut, userRepository, hashProvider } = makeSut();

    // Configurando o mock para simular senha incorreta
    jest.mocked(hashProvider).compare.mockResolvedValueOnce(false);

    // Criando um usuário no repositório
    const userCreateData: UserCreateData = {
      name: "any_name",
      email: "any_email@mail.com",
      phone: "any_phone",
      birthdate: new Date(),
      password: "any_password",
    };
    await userRepository.create(userCreateData);

    const httpRequest: HttpRequest = {
      body: {
        email: userCreateData.email,
        password: "any_password_invalid",
      },
    };

    // Act
    const httpResponse = await sut.handle(httpRequest);

    // Assert
    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body.errorMessage).toEqual(
      new InvalidCredentialsError().message,
    );
  });

  it("should return 200 if user authenticates successfully", async () => {
    // Arrange
    const { sut, userRepository } = makeSut();

    // Criando um usuário no repositório
    const userCreateData: UserCreateData = {
      name: "any_name",
      email: "any_email@mail.com",
      phone: "any_phone",
      birthdate: new Date(),
      password: "any_password",
    };
    await userRepository.create(userCreateData);

    const httpRequest: HttpRequest = {
      body: {
        email: userCreateData.email,
        password: userCreateData.password,
      },
    };

    // Act
    const httpResponse: HttpResponse<UserAuthenticationResult> =
      await sut.handle(httpRequest);

    // Assert
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body.data?.accessToken).toBeDefined();
    expect(httpResponse.body.data?.user).toBeDefined();
  });
});
