const fs = require("fs")
const moment = require('moment-timezone');
const { getGroupAdmins } = require(`../../consts-func.js`)

function saveJSON(inter, caminho) {
  fs.writeFileSync(caminho, JSON.stringify(inter, null, 2));
}

const isJsonIncludes = (json, value) => {
  if (JSON.stringify(json).includes(value)) return true
  return false
}

const contar = (frase, letraProcurada) => {
  total = 0
  for (i = 0; i < frase.length; i++) {
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
  nmr = Number(base_b)
  b = nmr % 60
  a = (nmr - b) / 60
  return `${a < 10 ? `0` + a : a}:${b < 10 ? `0` + b : b}`
}

const sendHours = (formato) => {
  moment.locale("pt")
  return moment.tz('America/Sao_Paulo').format(formato)
}

const sleep = async (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

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
  caixa = []
  for (i of openclosegp) {
    if (from == i.groupId) caixa.push(i)
  }
  return caixa[0].horarios
}

function addOpenCloseGP(from, horario, adm, af = `open`) {
  if (horario.includes(`:`)) {
    a = contarMin(horario)
    b = a % 1440
    day = (a - b) / 1440
    hr = converterMin(b)
  } else {
    letra = String(horario).slice(horario.length - 1, horario.length).toLowerCase()
    if (letra == `d`) mp = 60 * 24
    else if (letra == `h`) mp = 60
    else mp = 1
    nmr = Number(String(horario).slice(0, horario.length - 1)) || 1
    nmr *= mp
    ha = contarMin(sendHours("HH:mm")) + nmr
    parte = ha % 1440
    day = (ha - parte) / 1440
    hr = converterMin(parte)
  }
  if (day == 0 && contarMin(hr) < contarMin(sendHours("HH:mm"))) {
    day += 1
  }
  grupo = getGroupOpenCloseFunc(from)
  grupo.push({ id: sendHours("DDMMYYHHmmss"), func: af, hora: hr, dias: day, save: sendHours("DD"), cobrado: false, adm: adm })
  saveOpenCloseGP()
}

const getLastOpenCloseGP = (from) => {
  grupo = getGroupOpenCloseFunc(from)
  return grupo[grupo.length - 1]
}

const isIDopenCloseGP = (from, id) => {
  grupo = getGroupOpenCloseFunc(from)
  AB = grupo.map(i => i.id).indexOf(id)
  return AB >= 0 ? true : false
}

function rmOpenCloseGP(from, id) {
  grupo = getGroupOpenCloseFunc(from)
  AB = grupo.map(i => i.id).indexOf(id)
  grupo.splice(AB, 1)
  saveOpenCloseGP()
}

// ── Função auxiliar: verificar se a conexão está realmente ativa ──
function _isConnReady() {
  try {
    const conn = global.conn;
    if (!conn || !conn.sendMessage) return false;
    if (conn.ws && conn.ws.readyState !== undefined && conn.ws.readyState !== 1) return false;
    return true;
  } catch {
    return false;
  }
}

async function ABRIR_E_FECHAR_GRUPO(blackmd) {
  try {
    if (openclosegp.length > 0) {
      for (abrir of openclosegp) {
        if (abrir.horarios.length > 0) {
          for (fechar of abrir.horarios) {
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

                  // ═══ VERIFICAR CONEXÃO ANTES DE AGIR ═══
                  if (!_isConnReady()) {
                    console.log("[ABRIR/FECHAR] Conexão indisponível, abortando operação...")
                    return
                  }

                  grupo = abrir.groupId
                  let data;
                  try {
                    data = await blackmd.groupMetadata(grupo)
                  } catch (e) {
                    console.error(`[ABRIR/FECHAR] Erro ao obter metadados do grupo ${grupo}:`, e.message)
                    data = { subject: "indefinido" }
                  }
                  AB = openclosegp.map(ab => ab.groupId).indexOf(grupo)
                  BC = openclosegp[AB].horarios.map(bc => bc.id).indexOf(fechar.id)
                  if (fechar.func == `close`) {
                    try { await blackmd.groupSettingUpdate(grupo, `announcement`) } catch (e) { console.error(`[ABRIR/FECHAR] Erro ao fechar grupo ${grupo}:`, e.message) }
                    await sleep(2500)
                    try { await blackmd.sendMessage(grupo, { text: `[❗] *O grupo ${data.subject || `"indefinido"`} foi fechado pelo ADM @${fechar.adm.split("@")[0]} em horário programado com sucesso* ❌`, mentions: [fechar.adm] }) } catch (e) { console.error(`[ABRIR/FECHAR] Erro ao enviar msg:`, e.message) }
                    if (AB >= 0 && BC >= 0) { openclosegp[AB].horarios.splice(BC, 1); saveOpenCloseGP() }
                  } else {
                    try { await blackmd.groupSettingUpdate(grupo, `not_announcement`) } catch (e) { console.error(`[ABRIR/FECHAR] Erro ao abrir grupo ${grupo}:`, e.message) }
                    await sleep(2500)
                    try { await blackmd.sendMessage(grupo, { text: `[❕] *O grupo ${data.subject || `"indefinido"`} foi aberto pelo ADM @${fechar.adm.split("@")[0]} em horário programado com sucesso* ✔`, mentions: [fechar.adm] }) } catch (e) { console.error(`[ABRIR/FECHAR] Erro ao enviar msg:`, e.message) }
                    if (AB >= 0 && BC >= 0) { openclosegp[AB].horarios.splice(BC, 1); saveOpenCloseGP() }
                  }
                }
              }
            } catch (itemErr) {
              console.error(`[ABRIR/FECHAR] Erro ao processar horário:`, itemErr.message)
            }
          }
        }
      }
    }
  } catch (e) {
    console.error("[ABRIR/FECHAR] Erro geral:", e.message)
  }
}

