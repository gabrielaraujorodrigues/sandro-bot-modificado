const fs = require("fs")
const moment = require('moment-timezone');
const { getGroupAdmins } = require(`../../consts-func.js`)

// ═══════════════════════════════════════════════════════════
// UTILITÁRIOS
// ═══════════════════════════════════════════════════════════

function saveJSON(inter, caminho) {
  fs.writeFileSync(caminho, JSON.stringify(inter, null, 2));
}

const isJsonIncludes = (json, value) => {
  if (JSON.stringify(json).includes(value)) return true
  return false
}

const contar = (frase, letraProcurada) => {
  let total = 0
  for (let i = 0; i < frase.length; i++) {
    if (letraProcurada == frase[i]) total += 1
  }
  return total
}

const contarMin = (base_a) => {
  if (contar(String(base_a), `:`) != 1) return `É necessário o uso dos : no horário, seguindo apenas horas e minutos`
  var [a, b] = base_a.split(':')
  return Number(Number(a) * 60) + Number(b)
}

const converterMin = (base_b) => {
  if (Number(base_b) === 0) return `00:00`
  if (!Number(base_b)) return `Precisa ser um número`
  let nmr = Number(base_b)
  let b = nmr % 60
  let a = (nmr - b) / 60
  return `${a < 10 ? `0` + a : a}:${b < 10 ? `0` + b : b}`
}

const sendHours = (formato) => {
  moment.locale("pt")
  return moment.tz('America/Sao_Paulo').format(formato)
}

