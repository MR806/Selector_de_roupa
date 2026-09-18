// Banco de Dados Inicial e Presets do Guarda-Roupa Cápsula Minimalista & Smart Casual

export const INITIAL_CLOTHES = [
  {
    id: 'c1',
    name: 'Camiseta Lã Merino Preta',
    category: 'superior',
    subtype: 'tshirt',
    tone: 'dark',
    colorName: 'Preto',
    weather: ['hot', 'mild', 'cold'],
    style: ['casual', 'smart_casual'],
    available: true,
    timesWorn: 3,
    img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'c2',
    name: 'Camiseta Tricô Trançado Off-White',
    category: 'superior',
    subtype: 'tshirt',
    tone: 'light',
    colorName: 'Off-White',
    weather: ['hot', 'mild'],
    style: ['smart_casual', 'casual'],
    available: true,
    timesWorn: 2,
    img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'c3',
    name: 'Camiseta Casual Verde Oliva',
    category: 'superior',
    subtype: 'tshirt',
    tone: 'neutral',
    colorName: 'Verde Oliva',
    weather: ['hot', 'mild'],
    style: ['casual'],
    available: true,
    timesWorn: 1,
    img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'c4',
    name: 'Camiseta Tricô Azul Marinho',
    category: 'superior',
    subtype: 'tshirt',
    tone: 'dark',
    colorName: 'Azul Marinho',
    weather: ['hot', 'mild'],
    style: ['smart_casual', 'casual'],
    available: true,
    timesWorn: 4,
    img: 'https://images.unsplash.com/photo-1618354691229-88d47f285158?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'c5',
    name: 'Camisa Linho Clássica Branca',
    category: 'superior',
    subtype: 'shirt',
    tone: 'light',
    colorName: 'Branco Puro',
    weather: ['hot', 'mild'],
    style: ['smart_casual', 'formal'],
    available: true,
    timesWorn: 2,
    img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'c6',
    name: 'Polo Piquet Premium Preta',
    category: 'superior',
    subtype: 'polo',
    tone: 'dark',
    colorName: 'Preto Intenso',
    weather: ['hot', 'mild'],
    style: ['smart_casual'],
    available: true,
    timesWorn: 1,
    img: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'c7',
    name: 'Suéter Tricô Canelado Cinza Médio',
    category: 'superior',
    subtype: 'knitwear',
    tone: 'neutral',
    colorName: 'Cinza Mescla',
    weather: ['mild', 'cold'],
    style: ['smart_casual', 'casual'],
    available: true,
    timesWorn: 2,
    img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'c8',
    name: 'Jaqueta Bomber Minimalista Preta',
    category: 'sobreposicao',
    subtype: 'jacket',
    tone: 'dark',
    colorName: 'Preto Fosco',
    weather: ['mild', 'cold', 'rainy'],
    style: ['smart_casual', 'casual'],
    available: true,
    timesWorn: 3,
    img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'c9',
    name: 'Calça Chino Alfaiataria Preta',
    category: 'inferior',
    subtype: 'trousers',
    tone: 'dark',
    colorName: 'Preto',
    weather: ['hot', 'mild', 'cold'],
    style: ['smart_casual', 'formal'],
    available: true,
    timesWorn: 4,
    img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'c10',
    name: 'Calça Chino Bege Areia',
    category: 'inferior',
    subtype: 'trousers',
    tone: 'neutral',
    colorName: 'Areia / Khaki',
    weather: ['hot', 'mild'],
    style: ['smart_casual', 'casual'],
    available: true,
    timesWorn: 2,
    img: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'c11',
    name: 'Calça Jeans Slim Cinza Claro Lavado',
    category: 'inferior',
    subtype: 'jeans',
    tone: 'light',
    colorName: 'Cinza Claro',
    weather: ['hot', 'mild', 'cold'],
    style: ['casual', 'smart_casual'],
    available: true,
    timesWorn: 3,
    img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'c12',
    name: 'Calça Alfaiataria Azul Marinho',
    category: 'inferior',
    subtype: 'trousers',
    tone: 'dark',
    colorName: 'Azul Marinho',
    weather: ['mild', 'cold'],
    style: ['smart_casual', 'formal'],
    available: true,
    timesWorn: 1,
    img: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'c13',
    name: 'Tênis Couro Minimalista Branco',
    category: 'calcado',
    subtype: 'sneakers',
    tone: 'light',
    colorName: 'Branco Neve',
    weather: ['hot', 'mild', 'cold'],
    style: ['casual', 'smart_casual'],
    available: true,
    timesWorn: 6,
    img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'c14',
    name: 'Mocassim / Loafer Couro Preto Nobre',
    category: 'calcado',
    subtype: 'loafers',
    tone: 'dark',
    colorName: 'Preto',
    weather: ['mild', 'hot'],
    style: ['smart_casual', 'formal'],
    available: true,
    timesWorn: 2,
    img: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'c15',
    name: 'Bota Chelsea Couro Marrom Café',
    category: 'calcado',
    subtype: 'boots',
    tone: 'dark',
    colorName: 'Marrom Café',
    weather: ['mild', 'cold', 'rainy'],
    style: ['smart_casual', 'casual'],
    available: true,
    timesWorn: 1,
    img: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'c16',
    name: 'Relógio Analógico Pulseira Metálica Prata',
    category: 'acessorio',
    subtype: 'watch',
    tone: 'light',
    colorName: 'Aço Inox',
    weather: ['hot', 'mild', 'cold', 'rainy'],
    style: ['smart_casual', 'formal', 'casual'],
    available: true,
    timesWorn: 8,
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'c17',
    name: 'Óculos de Sol Acetato Preto Minimalista',
    category: 'acessorio',
    subtype: 'eyewear',
    tone: 'dark',
    colorName: 'Preto Fosco',
    weather: ['hot', 'mild'],
    style: ['casual', 'smart_casual'],
    available: true,
    timesWorn: 5,
    img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'c18',
    name: 'Cinto Couro Legítimo Preto Fivela Prata',
    category: 'acessorio',
    subtype: 'belt',
    tone: 'dark',
    colorName: 'Preto',
    weather: ['hot', 'mild', 'cold', 'rainy'],
    style: ['smart_casual', 'formal'],
    available: true,
    timesWorn: 4,
    img: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=600&q=80'
  }
];

