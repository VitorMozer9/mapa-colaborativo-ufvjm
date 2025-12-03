document.addEventListener('DOMContentLoaded', () => {
  const cadastroForm = document.querySelector('.btn-cadastro')?.closest('form');
  const loginForm = document.querySelector('.btn-login')?.closest('form');
  const mensagensDiv = document.getElementById('mensagens-auth');

  function showMessage(text, tipo = 'erro') {
    if (!mensagensDiv) return;
    mensagensDiv.textContent = text;
    mensagensDiv.className = `mensagens-auth ${tipo}`;
  }

  // Cadastro
  if (cadastroForm) {
    cadastroForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nome = document.getElementById('nome-cad').value.trim();
      const email = document.getElementById('email-cad').value.trim();
      const senha = document.getElementById('senha-cad').value;
      const confirma = document.getElementById('confirma-senha').value;

      if (!nome || !email || !senha || !confirma) {
        showMessage('Preencha todos os campos de cadastro.', 'erro');
        return;
      }

      if (senha !== confirma) {
        showMessage('As senhas não conferem.', 'erro');
        return;
      }

      try {
        await window.API.registerUser({ nome, email, senha });
        showMessage('Cadastro realizado com sucesso! Redirecionando...', 'sucesso');

        setTimeout(() => {
          window.location.href = 'pagina_mapa.html';
        }, 1000);
      } catch (err) {
        console.error(err);
        showMessage(err.message || 'Erro ao cadastrar.', 'erro');
      }
    });
  }

  // Login
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email-log').value.trim();
      const senha = document.getElementById('senha-log').value;

      if (!email || !senha) {
        showMessage('Informe email e senha.', 'erro');
        return;
      }

      try {
        await window.API.loginUser({ email, senha });
        showMessage('Login realizado com sucesso! Redirecionando...', 'sucesso');

        setTimeout(() => {
          window.location.href = 'pagina_mapa.html';
        }, 1000);
      } catch (err) {
        console.error(err);
        showMessage(err.message || 'Erro ao fazer login.', 'erro');
      }
    });
  }
});
