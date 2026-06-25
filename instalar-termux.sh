#!/bin/bash
# ================================================
# 🩷 Gleyce Bot Oficial — Instalador para Termux
# ================================================

echo ""
echo "🩷 Gleyce Bot Oficial — Instalação no Termux"
echo "============================================="
echo ""

# 1. Atualizar pacotes
echo "📦 Atualizando pacotes..."
pkg update -y && pkg upgrade -y

# 2. Instalar dependências do sistema (necessário para o sharp/libvips)
echo ""
echo "📦 Instalando dependências do sistema..."
pkg install git nodejs python make clang libvips -y

# 3. Clonar o repositório (se ainda não estiver na pasta)
if [ ! -f "connect.js" ]; then
  echo ""
  echo "📥 Baixando o bot..."
  git clone https://github.com/gabrielaraujorodrigues/sandro-bot-modificado
  cd sandro-bot-modificado
fi

# 4. Instalar dependências do Node.js
echo ""
echo "📦 Instalando dependências do bot (pode demorar alguns minutos)..."
npm install

# 5. Verificar instalação
if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Instalação concluída com sucesso!"
  echo ""
  echo "▶️  Para iniciar o bot, execute:"
  echo "    npm start"
  echo ""
  echo "💡 Dica: Para manter rodando com a tela fechada:"
  echo "    pkg install screen -y"
  echo "    screen -S gleyce"
  echo "    npm start"
  echo "    (Ctrl+A depois D para sair sem fechar)"
else
  echo ""
  echo "❌ Houve um erro na instalação."
  echo "Tente rodar manualmente:"
  echo "    pkg install libvips python make clang -y"
  echo "    npm install"
fi
