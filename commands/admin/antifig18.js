// antifig18 — detecta imagens 18+ usando nsfwjs (opcional)
// Se @tensorflow/tfjs-node não estiver disponível (ex: Android/Termux), o comando fica desativado automaticamente

let nsfwjs = null;
let tf = null;
let modelLoaded = false;
let modelLoading = false;

async function carregarModelo() {
  if (modelLoaded || modelLoading) return;
  try {
    tf = require('@tensorflow/tfjs-node');
    nsfwjs = require('nsfwjs');
    modelLoading = true;
    nsfwjs = await nsfwjs.load();
    modelLoaded = true;
    modelLoading = false;
    console.log('[antifig18] Modelo nsfwjs carregado ✅');
  } catch (e) {
    modelLoaded = false;
    modelLoading = false;
    console.log('[antifig18] nsfwjs não disponível nesta plataforma (normal no Android).');
  }
}

// Tenta carregar ao iniciar (sem bloquear)
carregarModelo().catch(() => {});

const groupConfig = {};

module.exports = {
  name: 'antifig18',
  aliases: ['antinsfw', 'antiadulto'],
  description: 'Ativa/desativa detecção de imagens 18+ com IA (requer Linux/Windows)',
  adminOnly: true,
  async execute(sock, { from, args, msg }) {
    if (!tf || !modelLoaded) {
      return sock.sendMessage(from, {
        text: '⚠️ *Anti-fig18 indisponível nesta plataforma.*\n\nO módulo de IA (@tensorflow/tfjs-node) não suporta Android/Termux.\n\nTodos os outros comandos do bot funcionam normalmente! 🩷',
      }, { quoted: msg });
    }

    const status = args[0]?.toLowerCase();
    if (!['on', 'off'].includes(status)) {
      const atual = groupConfig[from] ? '✅ ativado' : '❌ desativado';
      return sock.sendMessage(from, {
        text: `🔞 *Anti-fig18* — atualmente ${atual}\nUso: /antifig18 on | off`,
      }, { quoted: msg });
    }

    groupConfig[from] = status === 'on';
    await sock.sendMessage(from, {
      text: `🔞 Anti-fig18 *${status === 'on' ? 'ATIVADO' : 'DESATIVADO'}* com sucesso!\n${status === 'on' ? '🛡️ Imagens adultas serão removidas automaticamente.' : ''}`,
    }, { quoted: msg });
  },

  // Chamada pelo commandHandler para cada imagem/vídeo recebido
  async verificarMidia(sock, from, buffer) {
    if (!modelLoaded || !groupConfig[from]) return false;
    try {
      const tfImage = tf.node.decodeImage(buffer, 3);
      const predictions = await nsfwjs.classify(tfImage);
      tfImage.dispose();
      const adulto = predictions.find(p => ['Porn', 'Hentai', 'Sexy'].includes(p.className) && p.probability > 0.6);
      return !!adulto;
    } catch {
      return false;
    }
  },

  isEnabled(from) {
    return modelLoaded && groupConfig[from];
  },
};
