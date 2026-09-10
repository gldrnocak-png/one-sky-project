
const views=[...document.querySelectorAll('.view')],tabs=[...document.querySelectorAll('.tabs button')];
function showView(id){
  views.forEach(v=>v.classList.toggle('active',v.id===id));
  tabs.forEach(t=>t.classList.toggle('active',t.dataset.view===id));
  window.scrollTo({top:0,behavior:'smooth'});
}
tabs.forEach(t=>t.onclick=()=>showView(t.dataset.view));
document.getElementById('startBtn').onclick=()=>showView('sun');

// SUN GAME
const sunQ=[
  {q:'The Sun is a star.',a:true},
  {q:'The Sun is smaller than Earth.',a:false},
  {q:'The Sun rotates on its axis.',a:true},
  {q:'The Sun is a solid sphere.',a:false},
  {q:'The Sun provides light and heat to Earth.',a:true}
];
let curSun=null,score=0;
sunNext.onclick=()=>{
  curSun=sunQ[Math.floor(Math.random()*sunQ.length)];
  sunQuestion.textContent=curSun.q;
  sunFeedback.textContent='';
};
document.querySelectorAll('[data-sun]').forEach(b=>b.onclick=()=>{
  if(!curSun)return;
  let ok=(b.dataset.sun==='true')===curSun.a;
  if(ok)score++;
  sunScore.textContent=score;
  sunFeedback.textContent=ok?'Correct! ⭐':'Try again.';
});

// MOON CODE - 3 ROUNDS / 18 CONCEPTS
const moonRounds = [
  {
    title: "Round 1 – Getting to Know the Moon",
    legend: [
      ["Red","Natural satellite"],
      ["Yellow","Crater"],
      ["Green","Rotation"],
      ["Blue","Revolution"],
      ["Orange","Reflects sunlight"],
      ["Dark Blue","Moon surface"]
    ],
    questions: [
      {clue:"I am the celestial body that moves around Earth.", color:"red"},
      {clue:"I am the name of the many hollow structures found on the Moon's surface.", color:"yellow"},
      {clue:"I am the movement the Moon makes around its own axis.", color:"green"},
      {clue:"I am the movement the Moon makes around Earth.", color:"blue"},
      {clue:"The Moon does not produce its own light. This property makes it visible from Earth.", color:"orange"},
      {clue:"Craters, hollows and elevations are found in this part of the Moon.", color:"darkblue"}
    ]
  },
  {
    title: "Round 2 – Phases of the Moon",
    legend: [
      ["Red","New Moon"],
      ["Yellow","First Quarter"],
      ["Green","Full Moon"],
      ["Blue","Last Quarter"],
      ["Orange","Main phase"],
      ["Dark Blue","Intermediate phase"]
    ],
    questions: [
      {clue:"I am the main phase when the Moon is not visible or is barely visible from Earth.", color:"red"},
      {clue:"I am the phase when the right half of the Moon appears illuminated.", color:"yellow"},
      {clue:"I am the phase when the whole illuminated face of the Moon is visible.", color:"green"},
      {clue:"I am the phase when the left half of the Moon appears illuminated.", color:"blue"},
      {clue:"New Moon, First Quarter, Full Moon and Last Quarter belong to this group.", color:"orange"},
      {clue:"Crescent and gibbous phases between the main phases belong to this group.", color:"darkblue"}
    ]
  },
  {
    title: "Round 3 – Moon Knowledge Master",
    legend: [
      ["Red","Earth"],
      ["Yellow","Sun"],
      ["Green","Light"],
      ["Blue","Same face"],
      ["Orange","Movement"],
      ["Dark Blue","Phase"]
    ],
    questions: [
      {clue:"What does the Moon revolve around?", color:"red"},
      {clue:"What is the source of the light that makes the Moon visible?", color:"yellow"},
      {clue:"The Moon does not produce its own. What does it reflect?", color:"green"},
      {clue:"Because of the Moon's motion, we continuously see this from Earth.", color:"blue"},
      {clue:"Rotation and revolution are examples of this.", color:"orange"},
      {clue:"The different shapes in which the Moon appears from Earth are called this.", color:"darkblue"}
    ]
  }
];

let moonRoundIndex = 0;
let moonQuestionIndex = 0;
let moonRoundScore = 0;
let moonTotalScore = 0;
let moonLocked = false;

const moonClueEl = document.getElementById('moonClue');
const moonFeedbackEl = document.getElementById('moonFeedback');
const moonSection = document.getElementById('moon');
const moonNextBtn = document.getElementById('moonNext');

const info = document.createElement('div');
info.id = 'moonInfo';
info.style.margin = '12px 0 18px';
info.style.padding = '14px';
info.style.background = '#eef7ff';
info.style.borderRadius = '12px';
moonClueEl.parentNode.insertBefore(info, moonClueEl);

function colorName(c){
  return {
    red:"Red", orange:"Orange", yellow:"Yellow",
    green:"Green", blue:"Blue", darkblue:"Dark Blue"
  }[c];
}

