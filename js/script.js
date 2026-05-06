let allBooksData = []
let currentBooks = []
let showOnlyAvailable = false
let selectedBooks = []

// ── Storage helpers ──────────────────────────────────────────────────────────
function saveSelection() {
  const json = JSON.stringify(selectedBooks)
  sessionStorage.setItem('selectedBooks', json)
  localStorage.setItem('selectedBooks', json)
}

function loadSavedSelection() {
  const saved = sessionStorage.getItem('selectedBooks') || localStorage.getItem('selectedBooks')
  if (saved) {
    try {
      selectedBooks = JSON.parse(saved)
    } catch (error) {
      console.error('Error al cargar selección guardada:', error)
      selectedBooks = []
    }
  }
}

// ── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  loadSavedSelection()

  // Botón mobile
  const mobileBtn = document.getElementById('mobileCartBtn')
  if (mobileBtn) {
    mobileBtn.removeAttribute('onclick')
    mobileBtn.addEventListener('click', () => {
      saveSelection()
      window.location.href = 'selection.html'
    })
  }

  fetch("books.json")
    .then(response => response.json())
    .then(data => {
      allBooksData = data
      populateEditorials(data)
      populateCategories(data)
      selectedBooks = selectedBooks.filter(b =>
        allBooksData.some(book => book.id == b.id)
      )
      saveSelection()
      applyFilters()
      updateMobileBar()
    })
    .catch(error => console.error("Error loading books:", error))
})

// ── Filters ──────────────────────────────────────────────────────────────────
function populateEditorials(data) {
  const select = document.getElementById("editorial")
  const editorials = Array.from(new Set(data.map(book => book.publisher))).sort()
  editorials.forEach(editorial => {
    const option = document.createElement("option")
    option.value = editorial
    option.textContent = editorial
    select.appendChild(option)
  })
}

function populateCategories(data) {
  const selectCat = document.getElementById('category')
  const categories = Array.from(new Set(data.map(book => book.category))).sort()
  categories.forEach(cat => {
    const option = document.createElement('option')
    option.value = cat
    option.textContent = cat
    selectCat.appendChild(option)
  })
}

function applyFilters() {
  const query = document.getElementById("search").value.toLowerCase()
  const editorial = document.getElementById("editorial").value
  const category = document.getElementById("category").value
  currentBooks = allBooksData.filter(book => {
    const matchesSearch =
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query)
    const matchesEditorial = editorial === "all" || book.publisher === editorial
    const matchesCategory  = category === "all"  || book.category === category
    const matchesAvailability = !showOnlyAvailable || book.available
    return matchesSearch && matchesEditorial && matchesCategory && matchesAvailability
  })
  renderBooks(currentBooks)
}

document.getElementById("search").addEventListener("input", applyFilters)
document.getElementById("editorial").addEventListener("change", applyFilters)
document.getElementById("category").addEventListener("change", applyFilters)

document.getElementById("all-books").addEventListener("click", () => {
  showOnlyAvailable = false
  document.getElementById("all-books").classList.add("active")
  document.getElementById("available-books").classList.remove("active")
  applyFilters()
})
document.getElementById("available-books").addEventListener("click", () => {
  showOnlyAvailable = true
  document.getElementById("available-books").classList.add("active")
  document.getElementById("all-books").classList.remove("active")
  applyFilters()
})

// ── Render ───────────────────────────────────────────────────────────────────
function renderBooks(books) {
  const container = document.getElementById("catalog")
  container.innerHTML = ""
  books.forEach(book => {
    const isSelected = selectedBooks.some(b => b.id == book.id)

    const bookDiv = document.createElement("div")
    bookDiv.className = `book ${book.available ? "" : "not-available"} ${isSelected ? "selected-card" : ""}`
    bookDiv.dataset.id = book.id

    const img = document.createElement("img")
    img.src = book.image
    img.alt = book.title

    const bookContent = document.createElement("div")
    bookContent.className = "book-content"

    const h3 = document.createElement("h3")
    h3.textContent = book.title

    const pAuthor = document.createElement("p")
    pAuthor.innerHTML = `<span class="value" style="font-weight:900; color:#000;">${book.author}</span>`

    const pPublisher = document.createElement("p")
    pPublisher.innerHTML = `<span class="value">${book.publisher}</span>`

    const pCategory = document.createElement("p")
    pCategory.innerHTML = `<span class="value">${book.category}</span>`

    const pPages = document.createElement("p")
    pPages.innerHTML = `<span class="value">${book.pages} páginas</span>`

    const pLang = document.createElement("p")
    pLang.innerHTML = `<span class="value">${book.language}</span>`

    const bookFooter = document.createElement("div")
    bookFooter.className = "book-footer"

    const button = document.createElement("button")
    button.className = `pack-button${isSelected ? " selected" : ""}`
    button.setAttribute("aria-label", "Seleccionar libro")

    const icon = document.createElement("img")
    icon.src = "svg/arrow-through-heart.svg"
    icon.alt = ""
    button.appendChild(icon)

    button.addEventListener("click", (e) => {
      e.stopPropagation()
      handleBookSelection(book, button, bookDiv)
    })

    bookFooter.appendChild(button)
    bookContent.append(h3, pAuthor, pPublisher, pCategory, pPages, pLang)
    bookDiv.append(img, bookContent, bookFooter)

    bookDiv.addEventListener("click", (e) => {
      if (!e.target.closest(".pack-button")) openModal(book)
    })

    container.appendChild(bookDiv)
  })
}

