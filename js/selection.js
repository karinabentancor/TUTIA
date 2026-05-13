document.addEventListener('DOMContentLoaded', function () {
  loadSelectedBooks();

  document.getElementById('backBtn').addEventListener('click', goBack);
  document.getElementById('continueBtn').addEventListener('click', function () {
    window.location.href = 'order.html';
  });

  document.getElementById('booksContainer').addEventListener('click', function (e) {
    const btn = e.target.closest('.remove-btn');
    if (btn) removeBook(btn.dataset.bookId);
  });
});

function generateImageName(title, author) {
  if (!title || !author) return null;

  const titleClean = title.toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/[^a-z0-9]/g, '');

  const authorLastName = author.toLowerCase().split(' ').pop();
  return `img/${titleClean}-${authorLastName}.jpg`;
}

function sanitize(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

function loadSelectedBooks() {
  const selectedBooks = JSON.parse(localStorage.getItem('selectedBooks')) || [];

  const container = document.getElementById('booksContainer');
  const header = document.getElementById('selectionHeader');
  const continueBtn = document.getElementById('continueBtn');

  if (selectedBooks.length === 0) {
    header.innerHTML = `<p>No hay libros seleccionados</p>`;
    container.innerHTML = `
      <div class="empty-state">
        <p>Todavía no elegiste ningún libro.</p>
        <button class="button-dark empty-btn" onclick="goBack()">IR AL CATÁLOGO</button>
      </div>
    `;
    continueBtn.style.display = 'none';
    return;
  }

  header.innerHTML = `<p>Los libros que seleccionaste</p>`;

  const list = document.createElement('div');
  list.className = 'books-list';

  selectedBooks.forEach(book => {
    const imagePath = book.image || generateImageName(book.title, book.author);

    const item = document.createElement('div');
    item.className = 'selected-book';
    item.dataset.bookId = book.id;

    const coverHTML = imagePath
      ? `<img src="${sanitize(imagePath)}" alt="Portada de ${sanitize(book.title || 'libro')}" class="cover-img" />`
      : '<div class="no-image">Sin imagen</div>';

    item.innerHTML = `
      <div class="book-cover">${coverHTML}</div>
      <div class="book-info">
        <div class="book-title">${sanitize(book.title || 'Título no disponible')}</div>
        <div class="book-author">${sanitize(book.author || 'Autor desconocido')}</div>
        <div class="book-publisher">${sanitize(book.publisher || '')}</div>
      </div>
      <button class="remove-btn" data-book-id="${book.id}" aria-label="Eliminar libro">×</button>
    `;

    const img = item.querySelector('.cover-img');
    if (img) {
      img.addEventListener('error', function () {
        this.parentElement.innerHTML = '<div class="no-image">Sin imagen</div>';
      });
    }

    list.appendChild(item);
  });

  container.innerHTML = '';
  container.appendChild(list);
  continueBtn.style.display = 'inline-block';
}

function removeBook(bookId) {
  let selectedBooks = JSON.parse(localStorage.getItem('selectedBooks')) || [];
  selectedBooks = selectedBooks.filter(book => String(book.id) !== String(bookId));
  localStorage.setItem('selectedBooks', JSON.stringify(selectedBooks));
  loadSelectedBooks();
}

function goBack() {
  window.location.href = 'catalog.html';
}