const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { spawn } = require('child_process');

// =============================================
// 🤖 Gleyce Bot — Inicializador Inteligente
// =============================================

// Todas as possíveis pastas de sessão que o bot pode usar
const PASTAS_SESSAO = [
  path.join(__dirname, 'qr-code'),
  path.join(__dirname, 'qr'),
  path.join(__dirname, 'auth_info_baileys'),
  path.join(__dirname, 'session'),
];

function encontrarPastaSessao() {
  for (const pasta of PASTAS_SESSAO) {
    if (!fs.existsSync(pasta)) continue;
    // Verifica se tem creds.json ou qualquer arquivo dentro
    const creds = path.join(pasta, 'creds.json');
    if (fs.existsSync(creds)) return pasta;
    try {
      if (fs.readdirSync(pasta).length > 0) return pasta;
    } catch {}
  }
  return null;
}

function limparSessao(pastaPath) {
  try {
    fs.rmSync(pastaPath, { recursive: true, force: true });
    console.log(`\n✅ Sessão removida: ${path.basename(pastaPath)}\n`);
  } catch (e) {
    console.log(`\n⚠️  Não foi possível remover ${pastaPath}: ${e.message}`);
  }
}

function iniciarBot() {
  console.log('\n▶️  Iniciando o bot...\n');
  const bot = spawn('node', ['connect.js'], { stdio: 'inherit' });
  bot.on('close', (code) => {
    if (code && code !== 0) {
      console.log(`\n❌ Bot encerrado com código ${code}`);
    }
  });
}

function mostrarMenu(pastaSessao) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('\n╔══════════════════════════════════════╗');
  console.log('║     🤖  GLEYCE BOT OFICIAL  🤖       ║');
  console.log('╚══════════════════════════════════════╝\n');
  console.log(`⚠️  Sessão anterior encontrada em: ${path.basename(pastaSessao)}\n`);
  console.log('Escolha uma opção:');
  console.log('  1 - Usar sessão salva (reconectar)');
  console.log('  2 - Nova conexão (escanear QR ou código de pareamento)');
  console.log('  3 - Sair\n');

  rl.question('👉 Digite sua opção (1, 2 ou 3): ', (opcao) => {
    rl.close();
    const escolha = opcao.trim();

    if (escolha === '1') {
      console.log('\n✅ Usando sessão existente...');
      iniciarBot();
    } else if (escolha === '2') {
      console.log('\n🗑️  Removendo sessão antiga...');
      limparSessao(pastaSessao);
      iniciarBot();
    } else if (escolha === '3') {
      console.log('\n👋 Até logo!\n');
      process.exit(0);
    } else {
      console.log('\n❓ Opção inválida. Por favor, digite 1, 2 ou 3.\n');
      mostrarMenu(pastaSessao);
    }
  });
}

// ——— Verificação principal ———
const pastaSessao = encontrarPastaSessao();

if (pastaSessao) {
  mostrarMenu(pastaSessao);
} else {
  console.log('\n╔══════════════════════════════════════╗');
  console.log('║     🤖  GLEYCE BOT OFICIAL  🤖       ║');
  console.log('╚══════════════════════════════════════╝\n');
  console.log('🆕 Nenhuma sessão encontrada. Iniciando nova conexão...\n');
  iniciarBot();
}
