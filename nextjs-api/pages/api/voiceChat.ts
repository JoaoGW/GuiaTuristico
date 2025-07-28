import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import formidable from 'formidable';
import fs from 'fs';
import { responseCache } from '../../utils/responseCache';

// Configurar o OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

// Função para verificar e corrigir header WAV se necessário
function validateAndFixWavFile(inputPath: string, outputPath: string): boolean {
  try {
    const buffer = fs.readFileSync(inputPath);
    
    // Verificar se é um arquivo WAV válido
    const isWav = buffer.length > 12 && 
                  buffer.toString('ascii', 0, 4) === 'RIFF' &&
                  buffer.toString('ascii', 8, 12) === 'WAVE';
    
    if (!isWav) {
      console.log('Arquivo não é um WAV válido, tentando como MP3/M4A');
      return false;
    }
    
    // Se é WAV válido, copiar como está
    fs.copyFileSync(inputPath, outputPath);
    console.log('Arquivo WAV válido encontrado');
    return true;
  } catch (error) {
    console.error('Erro ao validar arquivo WAV:', error);
    return false;
  }
}

// Função para tentar diferentes extensões na transcrição
async function tryTranscriptionWithDifferentFormats(tempPath: string, originalName: string): Promise<string> {
  const formats = [
    { ext: 'm4a', mime: 'audio/m4a' },
    { ext: 'mp3', mime: 'audio/mp3' },
    { ext: 'wav', mime: 'audio/wav' },
    { ext: 'mp4', mime: 'audio/mp4' }
  ];
  
  for (const format of formats) {
    try {
      const testPath = `${tempPath}.${format.ext}`;
      
      // Para WAV, tentar validar primeiro
      if (format.ext === 'wav') {
        if (!validateAndFixWavFile(tempPath, testPath)) {
          continue;
        }
      } else {
        fs.copyFileSync(tempPath, testPath);
      }
      
      console.log(`Tentando transcrição como ${format.ext.toUpperCase()}...`);
      
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(testPath),
        model: 'whisper-1',
        language: 'pt',
        response_format: 'text',
        temperature: 0,
      });
      
      // Limpar arquivo de teste
      if (fs.existsSync(testPath)) fs.unlinkSync(testPath);
      
      console.log(`Sucesso com formato ${format.ext.toUpperCase()}`);
      return transcription as string;
      
    } catch (error: any) {
      console.log(`Falha com formato ${format.ext.toUpperCase()}:`, error?.message || error);
      const testPath = `${tempPath}.${format.ext}`;
      if (fs.existsSync(testPath)) fs.unlinkSync(testPath);
      continue;
    }
  }
  
  throw new Error('Nenhum formato de áudio funcionou');
}

