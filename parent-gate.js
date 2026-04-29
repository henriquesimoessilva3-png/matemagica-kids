// ============================================================
// PARENT GATE — Caroline 2.4
// Barreira leve nas seções adultas (Dashboard, Imprimir, Revisão)
// Pergunta uma multiplicação fácil pra adulto, difícil pra criança 1°-3° ano.
// Resolução persiste pela sessão atual (sessionStorage).
// ============================================================
(function () {
  var SESS_KEY = 'matemagica_parent_gate_ok_v1';
  if (sessionStorage.getItem(SESS_KEY) === '1') return;

  // Gera multiplicação 6-9 × 7-12 → resultado 42-108 (2-3 dígitos)
  function rint(min, max) { return min + Math.floor(Math.random() * (max - min + 1)); }
  var a = rint(6, 9);
  var b = rint(7, 12);
  var resp = a * b;

  function aplicar() {
    // Esconde body até resolver — guarda o estado original e restaura
    var origOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';

    var ov = document.createElement('div');
    ov.id = 'parent-gate-overlay';
    ov.style.cssText = 'position:fixed;inset:0;background:linear-gradient(135deg,#3a2c6b,#6b54d3);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;font-family:"Segoe UI",Arial,sans-serif';
    ov.innerHTML = ''
      + '<div style="background:#fff;border-radius:18px;padding:24px 22px;max-width:380px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.4)">'
      +   '<div style="font-size:48px;margin-bottom:8px">🔒</div>'
      +   '<h2 style="color:#4a3b8a;font-size:20px;margin:0 0 6px;font-weight:800">Essa parte é dos adultos!</h2>'
      +   '<p style="color:#666;font-size:13px;margin:0 0 18px;line-height:1.5">Pra continuar, mostra que você é gente grande:</p>'
      +   '<div style="background:#f7f5ff;border-radius:14px;padding:14px;margin-bottom:14px">'
      +     '<div style="font-size:32px;font-weight:900;color:#4a3b8a;margin-bottom:10px"><span>' + a + '</span> × <span>' + b + '</span> = ?</div>'
      +     '<input id="pg-input" type="number" inputmode="numeric" pattern="[0-9]*" autocomplete="off"'
      +       ' style="width:120px;padding:10px;font-size:22px;text-align:center;border:2px solid #c5bbe9;border-radius:10px;font-family:inherit;color:#4a3b8a;font-weight:700"'
      +       ' onkeydown="if(event.key===\'Enter\')window.__pgConfirm()">'
      +     '<div id="pg-erro" style="color:#a83232;font-size:13px;font-weight:700;min-height:18px;margin-top:8px">&nbsp;</div>'
      +   '</div>'
      +   '<button onclick="window.__pgConfirm()" style="background:#6b54d3;color:#fff;border:none;padding:10px 20px;border-radius:10px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;margin-bottom:10px;width:100%">Confirmar</button>'
      // Botão "Voltar pra brincar" MAIOR e mais convidativo (Caroline 2.4.1)
      +   '<button onclick="window.__pgVoltar()" style="background:linear-gradient(135deg,#2ebd7c,#4ab3a5);color:#fff;border:none;padding:14px;border-radius:12px;font-weight:800;font-size:16px;cursor:pointer;font-family:inherit;width:100%;box-shadow:0 4px 10px rgba(46,189,124,0.3)">🎮 Voltar pra brincar</button>'
      + '</div>';
    document.body.appendChild(ov);

    setTimeout(function () { var i = document.getElementById('pg-input'); if (i) i.focus(); }, 100);

    var tentativas = 0;
    window.__pgConfirm = function () {
      var v = parseInt(document.getElementById('pg-input').value, 10);
      if (v === resp) {
        try { sessionStorage.setItem(SESS_KEY, '1'); } catch (e) {}
        document.documentElement.style.overflow = origOverflow;
        ov.remove();
        delete window.__pgConfirm;
        delete window.__pgVoltar;
      } else {
        tentativas++;
        var erro = document.getElementById('pg-erro');
        if (tentativas >= 3) {
          erro.innerHTML = 'Hmm, tá difícil. <a href="/index.html" style="color:#6b54d3">Voltar pra brincar</a>';
        } else {
          erro.textContent = 'Hmm, conta de novo com calma.';
        }
        document.getElementById('pg-input').value = '';
        document.getElementById('pg-input').focus();
      }
    };
    window.__pgVoltar = function () {
      // Vai pro index sem deixar a página carregar mais
      location.replace('/index.html');
    };
  }

  if (document.body) aplicar();
  else document.addEventListener('DOMContentLoaded', aplicar);
})();
