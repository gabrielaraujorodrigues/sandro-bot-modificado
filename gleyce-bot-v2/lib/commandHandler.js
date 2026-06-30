const fs = require('fs');
const path = require('path');

const commands = new Map();

function carregarComandos() {
  const baseDir = path.join(__dirname, '..', 'commands');
  const categorias = fs.readdirSync(baseDir).filter((f) =>
    fs.statSync(path.join(baseDir, f)).isDirectory()
  );

  for (const categoria of categorias) {
    const catDir = path.join(baseDir, categoria);
    const arquivos = fs.readdirSync(catDir).filter((f) => f.endsWith('.js'));
    for (const arquivo of arquivos) {
      const mod = require(path.join(catDir, arquivo));
      if (!mod || !mod.name) continue;
      mod.category = categoria;
      const nomes = [mod.name, ...(mod.aliases || [])];
      for (const nome of nomes) {
        commands.set(nome.toLowerCase(), mod);
      }
    }
  }
  console.log(`[COMANDOS] ${commands.size} aliases carregados em ${categorias.length} categorias.`);
  return commands;
}

function getComando(nome) {
  return commands.get(nome.toLowerCase());
}

function listarComandos() {
  const vistos = new Set();
  const lista = [];
  for (const cmd of commands.values()) {
    if (vistos.has(cmd.name)) continue;
    vistos.add(cmd.name);
    lista.push(cmd);
  }
  return lista;
}

module.exports = { carregarComandos, getComando, listarComandos };
