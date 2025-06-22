document.addEventListener('DOMContentLoaded', () => {
    let packs = []
    const spinBtn = document.getElementById('spin')
    const resultDiv = document.getElementById('result')

    fetch('./packs2.json')
        .then(r => r.json())
        .then(data => {
            packs = data
        })
        .catch(() => {
            resultDiv.textContent = 'Error cargando packs'
        })

    spinBtn.addEventListener('click', () => {
        if (packs.length === 0) {
            resultDiv.textContent = 'No hay packs disponibles'
            return
        }

        const randomIndex = Math.floor(Math.random() * packs.length)
        const selectedPack = packs[randomIndex]

        resultDiv.innerHTML = selectedPack.books.map(book => `
            <div style="margin-bottom: 1rem; padding: 1rem; border: 1px solid #ccc;">
                <strong>${book.title}</strong><br>
                ${book.author}<br>
                ${book.publisher}
            </div>
        `).join('')
    })
})