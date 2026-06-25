#!/bin/bash
# ================================================
# 🩷 Gleyce Bot Oficial — Instalador para Termux
# ================================================

echo ""
echo "🩷 Gleyce Bot Oficial — Instalação no Termux"
echo "============================================="
echo ""

echo "📦 Atualizando pacotes..."
pkg update -y && pkg upgrade -y

echo ""
echo "📦 Instalando dependências do sistema..."
pkg install git nodejs python make clang libvips -y

if [ ! -f "connect.js" ]; then
  echo ""
  echo "📥 Baixando o bot..."
  git clone https://github.com/gabrielaraujorodrigues/sandro-bot-modificado
  cd sandro-bot-modificado
fi

echo ""
echo "📦 Instalando dependências do bot..."
npm install --ignore-scripts

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Instalação concluída!"
  echo ""
  echo "▶️  Para iniciar:"
  echo "    npm start"
  echo ""
  echo "💡 Para manter rodando com tela fechada:"
  echo "    pkg install screen -y"
  echo "    screen -S gleyce"
  echo "    npm start"
  echo "    (Ctrl+A depois D para sair sem fechar)"
else
  echo "❌ Erro. Tente: npm install --ignore-scripts"
fi