// ── Selection ────────────────────────────────────────────────────────────────
function handleBookSelection(book, button, bookDiv) {
  if (!book.available) {
    alert("Este libro no está disponible")
    return
  }

  const idx = selectedBooks.findIndex(b => b.id == book.id)

  if (idx === -1) {
    if (selectedBooks.length >= 2) {
      alert("Podés seleccionar hasta 2 libros")
      return
    }
    selectedBooks.push({
      id: book.id,
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      category: book.category,
      pages: book.pages,
      language: book.language,
      languageOriginal: book.languageOriginal,
      image: book.image,
      available: book.available
    })
    button.classList.add("selected")
    if (bookDiv) bookDiv.classList.add("selected-card")
  } else {
    selectedBooks.splice(idx, 1)
    button.classList.remove("selected")
    if (bookDiv) bookDiv.classList.remove("selected-card")
  }

  saveSelection()
  updateMobileBar()
}

function handleRemoveBook(bookId) {
  const idx = selectedBooks.findIndex(b => b.id == bookId)
  if (idx !== -1) {
    selectedBooks.splice(idx, 1)
    saveSelection()

    const bookDiv = document.querySelector(`.book[data-id="${bookId}"]`)
    if (bookDiv) {
      bookDiv.querySelector(".pack-button")?.classList.remove("selected")
      bookDiv.classList.remove("selected-card")
    }

    updateMobileBar()
  }
}

// ── Mobile bar ───────────────────────────────────────────────────────────────
function updateMobileBar() {
  const bar    = document.getElementById('mobileCartBar')
  const count  = document.getElementById('mobileCartCount')
  const titles = document.getElementById('mobileCartTitles')
  const btn    = document.getElementById('mobileCartBtn')
  if (!bar) return

  count.textContent = selectedBooks.length

  if (selectedBooks.length === 0) {
    bar.classList.remove('visible')
    btn.disabled = true
    return
  }

  bar.classList.add('visible')
  btn.disabled = false

  // Renderizar slots: número + título (siempre) + autor (solo desktop via CSS)
  titles.innerHTML = selectedBooks.map((book, i) => `
    <div class="mobile-slot">
      <div class="mobile-slot-num">${i + 1}</div>
      <div class="mobile-slot-text">
        <span>${book.title}</span><span class="mobile-slot-author">${book.author}</span>
      </div>
    </div>
  `).join('')
}

// ── Modal ────────────────────────────────────────────────────────────────────
function openModal(book) {
  let modal = document.getElementById("book-modal")

  if (!modal) {
    modal = document.createElement("div")
    modal.id = "book-modal"
    modal.className = "modal"
    document.body.appendChild(modal)
  }

  const images = [book.image, book.image2 || book.image, book.image3 || book.image]

  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close">&times;</button>
      <div class="modal-main-image">
        <img id="main-image" src="${images[0]}" alt="${book.title}">
      </div>
      <div class="modal-thumbnails">
        ${images.map((img, i) => `
          <img src="${img}" class="modal-thumbnail ${i === 0 ? 'active' : ''}" data-index="${i}" alt="Imagen ${i + 1}">
        `).join('')}
      </div>
      <div class="modal-info">
        <h2>${book.title}</h2>
        <p><strong>Autor/a:</strong> <span class="value">${book.author}</span></p>
        <p><strong>Editorial:</strong> <span class="value">${book.publisher}</span></p>
        <p><strong>Categoría:</strong> <span class="value">${book.category}</span></p>
        <p><strong>Páginas:</strong> <span class="value">${book.pages}</span></p>
        <p><strong>Idioma:</strong> <span class="value">${book.language}</span></p>
        <p><strong>Idioma original:</strong> <span class="value">${book.languageOriginal}</span></p>
        ${book.synopsis ? `<p><strong>Sinopsis:</strong> <span class="value">${book.synopsis}</span></p>` : ''}
        <p><strong>Disponibilidad:</strong> <span class="value">${book.available ? 'Disponible' : 'En préstamo'}</span></p>
      </div>
    </div>
  `

  modal.classList.add("active")

  modal.querySelector(".modal-close").addEventListener("click", () => modal.classList.remove("active"))
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("active") })

  const thumbnails = modal.querySelectorAll(".modal-thumbnail")
  const mainImage  = modal.querySelector("#main-image")
  thumbnails.forEach(thumb => {
    thumb.addEventListener("click", () => {
      mainImage.src = images[thumb.dataset.index]
      thumbnails.forEach(t => t.classList.remove("active"))
      thumb.classList.add("active")
    })
  })
}