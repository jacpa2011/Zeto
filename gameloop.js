function makeGibberish(length = 10) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function UpdateDisplay() {
    const up = player.void.energyupgrades;
    const existencerank = document.getElementById('existencerank');
    existencerank.textContent = player.existencerank;
    const energy = document.getElementById('energy');
    energy.textContent = format(player.void.energy);
    for(let i = 0; i < Object.keys(up).length; i++) {
        const upeff = document.getElementById(`up${i+1}-eff`);
        const upcost = document.getElementById(`up${i+1}-cost`);
        if (up[i].scaling1 && up[i].level.gte(up[i].scaling1)) {
            upcost.classList.add('scaledcost1');
        } else {
            upcost.classList.remove('scaledcost1');
        }
        const uplvl = document.getElementById(`up${i+1}-lvl`);
        if (uplvl) {
            uplvl.textContent = format(up[i].level, 0);
        }
        upcost.textContent = format(up[i].cost);
        if (upeff) {
        upeff.textContent = format(up[i].effect);
        }
        if (i == 0) continue
        if (up[i-1].hasOwnProperty("bought")) {
            if (up[i-1].bought && i != 0) {
                document.getElementById(`up${i+1}`).style.display = 'block';
            } else {
                document.getElementById(`up${i+1}`).style.display = 'none';
            }
        }
        if (up[i-1].hasOwnProperty("level")) {
            if (up[i-1].level.gte(1) && i != 0) {
                document.getElementById(`up${i+1}`).style.display = 'block';
            } else {
                document.getElementById(`up${i+1}`).style.display = 'none';
            }
        }
    }
    if (up[2].bought) {
        document.getElementById('Time').style.display = 'block';
    } else {
        document.getElementById('Time').style.display = 'none';
    }
    const seconds = document.getElementById('seconds');
    seconds.textContent = format(player.void.timepassed, 2);
    const rate = document.getElementById('rate');
    rate.textContent = format(player.void.rate);
}

function UpdateStyles() {
    const progressBarUI = document.getElementById('action1pbui');
    const progressPercent = player.void.action1.progress.div(player.void.action1.duration).min(1).mul(100);
    progressBarUI.style.width = progressPercent.toFixed(2) + '%';
    const energydisplay = document.getElementById('energydisplay');
    if (player.void.totalenergy.gt(0)) { 
        energydisplay.style.display = 'flex';
    } else {
        energydisplay.style.display = 'none'; 
    }
}
function CalculateEnergyGain() {
    let energygain = new Decimal(1);
    const up = player.void.energyupgrades;
    energygain = energygain.mul(up[0].effect);
    if (up[1].bought) {
        energygain = energygain.mul(up[1].effect);
    }
    return energygain;
}
function CalculateUpgrade() {
    const up = player.void.energyupgrades;
    up[0].effect = new Decimal(2).pow(up[0].level);
    up[1].effect = player.void.action1.totalpressed.add(1).pow(0.33);
    up[0].cost = new Decimal(10).mul(new Decimal(2.25).pow(up[0].level));
    if (up[0].level.gte(up[0].scaling1)) up[0].cost = up[0].cost.pow(1.1).mul(1.5)
    up[1].cost = new Decimal(50)
    up[2].cost = new Decimal(5000)
    for(let i = 0; i < Object.keys(player.void.energyupgrades).length; i++) {
        const upgrade = document.getElementById(`up${i+1}`);
        if (upgrade) {
            if (up[i].bought) {
                upgrade.classList.add('voidbought');
            } else {
                upgrade.classList.remove('voidbought');
            }
        }
    }
}
function productionloop(diff) {
    const up = player.void.energyupgrades;
    CalculateUpgrade();
    let energygain = CalculateEnergyGain();
    if (player.void.action1.active) {
        player.void.action1.progress = player.void.action1.progress.add(new Decimal(diff));
        if (player.void.action1.progress.gte(player.void.action1.duration)) {
            player.void.energy = player.void.energy.add(energygain);
            player.void.totalenergy = player.void.totalenergy.add(energygain);
            player.void.action1.totalpressed = player.void.action1.totalpressed.add(1);
            player.void.action1.active = false;
            player.void.action1.progress = new Decimal(0);
        }
    }
    if(up[2].bought) {
        player.void.timepassed = player.void.timepassed.add(new Decimal(diff).mul(player.void.rate));
    }
}
window.addEventListener('click', enableMusic);
window.addEventListener('keydown', enableMusic);
function enableMusic() {
    musicEnabled = true;
    window.removeEventListener('click', enableMusic);
    window.removeEventListener('keydown', enableMusic);
}
var LastUpdate = Date.now()
function Mainloop() {
    var diff = (Date.now() - LastUpdate) / 1000
    document.getElementById('random1').textContent = makeGibberish();
    UpdateDisplay()
    UpdateStyles()
    productionloop(diff)
    if (player.difficulty.eq(1)) {
        difficultyimage.style.boxShadow = '0 0 10px 5px white';
        difficultytext.textContent = 'The First Difficulty';
        if (!audio && musicEnabled) {
            audio = new Audio('Music/Glimpsing Infinity.mp3');
            audio.loop = true;
            audio.volume = 0.5;
            audio.play();
        }
    } else {
        if (difficultyimage) difficultyimage.style.boxShadow = '';
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            audio = null;
        }
    }

    LastUpdate = Date.now()
}
setInterval(Mainloop, 33)