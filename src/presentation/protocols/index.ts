/**
 * Módulo de exportação para protocolos da camada de apresentação
 *
 * Este arquivo centraliza a exportação de todas as interfaces e tipos
 * relacionados à camada de apresentação do BomberQuizAPI, seguindo o padrão de barril
 * (barrel pattern). Isso permite importar qualquer protocolo a partir
 * de um único ponto de entrada, simplificando as importações em
 * outros módulos e reduzindo a complexidade de dependências.
 *
 * ## Padrão de Barril (Barrel Pattern)
 * O padrão de barril permite consolidar múltiplas exportações em um único arquivo,
 * facilitando a manutenção e reduzindo a quantidade de importações necessárias
 * em arquivos que dependem destes protocolos.
 *
 * ## Papel na Arquitetura
 * Os protocolos da camada de apresentação definem os contratos para
 * a comunicação entre o framework web (Express, Fastify, etc.) e a
 * lógica de negócio da aplicação, garantindo baixo acoplamento e
 * facilitando testes unitários e de integração.
 *
 * ## Estrutura de Resposta Padrão
 * Todas as respostas HTTP da API seguem uma estrutura padronizada, conforme
 * definido pela interface HttpResponse, facilitando o consumo e interpretação
 * por clientes.
 *
 * @module presentation/protocols
 *
 * @example
 *
 * // Importação simplificada de múltiplos protocolos
 * import { Controller, HttpRequest, HttpResponse } from "@/presentation/protocols";
 *
 * // Implementação de um controlador para o BomberQuizAPI
 * class QuizController implements Controller {
 *   constructor(private readonly createQuizUseCase: CreateQuizUseCase) {}
 *
 *   async handle(request: HttpRequest): Promise<HttpResponse> {
 *     try {
 *       const { title, questions, category } = request.body;
 *       const quiz = await this.createQuizUseCase.execute({ title, questions, category });
 *
 *       return {
 *         statusCode: 201,
 *         body: {
 *           success: true,
 *           data: quiz,
 *           metadata: {
 *             timestamp: new Date().toISOString(),
 *             version: "1.0"
 *           }
 *         }
 *       };
 *     } catch (error) {
 *       if (error instanceof ValidationError) {
 *         return {
 *           statusCode: 400,
 *           body: {
 *             success: false,
 *             error: error.message,
 *             metadata: { timestamp: new Date().toISOString() }
 *           }
 *         };
 *       }
 *
 *       // Tratamento de erros internos
 *       return {
 *         statusCode: 500,
 *         body: {
 *           success: false,
 *           error: "Erro interno do servidor",
 *           metadata: { timestamp: new Date().toISOString() }
 *         }
 *       };
 *     }
 *   }
 * }
 */

/**
 * Exporta a interface Controller que define o contrato para todos os controladores.
 */
export * from "./controller";

/**
 * Exporta as interfaces HttpRequest e HttpResponse para padronização da comunicação HTTP.
 */
export * from "./http";

/**
 * Exporta a interface Middleware que define o contrato para todos os middlewares.
 */
export * from "./middleware";
