let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let solutionsVisible = false;
let currentMode = 'quiz';

function switchMode(mode, event) {
    currentMode = mode;
    const quizMode = document.getElementById('quiz-mode');
    const studyMode = document.getElementById('study-mode');
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => btn.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    if (mode === 'quiz') {
        quizMode.style.display = 'block';
        studyMode.style.display = 'none';
        document.getElementById('quiz-container').innerHTML = `
            <div class="welcome-msg">
                학습할 범위를 선택하여 문제를 풀어보세요! <br>
            </div>
        `;
    } else if (mode === 'study') {
        quizMode.style.display = 'none';
        studyMode.style.display = 'block';
        document.getElementById('quiz-container').innerHTML = '';
    }
}

function openStudyMap(period) {
    const container = document.getElementById('quiz-container');
    
    // 선택한 시대의 지도와 지역 정보 표시
    let mapHtml = '';
    let regionsData = {};
    
    if (period === '삼국시대') {
        regionsData = studyData['삼국시대'];
        mapHtml = generateThreeKingdomsMap();
    } else if (period === '통일신라·발해') {
        regionsData = studyData['통일신라·발해'];
        mapHtml = generateUnifiedSillaMap();
    } else if (period === '고려') {
        regionsData = studyData['고려'];
        mapHtml = generateGoryeoMap();
    } else if (period === '조선') {
        regionsData = studyData['조선'];
        mapHtml = generateJoseonMap();
    } else if (period === '근현대사') {
        regionsData = studyData['근현대사'];
        mapHtml = generateModernHistoryMap();
    } else {
        regionsData = {};
        mapHtml = `<div class="study-error">선택한 학습 주제를 찾을 수 없습니다.</div>`;
    }
    
    container.innerHTML = `
        <div class="study-container">
            <div class="study-header">
                <h2>${period} 학습</h2>
                <button onclick="switchMode('study')" class="back-btn">← 돌아가기</button>
            </div>
            <div class="study-content">
                <div class="map-section">
                    ${mapHtml}
                </div>
                <div id="detail-panel" class="detail-panel">
                    <div class="detail-placeholder">지역을 선택하면 상세 정보가 표시됩니다</div>
                </div>
            </div>
        </div>
    `;
    
    // 지역별 클릭 이벤트 등록
    for (const region in regionsData) {
        const element = document.getElementById(`region-${region}`);
        if (element) {
            element.addEventListener('click', () => showRegionDetails(region, regionsData[region]));
        }
    }
}

function generateThreeKingdomsMap() {
    return `
        <div class="map-wrapper">
            <img src="images/maps/three-kingdoms.jpg" alt="삼국시대" class="map-image" onerror="this.src='https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Three_Kingdoms_of_Korea_%283rd_century-AD%29.png/600px-Three_Kingdoms_of_Korea_%283rd_century-AD%29.png'">
            <svg class="map-overlay" viewBox="0 0 600 800">
                <!-- 고구려 클릭 영역 -->
                <path id="region-고구려" d="M 150 80 L 550 120 L 580 380 L 280 450 L 200 350 Z" 
                      class="map-region" data-region="고구려"/>
                
                <!-- 백제 클릭 영역 -->
                <path id="region-백제" d="M 150 380 L 250 350 L 320 500 L 220 650 L 100 550 Z" 
                      class="map-region" data-region="백제"/>
                
                <!-- 신라 클릭 영역 -->
                <path id="region-신라" d="M 300 450 L 550 380 L 600 700 L 450 750 L 280 650 Z" 
                      class="map-region" data-region="신라"/>
            </svg>
        </div>
    `;
}

function generateUnifiedSillaMap() {
    return `
        <div class="map-wrapper">
            <img src="images/maps/unified-silla.jpg" alt="통일신라" class="map-image" onerror="this.src='https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Map_of_Later_Silla.png/600px-Map_of_Later_Silla.png'">
            <svg class="map-overlay" viewBox="0 0 600 800">
                <!-- 신라 클릭 영역 -->
                <path id="region-신라" d="M 100 100 L 550 80 L 580 750 L 80 780 Z" 
                      class="map-region" data-region="신라"/>
                
                <!-- 발해 클릭 영역 -->
                <path id="region-발해" d="M 150 50 L 450 30 L 480 200 L 200 220 Z" 
                      class="map-region" data-region="발해"/>
            </svg>
        </div>
    `;
}

