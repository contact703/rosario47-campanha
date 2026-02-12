// ElevenLabs TTS Service
// Converte texto em áudio de alta qualidade usando ElevenLabs API

import { Audio } from 'expo-av';

// API Key do ElevenLabs (configurada via environment)
const ELEVENLABS_API_KEY = 'sk_20da726a9b1fc53800fcc32cf39773cd36db81c37dc805e0';

// Vozes disponíveis no ElevenLabs
// Você pode mudar para outras vozes: https://api.elevenlabs.io/v1/voices
const VOICE_IDS = {
  // Vozes em Português
  antonio: 'pqHfZKP75CvOlQylNhV4', // Antonio - voz masculina brasileira
  arnold: 'VR6AewLTigWG4xSOukaG', // Arnold - masculina profunda
  rachel: '21m00Tcm4TlvDq8ikWAM', // Rachel - feminina clara
  default: 'pqHfZKP75CvOlQylNhV4', // Default = Antonio (brasileiro)
};

// Configurações de voz
const VOICE_SETTINGS = {
  stability: 0.5, // 0-1: mais estável = mais consistente
  similarity_boost: 0.8, // 0-1: mais boost = mais parecido com a voz original
  style: 0.5, // 0-1: estilo da fala
  use_speaker_boost: true, // Melhora clareza da voz
};

class ElevenLabsService {
  private sound: Audio.Sound | null = null;
  private isPlaying: boolean = false;

  /**
   * Converte texto em áudio e reproduz
   */
  async speak(text: string, voiceId: string = VOICE_IDS.default): Promise<void> {
    try {
      // Para qualquer áudio anterior
      await this.stop();

      // Limpa o texto (remove markdown, emojis excessivos, etc.)
      const cleanText = this.cleanTextForSpeech(text);
      
      if (!cleanText || cleanText.length < 2) {
        console.log('Texto muito curto para TTS');
        return;
      }

      // Faz request para ElevenLabs API
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': ELEVENLABS_API_KEY,
          },
          body: JSON.stringify({
            text: cleanText,
            model_id: 'eleven_multilingual_v2', // Melhor para português
            voice_settings: VOICE_SETTINGS,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('ElevenLabs error:', response.status, errorText);
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      // Converte response em blob e depois em base64
      const blob = await response.blob();
      const reader = new FileReader();
      
      return new Promise((resolve, reject) => {
        reader.onloadend = async () => {
          try {
            const base64Audio = (reader.result as string).split(',')[1];
            
            // Cria um arquivo temporário no cache
            const { sound } = await Audio.Sound.createAsync(
              { uri: `data:audio/mpeg;base64,${base64Audio}` },
              { shouldPlay: true }
            );
            
            this.sound = sound;
            this.isPlaying = true;

            // Configura callback quando terminar de tocar
            sound.setOnPlaybackStatusUpdate((status) => {
              if (status.isLoaded && status.didJustFinish) {
                this.isPlaying = false;
                resolve();
              }
            });
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('ElevenLabs TTS error:', error);
      throw error;
    }
  }

  /**
   * Para a reprodução atual
   */
  async stop(): Promise<void> {
    if (this.sound) {
      try {
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
      } catch (error) {
        // Ignora erros ao parar
      }
      this.sound = null;
      this.isPlaying = false;
    }
  }

  /**
   * Verifica se está reproduzindo
   */
  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Limpa o texto para TTS
   * Remove markdown, emojis excessivos, links, etc.
   */
  private cleanTextForSpeech(text: string): string {
    return text
      // Remove markdown bold/italic
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/_/g, '')
      // Remove links
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/https?:\/\/[^\s]+/g, '')
      // Remove emojis (mantém apenas texto)
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
      .replace(/[\u{2600}-\u{26FF}]/gu, '')
      .replace(/[\u{2700}-\u{27BF}]/gu, '')
      // Remove bullets e listas
      .replace(/^[•\-\*]\s*/gm, '')
      .replace(/^\d+\.\s*/gm, '')
      // Remove múltiplos espaços/quebras
      .replace(/\n+/g, '. ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Verifica se a API key é válida
   */
  async validateApiKey(): Promise<boolean> {
    try {
      const response = await fetch('https://api.elevenlabs.io/v1/user', {
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Exporta singleton
export const elevenLabs = new ElevenLabsService();
export { VOICE_IDS };
export default elevenLabs;
