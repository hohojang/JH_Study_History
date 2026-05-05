let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let solutionsVisible = false;

function startStudy(category) {
    currentQuestions = historyData.filter(q => q.category === category);
    currentIndex = 0;
    score = 0;
    solutionsVisible = false;
    document.getElementById('score-count').innerText = score;
    document.getElementById('progress-count').innerText = 0;
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
