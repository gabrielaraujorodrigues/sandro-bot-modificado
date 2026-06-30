module.exports = {
  name: 'bancos', aliases: ['listbancos'],
  description: 'Lista os principais bancos do Brasil com seus códigos',
  async execute(sock, { from }) {
    await sock.sendMessage(from, {
      text: `🏦 *Principais Bancos do Brasil*\n\n` +
            `001 — Banco do Brasil\n002 — BNB\n003 — BNDES\n033 — Santander\n070 — BRB\n077 — Inter\n` +
            `084 — Uniprime\n085 — Cecred\n097 — Credisis\n099 — Uniprime Norte\n` +
            `104 — Caixa Econômica Federal\n133 — Cresol\n136 — Unicred\n` +
            `184 — Itaú BBA\n208 — BTG Pactual\n212 — Banco Original\n237 — Bradesco\n` +
            `246 — Banco ABC Brasil\n260 — Nubank\n290 — Pagseguro\n301 — PicPay\n` +
            `318 — Banco BMG\n323 — MercadoPago\n336 — C6 Bank\n341 — Itaú Unibanco\n` +
            `380 — PicPay\n383 — Juno\n389 — Banco Mercantil\n422 — Banco Safra\n` +
            `456 — Banco MUFG\n505 — Banco Credit Suisse\n633 — Banco Rendimento\n` +
            `637 — Banco Sofisa\n643 — Banco Pine\n745 — Citibank\n` +
            `748 — Sicredi\n754 — Banco Sistema\n756 — Sicoob`,
    });
  },
};
