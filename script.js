const appState = {
  currentQuestions: [],
  currentIndex: 0,
  score: 0,
  solutionsVisible: false,
  currentMode: 'quiz',
  currentStudyRegions: null,
};

const scoreCount = document.getElementById('score-count');
const progressCount = document.getElementById('progress-count');
const progressTotal = document.getElementById('progress-total');
const quizContainer = document.getElementById('quiz-container');
const modeButtons = document.querySelectorAll('[data-mode]');
const quizModePanel = document.getElementById('quiz-mode');
const studyModePanel = document.getElementById('study-mode');

function updateStats() {
  scoreCount.textContent = appState.score;
  const currentProgress = appState.currentQuestions.length ? appState.currentIndex + 1 : 0;
  progressCount.textContent = Math.min(currentProgress, appState.currentQuestions.length);
  progressTotal.textContent = appState.currentQuestions.length;
}

function renderQuizIntro() {
  quizContainer.innerHTML = `
    <div class="welcome-card">
      <h2>학습할 범위를 선택하여 문제를 풀어보세요!</h2>
      <p>상단 탭에서 모드를 전환하고, 원하는 학습 범위를 선택하세요.</p>
    </div>`;
}

function switchMode(mode) {
  appState.currentMode = mode;
  modeButtons.forEach(button => button.classList.toggle('active', button.dataset.mode === mode));
  quizModePanel.classList.toggle('hidden', mode !== 'quiz');
  studyModePanel.classList.toggle('hidden', mode !== 'study');
  if (mode === 'quiz') {
    renderQuizIntro();
  } else {
    quizContainer.innerHTML = '';
  }
}

function startStudy(category) {
  appState.currentQuestions = historyData.filter(item => item.category === category);
  appState.currentIndex = 0;
  appState.score = 0;
  appState.solutionsVisible = false;
  appState.currentStudyRegions = null;

  updateStats();
  if (!appState.currentQuestions.length) {
    quizContainer.innerHTML = `
      <div class="quiz-card empty-state">
        <h2>문제가 없습니다.</h2>
        <p>선택한 범위에 해당하는 문제가 없습니다. 다른 범위를 선택해 주세요.</p>
      </div>`;
    return;
  }

  renderQuiz();
}

function renderQuiz() {
  const question = appState.currentQuestions[appState.currentIndex];

  if (!question) {
    quizContainer.innerHTML = `
      <div class="quiz-card empty-state">
        <h2>문제 풀이 종료!</h2>
        <p class="score-summary">최종 점수: <strong>${appState.score}/${appState.currentQuestions.length}</strong></p>
        <div class="button-group">
          <button type="button" class="secondary-btn" data-action="reset">처음으로 돌아가기</button>
        </div>
      </div>`;
    updateStats();
    return;
  }

  quizContainer.innerHTML = `
    <div class="quiz-card">
      <span class="question-badge">[${question.era}]</span>
      <p class="question">${question.question}</p>
      <div class="options-grid">
        ${question.options.map((option, index) => `<button type="button" class="opt-btn" data-choice="${index + 1}">${option}</button>`).join('')}
      </div>
      <div class="action-area">
        <div id="result-msg" class="result-msg hidden"></div>
        <div class="button-group">
          <button type="button" class="outline-btn" data-action="toggle-hint">🔍 힌트 보기</button>
          <button type="button" class="outline-btn" data-action="toggle-solution">📖 정답/풀이 보기</button>
        </div>
        <div id="hint-box" class="hint-box hidden">${question.hint}</div>
        <div id="solution-panel" class="solution-panel ${appState.solutionsVisible ? 'visible' : ''}">
          ${renderSolutionsHtml()}
        </div>
      </div>
    </div>`;

  updateStats();
}

