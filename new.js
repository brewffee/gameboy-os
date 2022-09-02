const $ = (selector) => document.querySelector(selector);
const __getName = (elm) => elm.getAttribute('name');
const __getPid = (elm) => elm.getAttribute('pid');

document.oncontextmenu = () => false;

let focusedWindow = null; // if null, then we're focused on the desktop
let canDragWindow = false; // check if we're allowed to drag the window
let isDesktop = true; // ignore all window rules if we're on the desktop

// now we can make a window manager
let winMap = new Map();
// data format:
// { <pid>: { title: <string>, obj: <Element>, parent: <pid>, children: [<pid>*], rect: [left, right + 12, top, bottom + 46] } }
// { 12: { title: 'Explorer', obj: win, parent: -1, children: [13, 15], rect: [128, 112, 121, 281] } }
// { 13: { title: 'Properties - New Folder', obj: ..., parent: 12, children: [], rect: [...] } }
// { 14: { title: 'Console', obj: ..., parent: -1, children: [], rect: [...] } }
// { 15: { title: 'Preferences', obj: ..., parent: 12, children: [], rect: [...] } }
// .. and so on

// also add an array to help us keep track of the order of the windows
winMap.set('__order', []);

// Usually we store windows when they're created, but we're not quite there
// Just add the pre-initialized windows to the map
window.onload = () => {
    const windows = document.querySelectorAll('window');
    for (let i = 0; i < windows.length; i++) {
        const title = __getName(windows[i]);
        const pid = __getPid(windows[i]);
        const parent = -1; // parent of the desktop is -1
        const children = []; // not implemented

        const { left, top, right, bottom } = windows[i].getBoundingClientRect();
        const rect = [left, right + 12, top, bottom + 46];

        winMap.set(pid, { title, obj: windows[i], parent, children, rect });

        // the window won't be in the order already, so we can add it w/ no issue
        winMap.get('__order').push(pid);

        // set the z-index of the window to be the same as its index in the order array
        windows[i].style.zIndex = 100 - winMap.get('__order').indexOf(pid);
    }

    console.log(winMap);

    // we're on the desktop
    isDesktop = true;
}


document.addEventListener('mousedown', (e) => {
    // if we click the desktop and are already there then no need to do anything
    if (e.target.tagName === 'BODY' && isDesktop) {
        return;
    }

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
   
        // update the order of the windows
        const pid = __getPid(focusedWindow);
        const index = winMap.get('__order').indexOf(pid);

        // and if we're already at the beginning, then we don't need to do anything
        if (index !== 0) {
            const order = [...winMap.get('__order')];
            
            // move to front 
            order.splice(0, 0, ...order.splice(index, 1));
            winMap.set('__order', order);
        }

        // now that order is updated, we can update the z-index and the color of the last window, if it wasn't the desktop
        if (!isDesktop) {
            // set the active attribute on the last window
            const lastWindow = winMap.get(winMap.get('__order')[1]).obj;
            lastWindow.setAttribute('active', 'false');

            // set the z-index of every other tem
            for (let i = 0; i < winMap.get('__order').length; i++) {
                const pid = winMap.get('__order')[i];
                console.log(pid);
                const window = winMap.get(winMap.get('__order')[i]).obj;
                window.style.zIndex = 100 - i;
            }
        } else {
            // set our z-index
            focusedWindow.style.zIndex = 101;

            // and move the others back
            for (let i = 0; i < winMap.get('__order').length; i++) {
                const pid = winMap.get('__order')[i];
                if (pid !== pid) {
                    const window = winMap.get(winMap.get('__order')[i]).obj;
                    window.style.zIndex = 100 - i;
                }
            }
        }

        // we clicked on a window? cool
        // what did we click tho? the titlebar or its content?
        console.log(e.target.className);
        if (e.target.className.startsWith('titlebar') || e.target.tagName === 'TITLEBAR') {
            // clicked on the titlebar, we have access to titlebar-specific functions
            const titlebar = e.target;
            while (!titlebar.tagName === 'TITLEBAR') {
                titlebar = titlebar.parentElement;
            }

            // if we're using lmb, we can enter drag mode
            if (e.button === 0) {
                canDragWindow = true; // for the mousemove event
            }
            $('#tb').innerText = `\nTitlebar selected, mouse button: ${e.button}`;
        } else {
            $('#tb').innerText = ``;
        }
        console.log(winMap);

        // we're done, we can reset isDesktop
        isDesktop = false;
    } else {
        // we're on the desktop then
        focusedWindow = null;        
        isDesktop = true;
        $('#focused').innerText = `\nFocused on the desktop`;

        // mark the last window as inactive
        const lastWindow = winMap.get(winMap.get('__order')[0]).obj;
        lastWindow.setAttribute('active', 'false');
    }
});

document.addEventListener('mousemove', (e) => {
    // we'll need to add a check if its actually the resize state
    // instead of the drag state
    
    // check if we're on the last 4 pixels of a window
    // if we're on those pixels, we can set the cursor to resize (direction)
    // if we are using lmb, we are definitely resizing, and not dragging

    // () ...
    

    if (canDragWindow) { 
        // we're actually dragging now !!
        const { top, left } = focusedWindow.getBoundingClientRect();
        const { movementX, movementY } = e;

        focusedWindow.style.top = `${top + movementY}px`;
        focusedWindow.style.left = `${left + movementX}px`;
    }


});

document.addEventListener('mouseup', (e) => {
    if (canDragWindow) {
        // end the drag state 
        canDragWindow = false;
    }
});




// just for debug ----------------------------------
document.addEventListener('mouseover', (e) => {
    $('#log').innerText = `${e.target.tagName}: #${e.target.id}, [${e.target.className}]`;
});


setInterval(() => {
    const newarr = [...winMap.get('__order')];

    // { <pid>: { title: <string>, obj: <Element>, parent: <pid>, children: [<pid>*], rect: [left, right + 12, top, bottom + 46] } }
    $('#ws').innerText = winMap.get('__order').join(', ') + ' isDesktop: ' + isDesktop;
        for (let i = 0; i < newarr.length; i++) {
            const pid = newarr[i]
            const { title, obj, parent, children, rect } = winMap.get(pid);
            $('#ws').innerText += `\n{ ${pid}: { title: ${title}, obj: ..., parent: ${parent}, children: ${children}, rect: [${rect[0]}, ${rect[1]}, ${rect[2]}, ${rect[3]}] } }`;
        }
} , 30);

// -------------------------------------------------