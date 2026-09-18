// Motor de Combinações Inteligentes e Estilo Minimalista / Smart Casual

export class OutfitGenerator {
  constructor(clothes) {
    this.clothes = clothes;
  }

  setClothes(clothes) {
    this.clothes = clothes;
  }

  // Filtrar peças por disponibilidade e critérios opcionais
  getAvailableByCategory(category, weather = 'any', occasion = 'any') {
    return this.clothes.filter(c => {
      if (c.category !== category || !c.available) return false;
      if (weather !== 'any' && c.weather && !c.weather.includes(weather)) return false;
      if (occasion !== 'any' && c.style && !c.style.includes(occasion)) return false;
      return true;
    });
  }

  // Avalia a harmonia de cores entre duas ou mais peças
  calculateHarmonyScore(sup, inf, shoe, outer = null) {
    let score = 50;

    // Regra 1: Contraste Clássico Alto (Ex: Peça clara em cima + Peça escura embaixo)
    if ((sup.tone === 'light' && inf.tone === 'dark') || (sup.tone === 'dark' && inf.tone === 'light')) {
      score += 25;
    }

    // Regra 2: Monocromático Sofisticado (Escuro com Escuro ou Neutro com Neutro)
    if (sup.tone === inf.tone) {
      if (sup.tone === 'dark') score += 22; // All-dark é marca registrada do minimalismo
      if (sup.tone === 'neutral') score += 20; // Tons de terra / cinzas
      if (sup.tone === 'light') score += 15; // All-white / off-white
    }

    // Regra 3: Neutro com Escuro ou Neutro com Claro
    if ((sup.tone === 'neutral' && (inf.tone === 'dark' || inf.tone === 'light')) ||
        (inf.tone === 'neutral' && (sup.tone === 'dark' || sup.tone === 'light'))) {
      score += 20;
    }

    // Regra 4: Calçado Harmônico
    if (shoe) {
      // Tênis branco combina com quase qualquer look minimalista
      if (shoe.tone === 'light') score += 15;
      // Calçado escuro com calça escura alonga a silhueta
      if (shoe.tone === 'dark' && inf.tone === 'dark') score += 15;
      // Calçado escuro com look neutro
      if (shoe.tone === 'dark' && inf.tone === 'neutral') score += 10;
    }

    // Regra 5: Sobreposição
    if (outer) {
      if (outer.tone === 'dark' || outer.tone === inf.tone || outer.tone === sup.tone) {
        score += 15;
      }
    }

    // Bonus de rotação: favorece peças menos usadas recentemente
    const avgWorn = ((sup.timesWorn || 0) + (inf.timesWorn || 0) + (shoe?.timesWorn || 0)) / 3;
    score -= avgWorn * 2;

    return score;
  }

  // Determinar rótulo de estilo para o look
  getStyleBadge(sup, inf, shoe, outer) {
    if (sup.tone === 'dark' && inf.tone === 'dark') {
      return { label: 'Monocromático Dark', icon: 'fa-moon', bg: 'bg-neutral-900 text-stone-100' };
    }
    if (sup.tone === 'light' && inf.tone === 'dark') {
      return { label: 'Contraste Clássico', icon: 'fa-circle-half-stroke', bg: 'bg-stone-800 text-stone-100' };
    }
    if (sup.tone === 'neutral' || inf.tone === 'neutral') {
      return { label: 'Tons Nobres & Terra', icon: 'fa-leaf', bg: 'bg-stone-700 text-stone-100' };
    }
    if (outer) {
      return { label: 'Camadas / Layering', icon: 'fa-layer-group', bg: 'bg-neutral-800 text-stone-100' };
    }
    return { label: 'Smart Minimal', icon: 'fa-gem', bg: 'bg-stone-900 text-stone-100' };
  }

  // Gerar N sugestões distintas
  generateSuggestions({ count = 3, weather = 'any', occasion = 'any', includeOuter = 'auto' }) {
    let superiors = this.getAvailableByCategory('superior', weather, occasion);
    let inferiors = this.getAvailableByCategory('inferior', weather, occasion);
    let shoes = this.getAvailableByCategory('calcado', weather, occasion);
    let accessories = this.getAvailableByCategory('acessorio', weather, occasion);
    let outers = this.getAvailableByCategory('sobreposicao', weather, occasion);

    // Fallback: se filtro de clima/ocasião for muito restrito, relaxa para itens disponíveis
    if (superiors.length === 0) superiors = this.clothes.filter(c => c.category === 'superior' && c.available);
    if (inferiors.length === 0) inferiors = this.clothes.filter(c => c.category === 'inferior' && c.available);
    if (shoes.length === 0) shoes = this.clothes.filter(c => c.category === 'calcado' && c.available);
    if (accessories.length === 0) accessories = this.clothes.filter(c => c.category === 'acessorio' && c.available);
    if (outers.length === 0) outers = this.clothes.filter(c => c.category === 'sobreposicao' && c.available);

    if (superiors.length === 0 || inferiors.length === 0 || shoes.length === 0) {
      return {
        success: false,
        error: 'Peças insuficientes no guarda-roupa para compor looks completos. Adicione mais peças ou renove o ciclo de lavagem.',
        missing: {
          superior: superiors.length === 0,
          inferior: inferiors.length === 0,
          calcado: shoes.length === 0
        }
      };
    }

    // Gerar combinações e pontuar
    const candidateOutfits = [];
    const shouldAddOuter = (includeOuter === 'yes') || (includeOuter === 'auto' && (weather === 'cold' || weather === 'mild' || weather === 'rainy') && outers.length > 0);

    // Amostragem combinatória
    for (const sup of superiors) {
      for (const inf of inferiors) {
        for (const shoe of shoes) {
          const acc = accessories.length > 0 ? accessories[Math.floor(Math.random() * accessories.length)] : null;
          const outer = shouldAddOuter && outers.length > 0 ? outers[Math.floor(Math.random() * outers.length)] : null;

          const score = this.calculateHarmonyScore(sup, inf, shoe, outer) + (Math.random() * 8); // Pequena aleatoriedade controlada
          const badge = this.getStyleBadge(sup, inf, shoe, outer);

          candidateOutfits.push({
            id: 'sug_' + Math.random().toString(36).substring(2, 9),
            score,
            badge,
            sup,
            inf,
            shoe,
            acc,
            outer
          });
        }
      }
    }

    // Ordena pelo maior score de harmonia
    candidateOutfits.sort((a, b) => b.score - a.score);

    // Seleciona looks diversos (evita looks com as mesmas peças exatas)
    const selected = [];
    const usedCombos = new Set();

    for (const outfit of candidateOutfits) {
      if (selected.length >= count) break;
      const signature = `${outfit.sup.id}_${outfit.inf.id}_${outfit.shoe.id}`;
      if (!usedCombos.has(signature)) {
        usedCombos.add(signature);
        selected.push(outfit);
      }
    }

    return {
      success: true,
      outfits: selected
    };
  }

  // Trocar apenas 1 item do look mantendo o resto
  swapSingleItem(currentOutfit, category) {
    const available = this.clothes.filter(c => c.category === category && c.available && c.id !== currentOutfit[category]?.id);
    if (available.length === 0) return null;
    const newItem = available[Math.floor(Math.random() * available.length)];
    return newItem;
  }
}
