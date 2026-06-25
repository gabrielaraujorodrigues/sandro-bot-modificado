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

// ── Processador principal de mensagens ──
async function _processarMsg(conn, msg) {
  if (!msg?.message || msg.key.fromMe) return;

  const from = msg.key.remoteJid;
  const isGroup = from?.endsWith('@g.us');
  const sender = msg.key.participant || msg.key.remoteJid;
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
        console.log('[ANTI-NUDEZ] View-once removido de', sender);
      }
    } catch(e) { console.error('[ANTI-NUDEZ VO] Erro:', e.message); }
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
        console.log('[ANTI-NUDEZ] Sticker removido de', sender);
      }
    } catch(e) { console.error('[ANTI-NUDEZ STK] Erro:', e.message); }
    return;
  }

  // ══ COMANDOS VIA TEXTO ══
  const texto = _getTexto(msg);
  const prefix = _getPrefix(texto);
  if (!prefix) return;

  const partes = texto.slice(prefix.length).trim().split(/\s+/);
  const cmd = (partes[0] || '').toLowerCase();
  const args = partes.slice(1);

  // Verificar admin no grupo
  let isAdmin = false;
  if (isGroup) {
    try {
      const meta = await conn.groupMetadata(from);
      const admins = meta.participants.filter(p => p.admin).map(p => p.id);
      isAdmin = admins.includes(sender);
    } catch(e) {}
  }

  // ── ABRIR GRUPO ──
  if (['abrir', 'abrirgrupo', 'opengroup', 'abrirg', 'open'].includes(cmd)) {
    if (!isGroup) { await conn.sendMessage(from, { text: '❌ Este comando só funciona em grupos!' }); return; }
    if (!isAdmin) { await conn.sendMessage(from, { text: '❌ Apenas *administradores* podem usar este comando!' }); return; }
    try {
      await conn.groupSettingUpdate(from, 'not_announcement');
      await conn.sendMessage(from, { text: '🩷 *Gleyce Bot:* Grupo *aberto!* ✅\n\nTodos os membros já podem enviar mensagens normalmente.' });
    } catch(e) { await conn.sendMessage(from, { text: '❌ Erro ao abrir grupo: ' + e.message }); }
    return;
  }

  // ── FECHAR GRUPO ──
  if (['fechar', 'fechargrupo', 'closegroup', 'fecharg', 'close'].includes(cmd)) {
    if (!isGroup) { await conn.sendMessage(from, { text: '❌ Este comando só funciona em grupos!' }); return; }
    if (!isAdmin) { await conn.sendMessage(from, { text: '❌ Apenas *administradores* podem usar este comando!' }); return; }
    try {
      await conn.groupSettingUpdate(from, 'announcement');
      await conn.sendMessage(from, { text: '🔒 *Gleyce Bot:* Grupo *fechado!* ❌\n\nSomente administradores podem enviar mensagens.' });
    } catch(e) { await conn.sendMessage(from, { text: '❌ Erro ao fechar grupo: ' + e.message }); }
    return;
  }

  // ── AGENTE IA ──
  if (['agente', 'ia', 'gpt', 'ask', 'perguntar'].includes(cmd)) {
    const pergunta = args.join(' ').trim();
    if (!pergunta) {
      await conn.sendMessage(from, { text: `🧚‍♀️ *Agente IA — Gleyce Bot*\n\nUse: ${prefix}agente <sua pergunta>\n\nExemplo: ${prefix}agente O que é inteligência artificial?` });
      return;
    }
    await conn.sendMessage(from, { text: '🧚‍♀️ *Agente IA consultando...*' });
    try {
      const resp = await _chamarAgente(pergunta);
      await conn.sendMessage(from, { text: `🧚‍♀️ *Agente IA — Gleyce Bot*\n\n${resp}` });
    } catch(e) { await conn.sendMessage(from, { text: '❌ ' + e.message }); }
    return;
  }
}

// ── Inicializador do interceptor ──
let _interceptorOk = false;

function initInterceptorComandos() {
  let tentativas = 0;

  const tentar = () => {
    const conn = global.conn;
    if (!conn || !conn.ev || _interceptorOk) return;
    _interceptorOk = true;

    conn.ev.on('messages.upsert', async ({ messages, type }) => {
      if (type !== 'notify') return;
      for (const msg of messages) {
        _processarMsg(conn, msg).catch(e => console.error('[INTERCEPTOR] Erro:', e.message));
      }
    });

    console.log('[GLEYCE BOT] Interceptor de comandos extras ativo ✅');
  };

  // Tentar a cada 5s até conseguir
  const iv = setInterval(() => {
    tentativas++;
    tentar();
    if (_interceptorOk || tentativas > 120) clearInterval(iv);
  }, 5000);

  setTimeout(tentar, 3000);
}

module.exports.initInterceptorComandos = initInterceptorComandos;

module.exports = { openclosegp, saveOpenCloseGP, rgGroupOCfunc, getGroupOpenCloseFunc, addOpenCloseGP, rmOpenCloseGP, isIDopenCloseGP, ABRIR_E_FECHAR_GRUPO, getLastOpenCloseGP, initAbrirFecharScheduler, initInterceptorComandos }