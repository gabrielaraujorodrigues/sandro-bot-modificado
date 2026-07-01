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
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
    },
    browser: ['Sandro Bot', 'Chrome', '1.0.0'],
    connectTimeoutMs: 60_000,
    defaultQueryTimeoutMs: 60_000,
    keepAliveIntervalMs: 10_000,   // ping a cada 10s para manter conexão
    retryRequestDelayMs: 2_000,
    maxMsgRetryCount: 5,
    getMessage: async () => ({ conversation: '' }),
  });

  if (usePairingCode && !sock.authState.creds.registered) {
    setTimeout(async () => {
      try {
        const numero = await ask('📱 Digite o número com DDI (ex: 5511999999999): ');
        const codigo = await sock.requestPairingCode(numero.replace(/\D/g, ''));
        console.log(`\n🔑 Código de pareamento: *${codigo}*`);
        console.log('👆 WhatsApp → Dispositivos vinculados → Vincular → Vincular com número\n');
      } catch (e) {
        console.error('Erro ao gerar código:', e.message);
      }
    }, 2000);
  }

  // Salvar sessão sempre que houver atualização de credenciais
  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr && !usePairingCode) {
      console.clear();
      console.log('📱 Escaneie o QR code no WhatsApp (Dispositivos vinculados):');
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode;
      const motivo = lastDisconnect?.error?.message || 'desconhecido';

      console.log(`\n🔌 Conexão encerrada — código: ${code} | motivo: ${motivo}`);

      if (code === DisconnectReason.loggedOut) {
        console.log('⚠️  Sessão deslogada pelo WhatsApp!');
        console.log('🗑️  Delete a pasta "session/" e reinicie: rm -rf session && node index.js');
        process.exit(1);  // sai para o script iniciar.sh reiniciar
      } else if (code === DisconnectReason.restartRequired) {
        console.log('🔄 Reinício necessário, reconectando...');
        setTimeout(() => startConnection(onMessage), 3_000);
      } else {
        const delay = code === 408 ? 10_000 : 5_000;
        console.log(`🔄 Reconectando em ${delay / 1000}s...`);
        setTimeout(() => startConnection(onMessage), delay);
      }
    } else if (connection === 'connecting') {
      console.log('⏳ Conectando ao WhatsApp...');
    } else if (connection === 'open') {
      const num = sock.user?.id?.split(':')[0] || 'desconhecido';
      console.log(`✅ Sandro Bot conectado! Número: ${num}`);
      console.log('💾 Sessão salva em ./session/ (não apague essa pasta!)');
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    for (const msg of messages) {
      try { await onMessage(sock, msg); } catch (e) { console.error('[ERRO cmd]', e.message); }
    }
  });

  return sock;
}

module.exports = { startConnection };
