let allBooksData = []
let currentBooks = []
let showOnlyAvailable = false
const aside = document.querySelector("aside.right-aside")
let listContainer = null
let selectedBooks = []

function loadSavedSelection() {
  const savedSelection = localStorage.getItem('selectedBooks')
  if (savedSelection) {
    try {
      selectedBooks = JSON.parse(savedSelection)
    } catch (error) {
      console.error('Error al cargar selección guardada:', error)
      selectedBooks = []
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadSavedSelection()
  
  listContainer = aside.querySelector('.selected-list')
  
  const storedUser = localStorage.getItem("clubUser")
  if (storedUser) {
    const btn = aside.querySelector("button.button-wht")
    if (btn) btn.remove()
    
    const pNombre = document.createElement("p")
    pNombre.className = "welcome-user"
    pNombre.textContent = `${storedUser.toUpperCase()}`
    pNombre.style.cursor = "pointer"
    pNombre.title = "Ver perfil"
    pNombre.addEventListener("click", () => {
      window.location.href = "profile.html"
    })

    const infoP = aside.querySelectorAll("p")[1]
    if (infoP) infoP.textContent = "Nos encanta que seas parte del club"
    const tituloClub = aside.querySelectorAll("p")[0]
    if (tituloClub) tituloClub.insertAdjacentElement("afterend", pNombre)
  }
  
  fetch("books.json")
    .then(response => response.json())
    .then(data => {
      allBooksData = data
      populateEditorials(data)
      populateCategories(data)
      applyFilters()
      updateAsideList()
    })
    .catch(error => console.error("Error loading books:", error))
})

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
    const matchesEditorial =
      editorial === "all" || book.publisher === editorial
    const matchesCategory =
      category === "all" || book.category === category
    const matchesAvailability =
      !showOnlyAvailable || book.available
    return matchesSearch && matchesEditorial && matchesCategory && matchesAvailability
  })
  renderBooks(currentBooks)
}

function renderBooks(books) {
  const container = document.getElementById("catalog")
  container.innerHTML = ""
  books.forEach(book => {
    const bookDiv = document.createElement("div")
    bookDiv.className = `book ${book.available ? "" : "not-available"}`
    bookDiv.dataset.id = book.id

    const img = document.createElement("img")
    img.src = book.image
    img.alt = book.title

    const bookContent = document.createElement("div")
    bookContent.className = "book-content"

    const h3 = document.createElement("h3")
    h3.textContent = book.title

    const pAuthor = document.createElement("p")
    pAuthor.innerHTML = `<span class="value">${book.author}</span>`

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
    button.className = "pack-button"
    button.setAttribute("aria-label", "Seleccionar libro")

    const isSelected = selectedBooks.some(selectedBook => selectedBook.id == book.id)
    if (isSelected) {
      button.classList.add("selected")
    }

    const icon = document.createElement("img")
    icon.src = "svg/c cuadr.svg"
    icon.alt = ""

    button.appendChild(icon)
    
    button.addEventListener("click", (e) => {
      e.stopPropagation()
      handleBookSelection(book, button)
    })
    
    bookFooter.appendChild(button)

    bookContent.append(h3, pAuthor, pPublisher, pCategory, pPages, pLang)
    bookDiv.append(img, bookContent, bookFooter)
    
    bookDiv.addEventListener("click", (e) => {
      if (!e.target.closest(".pack-button")) {
        openModal(book)
      }
    })
    
    container.appendChild(bookDiv)
  })
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

function handleBookSelection(book, button) {
  if (!book.available) {
    alert("Este libro no está disponible")
    return
  }
  
  const id = book.id
  const idx = selectedBooks.findIndex(b => b.id == id)
  
  if (idx === -1) {
    if (selectedBooks.length >= 3) {
      alert("Puedes seleccionar hasta 3 libros")
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
  } else {
    selectedBooks.splice(idx, 1)
    button.classList.remove("selected")
  }
  
  localStorage.setItem('selectedBooks', JSON.stringify(selectedBooks))
  updateAsideList()
}

function openModal(book) {
  let modal = document.getElementById("book-modal")
  
  if (!modal) {
    modal = document.createElement("div")
    modal.id = "book-modal"
    modal.className = "modal"
    document.body.appendChild(modal)
  }
  
  const images = [
    book.image,
    book.image2 || book.image,
    book.image3 || book.image
  ]
  
  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close">&times;</button>
      
      <div class="modal-main-image">
        <img id="main-image" src="${images[0]}" alt="${book.title}">
      </div>
      
      <div class="modal-thumbnails">
        ${images.map((img, index) => `
          <img src="${img}" 
               class="modal-thumbnail ${index === 0 ? 'active' : ''}" 
               data-index="${index}"
               alt="Imagen ${index + 1}">
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
  
  const closeBtn = modal.querySelector(".modal-close")
  closeBtn.addEventListener("click", () => {
    modal.classList.remove("active")
  })
  
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active")
    }
  })
  
  const thumbnails = modal.querySelectorAll(".modal-thumbnail")
  const mainImage = modal.querySelector("#main-image")
  
  thumbnails.forEach(thumb => {
    thumb.addEventListener("click", () => {
      const index = thumb.dataset.index
      mainImage.src = images[index]
      
      thumbnails.forEach(t => t.classList.remove("active"))
      thumb.classList.add("active")
    })
  })
}

function updateAsideList() {
  if (!listContainer) return
  
  listContainer.innerHTML = ""
  
  const existingButton = aside.querySelector('.finalize-selection-btn')
  if (existingButton) {
    existingButton.remove()
  }
  
  if (!selectedBooks.length) {
    listContainer.innerHTML = "<li class='empty'>No hay libros seleccionados</li>"
    return
  }
  
  selectedBooks.forEach(b => {
    const li = document.createElement("li")
    li.dataset.id = b.id
    li.innerHTML = `
      <div style="flex-grow: 1; padding-right: 20px;">
        <div style="font-weight: bold; margin-bottom: 2px;">${b.title}</div>
        <div style="font-size: 0.9em; opacity: 0.8;">${b.author}</div>
      </div>
      <img 
        src="svg/trash.svg" 
        class="remove-btn" 
        alt="Quitar"
        title="Quitar de la selección"
      />
    `
    listContainer.appendChild(li)
  })
  
  if (selectedBooks.length > 0) {
    const finalizeButton = document.createElement("button")
    finalizeButton.className = "button-wht finalize-selection-btn"
    finalizeButton.textContent = "FINALIZAR SELECCIÓN"
    
    finalizeButton.addEventListener("click", () => {
      console.log("Libros seleccionados:", selectedBooks)
      localStorage.setItem('selectedBooks', JSON.stringify(selectedBooks))
      window.location.href = 'selection.html'
    })
    
    const asideBottom = aside.querySelector('.aside-bottom')
    asideBottom.appendChild(finalizeButton)
  }
}

document.addEventListener("click", e => {
  const removeBtn = e.target.closest(".remove-btn")
  if (!removeBtn) return
  
  const li = removeBtn.closest("li")
  if (!li) return
  
  const id = li.dataset.id
  const bookDiv = document.querySelector(`.book[data-id="${id}"]`)
  
  const idx = selectedBooks.findIndex(b => b.id == id)
  if (idx !== -1) {
    selectedBooks.splice(idx, 1)
    localStorage.setItem('selectedBooks', JSON.stringify(selectedBooks))
    
    if (bookDiv) {
      const packBtn = bookDiv.querySelector(".pack-button")
      if (packBtn) {
        packBtn.classList.remove("selected")
      }
    }
    
    updateAsideList()
  }
})