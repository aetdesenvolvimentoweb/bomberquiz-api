/**
 * Factory para controller de autenticação
 *
 * @module infra/factories/controllers/auth/make-authenticate-controller
 * @category Factories
 */

import { makeAuthenticateService } from "@/infra/factories";
import { AuthenticateController } from "@/presentation/controllers";
import { Controller } from "@/presentation/protocols";

/**
 * Cria e configura uma instância do controller de autenticação
 *
 * Esta factory é responsável por instanciar o controller de autenticação
 * e injetar suas dependências. O controller criado processa requisições
 * HTTP de autenticação, validando os dados de entrada (email e senha),
 * invocando o serviço de autenticação e retornando o resultado apropriado.
 *
 * Segue o padrão Factory Method para isolar a criação do controller e
 * facilitar a substituição de implementações nos testes.
 *
 * @function makeAuthenticateController
 * @returns {Controller} Uma instância configurada do controller de autenticação
 *
 * @example
 * // Obtendo uma instância do controller
 * const authenticateController = makeAuthenticateController();
 *
 * // Utilizando o controller em uma rota
 * router.post('/login', async (req, res) => {
 *   const httpResponse = await authenticateController.handle({
 *     body: req.body
 *   });
 *
 *   res.status(httpResponse.statusCode).json(httpResponse.body);
 * });
 */
export const makeAuthenticateController = (): Controller => {
  const authenticateService = makeAuthenticateService();

  return new AuthenticateController({
    authenticateService,
  });
};
