document.addEventListener('DOMContentLoaded', function() {
  loadSelectedBooks();
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

function loadSelectedBooks() {
  const selectedBooks = JSON.parse(localStorage.getItem('selectedBooks')) || [];
  
  const container = document.getElementById('booksContainer');
  const header = document.getElementById('selectionHeader');
  const continueBtn = document.getElementById('continueBtn');

  if (selectedBooks.length === 0) {
    header.innerHTML = '<p>NO HAY LIBROS SELECCIONADOS</p>';
    container.innerHTML = `
      <div class="empty-state">
        <p>Parece que no has seleccionado ningún libro todavía.</p>
        <button class="button-dark" onclick="goBack()">SELECCIONAR LIBROS</button>
      </div>
    `;
    continueBtn.style.display = 'none';
    return;
  }

  header.innerHTML = '<p>Los libros que has seleccionado</p>';

  const booksHTML = selectedBooks.map(book => {
    const imagePath = book.image || generateImageName(book.title, book.author);
    
    return `
      <div class="selected-book" data-book-id="${book.id}">
        <div class="book-cover">
          ${imagePath ? 
            `<img src="${imagePath}" alt="Portada de ${book.title || 'libro'}" 
                 onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\\'no-image\\'>Imagen no disponible</div>';" />` : 
            '<div class="no-image">Imagen no disponible</div>'
          }
        </div>
        <div class="book-info">
          <div class="book-title">${book.title || 'Título no disponible'}</div>
          <div class="book-author">${book.author || 'Autor desconocido'}</div>
          <div class="book-publisher">${book.publisher || ''}</div>
        </div>
        <button class="remove-btn" onclick="removeBook(${book.id})">
          <img src="svg/close-red.svg" alt="Eliminar" />
        </button>
      </div>
    `;
  }).join('');

  container.innerHTML = `<div class="books-list">${booksHTML}</div>`;
  continueBtn.style.display = 'inline-block';
}

function removeBook(bookId) {
  let selectedBooks = JSON.parse(localStorage.getItem('selectedBooks')) || [];
  selectedBooks = selectedBooks.filter(book => book.id !== bookId);
  localStorage.setItem('selectedBooks', JSON.stringify(selectedBooks));
  loadSelectedBooks();
  console.log('Libro eliminado. Libros restantes:', selectedBooks.length);
}

function goBack() {
  window.location.href = 'catalog.html';
}

function proceedToCheckout() {
  const selectedBooks = JSON.parse(localStorage.getItem('selectedBooks')) || [];
  
  if (selectedBooks.length === 0) {
    alert('No tienes libros seleccionados');
    return;
  }
  
  console.log('Procediendo con', selectedBooks.length, 'libros');
  alert(`Procediendo con ${selectedBooks.length} libro(s) seleccionado(s)`);
}