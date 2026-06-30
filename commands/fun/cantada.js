const cantadas = [
  'Se beleza fosse crime, você estaria presa há anos 😍',
  'Posso te seguir? Porque minha mãe me disse para seguir meus sonhos 🥰',
  'Você deve ser um banco, porque tem meu interesse 💕',
  'Você tem WiFi? Porque sinto uma conexão entre a gente 📶',
  'Você é uma câmera? Porque toda vez que te vejo sorrio 📸',
  'Se você fosse palavras, seria página por página do dicionário, porque você define perfeição 💖',
  'Você é geógrafa? Porque acabou de mapear meu coração 🗺️',
  'É perigoso aqui? Porque acabei de me apaixonar 💘',
  'Você estuda física? Porque a nossa química é inegável ⚗️',
  'Você caiu do céu? Porque é uma resposta às minhas orações 🙏',
  'Você é Netflix? Porque passo horas pensando em você 🎬',
  'Pode me dar uma direção? Me perdi nos seus olhos 👀',
  'Você é açúcar? Porque adoçou meu dia 🍬',
  'Você acredita em amor à primeira vista, ou preciso passar de novo? 😏',
];

module.exports = {
  name: 'cantada', aliases: ['paquerar', 'flerte'],
  description: 'Envia uma cantada aleatória 😍',
  async execute(sock, { from }) {
    const c = cantadas[Math.floor(Math.random() * cantadas.length)];
    await sock.sendMessage(from, { text: `💕 *Cantada do dia:*\n\n${c}` });
  },
};
