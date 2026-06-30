const { readJSON, writeJSON } = require('./database');
const moment = require('moment-timezone');

function _now(fmt) { return moment.tz('America/Sao_Paulo').format(fmt); }
function _minutos(h) { const [hh, mm] = h.split(':').map(Number); return hh * 60 + mm; }

function getAgendamentos(groupId) {
  const all = readJSON('agendamentos', []);
  let entry = all.find((g) => g.groupId === groupId);
  if (!entry) { entry = { groupId, horarios: [] }; all.push(entry); writeJSON('agendamentos', all); }
  return entry.horarios;
}

function _save(groupId, horarios) {
  const all = readJSON('agendamentos', []);
  const idx = all.findIndex((g) => g.groupId === groupId);
  if (idx >= 0) all[idx].horarios = horarios; else all.push({ groupId, horarios });
  writeJSON('agendamentos', all);
}

function adicionarAgendamento(groupId, input, adminId, tipo) {
  const horarios = getAgendamentos(groupId);
  let minutos;
  if (input.includes(':')) {
    const alvo = _minutos(input);
    const atual = _minutos(_now('HH:mm'));
    minutos = alvo > atual ? alvo - atual : (1440 - atual) + alvo;
  } else {
    const letra = input.slice(-1).toLowerCase();
    const val = parseFloat(input) || 1;
    minutos = val * (letra === 'd' ? 1440 : letra === 'h' ? 60 : 1);
  }
  const novo = { id: _now('DDMMYYHHmmss'), tipo, executarEm: Date.now() + minutos * 60000, horarioTexto: input, adminId };
  horarios.push(novo);
  _save(groupId, horarios);
  return novo;
}

function cancelarAgendamento(groupId, id) {
  const h = getAgendamentos(groupId);
  const idx = h.findIndex((x) => x.id === id);
  if (idx < 0) return false;
  h.splice(idx, 1);
  _save(groupId, h);
  return true;
}

async function processarAgendamentos(sock) {
  const all = readJSON('agendamentos', []);
  for (const grupo of all) {
    if (!grupo.horarios?.length) continue;
    for (const item of [...grupo.horarios]) {
      if (item.executarEm > Date.now()) continue;
      try {
        let nome = 'grupo';
        try { nome = (await sock.groupMetadata(grupo.groupId)).subject; } catch {}
        if (item.tipo === 'close') {
          await sock.groupSettingUpdate(grupo.groupId, 'announcement');
          await sock.sendMessage(grupo.groupId, { text: `🔒 *${nome}* foi FECHADO automaticamente!\n\nAgendado por @${item.adminId.split('@')[0]}`, mentions: [item.adminId] });
        } else {
          await sock.groupSettingUpdate(grupo.groupId, 'not_announcement');
          await sock.sendMessage(grupo.groupId, { text: `🔓 *${nome}* foi ABERTO automaticamente!\n\nAgendado por @${item.adminId.split('@')[0]}`, mentions: [item.adminId] });
        }
      } catch (e) { console.error('[SCHEDULER]', e.message); }
      cancelarAgendamento(grupo.groupId, item.id);
    }
  }
}

function iniciarScheduler(sock) {
  console.log('[SCHEDULER] Iniciado ✅');
  setInterval(() => processarAgendamentos(sock).catch((e) => console.error('[SCHEDULER]', e.message)), 20000);
}

module.exports = { getAgendamentos, adicionarAgendamento, cancelarAgendamento, iniciarScheduler };
