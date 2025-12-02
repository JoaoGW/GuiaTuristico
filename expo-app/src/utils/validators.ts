/**
 * Utilitários de validação para autenticação
 * Fornece funções para validar dados de entrada do usuário
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Valida se um email está no formato correto
 * @param email - Email a ser validado
 * @returns Resultado da validação
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: 'Email é obrigatório' };
  }

  // Regex para validação de email (mais restrito, TLD >= 2, sem pontos consecutivos)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (
    !emailRegex.test(email.trim()) ||
    email.includes('..')
  ) {
    return { isValid: false, error: 'Email inválido' };
  }

  // Verificação de comprimento máximo (320 caracteres é o limite RFC)
  if (email.length > 320) {
    return { isValid: false, error: 'Email muito longo' };
  }

  return { isValid: true };
};

/**
 * Valida a força da senha
 * @param password - Senha a ser validada
 * @returns Resultado da validação
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password || password.length === 0) {
    return { isValid: false, error: 'Senha é obrigatória' };
  }

  if (password.length < 8) {
    return { isValid: false, error: 'A senha deve ter pelo menos 8 caracteres' };
  }

  if (password.length > 128) {
    return { isValid: false, error: 'Senha muito longa' };
  }

  // Verificar se contém pelo menos uma letra
  if (!/[a-zA-Z]/.test(password)) {
    return { isValid: false, error: 'A senha deve conter pelo menos uma letra' };
  }

  // Verificar se contém pelo menos um número
  if (!/\d/.test(password)) {
    return { isValid: false, error: 'A senha deve conter pelo menos um número' };
  }

  return { isValid: true };
};

/**
 * Valida o nome do usuário
 * @param name - Nome a ser validado
 * @returns Resultado da validação
 */
export const validateName = (name: string): ValidationResult => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Nome é obrigatório' };
  }

  if (name.trim().length < 2) {
    return { isValid: false, error: 'Nome deve ter pelo menos 2 caracteres' };
  }

  if (name.length > 100) {
    return { isValid: false, error: 'Nome muito longo' };
  }

  // Verificar caracteres válidos (letras, espaços, hífens, apóstrofos)
  const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
  if (!nameRegex.test(name)) {
    return { isValid: false, error: 'Nome contém caracteres inválidos' };
  }

  return { isValid: true };
};

/**
 * Sanitiza uma string removendo caracteres perigosos
 * @param input - String a ser sanitizada
 * @returns String sanitizada
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Remove espaços em branco extras
  return input.trim();
};

/**
 * Valida todos os campos do formulário de cadastro
 * @param name - Nome do usuário
 * @param email - Email do usuário
 * @param password - Senha do usuário
 * @returns Resultado da validação com campo específico que falhou
 */
export const validateSignUpForm = (
  name: string,
  email: string,
  password: string
): { isValid: boolean; field?: string; error?: string } => {
  const nameValidation = validateName(name);
  if (!nameValidation.isValid) {
    return { isValid: false, field: 'name', error: nameValidation.error };
  }

  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    return { isValid: false, field: 'email', error: emailValidation.error };
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return { isValid: false, field: 'password', error: passwordValidation.error };
  }

  return { isValid: true };
};

/**
 * Valida campos do formulário de login
 * @param email - Email do usuário
 * @param password - Senha do usuário
 * @returns Resultado da validação
 */
export const validateLoginForm = (
  email: string,
  password: string
): { isValid: boolean; field?: string; error?: string } => {
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    return { isValid: false, field: 'email', error: emailValidation.error };
  }

  if (!password || password.length === 0) {
    return { isValid: false, field: 'password', error: 'Senha é obrigatória' };
  }

  return { isValid: true };
};