function renderMoonRound(){
  const r = moonRounds[moonRoundIndex];
  info.innerHTML = `
    <strong>${r.title}</strong><br>
    Question ${moonQuestionIndex+1} of 6 • Round score: ${moonRoundScore}/6 • Total: ${moonTotalScore}
    <div style="margin-top:10px;font-size:.95rem">
      ${r.legend.map(x=>`<span style="display:inline-block;margin:4px 10px 4px 0"><b>${x[0]}:</b> ${x[1]}</span>`).join('')}
    </div>`;
  moonClueEl.textContent = r.questions[moonQuestionIndex].clue;
  moonFeedbackEl.textContent = '';
  moonLocked = false;
  moonNextBtn.textContent = 'Next Question';
}

function finishMoonRound(){
  const gotPoint = moonRoundScore === 6 ? 1 : 0;
  let result = moonRoundScore === 6 ? 'Perfect round! +1 point ⭐' : `Round completed: ${moonRoundScore}/6 correct.`;
  moonTotalScore += gotPoint;

  if(moonRoundIndex < 2){
    moonFeedbackEl.innerHTML = `${result}<br><strong>Click “Next Round” to continue.</strong>`;
    moonNextBtn.textContent = 'Next Round';
  } else {
    let level = moonTotalScore === 3 ? 'Moon Master 🌟' : moonTotalScore === 2 ? 'Moon Explorer 🚀' : moonTotalScore === 1 ? 'Moon Detective 🔎' : 'Keep Exploring 🌙';
    moonFeedbackEl.innerHTML = `${result}<br><strong>Final result: ${moonTotalScore}/3 – ${level}</strong>`;
    moonNextBtn.textContent = 'Play Again';
  }
  moonLocked = true;
}

document.querySelectorAll('[data-color]').forEach(b=>b.onclick=()=>{
  if(moonLocked) return;
  const r = moonRounds[moonRoundIndex];
  const current = r.questions[moonQuestionIndex];
  const chosen = b.dataset.color;
  const ok = chosen === current.color;
  if(ok){
    moonRoundScore++;
    moonFeedbackEl.textContent = `Correct! ${colorName(chosen)} is the right brick. 🌙`;
  } else {
    moonFeedbackEl.textContent = `Not this time. Correct brick: ${colorName(current.color)}.`;
  }
  moonLocked = true;
});

moonNextBtn.onclick = ()=>{
  // First ever click simply starts the activity
  if(info.innerHTML === ''){
    renderMoonRound();
    return;
  }

  if(moonQuestionIndex < 5){
    if(!moonLocked){
      moonFeedbackEl.textContent = 'Please choose a brick colour first.';
      return;
    }
    moonQuestionIndex++;
    renderMoonRound();
    return;
  }

  // Question 6 is answered: finish or advance round
  if(!moonLocked){
    moonFeedbackEl.textContent = 'Please choose a brick colour first.';
    return;
  }

  if(moonNextBtn.textContent === 'Next Question'){
    finishMoonRound();
    return;
  }

  if(moonRoundIndex < 2){
    moonRoundIndex++;
    moonQuestionIndex = 0;
    moonRoundScore = 0;
    renderMoonRound();
  } else {
    moonRoundIndex = 0;
    moonQuestionIndex = 0;
    moonRoundScore = 0;
    moonTotalScore = 0;
    renderMoonRound();
  }
};

// SAFE INTERNET
const safe=[
  {s:'A stranger asks you to send your photo.',a:'blue'},
  {s:'A shocking news item has no clear source.',a:'yellow'},
  {s:'A website asks for your home address.',a:'blue'},
  {s:'A classmate shares another student’s photo without permission.',a:'orange'},
  {s:'A pop-up says “You won a prize! Click now!”',a:'red'},
  {s:'An online message scares you.',a:'darkblue'}
];
let curSafe=null;
safeNext.onclick=()=>{
  curSafe=safe[Math.floor(Math.random()*safe.length)];
  safeScenario.textContent=curSafe.s;
  safeFeedback.textContent='';
};
document.querySelectorAll('[data-safe]').forEach(b=>b.onclick=()=>{
  if(!curSafe)return;
  safeFeedback.textContent=b.dataset.safe===curSafe.a?'Good choice! ✅':'Think again.';
});

// TEAM SPACE
const colors=['Red','Orange','Yellow','Green','Blue','Dark Blue'];
document.querySelectorAll('[data-team]').forEach(b=>b.onclick=()=>{
  let team=b.dataset.team;
  teamEditor.classList.remove('hidden');
  teamTitle.textContent='Team '+team;
  factFields.innerHTML=colors.map((c,i)=>`<div class="fact-row"><strong>${c}</strong><input id="fact${i}" placeholder="Write a short scientific fact"></div>`).join('');
  saveTeam.dataset.team=team;
});
saveTeam.onclick=e=>{
  let team=e.target.dataset.team;
  let facts=colors.map((_,i)=>document.getElementById('fact'+i)?.value||'');
  localStorage.setItem('team-'+team,JSON.stringify(facts));
  saveMsg.textContent='Saved on this device.';
};

// FINAL TIMER
let timerInt=null;
timerBtn.onclick=()=>{
  clearInterval(timerInt);
  let n=60;
  timer.textContent=n;
  timerInt=setInterval(()=>{
    n--;
    timer.textContent=n;
    if(n<=0){
      clearInterval(timerInt);
      timer.textContent='Time! 🎉';
    }
  },1000);
};
