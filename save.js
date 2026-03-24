function saveitems(name, location) { // this basically just removes the localstorage.setitem and json.stringify
    localStorage.setItem(name, JSON.stringify((location)));
}

function Save() {
    if (localStorage) {
        localStorage.setItem('has_visited', 'true');
        saveitems('player.difficulty', player.difficulty); 
        saveitems('player.existencerank', player.existencerank);
        saveitems('player.void.energy', player.void.energy);
        saveitems('player.void.totalenergy', player.void.totalenergy);
        saveitems('player.void.action1.active', player.void.action1.active);
        saveitems('player.void.action1.progress', player.void.action1.progress); 
        saveitems('player.void.action1.totalpressed', player.void.action1.totalpressed); 
        for(let i = 0; i < Object.keys(player.void.energyupgrades).length; i++) {
            if (player.void.energyupgrades[i].level) saveitems(`player.void.energyupgrades[${i}].level`, player.void.energyupgrades[i].level);
            saveitems(`player.void.energyupgrades[${i}].cost`, player.void.energyupgrades[i].cost);
            if (player.void.energyupgrades[i].eff) saveitems(`player.void.energyupgrades[${i}].effect`, player.void.energyupgrades[i].effect);
            if (player.void.energyupgrades[i].hasOwnProperty("bought")) saveitems(`player.void.energyupgrades[${i}].bought`, player.void.energyupgrades[i].bought);
        }
    }
}

function GetItems(saved, newdecimal) { //removes json.parse and localstorage
    let location = "Error" // placeholder
    if (saved) {
        if (newdecimal) { // checks if the value your setting to needs to be in newdecimal or not
            location = new Decimal(JSON.parse(localStorage.getItem(saved)));
        } else {
            location = JSON.parse(localStorage.getItem(saved));
        }
    }
    if (location == "Error") console.error(`"` + saved + `" doesn't exist in the localstorage. Check for any mistypos if it's supposed to be.`)
    return location
}
function isFirstVisit() {
    if (!localStorage.getItem('has_visited')) {
    Save()
    return true; // First visit
    }
    return false; // Returning visitor
  }
function Get() {
    if (localStorage) {
    if (!isFirstVisit()) {
        player.difficulty = GetItems('player.difficulty', true);
        player.existencerank = GetItems('player.existencerank', false);
        player.void.energy = GetItems('player.void.energy', true);
        player.void.totalenergy = GetItems('player.void.totalenergy', true);
        player.void.action1.active = GetItems('player.void.action1.active', false);
        player.void.action1.progress = GetItems('player.void.action1.progress', true);
        player.void.action1.totalpressed = GetItems('player.void.action1.totalpressed', true);   
        for(let i = 0; i < Object.keys(player.void.energyupgrades).length; i++) {
            if (player.void.energyupgrades[i].level) player.void.energyupgrades[i].level = GetItems(`player.void.energyupgrades[${i}].level`, true);
            player.void.energyupgrades[i].cost = GetItems(`player.void.energyupgrades[${i}].cost`, true);
            if (player.void.energyupgrades[i].effect) player.void.energyupgrades[i].effect = GetItems(`player.void.energyupgrades[${i}].effect`, true);
            if (player.void.energyupgrades[i].hasOwnProperty("bought")) player.void.energyupgrades[i].bought = GetItems(`player.void.energyupgrades[${i}].bought`, false);
        }
    } else {
        Save()
    }}
}
async function expor() {
    try {
        const savedData = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          savedData[key] = localStorage.getItem(key);
        }
    
        // Convert to JSON
        const jsonData = JSON.stringify(savedData, null, 2);
    
        // Copy to clipboard
        await navigator.clipboard.writeText(btoa(jsonData));
        alert('Save data exported to clipboard!');
      } catch (error) {
        alert('An error occurred during export. Report this in the Discord server.');
      }
}

async function impor() {
    try {
        // Read clipboard text
        clipboardData = await importdata.value
        clipboardData = atob(clipboardData)
        const importedData = JSON.parse(clipboardData);
    
        // Restore to localStorage
        localStorage.clear();
        Object.keys(importedData).forEach(key => {
          localStorage.setItem(key, importedData[key]);
        });
    
        alert('Save data imported!');
        location.reload()
      } catch (error) {
          alert("An error occurred during import.")
          console.error(error)
      }
}
function HardReset() {
    localStorage.clear(); // wipe localstorage
    location.reload(true)
}
setInterval(Save, 15000); // autosave every 15 seconds
