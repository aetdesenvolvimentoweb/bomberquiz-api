/**
 * Implementação em memória do repositório de usuários para testes
 *
 * Esta classe implementa a interface UserRepository utilizando um array em memória
 * para armazenar os dados, sem dependência de bancos de dados externos. É projetada
 * principalmente para ser utilizada em testes unitários e de integração, permitindo:
 *
 * - Testes rápidos sem necessidade de configuração de banco de dados
 * - Isolamento completo entre execuções de testes
 * - Comportamento determinístico e previsível
 * - Verificação fácil do estado interno do repositório
 *
 * @implements {UserRepository}
 *
 * @example
 * // Uso em testes unitários
 * describe('UserService', () => {
 *   let userRepository: UserRepository;
 *
 *   beforeEach(() => {
 *     // Cria uma nova instância limpa para cada teste
 *     userRepository = new InMemoryUserRepository();
 *   });
 *
 *   it('deve criar um usuário corretamente', async () => {
 *     const userData = { name: 'Test User', email: 'test@example.com', ... };
 *     await userRepository.create(userData);
 *
 *     const user = await userRepository.findByEmail('test@example.com');
 *     expect(user).not.toBeNull();
 *     expect(user?.name).toBe('Test User');
 *   });
 * });
 */
import {
  User,
  USER_DEFAULT_AVATAR_URL,
  USER_DEFAULT_ROLE,
  UserAvatarData,
  UserCreateData,
  UserMapped,
} from "@/domain/entities";
import { UserRepository } from "@/domain/repositories";

/**
 * Repositório de usuários em memória para testes
 *
 * Implementação concreta da interface UserRepository que utiliza
 * estruturas de dados em memória para simular operações de persistência.
 */
export class InMemoryUserRepository implements UserRepository {
  /**
   * Array que armazena os usuários em memória
   *
   * Esta estrutura de dados representa a "tabela" de usuários
   * e mantém o estado durante o ciclo de vida da instância.
   *
   * @private
   */
  private users: User[] = [];

  /**
   * Cria um novo usuário no repositório
   *
   * @param {UserCreateData} data - Dados do usuário a ser criado
   * @returns {Promise<void>} - Promise que resolve quando o usuário é criado com sucesso
   *
   * @remarks
   * Este método gera automaticamente:
   * - Um ID único usando crypto.randomUUID()
   * - Uma URL de avatar padrão
   * - Uma role (função) padrão para o usuário
   * - Carimbos de data/hora de criação e atualização
   */
  public readonly create = async (data: UserCreateData): Promise<void> => {
    this.users.push({
      ...data,
      id: crypto.randomUUID(),
      avatarUrl: USER_DEFAULT_AVATAR_URL,
      role: USER_DEFAULT_ROLE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  /**
   * Busca um usuário pelo endereço de e-mail
   *
   * @param {string} email - E-mail do usuário a ser encontrado
   * @returns {Promise<User | null>} - Promise que resolve para o usuário encontrado ou null caso não exista
   *
   * @remarks
   * A busca é case-sensitive e deve corresponder exatamente ao e-mail armazenado.
   */
  public readonly findByEmail = async (email: string): Promise<User | null> => {
    return this.users.find((user) => user.email === email) || null;
  };

  /**
   * Busca um usuário pelo id
   *
   * @param {string} id - Id do usuário a ser encontrado
   * @returns {Promise<User | null>} - Promise que resolve para o usuário encontrado sem o password ou null caso não exista
   *
   * @remarks
   */
  public readonly findById = async (id: string): Promise<UserMapped | null> => {
    const user = this.users.find((user) => user.id === id);

    if (!user) {
      return null;
    }

    return this.mapUser(user);
  };

  /**
   * Lista todos os usuários do sistema
   *
   * @returns {Promise<UserMapped[]>} - Promise que resolve para um array de usuários mapeados
   *
   * @remarks
   * Este método retorna uma versão mapeada de cada usuário, utilizando o método privado
   * mapUser para converter os objetos User para UserMapped. O array retornado pode estar
   * vazio se não houver usuários cadastrados no repositório.
   */
  public readonly list = async (): Promise<UserMapped[]> => {
    return this.users.map((user) => this.mapUser(user));
  };

  /**
   * Atualiza a url do avatar do usuário no sistema
   *
   * @returns {Promise<void>} - Promise que resolve quando a url do avatar do usuário
   * é atualizada com sucesso
   *
   */
  public readonly updateAvatar = async (
    userAvatarData: UserAvatarData,
  ): Promise<void> => {
    const updateIndex = this.users.findIndex(
      (user) => user.id === userAvatarData.id,
    );

    this.users[updateIndex] = {
      ...this.users[updateIndex],
      avatarUrl: userAvatarData.avatarUrl,
    };
  };

  /**
   * Mapeia um objeto User para UserMapped
   *
   * @param {User} user - O objeto usuário a ser mapeado
   * @returns {UserMapped} - O objeto usuário mapeado
   *
   * @private
   *
   * @remarks
   * Este método é utilizado para transformar o modelo interno User
   * em UserMapped, garantindo que apenas os campos necessários sejam expostos
   * e mantendo a consistência dos tipos retornados pelo repositório.
   */
  private mapUser(user: User): UserMapped {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