function generateGoryeoMap() {
    return `
        <div class="map-wrapper">
            <img src="images/maps/goryeo.jpg" alt="고려" class="map-image" onerror="this.src='https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Goryeo_1392.png/600px-Goryeo_1392.png'">
            <svg class="map-overlay" viewBox="0 0 600 800">
                <!-- 시기별 구분 영역 -->
                <rect id="region-전기" x="50" y="80" width="500" height="120" 
                      class="map-region" data-region="전기"/>
                <rect id="region-중기" x="50" y="210" width="500" height="140" 
                      class="map-region" data-region="중기"/>
                <rect id="region-무신정권" x="50" y="360" width="500" height="140" 
                      class="map-region" data-region="무신정권"/>
                <rect id="region-말기" x="50" y="510" width="500" height="200" 
                      class="map-region" data-region="말기"/>
            </svg>
        </div>
    `;
}

function generateJoseonMap() {
    return `
        <div class="map-wrapper">
            <img src="images/maps/joseon.jpg" alt="조선" class="map-image" onerror="this.src='https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Joseon_1392.png/600px-Joseon_1392.png'">
            <svg class="map-overlay" viewBox="0 0 600 800">
                <!-- 시기별 구분 영역 -->
                <rect id="region-건국~세종" x="50" y="50" width="500" height="130" 
                      class="map-region" data-region="건국~세종"/>
                <rect id="region-세조~성종" x="50" y="190" width="500" height="130" 
                      class="map-region" data-region="세조~성종"/>
                <rect id="region-중종~선조" x="50" y="330" width="500" height="130" 
                      class="map-region" data-region="중종~선조"/>
                <rect id="region-17세기" x="50" y="470" width="500" height="130" 
                      class="map-region" data-region="17세기"/>
            </svg>
        </div>
    `;
}

function generateModernHistoryMap() {
    return `
        <div class="map-wrapper">
            <img src="images/maps/modern-history.jpg" alt="근현대사" class="map-image" onerror="this.src='https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Korea_1890s.png/600px-Korea_1890s.png'">
            <svg class="map-overlay" viewBox="0 0 600 800">
                <!-- 시기별 구분 영역 -->
                <rect id="region-개항기" x="50" y="50" width="500" height="130" 
                      class="map-region" data-region="개항기"/>
                <rect id="region-일제강점기" x="50" y="190" width="500" height="130" 
                      class="map-region" data-region="일제강점기"/>
                <rect id="region-해방후~현대" x="50" y="330" width="500" height="130" 
                      class="map-region" data-region="해방후~현대"/>
                <rect id="region-민주화운동" x="50" y="470" width="500" height="130" 
                      class="map-region" data-region="민주화운동"/>
            </svg>
        </div>
    `;
}

function showRegionDetails(region, data) {
    const panel = document.getElementById('detail-panel');
    
    let detailHtml = `<div class="detail-content">
        <h3>🗺️ ${region}</h3>
        
        <div class="detail-section">
            <h4>⏰ 왕 및 시기</h4>
            <p>${data['왕 및 시기'] || '정보 없음'}</p>
        </div>`;
    
    if (data['주요인물'] && data['주요인물'].length > 0) {
        detailHtml += `<div class="detail-section">
            <h4>👑 주요인물</h4>
            <ul>${data['주요인물'].map(p => `<li>${p}</li>`).join('')}</ul>
        </div>`;
    }
    
    if (data['주요 업적'] && data['주요 업적'].length > 0) {
        detailHtml += `<div class="detail-section">
            <h4>🏆 주요 업적</h4>
            <ul>${data['주요 업적'].map(a => `<li>${a}</li>`).join('')}</ul>
        </div>`;
    }
    
    if (data['경제']) {
        detailHtml += `<div class="detail-section">
            <h4>💰 경제</h4>
            <p>${Array.isArray(data['경제']) ? data['경제'].join(', ') : data['경제']}</p>
        </div>`;
    }
    
    if (data['사회']) {
        detailHtml += `<div class="detail-section">
            <h4>🏛 사회</h4>
            <p>${Array.isArray(data['사회']) ? data['사회'].join(', ') : data['사회']}</p>
        </div>`;
    }
    
    if (data['문화']) {
        detailHtml += `<div class="detail-section">
            <h4>🎨 문화</h4>
            <p>${Array.isArray(data['문화']) ? data['문화'].join(', ') : data['문화']}</p>
        </div>`;
    }
    
    if (data['종교']) {
        detailHtml += `<div class="detail-section">
            <h4>⛩ 종교</h4>
            <p>${Array.isArray(data['종교']) ? data['종교'].join(', ') : data['종교']}</p>
        </div>`;
    }
    
    // 유물 섹션 추가
    if (data['유물'] && data['유물'].length > 0) {
        detailHtml += `<div class="detail-section artifacts-section">
            <h4>🏺 유물 및 자료</h4>
            <div class="artifacts-container">`;
        
        data['유물'].forEach(artifact => {
            detailHtml += `<div class="artifact-item">
                <div class="artifact-image">
                    <img src="${artifact.img}" alt="${artifact.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23ddd%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23333%22 font-size=%2214%22%3E${artifact.name}%3C/text%3E%3C/svg%3E'">
                </div>
                <div class="artifact-info">
                    <p class="artifact-name"><strong>${artifact.name}</strong></p>
                    <p class="artifact-desc">${artifact.desc}</p>
                </div>
            </div>`;
        });
        
        detailHtml += `</div></div>`;
    }
    
    detailHtml += '</div>';
    panel.innerHTML = detailHtml;
    panel.scrollTop = 0;
}

