fetch("books.json")
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById("catalog");
    data.forEach(book => {
      const status = book.available ? "" : "<p class='out-of-stock'>Libro en préstamo</p>";
      container.innerHTML += `
        <div class="book ${book.available ? "" : "not-available"}">
          <img src="${book.image}" alt="${book.title}">
          <h3>${book.title}</h3>
          <p><strong>Autor/a:</strong> ${book.author}</p>
          <p><strong>Editorial:</strong> ${book.publisher}</p>
          <p><strong>Páginas:</strong> ${book.pages}</p>
          <p><strong>Idioma:</strong> ${book.language}</p>
          <p><strong>Idioma original: </strong> ${book.languageOriginal}</p>
          ${status}
        </div>
      `;
    });
  })
  .catch(error => console.error("Error loading books:", error));
  
  function registrarUsuario() {
      let ci = document.getElementById("documento").value;
      let password = document.getElementById("password").value;
      
      if (ci && password) {
          localStorage.setItem("usuario", JSON.stringify({ci, password}));
          alert("Usuario registrado con éxito. Ahora puedes iniciar sesión.");
      } else {
          alert("Por favor, completa todos los campos.");
      }
  }

  function registrarUsuario() {
      let ci = document.getElementById("documento").value;
      let password = document.getElementById("password").value;
      
      if (ci && password) {
          localStorage.setItem("usuario", JSON.stringify({ci, password}));
          alert("Usuario registrado con éxito. Ahora puedes iniciar sesión.");
      } else {
          alert("Por favor, completa todos los campos.");
      }
  }

document.getElementById('search').addEventListener('input', function () {
  const query = this.value.toLowerCase();
  filterBooks(query, 'search');
});

document.getElementById('editorial').addEventListener('change', function () {
  const selectedEditorial = this.value;
  filterBooks(selectedEditorial, 'editorial');
});

function filterBooks(query, type) {
  const container = document.getElementById("catalog");
  container.innerHTML = ''; 

  fetch("books.json")
    .then(response => response.json())
    .then(data => {
      let filteredBooks = data;

      if (type === 'search') {
        filteredBooks = data.filter(book => book.title.toLowerCase().includes(query));
      } else if (type === 'editorial') {
        filteredBooks = data.filter(book => book.publisher === query || query === 'all');
      }

      filteredBooks.forEach(book => {
        const status = book.available ? "" : "<p class='out-of-stock'>Libro en préstamo</p>";
        container.innerHTML += `
          <div class="book ${book.available ? "" : "not-available"}">
            <img src="${book.image}" alt="${book.title}">
            <h3>${book.title}</h3>
            <p><strong>Autor/a:</strong> ${book.author}</p>
            <p><strong>Editorial:</strong> ${book.publisher}</p>
            <p><strong>Páginas:</strong> ${book.pages}</p>
            <p><strong>Idioma:</strong> ${book.language}</p>
            <p><strong>Idioma original: </strong> ${book.languageOriginal}</p>
            ${status}
          </div>
        `;
      });
    })
    .catch(error => console.error("Error loading books:", error));
}

document.getElementById('sort-author').addEventListener('click', function () {
  sortBooks('author');
});

document.getElementById('sort-title').addEventListener('click', function () {
  sortBooks('title');
});

function sortBooks(type) {
  const container = document.getElementById("catalog");
  container.innerHTML = ''; 

  fetch("books.json")
    .then(response => response.json())
    .then(data => {
      let sortedBooks = data;

      if (type === 'author') {
        sortedBooks = data.sort((a, b) => a.author.localeCompare(b.author));
      } else if (type === 'title') {
        sortedBooks = data.sort((a, b) => a.title.localeCompare(b.title));
      }

      sortedBooks.forEach(book => {
        const status = book.available ? "" : "<p class='out-of-stock'>Libro en préstamo</p>";
        container.innerHTML += `
          <div class="book ${book.available ? "" : "not-available"}">
            <img src="${book.image}" alt="${book.title}">
            <h3>${book.title}</h3>
            <p><strong>Autor/a:</strong> ${book.author}</p>
            <p><strong>Editorial:</strong> ${book.publisher}</p>
            <p><strong>Páginas:</strong> ${book.pages}</p>
            <p><strong>Idioma:</strong> ${book.language}</p>
            <p><strong>Idioma original: </strong> ${book.languageOriginal}</p>
            ${status}
          </div>
        `;
      });
    })
    .catch(error => console.error("Error loading books:", error));
}

document.addEventListener('DOMContentLoaded', function() {
  // Inicializar EmailJS - Reemplaza "tu_user_id" con tu ID de usuario de EmailJS
  emailjs.init("service_i518h1y");
  
  const form = document.getElementById('registration-form');
  
  form.addEventListener('submit', function(event) {
      event.preventDefault();
      
      // Mostrar algún tipo de indicador de carga si lo deseas
      const joinBtn = document.querySelector('.join-btn');
      joinBtn.textContent = "Enviando...";
      joinBtn.disabled = true;
      
      // Obtener los datos del formulario
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
      
      // Enviar el formulario usando EmailJS
      // Reemplaza "tu_service_id" y "tu_template_id" con tus IDs de EmailJS
      emailjs.send("service_i518h1y","template_w01fkwj", formData)
          .then(function(response) {
              console.log("Formulario enviado correctamente", response);
              // Mostrar mensaje de éxito
              alert("¡Te has unido al club con éxito!");
              // Resetear el formulario
              form.reset();
              // Restaurar el botón
              joinBtn.textContent = "UNIRME AL CLUB";
              joinBtn.disabled = false;
          })
          .catch(function(error) {
              console.error("Error al enviar el formulario", error);
              // Mostrar mensaje de error
              alert("Ha ocurrido un error al enviar el formulario. Por favor, intenta de nuevo.");
              // Restaurar el botón
              joinBtn.textContent = "UNIRME AL CLUB";
              joinBtn.disabled = false;
          });
  });
});