function checkAnswer(choice) {
  const question = appState.currentQuestions[appState.currentIndex];
  const resultMsg = document.getElementById('result-msg');
  resultMsg.classList.remove('hidden');

  if (choice.toString() === question.answer) {
    resultMsg.style.backgroundColor = 'var(--correct)';
    resultMsg.innerText = '정답입니다! 다음 문제로 넘어갑니다.';
    appState.score += 1;
    appState.currentIndex += 1;
    updateStats();
    setTimeout(renderQuiz, 900);
  } else {
    resultMsg.style.backgroundColor = 'var(--wrong)';
    resultMsg.innerText = '오답입니다. 힌트를 확인해보세요.';
  }
}

function toggleHint() {
  const hintBox = document.getElementById('hint-box');
  hintBox.classList.toggle('hidden');
}

function toggleSolutions() {
  appState.solutionsVisible = !appState.solutionsVisible;
  const solutionPanel = document.getElementById('solution-panel');
  if (solutionPanel) {
    solutionPanel.classList.toggle('visible', appState.solutionsVisible);
  }
}

function renderSolutionsHtml() {
  if (!appState.currentQuestions.length) {
    return '<p>문제가 없습니다.</p>';
  }

  return appState.currentQuestions.map((item, index) => {
    const answerIndex = parseInt(item.answer, 10) - 1;
    const answerText = item.options[answerIndex] ? item.options[answerIndex].replace(/^\d\.\s*/, '') : '정답 정보 없음';
    return `
      <div class="solution-item">
        <p class="solution-title">[${index + 1}] ${item.question}</p>
        <p class="solution-answer">정답: ${item.answer}. ${answerText}</p>
        <p class="solution-explanation">풀이: ${item.hint}</p>
      </div>`;
  }).join('');
}

function buildStudyMapHtml(period) {
  const regions = studyData[period];
  if (!regions) {
    return `<div class="study-error">학습 데이터를 찾을 수 없습니다.</div>`;
  }

  const safePeriod = period.replace(/[\s·]/g, '').toLowerCase();
  const mapImagePath = `images/maps/${safePeriod}.jpg`;

  return `
    <div class="study-map">
      <div class="study-map-title">${period} 주요 학습 영역</div>
      <div class="map-wrapper">
        <img
          class="map-image"
          src="${mapImagePath}"
          alt="${period} 지도"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
        />
        <div class="map-placeholder">해당 시대의 지도 이미지가 준비되지 않았습니다.<br>아래 버튼으로 주요 지역을 선택하세요.</div>
      </div>
      <div class="region-button-grid">
        ${Object.keys(regions).map(region => `
          <button type="button" class="outline-btn region-btn" data-region="${region}">${region}</button>
        `).join('')}
      </div>
    </div>`;
}

function generateThreeKingdomsMap() {
  return buildStudyMapHtml('삼국시대');
}

function generateUnifiedSillaMap() {
  return buildStudyMapHtml('통일신라·발해');
}

function generateGoryeoMap() {
  return buildStudyMapHtml('고려');
}

function generateJoseonMap() {
  return buildStudyMapHtml('조선');
}

function generateModernHistoryMap() {
  return buildStudyMapHtml('근현대사');
}