function startStudy(category) {
    currentQuestions = historyData.filter(item => item.category === category);
    currentIndex = 0;
    score = 0;
    solutionsVisible = false;
    document.getElementById('score-count').innerText = score;
    document.getElementById('progress-count').innerText = 0;
    document.getElementById('progress-total').innerText = currentQuestions.length;

    if (!currentQuestions.length) {
        document.getElementById('quiz-container').innerHTML = `
            <div class="quiz-card" style="text-align:center;">
                <h2>문제가 없습니다.</h2>
                <p>선택한 범위에 해당하는 문제가 없습니다. 다른 학습 범위를 시도해 보세요.</p>
            </div>`;
        return;
    }

    renderQuiz();
}

function renderQuiz() {
    const container = document.getElementById('quiz-container');
    if (currentIndex >= currentQuestions.length) {
        container.innerHTML = `
            <div class="quiz-card" style="text-align:center;">
                <h2>문제 풀이 종료!</h2>
                <p style="font-size: 1.5rem;">최종 점수: <span style="color:var(--accent)">${score}/${currentQuestions.length}</span></p>
                <button class="opt-btn" style="text-align:center; display:inline-block;" onclick="location.reload()">처음으로 돌아가기</button>
            </div>`;
        return;
    }

    const q = currentQuestions[currentIndex];
    container.innerHTML = `
        <div class="quiz-card">
            <span style="color: var(--accent); font-weight:bold;">[${q.era}]</span>
            <p class="question">${q.question}</p>
            <div class="options-grid">
                ${q.options.map((opt, i) => `
                    <button class="opt-btn" onclick="checkAnswer(${i+1})">${opt}</button>
                `).join('')}
            </div>
            <div class="action-area">
                <div id="result-msg" class="result-msg" style="display:none;"></div>
                <div class="button-group">
                    <button class="btn-hint" onclick="toggleHint()">🔍 힌트 보기</button>
                    <button class="btn-solution" onclick="toggleSolutions()">📖 정답/풀이 보기</button>
                </div>
                <div id="hint-box" class="hint-box">${q.hint}</div>
                <div id="solution-panel" class="solution-panel" style="display: ${solutionsVisible ? 'block' : 'none'};">
                    ${renderSolutionsHtml()}
                </div>
            </div>
        </div>
    `;
    document.getElementById('progress-count').innerText = currentIndex + 1;
}

function checkAnswer(choice) {
    const q = currentQuestions[currentIndex];
    const msg = document.getElementById('result-msg');
    msg.style.display = "block";
    
    if (choice.toString() === q.answer) {
        msg.style.backgroundColor = "var(--correct)";
        msg.innerText = "정답입니다! 다음 문제로 넘어갑니다.";
        score++;
        document.getElementById('score-count').innerText = score;
        setTimeout(() => {
            currentIndex++;
            renderQuiz();
        }, 1200);
    } else {
        msg.style.backgroundColor = "var(--wrong)";
        msg.innerText = "오답입니다. 힌트를 확인해보십시오.";
    }
}

function toggleHint() {
    const hb = document.getElementById('hint-box');
    hb.style.display = hb.style.display === 'block' ? 'none' : 'block';
}

function toggleSolutions() {
    solutionsVisible = !solutionsVisible;
    const panel = document.getElementById('solution-panel');
    if (panel) {
        panel.style.display = solutionsVisible ? 'block' : 'none';
    }
}

function renderSolutionsHtml() {
    if (!currentQuestions.length) return '<p>문제가 없습니다.</p>';

    return currentQuestions.map((q, i) => {
        const answerIndex = parseInt(q.answer, 10) - 1;
        const answerText = q.options[answerIndex] ? q.options[answerIndex].replace(/^\d\.\s*/, '') : '정답 정보 없음';
        return `
            <div class="solution-item">
                <p class="solution-title">[${i + 1}] ${q.question}</p>
                <p class="solution-answer">정답: ${q.answer}. ${answerText}</p>
                <p class="solution-explanation">풀이: ${q.hint}</p>
            </div>
        `;
    }).join('');
}