const sleep = async (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// ═══════════════════════════════════════════════════════════
// BANCO DE DADOS — AGENDAMENTOS
// ═══════════════════════════════════════════════════════════

const ocgrouppath = `./dados/abrir-fechar-grupo/openclosegp.json`

if (!fs.existsSync(ocgrouppath)) { fs.writeFileSync(ocgrouppath, JSON.stringify([])) }

const openclosegp = JSON.parse(fs.readFileSync(ocgrouppath))

function saveOpenCloseGP() { saveJSON(openclosegp, ocgrouppath) }

function rgGroupOCfunc(from) {
  if (!isJsonIncludes(openclosegp, from)) {
    openclosegp.push({ groupId: from, horarios: [] })
    saveOpenCloseGP()
  }
}

const getGroupOpenCloseFunc = (from) => {
  let caixa = []
  for (let i of openclosegp) {
    if (from == i.groupId) caixa.push(i)
  }
  return caixa[0].horarios
}

function addOpenCloseGP(from, horario, adm, af = `open`) {
  if (horario.includes(`:`)) {
    let a = contarMin(horario)
    let b = a % 1440
    let day = (a - b) / 1440
    let hr = converterMin(b)
    if (day == 0 && contarMin(hr) < contarMin(sendHours("HH:mm"))) day += 1
    let grupo = getGroupOpenCloseFunc(from)
    grupo.push({ id: sendHours("DDMMYYHHmmss"), func: af, hora: hr, dias: day, save: sendHours("DD"), cobrado: false, adm: adm })
    saveOpenCloseGP()
  } else {
    let letra = String(horario).slice(horario.length - 1).toLowerCase()
    let mp = letra == `d` ? 60 * 24 : letra == `h` ? 60 : 1
    let nmr = (Number(String(horario).slice(0, horario.length - 1)) || 1) * mp
    let ha = contarMin(sendHours("HH:mm")) + nmr
    let parte = ha % 1440
    let day = (ha - parte) / 1440
    let hr = converterMin(parte)
    if (day == 0 && contarMin(hr) < contarMin(sendHours("HH:mm"))) day += 1
    let grupo = getGroupOpenCloseFunc(from)
    grupo.push({ id: sendHours("DDMMYYHHmmss"), func: af, hora: hr, dias: day, save: sendHours("DD"), cobrado: false, adm: adm })
    saveOpenCloseGP()
  }
}

const getLastOpenCloseGP = (from) => {
  let grupo = getGroupOpenCloseFunc(from)
  return grupo[grupo.length - 1]
}

const isIDopenCloseGP = (from, id) => {
  let grupo = getGroupOpenCloseFunc(from)
  let AB = grupo.map(i => i.id).indexOf(id)
  return AB >= 0 ? true : false
}

function rmOpenCloseGP(from, id) {
  let grupo = getGroupOpenCloseFunc(from)
  let AB = grupo.map(i => i.id).indexOf(id)
  grupo.splice(AB, 1)
  saveOpenCloseGP()
}

// ═══════════════════════════════════════════════════════════
// VERIFICAÇÃO DE CONEXÃO
// ═══════════════════════════════════════════════════════════

function _isConnReady(conn) {
  try {
    if (!conn || !conn.sendMessage) return false;
    if (conn.ws && conn.ws.readyState !== undefined && conn.ws.readyState !== 1) return false;
    return true;
  } catch {
    return false;
  }
}

// ═══════════════════════════════════════════════════════════
// SCHEDULER — ABRIR/FECHAR GRUPO AUTOMATICAMENTE
// ═══════════════════════════════════════════════════════════

async function ABRIR_E_FECHAR_GRUPO(blackmd) {
  try {
    if (openclosegp.length === 0) return;
    for (let abrir of openclosegp) {
      if (!abrir.horarios || abrir.horarios.length === 0) continue;
      for (let fechar of abrir.horarios) {
        try {
          if (fechar.dias > 0) {
            if (Number(fechar.save) !== Number(sendHours("DD"))) {
              fechar.save = sendHours("DD")
              fechar.dias -= 1
              saveOpenCloseGP()
            }
          } else {
            if (contarMin(sendHours("HH:mm")) >= contarMin(fechar.hora) && !fechar.cobrado) {
              fechar.cobrado = true
              saveOpenCloseGP()

              if (!_isConnReady(blackmd)) {
                console.log("[ABRIR/FECHAR] Conexão indisponível, abortando...")
                return
              }

              let grupo = abrir.groupId
              let data;
              try {
                data = await blackmd.groupMetadata(grupo)
              } catch (e) {
                data = { subject: "indefinido" }
              }

              let AB = openclosegp.map(ab => ab.groupId).indexOf(grupo)
              let BC = openclosegp[AB].horarios.map(bc => bc.id).indexOf(fechar.id)

              if (fechar.func == `close`) {
                try { await blackmd.groupSettingUpdate(grupo, `announcement`) } catch (e) {}
                await sleep(2000)
                try {
                  await blackmd.sendMessage(grupo, {
                    text: `🔒 *O grupo ${data.subject || "indefinido"} foi FECHADO automaticamente pelo agendamento!*\n\nAgendado por @${fechar.adm.split("@")[0]}`,
                    mentions: [fechar.adm]
                  })
                } catch (e) {}
                if (AB >= 0 && BC >= 0) { openclosegp[AB].horarios.splice(BC, 1); saveOpenCloseGP() }
              } else {
                try { await blackmd.groupSettingUpdate(grupo, `not_announcement`) } catch (e) {}
                await sleep(2000)
                try {
                  await blackmd.sendMessage(grupo, {
                    text: `🩷 *O grupo ${data.subject || "indefinido"} foi ABERTO automaticamente pelo agendamento!*\n\nAgendado por @${fechar.adm.split("@")[0]}`,
                    mentions: [fechar.adm]
                  })
                } catch (e) {}
                if (AB >= 0 && BC >= 0) { openclosegp[AB].horarios.splice(BC, 1); saveOpenCloseGP() }
              }
            }
          }
        } catch (itemErr) {
          console.error(`[ABRIR/FECHAR] Erro ao processar horário:`, itemErr.message)
        }
      }
    }
  } catch (e) {
    console.error("[ABRIR/FECHAR] Erro geral:", e.message)
  }
}

function initAbrirFecharScheduler() {
  console.log("[ABRIR/FECHAR] Scheduler iniciado ✅")
  setInterval(() => {
    try {
      const conn = _getActiveConn()
      if (!_isConnReady(conn)) return
      ABRIR_E_FECHAR_GRUPO(conn).catch(e => console.error("[ABRIR/FECHAR] Erro no scheduler:", e.message))
    } catch (e) {
      console.error("[ABRIR/FECHAR] Erro no setInterval:", e.message)
    }
  }, 30000)
  setTimeout(() => {
    try {
      const conn = _getActiveConn()
      if (!_isConnReady(conn)) return
      ABRIR_E_FECHAR_GRUPO(conn).catch(e => console.error("[ABRIR/FECHAR] Erro inicial:", e.message))
    } catch (e) {}
  }, 8000)
}

// ═══════════════════════════════════════════════════════════
// LOCALIZAR CONEXÃO DO WHATSAPP — MULTI-ESTRATÉGIA
// O sandro.js ofuscado pode usar qualquer nome de variável global.
// Fazemos um scan em todos os globals para encontrar o socket do Baileys.
// ═══════════════════════════════════════════════════════════

function _getActiveConn() {
  // 1. Verificar global.conn (padrão)
  if (_isConnReady(global.conn)) return global.conn;

  // 2. Verificar referência capturada anteriormente
  if (_isConnReady(global._gleyceConnRef)) return global._gleyceConnRef;

  // 3. Escanear TODOS os globals para achar o socket do Baileys
  try {
    for (const key of Object.keys(global)) {
      try {
        const val = global[key];
        if (
          val && typeof val === 'object' &&
          typeof val.sendMessage === 'function' &&
          val.ev && typeof val.ev.on === 'function' &&
          typeof val.groupSettingUpdate === 'function'
        ) {
          global._gleyceConnRef = val;
          return val;
        }
      } catch (e) {}
    }
  } catch (e) {}

  return null;
}

// ═══════════════════════════════════════════════════════════
// CAPTURA DO SOCKET VIA PATCH DO BAILEYS (makeWASocket)
// ═══════════════════════════════════════════════════════════

;(function _patchBaileys() {
  try {
    const baileys = require('@whiskeysockets/baileys');
    if (baileys && baileys.makeWASocket && !baileys._gleycePatched) {
      const _orig = baileys.makeWASocket;
      baileys.makeWASocket = function(...args) {
        const sock = _orig.apply(this, args);
        if (sock) {
          setTimeout(() => {
            if (sock.sendMessage && sock.ev) {
              global._gleyceConnRef = sock;
              console.log('[GLEYCE BOT] ✅ Socket capturado via makeWASocket patch!');
              _tryRegistrar(sock);
            }
          }, 500);
        }
        return sock;
      };
      baileys._gleycePatched = true;
      console.log('[GLEYCE BOT] ✅ Baileys patcheado com sucesso!');
    }
  } catch (e) {
    // Baileys pode ter nome diferente — sem problema, o scan vai encontrar
  }
})();

// ═══════════════════════════════════════════════════════════
// FUNCIONALIDADES EXTRAS — ANTI-NUDEZ / AGENTE IA
// ═══════════════════════════════════════════════════════════

const _fetch = (() => {
  try { return require('node-fetch'); } catch(e) { return null; }
})();

const { downloadMediaMessage } = (() => {
  try { return require('@whiskeysockets/baileys'); } catch(e) { return { downloadMediaMessage: null }; }
})();

const _PREFIXOS = ['!', '/', '.', '#', '-'];

function _getTexto(msg) {
  const m = msg?.message;
  if (!m) return '';
  return (
    m.conversation ||
    m.extendedTextMessage?.text ||
    m.imageMessage?.caption ||
    m.videoMessage?.caption ||
    m.buttonsResponseMessage?.selectedDisplayText ||
    ''
  );
}

function _getPrefix(texto) {
  for (const p of _PREFIXOS) {
    if (texto && texto.startsWith(p)) return p;
  }
  return null;
}

async function _checkNudez(buffer) {
  if (!_fetch) return false;
  try {
    const FormData = require('form-data');
    const form = new FormData();
    form.append('image', buffer, { filename: 'img.jpg' });
    const res = await _fetch('https://api.deepai.org/api/nsfw-detector', {
      method: 'POST',
      headers: { 'api-key': 'quickstart-QUdJIGlzIGF3ZXNvbWU' },
      body: form,
      timeout: 10000
    });
    const data = await res.json();
    return Number(data?.output?.nsfw_score ?? 0) > 0.65;
  } catch (e) {
    return false;
  }
}

async function _chamarAgente(pergunta) {
  if (!_fetch) throw new Error('node-fetch não disponível');
  const url = 'https://text.pollinations.ai/' + encodeURIComponent(pergunta);
  const res = await _fetch(url, {
    headers: { 'User-Agent': 'GleyceBot/1.0' },
    timeout: 20000
  });
  const texto = await res.text();
  return (texto || '').trim().slice(0, 1500) || 'Sem resposta disponível.';
}

async function _baixarMidia(conn, msg) {
  if (downloadMediaMessage) {
    try {
      return await downloadMediaMessage(msg, 'buffer', {}, {
        logger: { info(){}, debug(){}, error(){}, warn(){} },
        reuploadRequest: conn.updateMediaMessage
      });
    } catch(e) {}
  }
  if (typeof conn.downloadMediaMessage === 'function') {
    try {
      const stream = await conn.downloadMediaMessage(msg);
      const chunks = [];
      for await (const c of stream) chunks.push(c);
      return Buffer.concat(chunks);
    } catch(e) {}
  }
  return null;
}

// ═══════════════════════════════════════════════════════════
// CONTROLE DE COMANDOS CUSTOMIZADOS
// Armazena o timestamp do último comando customizado por chat
// para suprimir a mensagem de "comando não encontrado" do sandro.js
// ═══════════════════════════════════════════════════════════

const _recentCustomCmds = {};

// ═══════════════════════════════════════════════════════════
// PROCESSADOR PRINCIPAL DE MENSAGENS
// ═══════════════════════════════════════════════════════════

async function _processarMsg(conn, msg) {
  if (!msg?.message) return;

  const from = msg.key.remoteJid;

  // ══ INTERCEPTAR MENSAGENS DO PRÓPRIO BOT ══
  // Remove a imagem/mensagem de erro antiga do sandro.js
  if (msg.key.fromMe) {
    try {
      const txt = _getTexto(msg);
      const temImagem = !!(msg.message?.imageMessage);
      const ehErro = (
        txt.includes('não foi encontrado') ||
        txt.includes('nao foi encontrado') ||
        txt.includes('não encontrado') ||
        (txt.includes('Utilize') && txt.includes('menu'))
      );

      // Suprimir mensagem de erro se veio logo após um comando customizado
      const recente = _recentCustomCmds[from];
      const dentroDoTempo = recente && (Date.now() - recente) < 8000;

      if (ehErro && dentroDoTempo) {
        await conn.sendMessage(from, { delete: msg.key }).catch(() => {});
        delete _recentCustomCmds[from];
        return;
      }

      // Suprimir QUALQUER mensagem de erro com imagem (foto antiga do menu)
      // mesmo sem comando customizado recente
      if (temImagem && ehErro) {
        await conn.sendMessage(from, { delete: msg.key }).catch(() => {});
        return;
      }
    } catch (e) {}
    return;
  }

  const isGroup = from?.endsWith('@g.us');
  const sender  = msg.key.participant || msg.key.remoteJid;
  const msgContent = msg.message;

  // ══ ANTI-NUDEZ: Visualização Única ══
  const voMsg = msgContent?.viewOnceMessage?.message
              || msgContent?.viewOnceMessageV2?.message
              || msgContent?.viewOnceMessageV2Extension?.message;
  if (voMsg && isGroup && (voMsg.imageMessage || voMsg.videoMessage)) {
    try {
      const buf = await _baixarMidia(conn, msg);
      if (buf && await _checkNudez(buf)) {
        await conn.sendMessage(from, { delete: msg.key }).catch(() => {});
        await conn.sendMessage(from, {
          text: `⚠️ *[PROTEÇÃO GLEYCE BOT]* Foto/vídeo de visualização única com conteúdo +18 enviado por @${sender.split('@')[0]} foi *removido automaticamente*.`,
          mentions: [sender]
        });
      }
    } catch (e) {}
    return;
  }

  // ══ ANTI-NUDEZ: Figurinhas +18 ══
  if (msgContent?.stickerMessage && isGroup) {
    try {
      const buf = await _baixarMidia(conn, msg);
      if (buf && await _checkNudez(buf)) {
        await conn.sendMessage(from, { delete: msg.key }).catch(() => {});
        await conn.sendMessage(from, {
          text: `⚠️ *[PROTEÇÃO GLEYCE BOT]* Figurinha com conteúdo +18 enviada por @${sender.split('@')[0]} foi *removida automaticamente*.`,
          mentions: [sender]
        });
      }
    } catch (e) {}
    return;
  }

  // ══ PROCESSAR COMANDOS DE TEXTO ══
  const texto  = _getTexto(msg);
  const prefix = _getPrefix(texto);
  if (!prefix) return;

  const partes = texto.slice(prefix.length).trim().split(/\s+/);
  const cmd    = (partes[0] || '').toLowerCase();
  const args   = partes.slice(1);

  // Verificar admin no grupo
  let isAdmin = false;
  if (isGroup) {
    try {
      const meta   = await conn.groupMetadata(from);
      const admins = meta.participants.filter(p => p.admin).map(p => p.id);
      isAdmin = admins.includes(sender);
    } catch (e) {}
  }

  // ── ABRIR GRUPO ──
  if (['abrir', 'abrirgrupo', 'opengroup', 'abrirg', 'open'].includes(cmd)) {
    _recentCustomCmds[from] = Date.now();
    if (!isGroup) {
      await conn.sendMessage(from, { text: '❌ Este comando só funciona em grupos!' });
      return;
    }
    if (!isAdmin) {
      await conn.sendMessage(from, { text: '❌ Apenas *administradores* podem usar este comando!' });
      return;
    }
    const horario = args[0] || '';
    if (horario) {
      try {
        rgGroupOCfunc(from);
        addOpenCloseGP(from, horario, sender, 'open');
        const horaTexto = horario.includes(':') ? `às ${horario}` : `em ${horario}`;
        await conn.sendMessage(from, {
          text: `🩷 *Gleyce Bot — Agendamento criado!*\n\n` +
                `✅ Grupo será *ABERTO* ${horaTexto}\n\n` +
                `O bot abrirá automaticamente, sem precisar de admin online. 🤖`
        });
      } catch (e) {
        await conn.sendMessage(from, {
          text: `❌ Erro ao agendar: ${e.message}\n\n` +
                `*Formatos aceitos:*\n` +
                `• ${prefix}abrir 22:00 — às 22h exato\n` +
                `• ${prefix}abrir 2h — em 2 horas\n` +
                `• ${prefix}abrir 30m — em 30 minutos`
        });
      }
    } else {
      try {
        await conn.groupSettingUpdate(from, 'not_announcement');
        await conn.sendMessage(from, {
          text: `🩷 *Gleyce Bot:*\n\n✅ Grupo *ABERTO!* Todos os membros já podem enviar mensagens.`
        });
      } catch (e) {
        await conn.sendMessage(from, { text: '❌ Erro ao abrir grupo: ' + e.message });
      }
    }
    return;
  }

  // ── FECHAR GRUPO ──
  if (['fechar', 'fechargrupo', 'closegroup', 'fecharg', 'close'].includes(cmd)) {
    _recentCustomCmds[from] = Date.now();
    if (!isGroup) {
      await conn.sendMessage(from, { text: '❌ Este comando só funciona em grupos!' });
      return;
    }
    if (!isAdmin) {
      await conn.sendMessage(from, { text: '❌ Apenas *administradores* podem usar este comando!' });
      return;
    }
    const horario = args[0] || '';
    if (horario) {
      try {
        rgGroupOCfunc(from);
        addOpenCloseGP(from, horario, sender, 'close');
        const horaTexto = horario.includes(':') ? `às ${horario}` : `em ${horario}`;
        await conn.sendMessage(from, {
          text: `🔒 *Gleyce Bot — Agendamento criado!*\n\n` +
                `✅ Grupo será *FECHADO* ${horaTexto}\n\n` +
                `O bot fechará automaticamente, sem precisar de admin online. 🤖`
        });
      } catch (e) {
        await conn.sendMessage(from, {
          text: `❌ Erro ao agendar: ${e.message}\n\n` +
                `*Formatos aceitos:*\n` +
                `• ${prefix}fechar 22:00 — às 22h exato\n` +
                `• ${prefix}fechar 2h — em 2 horas\n` +
                `• ${prefix}fechar 30m — em 30 minutos`
        });
      }
    } else {
      try {
        await conn.groupSettingUpdate(from, 'announcement');
        await conn.sendMessage(from, {
          text: `🔒 *Gleyce Bot:*\n\n✅ Grupo *FECHADO!* Só administradores podem enviar mensagens.`
        });
      } catch (e) {
        await conn.sendMessage(from, { text: '❌ Erro ao fechar grupo: ' + e.message });
      }
    }
    return;
  }

  // ── VER AGENDAMENTOS ──
  if (['agendamentos', 'listarag', 'horarios', 'listar-horarios'].includes(cmd)) {
    _recentCustomCmds[from] = Date.now();
    if (!isGroup) {
      await conn.sendMessage(from, { text: '❌ Este comando só funciona em grupos!' });
      return;
    }
    try {
      rgGroupOCfunc(from);
      const lista = getGroupOpenCloseFunc(from);
      if (!lista || lista.length === 0) {
        await conn.sendMessage(from, {
          text: `📋 *Agendamentos deste grupo:*\n\nNenhum agendamento ativo no momento.\n\n` +
                `Use:\n• ${prefix}abrir HH:MM ou ${prefix}abrir 2h\n• ${prefix}fechar HH:MM ou ${prefix}fechar 30m`
        });
      } else {
        let txt = `📋 *Agendamentos deste grupo:*\n\n`;
        lista.forEach((ag, i) => {
          const tipo = ag.func === 'open' ? '🔓 ABRIR' : '🔒 FECHAR';
          txt += `${i + 1}. ${tipo} às *${ag.hora}* (em ${ag.dias} dia(s))\n   ID: \`${ag.id}\`\n\n`;
        });
        txt += `Para cancelar: ${prefix}cancelarag <ID>`;
        await conn.sendMessage(from, { text: txt });
      }
    } catch (e) {
      await conn.sendMessage(from, { text: '❌ Erro: ' + e.message });
    }
    return;
  }

  // ── CANCELAR AGENDAMENTO ──
  if (['cancelarag', 'removerag', 'deletarag', 'cancerag'].includes(cmd)) {
    _recentCustomCmds[from] = Date.now();
    if (!isGroup) {
      await conn.sendMessage(from, { text: '❌ Este comando só funciona em grupos!' });
      return;
    }
    if (!isAdmin) {
      await conn.sendMessage(from, { text: '❌ Apenas administradores podem cancelar agendamentos!' });
      return;
    }
    const id = args[0] || '';
    if (!id) {
      await conn.sendMessage(from, { text: `❌ Informe o ID do agendamento.\n\nUse: ${prefix}agendamentos para ver os IDs` });
      return;
    }
    try {
      rgGroupOCfunc(from);
      if (!isIDopenCloseGP(from, id)) {
        await conn.sendMessage(from, { text: `❌ Agendamento com ID \`${id}\` não encontrado!` });
        return;
      }
      rmOpenCloseGP(from, id);
      await conn.sendMessage(from, { text: `✅ Agendamento \`${id}\` cancelado com sucesso!` });
    } catch (e) {
      await conn.sendMessage(from, { text: '❌ Erro: ' + e.message });
    }
    return;
  }

  // ── AGENTE IA ──
  if (['agente', 'ia', 'gpt', 'ask', 'perguntar', 'agenteia'].includes(cmd)) {
    _recentCustomCmds[from] = Date.now();
    const pergunta = args.join(' ').trim();
    if (!pergunta) {
      await conn.sendMessage(from, {
        text: `🧚‍♀️ *Agente IA — Gleyce Bot*\n\n` +
              `Use: ${prefix}agente <sua pergunta>\n\n` +
              `Exemplo:\n${prefix}agente O que é inteligência artificial?`
      });
      return;
    }
    await conn.sendMessage(from, { text: '🧚‍♀️ *Agente IA consultando... aguarde!*' });
    try {
      const resp = await _chamarAgente(pergunta);
      await conn.sendMessage(from, {
        text: `🧚‍♀️ *Agente IA — Gleyce Bot*\n\n${resp}`
      });
    } catch (e) {
      await conn.sendMessage(from, { text: '❌ IA indisponível no momento: ' + e.message });
    }
    return;
  }
}

// ═══════════════════════════════════════════════════════════
// REGISTRO DO INTERCEPTOR NO SOCKET
// ═══════════════════════════════════════════════════════════

function _tryRegistrar(conn) {
  if (!conn || !conn.ev) return false;

  // Se já registrado nesta mesma instância, não registrar de novo
  if (global._gleyceConnRef === conn && global._gleyceInterceptorOk) return true;

  // Novo socket (reconexão) → resetar flag
  if (global._gleyceConnRef !== conn) {
    global._gleyceInterceptorOk = false;
  }

  if (global._gleyceInterceptorOk) return true;

  global._gleyceInterceptorOk = true;
  global._gleyceConnRef = conn;

  conn.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    for (const msg of messages) {
      // Usar sempre a conexão mais recente disponível
      const activeConn = _getActiveConn() || conn;
      _processarMsg(activeConn, msg).catch(() => {});
    }
  });

  // Detectar reconexão — quando o socket fecha, resetar o flag
  if (conn.ev.on) {
    conn.ev.on('connection.update', ({ connection }) => {
      if (connection === 'close') {
        // Na reconexão, o sandro.js criará um novo socket
        // O polling vai detectar e re-registrar
        global._gleyceInterceptorOk = false;
        global._gleyceConnRef = null;
      }
    });
  }

  console.log('[GLEYCE BOT] ✅ Interceptor ativo! /abrir /fechar /agente /agendamentos prontos.');
  return true;
}

