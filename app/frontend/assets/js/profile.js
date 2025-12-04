(function () {
  function getCurrentUserSafe() {
    if (!window.API || !window.API.getCurrentUser) return null;
    return window.API.getCurrentUser();
  }

  function applyAvatarToAll(imgSrc) {
    if (!imgSrc) return;
    document.querySelectorAll('.profile-avatar-img').forEach((img) => {
      img.src = imgSrc;
    });
  }

  function initGlobalHeader() {
    const user = getCurrentUserSafe();
    const navProfile = document.querySelector('.nav-profile');
    const loginLink = document.querySelector('.nav-link-login');

    const storedAvatar = localStorage.getItem('profileAvatar');
    if (storedAvatar) {
      applyAvatarToAll(storedAvatar);
    }

    if (!navProfile) return;

    const nameSpan = navProfile.querySelector('.nav-profile-name');

    if (user) {
      if (nameSpan) {
        nameSpan.textContent = user.nome?.split(' ')[0] || user.nome || 'Usuário';
      }
      if (loginLink) {
        loginLink.style.display = 'none';
      }
    } else {
      if (nameSpan) {
        nameSpan.textContent = 'Entrar';
      }
      // se quiser, mostrar o link de login quando não logado
      if (loginLink) {
        loginLink.style.display = 'inline-block';
      }
    }
  }

  function initProfilePage() {
    const isProfilePage = document.querySelector('.perfil-layout');
    if (!isProfilePage) return;

    //  Verifica login
    const user = getCurrentUserSafe();
    if (!user) {
      window.location.href = 'pagina_login.html';
      return;
    }

    //  Seleciona os elementos do HTML 
    const nomeEl = document.querySelector('.perfil-nome');
    const emailEl = document.querySelector('.perfil-email');
    const cargoEl = document.querySelector('.perfil-cargo');
    
    // Elementos do SIAP (Professor)
    const matriculaWrapper = document.querySelector('.perfil-matricula-wrapper'); 
    const matriculaSpan = document.querySelector('.perfil-matricula');

    //  Preenche dados básicos
    if (nomeEl) nomeEl.textContent = user.nome || 'Usuário';
    if (emailEl) emailEl.textContent = user.email || 'Email não informado';

    //  Lógica do Cargo 
    let textoCargo = 'Aluno';
    if (user.papel === 'professor') textoCargo = 'Docente / Professor';
    if (user.papel === 'admin') textoCargo = 'Administrador';
    
    if (cargoEl) cargoEl.textContent = textoCargo;

    //  Se for PROFESSOR, mostra o SIAP
    if (user.papel === 'professor') {
        if (matriculaWrapper) matriculaWrapper.style.display = 'block'; 
        if (matriculaSpan) matriculaSpan.textContent = user.siap || user.matricula || 'N/A';
    } else {
        if (matriculaWrapper) matriculaWrapper.style.display = 'none'; 
    }

    //  Lógica de Avatar e Logout
    const storedAvatar = localStorage.getItem('profileAvatar');
    if (storedAvatar) {
      applyAvatarToAll(storedAvatar);
    }

    const avatarInput = document.getElementById('avatar-input');
    if (avatarInput) {
      avatarInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
          const dataUrl = e.target.result;
          try {
            localStorage.setItem('profileAvatar', dataUrl);
          } catch (err) {
            console.error('Erro ao salvar avatar', err);
          }
          applyAvatarToAll(dataUrl);
        };
        reader.readAsDataURL(file);
      });
    }

    const btnSair = document.querySelector('.btn-sair-perfil');
    if (btnSair) {
      btnSair.addEventListener('click', function () {
        if (window.API && window.API.clearAuth) {
          window.API.clearAuth();
        } else {
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
        }
        window.location.href = 'pagina_login.html';
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initGlobalHeader();
    initProfilePage();
  });
})();
