# Documentação de Segurança - Sistema de Autenticação

## Visão Geral

Este documento descreve as medidas de segurança implementadas no sistema de autenticação do GuiaTuristico (EZ Trip AI).

## Medidas de Segurança Implementadas

### 1. Validação de Entrada

#### Validação de Email
- **Formato RFC 5322**: Validação usando regex padrão
- **Limite de tamanho**: Máximo 320 caracteres (padrão RFC)
- **Sanitização**: Remove espaços em branco extras
- **Normalização**: Converte para lowercase antes do processamento

#### Validação de Senha
- **Comprimento mínimo**: 8 caracteres
- **Comprimento máximo**: 128 caracteres
- **Complexidade**: Requer pelo menos uma letra e um número
- **Sem sanitização**: Senhas não são alteradas para preservar a escolha do usuário

#### Validação de Nome
- **Comprimento mínimo**: 2 caracteres
- **Comprimento máximo**: 100 caracteres
- **Caracteres permitidos**: Letras (incluindo acentuadas), espaços, hífens e apóstrofos
- **Sanitização**: Remove espaços em branco extras

### 2. Proteções contra Ataques

#### SQL Injection
- **Mitigação**: Firebase Auth não usa SQL, usa NoSQL
- **Validação adicional**: Todos os inputs são validados antes do envio

#### XSS (Cross-Site Scripting)
- **React Native**: Proteção nativa contra XSS
- **Sanitização**: Inputs são sanitizados antes do armazenamento

#### CSRF (Cross-Site Request Forgery)
- **Tokens Firebase**: Tokens de autenticação únicos por sessão
- **SameSite**: Cookies configurados corretamente (gerenciado pelo Firebase)

#### Brute Force
- **Firebase Auth**: Rate limiting automático
- **Bloqueio temporário**: Após múltiplas tentativas falhas
- **Mensagens genéricas**: Não revela se email existe ou não

### 3. Armazenamento Seguro

#### Dados Locais (AsyncStorage)
- **Dados armazenados**:
  - UID do usuário (não sensível)
  - Email (não sensível)
  - Nome de exibição (não sensível)
  - URL da foto (não sensível)
- **NÃO armazenado localmente**:
  - Senhas
  - Tokens de autenticação sensíveis
  - Dados pessoais adicionais

#### Sessões
- **Tokens JWT**: Gerenciados pelo Firebase
- **Expiração automática**: Tokens expiram após período de inatividade
- **Renovação automática**: Firebase renova tokens automaticamente
- **Revogação**: Logout remove tokens locais e remotos

### 4. Comunicação Segura

#### HTTPS
- **Firebase**: Todas as comunicações usam HTTPS
- **API Next.js**: Deve ser configurada com HTTPS em produção

#### Criptografia
- **Em trânsito**: TLS 1.2+ (gerenciado pelo Firebase)
- **Em repouso**: Firebase Auth armazena senhas com bcrypt

### 5. Autenticação Social (Google)

#### OAuth 2.0
- **Fluxo seguro**: Implementação padrão OAuth 2.0
- **Escopos mínimos**: Apenas email e perfil
- **Validação de tokens**: Firebase valida tokens do Google

#### Configuração
```typescript
GoogleSignin.configure({
  scopes: ['email', 'profile'], // Escopos mínimos necessários
  webClientId: process.env.WEB_CLIENT_ID,
  iosClientId: process.env.IOS_CLIENT_ID,
  profileImageSize: 150 // Imagem pequena para economia de banda
});
```

### 6. Tratamento de Erros

#### Mensagens Amigáveis
- **Sem informações sensíveis**: Erros não revelam detalhes do sistema
- **Mensagens genéricas**: "Email ou senha incorretos" (não revela qual está errado)
- **Log apenas em desenvolvimento**: Erros detalhados apenas em `__DEV__`

#### Categorização de Erros
- **Erros de usuário**: Input inválido (não reportados)
- **Erros de rede**: Problemas de conexão
- **Erros de sistema**: Problemas de configuração (reportados)
- **Erros de segurança**: Rate limiting, conta desabilitada (reportados)

