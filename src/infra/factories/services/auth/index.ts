/**
 * Exportações centralizadas para factories de serviços de autenticação
 *
 * Este arquivo centraliza todas as exportações de factories relacionadas aos serviços de autenticação,
 * facilitando a importação destas factories em outros módulos da aplicação.
 *
 * Atualmente exporta:
 * - makeAuthenticateService: Factory para criação do serviço de autenticação de usuários,
 *   que configura todas as dependências necessárias como validadores, sanitizadores,
 *   repositórios e provedores.
 *
 *
 * @module infra/factories/services/auth
 * @see {@link ./make-authenticate-service.ts} para detalhes de implementação da factory
 */

export * from "./make-authenticate-service";
