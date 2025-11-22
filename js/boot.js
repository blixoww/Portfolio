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
  "iceprobe --type blackwall --force",
  "daemon_inject --payload v9.77 --root",
  "flatline --countermeasures all --silent",
  "quickhack --upload breach_protocol.exe",
  "system_override --privilege admin",
  "breach_complete --extract data"
];

const badCmds = [
  null,
  null,
  "daemon_injeckt --payloaad v9.77 --root",   // erreur volontaire (sera effacée)
  null,
  "quickhack --uplaod breach_protocol.exe --fast",
  null,
  null
];

// === STATE ===
let cmdIndex = 0;
let hexInterval = null;
let finalTriggered = false;

// === HELPERS (promisified) ===
function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

function rand(min, max){ return Math.floor(min + Math.random() * (max - min)); }

// tape progressivement une chaîne dans l'élément `typing`
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

// efface progressivement le texte courant
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
    // si pas de texte, résout immédiatement
    if(i === 0) resolve();
    else step();
  });
}

// ajoute une ligne "log" (bonne commande affichée dans output)
function pushLog(text){
  const line = document.createElement('div');
  line.className = 'line';
  line.innerHTML = `<span class="prompt">netrunner@arasaka:~$</span> ${text}`;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

// démarre la génération hex (une seule fois)
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
  // si on a dépassé la fin → final
  if(index >= goodCmds.length){
    if(!finalTriggered){
      finalTriggered = true;
      startFinalSequence();
    }
    return;
  }

  const hasBad = !!badCmds[index];
  // si il y a une mauvaise version : on tape la mauvaise, on efface, puis on tape la bonne
  if(hasBad){
    // tape la mauvaise
    await typeString(badCmds[index]);
    await sleep(250 + Math.random()*300);
    // efface la mauvaise
    await deleteString();
    await sleep(150 + Math.random()*200);
  }

  // tape la commande correcte
  await typeString(goodCmds[index]);
  await sleep(120);
  // push dans le log la commande correcte
  pushLog(goodCmds[index]);

  // démarrer le hex stream au bon moment (par ex. après daemon_inject)
  if(index === 2) startHexStream();

  // cleanup typing box and avance
  typing.textContent = "";
  cmdIndex = index + 1;

  // space before next command
  await sleep(700 + Math.random()*700);

  // continue recursively
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

  // effets
  iceParticles.style.opacity = "1";
  iceParticles.style.animationPlayState = "running";
  shake.style.animationPlayState = "running";

  // message final unique
  setTimeout(()=>{
    finalBreach.classList.add("active");
    finalBreach.style.opacity = "1";
    // warning + countdown
    setTimeout(()=>{
      warning.classList.add("active");
      let t = 10;
      const el = document.querySelector('.warning-countdown');
      const iv = setInterval(()=>{
        t--;
        el.textContent = `TRACE INITIATED: 00:${t.toString().padStart(2,'0')}`;
        if(t<=0) clearInterval(iv);
      }, 1000);

      // blackout -> redirect
      setTimeout(()=>{
        blackout.style.opacity = "1";
        // small pause so user sees it
        setTimeout(()=> location.href = "index.html", 3000);
      }, 11000);

    }, 2000);
  }, 1500);
}

// === START ===
setTimeout(()=> processCommand(0), 1200);
