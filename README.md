# ⚡ ARASAKA - MNL // NETRUNNER OPERATIONS
### `[PROJECT ELY-204077 // CLASSIFIED SUB-NET INTERFACE]`

Um projeto focado em criar um site de acesso da Arasaka para um RPG imersivo no universo de **Cyberpunk 2077**, desenvolvido com foco em alta fidelidade estética de HUDs corporativos da Arasaka, efeitos do Blackwall, visualização de dados binários em tempo real e síntese sonora de áudio procedural via Web Audio API.

---

## 📸 Visão Geral

- **Estética Cyberpunk & HUD Diegético**: Scanlines de tubo CRT, vinhetas, molduras táticas vermelhas, marca d'água dinâmica do emblema Arasaka e stream de bytes do Blackwall em canvas.
- **Áudio Procedural Web Audio API**: Efeitos sonoros sintéticos em tempo real (bips de digitação, cliques mecânicos, alertas de ICE breach e pulso de rede) sem necessidade de arquivos de áudio externos.
- **Descriptografia e Matriz de Bits**: Renderização e animação de matriz binária (0/1) reconstruindo o logo da Arasaka e assets confidenciais.
- **HUD Médico de Bio-Telemetria & Digitalização Neural (Referência bla.png & brain.gif)**:
  - **Processo de Abertura do Terminal**: Sequência de boot imersiva demonstrando a digitalização em tempo real do cérebro de Elynalize através do `brain.gif` com laser de varredura e chuva de bytes.
  - **Status do Corpo Biológico**: Holograma do corpo de Elynalize com escala métrica de 0.0' a 6.0', monitorando o estado de estase crio-neural a 4.2°C (corpo separado / sem alma), pulso sintético em 72 BPM e air-gap físico.
  - **Cadeia de DNA & Fórmula Química**: Rotação tridimensional de dupla hélice de DNA em bytes e fórmula molecular do neuro-inibidor Soulkiller MNL-4077.
  - **Eletrocardiograma (ECG) Dinâmico**: Osciloscópio em tempo real traçando onda cardíaca de 72 BPM sincronizada com áudio diegético.
- **Três Fases de Decodificação Interativas**:
  1. `01 // AUTH & LOGO.BITS`: Autenticação ICE, alternador de visualização entre HUD Médico e logotipo Arasaka em bits.
  2. `02 // RELIC & EDGERUNNERS II`: Inspeção de segurança, espectro de visão e travessia da sub-rede.
  3. `03 // CONTAINMENT: ELYNALIZE`: Extração de engrama neural, chip "Pendrive" L2-SEC_EP, galpão de segurança e dossiê médico completo (Arquivo 05).

---

## 📁 Estrutura de Pastas

O repositório foi organizado segundo as melhores práticas para aplicações web estáticas:

```text
Projeto - Revelando o Necessário/
├── 📄 index.html              # Ponto de entrada da aplicação
├── 📁 css/
│   └── 🎨 styles.css          # Estilos globais, HUD, animações e layout responsivo
├── 📁 js/
│   ├── ⚙️ app.js              # Motor da aplicação, canvas do Blackwall, HUD médico e áudio procedural
│   └── 📦 assets.js           # Assets pré-codificados em Base64 (zero problemas de CORS local)
├── 📁 assets/
│   ├── 📁 gif/                # Animações de escaneamento neural
│   │   └── brain.gif          # Cérebro de Elynalize em digitalização
│   ├── 📁 images/             # Imagens principais utilizadas pelo sistema
│   │   ├── Arasaka_Logo_CP2077.webp
│   │   ├── Elynalize pfp.jpg
│   │   ├── galpão.jpg
│   │   └── pendrive.png
│   └── 📁 references/         # Imagens de referência de design e inspiração de HUD
│       ├── bla.png            # Referência original: Medical HUD Interface
│       ├── referencia visual.jpg
│       ├── referencia 2.jpg
│       ├── referencia 3.jpg
│       └── referencia 4.jpg
├── 📄 .gitignore              # Arquivos e pastas ignorados pelo controle de versão
└── 📄 README.md               # Documentação técnica do projeto
```

---

## 🚀 Como Executar Localmente

### Opção 1: Diretamente no Navegador
Por utilizar imagens pré-codificadas em Base64 em `js/assets.js` com fallback para `assets/`, você pode simplesmente dar dois cliques no arquivo:
```bash
index.html
```

### Opção 2: Servidor Local (Recomendado)
Se tiver o Node.js, Python ou a extensão **Live Server** (VS Code) instalados:

**Com Python 3:**
```bash
python -m http.server 3000
```
Acesse: [http://localhost:3000](http://localhost:3000)

**Com Node.js (npx serve):**
```bash
npx serve .
```

---

## 🌐 Publicação no GitHub Pages

Para publicar este projeto gratuitamente no **GitHub Pages**:
1. Vá até o repositório no GitHub.
2. Acesse **Settings** > **Pages** (no menu lateral).
3. Na seção **Branch**, selecione `main` e pasta `/ (root)`.
4. Clique em **Save**.
5. Em poucos instantes, seu projeto estará no ar com link público!

---

## 🛠️ Tecnologias Utilizadas

- **HTML5 Semântico**: Estruturação de HUD, painéis e elementos SVG diegéticos.
- **Vanilla CSS3**: Design system corporativo Arasaka (paleta carmesim `#ff002b`, fontes monoespaçadas, grid, scanlines CRT).
- **Vanilla JavaScript**: Motor de renderização em `<canvas>`, processamento de matriz de bits e transições de estado.
- **Web Audio API**: Geração de som sintético procedural diretamente no navegador.

---

*ARASAKA CORP // ALL RIGHTS RESERVED. UNAUTHORIZED ACCESS TO NETRUNNER MNL PROTOCOLS WILL TRIGGER AUTOMATED BLACK ICE COUNTERMEASURES.*
