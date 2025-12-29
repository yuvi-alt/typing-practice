// Audio configuration - set this to your hosted audio URL
// Leave empty to use local file (assets/lofi.mp3) or disable music
const AUDIO_URL = ""; // Example: "https://cdn.example.com/lofi.mp3"

// Audio configuration - set this to your hosted audio URL
// Leave empty to use local file (assets/lofi.mp3) or disable music
const AUDIO_URL = ""; // Example: "https://cdn.example.com/lofi.mp3"

const QUOTES = [
  "Slow is smooth, smooth is fast.",
  "Breathe in. Let your hands float on the keys.",
  "Focus on accuracy first, speed will follow.",
  "Your only job is the next character.",
  "Quiet mind. Steady rhythm. Clean keystrokes.",
  "Small wins add up to big momentum.",
  "Accuracy is calm. Speed is a side effect.",
  "Type like you're pouring tea: steady and clean.",
  "The journey of a thousand words begins with a single keystroke.",
  "Practice makes progress, not perfection.",
  "Every expert was once a beginner.",
  "Consistency beats intensity every single time.",
  "Focus on the process, not the outcome.",
  "Mistakes are proof that you're trying.",
  "The only bad practice is no practice.",
  "Progress over perfection, always.",
  "Your fingers remember what your mind forgets.",
  "Type with intention, not with haste.",
  "The best time to practice was yesterday. The second best time is now.",
  "Flow state is found in the rhythm of your keystrokes."
];

const els = {
  mode: document.getElementById("mode"),
  duration: document.getElementById("duration"),
  wordCount: document.getElementById("wordCount"),
  newBtn: document.getElementById("newBtn"),
  restartBtn: document.getElementById("restartBtn"),
  target: document.getElementById("target"),
  input: document.getElementById("input"),
  wpm: document.getElementById("wpm"),
  acc: document.getElementById("acc"),
  errs: document.getElementById("errs"),
  time: document.getElementById("time"),
  timeLabel: document.getElementById("timeLabel"),
  bestScore: document.getElementById("bestScore"),

  // music
  lofi: document.getElementById("lofi"),
  musicBtn: document.getElementById("musicBtn"),

  // modals
  resultsModal: document.getElementById("resultsModal"),
  shortcutsModal: document.getElementById("shortcutsModal"),
  closeResults: document.getElementById("closeResults"),
  closeShortcuts: document.getElementById("closeShortcuts"),
  resultWpm: document.getElementById("resultWpm"),
  resultAcc: document.getElementById("resultAcc"),
  resultErrs: document.getElementById("resultErrs"),
  resultChars: document.getElementById("resultChars"),
  newRecord: document.getElementById("newRecord"),
};

let state = {
  text: "",
  started: false,
  startTime: 0,
  timerId: null,
  secondsLeft: 60,
  errors: 0,
  wordsLeft: 25,
  totalChars: 0,

  // music state
  firstInteractionDone: false,
  musicOn: true,
};

function pickQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

function makeTextForMode() {
  const mode = els.mode.value;
  
  if (mode === "quote") {
    return pickQuote();
  } else if (mode === "words") {
    // Generate enough text for word count mode
    let text = "";
    let words = 0;
    const targetWords = parseInt(els.wordCount.value, 10);
    
    while (words < targetWords) {
      const quote = pickQuote();
      const quoteWords = quote.split(/\s+/);
      const needed = targetWords - words;
      
      if (quoteWords.length <= needed) {
        text += (text ? " " : "") + quote;
        words += quoteWords.length;
      } else {
        text += (text ? " " : "") + quoteWords.slice(0, needed).join(" ");
        words = targetWords;
      }
    }
    
    return text;
  } else {
    // Time mode: make bigger paragraphs with multiple quotes
    let paragraph = "";
    const numQuotes = 4 + Math.floor(Math.random() * 3); // 4-6 quotes for bigger paragraphs
    for (let i = 0; i < numQuotes; i++) {
      paragraph += (i > 0 ? " " : "") + pickQuote();
    }
    return paragraph;
  }
}