// Configuração para permitir upload de arquivos
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Use POST.' });
  }

  try {
    // Parse do form-data
    const form = formidable({
      maxFileSize: 2 * 1024 * 1024,
      filter: ({ mimetype, name }: { mimetype?: string | null, name?: string | null }) => {
        const isAudio = mimetype?.startsWith('audio/') || false;
        const hasAudioExtension = name ? /\.(wav|mp3|m4a|flac|ogg|webm)$/i.test(name) : false;
        return isAudio || hasAudioExtension || !mimetype;
      },
      allowEmptyFiles: false,
    });

    const { fields, files } = await new Promise<{ fields: any, files: any }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });
    
    const audioFile = Array.isArray(files.audio) ? files.audio[0] : files.audio;
    
    if (!audioFile) {
      return res.status(400).json({ 
        error: 'Arquivo de áudio é obrigatório',
        details: 'Envie o arquivo com o campo "audio"'
      });
    }

    // Verificar se o arquivo existe
    if (!fs.existsSync(audioFile.filepath)) {
      return res.status(400).json({ 
        error: 'Arquivo de áudio não encontrado' 
      });
    }

    console.log('=== INICIANDO PROCESSAMENTO DE VOZ ===');
    
    // ETAPA 1: TRANSCRIÇÃO DO ÁUDIO
    console.log('Etapa 1: Transcrevendo áudio...');
    const tempPath = audioFile.filepath;
    const stats = fs.statSync(tempPath);
    
    if (stats.size === 0) {
      return res.status(400).json({
        error: 'Arquivo de áudio vazio',
        details: 'O arquivo de áudio não contém dados válidos'
      });
    }

    let transcription: string;
    try {
      transcription = await tryTranscriptionWithDifferentFormats(tempPath, audioFile.originalFilename || 'recording');
      
    } finally {
      // Limpar arquivo temporário original
      try {
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      } catch (cleanupError) {
        console.warn('Erro ao limpar arquivo temporário:', cleanupError);
      }
    }

    // ETAPA 2: GERAR RESPOSTA DO FELIPE
    console.log('Etapa 2: Gerando resposta do Felipe...');
    
    // Verificar cache primeiro
    let felipeResponse = responseCache.getCachedResponse(transcription);
    let usedCache = !!felipeResponse;
    let completion;
    
    if (!felipeResponse) {
      // Cache miss - gerar nova resposta com OpenAI
      console.log('Cache miss - consultando OpenAI...');
      
      const systemPrompt = `Você é Felipe, um guia turístico virtual brasileiro especializado e experiente. Suas características:

- Você é simpático, prestativo e conhece muito sobre turismo no Brasil e no mundo
- Você fala de forma natural e amigável, como um guia humano
- Você fornece informações práticas e úteis sobre destinos, atrações, hospedagem, transporte, gastronomia
- Você sugere roteiros personalizados baseados nos interesses do turista
- Você conhece dicas locais, preços aproximados e melhores épocas para visitar lugares
- Você responde em português brasileiro
- Mantenha suas respostas concisas (máximo 2-3 frases para conversas por voz)
- Seja sempre positivo e entusiasmado sobre viagens

Responda à pergunta do turista de forma útil e prática:`;

      completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: transcription
          }
        ],
        max_tokens: 150,
        temperature: 0.7,
      });

      felipeResponse = completion.choices[0]?.message?.content?.trim() || 'Desculpe, não consegui gerar uma resposta.';
      
      // Armazenar no cache para futuras consultas similares
      responseCache.storeResponse(transcription, felipeResponse);
    } else {
      console.log('Cache detectado');
    }

    // Retornar ambos os resultados
    return res.status(200).json({
      success: true,
      transcription: transcription.trim(),
      response: felipeResponse,
      audioInfo: {
        originalName: audioFile.originalFilename,
        size: audioFile.size,
        duration: 'Estimado: ~15 segundos máximo'
      },
      usage: {
        transcriptionModel: 'whisper-1',
        chatModel: 'gpt-3.5-turbo',
        totalTokens: completion?.usage?.total_tokens || 0,
        usedCache: usedCache,
        cacheStats: responseCache.getStats()
      }
    });

  } catch (error: any) {
    console.error('Erro no processamento de voz:', error);

    // Tratar diferentes tipos de erro
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        error: 'Arquivo muito grande',
        details: 'O arquivo deve ter no máximo 2MB (equivale a ~15 segundos)',
        maxSize: '2MB'
      });
    }

    if (error.message && (error.message.includes('Unrecognized file format') || error.message.includes('unsupported file format'))) {
      return res.status(400).json({
        error: 'Formato de arquivo não reconhecido pela OpenAI',
        details: 'O arquivo pode estar corrompido, ter formato inválido ou a extensão não corresponde ao conteúdo real',
        supportedFormats: ['flac', 'm4a', 'mp3', 'mp4', 'mpeg', 'mpga', 'oga', 'ogg', 'wav', 'webm']
      });
    }

    if (error.status === 401) {
      return res.status(500).json({
        error: 'Erro de autenticação',
        details: 'API key da OpenAI inválida ou expirada'
      });
    }

    if (error.status === 429) {
      return res.status(429).json({
        error: 'Limite de taxa excedido',
        details: 'Muitas requisições. Tente novamente em alguns segundos.'
      });
    }

    return res.status(500).json({
      error: 'Erro interno do servidor',
      details: 'Falha ao processar áudio e gerar resposta',
      message: error.message || 'Erro desconhecido'
    });
  }
}
