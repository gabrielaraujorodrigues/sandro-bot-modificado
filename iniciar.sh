#!/data/data/com.termux/files/usr/bin/bash
# ============================================================
#  Sandro Bot — Script de inicialização com auto-reinício
#  Mantém o bot rodando mesmo após erros ou quedas
# ============================================================

# Impede o Android de matar o processo (requer Termux:API)
if command -v termux-wake-lock &>/dev/null; then
  termux-wake-lock
  echo "🔒 Wake lock ativado — Android não vai matar o processo"
fi

echo "🤖 Iniciando Sandro Bot..."
echo "📁 Pasta: $(pwd)"
echo "⏰ $(date)"
echo ""

TENTATIVAS=0

while true; do
  TENTATIVAS=$((TENTATIVAS + 1))
  echo "▶️  Iniciando bot (tentativa #$TENTATIVAS) — $(date '+%H:%M:%S')"
  
  node index.js
  
  CODIGO=$?
  
  if [ $CODIGO -eq 0 ]; then
    echo "✅ Bot encerrado normalmente. Pressione Enter para reiniciar ou Ctrl+C para sair."
    read -r
  else
    echo ""
    echo "⚠️  Bot encerrou com código $CODIGO"
    echo "🔄 Reiniciando em 5 segundos... (Ctrl+C para cancelar)"
    sleep 5
  fi
  
  echo "─────────────────────────────"
done
