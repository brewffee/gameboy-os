const $ = (selector) => document.querySelector(selector);

document.oncontextmenu = () => false;

document.addEventListener('mouseover', (e) => {
    $('#log').innerText = `${e.target.tagName}: #${e.target.id}, [${e.target.className}]`;
});

let focusedWindow = null; // if null, then we're focused on the desktop

document.addEventListener('mousedown', (e) => {
    // ALL OF THESE FOCUS ON A WINDOW 

    // use coordinates to find the window
    

    // get every <window>
    const windows = document.querySelectorAll('window');

    // if the mouse lays over at least one window, then save it rq
    let windowFound = false;
    let foundWindows = [];
    for (let i = 0; i < windows.length; i++) {
        const window = windows[i];
        const rect = window.getBoundingClientRect();

        if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
            windowFound = true;
            foundWindows.push(window);
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
                if (foundWindows[i].style.zIndex > closestZIndex) {
                    console.log(foundWindows[i].style.zIndex + ' > ' + closestZIndex);
                    closestWindow = foundWindows[i];
                    closestZIndex = foundWindows[i].style.zIndex;
                }
            }

            focusedWindow = closestWindow;
            $('#focused').innerText = `\nFocused on window: ${focusedWindow.title}`;
        } else {
            focusedWindow = foundWindows[0];
            $('#focused').innerText = `\nFocused on window: ${focusedWindow.title}`;
        }
    } else {
        focusedWindow = null;
        // we're on the desktop then
        $('#focused').innerText = `\nFocused on the desktop`;
    }
});