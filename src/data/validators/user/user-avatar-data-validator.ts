import { UserAvatarData } from "@/domain/entities";
import { MissingParamError, UnregisteredParamError } from "@/domain/errors";
import { UserRepository } from "@/domain/repositories";
import {
  IdValidatorUseCase,
  UserAvatarDataValidatorUseCase,
} from "@/domain/validators";

/**
 * Propriedades necessárias para a criação do validador
 *
 * @interface UserAvatarDataValidatorProps
 */
interface UserAvatarDataValidatorProps {
  /** Validador para verificar o formato do Id */
  idValidator: IdValidatorUseCase;
  userRepository: UserRepository;
}

/**
 * Implementação do validador de dados para atualização do avatar do usuário
 */
export class UserAvatarDataValidator implements UserAvatarDataValidatorUseCase {
  constructor(private readonly props: UserAvatarDataValidatorProps) {}

  /**
   * Valida os dados para atualização do avatar do usuário
   *
   * @param {UserAvatarData} data - Dados sanitizados do avatar a ser validado
   * @returns {Promise<void>} - Promise que resolve quando os dados são válidos
   * @throws {MissingParamError} - Se algum campo obrigatório estiver ausente
   * @throws {InvalidParamError} - Se algum campo tiver formato ou valor inválido
   * @throws {UnregisterError} - Se o id não estiver registrado
   */
  public readonly validate = async (
    userAvatarData: UserAvatarData,
  ): Promise<void> => {
    const { idValidator, userRepository } = this.props;

    // Define os campos obrigatórios com seus respectivos rótulos para mensagens de erro
    const requiredFields: { field: keyof UserAvatarData; label: string }[] = [
      { field: "id", label: "Id" },
      { field: "avatarUrl", label: "avatar" },
    ];

    // Verifica se todos os campos obrigatórios estão presentes
    requiredFields.forEach(({ field, label }) => {
      if (
        !userAvatarData[field] ||
        userAvatarData[field] === undefined ||
        userAvatarData[field] === null
      ) {
        throw new MissingParamError(label);
      }
    });

    // Executa as validações específicas para cada tipo de dado
    idValidator.validate(userAvatarData.id);

    const user = await userRepository.findById(userAvatarData.id);
    if (!user) {
      throw new UnregisteredParamError("id");
    }

    //validar se o domínio da url é o utilizado pelo site
  };
}
