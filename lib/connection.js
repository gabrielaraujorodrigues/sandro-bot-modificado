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
const qrcode = require('qrcode-terminal');

const SESSION_DIR = path.join(__dirname, '..', 'session');
const logger = pino({ level: 'silent' });

function ask(pergunta) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(pergunta, (resp) => { rl.close(); resolve(resp.trim()); }));
}

async function startConnection(onMessage) {
  const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);
  const { version } = await fetchLatestBaileysVersion();
  const usePairingCode = process.env.USE_PAIRING_CODE === 'true';

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

  if (usePairingCode && !sock.authState.creds.registered) {
    setTimeout(async () => {
      try {
        const numero = await ask('\n📱 Digite o número com DDI (ex: 5511999999999): ');
        const codigo = await sock.requestPairingCode(numero.replace(/\D/g, ''));
        console.log(`\n🔑 Código de pareamento: *${codigo}*`);
        console.log('👉 WhatsApp → Dispositivos vinculados → Vincular → Vincular com número\n');
      } catch (e) {
        console.error('Erro ao gerar código:', e.message);
      }
    }, 3000);
  }

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr && !usePairingCode) {
      console.clear();
      console.log('╔════════════════════════════════╗');
      console.log('║  📱 Escaneie o QR no WhatsApp  ║');
      console.log('║  Dispositivos vinculados → +    ║');
      console.log('╚════════════════════════════════╝\n');
      qrcode.generate(qr, { small: true });
    }

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
      console.log('ℹ️  Erros "Bad MAC" são normais na 1ª reconexão e param sozinhos.\n');
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
