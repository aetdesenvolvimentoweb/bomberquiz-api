import { InvalidParamError } from "@/domain/errors";
import {
  HashProvider,
  JwtPayload,
  JwtProvider,
  LoggerProvider,
} from "@/domain/providers";
import { UserRepository } from "@/domain/repositories";
import {
  UserAuthenticateUseCase,
  UserAuthenticationData,
  UserAuthenticationResult,
} from "@/domain/usecases";

/**
 * @interface UserAuthenticateServiceProps
 * @description Interface que define as dependências necessárias para o serviço de autenticação de usuários.
 */
interface UserAuthenticateServiceProps {
  /** Repositório para operações relacionadas a usuários */
  userRepository: UserRepository;
  /** Provedor para operações de hash e comparação de senhas */
  hashProvider: HashProvider;
  /** Provedor para operações com tokens JWT */
  jwtProvider: JwtProvider;
  /** Provedor para operações de logging */
  loggerProvider: LoggerProvider;
}

/**
 * @class UserAuthenticateService
 * @implements {UserAuthenticateUseCase}
 * @description Serviço responsável pela autenticação de usuários no sistema.
 * Verifica credenciais, gera tokens JWT e gerencia o fluxo de autenticação.
 */
export class UserAuthenticateService implements UserAuthenticateUseCase {
  /**
   * @constructor
   * @param {UserAuthenticateServiceProps} props - Dependências necessárias para o serviço.
   */
  constructor(private readonly props: UserAuthenticateServiceProps) {}

  /**
   * @method authenticate
   * @description Autentica um usuário com base em seu email e senha,
   * retornando os dados do usuário e um token de acesso em caso de sucesso.
   *
   * @param {UserAuthenticationData} data - Dados de autenticação (email e senha).
   * @returns {Promise<UserAuthenticationResult>} Objeto contendo dados do usuário (sem senha) e token de acesso.
   * @throws {InvalidParamError} Quando o email não existe ou a senha está incorreta.
   *
   * @example
   * const result = await userAuthenticateService.authenticate({
   *   email: 'usuario@exemplo.com',
   *   password: 'senha123'
   * });
   * // result = { user: {...}, accessToken: 'jwt-token' }
   */
  public readonly authenticate = async (
    data: UserAuthenticationData,
  ): Promise<UserAuthenticationResult> => {
    const { userRepository, hashProvider, jwtProvider, loggerProvider } =
      this.props;

    const logContext = {
      service: "UserAuthenticateService",
      method: "authenticate",
      metadata: {
        userEmail: data.email,
      },
    };

    try {
      loggerProvider.debug(
        "Iniciando processo de autenticação de usuário",
        logContext,
      );

      // Buscar usuário pelo email
      const user = await userRepository.findByEmail(data.email);
      if (!user) {
        throw new InvalidParamError("email/senha", "credenciais inválidas");
      }

      // Verificar senha
      const passwordValid = await hashProvider.compare(
        data.password,
        user.password,
      );

      if (!passwordValid) {
        throw new InvalidParamError("email/senha", "credenciais inválidas");
      }

      // Gerar token JWT
      const payload: JwtPayload = {
        userId: user.id,
        role: user.role,
      };

      const accessToken = await jwtProvider.sign(payload);

      // Remover senha do objeto de usuário antes de retornar
      const { password, ...userWithoutPassword } = user;

      loggerProvider.info("Usuário autenticado com sucesso", {
        ...logContext,
        metadata: {
          ...logContext.metadata,
          userId: user.id,
        },
      });

      return {
        user: userWithoutPassword,
        accessToken,
      };
    } catch (error) {
      loggerProvider.error("Erro ao autenticar usuário", {
        ...logContext,
        metadata: {
          ...logContext.metadata,
          error: {
            name: (error as Error).name,
            message: (error as Error).message,
            stack: (error as Error).stack,
          },
        },
      });

      throw error;
    }
  };
}