### 7. Verificação de Email

#### Processo
1. Usuário se cadastra
2. Firebase envia email de verificação automaticamente
3. Usuário clica no link no email
4. Firebase marca email como verificado

#### Benefícios
- **Prova de propriedade**: Garante que usuário tem acesso ao email
- **Recuperação de conta**: Permite reset de senha
- **Prevenção de spam**: Dificulta criação de contas falsas

### 8. Recuperação de Senha

#### Fluxo Seguro
1. Usuário solicita reset de senha
2. Firebase envia email com link único e temporário
3. Link expira após 1 hora
4. Usuário define nova senha
5. Todas as sessões anteriores são invalidadas

#### Proteção contra Enumeração
- **Sempre retorna sucesso**: Não revela se email existe
- **Mesmo tempo de resposta**: Previne timing attacks

## Práticas Recomendadas

### Para Devs

1. **Nunca commitar credenciais**: Use variáveis de ambiente
2. **Atualize dependências**: Mantenha Firebase e outras libs atualizadas
3. **Use HTTPS em produção**: Configure SSL/TLS para API
4. **Monitore erros**: Integre com Sentry ou similar
5. **Teste segurança**: Faça auditorias de segurança regularmente

### Para Usuários

1. **Use senhas fortes**: Mínimo 8 caracteres com letras e números
2. **Não reutilize senhas**: Use senha única para cada serviço
3. **Verifique seu email**: Complete a verificação de email
4. **Atualize o app**: Sempre use a versão mais recente

## Monitoramento e Alertas

### Eventos a Monitorar
- Tentativas de login falhas (múltiplas)
- Criações de conta em massa
- Redefinições de senha frequentes
- Erros de sistema recorrentes
- Acessos de IPs suspeitos

### Ferramentas Sugeridas
- **Firebase Analytics**: Rastreamento de eventos
- **Firebase Crashlytics**: Relatórios de crashes
- **Sentry**: Monitoramento de erros
- **LogRocket**: Replay de sessões (se necessário)

## Compliance e Privacidade

### LGPD (Lei Geral de Proteção de Dados)
- Consentimento explícito para coleta de dados
- Transparência sobre uso de dados
- Direito de exclusão de conta
- Segurança no armazenamento de dados
- Implementar política de privacidade
- Implementar termos de uso

### GDPR (General Data Protection Regulation)
- Similar à LGPD para usuários europeus
- Requer as mesmas medidas de proteção

## Checklist de Segurança

- [x] Validação de inputs (email, senha, nome)
- [x] Sanitização de dados
- [x] Mensagens de erro genéricas
- [x] Proteção contra brute force (Firebase)
- [x] Comunicação HTTPS
- [x] Tokens seguros (Firebase JWT)
- [x] Verificação de email
- [x] Recuperação de senha segura
- [x] OAuth 2.0 para Google Sign-In
- [x] Armazenamento local seguro (sem dados sensíveis)
- [x] Logout completo (limpa sessão)
- [ ] Rate limiting adicional (se necessário)
- [ ] 2FA (Two-Factor Authentication) - futuro
- [ ] Biometria (Face ID/Touch ID) - futuro
- [ ] Política de privacidade
- [ ] Termos de uso

## Próximos Passos Recomendados

1. **Implementar 2FA**: Adicionar autenticação de dois fatores
2. **Biometria**: Suporte para Face ID/Touch ID
3. **Auditoria de segurança**: Contratar pentest
4. **Política de privacidade**: Criar e integrar ao app
5. **Termos de uso**: Criar e requerer aceitação
6. **Logging avançado**: Integrar com serviço de monitoramento
7. **Rate limiting customizado**: Se Firebase não for suficiente
8. **Backup de dados**: Implementar backup automático

## Contato e Suporte

Em caso de vulnerabilidades de segurança, entre em contato IMEDIATAMENTE através do email de segurança do projeto.