// ═══════════════════════════════════════════════════════════
// AUTO-INIT — POLLING ÚNICO E ROBUSTO
// Encontra a conexão independente do nome de variável usado
// pelo sandro.js ofuscado
// ═══════════════════════════════════════════════════════════

;(function _autoInit() {
  let _tentativas = 0;
  const MAX = 300; // até 25 minutos (5s * 300)

  function _tick() {
    _tentativas++;

    // 1. Verificar se o conn atual mudou (reconexão)
    if (global._gleyceConnRef && !global._gleyceInterceptorOk) {
      const conn = _getActiveConn();
      if (conn) { _tryRegistrar(conn); return; }
    }

    // 2. Se já registrado, verificar se ainda válido
    if (global._gleyceInterceptorOk && _isConnReady(global._gleyceConnRef)) return;

    // 3. Tentar encontrar o conn
    const conn = _getActiveConn();
    if (conn) {
      _tryRegistrar(conn);
      return;
    }

    if (_tentativas >= MAX) {
      console.log('[GLEYCE BOT] ⚠️ Não foi possível encontrar a conexão após 25min.');
      clearInterval(_iv);
    }
  }

  // Tentativa inicial após 3s (conexão pode ainda não existir)
  setTimeout(_tick, 3000);
  // Tentativa após 6s
  setTimeout(_tick, 6000);
  // Polling a cada 5s
  const _iv = setInterval(_tick, 5000);
})();

// ═══════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════

function initInterceptorComandos(conn) {
  _tryRegistrar(conn);
}

module.exports = {
  openclosegp,
  saveOpenCloseGP,
  rgGroupOCfunc,
  getGroupOpenCloseFunc,
  addOpenCloseGP,
  rmOpenCloseGP,
  isIDopenCloseGP,
  ABRIR_E_FECHAR_GRUPO,
  getLastOpenCloseGP,
  initAbrirFecharScheduler,
  initInterceptorComandos
}
