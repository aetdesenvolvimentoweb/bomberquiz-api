/**
 * Controlador para atualização do avatar do usuários
 *
 * Este módulo implementa o controlador responsável por processar requisições HTTP
 * para atualização do avatar do usuário. Ele recebe os dados do avatar, delega o
 * processamento para o serviço apropriado e retorna uma resposta padronizada.
 *
 * @module presentation/controllers/user/user-update-avatar-controller
 *
 */

import { UserUpdateAvatarService } from "@/data/services";
import { UserAvatarData } from "@/domain/entities";
import { MissingParamError } from "@/domain/errors";
import { created, handleError } from "@/presentation/helpers";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "@/presentation/protocols";

/**
 * Interface que define as dependências necessárias para o controlador
 *
 * @interface UserUpdateAvatarControllerProps
 */
interface UserUpdateAvatarControllerProps {
  /** Serviço responsável pela lógica de atualização do avatar do usuários */
  userUpdateAvatarService: UserUpdateAvatarService;
}

/**
 * Implementação do controlador para atualização do avatar do usuário
 *
 * Este controlador segue o padrão de inversão de dependência,
 * recebendo suas dependências através do construtor, o que facilita
 * testes e manutenção.
 *
 * @class UserUpdateAvatarController
 * @implements {Controller<UserAvatarData>}
 */
export class UserUpdateAvatarController implements Controller<UserAvatarData> {
  /**
   * Cria uma nova instância do controlador
   *
   * @param {UserUpdateAvatarControllerProps} props - Dependências do controlador
   */
  constructor(private readonly props: UserUpdateAvatarControllerProps) {}

  /**
   * Processa uma requisição para atualização do avatar do usuário
   *
   * Este método:
   * 1. Valida a presença do corpo da requisição
   * 2. Delega a atualização do avatar do usuário para o serviço especializado
   * 3. Retorna uma resposta HTTP padronizada
   * 4. Trata qualquer erro que ocorra durante o processo
   *
   * @param {HttpRequest<UserAvatarData>} request - Requisição HTTP com dados do usuário
   * @returns {Promise<HttpResponse>} Resposta HTTP padronizada
   */
  public readonly handle = async (
    request: HttpRequest<UserAvatarData>,
  ): Promise<HttpResponse> => {
    const { userUpdateAvatarService } = this.props;

    try {
      if (!request.body) {
        throw new MissingParamError("corpo da requisição não informado");
      }

      await userUpdateAvatarService.updateAvatar({
        ...request.body,
      } as UserAvatarData);

      return created();
    } catch (error: unknown) {
      // Melhorar a verificação de tipos de erro
      return handleError(error);
    }
  };
}
