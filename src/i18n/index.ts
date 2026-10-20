import { vi } from './vi';
import { en } from './en';

export type LanguageCode = 'vi' | 'en';

class I18nManager {
  private currentLang: LanguageCode = 'vi';
  private listeners: Array<() => void> = [];

  constructor() {
    const saved = localStorage.getItem('echoes_language');
    if (saved === 'en' || saved === 'vi') {
      this.currentLang = saved;
    }
  }

  public get lang(): LanguageCode {
    return this.currentLang;
  }

  public setLanguage(code: LanguageCode): void {
    if (this.currentLang !== code) {
      this.currentLang = code;
      localStorage.setItem('echoes_language', code);
      this.notifyListeners();
    }
  }

  public t(): typeof vi {
    return this.currentLang === 'vi' ? vi : (en as unknown as typeof vi);
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(fn => fn());
  }
}

export const i18n = new I18nManager();
