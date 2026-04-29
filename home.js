/* ============================================================================
 * MATEMÁGICA — HOME (v9) — comportamento mínimo
 *
 * Responsabilidades:
 *   1. Toggle do dropdown de adultos (com fechamento ao clicar fora e ESC)
 *   2. Plug do contador de moedas (Descobertas) lendo do localStorage
 *   3. Hook de navegação ao clicar nos medalhões dos anos
 *
 * NÃO HÁ:
 *   - Sistema de mascotes selecionáveis (decisão Henrique 29/04: só Mati)
 *   - Lógica de "último jogo jogado" (Caroline 2.5.1, dependência futura)
 *   - Lógica de progresso por ano (5 reinos paralelos com peso igual)
 *
 * Phosphor Icons hidrata sozinho via CDN — não precisa init aqui.
 * ============================================================================ */

(function () {
  'use strict';

  /* ==========================================================================
   * 1. DROPDOWN DE ADULTOS
   * ======================================================================== */
  const adultsMenu = document.getElementById('adultsMenu');
  const adultsTrigger = document.getElementById('adultsTrigger');

  if (adultsMenu && adultsTrigger) {
    adultsTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      adultsMenu.classList.toggle('open');
    });

    // Fecha ao clicar fora
    document.addEventListener('click', (e) => {
      if (!adultsMenu.contains(e.target)) {
        adultsMenu.classList.remove('open');
      }
    });

    // Fecha com ESC (acessibilidade)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        adultsMenu.classList.remove('open');
      }
    });
  }

  /* ==========================================================================
   * 2. CONTADOR DE MOEDAS / DESCOBERTAS
   *
   * Fonte canônica: STATE.moedas (definido em jogos_shared.js, persistido no
   * JSON `matemagica_user_v1`). Esta home só LÊ — escrita continua em
   * jogos_shared.js (princípio de responsabilidade única).
   * ======================================================================== */
  const COIN_STORAGE_KEY = 'matemagica_user_v1';

  function readCoinCount() {
    if (typeof STATE !== 'undefined' && Number.isFinite(STATE.moedas)) {
      return STATE.moedas;
    }
    try {
      const raw = localStorage.getItem(COIN_STORAGE_KEY);
      if (!raw) return 0;
      const obj = JSON.parse(raw);
      return Number.isFinite(obj.moedas) ? obj.moedas : 0;
    } catch (e) {
      return 0;
    }
  }

  function renderCoinCount() {
    const target = document.querySelector('[data-coin-count]');
    if (!target) return;
    target.textContent = readCoinCount();
  }

  renderCoinCount();

  // Atualiza se outra aba/janela mexer no storage
  window.addEventListener('storage', (e) => {
    if (e.key === COIN_STORAGE_KEY) renderCoinCount();
  });

  /* ==========================================================================
   * 3. NAVEGAÇÃO DOS MEDALHÕES DE ANO
   *
   * Cada medalhão é um <a> com href direto pra /jogos_matematica_{N}ano.html.
   * O JS aqui só adiciona feedback tátil micro: pulso suave no toque (mobile).
   * ======================================================================== */
  document.querySelectorAll('.year-node-wrap').forEach((node) => {
    node.addEventListener('touchstart', () => {
      node.classList.add('is-pressing');
    }, { passive: true });

    node.addEventListener('touchend', () => {
      setTimeout(() => node.classList.remove('is-pressing'), 120);
    }, { passive: true });
  });

  /* ==========================================================================
   * 4. SAÚDE DE DEBUG (só em dev — remova ou condicione antes de produção)
   * ======================================================================== */
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('[matemagica/home v9] inicializada. Coin key:', COIN_STORAGE_KEY, '→', readCoinCount());
  }
})();
