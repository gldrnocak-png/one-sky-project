document.addEventListener('DOMContentLoaded', () => {
  const views = [...document.querySelectorAll('.view')];
  const tabs = [...document.querySelectorAll('.tabs button')];
  const byId = id => document.getElementById(id);

  function showView(id){
    views.forEach(v => v.classList.toggle('active', v.id === id));
    tabs.forEach(t => t.classList.toggle('active', t.dataset.view === id));
    window.scrollTo({top:0, behavior:'smooth'});
  }

  tabs.forEach(t => t.addEventListener('click', () => showView(t.dataset.view)));
  byId('startBtn').addEventListener('click', () => showView('sun'));

  // SUN
  const sunQ = [
    {q:'The Sun is a star.', a:true},
    {q:'The Sun is smaller than Earth.', a:false},
    {q:'The Sun rotates on its axis.', a:true},
    {q:'The Sun is a solid sphere.', a:false},
    {q:'The Sun provides light and heat to Earth.', a:true}
  ];
  let curSun = null, sunScore = 0;
  byId('sunNext').addEventListener('click', () => {
    curSun = sunQ[Math.floor(Math.random()*sunQ.length)];
    byId('sunQuestion').textContent = curSun.q;
    byId('sunFeedback').textContent = '';
  });
  document.querySelectorAll('[data-sun]').forEach(b => b.addEventListener('click', () => {
    if(!curSun) return;
    const ok = (b.dataset.sun === 'true') === curSun.a;
    if(ok) sunScore++;
    byId('sunScore').textContent = sunScore;
    byId('sunFeedback').textContent = ok ? 'Correct! ⭐' : 'Try again.';
  }));

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
