const fetch = require('node-fetch');

// Simi — IA conversacional gratuita (igual ao sandro bot original)
module.exports = {
  name: 'ia',
  aliases: ['simi', 'chat', 'conversa', 'gpt'],
  description: 'Conversa com IA (ex: /ia Qual a capital do Brasil?)',
  async execute(sock, { from, args }) {
    if (!args.length) return sock.sendMessage(from, { text: '❌ Faça uma pergunta. Ex: /ia Qual é a capital do Brasil?' });
    const pergunta = args.join(' ');
    try {
      // API SimSimi (igual ao bot original)
      const res = await fetch('https://api.simsimi.vn/v2/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `text=${encodeURIComponent(pergunta)}&lc=pt&ft=1.0&cf=1`,
        timeout: 10000,
      });
      const data = await res.json();
      if (data?.success) {
        return sock.sendMessage(from, { text: `🤖 ${data.success}` });
      }
      throw new Error('sem resposta simi');
    } catch {
      // Fallback: Open-Meteo ou resposta divertida
      try {
        // Tenta a API do EducaIA (gratuita, sem chave)
        const res2 = await fetch(`https://educaai.com.br/api/v1/chat?message=${encodeURIComponent(pergunta)}`, {
          timeout: 8000,
        });
        const d2 = await res2.json();
        if (d2?.response) return sock.sendMessage(from, { text: `🤖 ${d2.response}` });
      } catch {}
      // Último fallback: resposta genérica
      const respostas = [
        'Interessante pergunta! Não sei ao certo, mas vale a pena pesquisar 🤔',
        'Hmm... Isso é complexo demais pra mim agora! 🧠',
        'Boa pergunta! Infelizmente minha IA está descansando agora 😅',
        'Não tenho certeza, mas acho que você já sabe a resposta! 😄',
      ];
      await sock.sendMessage(from, { text: `🤖 ${respostas[Math.floor(Math.random() * respostas.length)]}` });
    }
  },
};