// ── Scheduler independente (usa global.conn dinâmico) ──
function initAbrirFecharScheduler() {
  console.log("[ABRIR/FECHAR] Scheduler independente iniciado ✅")

  setInterval(() => {
    try {
      if (!_isConnReady()) return
      ABRIR_E_FECHAR_GRUPO(global.conn).catch(e => console.error("[ABRIR/FECHAR] Erro no scheduler:", e.message))
    } catch (e) {
      console.error("[ABRIR/FECHAR] Erro no setInterval:", e.message)
    }
  }, 30000)

  // Primeira verificação após 5s
  setTimeout(() => {
    try {
      if (!_isConnReady()) return
      ABRIR_E_FECHAR_GRUPO(global.conn).catch(e => console.error("[ABRIR/FECHAR] Erro na primeira verificação:", e.message))
    } catch (e) {
      console.error("[ABRIR/FECHAR] Erro no setTimeout:", e.message)
    }
  }, 5000)
}



// ═══════════════════════════════════════════════════════
// === COMANDOS EXTRAS + ANTI-NUDEZ — Gleyce Bot Oficial ===
// ═══════════════════════════════════════════════════════

const _fetch = require('node-fetch');
const { downloadMediaMessage } = (() => {
  try { return require('@whiskeysockets/baileys'); } catch(e) { return { downloadMediaMessage: null }; }
})();

// Prefixos aceitos
const _PREFIXOS = ['!', '/', '.', '#', '-'];

function _getTexto(msg) {
  const m = msg?.message;
  if (!m) return '';
  return m.conversation || m.extendedTextMessage?.text || m.imageMessage?.caption || m.videoMessage?.caption || '';
}

function _getPrefix(texto) {
  for (const p of _PREFIXOS) { if (texto && texto.startsWith(p)) return p; }
  return null;
}

// ── Detector de nudez via DeepAI (chave pública de teste) ──
async function _checkNudez(buffer) {
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
    const score = data?.output?.nsfw_score ?? 0;
    return Number(score) > 0.65;
  } catch (e) {
    return false;
  }
}

