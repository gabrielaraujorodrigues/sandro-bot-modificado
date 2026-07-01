#!/data/data/com.termux/files/usr/bin/bash
# ============================================================
#  Sandro Bot — Script de inicialização
#  Mantém o bot vivo com auto-reinício + wake-lock Android
# ============================================================

echo ""
echo "🤖 ====== SANDRO BOT ====== 🤖"
echo "📁 Pasta: $(pwd)"
echo "⏰ $(date)"
echo ""

# ── WAKE LOCK: impede o Android de matar o processo ──
if command -v termux-wake-lock &>/dev/null; then
  termux-wake-lock
  echo "🔒 Wake lock ativado (Termux:API) — o bot não será morto pelo Android"
else
  echo "⚠️  termux-wake-lock não encontrado."
  echo "   Para o bot não morrer em background, instale:"
  echo "   pkg install termux-api"
  echo ""
fi

# ── DICA DE SESSÃO ──
if [ -d "session" ] && [ "$(ls -A session 2>/dev/null)" ]; then
  echo "💾 Sessão encontrada — o bot vai reconectar SEM pedir QR code!"
else
  echo "📱 Primeira vez? Escaneie o QR code que vai aparecer."
fi
echo ""

TENTATIVAS=0
while true; do
  TENTATIVAS=$((TENTATIVAS + 1))
  echo "▶️  Iniciando (tentativa #$TENTATIVAS) — $(date '+%H:%M:%S')"
  echo "   Pressione Ctrl+C para parar."
  echo ""

  node index.js
  CODIGO=$?

  echo ""
  if [ $CODIGO -eq 1 ]; then
    # Saída com código 1 = sessão deslogada pelo WhatsApp
    echo "⚠️  Sessão encerrada pelo WhatsApp."
    echo "🗑️  Apagando sessão antiga..."
    rm -rf session
    echo "🔄 Reiniciando em 3s para gerar novo QR code..."
    sleep 3
  else
    echo "🔄 Bot encerrou (código $CODIGO). Reiniciando em 5s..."
    echo "   (Ctrl+C para cancelar)"
    sleep 5
  fi
  echo "─────────────────────────────────"
done
