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
    if ((e.target.tagName === 'BODY' && isDesktop) || e.target.tagName === 'HANDLE') {
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
        if (e.pageX >= rect.left && e.pageX <= rect.right + 12 && e.pageY >= rect.top && e.pageY <= rect.bottom + 46) {
            windowFound = true;
            foundWindows.push(win);
        }
    }    

    if (windowFound) {        
        console.log('found windows: ', foundWindows);
        // check the length (may be multiple windows)
        if (foundWindows) {
            // find window with the highest z-index, and grab that one
            let closestWindow = null;
            let closestZIndex = 0;
            for (let i = 0; i < foundWindows.length; i++) {
                console.log('Testing if ' + foundWindows[i].style.zIndex + ' is greater than ' + closestZIndex + ': ' + (foundWindows[i].style.zIndex > closestZIndex));
                if (i === 0) {
                    closestWindow = foundWindows[i];
                    closestZIndex = parseInt(foundWindows[i].style.zIndex);
                } else if (parseInt(foundWindows[i].style.zIndex) > closestZIndex) {
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

        // now that order is updated, we can update the color of the last window, if it wasn't the desktop
        if (!isDesktop) {
            // set the active attribute on the last window
            const lastWindow = winMap.get(winMap.get('__order')[1]).obj;
            lastWindow.setAttribute('active', 'false');
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

        // set all z-indexes to be the same as their index in the order array
        for (let i = 0; i < winMap.get('__order').length; i++) {
            const pid = winMap.get('__order')[i];
            const win = winMap.get(pid).obj;
            win.style.zIndex = 100 - i;
        }

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
    if (canDragWindow) { 
        // we're actually dragging now !!
        const { top, left } = focusedWindow.getBoundingClientRect();
        const { movementX, movementY } = e;

        focusedWindow.style.top = `${top + movementY}px`;
        focusedWindow.style.left = `${left + movementX}px`;
    }
});

let canResizeWindow = false;

document.addEventListener('mousemove', (e) => {
    // if the target is a <window> check what position of that element we're on
    if (e.target.tagName === 'WINDOW') {
        // where is the mouse, and where is the window??
        const { pageX, pageY } = e;
        const { top, left, right, bottom, width, height } = e.target.getBoundingClientRect();

        // do some math to figure out where the mouse is
        const x = pageX - left;
        const y = pageY - top;

        console.log('x: ' + x + ', y: ' + y);

        // if either is negative, then we're on its top or left border
        // if either is greater than the width/height, then we're on its bottom or right border
        // if two conditions are met, we're on the corner
        if (x < 0 && y < 0 || x < 0 && y > (bottom - top) || x > (right - left) && y < 0 || x > (right - left) && y > (bottom - top)) {
            // we're on the corner, we can resize
            canResizeWindow = true;
            console.log('corner resizing is allowed');
        } else if (x < 0 || y < 0 || x > (right - left) || y > (bottom - top)) {
            // we're on the border, we can resize
            canResizeWindow = true;
            console.log('resizing is allowed');
        }

        // change cursors depending on condition
        // (!) corners might need their values to be a little bigger ??
        //     top left: x < 0 && y < 0 
        //     top right: x > (right - left) && y < 0
        //     bottom left: x < 0 && y > (bottom - top)
        //     bottom right: x > (right - left) && y > (bottom - top)
        //
        //     top: x > 0 && x < (right - left) && y < 0
        //     bottom: x > 0 && x < (right - left) && y > (bottom - top)
        //     left: x < 0 && y > 0 && y < (bottom - top)
        //     right: x > (right - left) && y > 0 && y < (bottom - top)
        
        let cursor;
        let dir = cursor;
        if (x < 0 && y < 0) cursor = 'nw-resize';
        else if (x < 0 && y > (bottom - top)) cursor = 'sw-resize';
        else if (x > (right - left) && y < 0) cursor = 'ne-resize';
        else if (x > (right - left) && y > (bottom - top)) cursor = 'se-resize';
        // ---------------
        else if (x > 0 && x < (right - left) && y < 0) cursor = 'n-resize';
        else if (x > 0 && x < (right - left) && y > (bottom - top)) cursor = 's-resize';
        else if (x < 0 && y > 0 && y < (bottom - top)) cursor = 'w-resize';
        else if (x > (right - left) && y > 0 && y < (bottom - top)) cursor = 'e-resize';
        else cursor = 'default';

        // there will be a function that handles cursor names later, but rn use default css cursor
        document.body.style.cursor = cursor;

        // if we click, pass to next if statement
        if (e.buttons === 1) {
            dragging = winMap.get(__getPid(e.target)).obj;
            focusedWindow = dragging;

        }
    }

    // we can resize until we mouseup
    // isDragging = true; // for global scope
    // top left: +width +height , -top -left
    // top right: +width +height, -top 
    // bottom left: +width +height, -left
    // bottom right: +width +height
    //
    // top: +height, -top
    // bottom: +height
    // left: +width, -left
    // right: +width

    if (e.buttons === 1 && canResizeWindow) {
        // isDragging = true;
        let { obj } = winMap.get(__getPid(e.target));
        // dragWindow = obj; // pass to mous
        // start the hell that is this fucking statement

        // corners (actions with two directions)
        if (cursor === 'nw-resize') { // top left
            // update horizontally (cannot go below 192px)
            if (!(height + (left - pageX) <= 192)) {
                obj.style.width = `${width + (left - pageX)}px`;
                obj.style.left = `${pageX}px`;
            }

            // update vertically (cannot go below 72px)
            if (!(height + (top - pageY) <= 72)) {
                obj.style.height = `${height + (top - pageY)}px`;
                obj.style.top = `${pageY}px`;
            }
        }
        
    }
});

document.addEventListener('mouseout', (e) => {
    if (canResizeWindow) {
        canResizeWindow = false;
        document.body.style.cursor = 'default';
    }
} );


    


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