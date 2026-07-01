const {
  default: makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const readline = require('readline');

const SESSION_DIR = path.join(__dirname, '..', 'session');
const logger = pino({ level: 'silent' });

function ask(pergunta) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(pergunta, (resp) => { rl.close(); resolve(resp.trim()); }));
}

async function startConnection(onMessage) {
  const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
    browser: ['Sandro Bot', 'Chrome', '120.0.0'],
    connectTimeoutMs: 60_000,
    defaultQueryTimeoutMs: 60_000,
    keepAliveIntervalMs: 10_000,
    retryRequestDelayMs: 2_000,
    maxMsgRetryCount: 3,
    syncFullHistory: false,
    markOnlineOnConnect: false,
    getMessage: async () => undefined,
  });

  // Gerar código de pareamento na primeira conexão
  if (!sock.authState.creds.registered) {
    setTimeout(async () => {
      try {
        console.log('\n╔══════════════════════════════════════╗');
        console.log('║  📲 CONECTAR VIA CÓDIGO DE 8 DÍGITOS ║');
        console.log('╚══════════════════════════════════════╝');
        console.log('👉 WhatsApp → ⋮ → Dispositivos vinculados → Vincular dispositivo');
        console.log('   → "Vincular com número de telefone"\n');

        const numero = await ask('📱 Digite seu número com DDI+DDD (ex: 5586999999999): ');
        const limpo = numero.replace(/\D/g, '');

        if (!limpo || limpo.length < 10) {
          console.log('❌ Número inválido. Reinicie e tente novamente.');
          process.exit(1);
        }

        const codigo = await sock.requestPairingCode(limpo);
        console.log('\n╔══════════════════════════╗');
        console.log(`║  🔑 Código: ${codigo.padEnd(14)}║`);
        console.log('╚══════════════════════════╝');
        console.log('⏳ Aguardando você inserir o código no WhatsApp...\n');
      } catch (e) {
        console.error('❌ Erro ao gerar código:', e.message);
        console.log('💡 Dica: delete a pasta "session/" e reinicie.');
      }
    }, 2000);
  }

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode;
      const motivo = lastDisconnect?.error?.message || 'desconhecido';
      console.log(`\n🔌 Conexão encerrada — código: ${code} | ${motivo}`);

      if (code === DisconnectReason.loggedOut) {
        console.log('⚠️  WhatsApp deslogou a sessão!');
        console.log('💡 Delete a pasta "session/" e reinicie o bot.');
        process.exit(1);
      } else {
        console.log('🔄 Reconectando em 5s...');
        setTimeout(() => startConnection(onMessage), 5_000);
      }

    } else if (connection === 'connecting') {
      console.log('⏳ Conectando ao WhatsApp...');
    } else if (connection === 'open') {
      const num = sock.user?.id?.split(':')[0] || '?';
      console.log(`\n✅ Sandro Bot conectado! Número: ${num}`);
      console.log('💾 Sessão salva em ./session/\n');
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    for (const msg of messages) {
      try {
        await onMessage(sock, msg);
      } catch (e) {
        if (!e.message?.includes('Bad MAC') && !e.message?.includes('decrypt')) {
          console.error('[ERRO cmd]', e.message);
        }
      }
    }
  });

  return sock;
}

module.exports = { startConnection };
