const {
  default: makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const readline = require('readline');
const qrcode = require('qrcode-terminal');

const SESSION_DIR = path.join(__dirname, '..', 'session');

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
    logger: pino({ level: 'silent' }),
    printQRInTerminal: !usePairingCode,
    auth: state,
    browser: ['Sandro Bot', 'Chrome', '1.0.0'],
    connectTimeoutMs: 60000,
    defaultQueryTimeoutMs: 60000,
    keepAliveIntervalMs: 25000,
  });

  if (usePairingCode && !sock.authState.creds.registered) {
    setTimeout(async () => {
      try {
        const numero = await ask('📱 Digite o número do WhatsApp com DDI (ex: 5511999999999): ');
        const codigo = await sock.requestPairingCode(numero.replace(/\D/g, ''));
        console.log(`\n🔑 Código de pareamento: ${codigo}\n`);
        console.log('👆 Vá em WhatsApp > Dispositivos vinculados > Vincular dispositivo > Vincular com número de telefone');
      } catch (e) {
        console.error('Erro ao gerar código:', e.message);
      }
    }, 2000);
  }

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr && !usePairingCode) {
      qrcode.generate(qr, { small: true });
      console.log('📱 Escaneie o QR code acima no WhatsApp!');
    }

    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode;
      const reconectar = code !== DisconnectReason.loggedOut;
      console.log(`[CONEXÃO] Encerrada (código ${code}). Reconectar: ${reconectar}`);
      if (reconectar) {
        setTimeout(() => startConnection(onMessage), 5000);
      } else {
        console.log('[CONEXÃO] Sessão deslogada. Apague a pasta "session/" e reinicie.');
      }
    } else if (connection === 'open') {
      console.log('✅ Sandro Bot conectado ao WhatsApp!');
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    for (const msg of messages) {
      try { await onMessage(sock, msg); } catch (e) { console.error('[ERRO]', e.message); }
    }
  });

  return sock;
}

module.exports = { startConnection };
