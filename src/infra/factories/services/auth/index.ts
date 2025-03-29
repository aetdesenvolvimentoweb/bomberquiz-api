/**
 * Exportações centralizadas para factories de serviços de autenticação
 *
 * Este arquivo centraliza todas as exportações de factories relacionadas aos serviços de autenticação,
 * facilitando a importação destas factories em outros módulos da aplicação.
 *
 * Atualmente exporta:
 * - makeUserAuthenticateService: Factory para criação do serviço de autenticação de usuários,
 *   que configura todas as dependências necessárias como validadores, sanitizadores,
 *   repositórios e provedores.
 *
 * @example
 * // Importação da factory
 * import { makeUserCreateService } from "@/infra/factories/services/user";
 *
 * // Uso da factory para obter uma instância configurada do serviço
 * const userCreateService = makeUserCreateService();
 *
 * // A instância retornada já possui todas as dependências necessárias injetadas
 * const result = await userCreateService.execute({
 *   name: "Nome do Usuário",
 *   email: "usuario@exemplo.com",
 *   password: "senha123",
 *   birthdate: "1990-01-01",
 *   phone: "+5511999999999"
 * });
 *
 * @module infra/factories/services/auth
 * @see {@link ./make-user-authenticate-service.ts} para detalhes de implementação da factory
 */

export * from "../auth/make-user-authenticate-service";
