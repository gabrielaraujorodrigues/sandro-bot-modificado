module.exports = {
  name: 'gerarsenha',
  aliases: ['senha', 'password', 'gerarpassword'],
  description: 'Gera uma senha segura aleatória (ex: /gerarsenha 16)',
  async execute(sock, { from, args }) {
    const tamanho = Math.min(Math.max(parseInt(args[0]) || 12, 4), 64);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}';
    let senha = '';
    for (let i = 0; i < tamanho; i++) {
      senha += chars[Math.floor(Math.random() * chars.length)];
    }
    
    const nivel = tamanho >= 16 ? '🟢 Forte' : tamanho >= 10 ? '🟡 Média' : '🔴 Fraca';
    await sock.sendMessage(from, {
      text: `🔐 *Senha gerada:*\n\n\`${senha}\`\n\n📏 Comprimento: ${tamanho} caracteres\n🛡️ Nível: ${nivel}\n\n_Não compartilhe esta senha com ninguém!_`,
    });
  },
};
