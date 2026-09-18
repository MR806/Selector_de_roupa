// Meu Look Diário - Aplicação Principal
import { CATEGORIES, PRESET_LIBRARY, INITIAL_CLOTHES } from './data.js';
import { Storage, compressImageFile } from './storage.js';
import { OutfitGenerator } from './generator.js';

class WardrobeApp {
  constructor() {
    this.clothes = Storage.getClothes();
    this.generator = new OutfitGenerator(this.clothes);
    this.currentTab = 'suggestions';
    this.currentCategoryFilter = 'all';
    this.searchQuery = '';
    
    // Filtros de Geração
    this.weatherFilter = 'any';
    this.occasionFilter = 'any';
    this.currentSuggestions = [];

    // Estado do Studio de Montagem
    this.studioSlot = 'superior';
    this.studioOutfit = {
      superior: null,
      sobreposicao: null,
      inferior: null,
      calcado: null,
      acessorio: null
    };

    // Imagem do Modal
    this.currentModalImage = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80';

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateHeaderMetrics();
    this.renderCategoryFilters();
    this.renderWardrobe();
    this.generateDailySuggestions();
    this.setupStudioDefault();
    this.renderLaundry();
    this.renderHistoryAndStats();
    this.renderPresetImages();

    // Data de hoje
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const todayStr = new Date().toLocaleDateString('pt-BR', options);
    const dateEl = document.getElementById('currentDateDisplay');
    if (dateEl) {
      dateEl.textContent = todayStr.charAt(0).toUpperCase() + todayStr.slice(1);
    }
  }

  // ==========================================
  // NOTIFICAÇÕES & MODAIS
  // ==========================================
  showToast(message, type = 'success', icon = 'fa-check') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <i class="fa-solid ${icon} text-sm"></i>
      <span class="flex-1">${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-out');
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }

