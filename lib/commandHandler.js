const fs = require('fs');
const path = require('path');

const commands = new Map();

function carregarComandos() {
  const baseDir = path.join(__dirname, '..', 'commands');
  const categorias = fs.readdirSync(baseDir).filter((f) =>
    fs.statSync(path.join(baseDir, f)).isDirectory()
  );

  for (const cat of categorias) {
    const catDir = path.join(baseDir, cat);
    const arquivos = fs.readdirSync(catDir).filter((f) => f.endsWith('.js'));
    for (const arq of arquivos) {
      try {
        const mod = require(path.join(catDir, arq));
        if (!mod || !mod.name) continue;
        mod.category = cat;
        for (const nome of [mod.name, ...(mod.aliases || [])]) {
          commands.set(nome.toLowerCase(), mod);
        }
      } catch (e) {
        console.error(`[COMANDOS] Erro ao carregar ${cat}/${arq}:`, e.message);
      }
    }
  }
  console.log(`[COMANDOS] ${commands.size} aliases carregados.`);
  return commands;
}

function getComando(nome) { return commands.get(nome.toLowerCase()); }

function listarComandos() {
  const vistos = new Set();
  return [...commands.values()].filter((c) => { if (vistos.has(c.name)) return false; vistos.add(c.name); return true; });
}

module.exports = { carregarComandos, getComando, listarComandos };
