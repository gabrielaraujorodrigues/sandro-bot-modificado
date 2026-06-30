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
    browser: ['Gleyce Bot', 'Chrome', '1.0.0'],
  });

  if (usePairingCode && !sock.authState.creds.registered) {
    const numero = await ask('📱 Digite o número do WhatsApp com DDI (ex: 5586940296860): ');
    setTimeout(async () => {
      try {
        const codigo = await sock.requestPairingCode(numero.replace(/[^0-9]/g, ''));
        console.log(`\n🔑 Código de pareamento: ${codigo}\n`);
      } catch (e) {
        console.error('Erro ao gerar código de pareamento:', e.message);
      }
    }, 3000);
  }

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr && usePairingCode === false) {
      // printQRInTerminal já mostra, mas garantimos fallback
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const deveReconectar = statusCode !== DisconnectReason.loggedOut;
      console.log(`[CONEXÃO] Fechada. Código: ${statusCode}. Reconectar: ${deveReconectar}`);
      if (deveReconectar) {
        setTimeout(() => startConnection(onMessage), 3000);
      } else {
        console.log('[CONEXÃO] Sessão deslogada. Apague a pasta "session" e escaneie o QR novamente.');
      }
    } else if (connection === 'open') {
      console.log('✅ [GLEYCE BOT] Conectado com sucesso ao WhatsApp!');
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    for (const msg of messages) {
      try {
        await onMessage(sock, msg);
      } catch (e) {
        console.error('[ERRO ao processar mensagem]', e);
      }
    }
  });

  return sock;
}

module.exports = { startConnection };
