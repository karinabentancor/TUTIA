let allBooksData = []
let currentBooks = []
let showOnlyAvailable = false
const aside = document.querySelector("aside.right-aside")
let listContainer = document.createElement("ul")
listContainer.className = "selected-list"
aside.appendChild(listContainer)
document.addEventListener("DOMContentLoaded", () => {
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
    infoP.textContent = "Nos encanta que seas parte del club"
    const tituloClub = aside.querySelectorAll("p")[0]
    tituloClub.insertAdjacentElement("afterend", pNombre)
  }
  fetch("books.json")
    .then(response => response.json())
    .then(data => {
      allBooksData = data
      populateEditorials(data)
      applyFilters()
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
function applyFilters() {
  const query = document.getElementById("search").value.toLowerCase()
  const editorial = document.getElementById("editorial").value
  currentBooks = allBooksData.filter(book => {
    const matchesSearch =
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query)
    const matchesEditorial =
      editorial === "all" || book.publisher === editorial
    const matchesAvailability =
      !showOnlyAvailable || book.available
    return matchesSearch && matchesEditorial && matchesAvailability
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

    const h3 = document.createElement("h3")
    h3.textContent = book.title

    const pAuthor = document.createElement("p")
    pAuthor.innerHTML = `<strong>Autor/a</strong> ${book.author}`

    const pPublisher = document.createElement("p")
    pPublisher.innerHTML = `<strong>Editorial</strong> ${book.publisher}`

    const pCategory = document.createElement("p")
    pCategory.innerHTML = `<strong>Categoría</strong> ${book.category}`

    const pPages = document.createElement("p")
    pPages.innerHTML = `<strong>Páginas</strong> ${book.pages}`

    const pLang = document.createElement("p")
    pLang.innerHTML = `<strong>Idioma</strong> ${book.language}`

    const pOrigLang = document.createElement("p")
    pOrigLang.innerHTML = `<strong>Idioma original </strong> ${book.languageOriginal}`

    if (!book.available) {
      const pUnavailable = document.createElement("p")
      pUnavailable.className = "out-of-stock"
      pUnavailable.textContent = "Libro en préstamo"
      bookDiv.appendChild(pUnavailable)
    }

    const iconWrapper = document.createElement("div")
    iconWrapper.className = "icon-bottom-right"

    const button = document.createElement("button")
    button.type = "button"
    button.className = "select-btn"
    button.setAttribute("aria-label", "Seleccionar libro")

    const icon = document.createElement("img")
    icon.src = "svg/arrow-through-heart.svg"
    icon.alt = ""

    button.appendChild(icon)
    iconWrapper.appendChild(button)

    bookDiv.append(img, h3, pAuthor, pPublisher, pCategory, pPages, pLang, pOrigLang, iconWrapper)
    container.appendChild(bookDiv)
  })
  attachSelectionHandler()
}

document.getElementById("search").addEventListener("input", applyFilters)
document.getElementById("editorial").addEventListener("change", applyFilters)
document.getElementById("sort-title").addEventListener("click", () => {
  currentBooks.sort((a, b) => a.title.localeCompare(b.title))
  renderBooks(currentBooks)
})
document.getElementById("sort-author").addEventListener("click", () => {
  currentBooks.sort((a, b) => a.author.localeCompare(b.author))
  renderBooks(currentBooks)
})
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
const selectedBooks = []
function attachSelectionHandler() {
  const container = document.getElementById("catalog")
  container.removeEventListener("click", handleBookSelection)
  container.addEventListener("click", handleBookSelection)
}

function handleBookSelection(e) {
  const btn = e.target.closest(".select-btn")
  if (!btn) return
  const bookDiv = btn.closest(".book")
  if (bookDiv.classList.contains("not-available")) return
  const id = bookDiv.dataset.id
  const title = bookDiv.querySelector("h3").textContent
  const author = bookDiv.querySelector("p strong").parentNode.textContent.replace("Autor/a: ", "")
  const idx = selectedBooks.findIndex(b => b.id === id)
  if (idx === -1) {
    if (selectedBooks.length >= 3) return alert("Solo puedes seleccionar hasta 3 libros.")
    selectedBooks.push({ id, title, author })
    btn.classList.add("selected")
  } else {
    selectedBooks.splice(idx, 1)
    btn.classList.remove("selected")
  }
  updateAsideList()
}
function updateAsideList() {
  listContainer.innerHTML = ""
  if (!selectedBooks.length) {
    listContainer.innerHTML = "<li class='empty'>No hay libros seleccionados</li>"
    return
  }
  selectedBooks.forEach(b => {
    const li = document.createElement("li")
    li.dataset.id = b.id
    li.innerHTML = `
      ${b.title} — ${b.author}
      <img 
        src="svg/trash.svg" 
        class="aside-heart remove-btn" 
        alt="Quitar"
        title="Quitar de la selección"
      />
    `
    listContainer.appendChild(li)
  })
}
listContainer.addEventListener("click", e => {
  const removeBtn = e.target.closest(".remove-btn")
  if (!removeBtn) return
  const li = removeBtn.closest("li")
  const id = li.dataset.id
  const bookDiv = document.querySelector(`.book[data-id="${id}"]`)
  const selectBtn = bookDiv.querySelector(".select-btn")
  selectBtn.click()
})