  showConfirm({ title, message, icon = 'fa-triangle-exclamation', confirmText = 'Confirmar' }) {
    return new Promise((resolve) => {
      const modal = document.getElementById('confirmModal');
      const titleEl = document.getElementById('confirmModalTitle');
      const msgEl = document.getElementById('confirmModalMessage');
      const okBtn = document.getElementById('confirmModalOkBtn');
      const cancelBtn = document.getElementById('confirmModalCancelBtn');
      const iconEl = document.getElementById('confirmModalIcon');

      titleEl.textContent = title;
      msgEl.textContent = message;
      okBtn.textContent = confirmText;
      iconEl.innerHTML = `<i class="fa-solid ${icon}"></i>`;

      modal.classList.remove('hidden');
      modal.classList.add('flex');

      const handleOk = () => {
        cleanup();
        resolve(true);
      };

      const handleCancel = () => {
        cleanup();
        resolve(false);
      };

      const cleanup = () => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        okBtn.removeEventListener('click', handleOk);
        cancelBtn.removeEventListener('click', handleCancel);
      };

      okBtn.addEventListener('click', handleOk);
      cancelBtn.addEventListener('click', handleCancel);
    });
  }

  // ==========================================
  // EVENT LISTENERS GERAIS
  // ==========================================
  setupEventListeners() {
    // Abas de Navegação
    document.querySelectorAll('.nav-tab').forEach(tabBtn => {
      tabBtn.addEventListener('click', (e) => {
        const tabName = tabBtn.dataset.tab;
        this.switchTab(tabName);
      });
    });

    // Dropdown de mais ações
    const moreBtn = document.getElementById('moreActionsMenuBtn');
    const dropdown = document.getElementById('moreActionsDropdown');
    moreBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('hidden');
    });
    document.addEventListener('click', () => dropdown.classList.add('hidden'));

    // Botão Header Lavar Roupas / Novo Ciclo
    document.getElementById('headerResetCycleBtn').addEventListener('click', () => this.handleResetCycle());

    // Exportar e Importar Backup
    document.getElementById('exportBackupBtn').addEventListener('click', () => {
      Storage.exportData();
      this.showToast('Backup exportado com sucesso!', 'info', 'fa-download');
    });

    const importInput = document.getElementById('importBackupInput');
    importInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const success = Storage.importData(ev.target.result);
        if (success) {
          this.clothes = Storage.getClothes();
          this.generator.setClothes(this.clothes);
          this.refreshAllViews();
          this.showToast('Backup restaurado com sucesso!', 'success', 'fa-cloud-arrow-up');
        } else {
          this.showToast('Falha ao importar backup. Arquivo inválido.', 'error', 'fa-triangle-exclamation');
        }
      };
      reader.readAsText(file);
      importInput.value = '';
    });

    // Restaurar Cápsula Padrão
    document.getElementById('resetDefaultsBtn').addEventListener('click', async () => {
      const ok = await this.showConfirm({
        title: 'Restaurar Cápsula Padrão?',
        message: 'Todas as roupas cadastradas serão redefinidas para o conjunto inicial minimalista.',
        icon: 'fa-arrows-rotate',
        confirmText: 'Restaurar Tudo'
      });
      if (ok) {
        this.clothes = Storage.resetToDefaults();
        this.generator.setClothes(this.clothes);
        this.refreshAllViews();
        this.showToast('Guarda-roupa restaurado para a cápsula padrão.', 'info', 'fa-rotate-left');
      }
    });

    // Filtros de Geração de Looks
    document.getElementById('weatherSelect').addEventListener('change', (e) => {
      this.weatherFilter = e.target.value;
      this.generateDailySuggestions();
    });

    document.getElementById('occasionSelect').addEventListener('change', (e) => {
      this.occasionFilter = e.target.value;
      this.generateDailySuggestions();
    });

    document.getElementById('generateBtn').addEventListener('click', () => {
      this.generateDailySuggestions();
      this.showToast('Novas combinações geradas!', 'info', 'fa-wand-magic-sparkles');
    });

    // Busca no Guarda-Roupa
    const searchInput = document.getElementById('wardrobeSearchInput');
    searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase().trim();
      this.renderWardrobe();
    });

    // Modal de Adicionar/Editar
    const addModal = document.getElementById('addModal');
    document.getElementById('openAddModalBtn').addEventListener('click', () => this.openAddEditModal());
    document.getElementById('closeAddModalBtn').addEventListener('click', () => addModal.classList.add('hidden'));
    document.getElementById('cancelModalBtn').addEventListener('click', () => addModal.classList.add('hidden'));

    // Abas de Imagem no Modal
    this.setupImageModalTabs();

    // Formulário de Adicionar/Editar
    document.getElementById('addItemForm').addEventListener('submit', (e) => this.handleSaveItem(e));

    // Studio: Botão de sortear e botão de vestir
    document.getElementById('studioRandomizeBtn').addEventListener('click', () => this.randomizeStudioOutfit());
    document.getElementById('studioWearBtn').addEventListener('click', () => this.wearStudioOutfit());

    // Lavanderia: Lavar todas as peças
    document.getElementById('laundryWashAllBtn').addEventListener('click', () => this.handleResetCycle());
  }

  // Troca de Abas
  switchTab(tabName) {
    this.currentTab = tabName;

    // Atualiza botões
    document.querySelectorAll('.nav-tab').forEach(btn => {
      if (btn.dataset.tab === tabName) {
        btn.className = 'nav-tab active-nav-tab flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-neutral-800/80 transition';
      } else {
        btn.className = 'nav-tab flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-stone-400 hover:text-stone-200 hover:bg-neutral-800/40 transition';
      }
    });

    // Atualiza seções
    document.querySelectorAll('.tab-content').forEach(sec => sec.classList.add('hidden'));
    const activeSection = document.getElementById(`tab-${tabName}`);
    if (activeSection) {
      activeSection.classList.remove('hidden');
    }

    // Ações específicas de render
    if (tabName === 'wardrobe') this.renderWardrobe();
    if (tabName === 'studio') this.renderStudio();
    if (tabName === 'laundry') this.renderLaundry();
    if (tabName === 'history') this.renderHistoryAndStats();
  }

  // Atualizar contadores no Header
  updateHeaderMetrics() {
    const total = this.clothes.length;
    const available = this.clothes.filter(c => c.available).length;
    const inLaundry = total - available;

    const headerStatus = document.getElementById('headerStatusCount');
    if (headerStatus) {
      headerStatus.textContent = `${total} peças (${available} limpas)`;
    }

    const wardrobeBadge = document.getElementById('wardrobeBadgeCount');
    if (wardrobeBadge) wardrobeBadge.textContent = total;

    const laundryBadge = document.getElementById('laundryBadgeCount');
    if (laundryBadge) {
      if (inLaundry > 0) {
        laundryBadge.textContent = inLaundry;
        laundryBadge.classList.remove('hidden');
      } else {
        laundryBadge.classList.add('hidden');
      }
    }

    const utilRate = document.getElementById('capsuleUtilizationRate');
    if (utilRate) {
      const pct = total > 0 ? Math.round((available / total) * 100) : 100;
      utilRate.textContent = `${pct}% disponível (${inLaundry} na lavanderia)`;
    }
  }

  refreshAllViews() {
    this.updateHeaderMetrics();
    this.renderCategoryFilters();
    this.renderWardrobe();
    this.generateDailySuggestions();
    this.renderStudio();
    this.renderLaundry();
    this.renderHistoryAndStats();
  }

  // ==========================================
  // ABA 1: SUGESTÕES DO DIA
  // ==========================================
  generateDailySuggestions() {
    this.generator.setClothes(this.clothes);
    const result = this.generator.generateSuggestions({
      count: 3,
      weather: this.weatherFilter,
      occasion: this.occasionFilter,
      includeOuter: 'auto'
    });

    const grid = document.getElementById('suggestionsGrid');
    grid.innerHTML = '';

    if (!result.success || result.outfits.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full bg-white border border-dashed border-stone-300 rounded-2xl p-10 text-center text-stone-500 shadow-sm">
          <div class="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3 text-2xl">
            <i class="fa-solid fa-soap"></i>
          </div>
          <h3 class="text-base font-bold text-neutral-900 mb-1">Guarda-Roupa em Ciclo de Lavagem</h3>
          <p class="text-xs text-stone-500 max-w-md mx-auto mb-5">
            Não há peças limpas suficientes para formar novas combinações completas no clima/estilo selecionado.
          </p>
          <button onclick="app.handleResetCycle()" class="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition shadow-sm inline-flex items-center gap-2">
            <i class="fa-solid fa-rotate"></i>
            <span>Renovar Ciclo & Limpar Roupas</span>
          </button>
        </div>
      `;
      return;
    }

    this.currentSuggestions = result.outfits;

    result.outfits.forEach((outfit, index) => {
      const card = document.createElement('div');
      card.className = "bg-white border border-stone-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between";

      const renderPieceRow = (item, label, catKey) => {
        if (!item) return '';
        return `
          <div class="flex items-center justify-between gap-3 bg-stone-50/80 p-2.5 rounded-xl border border-stone-200/60 group">
            <div class="flex items-center gap-3 min-w-0">
              <img src="${item.img}" alt="${item.name}" class="w-12 h-12 rounded-lg object-cover bg-stone-200 flex-shrink-0">
              <div class="min-w-0">
                <span class="text-[10px] font-bold uppercase text-stone-400 tracking-wider block">${label}</span>
                <p class="text-xs font-semibold text-neutral-800 truncate">${item.name}</p>
                <span class="text-[10px] text-stone-500 capitalize">${this.getToneBadge(item.tone)}</span>
              </div>
            </div>
            <button onclick="app.swapSuggestionItem(${index}, '${catKey}')" title="Trocar por outra peça disponível" class="opacity-0 group-hover:opacity-100 p-2 text-stone-400 hover:text-neutral-900 rounded-lg hover:bg-stone-200/60 transition text-xs">
              <i class="fa-solid fa-arrows-rotate"></i>
            </button>
          </div>
        `;
      };

      card.innerHTML = `
        <div>
          <!-- Header do Look -->
          <div class="flex justify-between items-center mb-4 pb-3 border-b border-stone-100">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-neutral-900 text-white text-[11px] font-bold flex items-center justify-center">${index + 1}</span>
              <span class="text-xs font-bold uppercase tracking-wider text-neutral-900">Look Sugerido</span>
            </div>
            <span class="text-[10px] font-semibold px-2.5 py-1 rounded-full ${outfit.badge.bg} flex items-center gap-1.5">
              <i class="fa-solid ${outfit.badge.icon}"></i>
              <span>${outfit.badge.label}</span>
            </span>
          </div>

          <!-- Peças do Look -->
          <div class="space-y-2.5 mb-5">
            ${renderPieceRow(outfit.outer, 'Sobreposição', 'sobreposicao')}
            ${renderPieceRow(outfit.sup, 'Parte Superior', 'superior')}
            ${renderPieceRow(outfit.inf, 'Parte Inferior', 'inferior')}
            ${renderPieceRow(outfit.shoe, 'Calçado', 'calcado')}
            ${outfit.acc ? renderPieceRow(outfit.acc, 'Acessório', 'acessorio') : ''}
          </div>
        </div>

        <!-- Ação Vestir Look -->
        <button onclick="app.selectSuggestionOutfit(${index})" class="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold py-3 rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-2 active:scale-95">
          <i class="fa-solid fa-check"></i>
          <span>Vestir Este Look Hoje</span>
        </button>
      `;

      grid.appendChild(card);
    });
  }

  getToneBadge(tone) {
    if (tone === 'dark') return 'Tom Escuro';
    if (tone === 'light') return 'Tom Claro';
    if (tone === 'neutral') return 'Tom Neutro / Terra';
    return tone;
  }

  swapSuggestionItem(outfitIndex, category) {
    const currentOutfit = this.currentSuggestions[outfitIndex];
    if (!currentOutfit) return;

    const newItem = this.generator.swapSingleItem(currentOutfit, category);
    if (!newItem) {
      this.showToast(`Não há outras opções disponíveis de ${category}.`, 'warning', 'fa-circle-exclamation');
      return;
    }

    if (category === 'superior') currentOutfit.sup = newItem;
    else if (category === 'inferior') currentOutfit.inf = newItem;
    else if (category === 'calcado') currentOutfit.shoe = newItem;
    else if (category === 'sobreposicao') currentOutfit.outer = newItem;
    else if (category === 'acessorio') currentOutfit.acc = newItem;

    // Recalcula badge
    currentOutfit.badge = this.generator.getStyleBadge(currentOutfit.sup, currentOutfit.inf, currentOutfit.shoe, currentOutfit.outer);

    this.showToast(`Peça alterada para ${newItem.name}`, 'info', 'fa-arrows-rotate');
    this.generateDailySuggestions();
  }

  async selectSuggestionOutfit(index) {
    const outfit = this.currentSuggestions[index];
    if (!outfit) return;

    const itemsToWear = [outfit.sup, outfit.inf, outfit.shoe];
    if (outfit.outer) itemsToWear.push(outfit.outer);
    if (outfit.acc) itemsToWear.push(outfit.acc);

    const ids = itemsToWear.filter(Boolean).map(i => i.id);

    // Marca itens como indisponíveis (na lavagem) e incrementa contagem de uso
    this.clothes = this.clothes.map(c => {
      if (ids.includes(c.id)) {
        return {
          ...c,
          available: false,
          timesWorn: (c.timesWorn || 0) + 1
        };
      }
      return c;
    });

    Storage.saveClothes(this.clothes);
    Storage.addHistoryEntry(outfit, outfit.badge.label);

    this.refreshAllViews();
    this.showToast('Look vestido com sucesso! Peças movidas para a lavagem semanal.', 'success', 'fa-sparkles');
  }

  // ==========================================
  // ABA 2: GUARDA-ROUPA
  // ==========================================
  renderCategoryFilters() {
    const container = document.getElementById('categoryFilterContainer');
    container.innerHTML = '';

    CATEGORIES.forEach(cat => {
      const count = cat.id === 'all' 
        ? this.clothes.length 
        : this.clothes.filter(c => c.category === cat.id).length;

      const isActive = this.currentCategoryFilter === cat.id;
      const btn = document.createElement('button');
      btn.className = `flex items-center gap-2 px-3.5 py-1.5 rounded-full transition whitespace-nowrap ${
        isActive 
          ? 'bg-neutral-900 text-white shadow-sm' 
          : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
      }`;
      btn.innerHTML = `
        <i class="fa-solid ${cat.icon} text-xs"></i>
        <span>${cat.label}</span>
        <span class="text-[10px] ${isActive ? 'bg-neutral-700 text-stone-200' : 'bg-stone-100 text-stone-500'} px-1.5 py-0.5 rounded-full">${count}</span>
      `;

      btn.addEventListener('click', () => {
        this.currentCategoryFilter = cat.id;
        this.renderCategoryFilters();
        this.renderWardrobe();
      });

      container.appendChild(btn);
    });
  }

  renderWardrobe() {
    const grid = document.getElementById('wardrobeGrid');
    grid.innerHTML = '';

    let filtered = this.clothes;

    if (this.currentCategoryFilter !== 'all') {
      filtered = filtered.filter(c => c.category === this.currentCategoryFilter);
    }

    if (this.searchQuery) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(this.searchQuery) ||
        (c.colorName && c.colorName.toLowerCase().includes(this.searchQuery)) ||
        c.category.toLowerCase().includes(this.searchQuery)
      );
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full bg-white rounded-2xl border border-dashed border-stone-200 p-12 text-center text-stone-400">
          <i class="fa-solid fa-shirt text-3xl mb-3 text-stone-300"></i>
          <p class="text-sm font-semibold text-neutral-800">Nenhuma peça encontrada</p>
          <p class="text-xs text-stone-400 mt-1">Tente ajustar a busca ou adicione uma nova peça.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = `cloth-card relative bg-white rounded-xl overflow-hidden border ${item.available ? 'border-stone-200' : 'border-amber-200/80 bg-stone-50/70'} flex flex-col justify-between`;

      card.innerHTML = `
        <div class="relative h-36 w-full bg-stone-100 overflow-hidden group">
          <img src="${item.img}" alt="${item.name}" class="w-full h-full object-cover transition duration-300 group-hover:scale-105">
          
          <!-- Badge de Status de Lavagem / Disponibilidade (Clicável) -->
          <button onclick="app.toggleItemAvailability('${item.id}')" title="Clique para alternar status de lavagem" class="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md transition ${
            item.available 
              ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
              : 'bg-amber-600 text-white hover:bg-amber-700'
          }">
            <i class="fa-solid ${item.available ? 'fa-check' : 'fa-soap'} mr-1"></i>
            ${item.available ? 'Limpa' : 'Na Lavagem'}
          </button>

          <!-- Ações Rápidas (Editar / Excluir) -->
          <div class="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
            <button onclick="app.editItem('${item.id}')" title="Editar" class="w-7 h-7 bg-neutral-900/80 hover:bg-neutral-900 text-white rounded-full flex items-center justify-center text-[11px] shadow">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button onclick="app.deleteItem('${item.id}')" title="Excluir" class="w-7 h-7 bg-red-600/90 hover:bg-red-700 text-white rounded-full flex items-center justify-center text-[11px] shadow">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>

        <div class="p-3 flex-1 flex flex-col justify-between">
          <div>
            <h4 class="text-xs font-bold text-neutral-900 line-clamp-1" title="${item.name}">${item.name}</h4>
            <div class="flex items-center gap-1.5 mt-1 text-[10px] text-stone-500">
              <span class="capitalize">${this.getCategoryLabel(item.category)}</span>
              <span>•</span>
              <span class="capitalize">${item.colorName || this.getToneBadge(item.tone)}</span>
            </div>
          </div>

          <div class="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-400">
            <span>Usado: <strong class="text-neutral-700 font-mono">${item.timesWorn || 0}x</strong></span>
            <button onclick="app.toggleItemAvailability('${item.id}')" class="hover:text-neutral-900 font-semibold underline text-[10px]">
              ${item.available ? 'Enviar p/ Lavar' : 'Marcar Limpa'}
            </button>
          </div>
        </div>
      `;

      grid.appendChild(card);
    });
  }

  getCategoryLabel(cat) {
    const c = CATEGORIES.find(x => x.id === cat);
    return c ? c.label : cat;
  }

  toggleItemAvailability(id) {
    const item = this.clothes.find(c => c.id === id);
    if (!item) return;

    item.available = !item.available;
    Storage.saveClothes(this.clothes);
    this.refreshAllViews();

    const statusStr = item.available ? 'marcada como limpa' : 'enviada para a lavagem';
    this.showToast(`"${item.name}" foi ${statusStr}.`, 'info', item.available ? 'fa-check' : 'fa-soap');
  }

  async deleteItem(id) {
    const item = this.clothes.find(c => c.id === id);
    if (!item) return;

    const ok = await this.showConfirm({
      title: 'Excluir Peça de Roupa?',
      message: `Tem certeza que deseja remover "${item.name}" do seu guarda-roupa?`,
      icon: 'fa-trash',
      confirmText: 'Excluir Peça'
    });

    if (ok) {
      this.clothes = this.clothes.filter(c => c.id !== id);
      Storage.saveClothes(this.clothes);
      this.refreshAllViews();
      this.showToast(`Peça removida do guarda-roupa.`, 'info', 'fa-trash');
    }
  }

  // ==========================================
  // MODAL DE CADASTRO E EDIÇÃO
  // ==========================================
  setupImageModalTabs() {
    const tabUpload = document.getElementById('imgTabUpload');
    const tabUrl = document.getElementById('imgTabUrl');
    const tabPreset = document.getElementById('imgTabPreset');

    const secUpload = document.getElementById('imgSectionUpload');
    const secUrl = document.getElementById('imgSectionUrl');
    const secPreset = document.getElementById('imgSectionPreset');

    const fileInput = document.getElementById('itemImageFile');
    const urlInput = document.getElementById('itemImageUrl');
    const preview = document.getElementById('itemImagePreview');

    const setTab = (activeTab, activeSec) => {
      [tabUpload, tabUrl, tabPreset].forEach(t => {
        t.className = 'px-3 py-1 bg-stone-100 text-stone-700 hover:bg-stone-200 rounded-lg font-medium';
      });
      activeTab.className = 'px-3 py-1 bg-neutral-900 text-white rounded-lg font-medium';

      [secUpload, secUrl, secPreset].forEach(s => s.classList.add('hidden'));
      activeSec.classList.remove('hidden');
    };

    tabUpload.addEventListener('click', () => setTab(tabUpload, secUpload));
    tabUrl.addEventListener('click', () => setTab(tabUrl, secUrl));
    tabPreset.addEventListener('click', () => setTab(tabPreset, secPreset));

    // Manipular File Upload com compressão Canvas
    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          const compressed = await compressImageFile(file, 600, 0.8);
          this.currentModalImage = compressed;
          preview.src = compressed;
        } catch (err) {
          console.error(err);
        }
      }
    });

    // Manipular URL
    urlInput.addEventListener('input', (e) => {
      if (e.target.value.trim()) {
        this.currentModalImage = e.target.value.trim();
        preview.src = this.currentModalImage;
      }
    });
  }

  renderPresetImages() {
    const list = document.getElementById('presetImagesList');
    list.innerHTML = '';

    PRESET_LIBRARY.forEach((preset, idx) => {
      const div = document.createElement('div');
      div.className = 'relative cursor-pointer rounded-lg overflow-hidden border border-stone-200 hover:border-neutral-900 transition h-16';
      div.innerHTML = `
        <img src="${preset.img}" class="w-full h-full object-cover">
        <span class="absolute inset-x-0 bottom-0 bg-neutral-900/80 text-[9px] text-white px-1 py-0.5 truncate">${preset.name}</span>
      `;
      div.addEventListener('click', () => {
        this.currentModalImage = preset.img;
        document.getElementById('itemImagePreview').src = preset.img;
        document.getElementById('itemName').value = document.getElementById('itemName').value || preset.name;
        document.getElementById('itemCategory').value = preset.category;
        document.getElementById('itemColorTone').value = preset.tone;
        this.showToast(`Modelo visual "${preset.name}" selecionado!`, 'info', 'fa-image');
      });
      list.appendChild(div);
    });
  }

  openAddEditModal(editItem = null) {
    const modal = document.getElementById('addModal');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('addItemForm');
    const preview = document.getElementById('itemImagePreview');

    form.reset();

    if (editItem) {
      title.textContent = 'Editar Peça de Roupa';
      document.getElementById('editItemId').value = editItem.id;
      document.getElementById('itemName').value = editItem.name;
      document.getElementById('itemCategory').value = editItem.category;
      document.getElementById('itemColorTone').value = editItem.tone;
      this.currentModalImage = editItem.img;
      preview.src = editItem.img;

      if (editItem.weather) {
        document.querySelectorAll('input[name="itemWeather"]').forEach(cb => {
          cb.checked = editItem.weather.includes(cb.value);
        });
      }
    } else {
      title.textContent = 'Cadastrar Peça de Roupa';
      document.getElementById('editItemId').value = '';
      this.currentModalImage = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80';
      preview.src = this.currentModalImage;
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  editItem(id) {
    const item = this.clothes.find(c => c.id === id);
    if (item) {
      this.openAddEditModal(item);
    }
  }

  handleSaveItem(e) {
    e.preventDefault();
    const editId = document.getElementById('editItemId').value;
    const name = document.getElementById('itemName').value.trim();
    const category = document.getElementById('itemCategory').value;
    const tone = document.getElementById('itemColorTone').value;

    const weather = Array.from(document.querySelectorAll('input[name="itemWeather"]:checked')).map(cb => cb.value);

    if (!name) return;

    if (editId) {
      // Editar item existente
      this.clothes = this.clothes.map(c => {
        if (c.id === editId) {
          return {
            ...c,
            name,
            category,
            tone,
            weather: weather.length ? weather : ['hot', 'mild', 'cold'],
            img: this.currentModalImage
          };
        }
        return c;
      });
      this.showToast(`Peça "${name}" atualizada com sucesso!`, 'success', 'fa-check');
    } else {
      // Criar novo item
      const newItem = {
        id: 'c_' + Date.now(),
        name,
        category,
        tone,
        colorName: this.getToneBadge(tone),
        weather: weather.length ? weather : ['hot', 'mild', 'cold'],
        style: ['casual', 'smart_casual'],
        available: true,
        timesWorn: 0,
        img: this.currentModalImage
      };
      this.clothes.push(newItem);
      this.showToast(`Nova peça "${name}" adicionada ao guarda-roupa!`, 'success', 'fa-plus');
    }

    Storage.saveClothes(this.clothes);
    this.refreshAllViews();
    document.getElementById('addModal').classList.add('hidden');
  }

  // ==========================================
  // ABA 3: MONTADOR DE LOOKS (STUDIO)
  // ==========================================
  setupStudioDefault() {
    // Escolhe primeiras peças disponíveis
    const sup = this.clothes.find(c => c.category === 'superior' && c.available);
    const inf = this.clothes.find(c => c.category === 'inferior' && c.available);
    const shoe = this.clothes.find(c => c.category === 'calcado' && c.available);

    if (sup) this.studioOutfit.superior = sup;
    if (inf) this.studioOutfit.inferior = inf;
    if (shoe) this.studioOutfit.calcado = shoe;

    this.renderStudio();
  }

  selectStudioSlot(slotName) {
    this.studioSlot = slotName;
    const titles = {
      superior: 'Escolher: Peça Superior',
      sobreposicao: 'Escolher: Sobreposição / Casaco',
      inferior: 'Escolher: Peça Inferior',
      calcado: 'Escolher: Calçado',
      acessorio: 'Escolher: Acessório'
    };
    document.getElementById('studioSelectorTitle').textContent = titles[slotName] || 'Escolher Peça';
    this.renderStudioSelectorList();
  }

  renderStudio() {
    const updatePreviewSlot = (slotKey, iconClass, defaultText) => {
      const item = this.studioOutfit[slotKey];
      const imgEl = document.getElementById(`studio-preview-${slotKey}-img`);
      const nameEl = document.getElementById(`studio-preview-${slotKey}-name`);

      if (item) {
        imgEl.innerHTML = `<img src="${item.img}" class="w-full h-full object-cover">`;
        nameEl.textContent = item.name;
      } else {
        imgEl.innerHTML = `<i class="fa-solid ${iconClass} text-stone-400 text-lg"></i>`;
        nameEl.textContent = defaultText;
      }
    };

    updatePreviewSlot('sobreposicao', 'fa-vest', 'Nenhum casaco (Opcional)');
    updatePreviewSlot('superior', 'fa-shirt', 'Selecione uma parte superior');
    updatePreviewSlot('inferior', 'fa-socks', 'Selecione uma parte inferior');
    updatePreviewSlot('calcado', 'fa-shoe-prints', 'Selecione um calçado');
    updatePreviewSlot('acessorio', 'fa-glasses', 'Nenhum acessório (Opcional)');

    this.renderStudioSelectorList();
  }

  renderStudioSelectorList() {
    const container = document.getElementById('studioItemsGrid');
    container.innerHTML = '';

    const available = this.clothes.filter(c => c.category === this.studioSlot && c.available);
    document.getElementById('studioAvailableCount').textContent = `${available.length} disponíveis`;

    if (available.length === 0) {
      container.innerHTML = `<p class="col-span-full text-center text-xs text-stone-400 py-12">Nenhuma peça disponível nesta categoria.</p>`;
      return;
    }

    available.forEach(item => {
      const isSelected = this.studioOutfit[this.studioSlot]?.id === item.id;
      const card = document.createElement('div');
      card.className = `p-2 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
        isSelected ? 'border-neutral-950 bg-stone-100 shadow-sm ring-2 ring-neutral-950' : 'border-stone-200 bg-stone-50 hover:border-stone-400'
      }`;

      card.innerHTML = `
        <div class="h-24 rounded-lg bg-stone-200 overflow-hidden mb-1.5">
          <img src="${item.img}" alt="${item.name}" class="w-full h-full object-cover">
        </div>
        <div class="flex items-center justify-between">
          <h5 class="text-[11px] font-semibold text-neutral-900 truncate flex-1">${item.name}</h5>
          ${isSelected ? '<i class="fa-solid fa-circle-check text-neutral-950 text-xs ml-1"></i>' : ''}
        </div>
      `;

      card.addEventListener('click', () => {
        this.studioOutfit[this.studioSlot] = item;
        this.renderStudio();
        this.showToast(`"${item.name}" adicionado ao look`, 'info', 'fa-check');
      });

      container.appendChild(card);
    });
  }

  randomizeStudioOutfit() {
    const sups = this.clothes.filter(c => c.category === 'superior' && c.available);
    const infs = this.clothes.filter(c => c.category === 'inferior' && c.available);
    const shoes = this.clothes.filter(c => c.category === 'calcado' && c.available);
    const outers = this.clothes.filter(c => c.category === 'sobreposicao' && c.available);
    const accs = this.clothes.filter(c => c.category === 'acessorio' && c.available);

    if (sups.length) this.studioOutfit.superior = sups[Math.floor(Math.random() * sups.length)];
    if (infs.length) this.studioOutfit.inferior = infs[Math.floor(Math.random() * infs.length)];
    if (shoes.length) this.studioOutfit.calcado = shoes[Math.floor(Math.random() * shoes.length)];
    this.studioOutfit.sobreposicao = outers.length && Math.random() > 0.5 ? outers[Math.floor(Math.random() * outers.length)] : null;
    this.studioOutfit.acessorio = accs.length && Math.random() > 0.4 ? accs[Math.floor(Math.random() * accs.length)] : null;

    this.renderStudio();
    this.showToast('Combinação aleatória gerada!', 'info', 'fa-dice');
  }

  wearStudioOutfit() {
    const { superior, inferior, calcado, sobreposicao, acessorio } = this.studioOutfit;
    if (!superior || !inferior || !calcado) {
      this.showToast('Por favor, selecione ao menos uma parte superior, inferior e calçado.', 'warning', 'fa-circle-exclamation');
      return;
    }

    const items = [superior, inferior, calcado, sobreposicao, acessorio].filter(Boolean);
    const ids = items.map(i => i.id);

    this.clothes = this.clothes.map(c => {
      if (ids.includes(c.id)) {
        return {
          ...c,
          available: false,
          timesWorn: (c.timesWorn || 0) + 1
        };
      }
      return c;
    });

    const outfitObj = {
      sup: superior,
      inf: inferior,
      shoe: calcado,
      outer: sobreposicao,
      acc: acessorio
    };

    Storage.saveClothes(this.clothes);
    Storage.addHistoryEntry(outfitObj, 'Personalizado (Estúdio)');

    this.refreshAllViews();
    this.showToast('Look do estúdio vestido e registrado no histórico!', 'success', 'fa-sparkles');
  }

  // ==========================================
  // ABA 4: LAVANDERIA
  // ==========================================
  renderLaundry() {
    const grid = document.getElementById('laundryItemsGrid');
    grid.innerHTML = '';

    const laundryItems = this.clothes.filter(c => !c.available);

    if (laundryItems.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full bg-white rounded-2xl border border-dashed border-stone-200 p-12 text-center text-stone-400">
          <div class="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 text-xl">
            <i class="fa-solid fa-sparkles"></i>
          </div>
          <p class="text-sm font-semibold text-neutral-800">Cesto de Lavanderia Vazio!</p>
          <p class="text-xs text-stone-400 mt-1">Todas as peças do seu guarda-roupa estão limpas e disponíveis.</p>
        </div>
      `;
      return;
    }

    laundryItems.forEach(item => {
      const card = document.createElement('div');
      card.className = "bg-white p-3 rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between";
      card.innerHTML = `
        <div>
          <div class="h-28 rounded-lg overflow-hidden bg-stone-100 mb-2 relative">
            <img src="${item.img}" alt="${item.name}" class="w-full h-full object-cover">
            <span class="absolute top-1.5 left-1.5 bg-amber-600 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded">Na Lavagem</span>
          </div>
          <h4 class="text-xs font-bold text-neutral-900 line-clamp-1">${item.name}</h4>
          <span class="text-[10px] text-stone-400 capitalize">${this.getCategoryLabel(item.category)}</span>
        </div>

        <button onclick="app.toggleItemAvailability('${item.id}')" class="mt-3 w-full bg-stone-100 hover:bg-neutral-900 hover:text-white text-stone-800 text-xs font-semibold py-2 rounded-lg transition flex items-center justify-center gap-1.5">
          <i class="fa-solid fa-check"></i>
          <span>Marcar Limpa</span>
        </button>
      `;

      grid.appendChild(card);
    });
  }

  async handleResetCycle() {
    const inLaundryCount = this.clothes.filter(c => !c.available).length;
    if (inLaundryCount === 0) {
      this.showToast('Todas as roupas já estão limpas!', 'info', 'fa-circle-check');
      return;
    }

    const ok = await this.showConfirm({
      title: 'Renovar Ciclo Semanal?',
      message: `Deseja marcar todas as ${inLaundryCount} roupas do cesto de lavagem como limpas e prontas para uso?`,
      icon: 'fa-rotate',
      confirmText: 'Lavar Tudo Agora'
    });

    if (ok) {
      this.clothes = this.clothes.map(c => ({ ...c, available: true }));
      Storage.saveClothes(this.clothes);
      this.refreshAllViews();
      this.showToast('Ciclo renovado! Todas as roupas estão limpas.', 'success', 'fa-sparkles');
    }
  }

  // ==========================================
  // ABA 5: HISTÓRICO & ESTATÍSTICAS
  // ==========================================
  renderHistoryAndStats() {
    const total = this.clothes.length;
    const available = this.clothes.filter(c => c.available).length;
    const inLaundry = total - available;
    const history = Storage.getHistory();

    document.getElementById('statTotalItems').textContent = total;
    document.getElementById('statAvailableItems').textContent = `${available} peças prontas para uso`;
    document.getElementById('statAvailablePercentage').textContent = total > 0 ? `${Math.round((available / total) * 100)}%` : '100%';
    document.getElementById('statLaundryItems').textContent = inLaundry;
    document.getElementById('statTotalOutfitsWorn').textContent = history.length;
    document.getElementById('historyCountText').textContent = `${history.length} registros`;

    const container = document.getElementById('historyListContainer');
    container.innerHTML = '';

    if (history.length === 0) {
      container.innerHTML = `
        <div class="p-8 text-center text-stone-400 text-xs">
          <i class="fa-solid fa-clock-rotate-left text-2xl mb-2 text-stone-300"></i>
          <p>Nenhum look registrado ainda. Use o botão "Vestir Este Look Hoje" para começar a criar seu histórico!</p>
        </div>
      `;
      return;
    }

    history.forEach((entry) => {
      const date = new Date(entry.date);
      const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

      const row = document.createElement('div');
      row.className = "p-4 rounded-xl border border-stone-200/80 bg-stone-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4";

      const renderThumb = (item) => {
        if (!item) return '';
        return `
          <div class="flex items-center gap-2 bg-white px-2 py-1.5 rounded-lg border border-stone-200/60 shadow-2xs">
            <img src="${item.img}" class="w-8 h-8 rounded object-cover flex-shrink-0">
            <span class="text-xs font-semibold text-neutral-800 line-clamp-1 max-w-[120px]">${item.name}</span>
          </div>
        `;
      };

      row.innerHTML = `
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xs font-bold text-neutral-900">${dateStr}</span>
            <span class="text-[10px] bg-stone-200 text-stone-700 px-2 py-0.5 rounded-md font-semibold">${entry.occasion || 'Smart Casual'}</span>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            ${renderThumb(entry.items.outer)}
            ${renderThumb(entry.items.sup)}
            ${renderThumb(entry.items.inf)}
            ${renderThumb(entry.items.shoe)}
            ${renderThumb(entry.items.acc)}
          </div>
        </div>
      `;

      container.appendChild(row);
    });
  }
}

// Inicializar aplicativo no escopo global
window.app = new WardrobeApp();