export const CATEGORIES = [
  { id: 'all', label: 'Todos os Itens', icon: 'fa-grip' },
  { id: 'superior', label: 'Superiores', icon: 'fa-shirt' },
  { id: 'sobreposicao', label: 'Sobreposições & Casacos', icon: 'fa-vest' },
  { id: 'inferior', label: 'Inferiores', icon: 'fa-socks' },
  { id: 'calcado', label: 'Calçados', icon: 'fa-shoe-prints' },
  { id: 'acessorio', label: 'Acessórios', icon: 'fa-glasses' }
];

export const WEATHER_OPTIONS = [
  { id: 'any', label: 'Qualquer Clima', icon: 'fa-cloud-sun' },
  { id: 'hot', label: 'Calor / Ensolarado', icon: 'fa-sun' },
  { id: 'mild', label: 'Ameno / Meia-estação', icon: 'fa-wind' },
  { id: 'cold', label: 'Frio / Inverno', icon: 'fa-snowflake' },
  { id: 'rainy', label: 'Chuvoso', icon: 'fa-cloud-rain' }
];

export const OCCASIONS = [
  { id: 'any', label: 'Todas as Ocasiões', icon: 'fa-calendar-days' },
  { id: 'smart_casual', label: 'Smart Casual (Escritório / Reuniões)', icon: 'fa-briefcase' },
  { id: 'casual', label: 'Casual Diário (Café / Lazer)', icon: 'fa-mug-hot' },
  { id: 'formal', label: 'Elegante / Jantar Noturno', icon: 'fa-martini-glass' }
];

export const PRESET_LIBRARY = [
  {
    name: 'Camiseta Gola Careca Preta',
    category: 'superior',
    tone: 'dark',
    img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Camiseta Algodão Egípcio Branca',
    category: 'superior',
    tone: 'light',
    img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Camisa Social Linho Bege',
    category: 'superior',
    tone: 'neutral',
    img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Blazer Estruturado Azul Marinho',
    category: 'sobreposicao',
    tone: 'dark',
    img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Cardigan Tricô Cinza Claro',
    category: 'sobreposicao',
    tone: 'light',
    img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Calça Alfaiataria Cinza Chumbo',
    category: 'inferior',
    tone: 'dark',
    img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Calça Chino Cáqui',
    category: 'inferior',
    tone: 'neutral',
    img: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Tênis Minimalista Couro Branco',
    category: 'calcado',
    tone: 'light',
    img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Loafer Camurça Marrom',
    category: 'calcado',
    tone: 'dark',
    img: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Relógio Minimalista Prateado',
    category: 'acessorio',
    tone: 'neutral',
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'
  }
];
