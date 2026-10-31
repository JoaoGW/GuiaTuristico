/**
 * Falha esperada cuja mensagem (curta, em pt-BR) pode ser devolvida ao cliente.
 * `cause` guarda o detalhe técnico, que vai só para o log do servidor.
 */
export class AppError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string,
    options?: { cause?: unknown }
  ) {
    super(message, options);
    this.name = 'AppError';
  }
}

export function badRequest(message: string, code = 'INVALID_INPUT'): AppError {
  return new AppError(400, message, code);
}