// ── Agente IA via Pollinations (gratuito, sem chave) ──
async function _chamarAgente(pergunta) {
  try {
    const url = 'https://text.pollinations.ai/' + encodeURIComponent(pergunta);
    const res = await _fetch(url, {
      headers: { 'User-Agent': 'GleyceBot/1.0' },
      timeout: 20000
    });
    const texto = await res.text();
    return (texto || '').trim().slice(0, 1500) || 'Sem resposta disponível.';
  } catch (e) {
    throw new Error('Serviço de IA indisponível: ' + e.message);
  }
}

// ── Baixar mídia compatível com Baileys v6/v7 ──
async function _baixarMidia(conn, msg) {
  if (downloadMediaMessage) {
    const buf = await downloadMediaMessage(msg, 'buffer', {}, { logger: { info(){}, debug(){}, error(){}, warn(){} }, reuploadRequest: conn.updateMediaMessage });
    return buf;
  }
  // fallback legado
  if (typeof conn.downloadMediaMessage === 'function') {
    const stream = await conn.downloadMediaMessage(msg);
    const chunks = [];
    for await (const c of stream) chunks.push(c);
    return Buffer.concat(chunks);
  }
  return null;
}

// ── Mapa de comandos customizados recentes (suprimir erro do sandro.js) ──
const _recentCustomCmds = {};

// ── Processador principal de mensagens ──
async function _processarMsg(conn, msg) {
  if (!msg?.message) return;

  const from = msg.key.remoteJid;

  // ══ SUPRIMIR "comando não encontrado" do sandro.js ══
  // Quando o bot manda a mensagem de erro logo após um cmd customizado, deletamos
  if (msg.key.fromMe) {
    try {
      const txt = msg.message?.conversation
                || msg.message?.extendedTextMessage?.text
                || msg.message?.imageMessage?.caption
                || msg.message?.videoMessage?.caption
                || '';
      const ehErro = txt.includes('não foi encontrado')
                  || txt.includes('nao foi encontrado')
                  || (txt.includes('Utilize') && txt.includes('menu'));
      const recente = _recentCustomCmds[from];
      if (ehErro && recente && (Date.now() - recente) < 6000) {
        await conn.sendMessage(from, { delete: msg.key }).catch(() => {});
        delete _recentCustomCmds[from];
      }
    } catch(e) {}
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
    } catch(e) {}
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
    } catch(e) {}
    return;
  }

  // ══ COMANDOS VIA TEXTO ══
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
    } catch(e) {}
  }

  // ── ABRIR GRUPO (imediato ou agendado) ──
  if (['abrir', 'abrirgrupo', 'opengroup', 'abrirg'].includes(cmd)) {
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
        const horaTexto = horario.includes(':') ? horario : `em ${horario}`;
        await conn.sendMessage(from, {
          text: `🩷 *Gleyce Bot — Agendamento:*

✅ Grupo será *ABERTO* ${horaTexto}!

O bot abrirá automaticamente, sem precisar de admin online.`
        });
      } catch(e) {
        await conn.sendMessage(from, {
          text: `❌ Erro: ${e.message}

*Formatos aceitos:*
• ${prefix}abrir 22:00 — às 22h
• ${prefix}abrir 2h — em 2 horas
• ${prefix}abrir 30m — em 30 minutos`
        });
      }
    } else {
      try {
        await conn.groupSettingUpdate(from, 'not_announcement');
        await conn.sendMessage(from, {
          text: `🩷 *Gleyce Bot:*

✅ Grupo *ABERTO!* Todos os membros já podem enviar mensagens.`
        });
      } catch(e) {
        await conn.sendMessage(from, { text: '❌ Erro ao abrir grupo: ' + e.message });
      }
    }
    return;
  }

  // ── FECHAR GRUPO (imediato ou agendado) ──
  if (['fechar', 'fechargrupo', 'closegroup', 'fecharg'].includes(cmd)) {
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
        const horaTexto = horario.includes(':') ? horario : `em ${horario}`;
        await conn.sendMessage(from, {
          text: `🔒 *Gleyce Bot — Agendamento:*

✅ Grupo será *FECHADO* ${horaTexto}!

O bot fechará automaticamente, sem precisar de admin online.`
        });
      } catch(e) {
        await conn.sendMessage(from, {
          text: `❌ Erro: ${e.message}

*Formatos aceitos:*
• ${prefix}fechar 22:00 — às 22h
• ${prefix}fechar 2h — em 2 horas
• ${prefix}fechar 30m — em 30 minutos`
        });
      }
    } else {
      try {
        await conn.groupSettingUpdate(from, 'announcement');
        await conn.sendMessage(from, {
          text: `🔒 *Gleyce Bot:*

✅ Grupo *FECHADO!* Só administradores podem enviar mensagens.`
        });
      } catch(e) {
        await conn.sendMessage(from, { text: '❌ Erro ao fechar grupo: ' + e.message });
      }
    }
    return;
  }

  // ── AGENTE IA ──
  if (['agente', 'ia', 'gpt', 'ask', 'perguntar'].includes(cmd)) {
    _recentCustomCmds[from] = Date.now();
    const pergunta = args.join(' ').trim();
    if (!pergunta) {
      await conn.sendMessage(from, {
        text: `🧚‍♀️ *Agente IA — Gleyce Bot*

Use: ${prefix}agente <sua pergunta>

Exemplo:
${prefix}agente O que é inteligência artificial?`
      });
      return;
    }
    await conn.sendMessage(from, { text: '🧚‍♀️ *Agente IA consultando... aguarde!*' });
    try {
      const resp = await _chamarAgente(pergunta);
      await conn.sendMessage(from, {
        text: `🧚‍♀️ *Agente IA — Gleyce Bot*

${resp}`
      });
    } catch(e) {
      await conn.sendMessage(from, { text: '❌ IA indisponível no momento: ' + e.message });
    }
    return;
  }
}

