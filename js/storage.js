// Gerenciador de Armazenamento Local e Utilidades de Dados
import { INITIAL_CLOTHES } from './data.js';

const STORAGE_KEYS = {
  CLOTHES: 'wardrobe_clothes_v2',
  HISTORY: 'wardrobe_history_v2',
  FAVORITES: 'wardrobe_favorites_v2',
  SETTINGS: 'wardrobe_settings_v2'
};

export const Storage = {
  // Obter roupas
  getClothes() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CLOTHES);
      if (!data) {
        // Se ainda tiver da versão antiga v1
        const legacy = localStorage.getItem('wardrobe_clothes');
        if (legacy) {
          const parsed = JSON.parse(legacy);
          this.saveClothes(parsed);
          return parsed;
        }
        this.saveClothes(INITIAL_CLOTHES);
        return INITIAL_CLOTHES;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Erro ao ler do LocalStorage:', e);
      return INITIAL_CLOTHES;
    }
  },

  // Salvar roupas
  saveClothes(clothes) {
    try {
      localStorage.setItem(STORAGE_KEYS.CLOTHES, JSON.stringify(clothes));
      return true;
    } catch (e) {
      console.error('Erro ao salvar no LocalStorage:', e);
      return false;
    }
  },

  // Histórico de looks usados
  getHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  addHistoryEntry(outfit, occasion = 'Smart Casual', notes = '') {
    const history = this.getHistory();
    const newEntry = {
      id: 'hist_' + Date.now(),
      date: new Date().toISOString(),
      occasion,
      notes,
      items: {
        sup: outfit.sup ? { id: outfit.sup.id, name: outfit.sup.name, img: outfit.sup.img } : null,
        outer: outfit.outer ? { id: outfit.outer.id, name: outfit.outer.name, img: outfit.outer.img } : null,
        inf: outfit.inf ? { id: outfit.inf.id, name: outfit.inf.name, img: outfit.inf.img } : null,
        shoe: outfit.shoe ? { id: outfit.shoe.id, name: outfit.shoe.name, img: outfit.shoe.img } : null,
        acc: outfit.acc ? { id: outfit.acc.id, name: outfit.acc.name, img: outfit.acc.img } : null
      }
    };
    history.unshift(newEntry);
    // Guarda até 100 looks recentes
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history.slice(0, 100)));
    return newEntry;
  },

  // Looks Favoritos
  getFavorites() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveFavorite(outfit, name = 'Meu Look Favorito') {
    const favorites = this.getFavorites();
    const fav = {
      id: 'fav_' + Date.now(),
      name,
      createdAt: new Date().toISOString(),
      supId: outfit.sup?.id,
      outerId: outfit.outer?.id,
      infId: outfit.inf?.id,
      shoeId: outfit.shoe?.id,
      accId: outfit.acc?.id
    };
    favorites.unshift(fav);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    return fav;
  },

  deleteFavorite(favId) {
    const favorites = this.getFavorites().filter(f => f.id !== favId);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    return favorites;
  },

  // Exportar Backup
  exportData() {
    const backup = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      clothes: this.getClothes(),
      history: this.getHistory(),
      favorites: this.getFavorites()
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meu-guarda-roupa-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  // Importar Backup
  importData(jsonData) {
    try {
      const parsed = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      if (Array.isArray(parsed)) {
        this.saveClothes(parsed);
      } else if (parsed.clothes && Array.isArray(parsed.clothes)) {
        this.saveClothes(parsed.clothes);
        if (parsed.history) localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(parsed.history));
        if (parsed.favorites) localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(parsed.favorites));
      } else {
        throw new Error('Formato de arquivo inválido.');
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  // Resetar para dados padrão
  resetToDefaults() {
    this.saveClothes(INITIAL_CLOTHES);
    return INITIAL_CLOTHES;
  }
};

// Utilitário para comprimir fotos carregadas pelo usuário via Canvas
export function compressImageFile(file, maxWidth = 600, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Exporta como JPEG otimizado
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}
