document.addEventListener('DOMContentLoaded', () => {
  const cadastroForm = document.querySelector('.btn-cadastro')?.closest('form');
  const professorForm = document.querySelector('.btn-professor')?.closest('form');
  const loginForm = document.querySelector('.btn-login')?.closest('form');
  const mensagensDiv = document.getElementById('mensagens-auth');

  function showMessage(text, tipo = 'erro') {
    if (!mensagensDiv) return;
    mensagensDiv.textContent = text;
    mensagensDiv.className = `mensagens-auth ${tipo}`;
  }

  // Cadastro Aluno/Geral
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

        setTimeout(() => window.location.reload(), 1500);
      } catch (err) {
        console.error(err);
        showMessage(err.message || 'Erro ao cadastrar.', 'erro');
      }
    });
  }
  // Cadastro Professor
  if (professorForm) {
    professorForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const siape = document.getElementById('siap-cad')?.value.trim();
      const nome = professorForm.querySelector('#nome-cad')?.value.trim();
      const email = professorForm.querySelector('#email-cad')?.value.trim();
      const senha = professorForm.querySelector('#senha-cad')?.value;
      const confirma = professorForm.querySelector('#confirma-senha')?.value;

      if (!siape || !nome || !email || !senha) {
        return showMessage('Preencha todos os dados do docente.', 'erro');
      }

      try {
        const resposta = await window.API.registerUser({ nome, email, senha, papel: 'professor', siape });
        if(resposta.usuario){
          localStorage.setItem('authUser', JSON.stringify(resposta.usuario));
          localStorage.setItem('authToken', resposta.token);
        }
        showMessage('Docente cadastrado! Aguarde aprovação ou faça login.', 'sucesso');
        setTimeout(() => window.location.href = 'pagina_mapa.html',  1500);
      } catch (error) {
        console.error(error);
        showMessage(error.message || 'Erro ao cadastrar docente.', 'erro');
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
        const dados = await window.API.loginUser({ email, senha });
        if(dados.token) localStorage.setItem('authToken', dados.token);

        if(dados.usuario){
          localStorage.setItem('authUser', JSON.stringify(dados.usuario));
        }else if(dados.papel){
          localStorage.setItem('authUser', JSON.stringify({ papel: dados.papel }));
        }

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
