const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync, spawn } = require('child_process');

// =============================================
// 🤖 Gleyce Bot — Inicializador Inteligente
// =============================================

const QR_FOLDER = path.join(__dirname, 'qr');
const CREDS_FILE = path.join(QR_FOLDER, 'creds.json');

function limparPastaQr() {
  try {
    fs.rmSync(QR_FOLDER, { recursive: true, force: true });
    console.log('\n✅ Pasta "qr" removida com sucesso!\n');
  } catch (e) {
    console.log('\n⚠️  Não foi possível remover a pasta qr:', e.message);
  }
}

function iniciarBot() {
  console.log('\n▶️  Iniciando o bot...\n');
  const bot = spawn('node', ['connect.js'], { stdio: 'inherit' });
  bot.on('close', (code) => {
    if (code !== 0) {
      console.log(`\n❌ Bot encerrado com código ${code}`);
    }
  });
}

function mostrarMenu() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('\n╔══════════════════════════════════════╗');
  console.log('║     🤖  GLEYCE BOT OFICIAL  🤖       ║');
  console.log('╚══════════════════════════════════════╝\n');
  console.log('⚠️  Uma sessão anterior foi encontrada.\n');
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
      limparPastaQr();
      iniciarBot();
    } else if (escolha === '3') {
      console.log('\n👋 Até logo!\n');
      process.exit(0);
    } else {
      console.log('\n❓ Opção inválida. Por favor, digite 1, 2 ou 3.\n');
      mostrarMenu();
    }
  });
}

// ——— Verificação principal ———
if (fs.existsSync(CREDS_FILE)) {
  // Sessão anterior existe → mostrar menu
  mostrarMenu();
} else {
  // Sem sessão prévia → iniciar direto (mostrará QR/pairing)
  console.log('\n╔══════════════════════════════════════╗');
  console.log('║     🤖  GLEYCE BOT OFICIAL  🤖       ║');
  console.log('╚══════════════════════════════════════╝\n');
  console.log('🆕 Nenhuma sessão encontrada. Iniciando nova conexão...\n');
  iniciarBot();
}
