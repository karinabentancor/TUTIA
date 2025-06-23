  document.addEventListener('DOMContentLoaded', function() {
    setDates();
    loadSelectedBooks();
  });

  function setDates() {
    const today = new Date();
    const returnDate = new Date(today);
    returnDate.setMonth(returnDate.getMonth() + 1);

    const formatDate = (date) => {
      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    document.getElementById('loanDate').textContent = formatDate(today);
    document.getElementById('returnDate').textContent = formatDate(returnDate);
  }

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
    const container = document.getElementById('selectedBooksContainer');

    console.log('Libros cargados desde localStorage:', selectedBooks);

    if (selectedBooks.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <h2>No hay libros seleccionados</h2>
          <p>No tienes libros seleccionados para el préstamo.</p>
          <button class="button button-primary" onclick="window.location.href='selection.html'">SELECCIONAR LIBROS</button>
        </div>
      `;
      document.getElementById('confirmBtn').style.display = 'none';
      return;
    }

    const booksHTML = selectedBooks.map((book, index) => {
      const imagePath = book.image || generateImageName(book.title, book.author);
      
      return `
        <div class="selected-book-order" data-book-id="${book.id || index}">
          <div class="book-cover">
            ${imagePath ? 
              `<img src="${imagePath}" alt="Portada de ${book.title || 'libro'}" 
                   onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\\'no-image\\'>Imagen no disponible</div>';" />` : 
              '<div class="no-image">Sin imagen</div>'
            }
          </div>
          <div class="book-info">
            <div class="book-title">${book.title || 'Título no disponible'}</div>
            <div class="book-author">${book.author || 'Autor desconocido'}</div>
            ${book.publisher ? `<div class="book-publisher">${book.publisher}</div>` : ''}
            ${book.year ? `<div class="book-year">${book.year}</div>` : ''}
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="books-list-order">
        ${booksHTML}
      </div>
    `;
  }

  function goBack() {
    window.history.back();
  }

  function confirmOrder() {
    const selectedBooks = JSON.parse(localStorage.getItem('selectedBooks')) || [];
    const selectedAddress = document.querySelector('input[name="delivery_address"]:checked').value;
    
    let street, number;
    if (selectedAddress === 'address1') {
      street = document.getElementById('street1').value;
      number = document.getElementById('number1').value;
    } else {
      street = document.getElementById('street2').value;
      number = document.getElementById('number2').value;
    }

    if (!street || !number) {
      alert('Por favor, completa la dirección seleccionada');
      return;
    }

    const orderData = {
      books: selectedBooks,
      address: {
        street: street,
        number: number,
        type: selectedAddress
      },
      loanDate: new Date().toISOString(),
      returnDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    console.log('Orden confirmada:', orderData);
    alert(`Préstamo confirmado!\n\nLibros: ${selectedBooks.length}\nDirección: ${street} ${number}\n\nRecibirás una confirmación por email.`);
    
    // Aquí podrías enviar los datos a un servidor
    // localStorage.removeItem('selectedBooks'); // Opcional: limpiar selección
  }
