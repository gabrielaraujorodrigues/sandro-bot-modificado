module.exports = {
  name: 'morte', aliases: ['death', 'quando'],
  description: 'Previsão de morte (brincadeira 💀)',
  async execute(sock, { from, args, sender }) {
    const nome = args.join(' ') || sender.split('@')[0];
    const anoMorte = new Date().getFullYear() + Math.floor(Math.random() * 60) + 15;
    const causas = [
      'de tanto comer pizza 🍕','de rir demais 😂','de trabalhar tanto 💼',
      'de amor não correspondido 💔','jogando videogame 🎮','ouvindo funk 🎵',
      'assistindo a mais uma série na Netflix 📺','esperando o ônibus 🚌',
      'de curiosidade ao usar este bot 🤖','de tanto maratonar séries 🍿',
      'scrollando o TikTok 📱','comendo arroz com feijão 🍛',
    ];
    const causa = causas[Math.floor(Math.random() * causas.length)];
    await sock.sendMessage(from, {
      text: `💀 *Previsão de Morte* 💀\n\n👤 Nome: ${nome}\n📅 Ano da morte: ${anoMorte}\n🎂 Viverá até ~${anoMorte - 2004} anos\n⚰️ Causa: ${causa}\n\n_É só brincadeira! Cuide-se! 😂_`,
    });
  },
};
