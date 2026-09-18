# Meu Look Diário — WebApp de Guarda-Roupa Inteligente & Cápsula Minimalista

Um WebApp moderno, elegante e responsivo construído para gerenciar um **guarda-roupa cápsula inteligente**, gerar combinações harmoniosas automáticas (**Smart Casual & Minimalista**) e controlar o **ciclo de lavagem semanal** para evitar repetições excessivas.

---

## ✨ Principais Funcionalidades

### 1. 👔 Sugestões do Dia (Smart Stylist Engine)
- Algoritmo de harmonia cromática (Monocromático Dark, Contraste Clássico, Tons de Terra & Neutros Nobres, Camadas / Layering).
- Filtros contextuais por **Clima** (Calor, Ameno, Frio, Chuva) e **Ocasião** (Smart Casual, Casual Diário, Jantar/Elegante).
- **Troca individual de peças no card**: troque apenas o calçado ou apenas a parte superior sem descartar o look inteiro.
- Botão **"Vestir Este Look Hoje"**: move as peças selecionadas para o cesto de lavagem e registra o look no histórico.

### 2. 🗄️ Acervo do Guarda-Roupa
- Visualização completa com contadores em tempo real por categoria (*Superiores, Sobreposições, Inferiores, Calçados, Acessórios*).
- Campo de busca instantânea por nome, cor ou categoria.
- **Cadastro e Edição de Peças**:
  - Upload de foto com **compressão automática via Canvas** para carregamento ultra-rápido e economia de armazenamento no navegador.
  - Inserção via link/URL externo.
  - Catálogo de **Modelos Visuais Prontos (Presets)** com curadoria minimalista.
- Alternância rápida de status (*Limpa* vs *Na Lavagem*) com 1 clique direto no card.

### 3. ✨ Montador de Looks (Estúdio / Manequim Interativo)
- Crie suas próprias combinações personalizadas escolhendo individualmente:
  - *Sobreposição / Casaco* (Opcional)
  - *Parte Superior*
  - *Parte Inferior*
  - *Calçado*
  - *Acessório* (Opcional)
- Botão de **Sortear Peças** para inspiração rápida.
- Possibilidade de vestir o look customizado e integrá-lo ao histórico.

### 4. 🧺 Lavanderia & Controle de Ciclo
- Visão dedicada de todas as peças atualmente no cesto de lavagem.
- Possibilidade de lavar peças individuais ou usar **"Lavar Todas as Peças / Renovar Ciclo"**.

### 5. 📊 Histórico & Métricas da Cápsula
- Indicadores de total de peças, taxa de disponibilidade (%) e quantidade de looks usados.
- Linha do tempo cronológica com data, hora e visualização das peças utilizadas em cada look.

### 6. 💾 Backup & Privacidade
- 100% privado e salvo no navegador (`LocalStorage`).
- Exportação de backup em formato `.json` e importação a qualquer momento.
- Opção de restaurar para a coleção cápsula inicial padrão.

---

## 🚀 Como Executar

### Opção 1: Abrir diretamente no Navegador
Basta abrir o arquivo `index.html` em qualquer navegador moderno (Chrome, Safari, Edge, Firefox).

### Opção 2: Servidor Local de Desenvolvimento (Node.js)
```bash
npm run dev
# ou
npx serve . -p 3000
```
Acesse em: `http://localhost:3000`

---

## 📁 Estrutura do Projeto

```
Selector_de_roupa/
├── index.html         # Estrutura HTML semântica, abas e modais
├── css/
│   └── styles.css     # Animações, tipografia, toasts e estilo minimalista
├── js/
│   ├── app.js         # Controlador principal e interações da interface
│   ├── data.js        # Banco de dados inicial da cápsula e presets visuais
│   ├── generator.js   # Motor de geração de combinações e regras de estilo
│   └── storage.js     # Gerenciamento de LocalStorage, backup e compressão de fotos
├── package.json       # Configuração de scripts
└── README.md          # Documentação do projeto
```
