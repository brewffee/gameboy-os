const $ = (selector) => document.querySelector(selector);
const __getName = (elm) => elm.getAttribute('name');


document.oncontextmenu = () => false;



document.addEventListener('mouseover', (e) => {
    $('#log').innerText = `${e.target.tagName}: #${e.target.id}, [${e.target.className}]`;
});

let focusedWindow = null; // if null, then we're focused on the desktop

// now we can make a window manager
let winMap = new Map();
// data format:
// { <pid>: { title: <string>, obj: <Element>, parent: <pid>, children: [<pid>*], rect: [left, right + 12, top, bottom + 46] } }
// { 12: { title: 'Explorer', obj: win, parent: -1, children: [13, 15], rect: [128, 112, 121, 281] } }
// { 13: { title: 'Properties - New Folder', obj: ..., parent: 12, children: [], rect: [...] } }
// { 14: { title: 'Console', obj: ..., parent: -1, children: [], rect: [...] } }
// { 15: { title: 'Preferences', obj: ..., parent: 12, children: [], rect: [...] } }

document.addEventListener('mousedown', (e) => {
    // ALL OF THESE FOCUS ON A WINDOW 

    // use coordinates to find the window
    

    // get every <window>
    const windows = document.querySelectorAll('window');

    // if the mouse lays over at least one window, then save it rq
    let windowFound = false;
    let foundWindows = [];
    for (let i = 0; i < windows.length; i++) {
        const win = windows[i];
        const rect = win.getBoundingClientRect();

        // we need to add to right and bottom since window's rect doesnt fully contain the window :/
        if (e.clientX >= rect.left && e.clientX <= rect.right + 12 && e.clientY >= rect.top && e.clientY <= rect.bottom + 46) {
            windowFound = true;
            foundWindows.push(win);
        }
    }    

    if (windowFound) {
        console.log('found windows: ', foundWindows);
        // check the length (may be multiple windows)
        if (foundWindows.length > 1) {

            // find window with the highest z-index, and grab that one
            let closestWindow = null;
            let closestZIndex = 0;
            for (let i = 0; i < foundWindows.length; i++) {
                if (i === 0) {
                    closestWindow = foundWindows[i];
                    closestZIndex = parseInt(foundWindows[i].style.zIndex);
                } else if (parseInt(foundWindows[i].style.zIndex > closestZIndex)) {
                    console.log(parseInt(foundWindows[i].style.zIndex) + ' > ' + closestZIndex);
                    closestWindow = foundWindows[i];
                    closestZIndex = parseInt(foundWindows[i].style.zIndex);
                }
            }

            focusedWindow = closestWindow;
        } else {
            focusedWindow = foundWindows[0];
        }
        
        // give the focused attribute
        focusedWindow.setAttribute('active', 'true');
        $('#focused').innerText = `\nFocused on window: ${__getName(focusedWindow)}`;
   
        // we also need to unfocus the last window we were on before
        // (unless this is the same window)
        
    } else {
        focusedWindow = null;
        // we're on the desktop then
        $('#focused').innerText = `\nFocused on the desktop`;
    }


});