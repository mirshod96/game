const hostApp = {
  gameState: null,
  pollInterval: null,
  currentScreen: 'lobby',
  pollFails: 0,
  
  // Game logic
  timeLeft: 600,
  timerInterval: null,

  async init() {
    this.cacheDOM();
    this.bindEvents();
    
    // Create new game session
    try {
      const res = await fetch('/api/host/create', { method: 'POST' });
      const data = await res.json();
      this.el.lobbyPin.textContent = data.pin;
      this.startPolling();
    } catch (e) {
      console.error("Failed to connect to server.", e);
      this.el.lobbyPin.textContent = "ERR";
    }
  },

  cacheDOM() {
    this.el = {
      // Screens
      screenLobby: document.getElementById('screen-lobby'),
      screenGame: document.getElementById('screen-game'),
      screenReveal: document.getElementById('screen-reveal'),
      
      // Lobby
      lobbyPin: document.getElementById('lobby-pin'),
      lobbyCount: document.getElementById('lobby-count'),
      lobbyPlayers: document.getElementById('lobby-players'),
      btnStartGame: document.getElementById('btn-start-game'),
      
      // Game
      caseNum: document.getElementById('current-case-num'),
      progressFill: document.getElementById('progress-fill'),
      ansCounter: document.getElementById('answer-counter'),
      totalPlayers: document.getElementById('total-players'),
      timer: document.getElementById('timer'),
      
      title: document.getElementById('case-title'),
      focus: document.getElementById('case-focus'),
      scenario: document.getElementById('case-scenario'),
      question: document.getElementById('case-question'),
      answersContainer: document.getElementById('answers-container'),
      
      btnShowResults: document.getElementById('btn-show-results'),
      btnDoGrouping: document.getElementById('btn-do-grouping'),
      btnNextCase: document.getElementById('btn-next-case'),
      
      insightPanel: document.getElementById('insight-panel'),
      insightExp: document.getElementById('insight-explanation'),
      insightInc: document.getElementById('insight-incorrect'),
      
      // Modal
      modal: document.getElementById('investigation-modal'),
      modalTitle: document.getElementById('modal-title'),
      modalBody: document.getElementById('modal-body-content')
    };
  },

  bindEvents() {
    this.el.btnStartGame.addEventListener('click', () => this.startGame());
    this.el.btnShowResults.addEventListener('click', () => this.showResults());
    this.el.btnDoGrouping.addEventListener('click', () => this.triggerGrouping());
    this.el.btnNextCase.addEventListener('click', () => this.nextCase());
    
    document.getElementById('btn-proceed-from-reveal').addEventListener('click', () => this.nextCase());
  },

  startPolling() {
    this.pollInterval = setInterval(async () => {
      try {
        const res = await fetch('/api/state');
        const state = await res.json();
        this.handleStateUpdate(state);
      } catch (e) {
        console.warn("Polling error");
      }
    }, 1000);
  },

  handleStateUpdate(state) {
    this.gameState = state;
    
    // Always update total players and answered counts
    const players = Object.values(state.players);
    this.el.lobbyCount.textContent = players.length;
    this.el.totalPlayers.textContent = players.length;
    
    const answeredCount = players.filter(p => p.has_answered_current).length;
    this.el.ansCounter.textContent = answeredCount;

    // Lobby updates
    if (this.currentScreen === 'lobby') {
      this.el.lobbyPlayers.innerHTML = players.map(p => `
        <div class="player-tag">
          <div class="player-emoji">${p.emoji || '😎'}</div>
          <div>${p.name}</div>
        </div>`).join('');
    }
  },

  async startGame() {
    await fetch('/api/host/start', { method: 'POST' });
    this.showScreen('game');
    this.loadCaseRender(0);
    this.startTimer();
  },

  loadCaseRender(index) {
    const currentData = casesConfigs[index];
    
    this.el.caseNum.textContent = index + 1;
    this.el.progressFill.style.width = `${((index + 1) / casesConfigs.length) * 100}%`;
    this.el.title.textContent = currentData.title;
    this.el.focus.textContent = currentData.focus;
    this.el.scenario.textContent = currentData.scenario;
    this.el.question.textContent = currentData.question;

    this.el.insightPanel.classList.add('hidden');
    this.el.btnShowResults.style.display = 'inline-block';
    this.el.btnDoGrouping.classList.add('hidden');
    this.el.btnNextCase.classList.add('hidden');

    const labels = ['A', 'B', 'C', 'D'];
    this.el.answersContainer.innerHTML = currentData.options.map((opt, idx) => `
      <div class="answer-btn" id="opt-${idx}">
        <strong style="margin-right:1rem;">${labels[idx]}</strong> ${opt}
      </div>
    `).join('');
  },

  showResults() {
    const currentData = casesConfigs[this.gameState.current_case];
    this.el.answersContainer.children[currentData.correctOptionIndex].classList.add('correct');
    
    this.el.insightPanel.classList.remove('hidden');
    this.el.insightExp.textContent = currentData.insight.explanation;
    this.el.insightInc.textContent = currentData.insight.whyIncorrect;
    
    this.el.btnShowResults.style.display = 'none';

    // Always trigger grouping
    this.el.btnDoGrouping.classList.remove('hidden');
  },

  async triggerGrouping() {
    await fetch('/api/host/do_grouping', { method: 'POST' });
    this.showScreen('reveal');
    this.renderTeams();
  },

  renderTeams() {
    const lists = {
      'A': document.getElementById('team-list-A'),
      'B': document.getElementById('team-list-B'),
      'C': document.getElementById('team-list-C'),
      'D': document.getElementById('team-list-D')
    };
    
    Object.values(lists).forEach(el => el.innerHTML = '');
    
    Object.values(this.gameState.players).forEach(p => {
      if(p.team && lists[p.team]) {
        lists[p.team].innerHTML += `<li>${p.name}</li>`;
      }
    });
  },

  async nextCase() {
    await fetch('/api/host/next_case', { method: 'POST' });
    this.showScreen('game');
    this.loadCaseRender(this.gameState.current_case + 1);
  },

  startTimer() {
    this.timeLeft = 600;
    this.timerInterval = setInterval(() => {
      if (this.timeLeft <= 0) return;
      this.timeLeft--;
      const min = Math.floor(this.timeLeft / 60);
      const sec = this.timeLeft % 60;
      this.el.timer.textContent = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
      if (this.timeLeft <= 60) this.el.timer.classList.add('timer-warning');
      else this.el.timer.classList.remove('timer-warning');
    }, 1000);
  },

  showScreen(screenId) {
    this.currentScreen = screenId;
    ['lobby', 'game', 'reveal'].forEach(s => {
      document.getElementById('screen-' + s).classList.remove('active');
    });
    document.getElementById('screen-' + screenId).classList.add('active');
  },

  openModal(type) {
    const currentData = casesConfigs[this.gameState.current_case];
    const data = currentData.investigations[type];
    
    this.el.modalBody.innerHTML = '';
    this.el.modalTitle.textContent = type.charAt(0).toUpperCase() + type.slice(1) + ' Results';

    if (!data) {
      this.el.modalBody.innerHTML = '<p>No data</p>';
    } else if (typeof data === 'string') {
      this.el.modalBody.innerHTML = `<p>${data.replace(/\n/g, '<br>')}</p>`;
    } else if (type === 'imaging') {
      this.el.modalTitle.textContent = data.title;
      if (data.type === 'text') {
        this.el.modalBody.innerHTML = `<p>${data.text}</p>`;
      } else if (data.type === 'image') {
        this.el.modalBody.innerHTML = `<img src="${data.url}" class="modal-image" />`;
      }
    }
    this.el.modal.classList.remove('hidden');
  },

  closeModal() {
    this.el.modal.classList.add('hidden');
  }
};

window.addEventListener('DOMContentLoaded', () => {
  hostApp.init();
});
