/**
 * @interface JwtPayload
 * @description Interface que representa o conteúdo do payload de um token JWT.
 */
export interface JwtPayload {
  /**
   * @description ID único do usuário associado ao token.
   */
  userId: string;

  /**
   * @description Função/papel do usuário no sistema (ex: 'admin', 'user').
   */
  role: string;

  /**
   * @description Permite propriedades adicionais de qualquer tipo no payload.
   */
  [key: string]: unknown;
}

/**
 * @interface JwtProvider
 * @description Interface que define os métodos necessários para manipulação de tokens JWT.
 */
export interface JwtProvider {
  /**
   * @description Assina um payload e gera um token JWT válido.
   * @param {JwtPayload} payload - O payload a ser codificado no token.
   * @param {string | number} [expiresIn] - Tempo de expiração do token. Pode ser especificado como uma string (ex: '2h', '1d') ou como um número em segundos.
   * @returns {Promise<string>} Uma promessa que resolve para o token JWT gerado.
   */
  sign(payload: JwtPayload, expiresIn?: string | number): Promise<string>;

  /**
   * @description Verifica e decodifica um token JWT.
   * @param {string} token - O token JWT a ser verificado.
   * @returns {Promise<JwtPayload>} Uma promessa que resolve para o payload decodificado se o token for válido.
   * @throws {Error} Lança um erro se o token for inválido ou expirado.
   */
  verify(token: string): Promise<JwtPayload>;
}
