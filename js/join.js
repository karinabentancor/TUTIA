document.addEventListener('DOMContentLoaded', function() {
    emailjs.init('QlrFx-Q3IIk9mClin');

    const form = document.getElementById('registration-form');
    if (!form) {
        console.error('No se encontró el formulario con ID registration-form.');
        return;
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const serviceID = 'service_n4zmblc';
        const templateIDUser = 'template_j2il74t';

        const formData = {
            nombre: document.getElementById('nombre').value,
            apellidos: document.getElementById('apellidos').value,
            documento: document.getElementById('documento').value,
            direccion: document.getElementById('direccion').value,
            esquina: document.getElementById('esquina').value,
            celular: document.getElementById('celular').value,
            email: document.getElementById('email').value,
            user: document.getElementById('user').value,
            password: document.getElementById('password').value
        };

        emailjs.send(serviceID, templateIDUser, formData)
            .then(function(response) {
                console.log('SUCCESS! Mail de bienvenida enviado.', response.status, response.text);

                const templateIDAdmin = 'template_4v1jaud';

                return emailjs.send(serviceID, templateIDAdmin, formData);
            })
            .then(function(response) {
                console.log('SUCCESS! Mail al club enviado.', response.status, response.text);
                alert('¡Te has unido al club exitosamente!');
                localStorage.setItem('clubUser', formData.nombre);
                window.location.href = 'index.html';
                form.reset();
            })
            .catch(function(error) {
                console.error('FAILED...', error);
                alert('Hubo un error. Por favor, intentá nuevamente.');
            });
    });

    const docInput = document.getElementById('documento');
    const userInput = document.getElementById('user');
    
    docInput.addEventListener('input', () => {
      userInput.value = docInput.value;
    });
    
    const pwdInput = document.getElementById('password');
    const toggle = document.querySelector('.toggle-password img');

    toggle.addEventListener('click', () => {
        const isPwd = pwdInput.type === 'password';
        pwdInput.type = isPwd ? 'text' : 'password';
        toggle.src = isPwd
          ? 'svg/eye-see.svg'  
          : 'svg/eye-hide.svg'; 
        toggle.alt = isPwd
          ? 'Ocultar contraseña'
          : 'Mostrar contraseña';
    });
});