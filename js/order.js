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

function calculatePrice(bookCount) {
  if (bookCount === 1) return 400;
  if (bookCount === 2) return 500;
  if (bookCount >= 3) return 700;
  return 0;
}

function loadSelectedBooks() {
  const selectedBooks = JSON.parse(localStorage.getItem('selectedBooks')) || [];
  const container = document.getElementById('selectedBooksContainer');
  const priceDisplay = document.getElementById('priceDisplay');

  console.log('Libros cargados desde localStorage:', selectedBooks);

  if (selectedBooks.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h2>No hay libros seleccionados</h2>
        <p>No tienes libros seleccionados para el préstamo.</p>
        <button class="button button-primary" onclick="window.location.href='selection.html'">SELECCIONAR LIBROS</button>
      </div>
    `;
    priceDisplay.style.display = 'none';
    document.getElementById('confirmBtn').style.display = 'none';
    return;
  }

  const price = calculatePrice(selectedBooks.length);
  priceDisplay.textContent = `TOTAL: $ ${price}`;
  priceDisplay.style.display = 'block';

  const booksHTML = selectedBooks.map((book, index) => {
    const imagePath = book.image || generateImageName(book.title, book.author);
    
    return `
      <div class="selected-book" data-book-id="${book.id || index}">
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

  container.innerHTML = booksHTML;
}

function goBack() {
  window.history.back();
}

document.getElementById('docFront').addEventListener('change', function(e) {
  const fileName = e.target.files[0]?.name || 'Seleccionar archivo';
  document.getElementById('docFrontText').textContent = fileName;
});

document.getElementById('docBack').addEventListener('change', function(e) {
  const fileName = e.target.files[0]?.name || 'Seleccionar archivo';
  document.getElementById('docBackText').textContent = fileName;
});

function confirmOrder() {
  const selectedBooks = JSON.parse(localStorage.getItem('selectedBooks')) || [];
  
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const documentId = document.getElementById('documentId').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;

  if (!firstName || !lastName || !documentId || !email || !phone) {
    alert('Por favor, completa todos los datos personales');
    return;
  }

  const docFront = document.getElementById('docFront').files[0];
  const docBack = document.getElementById('docBack').files[0];

  if (!docFront || !docBack) {
    alert('Por favor, sube ambas fotos del documento de identidad');
    return;
  }

  const selectedAddress = document.querySelector('input[name="delivery_address"]:checked').value;
  const selectedPayment = document.querySelector('input[name="payment_method"]:checked').value;
  
  let addressInfo;
  if (selectedAddress === 'pickup') {
    addressInfo = {
      type: 'pickup',
      location: 'Paysandú esquina Av. Rondeau'
    };
  } else {
    const street = document.getElementById('street').value;
    const corner = document.getElementById('corner').value;

    if (!street || !corner) {
      alert('Por favor, completa la dirección y esquina para el envío');
      return;
    }

    addressInfo = {
      type: 'delivery',
      street: street,
      corner: corner
    };
  }

  const orderData = {
    personalInfo: {
      firstName: firstName,
      lastName: lastName,
      documentId: documentId,
      email: email,
      phone: phone
    },
    documents: {
      front: docFront.name,
      back: docBack.name
    },
    books: selectedBooks,
    delivery: addressInfo,
    payment: selectedPayment,
    loanDate: new Date().toISOString(),
    returnDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  };

  console.log('Orden confirmada:', orderData);
  
  const paymentText = selectedPayment === 'transfer' ? 'Transferencia bancaria' : 'Efectivo';
  const deliveryText = selectedAddress === 'pickup' 
    ? 'PICK-UP: Paysandú esquina Av. Rondeau'
    : `${addressInfo.street} esquina ${addressInfo.corner}`;

  alert(`Préstamo confirmado!\n\nLibros: ${selectedBooks.length}\nEntrega: ${deliveryText}\nPago: ${paymentText}\n\nRecibirás una confirmación por email.`);
}