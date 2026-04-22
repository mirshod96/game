const playerApp = {
  playerId: null,
  playerName: null,
  team: null,
  gameState: null,
  pollInterval: null,
  currentScreen: 'join',
  chosenEmoji: '😎',
  lastRevealedCase: -1,

  init() {
    document.getElementById('btn-join').addEventListener('click', () => this.joinGame());
  },

  selectEmoji(emoji, event) {
    this.chosenEmoji = emoji;
    document.querySelectorAll('.emoji-opt').forEach(el => {
      el.style.border = '2px solid transparent';
    });
    event.target.style.border = '2px solid var(--accent-cyan)';
  },

  async joinGame() {
    const pin = document.getElementById('join-pin').value;
    const name = document.getElementById('join-name').value;
    const errorEl = document.getElementById('join-error');
    
    if (!pin || !name) {
      errorEl.textContent = "Please fill in both fields";
      return;
    }

    try {
      const res = await fetch('/api/player/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, name, emoji: this.chosenEmoji })
      });
      const data = await res.json();

      if (data.error) {
        errorEl.textContent = data.error;
      } else {
        this.playerId = data.player_id;
        this.playerName = data.name;
        this.showScreen('waiting');
        this.startPolling();
      }
    } catch (e) {
      errorEl.textContent = "Connection error";
    }
  },

  startPolling() {
    this.pollInterval = setInterval(async () => {
      const res = await fetch('/api/state');
      const state = await res.json();
      this.handleStateUpdate(state);
    }, 1000);
  },

  handleStateUpdate(state) {
    this.gameState = state;
    
    const myData = state.players[this.playerId];
    if (!myData) return;

    if (state.status === 'lobby') {
      this.showScreen('waiting');
      document.getElementById('waiting-text').textContent = "You're in!";
    } 
    else if (state.status === 'case_1' || state.status === 'next_cases') {
      if (myData.has_answered_current) {
        this.showScreen('waiting');
        document.getElementById('waiting-text').textContent = "Answer submitted. Waiting...";
      } else {
        this.showScreen('answer');
      }
    }
    else if (state.status === 'grouping') {
      // If we haven't acknowledged the reveal yet for THIS case
      if (this.lastRevealedCase !== state.current_case) {
        this.lastRevealedCase = state.current_case;
        this.team = myData.team;
        document.getElementById('reveal-team-name').textContent = "Team " + this.team;
        
        // Find teammates
        const teammates = [];
        for (const [id, player] of Object.entries(state.players)) {
          if (player.team === this.team) {
            teammates.push(player.name + ' ' + (player.emoji || '😎'));
          }
        }
        document.getElementById('teammate-list').innerHTML = teammates.map(t => `<li>${t}</li>`).join('');
        this.showScreen('team-reveal');
      }
    }
    else if (state.status === 'game_over') {
      this.showScreen('waiting');
      document.getElementById('waiting-text').textContent = "Game Over! Look at main screen.";
    }
  },

  async submitAnswer(index) {
    // Disable buttons instantly
    document.querySelectorAll('.kahoot-btn').forEach(btn => btn.disabled = true);
    
    await fetch('/api/player/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player_id: this.playerId, answer: index })
    });
    // The poll will transition us to the waiting screen
  },

  reEnterGame() {
    this.showScreen('waiting-re-entry');
    // Show team header
    document.getElementById('team-header').classList.remove('hidden');
    document.getElementById('team-name').textContent = this.team;
    
    // Fake the screen back to waiting so next poll triggers appropriately
    document.getElementById('screen-waiting').classList.remove('hidden');
    document.getElementById('screen-team-reveal').classList.add('hidden');
    document.getElementById('waiting-text').textContent = "Ready for the next case...";
  },

  showScreen(screenId) {
    if (this.currentScreen === screenId) return;
    this.currentScreen = screenId;
    
    const screens = ['join', 'waiting', 'answer', 'team-reveal', 'waiting-re-entry'];
    screens.forEach(s => {
      const el = document.getElementById('screen-' + s);
      if(el) el.classList.add('hidden');
    });

    if (screenId === 'waiting-re-entry') {
      // Custom soft state
    } else {
      const active = document.getElementById('screen-' + screenId);
      if(active) active.classList.remove('hidden');
    }
    
    // Reset buttons when showing answer screen
    if (screenId === 'answer') {
      document.querySelectorAll('.kahoot-btn').forEach(btn => btn.disabled = false);
    }
  }
};

window.addEventListener('DOMContentLoaded', () => {
  playerApp.init();
});
