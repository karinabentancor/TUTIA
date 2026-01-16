let allPacks = []
let selectedPack = null

document.addEventListener('DOMContentLoaded', () => {
  const spinBtn = document.getElementById('spin')
  const resultDiv = document.getElementById('result')
  const actionsDiv = document.getElementById('actions')
  const selectBtn = document.getElementById('select')
  const retryBtn = document.getElementById('retry')

  // Cargar packs desde JSON
  fetch('./packs2.json')
    .then(r => r.json())
    .then(data => {
      allPacks = data
      renderPacks(data)
    })
    .catch(error => {
      console.error('Error cargando packs:', error)
      resultDiv.innerHTML = '<p style="color: rgba(255,43,43,1); text-align: center;">Error al cargar los packs</p>'
    })

  // Girar ruleta
  spinBtn.addEventListener('click', () => {
    if (allPacks.length === 0) {
      resultDiv.innerHTML = '<p style="color: rgba(255,43,43,1); text-align: center;">No hay packs disponibles</p>'
      return
    }

    const randomIndex = Math.floor(Math.random() * allPacks.length)
    selectedPack = allPacks[randomIndex]

    resultDiv.innerHTML = selectedPack.books.map(book => `
      <div class="book-info">
        <strong>${book.title}</strong>
        <p><strong>Autor/a:</strong> ${book.author}</p>
        <p><strong>Editorial:</strong> ${book.publisher}</p>
      </div>
    `).join('')

    spinBtn.style.display = 'none'
    actionsDiv.classList.add('active')
  })

  // Seleccionar pack
  selectBtn.addEventListener('click', () => {
    if (selectedPack) {
      console.log('Pack seleccionado:', selectedPack)
      // Aquí puedes agregar lógica para guardar la selección
      alert(`Has seleccionado: ${selectedPack.name || 'Pack aleatorio'}`)
    }
  })

  // Volver a girar
  retryBtn.addEventListener('click', () => {
    resultDiv.innerHTML = ''
    actionsDiv.classList.remove('active')
    spinBtn.style.display = 'block'
    selectedPack = null
  })
})

function renderPacks(packs) {
  const packs2Container = document.getElementById('packs-2')
  const packs3Container = document.getElementById('packs-3')

  // Filtrar packs por cantidad de libros
  const packsOf2 = packs.filter(pack => pack.books && pack.books.length === 2)
  const packsOf3 = packs.filter(pack => pack.books && pack.books.length === 3)

  // Renderizar packs de 2 libros
  if (packsOf2.length > 0) {
    packs2Container.innerHTML = packsOf2.map(pack => createPackCard(pack)).join('')
  } else {
    packs2Container.innerHTML = '<p style="text-align: center; color: #666;">No hay packs de 2 libros disponibles</p>'
  }

  // Renderizar packs de 3 libros
  if (packsOf3.length > 0) {
    packs3Container.innerHTML = packsOf3.map(pack => createPackCard(pack)).join('')
  } else {
    packs3Container.innerHTML = '<p style="text-align: center; color: #666;">No hay packs de 3 libros disponibles</p>'
  }

  // Agregar event listeners a los botones
  attachPackButtonHandlers()
}

function createPackCard(pack) {
  const packName = pack.name || 'Pack sin nombre'
  const packImage = pack.image || ''

  return `
    <div class="pack-card" data-pack-id="${pack.id || ''}">
      <div class="pack-image">
        ${packImage ? `<img src="${packImage}" alt="${packName}">` : 'Imagen Pack'}
      </div>
      <div class="pack-info">
        <div class="pack-name">${packName}</div>
        <button class="pack-button" data-pack-id="${pack.id || ''}">
          <img src="svg/arrow-through-heart.svg" alt="Seleccionar">
        </button>
      </div>
    </div>
  `
}

function attachPackButtonHandlers() {
  const packButtons = document.querySelectorAll('.pack-button')

  packButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation()
      const packId = button.dataset.packId
      const pack = allPacks.find(p => p.id == packId)

      if (pack) {
        handlePackSelection(pack)
      }
    })
  })

  // Click en toda la card para ver detalles
  const packCards = document.querySelectorAll('.pack-card')
  packCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.pack-button')) return

      const packId = card.dataset.packId
      const pack = allPacks.find(p => p.id == packId)

      if (pack) {
        showPackDetails(pack)
      }
    })
  })
}

function handlePackSelection(pack) {
  console.log('Pack seleccionado:', pack)
  alert(`Has seleccionado: ${pack.name || 'Pack'}`)
  
}

function showPackDetails(pack) {
  const details = pack.books.map(book => 
    `• ${book.title} - ${book.author}`
  ).join('\n')

  alert(`${pack.name || 'Pack'}\n\nLibros incluidos:\n${details}`)
}