function escapeHtml(s){
  return s.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
}

function renderTarget(typed) {
  const t = state.text;
  let html = "";

  for (let i = 0; i < t.length; i++) {
    const expected = t[i];
    const got = typed[i];

    if (i < typed.length) {
      html += (got === expected)
        ? `<span class="good">${escapeHtml(expected)}</span>`
        : `<span class="bad">${escapeHtml(expected)}</span>`;
    } else if (i === typed.length) {
      html += `<span class="caret"></span><span>${escapeHtml(expected)}</span>`;
    } else {
      html += `<span>${escapeHtml(expected)}</span>`;
    }
  }

  if (typed.length === 0) html = `<span class="caret"></span>` + escapeHtml(t);
  els.target.innerHTML = html;
}

function resetStats() {
  els.wpm.textContent = "0";
  els.acc.textContent = "100";
  els.errs.textContent = "0";
}

function stopTimer() {
  if (state.timerId) clearInterval(state.timerId);
  state.timerId = null;
}

function setTimeUI() {
  els.time.textContent = String(state.secondsLeft);
}

function calcStats() {
  const typed = els.input.value;
  const elapsedMin = Math.max((Date.now() - state.startTime) / 60000, 1/60000);

  // errors = mismatched in overlap + extra typed beyond target
  let errs = 0;
  const n = Math.min(typed.length, state.text.length);
  for (let i = 0; i < n; i++) {
    if (typed[i] !== state.text[i]) errs++;
  }
  if (typed.length > state.text.length) errs += (typed.length - state.text.length);
  state.errors = errs;
  state.totalChars = typed.length;

  // WPM: (chars/5)/minutes
  const wpm = Math.round((typed.length / 5) / elapsedMin);

  // accuracy: correct/typed
  const correct = Math.max(typed.length - errs, 0);
  const acc = typed.length === 0 ? 100 : Math.round((correct / typed.length) * 100);

  els.wpm.textContent = String(isFinite(wpm) ? wpm : 0);
  els.acc.textContent = String(Math.max(0, Math.min(100, acc)));
  els.errs.textContent = String(errs);

  // Update time/words display based on mode
  if (els.mode.value === "words") {
    const wordsTyped = typed.trim().split(/\s+/).filter(w => w.length > 0).length;
    const wordsRemaining = Math.max(parseInt(els.wordCount.value, 10) - wordsTyped, 0);
    els.time.textContent = String(wordsRemaining);
    els.timeLabel.textContent = "Words Left";
  } else {
    els.timeLabel.textContent = "Time";
  }
}

function setNewParagraph({ clearInput = true } = {}) {
  state.text = makeTextForMode();
  if (clearInput) els.input.value = "";
  renderTarget(els.input.value);
}

function finishSession() {
  stopTimer();
  els.input.disabled = true;

  // Calculate final stats
  const typed = els.input.value;
  const elapsedMin = Math.max((Date.now() - state.startTime) / 60000, 1/60000);
  const finalWpm = Math.round((typed.length / 5) / elapsedMin);
  const correct = Math.max(typed.length - state.errors, 0);
  const finalAcc = typed.length === 0 ? 100 : Math.round((correct / typed.length) * 100);

  // Show results modal
  showResultsModal({
    wpm: finalWpm,
    accuracy: finalAcc,
    errors: state.errors,
    chars: typed.length
  });

  // Save to local storage if it's a new record
  saveBestScore(finalWpm, finalAcc);
}

function startTimerIfNeeded() {
  if (state.started) return;

  state.started = true;
  state.startTime = Date.now();

  const mode = els.mode.value;
  
  if (mode === "time") {
    state.timerId = setInterval(() => {
      state.secondsLeft -= 1;
      setTimeUI();
      if (state.secondsLeft <= 0) finishSession();
    }, 1000);
  } else if (mode === "words") {
    // Check word count completion on each input
    // This is handled in maybeAutoNextParagraph
  }
}

