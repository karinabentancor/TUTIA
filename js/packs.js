let allPacks = []
let selectedPack = null
let isSpinning = false

document.addEventListener('DOMContentLoaded', () => {
  const spinBtn = document.getElementById('spin')
  const resultDiv = document.getElementById('result')
  const actionsDiv = document.getElementById('actions')
  const selectBtn = document.getElementById('select')
  const retryBtn = document.getElementById('retry')

  fetch('./packs2.json')
    .then(r => r.json())
    .then(data => {
      allPacks = data.filter(pack => pack.books && pack.books.length === 2)
      renderPacks(allPacks)
      createRoulette(allPacks)
    })
    .catch(error => {
      console.error('Error cargando packs:', error)
      resultDiv.innerHTML = '<p style="color: rgba(255,43,43,1); text-align: center;">Error al cargar los packs</p>'
    })

  spinBtn.addEventListener('click', () => {
    if (allPacks.length === 0) {
      resultDiv.innerHTML = '<p style="color: rgba(255,43,43,1); text-align: center;">No hay packs disponibles</p>'
      return
    }

    if (isSpinning) return

    spinRoulette()
  })

  selectBtn.addEventListener('click', () => {
    if (selectedPack) {
      console.log('Pack seleccionado:', selectedPack)
      alert(`Has seleccionado: ${selectedPack.name || 'Pack aleatorio'}`)
    }
  })

  retryBtn.addEventListener('click', () => {
    selectedPack = null
    actionsDiv.classList.remove('active')
    spinBtn.style.display = 'block'
    
    createRoulette(allPacks)
  })
})

function createRoulette(packs) {
  const resultDiv = document.getElementById('result')
  
  const rouletteHTML = `
    <div class="roulette-wheel-container">
      <div class="roulette-pointer"></div>
      <canvas id="roulette-wheel" width="300" height="300"></canvas>
    </div>
  `
  
  resultDiv.innerHTML = rouletteHTML
  
  drawRoulette(packs)
}

function drawRoulette(packs) {
  const canvas = document.getElementById('roulette-wheel')
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const radius = 140
  
  const numSegments = packs.length
  const anglePerSegment = (2 * Math.PI) / numSegments
  
  const colors = ['#000000', '#ffffff', '#ff2b2b']
  
  packs.forEach((pack, index) => {
    const startAngle = index * anglePerSegment - Math.PI / 2
    const endAngle = startAngle + anglePerSegment
    
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, startAngle, endAngle)
    ctx.closePath()
    ctx.fillStyle = colors[index % colors.length]
    ctx.fill()
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 2
    ctx.stroke()
    
    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate(startAngle + anglePerSegment / 2)
    ctx.textAlign = 'center'
    ctx.fillStyle = colors[index % colors.length] === '#ffffff' ? '#000' : '#fff'
    ctx.font = 'bold 16px monospace'
    ctx.fillText(`${index + 1}`, radius * 0.7, 5)
    ctx.restore()
  })
  
  ctx.beginPath()
  ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI)
  ctx.fillStyle = '#ff2b2b'
  ctx.fill()
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 3
  ctx.stroke()
}

function spinRoulette() {
  isSpinning = true
  const wheel = document.getElementById('roulette-wheel')
  const spinBtn = document.getElementById('spin')
  const resultDiv = document.getElementById('result')
  const actionsDiv = document.getElementById('actions')
  
  const randomIndex = Math.floor(Math.random() * allPacks.length)
  selectedPack = allPacks[randomIndex]
  
  const numSegments = allPacks.length
  const degreesPerSegment = 360 / numSegments
  const targetRotation = (randomIndex * degreesPerSegment) + (degreesPerSegment / 2)
  
  const extraSpins = (Math.floor(Math.random() * 4) + 5) * 360
  const totalRotation = extraSpins + (360 - targetRotation)
  
  wheel.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)'
  wheel.style.transform = `rotate(${totalRotation}deg)`
  
  setTimeout(() => {
    const packNameDiv = document.createElement('div')
    packNameDiv.className = 'pack-name-reveal'
    packNameDiv.textContent = selectedPack.name
    resultDiv.appendChild(packNameDiv)
  }, 2800)
  
  setTimeout(() => {
    isSpinning = false
    
    const resultHTML = selectedPack.books.map(book => `
      <div class="book-info">
        <strong>${book.title}</strong>
        <p><strong>Autor/a:</strong> ${book.author}</p>
        <p><strong>Editorial:</strong> ${book.publisher}</p>
      </div>
    `).join('')
    
    resultDiv.innerHTML = `
      <div class="roulette-wheel-container">
        <div class="roulette-pointer"></div>
        <canvas id="roulette-wheel" width="300" height="300"></canvas>
      </div>
      <h3 class="selected-pack-title">${selectedPack.name}</h3>
      ${resultHTML}
    `
    
    drawRoulette(allPacks)
    const finalWheel = document.getElementById('roulette-wheel')
    finalWheel.style.transform = `rotate(${totalRotation}deg)`
    finalWheel.style.transition = 'none'
    
    spinBtn.style.display = 'block'
    actionsDiv.classList.add('active')
  }, 4000)
}

function renderPacks(packs) {
  const packs2Container = document.getElementById('packs-2')

  if (packs.length > 0) {
    packs2Container.innerHTML = packs.map(pack => createPackCard(pack)).join('')
  } else {
    packs2Container.innerHTML = '<p style="text-align: center; color: #666;">No hay packs de 2 libros disponibles</p>'
  }

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