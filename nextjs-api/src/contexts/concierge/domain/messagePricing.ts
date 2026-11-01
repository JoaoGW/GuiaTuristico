// Preço das conversas com o Felipe em "mensagens", moeda ganha com anúncios recompensados.
// Medição real de 01/11/2026 (gpt-6-luna a US$ 0,10/0,50 por milhão de tokens e whisper-1 a
// ~US$ 0,006/min, preços de agregadores): texto com histórico ≈ US$ 0,0002; voz de 13 s ≈
// US$ 0,0015, dominada pela transcrição. Com 1 mensagem por texto e 5 por voz, a recompensa
// recomendada de 5 mensagens por anúncio custa no máximo ~US$ 0,0017 em IA.
export const TEXT_MESSAGE_COST = 1;
export const VOICE_MESSAGE_COST = 5;
