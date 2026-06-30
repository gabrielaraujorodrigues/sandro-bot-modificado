const fetch = require('node-fetch');
module.exports = {
  name: 'pokemon', aliases: ['poke'],
  description: 'Info de um Pokémon (ex: /pokemon pikachu)',
  async execute(sock, { from, args }) {
    const nome = (args[0] || 'pikachu').toLowerCase();
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nome}`);
      if (!res.ok) throw new Error('Pokémon não encontrado');
      const d = await res.json();
      const tipos = d.types.map(t => t.type.name).join(', ');
      const habilidades = d.abilities.map(a => a.ability.name).join(', ');
      const imgUrl = d.sprites.other['official-artwork'].front_default || d.sprites.front_default;
      
      const txt = `⚡ *${d.name.toUpperCase()}* #${d.id}\n\n🏷️ Tipos: ${tipos}\n💪 HP: ${d.stats[0].base_stat} | ATK: ${d.stats[1].base_stat} | DEF: ${d.stats[2].base_stat}\n⚡ Sp.ATK: ${d.stats[3].base_stat} | Sp.DEF: ${d.stats[4].base_stat} | VEL: ${d.stats[5].base_stat}\n🎯 Habilidades: ${habilidades}\n📏 Altura: ${d.height / 10}m | Peso: ${d.weight / 10}kg`;
      
      if (imgUrl) {
        const imgRes = await fetch(imgUrl);
        const buffer = Buffer.from(await imgRes.arrayBuffer());
        await sock.sendMessage(from, { image: buffer, caption: txt });
      } else {
        await sock.sendMessage(from, { text: txt });
      }
    } catch {
      await sock.sendMessage(from, { text: `❌ Pokémon "${nome}" não encontrado. Ex: /pokemon pikachu` });
    }
  },
};
