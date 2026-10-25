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
    prison: (window.ARASAKA_ASSETS && (window.ARASAKA_ASSETS.prison || window.ARASAKA_ASSETS.pendrive)) || 'assets/images/pendrive.png',
    pendrive: (window.ARASAKA_ASSETS && window.ARASAKA_ASSETS.pendrive) || 'assets/images/pendrive.png',
    galpao: (window.ARASAKA_ASSETS && window.ARASAKA_ASSETS.galpao) || 'assets/images/galpão.jpg',
    brain: (window.ARASAKA_ASSETS && window.ARASAKA_ASSETS.brain) || 'assets/gif/brain.gif',
    bla: (window.ARASAKA_ASSETS && window.ARASAKA_ASSETS.bla) || 'assets/references/bla.png'
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
  // 5. ARASAKA LOGO IN BITS (BOOT SCREEN + STAGE 1)
  // (Reconstructs Arasaka_Logo_CP2077.webp bit-by-bit in real-time)
  // =========================================================================

  // BOOT OVERLAY ARASAKA LOGO CANVAS
  const bootLogoCanvas = document.getElementById('boot-logo-canvas');
  const bootLogoCtx = bootLogoCanvas ? bootLogoCanvas.getContext('2d') : null;
  let bootLogoCells = [];
  let bootLogoProgress = 0;
  let bootLogoAnimFrame = null;

  function buildBootLogoBitMatrix() {
    if (!bootLogoCanvas || !bootLogoCanvas.parentElement) return;
    const rect = bootLogoCanvas.parentElement.getBoundingClientRect();
    bootLogoCanvas.width = Math.max(520, Math.floor(rect.width));
    bootLogoCanvas.height = Math.max(180, Math.floor(rect.height));

    const off = document.createElement('canvas');
    off.width = bootLogoCanvas.width;
    off.height = bootLogoCanvas.height;
    const octx = off.getContext('2d');

    const img = loadedImages.logo;
    bootLogoCells = [];

    if (img) {
      const scale = Math.min(
        (off.width * 0.88) / img.width,
        (off.height * 0.84) / img.height
      );
      const drawW = img.width * scale;
      const drawH = img.height * scale;
      const drawX = (off.width - drawW) / 2;
      const drawY = (off.height - drawH) / 2;
      octx.drawImage(img, drawX, drawY, drawW, drawH);

      const imgData = octx.getImageData(0, 0, off.width, off.height).data;
      const stepX = 5;
      const stepY = 6;

      for (let y = 0; y < off.height; y += stepY) {
        for (let x = 0; x < off.width; x += stepX) {
          const idx = (y * off.width + x) * 4;
          const r = imgData[idx];
          const g = imgData[idx + 1];
          const b = imgData[idx + 2];
          const a = imgData[idx + 3];

          const isRedLogo = a > 60 && r > 110 && g < 100 && b < 100;
          if (isRedLogo) {
            bootLogoCells.push({
              x,
              y,
              bit: Math.random() > 0.5 ? '1' : '0',
              hex: Math.floor(Math.random() * 16).toString(16).toUpperCase(),
              intensity: r / 255,
              order: (x / off.width) * 0.7 + (y / off.height) * 0.3 + Math.random() * 0.12
            });
          }
        }
      }
    }

    bootLogoProgress = 0;
  }

  function animateBootLogoBits(timestamp) {
    if (!bootLogoCanvas || !bootLogoCtx) return;
    if (bootLogoCanvas.offsetParent === null) return; // Stop drawing if boot overlay is hidden

    bootLogoCtx.fillStyle = 'rgba(6, 0, 2, 0.4)';
    bootLogoCtx.fillRect(0, 0, bootLogoCanvas.width, bootLogoCanvas.height);

    // Scan line
    bootLogoCtx.strokeStyle = 'rgba(255, 0, 43, 0.12)';
    bootLogoCtx.lineWidth = 1;
    const scanY = (timestamp * 0.09) % bootLogoCanvas.height;
    bootLogoCtx.beginPath();
    bootLogoCtx.moveTo(0, scanY);
    bootLogoCtx.lineTo(bootLogoCanvas.width, scanY);
    bootLogoCtx.stroke();

    if (bootLogoProgress < 1.15) {
      bootLogoProgress += 0.016;
      const pct = Math.min(100, Math.floor((bootLogoProgress / 1.05) * 100));
      const statEl = document.getElementById('boot-logo-stats');
      if (statEl) {
        statEl.textContent =
          pct < 100
            ? `DIGITALIZANDO LOGO ARASAKA EM BITS: ${pct}% [${bootLogoCells.length * 8} BITS]`
            : `ARASAKA LOGO BIT-MATRIX COMPILADA COM SUCESSO // ${bootLogoCells.length * 8} BITS ATIVOS`;
      }
    }

    bootLogoCtx.font = 'bold 7px "Share Tech Mono", monospace';
    const waveX = ((timestamp * 0.2) % (bootLogoCanvas.width + 200)) - 100;

    for (let i = 0; i < bootLogoCells.length; i++) {
      const c = bootLogoCells[i];
      if (c.order > bootLogoProgress) {
        if (c.order - bootLogoProgress < 0.12 && Math.random() < 0.35) {
          bootLogoCtx.fillStyle = '#00f0ff';
          bootLogoCtx.fillText(c.bit, c.x, c.y - (c.order - bootLogoProgress) * 140);
        }
        continue;
      }

      const distWave = Math.abs(c.x - waveX);
      if (distWave < 28) {
        bootLogoCtx.fillStyle = '#ffffff';
        if (Math.random() < 0.15) c.bit = c.bit === '1' ? '0' : '1';
      } else if (distWave < 65) {
        bootLogoCtx.fillStyle = '#ff4d6a';
      } else {
        bootLogoCtx.fillStyle = '#ff002b';
      }

      bootLogoCtx.fillText(c.bit, c.x, c.y);
    }

    bootLogoAnimFrame = requestAnimationFrame(animateBootLogoBits);
  }

  // STAGE 1 ARASAKA LOGO CANVAS
  const logoCanvas = document.getElementById('logo-bit-canvas');
  const logoCtx = logoCanvas ? logoCanvas.getContext('2d') : null;
  let logoBitCells = [];
  let logoBuildProgress = 0;
  let logoAnimFrame = null;

  function buildArasakaLogoBitMatrix() {
    if (!logoCanvas || !logoCanvas.parentElement) return;
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
    if (!logoCanvas || !logoCtx) return;
    if (logoCanvas.offsetParent === null) {
      logoAnimFrame = requestAnimationFrame(animateArasakaLogoBits);
      return;
    }

    logoCtx.fillStyle = 'rgba(6, 0, 2, 0.38)';
    logoCtx.fillRect(0, 0, logoCanvas.width, logoCanvas.height);

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
        if (c.order - logoBuildProgress < 0.14 && Math.random() < 0.35) {
          logoCtx.fillStyle = '#00f0ff';
          logoCtx.fillText(c.bit, c.x, c.y - (c.order - logoBuildProgress) * 140);
        }
        continue;
      }

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
  // 6. STAGE NAVIGATION, CREDENTIAL AUTHENTICATION & SECONDARY CHALLENGE
  // =========================================================================
  const VALID_USER = 'admin-arasaka2077';
  const VALID_PASS = 'ely_containment_project204077';
  const SECONDARY_PASSKEY = 'elyprocess77';
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

  let isPrimaryUnlocked = false;
  let isSecondaryUnlocked = false;

  function openSecondaryAuthModal() {
    const modal = document.getElementById('modal-secondary-auth');
    if (!modal) return;
    modal.classList.add('active');
    sfx.omegaAlert();
    const inp = document.getElementById('input-secondary-passkey');
    if (inp) {
      inp.value = '';
      inp.focus();
    }
  }

  function openNeuralMedicalHudModal() {
    const modal = document.getElementById('modal-neural-hud');
    if (!modal) return;
    modal.classList.add('active');
    sfx.omegaAlert();
    resizeMedicalCanvases();
  }

  function setupMedicalTabsController() {
    const tabBtns = document.querySelectorAll('.med-tab-btn');
    const tabPanels = document.querySelectorAll('.med-tab-panel');

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-med-tab');
        sfx.keyClick();

        tabBtns.forEach((b) => b.classList.remove('active'));
        tabPanels.forEach((p) => p.classList.remove('active'));

        btn.classList.add('active');
        const activePanel = document.getElementById(`med-panel-${targetTab}`);
        if (activePanel) {
          activePanel.classList.add('active');
        }

        setTimeout(() => {
          resizeMedicalCanvases();
        }, 50);
      });
    });
  }

  function setupLoginController() {
    const userInput = document.getElementById('input-username');
    const passInput = document.getElementById('input-password');
    const form = document.getElementById('arasaka-login-form');
    const feedback = document.getElementById('login-feedback-msg');
    const autoBtn = document.getElementById('btn-auto-hack');

    [userInput, passInput].forEach((inp) => {
      if (inp) inp.addEventListener('keydown', () => sfx.keyClick());
    });

    let autoTyping = false;
    if (autoBtn) {
      autoBtn.addEventListener('click', () => {
        if (autoTyping) return;
        autoTyping = true;
        userInput.value = '';
        passInput.value = '';
        passInput.type = 'text';
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
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const u = userInput.value.trim();
        const p = passInput.value.trim();

        if (u !== VALID_USER || p !== VALID_PASS) {
          sfx.errorBuzz();
          feedback.className = 'login-feedback error';
          feedback.textContent =
            'ACESSO NEGADO // CREDENCIAIS DE ACESSO OU CHAVE ICE INCORRETAS. REGISTRADO NO LOG ARASAKA.';
          return;
        }

        // Primary Credentials Accepted! Unlock Gates 1 & 2
        isPrimaryUnlocked = true;
        sfx.gateUnlock(1);
        feedback.className = 'login-feedback success';
        feedback.textContent =
          'CREDENCIAL PRIMÁRIA ACEITA // GATES 01 & 02 LIBERADOS. SELECIONE O DESTINO ABAIXO:';

        ['chain-1', 'chain-2'].forEach((gId, idx) => {
          setTimeout(() => {
            sfx.gateUnlock(idx + 1);
            const el = document.getElementById(gId);
            if (el) {
              el.classList.add('unlocked');
              const statusSpan = el.querySelector('span:last-child');
              if (statusSpan) statusSpan.textContent = '[OPEN]';
            }
          }, idx * 280);
        });

        // Revela painel com as opções: Avançar direto para Stage 2 OU Submenu Médico
        const choicePanel = document.getElementById('login-post-auth-panel');
        if (choicePanel) {
          choicePanel.classList.remove('hidden');
        }

        const advanceBtn = document.getElementById('btn-post-login-advance');
        const medicalBtn = document.getElementById('btn-post-login-medical');

        if (advanceBtn) {
          advanceBtn.onclick = () => {
            sfx.keyClick();
            startFastNavigationSequence();
          };
        }

        if (medicalBtn) {
          medicalBtn.onclick = () => {
            sfx.keyClick();
            if (isSecondaryUnlocked) {
              openNeuralMedicalHudModal();
            } else {
              openSecondaryAuthModal();
            }
          };
        }
      });
    }
  }

  function setupSecondaryAuthController() {
    const secForm = document.getElementById('secondary-auth-form');
    const secInput = document.getElementById('input-secondary-passkey');
    const autoSecBtn = document.getElementById('btn-auto-secondary');
    const secFeedback = document.getElementById('secondary-feedback-msg');
    const secModal = document.getElementById('modal-secondary-auth');
    const closeSecBtn = document.getElementById('btn-close-secondary-auth');

    if (closeSecBtn) {
      closeSecBtn.addEventListener('click', () => {
        sfx.keyClick();
        if (secModal) secModal.classList.remove('active');
      });
    }

    if (secModal) {
      secModal.addEventListener('click', (e) => {
        if (e.target === secModal) {
          secModal.classList.remove('active');
        }
      });
    }

    if (secInput) {
      secInput.addEventListener('keydown', () => sfx.keyClick());
    }

    if (autoSecBtn && secInput) {
      autoSecBtn.addEventListener('click', () => {
        sfx.keyClick();
        secInput.value = '';
        let idx = 0;
        const timer = setInterval(() => {
          if (idx < SECONDARY_PASSKEY.length) {
            secInput.value += SECONDARY_PASSKEY[idx++];
            sfx.keyClick();
          } else {
            clearInterval(timer);
            setTimeout(() => {
              if (secForm) secForm.requestSubmit();
            }, 250);
          }
        }, 40);
      });
    }

    if (secForm) {
      secForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const entered = secInput.value.trim().toLowerCase();

        if (entered !== SECONDARY_PASSKEY) {
          sfx.errorBuzz();
          secFeedback.className = 'secondary-feedback error';
          secFeedback.textContent =
            'ACESSO NEGADO // CHAVE SECUNDÁRIA INVÁLIDA. PROTOCOLO DE SEGURANÇA MANTIDO.';
          return;
        }

        // Secondary Passkey Accepted!
        isSecondaryUnlocked = true;
        isUnlocked = true;
        sfx.breachSuccess();
        secFeedback.className = 'secondary-feedback success';
        secFeedback.textContent =
          'CHAVE NEURAL RECONHECIDA // AUTENTICAÇÃO CONFIRMADA // LIBERANDO PRONTUÁRIOS MÉDICOS...';

        document.getElementById('header-security-state').textContent =
          'SECURITY: ICE BREACHED // ROOT ACCESS CONCEDIDO [NÍVEL ÔMEGA]';
        document.getElementById('prime-directive-banner').textContent =
          'ENGRAM VAULT UNLOCKED: ELYNALIZE';

        // Unlock Gates 3 & 4
        ['chain-3', 'chain-4'].forEach((gId, idx) => {
          setTimeout(() => {
            sfx.gateUnlock(idx + 3);
            const el = document.getElementById(gId);
            if (el) {
              el.classList.add('unlocked');
              const statusSpan = el.querySelector('span:last-child');
              if (statusSpan) statusSpan.textContent = '[OPEN]';
            }
            if (idx === 1) {
              setTimeout(() => {
                if (secModal) secModal.classList.remove('active');
                openNeuralMedicalHudModal();
              }, 450);
            }
          }, idx * 280);
        });
      });
    }
  }

  function setupNeuralMedicalHudController() {
    const advanceBtn = document.getElementById('btn-advance-to-fastnav');
    const showRefBtn = document.getElementById('btn-hud-show-ref');
    const closeHudBtn = document.getElementById('btn-close-neural-hud');
    const reopenBtn = document.getElementById('btn-reopen-medical-hud');
    const hudModal = document.getElementById('modal-neural-hud');
    const refModal = document.getElementById('modal-ref-bla');
    const closeRefBtn = document.getElementById('btn-close-ref-modal');

    if (advanceBtn) {
      advanceBtn.addEventListener('click', () => {
        sfx.keyClick();
        if (hudModal) hudModal.classList.remove('active');
        startFastNavigationSequence();
      });
    }

    if (closeHudBtn) {
      closeHudBtn.addEventListener('click', () => {
        sfx.keyClick();
        if (hudModal) hudModal.classList.remove('active');
      });
    }

    if (hudModal) {
      hudModal.addEventListener('click', (e) => {
        if (e.target === hudModal) {
          hudModal.classList.remove('active');
        }
      });
    }

    if (showRefBtn) {
      showRefBtn.addEventListener('click', () => {
        sfx.keyClick();
        if (refModal) refModal.classList.add('active');
      });
    }

    if (closeRefBtn) {
      closeRefBtn.addEventListener('click', () => {
        sfx.keyClick();
        if (refModal) refModal.classList.remove('active');
      });
    }

    if (refModal) {
      refModal.addEventListener('click', (e) => {
        if (e.target === refModal) {
          refModal.classList.remove('active');
        }
      });
    }

    if (reopenBtn) {
      reopenBtn.addEventListener('click', () => {
        sfx.keyClick();
        if (!isPrimaryUnlocked) {
          sfx.errorBuzz();
          const feedback = document.getElementById('login-feedback-msg');
          if (feedback) {
            feedback.className = 'login-feedback error';
            feedback.textContent = 'ACESSO NEGADO // É NECESSÁRIO FAZER LOGIN PRIMÁRIO PRIMEIRO.';
          }
          return;
        }

        if (isSecondaryUnlocked) {
          openNeuralMedicalHudModal();
        } else {
          openSecondaryAuthModal();
        }
      });
    }
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
      lore: `> CREDENCIAL ACEITA: OPERADOR ARASAKA-MNL\n> CHAVE DE CONTENÇÃO: [CRIPTOGRAFADA / BYPASS CONFIRMADO]\n> BYPASSANDO DAEMONS DE DEFESA ARASAKA...\n\nConectando aos servidores subterrâneos de Night City e Tóquio. Redirecionando tráfego através de nós fantasmas para acessar a divisão de Projetos Especiais e Bio-Engenharia Neural.`
    },
    {
      path: '//ARASAKA_MNL/R&D/SECURE_YOUR_SOUL_DB',
      badge: 'NODE 02 // PROGRAMA "GARANTA SUA ALMA" & HUD MÉDICO',
      title: 'DIGITALIZAÇÃO CEREBRAL & ESTASE DO CORPO: ELYNALIZE',
      schematic: 'SOULKILLER_BRAIN_SCAN_ELYNALIZE.RAW',
      mode: 'wave',
      lore: `> ACESSANDO DIRETÓRIO: SECURE YOUR SOUL // HUD MÉDICO ELYNALIZE\n> CÉREBRO EM DIGITALIZAÇÃO: brain.gif [80,935 BYTES COMPILADOS]\n> CORPO BIOLÓGICO: ESTASE CRIO-NEURAL (4.2°C / 72 BPM)\n\nExtração de consciência em andamento. Mapeamento dos lobos cerebrais de Elynalize para empacotamento no chip "Prison", enquanto seu corpo biológico permanece isolado em estase.`
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
      lore: `> DESCRIPTOGRAFANDO DOSSIÊ #204077-ELY...\n> NOME DO ALVO: ELYNALIZE (NETRUNNER DE ALTO NÍVEL)\n> STATUS: NEUTRALIZADA // MENTE E ALMA ARRANCADAS PARA O CHIP "PRISON"\n> CORPO BIOLÓGICO: RESERVADO EM INSTALAÇÃO SEPARADA\n> INICIANDO RECONSTRUÇÃO VISUAL EM BYTES...`
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
        ['MENTE & ALMA (CONSCIÊNCIA)', 'EXTRAÍDA NO CHIP "PRISON"'],
        ['CORPO BIOLÓGICO', 'RESERVADO EM COFRE CRIOGÊNICO DISTINTO'],
        ['INTEGRIDADE DO ENGRAMA', '99.4% (CONSCIÊNCIA ATIVA E CONTIDA)']
      ]
    },
    prison: {
      subBadge: 'ARQUIVO 02 // HARDWARE DE CONTENÇÃO DE ALMA (CHIP "PRISON")',
      heading: 'CHIP "PRISON" (CONSCIÊNCIA)',
      filename: 'DECODING IN BYTES: prison_chip.png [135,014 BYTES // CHIP "PRISON"]',
      lore: `UNIDADE DE CONTENÇÃO "PRISON" (MODELO PRISON-09 // ARASAKA SEC): Dispositivo derivado da tecnologia do Projeto Relic e dos estudos de Constructos de Edgerunners 2. Dentro do invólucro translúcido ultra-blindado pulsam as ondas roxas da consciência e da alma de Elynalize, comprimidas em bytes puros e totalmente desconectadas de qualquer rede externa em regime air-gap absoluto para impedir sua fuga.`,
      specs: [
        ['DISPOSITIVO DE GUARDA', 'CHIP DE CONTENÇÃO "PRISON"'],
        ['NOME OFICIAL DO CHIP', 'PRISON (AIR-GAP NEURAL VAULT)'],
        ['CONTEÚDO ARMAZENADO', 'CONSCIÊNCIA & ALMA DE ELYNALIZE'],
        ['MARCAÇÃO DE SEGURANÇA', 'AUTHORIZED PERSONNEL ONLY // CLASSIFIED'],
        ['ESPECTRO DE RESSONÂNCIA', 'VIOLETA PROFUNDO (ENGRAMA VIVO)'],
        ['ISOLAMENTO DE REDE', 'AIR-GAP ABSOLUTO (BLOQUEIO ICE FÍSICO)'],
        ['LOCALIZAÇÃO DO CHIP', 'DEPÓSITO / GALPÃO SETOR-09']
      ]
    },
    galpao: {
      subBadge: 'ARQUIVO 03 // LOCALIDADE DO DEPÓSITO DE CONTENÇÃO',
      heading: 'GALPÃO ARASAKA — SETOR 09',
      filename: 'DECODING IN BYTES: galpão.jpg [85,917 BYTES // VAULT LOCATION]',
      lore: `LOCALIZAÇÃO REVELADA EM BYTES: O chip "Prison" contendo a mente e a alma de Elynalize está trancado no interior deste Galpão de Contenção de Alta Segurança da Arasaka (câmara blindada em vidro vermelho pressurizado). Enquanto sua consciência permanece presa neste depósito sob vigilância pesada, seu corpo biológico vivo é mantido separadamente em outro complexo secreto para impedir qualquer tentativa de reintegração.`,
      specs: [
        ['INSTALAÇÃO (MENTE/CHIP)', 'GALPÃO DE CONTENÇÃO ARASAKA SETOR-09'],
        ['COORDENADAS DE REDE', '35.6895° N, 139.6917° E // SUB-NÍVEL 4'],
        ['CÂMARA INTERNA', 'SALA BLINDADA VERMELHA (FARADAY CAGE)'],
        ['LOCAL DO CORPO FÍSICO', 'COMPLEXO BIO-TARTARUS (SEPARADO)'],
        ['PROTOCOLO DE GUARDA', 'TURRETS AUTOMÁTICAS + ICE LETAL'],
        ['RISCO DE RESGATE', 'CRÍTICO — NÃO CONECTAR O CHIP "PRISON"']
      ]
    },
    overview: {
      subBadge: 'MATRIZ COMPLETA // DOSSIÊ INTEGRADO EM BYTES',
      heading: 'ELYNALIZE // CHIP "PRISON" // GALPÃO',
      filename: 'MULTI-STREAM BYTE MATRIX: [ROSTO + CHIP "PRISON" + GALPÃO]',
      lore: `VISÃO CONSOLIDADA DA OPERAÇÃO: (1) A Netrunner de alto nível Elynalize, neutralizada pela Arasaka; (2) O chip "Prison" onde sua mente e alma estão aprisionadas; e (3) O Galpão de segurança onde o chip está guardado, longe de seu corpo físico reservado em outro espaço.`,
      specs: [
        ['01. SUJEITO NEUTRALIZADO', 'ELYNALIZE (ROSTO EM BYTES)'],
        ['02. PRISÃO DA CONSCIÊNCIA', 'CHIP "PRISON" (CONSCIÊNCIA EM BYTES)'],
        ['03. LOCAL DO DEPÓSITO', 'GALPÃO SETOR-09 (LOCAL EM BYTES)'],
        ['SEPARAÇÃO MENTE/CORPO', '100% CONFIRMADA (PROTOCOLO SOULKILLER)'],
        ['CHAVE SECUNDÁRIA', 'AUTORIZADA [DESBLOQUEIO NEURAL ÔMEGA]'],
        ['CHAVE PRIMÁRIA', 'VERIFICADA [PROTOCOLO ARASAKA-MNL]'],
        ['OPERADOR CONECTADO', 'AUTENTICADO [ACESSO NÍVEL 9]']
      ]
    },
    medicalhud: {
      subBadge: 'ARQUIVO 05 // HUD MÉDICO: ESCANEAMENTO CEREBRAL & CORPO',
      heading: 'CÉREBRO & CORPO DE ELYNALIZE',
      filename: 'DECODING IN BYTES: brain.gif + bla.png [80,935 BYTES // MEDICAL HUD]',
      lore: `RELATÓRIO DO HUD MÉDICO: O escaneamento cerebral de Elynalize revela o processo exato em que seu córtex foi digitalizado em bytes pelo Soulkiller. Enquanto sua mente e alma foram arrancadas e compactadas no chip "Prison" guardado no Galpão 09, seu corpo biológico permanece em estase criogênica a 4.2°C no Complexo Bio-Tartarus, com ritmo cardíaco artificial de 72 BPM e funções cerebrais totalmente desativadas (0.00% residual).`,
      specs: [
        ['SUJEITO CATALOGADO', 'ELYNALIZE (X-FORCE_095 // OMEGA)'],
        ['MENTE / CONSCIÊNCIA', 'EXTRAÍDA EM BYTES VIA SOULKILLER'],
        ['LOCAL DO ENGRAMA (CHIP)', 'CHIP "PRISON" (GALPÃO SETOR-09)'],
        ['CORPO BIOLÓGICO', 'SEPARADO / SEM ALMA (ESTASE CRIOGÊNICA)'],
        ['LOCAL DO CORPO FÍSICO', 'COMPLEXO BIO-TARTARUS (OFF-SITE)'],
        ['TEMPERATURA CORPORAL', '4.2°C (ESTASE CRIO-NEURAL ESTÁVEL)'],
        ['SÍNTESE CARDÍACA', '72 BPM (SINTÉTICO / CONTÍNUO)'],
        ['AUTENTICAÇÃO NEURAL', 'NÍVEL ÔMEGA (VERIFICADA)']
      ]
    }
  };

  // Support backward compatibility key
  CONTAINMENT_DOSSIER_DATA.pendrive = CONTAINMENT_DOSSIER_DATA.prison;

  let currentRevealTarget = 'elynalize';
  let currentRenderMode = 'holo';
  let decodeProgress = 0;
  let autoCycleEnabled = true;
  let autoCycleTimer = null;
  let byteCanvasFrame = null;

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
    const order = ['elynalize', 'prison', 'galpao', 'overview', 'medicalhud'];
    autoCycleTimer = setInterval(() => {
      if (!autoCycleEnabled || currentStage !== 3) return;
      const nextIdx = (order.indexOf(currentRevealTarget) + 1) % order.length;
      selectRevealTarget(order[nextIdx]);
    }, 11000);
  }

  function selectRevealTarget(targetKey) {
    if (targetKey === 'pendrive') targetKey = 'prison';
    currentRevealTarget = targetKey;
    decodeProgress = 0;
    sfx.gateUnlock(2);

    document.querySelectorAll('.reveal-tab-btn').forEach((btn) => {
      const bTarget = btn.getAttribute('data-target');
      btn.classList.toggle('active', bTarget === targetKey || (bTarget === 'pendrive' && targetKey === 'prison'));
    });

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
      const keys = ['elynalize', 'prison', 'galpao'];
      const slotW = off.width / 3;
      keys.forEach((k, idx) => {
        const img = loadedImages[k] || loadedImages.pendrive;
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
    } else if (targetKey === 'medicalhud') {
      const img = loadedImages.bla || loadedImages.brain;
      if (img) {
        const scale = Math.min(
          (off.width * 0.94) / img.width,
          (off.height * 0.94) / img.height
        );
        const dw = img.width * scale;
        const dh = img.height * scale;
        const dx = (off.width - dw) / 2;
        const dy = (off.height - dh) / 2;
        octx.drawImage(img, dx, dy, dw, dh);
      }
    } else {
      const imgKey = (targetKey === 'prison') ? ('prison' in loadedImages ? 'prison' : 'pendrive') : targetKey;
      const img = loadedImages[imgKey] || loadedImages.prison || loadedImages.pendrive;
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

        if (targetKey === 'prison' || targetKey === 'pendrive' || (targetKey === 'overview' && x >= off.width / 3 && x < (off.width * 2) / 3)) {
          if (r > 238 && g > 238 && b > 238) {
            r = 8;
            g = 0;
            b = 4;
          }
        }

        const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        if (a > 20 && lum > 0.035) {
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

        if (currentRenderMode === 'holo') {
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, 0, canvas.width, scanLineY);
          ctx.clip();
          ctx.globalAlpha = 0.42;
          ctx.drawImage(cache.offCanvas, 0, 0);
          ctx.restore();
        }

        ctx.font = 'bold 7px "Share Tech Mono", monospace';
        const cells = cache.cells;
        const pulseRow = ((timestamp * 0.12) % canvas.height);

        for (let i = 0; i < cells.length; i++) {
          const c = cells[i];
          if (c.normY > decodeProgress) {
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

        if (decodeProgress < 1.0) {
          ctx.strokeStyle = '#00f0ff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(0, scanLineY);
          ctx.lineTo(canvas.width, scanLineY);
          ctx.stroke();
        }

        if (currentRevealTarget === 'overview') {
          const slotW = canvas.width / 3;
          const titles = [
            '01. ELYNALIZE (MENTE EXTRAÍDA)',
            '02. CHIP "PRISON" (CONSCIÊNCIA)',
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
  // 10. MEDICAL HUD ANIMATIONS: BRAIN SCAN BYTES, DNA ROTATION & 72 BPM ECG
  // (Generated by bytes from reference 'bla.png' & 'brain.gif')
  // =========================================================================

  // Medical HUD Canvases
  const neuralBrainCanvas = document.getElementById('neural-brain-byte-canvas');
  const neuralDnaCanvas = document.getElementById('neural-dna-canvas');
  const neuralEcgCanvas = document.getElementById('neural-ecg-canvas');

  const brainByteNodes = [
    { name: 'CÓRTEX PRÉ-FRONTAL', nx: 0.35, ny: 0.32, status: '100% EXTRAÍDO', color: '#00f0ff' },
    { name: 'HIPOCAMPO [MEM]', nx: 0.62, ny: 0.48, status: 'COMPILADO EM BYTES', color: '#ff002b' },
    { name: 'PONTE NEURAL', nx: 0.48, ny: 0.72, status: 'LINK CHIP PRISON', color: '#b833ff' },
    { name: 'LOBO TEMPORAL', nx: 0.24, ny: 0.58, status: 'ISOLAMENTO AIR-GAP', color: '#ff002b' }
  ];

  // High-performance single-pass resize function (never called on animation frames!)
  function resizeMedicalCanvases() {
    [
      { c: neuralBrainCanvas, minW: 180, minH: 100 },
      { c: neuralDnaCanvas, minW: 100, minH: 60 },
      { c: neuralEcgCanvas, minW: 160, minH: 40 }
    ].forEach(({ c, minW, minH }) => {
      if (!c || !c.parentElement) return;
      const rect = c.parentElement.getBoundingClientRect();
      const w = Math.max(minW, Math.floor(rect.width));
      const h = Math.max(minH, Math.floor(rect.height));
      if (c.width !== w || c.height !== h) {
        c.width = w;
        c.height = h;
      }
    });
  }

  function animateBrainByteCanvases(timestamp) {
    if (neuralBrainCanvas && neuralBrainCanvas.offsetParent !== null) {
      const ctx = neuralBrainCanvas.getContext('2d');
      const w = neuralBrainCanvas.width;
      const h = neuralBrainCanvas.height;
      ctx.clearRect(0, 0, w, h);

      // Laser scan sweep line
      const laserY = ((timestamp * 0.08) % (h + 40)) - 20;

      ctx.strokeStyle = 'rgba(0, 240, 255, 0.85)';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(10, laserY);
      ctx.lineTo(w - 10, laserY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Secondary fine red beam
      ctx.strokeStyle = 'rgba(255, 0, 43, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(20, laserY + 3);
      ctx.lineTo(w - 20, laserY + 3);
      ctx.stroke();

      // Digital byte stream rain over brain
      ctx.font = 'bold 8px "Share Tech Mono", monospace';
      const hexList = ['0x7F', '0xA4', '0x2077', '0x095', '0xFF', '1', '0', '0x1C'];
      for (let i = 0; i < 9; i++) {
        const seed = timestamp * 0.003 + i * 43.17;
        const bx = 20 + ((i * 37) % (w - 40));
        const by = ((seed * 40) % (h - 20)) + 10;
        const char = hexList[(i + Math.floor(seed)) % hexList.length];
        ctx.fillStyle = i % 3 === 0 ? '#00f0ff' : i % 3 === 1 ? '#ff4d6a' : '#ffffff';
        ctx.fillText(char, bx, by);
      }

      // Brain synaptic nodes with crosshairs and brackets
      brainByteNodes.forEach((node, idx) => {
        const px = node.nx * w;
        const py = node.ny * h;

        // Pulsing radius
        const pulse = 3 + Math.sin(timestamp * 0.005 + idx) * 1.5;

        // Circle
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(px, py, pulse, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(px, py, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Crosshairs
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(px - pulse - 3, py);
        ctx.lineTo(px + pulse + 3, py);
        ctx.moveTo(px, py - pulse - 3);
        ctx.lineTo(px, py + pulse + 3);
        ctx.stroke();

        // Small tag
        ctx.fillStyle = '#ffffff';
        ctx.font = '7px "Share Tech Mono", monospace';
        ctx.fillText(node.name, px + pulse + 4, py - 2);
      });
    }

    requestAnimationFrame(animateBrainByteCanvases);
  }

  // DNA Chain 3D Rotation Animation
  function animateDnaCanvases(timestamp) {
    if (neuralDnaCanvas && neuralDnaCanvas.offsetParent !== null) {
      const ctx = neuralDnaCanvas.getContext('2d');
      const w = neuralDnaCanvas.width;
      const h = neuralDnaCanvas.height;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const t = timestamp * 0.0022;
      const numNodes = 14;
      const stepY = (h - 20) / numNodes;
      const radius = Math.min(36, w * 0.32);
      const byteChars = ['A', 'T', 'C', 'G', '0', '1'];

      for (let i = 0; i < numNodes; i++) {
        const y = 10 + i * stepY;
        const angle = t + i * 0.48;
        const sinVal = Math.sin(angle);
        const cosVal = Math.cos(angle);

        const x1 = cx + sinVal * radius;
        const x2 = cx - sinVal * radius;

        // Connecting rung line
        ctx.strokeStyle = 'rgba(255, 0, 43, 0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.stroke();

        // Byte char in center of rung
        const ch = byteChars[(i + Math.floor(t * 3)) % byteChars.length];
        ctx.fillStyle = cosVal > 0 ? 'rgba(0, 240, 255, 0.7)' : 'rgba(255, 77, 106, 0.7)';
        ctx.font = '6px "Share Tech Mono", monospace';
        ctx.fillText(ch, cx - 2, y + 2);

        // Strand 1 node
        const r1 = 2.5 + cosVal * 1.2;
        ctx.fillStyle = cosVal > 0 ? '#00f0ff' : '#0066cc';
        ctx.beginPath();
        ctx.arc(x1, y, Math.max(1, r1), 0, Math.PI * 2);
        ctx.fill();

        // Strand 2 node
        const r2 = 2.5 - cosVal * 1.2;
        ctx.fillStyle = cosVal <= 0 ? '#ff002b' : '#ff7a8e';
        ctx.beginPath();
        ctx.arc(x2, y, Math.max(1, r2), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    requestAnimationFrame(animateDnaCanvases);
  }

  // 72 BPM Electrocardiogram (ECG / EKG) Oscilloscope Wave
  const ecgHistory = [];
  let lastBeatTime = 0;

  function animateEcgCanvases(timestamp) {
    // 72 beats per minute = 1 beat every 833.3ms
    const beatInterval = 833.3;
    const beatPhase = (timestamp % beatInterval) / beatInterval;

    // Synthesize realistic P-Q-R-S-T ECG cardiac waveform
    let val = 0;
    if (beatPhase >= 0.12 && beatPhase < 0.22) {
      val = Math.sin((beatPhase - 0.12) / 0.10 * Math.PI) * 0.18;
    } else if (beatPhase >= 0.28 && beatPhase < 0.31) {
      val = -Math.sin((beatPhase - 0.28) / 0.03 * Math.PI) * 0.22;
    } else if (beatPhase >= 0.31 && beatPhase < 0.38) {
      val = Math.sin((beatPhase - 0.31) / 0.07 * Math.PI) * 1.0;
      if (timestamp - lastBeatTime > 600) {
        lastBeatTime = timestamp;
        if (sfx.enabled && (currentStage === 1 || (neuralEcgCanvas && neuralEcgCanvas.offsetParent !== null))) {
          sfx.playTone(85, 0.035, 'sine', 0.02);
        }
      }
    } else if (beatPhase >= 0.38 && beatPhase < 0.43) {
      val = -Math.sin((beatPhase - 0.38) / 0.05 * Math.PI) * 0.35;
    } else if (beatPhase >= 0.52 && beatPhase < 0.68) {
      val = Math.sin((beatPhase - 0.52) / 0.16 * Math.PI) * 0.25;
    }

    ecgHistory.push(val);
    if (ecgHistory.length > 200) {
      ecgHistory.shift();
    }

    if (neuralEcgCanvas && neuralEcgCanvas.offsetParent !== null) {
      const ctx = neuralEcgCanvas.getContext('2d');
      const w = neuralEcgCanvas.width;
      const h = neuralEcgCanvas.height;
      const midY = h / 2;
      ctx.clearRect(0, 0, w, h);

      // Draw ECG wave path
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 6;
      ctx.beginPath();

      const stepX = w / (ecgHistory.length - 1 || 1);
      for (let i = 0; i < ecgHistory.length; i++) {
        const x = i * stepX;
        const y = midY - ecgHistory[i] * (h * 0.42);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Lead sweep dot at head of trace
      const lastX = (ecgHistory.length - 1) * stepX;
      const lastY = midY - ecgHistory[ecgHistory.length - 1] * (h * 0.42);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(lastX, lastY, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(animateEcgCanvases);
  }

  // =========================================================================
  // 11. BOOT PROCESS CONTROLLER (ARASAKA LOGO BIT DIGITALIZATION)
  // =========================================================================
  function setupBootProcessController() {
    const bootOverlay = document.getElementById('terminal-boot-overlay');
    const bootProgressFill = document.getElementById('boot-progress-fill');
    const bootStatusText = document.getElementById('boot-status-text');
    const bootSkipBtn = document.getElementById('btn-boot-skip');
    const bootEnterBtn = document.getElementById('btn-boot-enter-main');
    const bootRescanBtn = document.getElementById('btn-boot-rescan');
    const bootLogEl = document.getElementById('boot-terminal-log');

    let bootProgress = 0;
    let bootFinished = false;
    let bootTimer = null;

    const bootLogLines = [
      '> [KERNEL-ARASAKA] Inicializando micro-sistema Arasaka Sub-Net...',
      '> [ICE-STATUS] Nível de segurança: OMEGA // 4 barreiras de criptografia ativas.',
      '> [CODEC-BIT] Digitalizando logo institucional da Arasaka em coordenadas binárias...',
      '> [IMAGE-RECON] Dimensões processadas: 580x190 // Matriz de bits compilada com sucesso.',
      '> [DATA-STREAM] Conectando bio-telemetria do Cérebro e Corpo de Elynalize...',
      '> [ENGRAM-CONTAINMENT] Mapeamento concluído: Mente e alma gravadas no chip "Prison".',
      '> [SYSTEM-READY] Processo de abertura finalizado. Acesso ao terminal liberado.'
    ];

    let logIndex = 0;

    function runBootSequence() {
      bootProgress = 0;
      bootFinished = false;
      logIndex = 0;
      if (bootOverlay) bootOverlay.classList.remove('hidden');
      if (bootLogEl) bootLogEl.innerHTML = '';

      buildBootLogoBitMatrix();

      if (bootTimer) clearInterval(bootTimer);

      bootTimer = setInterval(() => {
        if (bootFinished) return;
        bootProgress += 1.8;
        if (bootProgress > 100) bootProgress = 100;

        if (bootProgressFill) bootProgressFill.style.width = `${bootProgress}%`;

        // Stream terminal log lines at progress thresholds
        const targetLogIndex = Math.floor((bootProgress / 100) * bootLogLines.length);
        while (logIndex < targetLogIndex && logIndex < bootLogLines.length) {
          if (bootLogEl) {
            const line = document.createElement('div');
            line.className = 'boot-log-line';
            line.textContent = bootLogLines[logIndex];
            bootLogEl.appendChild(line);
            bootLogEl.scrollTop = bootLogEl.scrollHeight;
          }
          logIndex++;
        }

        if (bootStatusText) {
          if (bootProgress < 30) {
            bootStatusText.textContent = `INICIALIZANDO TERMINAL ARASAKA... DIGITALIZANDO LOGO EM BITS: ${Math.floor(bootProgress)}%`;
          } else if (bootProgress < 75) {
            bootStatusText.textContent = `COMPILANDO MATRIZ BINÁRIA DA LOGO ARASAKA... [${Math.floor(bootProgress)}%]`;
          } else if (bootProgress < 95) {
            bootStatusText.textContent = `ESTABILIZANDO SISTEMA // CONSTRUCTO ELYNALIZE EM CHIP "PRISON" [${Math.floor(bootProgress)}%]`;
          } else {
            bootStatusText.textContent = `PROCESSO DE ABERTURA CONCLUÍDO // ACESSO AO TERMINAL LIBERADO (100%)`;
          }
        }

        if (Math.random() < 0.28) sfx.dataTick();

        if (bootProgress >= 100) {
          clearInterval(bootTimer);
          bootFinished = true;
          sfx.gateUnlock(1);
          setTimeout(() => {
            if (bootOverlay && !bootOverlay.classList.contains('hidden')) {
              closeBootOverlay();
            }
          }, 1400);
        }
      }, 70);
    }

    function closeBootOverlay() {
      bootFinished = true;
      if (bootTimer) clearInterval(bootTimer);
      if (bootOverlay) bootOverlay.classList.add('hidden');
      sfx.gateUnlock(2);
    }

    if (bootSkipBtn) bootSkipBtn.addEventListener('click', closeBootOverlay);
    if (bootEnterBtn) bootEnterBtn.addEventListener('click', closeBootOverlay);

    if (bootRescanBtn) {
      bootRescanBtn.addEventListener('click', () => {
        sfx.keyClick();
        runBootSequence();
      });
    }

    runBootSequence();
  }

  // =========================================================================
  // 12. INITIALIZATION & RESIZE HANDLER
  // =========================================================================
  window.addEventListener('resize', () => {
    initBlackwallCanvas();
    buildArasakaLogoBitMatrix();
    buildBootLogoBitMatrix();
    resizeMedicalCanvases();
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
    buildBootLogoBitMatrix();
    animateBootLogoBits(0);
    resizeMedicalCanvases();
    animateBrainByteCanvases(0);
    animateDnaCanvases(0);
    animateEcgCanvases(0);
    setupLoginController();
    setupSecondaryAuthController();
    setupNeuralMedicalHudController();
    setupMedicalTabsController();
    setupByteCanvasInteractions();
    setupBootProcessController();
  });
})();


