/**
 * Mapeamento de códigos de erro do Firebase para mensagens amigáveis
 */

export interface AuthError {
  code: string;
  message: string;
  userMessage: string;
}

/**
 * Converte códigos de erro do Firebase Auth em mensagens amigáveis ao usuário
 * @param errorCode - Código de erro do Firebase
 * @returns Mensagem de erro apropriada para o usuário
 */
export const getAuthErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    // Erros de email/senha
    'auth/email-already-in-use': 'Este email já está cadastrado. Tente fazer login.',
    'auth/invalid-email': 'Email inválido. Verifique e tente novamente.',
    'auth/operation-not-allowed': 'Operação não permitida. Contate o suporte.',
    'auth/weak-password': 'Senha muito fraca. Use pelo menos 8 caracteres com letras e números.',
    'auth/user-disabled': 'Esta conta foi desativada. Contate o suporte.',
    'auth/user-not-found': 'Email ou senha incorretos.',
    'auth/wrong-password': 'Email ou senha incorretos.',
    'auth/invalid-credential': 'Credenciais inválidas. Verifique seus dados.',
    
    // Erros de rede
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
    'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
    
    // Erros de Google Sign-In
    'auth/account-exists-with-different-credential': 'Já existe uma conta com este email usando outro método de login.',
    'auth/auth-domain-config-required': 'Configuração de autenticação incompleta.',
    'auth/cancelled-popup-request': 'Login cancelado.',
    'auth/operation-not-supported-in-this-environment': 'Operação não suportada neste ambiente.',
    'auth/popup-blocked': 'Popup bloqueado. Permita popups para este site.',
    'auth/popup-closed-by-user': 'Login cancelado pelo usuário.',
    'auth/unauthorized-domain': 'Domínio não autorizado.',
    
    // Erros de token/sessão
    'auth/requires-recent-login': 'Por segurança, faça login novamente.',
    'auth/invalid-user-token': 'Sessão expirada. Faça login novamente.',
    'auth/user-token-expired': 'Sessão expirada. Faça login novamente.',
    'auth/null-user': 'Usuário não encontrado. Faça login novamente.',
    
    // Erros diversos
    'auth/missing-android-pkg-name': 'Erro de configuração Android.',
    'auth/missing-continue-uri': 'Erro de configuração.',
    'auth/missing-ios-bundle-id': 'Erro de configuração iOS.',
    'auth/invalid-continue-uri': 'Erro de configuração.',
    'auth/unauthorized-continue-uri': 'URL não autorizada.',
    'auth/invalid-api-key': 'Configuração de API inválida.',
    'auth/app-deleted': 'Aplicação não encontrada.',
    'auth/expired-action-code': 'Código expirado.',
    'auth/invalid-action-code': 'Código inválido.',
  };

  return errorMessages[errorCode] || 'Ocorreu um erro inesperado. Tente novamente.';
};

/**
 * Categoriza o erro para logging e tratamento
 * @param errorCode - Código de erro do Firebase
 * @returns Categoria do erro
 */
export const categorizeError = (errorCode: string): 'user' | 'network' | 'system' | 'security' => {
  if (errorCode.includes('network')) return 'network';
  if (errorCode.includes('invalid') || errorCode.includes('wrong') || errorCode.includes('not-found')) {
    return 'user';
  }
  if (errorCode.includes('disabled') || errorCode.includes('too-many-requests')) {
    return 'security';
  }
  return 'system';
};

/**
 * Determina se o erro deve ser reportado ao sistema de monitoramento
 * @param errorCode - Código de erro do Firebase
 * @returns true se deve ser reportado
 */
export const shouldReportError = (errorCode: string): boolean => {
  const category = categorizeError(errorCode);
  // Não reportar erros de usuário (entrada inválida)
  return category !== 'user';
};
