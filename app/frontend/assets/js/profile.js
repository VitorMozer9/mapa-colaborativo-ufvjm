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

    const user = getCurrentUserSafe();
    if (!user) {
      // se não estiver logado, manda pra login
      window.location.href = 'pagina_login.html';
      return;
    }

    const nomeEl = document.querySelector('.perfil-nome');
    const emailEl = document.querySelector('.perfil-email');
    const cargoEl = document.querySelector('.perfil-cargo');
    const matriculaEl = document.querySelector('.perfil-matricula');

    if (nomeEl) nomeEl.textContent = user.nome || 'Usuário';
    if (emailEl) emailEl.textContent = user.email || 'Email não informado';
    if (cargoEl) cargoEl.textContent = user.papel || 'Visitante';
    if (matriculaEl) {
      // Se no futuro tiver user.matricula, só trocar aqui
      matriculaEl.textContent = user.matricula || 'Matrícula não informada';
    }

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
            console.error('Erro ao salvar avatar no localStorage', err);
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