// Browser needs user gesture to start audio
async function ensureMusicStarted() {
  if (state.firstInteractionDone) return;
  state.firstInteractionDone = true;

  if (!els.lofi) return;
  
  // Set audio source if external URL is provided
  if (AUDIO_URL) {
    const audioSource = els.lofi.querySelector('#audioSource');
    if (audioSource) {
      audioSource.src = AUDIO_URL;
      els.lofi.load(); // Reload with new source
    }
  }
  
  // Check if audio file exists and is loaded
  els.lofi.addEventListener('error', () => {
    // Audio file not found or failed to load
    state.musicOn = false;
    updateMusicButton();
    els.musicBtn.disabled = true;
    els.musicBtn.title = "Audio file not available";
  }, { once: true });
  
  els.lofi.volume = 0.35;

  if (state.musicOn) {
    try { 
      await els.lofi.play(); 
    } catch (err) {
      // Audio failed to play (file missing, autoplay blocked, etc.)
      state.musicOn = false;
      updateMusicButton();
    }
  }
}

function updateMusicButton() {
  els.musicBtn.textContent = state.musicOn ? "Music: On" : "Music: Off";
  els.musicBtn.setAttribute("aria-pressed", String(state.musicOn));
}

async function toggleMusic() {
  if (!els.lofi) return;
  
  // Check if audio is available
  if (els.lofi.error) {
    alert("Audio file not available. Please add a music file to the assets folder.");
    return;
  }
  
  state.musicOn = !state.musicOn;
  updateMusicButton();

  if (state.musicOn) {
    try { 
      await els.lofi.play(); 
    } catch (err) {
      // Failed to play - file might be missing
      state.musicOn = false;
      updateMusicButton();
      console.warn("Could not play audio:", err);
    }
  } else {
    els.lofi.pause();
  }
}

function newSession() {
  stopTimer();

  state.started = false;
  state.startTime = 0;
  state.errors = 0;
  state.totalChars = 0;

  const mode = els.mode.value;
  if (mode === "time") {
    state.secondsLeft = parseInt(els.duration.value, 10);
  } else if (mode === "words") {
    state.wordsLeft = parseInt(els.wordCount.value, 10);
  }

  els.input.disabled = false;
  els.input.focus();

  resetStats();
  setTimeUI();
  updateModeUI();

  setNewParagraph({ clearInput: true });
}

function maybeAutoNextParagraph() {
  const mode = els.mode.value;
  
  // Quote mode: finished quote -> next quote automatically
  if (mode === "quote") {
    if (els.input.value === state.text) {
      setTimeout(() => setNewParagraph({ clearInput: true }), 450);
    }
    return;
  }

  // Time mode: finish paragraph early -> next paragraph (timer continues)
  if (mode === "time") {
    if (els.input.value === state.text) {
      setTimeout(() => setNewParagraph({ clearInput: true }), 250);
    }
    return;
  }

  // Words mode: check if word count is reached
  if (mode === "words") {
    const typed = els.input.value;
    const targetWords = parseInt(els.wordCount.value, 10);
    const targetText = state.text;
    
    // Check if typed text matches target up to the required word count
    const targetWordArray = targetText.trim().split(/\s+/).filter(w => w.length > 0);
    const requiredText = targetWordArray.slice(0, targetWords).join(" ");
    
    // Check if user has typed at least the required portion correctly
    // Allow for trailing spaces
    const typedTrimmed = typed.trim();
    const requiredTrimmed = requiredText.trim();
    
    if (typedTrimmed.length >= requiredTrimmed.length) {
      // Check if the typed text matches the required portion
      const typedMatch = typedTrimmed.substring(0, requiredTrimmed.length);
      if (typedMatch === requiredTrimmed || typedTrimmed.startsWith(requiredTrimmed)) {
        finishSession();
      }
    }
  }
}

async function onType() {
  await ensureMusicStarted();
  startTimerIfNeeded();

  const typed = els.input.value;
  renderTarget(typed);
  calcStats();
  maybeAutoNextParagraph();
}

