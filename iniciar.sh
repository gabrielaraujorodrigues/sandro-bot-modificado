#!/data/data/com.termux/files/usr/bin/bash
echo ""
echo "🤖 ====== SANDRO BOT ====== 🤖"
echo "⏰ $(date)"
echo ""

# Wake lock
if command -v termux-wake-lock &>/dev/null; then
  termux-wake-lock
  echo "🔒 Wake lock ativado"
fi

# Auto-instalar yt-dlp se não existir
if ! command -v yt-dlp &>/dev/null; then
  echo "📥 Instalando yt-dlp (necessário para /play)..."
  pip install -q yt-dlp
  if command -v yt-dlp &>/dev/null; then
    echo "✅ yt-dlp instalado!"
  else
    echo "⚠️  yt-dlp não pôde ser instalado. /play pode não funcionar."
    echo "   Tente manualmente: pip install yt-dlp"
  fi
else
  YTDLP_VER=$(yt-dlp --version 2>/dev/null)
  echo "✅ yt-dlp $YTDLP_VER encontrado"
fi

# Verificar sessão
if [ -d "session" ] && [ "$(ls -A session 2>/dev/null)" ]; then
  echo "💾 Sessão encontrada — reconectando automaticamente"
else
  echo "📲 Primeira vez — você receberá um código de 8 dígitos para inserir no WhatsApp"
fi
echo ""

TENTATIVAS=0
while true; do
  TENTATIVAS=$((TENTATIVAS + 1))
  echo "▶️  Iniciando (tentativa #$TENTATIVAS) — $(date '+%H:%M:%S')"
  echo ""

  node index.js
  CODIGO=$?

  echo ""
  if [ $CODIGO -eq 1 ]; then
    echo "⚠️  Sessão deslogada. Apagando e reiniciando..."
    rm -rf session
    sleep 3
  else
    echo "🔄 Bot encerrou. Reiniciando em 5s... (Ctrl+C para parar)"
    sleep 5
  fi
  echo "─────────────────────────────"
done
