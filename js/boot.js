// === ELEMENTS ===
const output          = document.getElementById('output');
const typing          = document.getElementById('typing');
const finalBreach     = document.getElementById('final-breach');
const shake           = document.getElementById('shake');
const blackout        = document.getElementById('blackout');
const warning         = document.getElementById('arasaka-warning');
const hexDisplay      = document.getElementById('daemon-hex');
const iceParticles    = document.getElementById('ice-particles');
const glyphsContainer = document.getElementById('glyphs');

// === COMMANDS ===
const goodCmds = [
  "netscan --target arasaka_corpnet --verbose",
  "daemon_inject --payload v9.77 --root",
  "quickhack --upload breach_protocol.exe",
  "system_override --privilege admin",
];

const badCmds = [
  null,
  null,
  "daemon_injeckt --payloaad v9.77 --root",   
  null,
];

// === STATE ===
let cmdIndex = 0;
let hexInterval = null;
let finalTriggered = false;

function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

function rand(min, max){ return Math.floor(min + Math.random() * (max - min)); }

function typeString(str, minDelay=35, maxDelay=90){
  return new Promise(resolve=>{
    let i = 0;
    function step(){
      i++;
      typing.textContent = str.slice(0, i);
      if(i < str.length){
        setTimeout(step, rand(minDelay, maxDelay));
      } else {
        resolve();
      }
    }
    step();
  });
}

function deleteString(minDelay=25, maxDelay=60){
  return new Promise(resolve=>{
    let i = typing.textContent.length;
    function step(){
      i--;
      typing.textContent = typing.textContent.slice(0, i);
      if(i > 0){
        setTimeout(step, rand(minDelay, maxDelay));
      } else {
        resolve();
      }
    }
    if(i === 0) resolve();
    else step();
  });
}

function pushLog(text){
  const line = document.createElement('div');
  line.className = 'line';
  line.innerHTML = `<span class="prompt">netrunner@arasaka:~$</span> ${text}`;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

function startHexStream(){
  if(hexInterval) return;
  hexDisplay.style.opacity = "0.8";
  function genHex(){
    const chars = "0123456789ABCDEF";
    let s = "";
    for(let i=0;i<120;i++) s += chars[Math.floor(Math.random()*16)];
    hexDisplay.textContent = s.match(/.{8}/g).join("  ");
  }
  genHex();
  hexInterval = setInterval(genHex, 1500 + Math.random()*900);
}

// === FLOW PRINCIPAL (async) ===
async function processCommand(index){
  if(index >= goodCmds.length){
    if(!finalTriggered){
      finalTriggered = true;
      startFinalSequence();
    }
    return;
  }

  const hasBad = !!badCmds[index];
  if(hasBad){
    await typeString(badCmds[index]);
    await sleep(250 + Math.random()*300);
    await deleteString();
    await sleep(150 + Math.random()*200);
  }

  await typeString(goodCmds[index]);
  await sleep(120);
  pushLog(goodCmds[index]);

  if(index === 2) startHexStream();

  typing.textContent = "";
  cmdIndex = index + 1;
  await sleep(700 + Math.random()*700);
  processCommand(cmdIndex);
}

// === FINAL SEQUENCE ===
function startFinalSequence(){
  // glyphs
  const glyphs = "▓▒░│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αβγΔΘλπΣΩ";
  for(let i=0;i<60;i++){
    const g = document.createElement('div');
    g.className = 'glyph';
    g.textContent = glyphs[Math.floor(Math.random()*glyphs.length)];
    g.style.left = Math.random()*100 + "%";
    g.style.top  = Math.random()*100 + "%";
    g.style.animationDelay = Math.random()*5 + "s";
    g.style.animationDuration = (10 + Math.random()*12) + "s";
    glyphsContainer.appendChild(g);
  }

  iceParticles.style.opacity = "1";
  iceParticles.style.animationPlayState = "running";
  shake.style.animationPlayState = "running";

  setTimeout(()=>{
    finalBreach.classList.add("active");
    finalBreach.style.opacity = "1";
      setTimeout(()=>{
        blackout.style.opacity = "1";
        setTimeout(()=> location.href = "index.html", 3000);
      }, 11000);

    }, 2000);
}

// === START ===
setTimeout(()=> processCommand(0), 1200);