els.newBtn.addEventListener("click", newSession);
els.restartBtn.addEventListener("click", newSession);
els.input.addEventListener("input", onType);

els.musicBtn.addEventListener("click", async () => {
  await ensureMusicStarted();
  await toggleMusic();
});

els.mode.addEventListener("change", newSession);
els.duration.addEventListener("change", () => {
  if (els.mode.value === "time") newSession();
});

// Local Storage Functions
function getBestScore() {
  try {
    const stored = localStorage.getItem("typingBestScore");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function saveBestScore(wpm, accuracy) {
  try {
    const best = getBestScore();
    const isNewRecord = !best || wpm > best.wpm || (wpm === best.wpm && accuracy > best.accuracy);
    
    if (isNewRecord) {
      localStorage.setItem("typingBestScore", JSON.stringify({ wpm, accuracy, date: Date.now() }));
      updateBestScoreDisplay(wpm, accuracy);
    }
    
    return isNewRecord;
  } catch {
    return false;
  }
}

function updateBestScoreDisplay(wpm, accuracy) {
  if (wpm && accuracy) {
    els.bestScore.textContent = `Best: ${wpm} WPM (${accuracy}% acc)`;
    els.bestScore.style.display = "inline";
  }
}

// Modal Functions
function showResultsModal(stats) {
  els.resultWpm.textContent = stats.wpm;
  els.resultAcc.textContent = stats.accuracy + "%";
  els.resultErrs.textContent = stats.errors;
  els.resultChars.textContent = stats.chars;
  
  const best = getBestScore();
  const isNewRecord = best && (stats.wpm > best.wpm || (stats.wpm === best.wpm && stats.accuracy > best.accuracy));
  els.newRecord.style.display = isNewRecord ? "block" : "none";
  
  els.resultsModal.style.display = "flex";
  els.closeResults.focus();
}

function hideResultsModal() {
  els.resultsModal.style.display = "none";
  newSession();
}

function toggleShortcutsModal() {
  const isVisible = els.shortcutsModal.style.display === "flex";
  els.shortcutsModal.style.display = isVisible ? "none" : "flex";
  if (!isVisible) {
    els.closeShortcuts.focus();
  } else {
    els.input.focus();
  }
}

function updateModeUI() {
  const mode = els.mode.value;
  els.wordCount.style.display = mode === "words" ? "block" : "none";
  els.duration.style.display = mode === "time" ? "block" : "none";
  
  if (mode === "words") {
    els.time.textContent = els.wordCount.value;
    els.timeLabel.textContent = "Words Left";
  } else {
    els.timeLabel.textContent = "Time";
  }
}

// Event Listeners
els.newBtn.addEventListener("click", newSession);
els.restartBtn.addEventListener("click", newSession);
els.input.addEventListener("input", onType);

els.musicBtn.addEventListener("click", async () => {
  await ensureMusicStarted();
  await toggleMusic();
});

els.mode.addEventListener("change", () => {
  updateModeUI();
  newSession();
});

els.duration.addEventListener("change", () => {
  if (els.mode.value === "time") newSession();
});

els.wordCount.addEventListener("change", () => {
  if (els.mode.value === "words") newSession();
});

els.closeResults.addEventListener("click", hideResultsModal);
els.closeShortcuts.addEventListener("click", toggleShortcutsModal);

// Close modals on background click
els.resultsModal.addEventListener("click", (e) => {
  if (e.target === els.resultsModal) hideResultsModal();
});

els.shortcutsModal.addEventListener("click", (e) => {
  if (e.target === els.shortcutsModal) toggleShortcutsModal();
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (els.resultsModal.style.display === "flex") {
      hideResultsModal();
    } else if (els.shortcutsModal.style.display === "flex") {
      toggleShortcutsModal();
    } else {
      newSession();
    }
  } else if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
    e.preventDefault();
    toggleShortcutsModal();
  }
});

// Initialize
updateMusicButton();
const best = getBestScore();
if (best) {
  updateBestScoreDisplay(best.wpm, best.accuracy);
}
newSession();