// ── Auto-iniciar interceptor ao carregar o módulo ──
// sandro.js faz require() deste arquivo mas não chama initInterceptorComandos()
// Por isso iniciamos sozinhos, com polling até global.conn estar pronto
;(function _autoInit() {
  function _registrar(conn) {
    if (global._gleyceInterceptorOk) return;
    global._gleyceInterceptorOk = true;
    conn.ev.on('messages.upsert', async ({ messages, type }) => {
      if (type !== 'notify') return;
      for (const msg of messages) {
        _processarMsg(conn, msg).catch(() => {});
      }
    });
    console.log('[GLEYCE BOT] ✅ Interceptor ativo! Comandos /abrir /fechar /agente prontos.');
  }

  // Tentativa imediata após 3s
  setTimeout(() => { if (global.conn?.ev) _registrar(global.conn); }, 3000);

  // Polling a cada 5s por até 20 min
  let _n = 0;
  const _iv = setInterval(() => {
    _n++;
    if (global.conn?.ev) { _registrar(global.conn); clearInterval(_iv); }
    if (_n > 240) clearInterval(_iv);
  }, 5000);
})();

;(function _autoInit() {
  let _tentativas = 0;
  const _iv = setInterval(() => {
    _tentativas++;
    const conn = global.conn;
    if (conn && conn.ev && !global._gleyceInterceptorOk) {
      global._gleyceInterceptorOk = true;
      clearInterval(_iv);
      conn.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;
        for (const msg of messages) {
          _processarMsg(conn, msg).catch(() => {});
        }
      });
      console.log('[GLEYCE BOT] ✅ Interceptor de comandos extras ativo!');
    }
    if (_tentativas > 240) clearInterval(_iv); // desiste após 20min
  }, 5000);
  // Tentativa imediata após 3s
  setTimeout(() => {
    const conn = global.conn;
    if (conn && conn.ev && !global._gleyceInterceptorOk) {
      global._gleyceInterceptorOk = true;
      conn.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;
        for (const msg of messages) {
          _processarMsg(conn, msg).catch(() => {});
        }
      });
      console.log('[GLEYCE BOT] ✅ Interceptor de comandos extras ativo!');
    }
  }, 3000);
})();

module.exports = { openclosegp, saveOpenCloseGP, rgGroupOCfunc, getGroupOpenCloseFunc, addOpenCloseGP, rmOpenCloseGP, isIDopenCloseGP, ABRIR_E_FECHAR_GRUPO, getLastOpenCloseGP, initAbrirFecharScheduler, initInterceptorComandos }
