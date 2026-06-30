module.exports = {
  name: 'ship',
  aliases: ['casal', 'amor', 'compatibilidade'],
  description: 'Calcula a compatibilidade de um casal (ex: /ship @pessoa1 @pessoa2)',
  async execute(sock, { from, msg, args, isGroup }) {
    const ctx = msg.message?.extendedTextMessage?.contextInfo;
    const mencionados = ctx?.mentionedJid || [];
    
    let p1, p2;
    if (mencionados.length >= 2) {
      p1 = mencionados[0].split('@')[0];
      p2 = mencionados[1].split('@')[0];
    } else if (args.length >= 2) {
      p1 = args[0].replace('@', '');
      p2 = args[1].replace('@', '');
    } else {
      return sock.sendMessage(from, { text: '❌ Mencione duas pessoas. Ex: /ship @pessoa1 @pessoa2' });
    }

    // Hash determinístico para manter consistência
    const hash = [...(p1 + p2)].reduce((a, c) => a + c.charCodeAt(0), 0);
    const porcentagem = (hash % 101);
    
    let emoji, msg_txt;
    if (porcentagem >= 80) { emoji = '💑'; msg_txt = 'Casal perfeito! Amor verdadeiro! 💯'; }
    else if (porcentagem >= 60) { emoji = '💕'; msg_txt = 'Muita compatibilidade! Tem futuro! 😍'; }
    else if (porcentagem >= 40) { emoji = '🤔'; msg_txt = 'Compatibilidade mediana... pode rolar! 😅'; }
    else if (porcentagem >= 20) { emoji = '😬'; msg_txt = 'Pouca compatibilidade... mas o amor é cego! 😂'; }
    else { emoji = '💀'; msg_txt = 'Nada a ver... parece água e óleo! 😭'; }

    const barra = '█'.repeat(Math.round(porcentagem / 10)) + '░'.repeat(10 - Math.round(porcentagem / 10));

    await sock.sendMessage(from, {
      text: `${emoji} *Compatibilidade do casal* ${emoji}\n\n💕 @${p1} + @${p2}\n\n[${barra}] ${porcentagem}%\n\n${msg_txt}`,
      mentions: mencionados,
    });
  },
};
