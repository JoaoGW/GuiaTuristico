import { API_URL } from '../config';

interface PreloadService {
  checkApiAvailability(): Promise<boolean>;
  preloadCriticalResources(): Promise<void>;
  warmUpApis(): Promise<void>;
}

class AppPreloader implements PreloadService {
  private apiBaseUrl = API_URL;

  async checkApiAvailability(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const healthCheck = await fetch(`${this.apiBaseUrl}/weather?latitude=-23.55052&longitude=-46.633308`, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return healthCheck.ok;
    } catch (error) {
      console.warn('API health check failed:', error);
      return false;
    }
  }

  async preloadCriticalResources(): Promise<void> {
    const preloadTasks = [
      this.warmUpApis(),
      this.preloadCriticalData(),
    ];

    try {
      await Promise.allSettled(preloadTasks);
    } catch (error) {
      console.warn('Some preload tasks failed:', error);
    }
  }

  async warmUpApis(): Promise<void> {
    const warmUpTasks = [
      this.warmUpWeatherApi(),
      this.warmUpGooglePlacesApi(),
      this.warmUpChatApi(),
    ];

    try {
      await Promise.allSettled(warmUpTasks);
      console.log('As APIs estão prontas');
    } catch (error) {
      console.warn('Falha ao aquecer algumas APIs:', error);
    }
  }

  private async warmUpWeatherApi(): Promise<void> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/weather?latitude=-23.55052&longitude=-46.633308`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.ok) {
        console.log('Weather API pronta');
      }
    } catch (error) {
      console.warn('Weather API warm-up failed:', error);
    }
  }

  private async warmUpGooglePlacesApi(): Promise<void> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/googlePlacesApi?latitude=-23.55052&longitude=-46.633308`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.ok) {
        console.log('Google Places API pronta');
      }
    } catch (error) {
      console.warn('Google Places API warm-up failed:', error);
    }
  }

  private async warmUpChatApi(): Promise<void> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/justchat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: 'Verificar conectividade'
        }),
      });
      
      if (response.ok) {
        console.log('Chat OpenAI API pronta');
      }
    } catch (error) {
      console.warn('Chat API warm-up failed:', error);
    }
  }

  private async preloadCriticalData(): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Dados críticos pré-carregados');
    } catch (error) {
      console.warn('Critical data preload failed:', error);
    }
  }
}

export const appPreloader = new AppPreloader();
