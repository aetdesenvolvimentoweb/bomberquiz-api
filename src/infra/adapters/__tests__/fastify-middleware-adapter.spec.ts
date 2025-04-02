/**
 * Testes unitários para o adaptador de middleware do Fastify
 *
 * Este arquivo contém testes que verificam o comportamento do adaptador
 * que converte middlewares internos da aplicação para o formato esperado pelo Fastify.
 *
 * @group Unit
 * @group Adapters
 * @group Middleware
 */

import { FastifyReply, FastifyRequest } from "fastify";

import { Middleware } from "@/presentation/protocols";

import { fastifyMiddlewareAdapter } from "../fastify-middleware-adapter";

describe("Fastify Middleware Adapter", () => {
  let mockMiddleware: Middleware;
  let mockRequest: FastifyRequest;
  let mockReply: FastifyReply;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let adaptedMiddleware: any;

  beforeEach(() => {
    // Criar mock do middleware
    mockMiddleware = {
      handle: jest.fn(),
    };

    // Criar mock do request do Fastify
    mockRequest = {
      body: { name: "Test User" },
      headers: { "content-type": "application/json" },
    } as unknown as FastifyRequest;

    // Criar mock do reply do Fastify
    mockReply = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    } as unknown as FastifyReply;

    // Criar o middleware adaptado
    adaptedMiddleware = fastifyMiddlewareAdapter(mockMiddleware);
  });

  it("deve retornar uma função de middleware", () => {
    expect(typeof adaptedMiddleware).toBe("function");
  });

  it("deve chamar middleware.handle com o request correto", async () => {
    // Configurar o retorno do middleware
    const httpResponse = {
      statusCode: 200,
      body: {
        data: { userId: "123", role: "admin" },
        success: true,
        metadata: { timestamp: new Date().toISOString() },
      },
    };
    (mockMiddleware.handle as jest.Mock).mockResolvedValue(httpResponse);

    // Executar o middleware adaptado
    await adaptedMiddleware(mockRequest, mockReply);

    // Verificar se o middleware foi chamado com o objeto de request correto
    expect(mockMiddleware.handle).toHaveBeenCalledWith({
      headers: mockRequest.headers,
      body: mockRequest.body,
    });
  });

  it("deve adicionar os dados ao request quando o status é 200", async () => {
    // Configurar o retorno do middleware com status 200
    const authenticatedUserData = { userId: "123", role: "admin" };
    const httpResponse = {
      statusCode: 200,
      body: {
        data: authenticatedUserData,
        success: true,
        metadata: { timestamp: new Date().toISOString() },
      },
    };
    (mockMiddleware.handle as jest.Mock).mockResolvedValue(httpResponse);

    // Executar o middleware adaptado
    await adaptedMiddleware(mockRequest, mockReply);

    // Verificar se os dados foram adicionados ao request
    expect(mockRequest).toEqual(
      expect.objectContaining({
        ...mockRequest,
        ...authenticatedUserData,
      }),
    );

    // Verificar que reply.code e reply.send não foram chamados
    expect(mockReply.code).not.toHaveBeenCalled();
    expect(mockReply.send).not.toHaveBeenCalled();
  });

  it("deve retornar o status e body para middleware com status 401 (não autorizado)", async () => {
    // Configurar o retorno do middleware com erro de autenticação
    const errorResponse = {
      statusCode: 401,
      body: {
        success: false,
        errorMessage: "Token inválido",
        metadata: { timestamp: new Date().toISOString() },
      },
    };
    (mockMiddleware.handle as jest.Mock).mockResolvedValue(errorResponse);

    // Executar o middleware adaptado
    await adaptedMiddleware(mockRequest, mockReply);

    // Verificar se reply.code e reply.send foram chamados com os valores corretos
    expect(mockReply.code).toHaveBeenCalledWith(401);
    expect(mockReply.send).toHaveBeenCalledWith(errorResponse.body);
  });

  it("deve retornar o status e body para middleware com status 403 (proibido)", async () => {
    // Configurar o retorno do middleware com erro de autorização
    const errorResponse = {
      statusCode: 403,
      body: {
        success: false,
        errorMessage: "Acesso negado para este recurso",
        metadata: { timestamp: new Date().toISOString() },
      },
    };
    (mockMiddleware.handle as jest.Mock).mockResolvedValue(errorResponse);

    // Executar o middleware adaptado
    await adaptedMiddleware(mockRequest, mockReply);

    // Verificar se reply.code e reply.send foram chamados com os valores corretos
    expect(mockReply.code).toHaveBeenCalledWith(403);
    expect(mockReply.send).toHaveBeenCalledWith(errorResponse.body);
  });

  it("deve propagar erros lançados pelo middleware", async () => {
    // Configurar o middleware para lançar um erro
    const error = new Error("Erro interno no middleware");
    (mockMiddleware.handle as jest.Mock).mockRejectedValue(error);

    // Executar o middleware adaptado e capturar exceção
    try {
      await adaptedMiddleware(mockRequest, mockReply);
      // Se chegou aqui, o teste falhou
      fail("Deveria ter lançado uma exceção");
    } catch (e) {
      expect(e).toBe(error);
    }

    // Verificar se o middleware foi chamado
    expect(mockMiddleware.handle).toHaveBeenCalled();
  });
});
