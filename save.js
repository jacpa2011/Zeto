function saveitems(name, location) { // this basically just removes the localstorage.setitem and json.stringify
    localStorage.setItem(name, JSON.stringify((location)));
}

function Save() {
    if (localStorage) {
        localStorage.setItem('has_visited', 'true');
        saveitems('player.void.traces', player.void.traces);
        saveitems('player.void.action1.active', player.void.action1.active);
        saveitems('player.void.action1.progress', player.void.action1.progress);  
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
      return true; // First visit
    }
    return false; // Returning visitor
  }
function Get() {
    if (localStorage) {
    if (!isFirstVisit()) {
        player.void.traces = GetItems('player.void.traces', true);
        player.void.action1.active = GetItems('player.void.action1.active', false);
        player.void.action1.progress = GetItems('player.void.action1.progress', true);
    } else {
        Save()
    }}
}
let isHardResetting = false;
function HardReset() {
    isHardResetting = true;
    localStorage.clear(); // wipe localstorage
    location.reload(true)
}
window.addEventListener('beforeunload', () => {
    if (!isHardResetting) Save();
});
setInterval(Save, 15000); // autosave every 15 seconds
