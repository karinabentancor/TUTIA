let allBooksData = [];
let currentBooks = [];
let showOnlyAvailable = false;

document.addEventListener("DOMContentLoaded", () => {
  fetch("books.json")
    .then(response => response.json())
    .then(data => {
      allBooksData = data;
      populateEditorials(data);
      applyFilters();
    })
    .catch(error => console.error("Error loading books:", error));
});

function populateEditorials(data) {
  const select = document.getElementById("editorial");
  const editorials = Array.from(new Set(data.map(book => book.publisher))).sort();
  editorials.forEach(editorial => {
    const option = document.createElement("option");
    option.value = editorial;
    option.textContent = editorial;
    select.appendChild(option);
  });
}

function applyFilters() {
  const query = document.getElementById("search").value.toLowerCase();
  const editorial = document.getElementById("editorial").value;

  currentBooks = allBooksData.filter(book => {
    const matchesSearch =
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query);

    const matchesEditorial = editorial === "all" || book.publisher === editorial;

    const matchesAvailability = !showOnlyAvailable || book.available;

    return matchesSearch && matchesEditorial && matchesAvailability;
  });

  renderBooks(currentBooks);
}

function renderBooks(books) {
  const container = document.getElementById("catalog");
  container.innerHTML = "";

  books.forEach(book => {
    const status = book.available ? "" : "<p class='out-of-stock'>Libro en préstamo</p>";
    container.innerHTML += `
      <div class="book ${book.available ? "" : "not-available"}" data-id="${book.id}">
        <img src="${book.image}" alt="${book.title}">
        <h3>${book.title}</h3>
        <p><strong>Autor/a:</strong> ${book.author}</p>
        <p><strong>Editorial:</strong> ${book.publisher}</p>
        <p><strong>Páginas:</strong> ${book.pages}</p>
        <p><strong>Idioma:</strong> ${book.language}</p>
        <p><strong>Idioma original: </strong> ${book.languageOriginal}</p>
        ${status}
        <div class="icon-bottom-right">
          <button type="button" class="select-btn" aria-label="Seleccionar libro">
            <img src="svg/arrow-through-heart.svg" alt="" />
          </button>
        </div>
      </div>
    `;
  });

  attachSelectionHandler();
}


document.getElementById("search").addEventListener("input", applyFilters);
document.getElementById("editorial").addEventListener("change", applyFilters);

document.getElementById("sort-title").addEventListener("click", () => {
  currentBooks.sort((a, b) => a.title.localeCompare(b.title));
  renderBooks(currentBooks);
});

document.getElementById("sort-author").addEventListener("click", () => {
  currentBooks.sort((a, b) => a.author.localeCompare(b.author));
  renderBooks(currentBooks);
});

document.getElementById("all-books").addEventListener("click", () => {
  showOnlyAvailable = false;
  document.getElementById("all-books").classList.add("active");
  document.getElementById("available-books").classList.remove("active");
  applyFilters();
});

document.getElementById("available-books").addEventListener("click", () => {
  showOnlyAvailable = true;
  document.getElementById("available-books").classList.add("active");
  document.getElementById("all-books").classList.remove("active");
  applyFilters();
});

const selectedBooks = [];

const aside = document.querySelector("aside.right-aside");
let listContainer = document.createElement("ul");
listContainer.className = "selected-list";
aside.appendChild(listContainer);

function attachSelectionHandler() {
  const container = document.getElementById("catalog");
  container.replaceWith(container.cloneNode(true));
  const freshContainer = document.getElementById("catalog");

  freshContainer.addEventListener("click", e => {
    const btn = e.target.closest(".select-btn");
    if (!btn) return;

    const bookDiv = btn.closest(".book");

    // ← Aquí: si no está disponible, no hacemos nada
    if (bookDiv.classList.contains("not-available")) return;

    const id = bookDiv.dataset.id;
    const title = bookDiv.querySelector("h3").textContent;
    const author = bookDiv.querySelector("p strong").parentNode.textContent.replace("Autor/a: ", "");

    const idx = selectedBooks.findIndex(b => b.id === id);

    if (idx === -1) {
      if (selectedBooks.length >= 3) {
        return alert("Solo puedes seleccionar hasta 3 libros.");
      }
      selectedBooks.push({ id, title, author });
      btn.classList.add("selected");
    } else {
      selectedBooks.splice(idx, 1);
      btn.classList.remove("selected");
    }

    updateAsideList();
  });
}


function updateAsideList() {
  listContainer.innerHTML = "";
  if (!selectedBooks.length) {
    listContainer.innerHTML = "<li class='empty'>No hay libros seleccionados</li>";
    return;
  }
  selectedBooks.forEach(b => {
    const li = document.createElement("li");
    li.textContent = `${b.title} — ${b.author}`;
    listContainer.appendChild(li);
  });
}
