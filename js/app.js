/**
 * ARASAKA - MNL // NETRUNNER OPERATIONS TERMINAL
 * Project Relic (CP2077) / Edgerunners II Constructs & AI / Omega Containment: ELYNALIZE
 */

(() => {
  'use strict';

  // =========================================================================
  // 1. PROCEDURAL WEBAUDIO CYBERPUNK SOUND ENGINE
  // =========================================================================
  class CyberAudioEngine {
    constructor() {
      this.ctx = null;
      this.enabled = true;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playTone(freq = 440, duration = 0.06, type = 'sawtooth', vol = 0.06, slideTo = null) {
      if (!this.enabled) return;
      try {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);
        if (slideTo) {
          osc.frequency.exponentialRampToValueAtTime(slideTo, now + duration);
        }
        gain.gain.setValueAtTime(vol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + duration);
      } catch (_) {}
    }

    keyClick() {
      this.playTone(980 + Math.random() * 420, 0.03, 'square', 0.035, 320);
    }

    errorBuzz() {
      this.playTone(130, 0.25, 'sawtooth', 0.1, 85);
      setTimeout(() => this.playTone(110, 0.3, 'sawtooth', 0.1, 70), 140);
    }

    gateUnlock(step = 1) {
      const base = 320 + step * 140;
      this.playTone(base, 0.09, 'triangle', 0.07, base * 1.5);
    }

    breachSuccess() {
      [260, 390, 520, 780, 1040].forEach((f, idx) => {
        setTimeout(() => this.playTone(f, 0.14, 'sawtooth', 0.06, f * 1.15), idx * 65);
      });
    }

    dataTick() {
      this.playTone(1400 + Math.random() * 1200, 0.018, 'sine', 0.025);
    }

    omegaAlert() {
      this.playTone(220, 0.35, 'sawtooth', 0.09, 110);
      setTimeout(() => this.playTone(440, 0.25, 'square', 0.06, 220), 180);
    }
  }

  const sfx = new CyberAudioEngine();

  // =========================================================================
  // 2. IMAGE ASSET LOADER (Uses Base64 from assets.js + File Fallback)
  // =========================================================================
  const loadedImages = {};
  const assetSources = {
    logo: (window.ARASAKA_ASSETS && window.ARASAKA_ASSETS.logo) || 'assets/images/Arasaka_Logo_CP2077.webp',
    elynalize: (window.ARASAKA_ASSETS && window.ARASAKA_ASSETS.elynalize) || 'assets/images/Elynalize pfp.jpg',
    pendrive: (window.ARASAKA_ASSETS && window.ARASAKA_ASSETS.pendrive) || 'assets/images/pendrive.png',
    galpao: (window.ARASAKA_ASSETS && window.ARASAKA_ASSETS.galpao) || 'assets/images/galpão.jpg'
  };

  function loadAllAssets() {
    const promises = Object.entries(assetSources).map(([key, src]) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          loadedImages[key] = img;
          resolve();
        };
        img.onerror = () => {
          resolve();
        };
        img.src = src;
      });
    });
    return Promise.all(promises);
  }

  // =========================================================================
  // 3. REFERENCE 4: BLACKWALL RED & BLUE VERTICAL BYTE STREAM CANVAS
  // =========================================================================
  const bwCanvas = document.getElementById('blackwall-canvas');
  const bwCtx = bwCanvas.getContext('2d');
  let bwColumns = [];
  let bwSpeedMultiplier = 1;

  function initBlackwallCanvas() {
    bwCanvas.width = window.innerWidth;
    bwCanvas.height = window.innerHeight;
    const colWidth = 16;
    const count = Math.ceil(bwCanvas.width / colWidth);
    bwColumns = [];
    for (let i = 0; i < count; i++) {
      // Center columns have more blue/cyan Blackwall streaks like Referencia 4
      const distFromCenter = Math.abs(i - count / 2) / (count / 2);
      const isBlue = distFromCenter < 0.38 && Math.random() < 0.45;
      bwColumns.push({
        x: i * colWidth,
        y: Math.random() * bwCanvas.height,
        speed: (1.5 + Math.random() * 4.5),
        isBlue,
        chars: '0101010189ABCDEF'
      });
    }
  }

  function renderBlackwallFrame() {
    bwCtx.fillStyle = 'rgba(4, 0, 2, 0.16)';
    bwCtx.fillRect(0, 0, bwCanvas.width, bwCanvas.height);
    bwCtx.font = '11px "Share Tech Mono", monospace';

    for (let i = 0; i < bwColumns.length; i++) {
      const col = bwColumns[i];
      const ch = col.chars[Math.floor(Math.random() * col.chars.length)];
      if (col.isBlue) {
        bwCtx.fillStyle = Math.random() > 0.82 ? '#aaf8ff' : '#0088ff';
      } else {
        bwCtx.fillStyle = Math.random() > 0.85 ? '#ff7a90' : '#cc0022';
      }
      bwCtx.fillText(ch, col.x, col.y);
      col.y += col.speed * bwSpeedMultiplier;
      if (col.y > bwCanvas.height) {
        col.y = -10;
      }
    }
    requestAnimationFrame(renderBlackwallFrame);
  }

  // =========================================================================
  // 4. LEFT & RIGHT HUD LIVE TELEMETRY (References 2 & 3)
  // =========================================================================
  function initHudWidgets() {
    // Segmented vertical bars (Bottom-Left Referencia 2)
    const cols = [
      document.getElementById('seg-col-0'),
      document.getElementById('seg-col-1'),
      document.getElementById('seg-col-2')
    ];
    cols.forEach((col) => {
      if (!col) return;
      col.innerHTML = '';
      for (let i = 0; i < 12; i++) {
        const cell = document.createElement('div');
        cell.className = 'seg-cell';
        col.appendChild(cell);
      }
    });

    function updateBars() {
      const targets = [
        82 + Math.random() * 16,
        32 + Math.random() * 28,
        76 + Math.random() * 20
      ];
      targets.forEach((val, idx) => {
        const label = document.getElementById(`bar-val-${idx}`);
        if (label) label.textContent = val.toFixed(1);
        const col = cols[idx];
        if (!col) return;
        const activeCount = Math.round((val / 100) * 12);
        Array.from(col.children).forEach((c, cIdx) => {
          c.classList.toggle('lit', cIdx < activeCount);
        });
      });
    }
    updateBars();
    setInterval(updateBars, 900);

    // Kernel Code Stream (Left HUD Referencia 3)
    const kernelLog = document.getElementById('left-kernel-log');
    const kernelLines = [
      'mov eax, [arasaka_mnl_base+0x08]',
      'call _hydra_ice_handshake',
      'cmp dword ptr [relic_sig], 0x2077',
      'jne _soulkiller_trap_handler',
      'xor rdi, rdi ; clear bio_register',
      'lea rsi, [elynalize_engram_0x7F]',
      'syscall // MOUNT L2-SEC_EP',
      'test al, 0xFF ; check containment',
      'jmp short _galpao_sector_09',
      'push 0x204077 ; OMEGA_LOCK'
    ];
    let kIdx = 0;
    setInterval(() => {
      if (!kernelLog) return;
      const hex = Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, '0');
      const line = `[0x${hex}] ${kernelLines[kIdx % kernelLines.length]}`;
      kIdx++;
      const current = kernelLog.textContent.split('\n');
      if (current.length > 9) current.shift();
      current.push(line);
      kernelLog.textContent = current.join('\n');
    }, 650);

    // Right Slash Matrix (Bottom-Right Referencia 3)
    const slashEl = document.getElementById('right-slash-matrix');
    function updateSlashMatrix() {
      if (!slashEl) return;
      let out = '';
      const glyphs = '10/\\|10110101';
      for (let i = 0; i < 210; i++) {
        out += glyphs[Math.floor(Math.random() * glyphs.length)];
      }
      slashEl.textContent = out;
    }
    updateSlashMatrix();
    setInterval(updateSlashMatrix, 500);

    // Right Triplet Matrix live jitter (Referencia 2)
    const tripletContainer = document.getElementById('right-triplet-list');
    setInterval(() => {
      if (!tripletContainer) return;
      const rows = tripletContainer.querySelectorAll('.triplet-row span:last-child');
      if (rows.length > 0) {
        const pick = rows[Math.floor(Math.random() * rows.length)];
        const a = Math.floor(100 + Math.random() * 899);
        const b = Math.floor(10 + Math.random() * 89);
        const c = Math.floor(1000 + Math.random() * 8999);
        pick.textContent = `${a}. ${b}. ${c}.`;
      }
    }, 450);

    // Clock Readout
    const clockEl = document.getElementById('sys-clock-readout');
    setInterval(() => {
      if (!clockEl) return;
      const now = new Date();
      const ms = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0');
      const timeStr = now.toTimeString().split(' ')[0];
      clockEl.textContent = `SUBNET SYNC: 2077.10.24 // ${timeStr}:${ms}`;
    }, 90);

    // Interactive Vision Spectrum Selector (Left HUD Referencia 2)
    const specList = document.getElementById('spectrum-selector');
    if (specList) {
      specList.addEventListener('click', (e) => {
        const li = e.target.closest('li');
        if (!li) return;
        sfx.keyClick();
        specList.querySelectorAll('li').forEach((item) => {
          item.classList.remove('active');
          const txt = item.querySelector('span:first-child');
          if (txt) txt.textContent = txt.textContent.replace('-[', '-').replace(']', '');
        });
        li.classList.add('active');
        const firstSpan = li.querySelector('span:first-child');
        if (firstSpan && !firstSpan.textContent.startsWith('-[')) {
          firstSpan.textContent = `-[${firstSpan.textContent.slice(1)}]`;
        }
        const spec = li.getAttribute('data-spec');
        document.body.classList.remove(
          'spectrum-xray',
          'spectrum-infrared',
          'spectrum-telemetry',
          'spectrum-ultraviolet',
          'spectrum-electromagnetic'
        );
        if (spec && spec !== 'visible') {
          document.body.classList.add(`spectrum-${spec}`);
        }
      });
    }
  }

  // =========================================================================
  // 5. STAGE 1: ARASAKA LOGO IN BITS (Arasaka_Logo_CP2077.webp -> BIT MATRIX)
  // =========================================================================
  const logoCanvas = document.getElementById('logo-bit-canvas');
  const logoCtx = logoCanvas.getContext('2d');
  let logoBitCells = [];
  let logoBuildProgress = 0;
  let logoAnimFrame = null;

  function buildArasakaLogoBitMatrix() {
    const rect = logoCanvas.parentElement.getBoundingClientRect();
    logoCanvas.width = Math.max(520, Math.floor(rect.width));
    logoCanvas.height = Math.max(180, Math.floor(rect.height));

    const off = document.createElement('canvas');
    off.width = logoCanvas.width;
    off.height = logoCanvas.height;
    const octx = off.getContext('2d');

    const img = loadedImages.logo;
    logoBitCells = [];

    if (img) {
      // Fit Arasaka_Logo_CP2077.webp nicely centered
      const scale = Math.min(
        (off.width * 0.86) / img.width,
        (off.height * 0.82) / img.height
      );
      const drawW = img.width * scale;
      const drawH = img.height * scale;
      const drawX = (off.width - drawW) / 2;
      const drawY = (off.height - drawH) / 2;
      octx.drawImage(img, drawX, drawY, drawW, drawH);

      const imgData = octx.getImageData(0, 0, off.width, off.height).data;
      const stepX = 6;
      const stepY = 7;

      for (let y = 0; y < off.height; y += stepY) {
        for (let x = 0; x < off.width; x += stepX) {
          const idx = (y * off.width + x) * 4;
          const r = imgData[idx];
          const g = imgData[idx + 1];
          const b = imgData[idx + 2];
          const a = imgData[idx + 3];

          // Arasaka_Logo_CP2077.webp has red logo on transparent or white background:
          // Check if pixel is predominantly red OR opaque non-white
          const isRedLogo = a > 60 && r > 120 && g < 100 && b < 100;
          if (isRedLogo) {
            logoBitCells.push({
              x,
              y,
              bit: Math.random() > 0.5 ? '1' : '0',
              hex: Math.floor(Math.random() * 16).toString(16).toUpperCase(),
              intensity: r / 255,
              order: (x / off.width) * 0.7 + (y / off.height) * 0.3 + Math.random() * 0.15
            });
          }
        }
      }
    }

    logoBuildProgress = 0;
  }

  function animateArasakaLogoBits(timestamp) {
    logoCtx.fillStyle = 'rgba(6, 0, 2, 0.38)';
    logoCtx.fillRect(0, 0, logoCanvas.width, logoCanvas.height);

    // Subtle background hex grid lines
    logoCtx.strokeStyle = 'rgba(255, 0, 43, 0.08)';
    logoCtx.lineWidth = 1;
    const scanY = (timestamp * 0.08) % logoCanvas.height;
    logoCtx.beginPath();
    logoCtx.moveTo(0, scanY);
    logoCtx.lineTo(logoCanvas.width, scanY);
    logoCtx.stroke();

    if (logoBuildProgress < 1.15) {
      logoBuildProgress += 0.014;
      const pct = Math.min(100, Math.floor((logoBuildProgress / 1.05) * 100));
      const statEl = document.getElementById('logo-bit-stats');
      if (statEl) {
        statEl.textContent =
          pct < 100
            ? `COMPILING ARASAKA LOGO IN BITS: ${pct}% [${logoBitCells.length * 8} BITS]`
            : `ARASAKA LOGO BIT-MATRIX LOCKED // ${logoBitCells.length * 8} BITS ACTIVE`;
      }
    }

    logoCtx.font = 'bold 7px "Share Tech Mono", monospace';
    const waveX = ((timestamp * 0.18) % (logoCanvas.width + 200)) - 100;

    for (let i = 0; i < logoBitCells.length; i++) {
      const c = logoBitCells[i];
      if (c.order > logoBuildProgress) {
        // Streaming falling bit before locking into logo position
        if (c.order - logoBuildProgress < 0.14 && Math.random() < 0.35) {
          logoCtx.fillStyle = '#00f0ff';
          logoCtx.fillText(c.bit, c.x, c.y - (c.order - logoBuildProgress) * 140);
        }
        continue;
      }

      // Pulse wave across compiled bits
      const distWave = Math.abs(c.x - waveX);
      if (distWave < 28) {
        logoCtx.fillStyle = '#ffffff';
        if (Math.random() < 0.15) c.bit = c.bit === '1' ? '0' : '1';
      } else if (distWave < 65) {
        logoCtx.fillStyle = '#ff4d6a';
      } else {
        logoCtx.fillStyle = '#ff002b';
      }

      logoCtx.fillText(c.bit, c.x, c.y);
    }

    logoAnimFrame = requestAnimationFrame(animateArasakaLogoBits);
  }

  // =========================================================================
  // 6. STAGE NAVIGATION & CREDENTIAL AUTHENTICATION
  // =========================================================================
  const VALID_USER = 'admin-arasaka2077';
  const VALID_PASS = 'ely_containment_project204077';
  let currentStage = 1;
  let isUnlocked = false;

  function setStage(stageNum) {
    currentStage = stageNum;
    document.getElementById('stage-login').classList.toggle('active', stageNum === 1);
    document.getElementById('stage-fast-nav').classList.toggle('active', stageNum === 2);
    document.getElementById('stage-containment').classList.toggle('active', stageNum === 3);

    document.getElementById('pill-stage-1').classList.toggle('active', stageNum === 1);
    document.getElementById('pill-stage-2').classList.toggle('active', stageNum === 2);
    document.getElementById('pill-stage-3').classList.toggle('active', stageNum === 3);

    document.getElementById('nav-tab-auth').classList.toggle('active', stageNum === 1);
    document.getElementById('nav-tab-relic').classList.toggle('active', stageNum === 2);
    document.getElementById('nav-tab-ely').classList.toggle('active', stageNum === 3);

    document.body.classList.toggle('mode-breach', stageNum === 2);
    bwSpeedMultiplier = stageNum === 2 ? 3.4 : stageNum === 3 ? 1.4 : 1.0;

    // Update Subnet Diamond Cluster on Right HUD
    const dots = document.querySelectorAll('#subnet-nodes .node-dot');
    dots.forEach((d, idx) => {
      d.classList.remove('active', 'purple');
      if (stageNum === 1 && idx < 3) d.classList.add('active');
      if (stageNum === 2 && idx < 9) d.classList.add('active');
      if (stageNum === 3) {
        d.classList.add(idx >= 6 ? 'purple' : 'active');
      }
    });
  }

  function setupLoginController() {
    const userInput = document.getElementById('input-username');
    const passInput = document.getElementById('input-password');
    const form = document.getElementById('arasaka-login-form');
    const feedback = document.getElementById('login-feedback-msg');
    const autoBtn = document.getElementById('btn-auto-hack');

    [userInput, passInput].forEach((inp) => {
      inp.addEventListener('keydown', () => sfx.keyClick());
    });

    // Auto-type credentials button for smooth live presentation
    let autoTyping = false;
    autoBtn.addEventListener('click', () => {
      if (autoTyping) return;
      autoTyping = true;
      userInput.value = '';
      passInput.value = '';
      passInput.type = 'text'; // Show password being typed in cyber style
      feedback.className = 'login-feedback';
      feedback.textContent = 'INJETANDO CREDENCIAIS DE ACESSO ARASAKA-MNL...';

      let uIdx = 0;
      let pIdx = 0;

      const typeTimer = setInterval(() => {
        if (uIdx < VALID_USER.length) {
          userInput.value += VALID_USER[uIdx++];
          sfx.keyClick();
        } else if (pIdx < VALID_PASS.length) {
          passInput.value += VALID_PASS[pIdx++];
          sfx.keyClick();
        } else {
          clearInterval(typeTimer);
          autoTyping = false;
          setTimeout(() => {
            form.requestSubmit();
          }, 300);
        }
      }, 38);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const u = userInput.value.trim();
      const p = passInput.value.trim();

      if (u !== VALID_USER || p !== VALID_PASS) {
        sfx.errorBuzz();
        feedback.className = 'login-feedback error';
        feedback.textContent =
          'ACESSO NEGADO // CREDENCIAIS INVÁLIDAS. EXIGIDO: admin-arasaka2077 + SENHA DE CONTENÇÃO';
        return;
      }

      // Credentials Verified! Run multi-gate passkey sequence
      isUnlocked = true;
      sfx.breachSuccess();
      feedback.className = 'login-feedback success';
      feedback.textContent =
        'SENHA ACEITA [ely_containment_project204077] // DESBLOQUEANDO CAMADAS DE SEGURANÇA...';

      document.getElementById('header-security-state').textContent =
        'SECURITY: ICE BREACHED // ROOT ACCESS: admin-arasaka2077';
      document.getElementById('prime-directive-banner').textContent =
        'ACCESSING PROJECT ELY-204077';

      const gates = ['chain-1', 'chain-2', 'chain-3', 'chain-4'];
      gates.forEach((gId, idx) => {
        setTimeout(() => {
          sfx.gateUnlock(idx + 1);
          const el = document.getElementById(gId);
          if (el) {
            el.classList.add('unlocked');
            const statusSpan = el.querySelector('span:last-child');
            if (statusSpan) statusSpan.textContent = '[OPEN]';
          }
          if (idx === gates.length - 1) {
            setTimeout(() => startFastNavigationSequence(), 450);
          }
        }, idx * 320);
      });
    });
  }

  // =========================================================================
  // 7. STAGE 2: RAPID SYSTEM NAVIGATION (PROJECT RELIC 2077 & EDGERUNNERS 2)
  // =========================================================================
  const FAST_NODES_DATA = [
    {
      path: '//ARASAKA_MNL/CORE/AUTH_HANDSHAKE_MNL',
      badge: 'NODE 01 // ARASAKA COUNTER-INTEL',
      title: 'INVASÃO DE SUB-REDE ARASAKA — QUEBRA DE ICE NÍVEL 9',
      schematic: 'ICE_TOPOLOGY_MNL.BIN',
      mode: 'grid',
      lore: `> CREDENCIAL ACEITA: admin-arasaka2077\n> CHAVE DE CONTENÇÃO: ely_containment_project204077\n> BYPASSANDO DAEMONS DE DEFESA ARASAKA...\n\nConectando aos servidores subterrâneos de Night City e Tóquio. Redirecionando tráfego através de nós fantasmas para acessar a divisão de Projetos Especiais e Bio-Engenharia Neural.`
    },
    {
      path: '//ARASAKA_MNL/R&D/SECURE_YOUR_SOUL_DB',
      badge: 'NODE 02 // PROGRAMA "GARANTA SUA ALMA"',
      title: 'ARQUITETURA DE DIGITALIZAÇÃO DE CONSCIÊNCIA',
      schematic: 'SOULKILLER_MATRIX_V4.RAW',
      mode: 'wave',
      lore: `> ACESSANDO DIRETÓRIO: SECURE YOUR SOUL (SYS-2077)\n> STATUS DO PROJETO: ATIVO / CLASSIFICAÇÃO ULTRA-SECRETA\n\nMapeamento sináptico completo capaz de converter a mente, memórias e personalidade humana ("Alma") em código binário executável, permitindo armazenamento ou transferência para bio-chips.`
    },
    {
      path: '//ARASAKA_MNL/R&D/PROJECT_RELIC_2077',
      badge: 'NODE 03 // CYBERPUNK 2077 — PROJETO RELIC 2.0',
      title: 'PROJETO RELIC (PROTÓTIPO 2.0) — BIO-CHIP DE ENGRAMA NEURAL',
      schematic: 'RELIC_2.0_BLUEPRINT.CAD',
      mode: 'relic',
      lore: `> ARQUIVO CENTRAL: RELIC 2.0 BIO-CHIP (NIGHT CITY)\n> SUJEITOS DE TESTE REGISTRADOS: ENGRAMA #8912 [J. SILVERHAND] // SABURO ARASAKA\n\nO Relic 2.0 utiliza nanites neuro-reconstrutores para sobrescrever um córtex hospedeiro e instalar um Constructo Digital. Requer conservação térmica rigorosa ou blindagem de contenção dedicada.`
    },
    {
      path: '//ARASAKA_MNL/MIKOSHI/ENGRAM_CLUSTERS',
      badge: 'NODE 04 // FORTALEZA DE DADOS MIKOSHI',
      title: 'PRISÃO DE ALMAS MIKOSHI — EXTRAÇÃO POR SOULKILLER',
      schematic: 'MIKOSHI_ORBITAL_LINK.HEX',
      mode: 'dna',
      lore: `> ESCANEANDO CLUSTERS DE ENGRAMAS EM MIKOSHI...\n> ALMAS ARMAZENADAS: 4.812 CONSTRUCTOS CATALOGADOS\n\nNetrunners de elite capturados pela Arasaka têm sua consciência arrancada do corpo físico pelo programa Soulkiller. Porém, anomalias de nível extremo não podem ficar em Mikoshi pelo risco de infectarem a rede.`
    },
    {
      path: '//ARASAKA_MNL/EDGERUNNERS_II/NEXTGEN_CYBERWARE',
      badge: 'NODE 05 // CYBERPUNK: EDGERUNNERS 2 — PROJETOS DE CAMPO',
      title: 'EDGERUNNERS II — IMPLANTES NEURAIS EXTREMO-LIMITE',
      schematic: 'CYBER_SKELETON_EDG2.BIN',
      mode: 'rings',
      lore: `> ACESSANDO DADOS PÓS-INCIDENTE D. MARTINEZ // EDGERUNNERS II\n> TOLERÂNCIA À CIBERPSICOSE & PONTES DE MERGULHO PROFUNDO\n\nNovos protocolos da Arasaka testados em operativos e mercenários de Night City: interfaces neurais diretas capazes de fundir reflexos de combate com processamento de IA em tempo real.`
    },
    {
      path: '//ARASAKA_MNL/EDGERUNNERS_II/CONSTRUCTS_AND_AI',
      badge: 'NODE 06 // CYBERPUNK: EDGERUNNERS 2 — CONSTRUCTOS & IA',
      title: 'CONSTRUCTOS HÍBRIDOS & INTELIGÊNCIAS ARTIFICIAIS DE COMBATE',
      schematic: 'AI_CONSTRUCT_HYBRID.NET',
      mode: 'ai',
      lore: `> DIVISÃO DE IA & CONSTRUCTOS — EDGERUNNERS II\n> SÍNTESE DE ENGRAMAS HUMANOS COM IAs TÁTICAS\n\nDesenvolvimento de Constructos Autônomos a partir de mentes de Netrunners de alto nível combinadas com algoritmos da Blackwall. Alto risco de rebelião caso a consciência original mantenha sua vontade própria.`
    },
    {
      path: '//ARASAKA_MNL/BEYOND_BLACKWALL/ROGUE_AI_CONTAINMENT',
      badge: 'NODE 07 // PROTOCOLO ALÉM DA BLACKWALL',
      title: 'ISOLAMENTO FÍSICO AIR-GAP PARA AMEAÇAS EXISTENCIAIS',
      schematic: 'BLACKWALL_BREACH_GUARD.SYS',
      mode: 'blackwall',
      lore: `> ALERTA DE SEGURANÇA MÁXIMA DETECTADO!\n> REDIRECIONANDO PARA COFRE DE CONTENÇÃO FÍSICA...\n\nQuando uma Netrunner representa perigo direto de colapso para toda a infraestrutura da Arasaka, sua mente não pode ser conectada à rede. A diretriz exige SEPARAÇÃO TOTAL entre Mente (Chip isolado) e Corpo.`
    },
    {
      path: '//ARASAKA_MNL/OMEGA_VAULT/PROJECT_ELY_204077',
      badge: 'NODE 08 // ARQUIVO RESTRITO ENCONTRADO!',
      title: 'ALVO LOCALIZADO: CONTENÇÃO DA NETRUNNER "ELYNALIZE"',
      schematic: 'TARGET_LOCK_ELYNALIZE.OMEGA',
      mode: 'lock',
      lore: `> DESCRIPTOGRAFANDO DOSSIÊ #204077-ELY...\n> NOME DO ALVO: ELYNALIZE (NETRUNNER DE ALTO NÍVEL)\n> STATUS: NEUTRALIZADA // MENTE E ALMA ARRANCADAS PARA "PENDRIVE" L2-SEC_EP\n> CORPO BIOLÓGICO: RESERVADO EM INSTALAÇÃO SEPARADA\n> INICIANDO RECONSTRUÇÃO VISUAL EM BYTES...`
    }
  ];

  let fastTimer = null;
  let fastStepIndex = 0;
  let fastPaused = false;
  let fastSchematicFrame = null;

  function startFastNavigationSequence() {
    setStage(2);
    fastStepIndex = 0;
    fastPaused = false;
    document.getElementById('btn-pause-fast').textContent = '[PAUSAR STREAM]';
    document.getElementById('footer-stage-hint').textContent =
      'TRAVERSING RELIC 2077 & EDGERUNNERS II DATABASES...';

    renderFastNodeStep(0);
    if (fastTimer) clearInterval(fastTimer);

    fastTimer = setInterval(() => {
      if (fastPaused) return;
      fastStepIndex++;
      if (fastStepIndex >= FAST_NODES_DATA.length) {
        clearInterval(fastTimer);
        openContainmentDossier();
        return;
      }
      renderFastNodeStep(fastStepIndex);
    }, 1050);

    if (!fastSchematicFrame) {
      animateFastSchematic(0);
    }
  }

  function renderFastNodeStep(idx) {
    const data = FAST_NODES_DATA[idx];
    if (!data) return;
    sfx.dataTick();
    if (idx === FAST_NODES_DATA.length - 1) sfx.omegaAlert();

    document.getElementById('fast-current-path').textContent = data.path;
    document.getElementById('fast-card-badge').textContent = data.badge;
    document.getElementById('fast-card-title').textContent = data.title;
    document.getElementById('fast-lore-text').textContent = data.lore;
    document.getElementById('fast-schematic-label').textContent = data.schematic;
    document.getElementById('fast-packet-rate').textContent = `${(12 + Math.random() * 28).toFixed(1)} GB/s`;
    document.getElementById('fast-footer-log').textContent =
      `DECRYPTING SECTOR [${idx + 1}/${FAST_NODES_DATA.length}] // ${data.schematic}`;

    const pct = Math.round(((idx + 1) / FAST_NODES_DATA.length) * 100);
    document.getElementById('fast-progress-bar').style.width = `${pct}%`;

    const nodes = document.querySelectorAll('#fast-dir-tree .dir-node');
    nodes.forEach((n, nIdx) => {
      n.classList.remove('visiting', 'done');
      if (nIdx < idx) n.classList.add('done');
      if (nIdx === idx) n.classList.add('visiting');
    });
  }

  function animateFastSchematic(t) {
    const canvas = document.getElementById('fast-schematic-canvas');
    if (canvas && currentStage === 2) {
      const rect = canvas.parentElement.getBoundingClientRect();
      if (canvas.width !== Math.floor(rect.width)) {
        canvas.width = Math.max(240, Math.floor(rect.width));
        canvas.height = Math.max(160, Math.floor(rect.height - 28));
      }
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'rgba(4, 0, 2, 0.28)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      ctx.strokeStyle = fastStepIndex >= 5 ? '#00f0ff' : '#ff002b';
      ctx.lineWidth = 1.5;

      // Draw dynamic cyber-schematic (Relic chip / AI neural nodes)
      ctx.beginPath();
      for (let i = 0; i < 18; i++) {
        const ang = (i / 18) * Math.PI * 2 + t * 0.002;
        const r = 35 + Math.sin(t * 0.006 + i) * 28;
        const x = cx + Math.cos(ang) * r * 1.4;
        const y = cy + Math.sin(ang) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();

      // Byte dump overlay
      ctx.fillStyle = '#ff6b81';
      ctx.font = '10px "Share Tech Mono", monospace';
      for (let r = 0; r < 6; r++) {
        const hex = Math.floor(Math.random() * 0xffffffff)
          .toString(16)
          .toUpperCase()
          .padStart(8, '0');
        ctx.fillText(`0x${hex}`, 10, 20 + r * 14);
      }
    }
    fastSchematicFrame = requestAnimationFrame(animateFastSchematic);
  }

  // =========================================================================
  // 8. STAGE 3: ELYNALIZE CONTAINMENT DOSSIER & BYTE MATRIX IMAGE REVEALS
  // =========================================================================
  const CONTAINMENT_DOSSIER_DATA = {
    elynalize: {
      subBadge: 'ARQUIVO 01 // IDENTIFICAÇÃO BIOMÉTRICA & ENGRAMA NEURAL',
      heading: 'NETRUNNER: ELYNALIZE',
      filename: 'DECODING IN BYTES: Elynalize_pfp.jpg [80,935 BYTES // NEURAL ENGRAM]',
      lore: `RELATÓRIO DE NEUTRALIZAÇÃO ARASAKA: Elynalize foi classificada como uma Netrunner de alto nível e ameaça crítica direta aos servidores centrais da corporação. Após uma operação de captura em larga escala, ela foi submetida ao protocolo de separação total via Soulkiller: sua mente, memória e alma foram arrancadas de seu corpo físico. O rosto acima é a reconstrução em bytes de sua assinatura neural antes do isolamento.`,
      specs: [
        ['CODINOME / ALVO', 'ELYNALIZE'],
        ['CLASSIFICAÇÃO DE AMEAÇA', 'NÍVEL OMEGA (NETRUNNER DE ELITE)'],
        ['STATUS ATUAL', 'NEUTRALIZADA / DIVIDIDA'],
        ['MENTE & ALMA (CONSCIÊNCIA)', 'EXTRAÍDA EM CHIP ("PENDRIVE")'],
        ['CORPO BIOLÓGICO', 'RESERVADO EM COFRE CRIOGÊNICO DISTINTO'],
        ['INTEGRIDADE DO ENGRAMA', '99.4% (CONSCIÊNCIA ATIVA E CONTIDA)']
      ]
    },
    pendrive: {
      subBadge: 'ARQUIVO 02 // HARDWARE DE CONTENÇÃO DE ALMA (RELIC-DRIVE)',
      heading: 'CHIP "PENDRIVE" L2-SEC_EP',
      filename: 'DECODING IN BYTES: pendrive.png [135,014 BYTES // CONTAINMENT CHIP]',
      lore: `UNIDADE DE CONTENÇÃO "PENDRIVE" (MODELO L2-SEC_EP // QUARITCH, M. / ARASAKA SEC): Dispositivo derivado da tecnologia do Projeto Relic e dos estudos de Constructos de Edgerunners 2. Dentro do invólucro translúcido blindado pulsam as ondas roxas da consciência e da alma de Elynalize, comprimidas em bytes puros e totalmente desconectadas de qualquer rede externa para impedir sua fuga.`,
      specs: [
        ['DISPOSITIVO DE GUARDA', 'CHIP / PENDRIVE NEURAL L2-SEC_EP'],
        ['CONTEÚDO ARMAZENADO', 'CONSCIÊNCIA & ALMA DE ELYNALIZE'],
        ['MARCAÇÃO DE SEGURANÇA', 'AUTHORIZED PERSONNEL ONLY'],
        ['ESPECTRO DE RESSONÂNCIA', 'VIOLETA PROFUNDO (ENGRAMA VIVO)'],
        ['ISOLAMENTO DE REDE', 'AIR-GAP ABSOLUTO (BLOQUEIO ICE FÍSICO)'],
        ['LOCALIZAÇÃO DO PENDRIVE', 'DEPÓSITO / GALPÃO SETOR-09']
      ]
    },
    galpao: {
      subBadge: 'ARQUIVO 03 // LOCALIDADE DO DEPÓSITO DE CONTENÇÃO',
      heading: 'GALPÃO ARASAKA — SETOR 09',
      filename: 'DECODING IN BYTES: galpão.jpg [85,917 BYTES // VAULT LOCATION]',
      lore: `LOCALIZAÇÃO REVELADA EM BYTES: O chip "Pendrive" contendo a mente e a alma de Elynalize está trancado no interior deste Galpão de Contenção de Alta Segurança da Arasaka (câmara blindada em vidro vermelho pressurizado). Enquanto sua consciência permanece presa neste depósito sob vigilância pesada, seu corpo biológico vivo é mantido separadamente em outro complexo secreto para impedir qualquer tentativa de reintegração.`,
      specs: [
        ['INSTALAÇÃO (MENTE/CHIP)', 'GALPÃO DE CONTENÇÃO ARASAKA SETOR-09'],
        ['COORDENADAS DE REDE', '35.6895° N, 139.6917° E // SUB-NÍVEL 4'],
        ['CÂMARA INTERNA', 'SALA BLINDADA VERMELHA (FARADAY CAGE)'],
        ['LOCAL DO CORPO FÍSICO', 'COMPLEXO BIO-TARTARUS (SEPARADO)'],
        ['PROTOCOLO DE GUARDA', 'TURRETS AUTOMÁTICAS + ICE LETAL'],
        ['RISCO DE RESGATE', 'CRÍTICO — NÃO CONECTAR O PENDRIVE']
      ]
    },
    overview: {
      subBadge: 'MATRIZ COMPLETA // DOSSIÊ INTEGRADO EM BYTES',
      heading: 'ELYNALIZE // CHIP // GALPÃO',
      filename: 'MULTI-STREAM BYTE MATRIX: [ROSTO + PENDRIVE + GALPÃO]',
      lore: `VISÃO CONSOLIDADA DA OPERAÇÃO: (1) A Netrunner de alto nível Elynalize, neutralizada pela Arasaka; (2) O chip chamado de "Pendrive" (L2-SEC_EP) onde sua mente e alma estão aprisionadas; e (3) O Galpão de segurança onde o chip está guardado, longe de seu corpo físico reservado em outro espaço.`,
      specs: [
        ['01. SUJEITO NEUTRALIZADO', 'ELYNALIZE (ROSTO EM BYTES)'],
        ['02. PRISÃO DA CONSCIÊNCIA', 'PENDRIVE L2-SEC_EP (CHIP EM BYTES)'],
        ['03. LOCAL DO DEPÓSITO', 'GALPÃO SETOR-09 (LOCAL EM BYTES)'],
        ['SEPARAÇÃO MENTE/CORPO', '100% CONFIRMADA (PROTOCOLO SOULKILLER)'],
        ['CHAVE DE ACESSO USADA', 'ely_containment_project204077'],
        ['OPERADOR CONECTADO', 'admin-arasaka2077']
      ]
    }
  };

  let currentRevealTarget = 'elynalize'; // 'elynalize' | 'pendrive' | 'galpao' | 'overview'
  let currentRenderMode = 'holo'; // 'holo' | 'pure' | 'rednet'
  let decodeProgress = 0;
  let autoCycleEnabled = true;
  let autoCycleTimer = null;
  let byteCanvasFrame = null;

  // Pre-sampled pixel caches for smooth 60fps byte rendering
  const sampledCache = {};

  function openContainmentDossier() {
    if (fastTimer) clearInterval(fastTimer);
    setStage(3);
    sfx.omegaAlert();
    document.getElementById('footer-stage-hint').textContent =
      'OMEGA VAULT UNLOCKED // ELYNALIZE CONTAINMENT FILES DECODED IN BYTES';

    selectRevealTarget('elynalize');
    startAutoCycleTimer();

    if (!byteCanvasFrame) {
      animateByteRevealCanvas(0);
    }
  }

  function startAutoCycleTimer() {
    if (autoCycleTimer) clearInterval(autoCycleTimer);
    const order = ['elynalize', 'pendrive', 'galpao', 'overview'];
    autoCycleTimer = setInterval(() => {
      if (!autoCycleEnabled || currentStage !== 3) return;
      const nextIdx = (order.indexOf(currentRevealTarget) + 1) % order.length;
      selectRevealTarget(order[nextIdx]);
    }, 11000);
  }

  function selectRevealTarget(targetKey) {
    currentRevealTarget = targetKey;
    decodeProgress = 0; // Trigger fresh byte-by-byte laser scan reconstruction!
    sfx.gateUnlock(2);

    // Update active tab UI
    document.querySelectorAll('.reveal-tab-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-target') === targetKey);
    });

    // Update left dossier text and specs
    const info = CONTAINMENT_DOSSIER_DATA[targetKey];
    if (info) {
      document.getElementById('dossier-sub-badge').textContent = info.subBadge;
      document.getElementById('dossier-main-heading').textContent = info.heading;
      document.getElementById('vp-filename-label').textContent = info.filename;
      document.getElementById('dossier-lore-paragraph').textContent = info.lore;

      const ul = document.getElementById('dossier-specs-ul');
      ul.innerHTML = info.specs
        .map(([k, v]) => `<li><span>${k}:</span><span>${v}</span></li>`)
        .join('');
    }

    // Rebuild pixel sample cache for current canvas size
    rebuildByteSampleForTarget(targetKey);
  }

  function rebuildByteSampleForTarget(targetKey) {
    const canvas = document.getElementById('byte-reveal-canvas');
    const wrap = document.getElementById('byte-canvas-wrap');
    if (!canvas || !wrap) return;

    const rect = wrap.getBoundingClientRect();
    canvas.width = Math.max(480, Math.floor(rect.width));
    canvas.height = Math.max(300, Math.floor(rect.height));

    const off = document.createElement('canvas');
    off.width = canvas.width;
    off.height = canvas.height;
    const octx = off.getContext('2d');
    octx.fillStyle = '#040002';
    octx.fillRect(0, 0, off.width, off.height);

    if (targetKey === 'overview') {
      // Draw all 3 images side-by-side in one unified byte matrix!
      const keys = ['elynalize', 'pendrive', 'galpao'];
      const slotW = off.width / 3;
      keys.forEach((k, idx) => {
        const img = loadedImages[k];
        if (!img) return;
        const pad = 14;
        const availW = slotW - pad * 2;
        const availH = off.height - 50;
        const scale = Math.min(availW / img.width, availH / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;
        const dx = idx * slotW + (slotW - dw) / 2;
        const dy = (off.height - dh) / 2;
        octx.drawImage(img, dx, dy, dw, dh);
      });
    } else {
      const img = loadedImages[targetKey];
      if (img) {
        const scale = Math.min(
          (off.width * 0.92) / img.width,
          (off.height * 0.92) / img.height
        );
        const dw = img.width * scale;
        const dh = img.height * scale;
        const dx = (off.width - dw) / 2;
        const dy = (off.height - dh) / 2;
        octx.drawImage(img, dx, dy, dw, dh);
      }
    }

    const rawData = octx.getImageData(0, 0, off.width, off.height).data;
    const cells = [];
    // Fine cell grid so faces, text on the pendrive, and the red glass warehouse look super crisp in bytes!
    const stepX = 6;
    const stepY = 7;
    const hexChars = '0123456789ABCDEF';

    for (let y = 0; y < off.height; y += stepY) {
      for (let x = 0; x < off.width; x += stepX) {
        const i = (y * off.width + x) * 4;
        let r = rawData[i];
        let g = rawData[i + 1];
        let b = rawData[i + 2];
        const a = rawData[i + 3];

        // For pendrive.png, its background is white (255,255,255); convert near-white exterior to dark cyber background
        if (targetKey === 'pendrive' || (targetKey === 'overview' && x >= off.width / 3 && x < (off.width * 2) / 3)) {
          if (r > 238 && g > 238 && b > 238) {
            r = 8;
            g = 0;
            b = 4;
          }
        }

        const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        if (a > 20 && lum > 0.035) {
          // Boost color saturation & contrast for glowing byte look
          const boost = 1.28;
          const br = Math.min(255, Math.floor(r * boost));
          const bg = Math.min(255, Math.floor(g * boost));
          const bb = Math.min(255, Math.floor(b * boost));
          const byteVal = Math.floor(lum * 255);
          const ch =
            lum > 0.72
              ? hexChars[byteVal % 16]
              : lum > 0.38
              ? (x + y) % 2 === 0
                ? '1'
                : '0'
              : '.';

          cells.push({
            x,
            y,
            r: br,
            g: bg,
            b: bb,
            lum,
            byteVal,
            ch,
            normY: y / off.height
          });
        }
      }
    }

    sampledCache[targetKey] = {
      offCanvas: off,
      cells,
      width: off.width,
      height: off.height,
      rawData
    };
  }

  function animateByteRevealCanvas(timestamp) {
    const canvas = document.getElementById('byte-reveal-canvas');
    if (canvas && currentStage === 3) {
      const ctx = canvas.getContext('2d');
      const cache = sampledCache[currentRevealTarget];

      if (cache) {
        ctx.fillStyle = '#030002';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Advance byte decoding progress
        if (decodeProgress < 1.05) {
          decodeProgress += 0.012;
          if (Math.random() < 0.35) sfx.dataTick();
          const pct = Math.min(100, Math.floor((decodeProgress / 1.0) * 100));
          const stEl = document.getElementById('byte-decode-status');
          const barEl = document.getElementById('byte-decode-bar');
          if (stEl) stEl.textContent = `RECONSTRUÇÃO EM BYTES: ${pct}%`;
          if (barEl) barEl.style.width = `${pct}%`;
        }

        const scanLineY = Math.min(canvas.height, decodeProgress * canvas.height);

        // In HOLO-BYTES mode, render a clipped phosphor-glow base under the decoded region so fine facial features,
        // the purple waves inside the pendrive, and the red glass warehouse are 100% unmistakable while covered in living bytes!
        if (currentRenderMode === 'holo') {
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, 0, canvas.width, scanLineY);
          ctx.clip();
          ctx.globalAlpha = 0.42;
          ctx.drawImage(cache.offCanvas, 0, 0);
          ctx.restore();
        }

        // Draw every single byte character in the matrix
        ctx.font = 'bold 7px "Share Tech Mono", monospace';
        const cells = cache.cells;
        const pulseRow = ((timestamp * 0.12) % canvas.height);

        for (let i = 0; i < cells.length; i++) {
          const c = cells[i];
          if (c.normY > decodeProgress) {
            // Falling encrypted byte rain just ahead of the decoding laser
            if (c.normY - decodeProgress < 0.08 && Math.random() < 0.22) {
              ctx.fillStyle = currentRevealTarget === 'galpao' ? '#ff002b' : '#b833ff';
              ctx.fillText(c.ch, c.x, c.y);
            }
            continue;
          }

          const nearScan = Math.abs(c.y - scanLineY) < 12;
          const nearPulse = Math.abs(c.y - pulseRow) < 10;

          if (nearScan) {
            ctx.fillStyle = '#ffffff';
          } else if (currentRenderMode === 'rednet') {
            const v = Math.floor(c.lum * 255);
            ctx.fillStyle = `rgb(${Math.min(255, v + 60)}, ${Math.floor(v * 0.15)}, ${Math.floor(v * 0.35)})`;
          } else if (nearPulse && Math.random() < 0.35) {
            ctx.fillStyle = '#00f0ff';
          } else {
            ctx.fillStyle = `rgb(${c.r}, ${c.g}, ${c.b})`;
          }

          ctx.fillText(c.ch, c.x, c.y);
        }

        // Draw active laser scanline while decoding
        if (decodeProgress < 1.0) {
          ctx.strokeStyle = '#00f0ff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(0, scanLineY);
          ctx.lineTo(canvas.width, scanLineY);
          ctx.stroke();
        }

        // Draw HUD labels for Overview mode
        if (currentRevealTarget === 'overview') {
          const slotW = canvas.width / 3;
          const titles = [
            '01. ELYNALIZE (MENTE EXTRAÍDA)',
            '02. CHIP "PENDRIVE" L2-SEC_EP',
            '03. GALPÃO DE CONTENÇÃO SETOR-09'
          ];
          ctx.font = 'bold 11px "Orbitron", monospace';
          titles.forEach((t, idx) => {
            ctx.fillStyle = 'rgba(10, 0, 4, 0.85)';
            ctx.fillRect(idx * slotW + 10, canvas.height - 28, slotW - 20, 22);
            ctx.strokeStyle = '#b833ff';
            ctx.strokeRect(idx * slotW + 10, canvas.height - 28, slotW - 20, 22);
            ctx.fillStyle = '#ffffff';
            ctx.fillText(t, idx * slotW + 18, canvas.height - 13);
          });
        }
      }
    }
    byteCanvasFrame = requestAnimationFrame(animateByteRevealCanvas);
  }

  // Interactive Byte Loupe Inspector when hovering over the Byte Canvas
  function setupByteCanvasInteractions() {
    const canvas = document.getElementById('byte-reveal-canvas');
    const loupe = document.getElementById('byte-loupe');
    const coordsLabel = document.getElementById('byte-cursor-coords');

    canvas.addEventListener('mousemove', (e) => {
      const cache = sampledCache[currentRevealTarget];
      if (!cache) return;
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor(e.clientX - rect.left);
      const y = Math.floor(e.clientY - rect.top);

      if (x < 0 || y < 0 || x >= cache.width || y >= cache.height) {
        loupe.style.display = 'none';
        return;
      }

      const idx = (y * cache.width + x) * 4;
      const r = cache.rawData[idx] || 0;
      const g = cache.rawData[idx + 1] || 0;
      const b = cache.rawData[idx + 2] || 0;
      const lumByte = Math.floor(0.299 * r + 0.587 * g + 0.114 * b);
      const hexByte = lumByte.toString(16).toUpperCase().padStart(2, '0');
      const binByte = lumByte.toString(2).padStart(8, '0');
      const memOffset = ((y * cache.width + x) & 0xfffff)
        .toString(16)
        .toUpperCase()
        .padStart(5, '0');

      loupe.style.display = 'block';
      loupe.style.left = `${Math.min(cache.width - 185, x + 16)}px`;
      loupe.style.top = `${Math.max(10, y - 56)}px`;
      loupe.innerHTML = `
        <div><strong>ADDR:</strong> 0x${memOffset} &nbsp; <strong>HEX:</strong> 0x${hexByte}</div>
        <div><strong>BITS:</strong> ${binByte}</div>
        <div style="color:#ff85a0;">RGB_BYTE: [${r}, ${g}, ${b}]</div>
      `;

      if (coordsLabel) {
        coordsLabel.textContent = `OFFSET 0x${memOffset} // BYTE 0x${hexByte} (${binByte})`;
      }
    });

    canvas.addEventListener('mouseleave', () => {
      loupe.style.display = 'none';
    });

    // Target tab buttons
    document.querySelectorAll('.reveal-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        if (target) {
          selectRevealTarget(target);
          startAutoCycleTimer(); // reset timer on manual click
        }
      });
    });

    // Render mode buttons
    document.querySelectorAll('[data-render-mode]').forEach((btn) => {
      btn.addEventListener('click', () => {
        sfx.keyClick();
        currentRenderMode = btn.getAttribute('data-render-mode');
        document.querySelectorAll('[data-render-mode]').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Re-decode button
    document.getElementById('btn-rescan-bytes').addEventListener('click', () => {
      sfx.gateUnlock(3);
      decodeProgress = 0;
    });

    // Auto-cycle toggle button
    const autoCycleBtn = document.getElementById('btn-toggle-autocycle');
    autoCycleBtn.addEventListener('click', () => {
      sfx.keyClick();
      autoCycleEnabled = !autoCycleEnabled;
      autoCycleBtn.classList.toggle('paused', !autoCycleEnabled);
      autoCycleBtn.textContent = autoCycleEnabled
        ? '[AUTO-SEQUÊNCIA: ON (11s)]'
        : '[AUTO-SEQUÊNCIA: PAUSADA]';
    });

    // Replay Fast Sequence button
    document.getElementById('btn-replay-fast').addEventListener('click', () => {
      sfx.keyClick();
      startFastNavigationSequence();
    });

    // Fast sequence pause & skip buttons
    document.getElementById('btn-pause-fast').addEventListener('click', (e) => {
      sfx.keyClick();
      fastPaused = !fastPaused;
      e.target.textContent = fastPaused ? '[CONTINUAR STREAM]' : '[PAUSAR STREAM]';
    });

    document.getElementById('btn-skip-to-ely').addEventListener('click', () => {
      sfx.keyClick();
      openContainmentDossier();
    });

    // Bottom Hydra Tabs navigation (once unlocked, user can jump between stages freely)
    document.getElementById('nav-tab-auth').addEventListener('click', () => {
      sfx.keyClick();
      setStage(1);
    });
    document.getElementById('nav-tab-relic').addEventListener('click', () => {
      if (!isUnlocked) {
        sfx.errorBuzz();
        return;
      }
      startFastNavigationSequence();
    });
    document.getElementById('nav-tab-ely').addEventListener('click', () => {
      if (!isUnlocked) {
        sfx.errorBuzz();
        return;
      }
      openContainmentDossier();
    });

    // Audio toggle button
    const audioBtn = document.getElementById('btn-audio-toggle');
    audioBtn.addEventListener('click', () => {
      sfx.enabled = !sfx.enabled;
      audioBtn.textContent = sfx.enabled ? '[SFX: ON]' : '[SFX: MUTED]';
      if (sfx.enabled) sfx.keyClick();
    });
  }

  // =========================================================================
  // 9. INITIALIZATION & RESIZE HANDLER
  // =========================================================================
  window.addEventListener('resize', () => {
    initBlackwallCanvas();
    buildArasakaLogoBitMatrix();
    if (currentStage === 3) {
      rebuildByteSampleForTarget(currentRevealTarget);
    }
  });

  loadAllAssets().then(() => {
    initBlackwallCanvas();
    renderBlackwallFrame();
    initHudWidgets();
    buildArasakaLogoBitMatrix();
    animateArasakaLogoBits(0);
    setupLoginController();
    setupByteCanvasInteractions();
  });
})();
