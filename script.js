function renderCards(filter = '전체') {
    const container = document.getElementById('history-container');
    container.innerHTML = ''; // 초기화

    const filteredData = filter === '전체' 
        ? historyData 
        : historyData.filter(item => item.era === filter);

    filteredData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'history-card';
        card.innerHTML = `
            <span class="era-tag">${item.era}</span>
            <h2>${item.title}</h2>
            <ul>
                ${item.keywords.map(k => `<li>${k}</li>`).join('')}
            </ul>
            <p class="mnemonic">💡 암호: ${item.mnemonic}</p>
        `;
        container.appendChild(card);
    });
}

function filterEra(era) {
    renderCards(era);
}

// 첫 로드 시 전체 보기
window.onload = () => renderCards('전체');