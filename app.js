document.addEventListener('DOMContentLoaded', () => {

  // PWA SERVICE WORKER
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js').catch(() => {});
    });
  }

  const views = [...document.querySelectorAll('.view')];
  const tabs = [...document.querySelectorAll('.tabs button')];
  const byId = id => document.getElementById(id);

  // BACKGROUND MUSIC
  const bgMusic = byId('bgMusic');
  const musicToggle = byId('musicToggle');
  let musicWanted = true;

  function updateMusicButton(){
    if(!bgMusic || !musicToggle) return;
    musicToggle.textContent = bgMusic.paused ? '🔇 Music Off' : '🔊 Music On';
  }

  async function startMusic(){
    if(!bgMusic || !musicWanted) return;
    try{
      bgMusic.volume = 0.35;
      await bgMusic.play();
    }catch(e){
      // Browsers may block playback until a user gesture.
    }
    updateMusicButton();
  }

  if(musicToggle){
    musicToggle.addEventListener('click', async () => {
      if(bgMusic.paused){
        musicWanted = true;
        await startMusic();
      }else{
        musicWanted = false;
        bgMusic.pause();
        updateMusicButton();
      }
    });
  }

  if(bgMusic){
    bgMusic.addEventListener('play', updateMusicButton);
    bgMusic.addEventListener('pause', updateMusicButton);
  }

  function showView(id){
    views.forEach(v => v.classList.toggle('active', v.id === id));
    tabs.forEach(t => t.classList.toggle('active', t.dataset.view === id));
    window.scrollTo({top:0, behavior:'smooth'});
  }

  tabs.forEach(t => t.addEventListener('click', () => showView(t.dataset.view)));
  byId('startBtn').addEventListener('click', async () => {
    await startMusic();
    showView('sun');
  });

  // SUN
  const sunQuestions = [
    {q:'The Sun is a star.', a:true},
    {q:'The Sun produces its own light and heat.', a:true},
    {q:'The Sun is smaller than Earth.', a:false},
    {q:'The Sun rotates on its own axis.', a:true},
    {q:'The Sun is a solid rocky sphere.', a:false},
    {q:'The Sun is much larger than Earth.', a:true},
    {q:'The Sun is made mostly of hot gases.', a:true},
    {q:'The Sun is a planet.', a:false},
    {q:'The Sun is the main source of light and heat for Earth.', a:true},
    {q:'The Sun does not move at all.', a:false},
    {q:'The Sun is at the center of our Solar System.', a:true},
    {q:'Earth is larger than the Sun.', a:false},
    {q:'The Sun appears to move across the sky because Earth rotates.', a:true},
    {q:'The Sun gives off energy.', a:true},
    {q:'The Sun is the closest star to Earth.', a:true},
    {q:'The Sun is the same size as the Moon.', a:false},
    {q:'Looking directly at the Sun is safe for our eyes.', a:false},
    {q:'The Sun has a spherical shape.', a:true},
    {q:'The Sun is colder than Earth.', a:false},
    {q:'Without the Sun, life on Earth would be very difficult.', a:true}
  ];

  let sunIndex = -1;
  let sunScore = 0;
  let sunAnswered = false;
  let sunStarted = false;

  const sunQuestion = byId('sunQuestion');
  const sunFeedback = byId('sunFeedback');
  const sunNext = byId('sunNext');
  const sunProgress = byId('sunProgress');
  const sunScoreEl = byId('sunScore');
  const sunTotalEl = byId('sunTotal');

  if (sunTotalEl) sunTotalEl.textContent = sunQuestions.length;

  function playTone(kind){
    try{
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if(kind === 'correct'){
        osc.frequency.setValueAtTime(740, ctx.currentTime);
        osc.frequency.setValueAtTime(980, ctx.currentTime + 0.09);
      }else if(kind === 'wrong'){
        osc.frequency.setValueAtTime(260, ctx.currentTime);
        osc.frequency.setValueAtTime(190, ctx.currentTime + 0.12);
      }else{
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        osc.frequency.setValueAtTime(700, ctx.currentTime + 0.08);
        osc.frequency.setValueAtTime(900, ctx.currentTime + 0.16);
      }

      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.28);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }catch(e){}
  }

  function showSunQuestion(){
    sunAnswered = false;
    sunFeedback.textContent = '';
    sunQuestion.textContent = sunQuestions[sunIndex].q;
    sunProgress.textContent = `Question ${sunIndex + 1} of ${sunQuestions.length}`;
    sunNext.textContent = 'Next Question';
    sunNext.disabled = true;
    sunNext.style.opacity = '.55';
  }

  function finishSunGame(){
    sunStarted = false;
    sunAnswered = true;
    sunProgress.textContent = 'Challenge Complete!';
    let result = '';
    if(sunScore >= 18) result = 'Sun Master 🌟';
    else if(sunScore >= 15) result = 'Sun Explorer ☀️';
    else if(sunScore >= 10) result = 'Sun Detective 🔎';
    else result = 'Keep Exploring 🚀';

    sunQuestion.innerHTML = `You scored <strong>${sunScore}/${sunQuestions.length}</strong><br>${result}`;
    sunFeedback.textContent = 'Great job! You completed all 20 questions.';
    sunNext.textContent = 'Play Again';
    sunNext.disabled = false;
    sunNext.style.opacity = '1';
    playTone('finish');
  }

  sunNext.addEventListener('click', () => {
    if(!sunStarted){
      sunStarted = true;
      sunIndex = 0;
      sunScore = 0;
      sunScoreEl.textContent = '0';
      showSunQuestion();
      return;
    }

    if(sunIndex < sunQuestions.length - 1){
      sunIndex++;
      showSunQuestion();
    }else{
      finishSunGame();
    }
  });

  document.querySelectorAll('[data-sun]').forEach(button => {
    button.addEventListener('click', () => {
      if(!sunStarted || sunAnswered) return;

      const selected = button.dataset.sun === 'true';
      const correct = sunQuestions[sunIndex].a;

      if(selected === correct){
        sunScore++;
        sunScoreEl.textContent = sunScore;
        sunFeedback.textContent = 'Correct! ⭐';
        playTone('correct');
      }else{
        sunFeedback.textContent = `Not this time. The correct answer is ${correct ? 'TRUE' : 'FALSE'}.`;
        playTone('wrong');
      }

      sunAnswered = true;
      sunNext.disabled = false;
      sunNext.style.opacity = '1';

      if(sunIndex === sunQuestions.length - 1){
        sunNext.textContent = 'See Result';
      }
    });
  });

  // MOON CODE
  const moonRounds = [
    {
      title:'Round 1 – Getting to Know the Moon',
      legend:[['Red','Natural satellite'],['Yellow','Crater'],['Green','Rotation'],['Blue','Revolution'],['Orange','Reflects sunlight'],['Dark Blue','Moon surface']],
      questions:[
        {clue:'I am the celestial body that moves around Earth.',color:'red'},
        {clue:"I am the name of the many hollow structures found on the Moon's surface.",color:'yellow'},
        {clue:'I am the movement the Moon makes around its own axis.',color:'green'},
        {clue:'I am the movement the Moon makes around Earth.',color:'blue'},
        {clue:'The Moon does not produce its own light. This property makes it visible from Earth.',color:'orange'},
        {clue:'Craters, hollows and elevations are found in this part of the Moon.',color:'darkblue'}
      ]
    },
    {
      title:'Round 2 – Phases of the Moon',
      legend:[['Red','New Moon'],['Yellow','First Quarter'],['Green','Full Moon'],['Blue','Last Quarter'],['Orange','Main phase'],['Dark Blue','Intermediate phase']],
      questions:[
        {clue:'I am the main phase when the Moon is not visible or is barely visible from Earth.',color:'red'},
        {clue:'I am the phase when the right half of the Moon appears illuminated.',color:'yellow'},
        {clue:'I am the phase when the whole illuminated face of the Moon is visible.',color:'green'},
        {clue:'I am the phase when the left half of the Moon appears illuminated.',color:'blue'},
        {clue:'New Moon, First Quarter, Full Moon and Last Quarter belong to this group.',color:'orange'},
        {clue:'Crescent and gibbous phases between the main phases belong to this group.',color:'darkblue'}
      ]
    },
    {
      title:'Round 3 – Moon Knowledge Master',
      legend:[['Red','Earth'],['Yellow','Sun'],['Green','Light'],['Blue','Same face'],['Orange','Movement'],['Dark Blue','Phase']],
      questions:[
        {clue:'What does the Moon revolve around?',color:'red'},
        {clue:'What is the source of the light that makes the Moon visible?',color:'yellow'},
        {clue:'The Moon does not produce its own. What does it reflect?',color:'green'},
        {clue:"Because of the Moon's motion, we continuously see this from Earth.",color:'blue'},
        {clue:'Rotation and revolution are examples of this.',color:'orange'},
        {clue:'The different shapes in which the Moon appears from Earth are called this.',color:'darkblue'}
      ]
    }
  ];

  let roundIndex = 0;
  let questionIndex = 0;
  let roundScore = 0;
  let totalPoints = 0;
  let started = false;
  let answered = false;
  let state = 'ready'; // ready, question, betweenRounds, finished

  const info = byId('moonInfo');
  const clue = byId('moonClue');
  const feedback = byId('moonFeedback');
  const next = byId('moonNext');

  const colorLabel = {
    red:'Red', orange:'Orange', yellow:'Yellow',
    green:'Green', blue:'Blue', darkblue:'Dark Blue'
  };

  function renderQuestion(){
    state = 'question';
    answered = false;
    const round = moonRounds[roundIndex];
    info.innerHTML = `
      <strong>${round.title}</strong><br>
      Question ${questionIndex + 1} of 6 • Round score: ${roundScore}/6 • Total points: ${totalPoints}
      <div style="margin-top:10px">
        ${round.legend.map(x => `<span class="legend-item"><b>${x[0]}:</b> ${x[1]}</span>`).join('')}
      </div>`;
    clue.textContent = round.questions[questionIndex].clue;
    feedback.textContent = '';
    next.textContent = 'Next Question';
    next.disabled = true;
    next.style.opacity = '.55';
  }

  function endRound(){
    if(roundScore === 6) totalPoints++;

    if(roundIndex < moonRounds.length - 1){
      state = 'betweenRounds';
      const nextRound = roundIndex + 2;
      feedback.innerHTML = (roundScore === 6
        ? 'Perfect round! ⭐ You earned 1 point.'
        : `Round completed: ${roundScore}/6 correct.`) +
        `<br><strong>Ready for Round ${nextRound}?</strong>`;
      next.textContent = `Go to Round ${nextRound}`;
      next.disabled = false;
      next.style.opacity = '1';
    } else {
      state = 'finished';
      const title = totalPoints===3 ? 'Moon Master 🌟'
        : totalPoints===2 ? 'Moon Explorer 🚀'
        : totalPoints===1 ? 'Moon Detective 🔎'
        : 'Keep Exploring 🌙';
      feedback.innerHTML = (roundScore === 6
        ? 'Perfect round! ⭐ You earned 1 point.'
        : `Round completed: ${roundScore}/6 correct.`) +
        `<br><strong>Final result: ${totalPoints}/3 – ${title}</strong>`;
      next.textContent = 'Play Again';
      next.disabled = false;
      next.style.opacity = '1';
    }
  }

  document.querySelectorAll('[data-color]').forEach(button => {
    button.addEventListener('click', () => {
      if(!started || state !== 'question' || answered) return;

      const current = moonRounds[roundIndex].questions[questionIndex];
      const chosen = button.dataset.color;

      if(chosen === current.color){
        roundScore++;
        feedback.textContent = `Correct! ${colorLabel[chosen]} is the right brick. 🌙`;
      } else {
        feedback.textContent = `Not this time. Correct brick: ${colorLabel[current.color]}.`;
      }

      answered = true;

      // On question 6, end the round immediately so there is no "stuck" extra step.
      if(questionIndex === 5){
        setTimeout(endRound, 250);
      } else {
        next.disabled = false;
        next.style.opacity = '1';
      }
    });
  });

  next.addEventListener('click', () => {
    if(state === 'ready'){
      started = true;
      roundIndex = 0;
      questionIndex = 0;
      roundScore = 0;
      totalPoints = 0;
      renderQuestion();
      return;
    }

    if(state === 'betweenRounds'){
      roundIndex++;
      questionIndex = 0;
      roundScore = 0;
      renderQuestion();
      return;
    }

    if(state === 'finished'){
      roundIndex = 0;
      questionIndex = 0;
      roundScore = 0;
      totalPoints = 0;
      started = true;
      renderQuestion();
      return;
    }

    if(state === 'question'){
      if(!answered) return;
      if(questionIndex < 5){
        questionIndex++;
        renderQuestion();
      }
    }
  });

  // SAFE INTERNET
  const safeItems = [
    {s:'A stranger asks you to send your photo.',a:'blue'},
    {s:'A shocking news item has no clear source.',a:'yellow'},
    {s:'A website asks for your home address.',a:'blue'},
    {s:'A classmate shares another student’s photo without permission.',a:'orange'},
    {s:'A pop-up says “You won a prize! Click now!”',a:'red'},
    {s:'An online message scares you.',a:'darkblue'}
  ];
  let curSafe = null;
  byId('safeNext').addEventListener('click', () => {
    curSafe = safeItems[Math.floor(Math.random()*safeItems.length)];
    byId('safeScenario').textContent = curSafe.s;
    byId('safeFeedback').textContent = '';
  });
  document.querySelectorAll('[data-safe]').forEach(b => b.addEventListener('click', () => {
    if(!curSafe) return;
    byId('safeFeedback').textContent =
      b.dataset.safe === curSafe.a ? 'Good choice! ✅' : 'Think again.';
  }));

  // TEAM SPACE
  const colors = ['Red','Orange','Yellow','Green','Blue','Dark Blue'];
  document.querySelectorAll('[data-team]').forEach(b => b.addEventListener('click', () => {
    const team = b.dataset.team;
    byId('teamEditor').classList.remove('hidden');
    byId('teamTitle').textContent = 'Team ' + team;
    byId('factFields').innerHTML = colors.map((c,i) =>
      `<div class="fact-row"><strong>${c}</strong><input id="fact${i}" placeholder="Write a short scientific fact"></div>`
    ).join('');
    byId('saveTeam').dataset.team = team;
  }));
  byId('saveTeam').addEventListener('click', e => {
    const team = e.target.dataset.team;
    const facts = colors.map((_,i) => byId('fact'+i)?.value || '');
    localStorage.setItem('team-'+team, JSON.stringify(facts));
    byId('saveMsg').textContent = 'Saved on this device.';
  });

  // TIMER
  let timerInt = null;
  byId('timerBtn').addEventListener('click', () => {
    clearInterval(timerInt);
    let n = 60;
    byId('timer').textContent = n;
    timerInt = setInterval(() => {
      n--;
      byId('timer').textContent = n;
      if(n <= 0){
        clearInterval(timerInt);
        byId('timer').textContent = 'Time! 🎉';
      }
    },1000);
  });
});
