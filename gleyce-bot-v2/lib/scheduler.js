const { readJSON, writeJSON } = require('./database');
const moment = require('moment-timezone');

const FALLBACK = [];

function _now(fmt) {
  return moment.tz('America/Sao_Paulo').format(fmt);
}

function _minutos(horaStr) {
  const [h, m] = horaStr.split(':').map(Number);
  return h * 60 + m;
}

function _converterMin(totalMin) {
  const m = totalMin % 60;
  const h = (totalMin - m) / 60;
  return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`;
}

function getAgendamentos(groupId) {
  const all = readJSON('agendamentos', FALLBACK);
  let entry = all.find((g) => g.groupId === groupId);
  if (!entry) {
    entry = { groupId, horarios: [] };
    all.push(entry);
    writeJSON('agendamentos', all);
  }
  return entry.horarios;
}

function _save(groupId, horarios) {
  const all = readJSON('agendamentos', FALLBACK);
  const idx = all.findIndex((g) => g.groupId === groupId);
  if (idx >= 0) all[idx].horarios = horarios;
  else all.push({ groupId, horarios });
  writeJSON('agendamentos', all);
}

/**
 * Aceita formatos: "22:00" (horário exato) ou "2h" / "30m" / "1d" (relativo)
 */
function adicionarAgendamento(groupId, horarioInput, adminId, tipo) {
  const horarios = getAgendamentos(groupId);
  let minutosAlvo;

  if (horarioInput.includes(':')) {
    const alvo = _minutos(horarioInput);
    const atual = _minutos(_now('HH:mm'));
    minutosAlvo = alvo > atual ? alvo - atual : (1440 - atual) + alvo;
  } else {
    const letra = horarioInput.slice(-1).toLowerCase();
    const valor = parseFloat(horarioInput.slice(0, -1)) || 1;
    const multiplicador = letra === 'd' ? 1440 : letra === 'h' ? 60 : 1;
    minutosAlvo = valor * multiplicador;
  }

  const executarEm = Date.now() + minutosAlvo * 60 * 1000;
  const horarios2 = horarios;
  const novo = {
    id: _now('DDMMYYHHmmss'),
    tipo,
    executarEm,
    horarioTexto: horarioInput,
    adminId,
  };
  horarios2.push(novo);
  _save(groupId, horarios2);
  return novo;
}

function cancelarAgendamento(groupId, id) {
  const horarios = getAgendamentos(groupId);
  const idx = horarios.findIndex((h) => h.id === id);
  if (idx < 0) return false;
  horarios.splice(idx, 1);
  _save(groupId, horarios);
  return true;
}

async function processarAgendamentos(sock) {
  const all = readJSON('agendamentos', FALLBACK);
  const agora = Date.now();

  for (const grupo of all) {
    if (!grupo.horarios || grupo.horarios.length === 0) continue;
    const pendentes = [...grupo.horarios];

    for (const item of pendentes) {
      if (item.executarEm > agora) continue;

      try {
        let nomeGrupo = 'grupo';
        try {
          const meta = await sock.groupMetadata(grupo.groupId);
          nomeGrupo = meta.subject;
        } catch (e) {}

        if (item.tipo === 'close') {
          await sock.groupSettingUpdate(grupo.groupId, 'announcement');
          await sock.sendMessage(grupo.groupId, {
            text: `🔒 *${nomeGrupo}* foi FECHADO automaticamente pelo agendamento!\n\nAgendado por @${item.adminId.split('@')[0]}`,
            mentions: [item.adminId],
          });
        } else {
          await sock.groupSettingUpdate(grupo.groupId, 'not_announcement');
          await sock.sendMessage(grupo.groupId, {
            text: `🩷 *${nomeGrupo}* foi ABERTO automaticamente pelo agendamento!\n\nAgendado por @${item.adminId.split('@')[0]}`,
            mentions: [item.adminId],
          });
        }
      } catch (e) {
        console.error('[SCHEDULER] Erro ao executar agendamento:', e.message);
      }

      cancelarAgendamento(grupo.groupId, item.id);
    }
  }
}

function iniciarScheduler(sock) {
  console.log('[SCHEDULER] Agendador de abrir/fechar grupo iniciado ✅');
  setInterval(() => {
    processarAgendamentos(sock).catch((e) => console.error('[SCHEDULER] Erro:', e.message));
  }, 20000);
}

module.exports = {
  getAgendamentos,
  adicionarAgendamento,
  cancelarAgendamento,
  iniciarScheduler,
};
