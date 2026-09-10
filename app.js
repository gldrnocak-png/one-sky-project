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

  let r=0, q=0, roundScore=0, totalPoints=0, started=false, answered=false;
  const moonInfo = byId('moonInfo');
  const moonClue = byId('moonClue');
  const moonFeedback = byId('moonFeedback');
  const moonNext = byId('moonNext');

  const colorLabel = {red:'Red',orange:'Orange',yellow:'Yellow',green:'Green',blue:'Blue',darkblue:'Dark Blue'};

  function renderMoon(){
    const round = moonRounds[r];
    moonInfo.innerHTML = `<strong>${round.title}</strong><br>Question ${q+1} of 6 • Round score: ${roundScore}/6 • Total points: ${totalPoints}<div style="margin-top:10px">${round.legend.map(x=>`<span class="legend-item"><b>${x[0]}:</b> ${x[1]}</span>`).join('')}</div>`;
    moonClue.textContent = round.questions[q].clue;
    moonFeedback.textContent = '';
    moonNext.textContent = 'Next Question';
    answered = false;
  }

  function finishRound(){
    if(roundScore === 6){
      totalPoints++;
      moonFeedback.innerHTML = 'Perfect round! ⭐ You earned 1 point.';
    } else {
      moonFeedback.innerHTML = `Round completed: ${roundScore}/6 correct.`;
    }
    if(r < 2){
      moonNext.textContent = 'Next Round';
    } else {
      const title = totalPoints===3?'Moon Master 🌟':totalPoints===2?'Moon Explorer 🚀':totalPoints===1?'Moon Detective 🔎':'Keep Exploring 🌙';
      moonFeedback.innerHTML += `<br><strong>Final result: ${totalPoints}/3 – ${title}</strong>`;
      moonNext.textContent = 'Play Again';
    }
  }

  document.querySelectorAll('[data-color]').forEach(button => button.addEventListener('click', () => {
    if(!started || answered) return;
    const current = moonRounds[r].questions[q];
    const chosen = button.dataset.color;
    if(chosen === current.color){
      roundScore++;
      moonFeedback.textContent = `Correct! ${colorLabel[chosen]} is the right brick. 🌙`;
    } else {
      moonFeedback.textContent = `Not this time. Correct brick: ${colorLabel[current.color]}.`;
    }
    answered = true;
  }));

  moonNext.addEventListener('click', () => {
    if(!started){
      started = true; r=0; q=0; roundScore=0; totalPoints=0; renderMoon(); return;
    }
    if(moonNext.textContent === 'Next Round'){
      r++; q=0; roundScore=0; renderMoon(); return;
    }
    if(moonNext.textContent === 'Play Again'){
      r=0; q=0; roundScore=0; totalPoints=0; renderMoon(); return;
    }
    if(!answered){
      moonFeedback.textContent = 'Please choose a brick colour first.'; return;
    }
    if(q < 5){
      q++; renderMoon();
    } else {
      finishRound();
    }
  });

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
    byId('safeFeedback').textContent = b.dataset.safe === curSafe.a ? 'Good choice! ✅' : 'Think again.';
  }));

  const colors = ['Red','Orange','Yellow','Green','Blue','Dark Blue'];
  document.querySelectorAll('[data-team]').forEach(b => b.addEventListener('click', () => {
    const team = b.dataset.team;
    byId('teamEditor').classList.remove('hidden');
    byId('teamTitle').textContent = 'Team ' + team;
    byId('factFields').innerHTML = colors.map((c,i)=>`<div class="fact-row"><strong>${c}</strong><input id="fact${i}" placeholder="Write a short scientific fact"></div>`).join('');
    byId('saveTeam').dataset.team = team;
  }));
  byId('saveTeam').addEventListener('click', e => {
    const team = e.target.dataset.team;
    const facts = colors.map((_,i)=>byId('fact'+i)?.value || '');
    localStorage.setItem('team-'+team, JSON.stringify(facts));
    byId('saveMsg').textContent = 'Saved on this device.';
  });

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
