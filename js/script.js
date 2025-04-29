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

  const allBooks = document.getElementById('all-books');
  const availableBooks = document.getElementById('available-books');

  document.querySelector('.switch-container').addEventListener('click', () => {
    allBooks.classList.toggle('active');
    availableBooks.classList.toggle('active');
  });

  // Suponiendo que tenés tu array de libros en una variable llamada books
const books = [ /* tu array aquí */ ];

const catalog = document.getElementById('catalog');
const switchButton = document.getElementById('switch-button');

let showOnlyAvailable = false;

// Función para renderizar libros
function renderBooks() {
  catalog.innerHTML = ''; // Limpia el catálogo antes de renderizar

  let filteredBooks = showOnlyAvailable
    ? books.filter(book => book.available)
    : books;

  filteredBooks.forEach(book => {
    const bookElement = document.createElement('div');
    bookElement.classList.add('book');
    if (!book.available) {
      bookElement.classList.add('not-available');
    }
    bookElement.innerHTML = `
      <img src="${book.image}" alt="${book.title}">
      <h3>${book.title}</h3>
      <p>${book.author}</p>
    `;
    catalog.appendChild(bookElement);
  });
}

// Escuchamos el click en el botón switch
switchButton.addEventListener('click', () => {
  showOnlyAvailable = !showOnlyAvailable;
  switchButton.classList.toggle('active');
  renderBooks();
});

// Primera carga
renderBooks();
