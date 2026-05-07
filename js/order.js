document.addEventListener('DOMContentLoaded', function() {
  setDates();
  loadSelectedBooks();

  // Recalcular total cuando cambia el método de entrega
  document.querySelectorAll('input[name="delivery_address"]').forEach(radio => {
    radio.addEventListener('change', updatePriceDisplay);
  });
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

function getDeliverySurcharge() {
  const selected = document.querySelector('input[name="delivery_address"]:checked');
  return selected && selected.value === 'delivery' ? 150 : 0;
}

function updatePriceDisplay() {
  const selectedBooks = JSON.parse(localStorage.getItem('selectedBooks')) || [];
  const priceDisplay = document.getElementById('priceDisplay');
  if (!priceDisplay || selectedBooks.length === 0) return;

  const base = calculatePrice(selectedBooks.length);
  const surcharge = getDeliverySurcharge();
  const total = base + surcharge;

  if (surcharge > 0) {
    priceDisplay.innerHTML = `
      <span class="price-breakdown">$${base} + $${surcharge} ENVÍO</span>
      <span class="price-total">TOTAL = $${total}</span>
    `;
  } else {
    priceDisplay.innerHTML = `<span class="price-total">TOTAL = $${total}</span>`;
  }
}

function loadSelectedBooks() {
  const selectedBooks = JSON.parse(localStorage.getItem('selectedBooks')) || [];
  const container = document.getElementById('selectedBooksContainer');
  const priceDisplay = document.getElementById('priceDisplay');

  if (selectedBooks.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h2>No hay libros seleccionados</h2>
        <p>No tenés libros seleccionados para el préstamo.</p>
        <button class="button-primary" onclick="window.location.href='selection.html'">SELECCIONAR LIBROS</button>
      </div>
    `;
    priceDisplay.style.display = 'none';
    document.getElementById('confirmBtn').style.display = 'none';
    return;
  }

  const base = calculatePrice(selectedBooks.length);
  priceDisplay.innerHTML = `<span class="price-total">TOTAL = $${base}</span>`;
  priceDisplay.style.display = 'flex';

  const booksHTML = selectedBooks.map((book, index) => {
    const imagePath = book.image || generateImageName(book.title, book.author);
    
    return `
      <div class="selected-book" data-book-id="${book.id || index}">
        <div class="book-cover">
          ${imagePath ? 
            `<img src="${imagePath}" alt="Portada de ${book.title || 'libro'}" 
                 onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\\'no-image\\'>Sin imagen</div>';" />` : 
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


function confirmOrder() {
  const selectedBooks = JSON.parse(localStorage.getItem('selectedBooks')) || [];

  const firstName  = document.getElementById('firstName').value.trim();
  const lastName   = document.getElementById('lastName').value.trim();
  const documentId = document.getElementById('documentId').value.trim();
  const email      = document.getElementById('email').value.trim();
  const phone      = document.getElementById('phone').value.trim();

  if (!firstName || !lastName || !documentId || !email || !phone) {
    alert('Por favor, completá todos los datos personales');
    return;
  }


  const selectedAddress = document.querySelector('input[name="delivery_address"]:checked').value;
  const selectedPayment = document.querySelector('input[name="payment_method"]:checked').value;

  let deliveryType, street, corner, notes;

  if (selectedAddress === 'pickup') {
    deliveryType = 'PICK-UP — Paysandú esquina Av. Rondeau';
    street = corner = notes = '';
  } else {
    street = document.getElementById('street').value.trim();
    corner = document.getElementById('corner').value.trim();
    notes  = document.getElementById('notes').value.trim();

    if (!street || !corner) {
      alert('Por favor, completá la dirección y esquina para el envío');
      return;
    }
    deliveryType = 'ENVÍO';
  }

  const base      = calculatePrice(selectedBooks.length);
  const surcharge = getDeliverySurcharge();
  const total     = base + surcharge;

  const booksText = selectedBooks
    .map((b, i) => `${i + 1}. ${b.title} — ${b.author}`)
    .join('\n');

  const formatDate = (date) => date.toLocaleDateString('es-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const loanDate   = formatDate(new Date());
  const returnDate = formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));

  const paymentText = selectedPayment === 'transfer' ? 'Transferencia bancaria' : 'Efectivo';
  const totalText   = surcharge > 0 ? `$${base} + $${surcharge} envío = $${total}` : `$${total}`;

  const confirmBtn = document.getElementById('confirmBtn');
  confirmBtn.disabled = true;
  confirmBtn.textContent = 'ENVIANDO...';

  emailjs.send('service_wxiahcz', 'template_9xs6nbe', {
    firstName,
    lastName,
    documentId,
    phone,
    email,
    books:        booksText,
    deliveryType,
    street,
    corner,
    notes,
    payment:      paymentText,
    loanDate,
    returnDate,
    total:        totalText
  })
  .then(() => {
    localStorage.removeItem('selectedBooks');
    sessionStorage.removeItem('selectedBooks');
    alert('Recibimos tu solicitud correctamente. Nos ponemos en contacto a la brevedad.\n\nTUTÍA ♥');
    window.location.href = 'index.html';
  })
  .catch((error) => {
    console.error('EmailJS error:', error);
    alert('Hubo un error al enviar. Por favor intentá de nuevo.');
    confirmBtn.disabled = false;
    confirmBtn.textContent = 'CONFIRMAR PRÉSTAMO';
  });
}