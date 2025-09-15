// WINGO v2 script
const getBtn = document.getElementById('getBtn');
const periodInput = document.getElementById('periodInput');
const resultSizeEl = document.getElementById('resultSize');
const resultNumberEl = document.getElementById('resultNumber');
const resultColorEl = document.getElementById('resultColor');
const historyList = document.getElementById('historyList');
const activeUsersEl = document.getElementById('activeUsers');
const usersPopup = document.getElementById('usersPopup');
const popSound = document.getElementById('popSound');

let cooldown = false;
let cooldownInterval = null;

// color logic per user specification
function colorForDigit(d){
  // digits are numbers 0-9
  // mapping per final: 5->green+purple,6->red,7->green,8->red,9->green,0->purple+red,1->green,2->red,3->red,4->red
  if(d === 5) return {label: 'GREEN + PURPLE', classes: ['green','purple']};
  if(d === 6) return {label: 'RED', classes: ['red']};
  if(d === 7) return {label: 'GREEN', classes: ['green']};
  if(d === 8) return {label: 'RED', classes: ['red']};
  if(d === 9) return {label: 'GREEN', classes: ['green']};
  if(d === 0) return {label: 'RED + PURPLE', classes: ['red','purple']};
  if(d === 1) return {label: 'GREEN', classes: ['green']};
  if(d === 2) return {label: 'RED', classes: ['red']};
  if(d === 3) return {label: 'RED', classes: ['red']};
  if(d === 4) return {label: 'RED', classes: ['red']};
  return {label: 'GREEN', classes: ['green']};
}

function showHistory(entry){
  const el = document.createElement('div');
  el.className = 'history-item';
  el.innerHTML = `<div>#${entry.index} • ${entry.size} ${entry.number}</div><div class="${entry.colorClass}">${entry.colorLabel}</div>`;
  historyList.prepend(el);
  while(historyList.children.length > 50) historyList.removeChild(historyList.lastChild);
}

let historyIndex = 1;

function getPrediction(){
  if(cooldown) return;
  const period = (periodInput.value || '').trim();
  if(!period){
    alert('Enter a Period Number.');
    return;
  }
  // use last digit of period for prediction (as before)
  const lastChar = period.slice(-1);
  const digit = parseInt(lastChar,10);
  if(Number.isNaN(digit)){
    alert('Period must end with a digit 0-9.');
    return;
  }

  const size = (digit >= 5) ? 'BIG' : 'SMALL';
  const colorInfo = colorForDigit(digit);
  // display
  resultSizeEl.textContent = size;
  resultNumberEl.textContent = String(digit);
  resultColorEl.textContent = colorInfo.label;
  // set classes
  resultNumberEl.className = 'result-number ' + (colorInfo.classes[0] || '');
  resultColorEl.className = 'result-color ' + (colorInfo.classes.join(' ') || '');

  // sound
  try{ popSound.currentTime = 0; popSound.play(); }catch(e){}

  // add to history
  showHistory({ index: historyIndex++, size, number: digit, colorLabel: colorInfo.label, colorClass: colorInfo.classes[0] || '' });

  // start cooldown 60s
  startCooldown(60);
}

// cooldown function with visible countdown on button
function startCooldown(seconds){
  cooldown = true;
  let remaining = seconds;
  getBtn.disabled = true;
  const originalText = getBtn.textContent;
  getBtn.textContent = `Wait ${remaining}s`;
  cooldownInterval = setInterval(()=>{
    remaining--;
    if(remaining <= 0){
      clearInterval(cooldownInterval);
      cooldown = false;
      getBtn.disabled = false;
      getBtn.textContent = originalText;
    } else {
      getBtn.textContent = `Wait ${remaining}s`;
    }
  },1000);
}

// active users auto-refresh and popup
function refreshActive(){
  const base = 10000;
  const extra = Math.floor(Math.random()*5000) + 100;
  const n = base + extra;
  activeUsersEl.textContent = 'Active Users: ' + n.toLocaleString();
  // show small popup briefly
  usersPopup.textContent = 'Users online: ' + n.toLocaleString();
  usersPopup.classList.remove('hidden');
  usersPopup.classList.add('show');
  setTimeout(()=>{ usersPopup.classList.remove('show'); usersPopup.classList.add('hidden'); }, 1600);
}
setInterval(refreshActive, 3000);
refreshActive();

// wire button and enter key
document.getElementById('getBtn').addEventListener('click', getPrediction);
periodInput.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') getPrediction(); });
