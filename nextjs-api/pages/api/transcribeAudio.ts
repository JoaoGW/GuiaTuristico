import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

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

// Função para tentar diferentes extensões
async function tryTranscriptionWithDifferentFormats(tempPath: string, originalName: string): Promise<string> {
  const formats = [
    { ext: 'm4a', mime: 'audio/m4a' }, // Priorizar M4A (mais compatível)
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
          continue; // Pular para próximo formato
        }
      } else {
        // Para outros formatos, apenas copiar
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
      maxFileSize: 2 * 1024 * 1024, // 2MB máximo (equivale a ~15 segundos de áudio em alta qualidade)
      filter: ({ mimetype, name }: { mimetype?: string | null, name?: string | null }) => {
        // Aceitar arquivos de áudio e também arquivos sem MIME type definido (React Native)
        const isAudio = mimetype?.startsWith('audio/') || false;
        const hasAudioExtension = name ? /\.(wav|mp3|m4a|flac|ogg|webm)$/i.test(name) : false;
        return isAudio || hasAudioExtension || !mimetype; // Aceitar quando MIME type não está definido
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

    // Verificar o arquivo recebido
    const originalFilename = audioFile.originalFilename || 'recording.wav';
    
    console.log('Arquivo recebido:', {
      originalFilename,
      mimetype: audioFile.mimetype,
      size: audioFile.size,
      filepath: audioFile.filepath
    });

    // Verificar se o arquivo existe e tem tamanho válido
    const tempPath = audioFile.filepath;
    const stats = fs.statSync(tempPath);
    if (stats.size === 0) {
      return res.status(400).json({
        error: 'Arquivo de áudio vazio',
        details: 'O arquivo de áudio não contém dados válidos'
      });
    }

    console.log(`Processando arquivo: ${originalFilename} (${stats.size} bytes)`);

    let transcription: string;
    try {
      // Tentar transcrição com diferentes formatos
      transcription = await tryTranscriptionWithDifferentFormats(tempPath, originalFilename);
      console.log('Transcrição realizada com sucesso');
      
    } finally {
      // Limpar arquivo temporário original
      try {
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      } catch (cleanupError) {
        console.warn('Erro ao limpar arquivo temporário:', cleanupError);
      }
    }

    // Retornar resultado
    return res.status(200).json({
      success: true,
      text: transcription.trim(),
      audioInfo: {
        originalName: audioFile.originalFilename,
        size: audioFile.size,
        duration: 'Estimado: ~15 segundos máximo'
      }
    });

  } catch (error: any) {
    console.error('Erro na transcrição de áudio:', error);

    // Tratar diferentes tipos de erro
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        error: 'Arquivo muito grande',
        details: 'O arquivo deve ter no máximo 2MB (equivale a ~15 segundos)',
        maxSize: '2MB'
      });
    }

    // Erro de formato de arquivo não suportado
    if (error.message && (error.message.includes('Unrecognized file format') || error.message.includes('unsupported file format'))) {
      return res.status(400).json({
        error: 'Formato de arquivo não reconhecido pela OpenAI',
        details: 'O arquivo pode estar corrompido, ter formato inválido ou a extensão não corresponde ao conteúdo real',
        supportedFormats: ['flac', 'm4a', 'mp3', 'mp4', 'mpeg', 'mpga', 'oga', 'ogg', 'wav', 'webm'],
        suggestion: 'Verifique se o arquivo de áudio foi gravado corretamente e não está corrompido'
      });
    }

    if (error.status === 400 || (error.response && error.response.status === 400)) {
      return res.status(400).json({
        error: 'Erro na API da OpenAI',
        details: error.message || 'Formato de áudio inválido ou corrompido',
        suggestion: 'Verifique se o arquivo de áudio não está corrompido e está em um formato suportado',
        openaiError: error.response?.data || 'Sem detalhes adicionais'
      });
    }

    if (error.status === 401) {
      return res.status(500).json({
        error: 'Erro de autenticação',
        details: 'API key da OpenAI inválida ou expirada'
      });
    }

    // Erro de arquivo vazio
    if (error.message && error.message.includes('vazio')) {
      return res.status(400).json({
        error: 'Arquivo de áudio vazio',
        details: 'O arquivo de áudio não contém dados válidos'
      });
    }

    return res.status(500).json({
      error: 'Erro interno do servidor',
      details: 'Falha ao processar transcrição de áudio',
      message: error.message || 'Erro desconhecido'
    });
  }
}