function showRegionDetails(regionName, regionData) {
  const detailPanel = document.getElementById('detail-panel');
  if (!detailPanel) return;

  const renderList = (items) => {
    if (!items || !items.length) return '<p>정보가 없습니다.</p>';
    return `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
  };

  const renderField = (label, value) => {
    if (!value) return '';
    if (Array.isArray(value)) {
      return `<div class="detail-row"><strong>${label}</strong>${renderList(value)}</div>`;
    }
    return `<div class="detail-row"><strong>${label}</strong><p>${value}</p></div>`;
  };

  const renderArtifacts = (artifacts) => {
    if (!artifacts || !artifacts.length) {
      return '<p>유물 정보가 없습니다.</p>';
    }

    return `<div class="artifacts-container">${artifacts.map(item => `
      <div class="artifact-card">
        <img class="artifact-image" src="${item.img}" alt="${item.name}" onerror="this.style.display='none'" />
        <div class="artifact-info">
          <p class="artifact-name">${item.name}</p>
          <p class="artifact-desc">${item.desc}</p>
        </div>
      </div>
    `).join('')}</div>`;
  };

  detailPanel.innerHTML = `
    <div class="detail-card">
      <h3>${regionName}</h3>
      ${renderField('시대 및 왕', regionData['왕 및 시기'])}
      ${renderField('주요 인물', regionData['주요인물'])}
      ${renderField('주요 업적', regionData['주요 업적'])}
      ${renderField('주요 사료', regionData['사료'])}
      ${renderField('경제', regionData['경제'])}
      ${renderField('사회', regionData['사회'])}
      ${renderField('문화', regionData['문화'])}
      ${renderField('종교', regionData['종교'])}
      <div class="detail-row"><strong>주요 유물</strong>${renderArtifacts(regionData['유물'])}</div>
    </div>`;
}

function openStudyMap(period) {
  const regionsData = studyData[period] || null;
  if (!regionsData) {
    quizContainer.innerHTML = `<div class="study-error">선택한 학습 주제를 찾을 수 없습니다.</div>`;
    return;
  }

  appState.currentStudyRegions = regionsData;

  const mapHtml = {
    '삼국시대': generateThreeKingdomsMap,
    '통일신라·발해': generateUnifiedSillaMap,
    '고려': generateGoryeoMap,
    '조선': generateJoseonMap,
    '근현대사': generateModernHistoryMap,
  }[period]();

  quizContainer.innerHTML = `
    <div class="study-container">
      <div class="study-header">
        <div>
          <h2>${period} 학습</h2>
          <p>지도를 클릭하여 시대의 핵심 정보를 확인하세요.</p>
        </div>
        <button type="button" class="secondary-btn" data-action="reset">← 돌아가기</button>
      </div>
      <div class="study-content">
        <div class="map-section">
          ${mapHtml}
        </div>
        <div id="detail-panel" class="detail-panel">
          <div class="detail-placeholder">지역을 선택하면 상세 정보가 표시됩니다.</div>
        </div>
      </div>
    </div>`;
}

function resetApp() {
  appState.currentQuestions = [];
  appState.currentIndex = 0;
  appState.score = 0;
  appState.solutionsVisible = false;
  appState.currentStudyRegions = null;
  updateStats();
  switchMode('quiz');
}

function handleAction(event) {
  const actionButton = event.target.closest('[data-action]');
  if (!actionButton) return;

  const action = actionButton.dataset.action;
  switch (action) {
    case 'start-quiz':
      startStudy(actionButton.dataset.category);
      break;
    case 'open-study':
      openStudyMap(actionButton.dataset.period);
      break;
    case 'toggle-hint':
      toggleHint();
      break;
    case 'toggle-solution':
      toggleSolutions();
      break;
    case 'reset':
      resetApp();
      break;
    default:
      break;
  }
}

function handleModeSwitch(event) {
  const button = event.target.closest('[data-mode]');
  if (!button) return;
  switchMode(button.dataset.mode);
}

function handleQuizClick(event) {
  const optionButton = event.target.closest('.opt-btn[data-choice]');
  if (!optionButton) return;
  checkAnswer(Number(optionButton.dataset.choice));
}

function handleMapSelection(event) {
  const regionElement = event.target.closest('[data-region]');
  if (!regionElement || !appState.currentStudyRegions) return;
  const regionName = regionElement.dataset.region;
  const regionData = appState.currentStudyRegions[regionName];
  if (regionData) {
    showRegionDetails(regionName, regionData);
  }
}

function initApp() {
  modeButtons.forEach(button => button.addEventListener('click', handleModeSwitch));
  document.body.addEventListener('click', handleAction);
  quizContainer.addEventListener('click', handleQuizClick);
  quizContainer.addEventListener('click', handleMapSelection);

  switchMode('quiz');
  updateStats();
}

initApp();
