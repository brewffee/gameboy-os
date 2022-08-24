const $ = (x) => document.querySelector(`#${x}`);

let mouseLTime = 0; // for mouse hold tracking
let mouseRTime = 0; // ^

let curBtn = null;  // for tracking selected button
let curW = null;    // current window
let lastActiveWindow = null; // if we need to go back to the last window
let curHandle = null; // current drag handle

// Log the classlist of the element we're hovering over
document.addEventListener('mouseover', (e) => {
    $("dbg-li").innerText = `Selected: #${e.target.id}, [${e.target.classList}]`;
});

const setCursor = (x) => {
    document.body.style.cursor = `url(cursors/${x}.png), auto`;
}

const defocusAll = () => {  
    Array.from(document.getElementsByClassName('wcon')).forEach(x => x.style["z-index"] = 10);
    //Array.from(document.getElementsByClassName('focused')).forEach(x => x.classList.remove('focused'));

    Array.from(document.getElementsByClassName('titlebar-title')).forEach(x => {
        // Remove " (focused)" from the titlebar title
        x.innerText = x.innerText.replace(/ \(focused\)/, "");
    });

    // For every .deco-i, we need to change the background image url to ${x}-l.png
    Array.from(document.getElementsByClassName('deco-i')).forEach(i => {
        if (!i.style.background.includes('-l.png')) {
            i.style.background = i.style.background.replace('.png', '-l.png');
        }
    });

    // For every .titlebar-body and .titlebar, we need to force the bg color to #7c6d80
    Array.from(document.getElementsByClassName('titlebar-body')).forEach(x => {
        x.style.background = '#7c6d80';
    });    

    Array.from(document.getElementsByClassName('titlebar')).forEach(x => {
        x.style.background = '#7c6d80';
    });

}

window.onload = () => { defocusAll(); }

const setFocus = (x) => {
    //x.classList.add('focused');
    x.parentElement.style["z-index"] = 100;

    // If we're on a window-host class, find a child titlebar-title
    if (x.classList.contains('window-host')) {
        title = x.querySelector('.titlebar-title'); // should exist
        title.innerText += ' (focused)';
    }

    // For every .deco-i, we need to change the background image url to ${x}.png, though we need to get to the host window first
    let host = x;
    while (!host.classList.contains('window-host')) {
        host = host.parentElement;
    }

    // For every .deco-i, we need to change the background image url to ${x}.png
    Array.from(host.getElementsByClassName('deco-i')).forEach(x => {
        if (x.style.background.includes('-l.png')) {
            x.style.background = x.style.background.replace('-l.png', '.png');
        }
    });

    // Set the host's titlebar to the correct color
    host.getElementsByClassName('titlebar-body')[0].style.background = '#382843';
    host.getElementsByClassName('titlebar')[0].style.background = '#382843';

}

// onWindowEvent
// For now, just get the information on load
window.onload = () => {
    let wins = document.getElementsByClassName('wcon');

    let wcount = Array.from(wins).length;

    $('dbg-win').innerText = `Workspace: (${wcount}), `

    Array.from(wins).forEach(x => $('dbg-win').innerText += '[' + x.id + ']')
}

// Stop the right click menu from appearing ()
document.oncontextmenu = function() {
    return false;
}

// Handle onmousedown events from js instead :(
document.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('titlebar-obj')) { 
        let titlebar, window;

        // Loop until we find the source titlebar element
        titlebar = e.target;
        while (!titlebar.classList.contains('titlebar')) {
            titlebar = titlebar.parentElement;
        }

        // Loop until we find the source window element
        window = titlebar.parentElement;
        while (!window.classList.contains('window-host')) {
            window = window.parentElement;
        }

        if (e.button == 2) {
            $("dbg").innerText = `Focused on titlebar of window ${window.id}, defocusing other windows`;
            $("dbg").innerText += `\nOpening the context menu for the titlebar of window ${window.id}`;
        } else {
            $("dbg").innerText = `Focused on titlebar of window ${window.id}, defocusing other windows`;
        }

        // Switch focus to the current window
        defocusAll();
        setFocus(titlebar);
        setFocus(window);        
    } else if (e.target.classList.contains('content-obj')) {
        let titlebar, window;

        // Loop until we find the source window element
        window = e.target;
        while (!window.classList.contains('window-host')) {
            window = window.parentElement;
        }

        // Get that window's titlebar
        titlebar = window.getElementsByClassName('titlebar')[0];

        $("dbg").innerText = `Focused on window ${window.id}, defocusing other windows`;

        // Switch focus to the current window
        defocusAll();
        setFocus(window);
        setFocus(titlebar);
    } else if (e.target.classList.contains('desktop')) {
        $("dbg").innerText = 'Focused on desktop, removing focus from all windows';
        defocusAll();
    } else if (e.target.parentElement.classList.contains('taskbar-btn-h') && e.target.classList.contains('taskbar-btn')) {
        $("dbg").innerText = 'Focused on a taskbar button, removing focus from all windows';
        defocusAll();

        curBtn = e.target.parentElement;
        $('dbg').innerText += "\nSelected a taskbar-btn! Trying to handle button event";

        if (curW) {
            // discard curW and move it to lastActiveWindow
            lastActiveWindow = curW;
        }

        Array.from(e.target.parentElement.children).forEach(x => {
            if (!x.style.background.includes('-l.png')) {
                x.style.background = x.style.background.replace('.png', '-l.png');
            }

            if (x.innerText != "") {
                x.style.textShadow = "2px 2px 0px #382843"
            }
        });
    } else if (e.target.classList.contains('taskspace-obj')) {
        $("dbg").innerText = 'Focused on taskbar free space, removing focus from all windows';
        defocusAll();
    } else if (e.target.classList.contains('titlebar-btn')) {
        $("dbg").innerText = 'Focused on a titlebar button, removing focus from all windows';
        // focus the window that the button is in
        let window = e.target.parentElement;
        while (!window.classList.contains('window-host')) {
            window = window.parentElement;
        }

        // get its titlebar
        let titlebar = window.getElementsByClassName('titlebar')[0];

        if (curW != window) {
            defocusAll();
            
            // discard that window and focus the new one
            setFocus(window);
            setFocus(titlebar);
        }

        curBtn = e.target;
        $('dbg').innerText += "\nSelected a titlebar-btn! Trying to handle button event";

        // we're keeping focus on the window for now
        // just light up the button
        if (!curBtn.style.background.includes('-l.png')) {
            curBtn.style.background = curBtn.style.background.replace('.png', '-l.png');
        }

    }
});

document.addEventListener('mousedown', (e) => {
    e.button === 0 ? mouseLTime = Date.now() : mouseRTime = Date.now();

    // this needs to be updated for every single titlebar object :(

    // get the clicked window (from a titlebar-obj)
    if (e.target.classList.contains('titlebar-obj')) {

        curW = e.target;
        while (!curW.classList.contains('window-host')) {
            curW = curW.parentElement;
        }
    } else if (e.target.classList.contains('drag-obj')) {
        // drag-objs are resize handles
        curHandle = e.target;

        curW = curHandle.parentElement;
        while (!curW.classList.contains('window-host')) {
            curW = curW.parentElement;
        }

        // we have a drag object ??? focus that shit !!!
        defocusAll();
        setFocus(curW);
        setFocus(curW.getElementsByClassName('titlebar')[0]);

    }
});

document.addEventListener('mousemove', (e) => {
    // either moving the window or resizing it
    if (e.buttons === 1 && curW  && !curHandle) {
        setCursor("move");

        const { top, left } = curW.getBoundingClientRect();

        // gets the direction of the mouse as it moves
        const { movementX, movementY } = e;

        // update the position of the window
        curW.style.top = `${top + movementY}px`;
        curW.style.left = `${left + movementX}px`;
    } else if (e.buttons === 1 && curHandle && curW) {
        // get the current window
        const { top, left, width, height } = curW.getBoundingClientRect();
        const { pageX, pageY } = e;

        const { style } = curW;

        // for top left resizing, subtract from the top and left pos values, as well as maintain width and height
        if (curHandle.classList.contains('window-draghandle-topL')) {
            setCursor("nw-resize");
            
            // update horizontal position if the window isnt gonna get any smaller
            if (!(width + (left - pageX) <= 192)) {
                style.left = `${pageX}px`;
                style.width = `${width + (left - pageX)}px`;
            }

            // update vertical position if the window isnt gonna get any smaller
            if (!(height + (top - pageY) <= 64)) {
                style.top = `${pageY}px`;
                style.height = `${height + (top - pageY)}px`;
            }

        }

        // for top resizing, subtract from the top pos value, and maintain the height 
        else if (curHandle.classList.contains('window-draghandle-top')) {
            setCursor("n-resize");
            
            // update vertical position if the window isnt gonna get any smaller
            if (!(height + (top - pageY) <= 64)) {
                style.top = `${pageY}px`;
                style.height = `${height + (top - pageY)}px`;
            }

        }

        // for top right resizing, subtract from the top pos value, add to the width, and maintain the height
        else if (curHandle.classList.contains('window-draghandle-topR')) {
            setCursor("ne-resize");

            // calculate what px size we need, considering the offset of the window's position and current width
            const newWidth = pageX - left;
            
            // update horizontal position if the window isnt gonna get any smaller
            if (!(newWidth <= 192)) {
                style.width = `${newWidth}px`;
            }

            // update vertical position if the window isnt gonna get any smaller
            if (!(height + (top - pageY) <= 64)) {
                style.top = `${pageY}px`;
                style.height = `${height + (top - pageY)}px`;
            }

        }

        // for left resizing, subtract from the left pos value, and maintain the width
        else if (curHandle.classList.contains('window-draghandle-left')) {
            setCursor("w-resize");

            // update horizontal position if the window isnt gonna get any smaller
            if (!(width + (left - pageX) <= 192)) {
                style.left = `${pageX}px`;
                style.width = `${width + (left - pageX)}px`;
            }

        }

        // for right resizing, add to the width
        else if (curHandle.classList.contains('window-draghandle-right')) {
            setCursor("e-resize");

            // calculate what px size we need, considering the offset of the window's position and current width
            const newWidth = pageX - left;

            // update horizontal position if the window isnt gonna get any smaller
            if (!(newWidth <= 192)) {
                style.width = `${newWidth}px`;
            }

        }

        // for bottom left resizing, subtract from left pos value, add to the height, and maintain the width
        else if (curHandle.classList.contains('window-draghandle-bottomL')) {
            setCursor("sw-resize"); 

            // update horizontal position if the window isnt gonna get any smaller
            if (!(width + (left - pageX) <= 192)) {
                style.left = `${pageX}px`;
                style.width = `${width + (left - pageX)}px`;
            }

            // calculate what px size we need, considering the offset of the window's position and current height
            const newHeight = pageY - top;

            // update vertical position if the window isnt gonna get any smaller
            if (!(newHeight <= 64)) {
                style.height = `${newHeight}px`;
            }

        }

        // for bottom resizing, add to the height
        else if (curHandle.classList.contains('window-draghandle-bottom')) {
            setCursor("s-resize");

            // calculate what px size we need, considering the offset of the window's position and current height
            const newHeight = pageY - top;

            // update vertical position if the window isnt gonna get any smaller
            if (!(newHeight <= 64)) {
                style.height = `${newHeight}px`;
            }

        }

        // for bottom right resizing, add to the width and height
        else if (curHandle.classList.contains('window-draghandle-bottomR')) {
            setCursor("se-resize");

            // calculate what px size we need, considering the offset of the window's position and current height
            const newWidth = pageX - left;
            const newHeight = pageY - top;

            // update horizontal position if the window isnt gonna get any smaller
            if (!(newWidth <= 192)) {
                style.width = `${newWidth}px`;
            }

            // update vertical position if the window isnt gonna get any smaller
            if (!(newHeight <= 64)) {
                style.height = `${newHeight}px`;
            }

        }
    }
});

document.addEventListener('mouseup', (e) => {
    if (e.button === 0) {
        if ((Date.now() - mouseLTime) > 80) {
            //$("dbg").innerText += `\nLeft mouse was held down for ${(Date.now() - mouseLTime) / 1000}s`;
        } else {
            //$("dbg").innerText += `\nLeft mouse was clicked`;
        }
    } else {
        if ((Date.now() - mouseRTime) > 80) {
            //$("dbg").innerText += `\nRight mouse was held down for ${(Date.now() - mouseRTime) / 1000}s`;
        } else {
            //$("dbg").innerText += `\nRight mouse was clicked`;
        }
    }

    // deselect window, and reset cursor
    curW = null;
    curHandle = null;
    setCursor("default");

    // if we stop holding a button
    if (curBtn != null) {
        $('dbg').innerText += "\nLost focus of curBtn! Deselecting...";

        if (curBtn.classList.contains('taskstart-obj')) {
            // createWindow('explorer-min', fp.special["Programs"]);
            //
            // fp = {
            //     special: {
            //         "Programs": { ... },
            //         ... 
            //     },
            //     root: { ... },
            //     ...
            // }
            //
            // createWindow of type 'explorer' will open a window with the given path,
            // and will set the window's title to the name of the current directory

            $('dbg').innerText += "\n(NOT_IMPL) Creating window of type 'explorer-min' to open path: fp.special['Programs']";
        }

        if (curBtn.classList.contains('taskbar-btn-h')) {
            Array.from(curBtn.children).forEach(x => {
                if (x.style.background.includes('-l.png')) {
                    x.style.background = x.style.background.replace('-l.png', '.png');
                }

                if (x.innerText != "") {
                    x.style.textShadow = "2px 2px 0px #000"
                }
            });
        } else if (curBtn.classList.contains('titlebar-btn')) {
            if (curBtn.style.background.includes('-l.png')) {
                curBtn.style.background = curBtn.style.background.replace('-l.png', '.png');
            }
            $('dbg').innerText += "\n(NOT_IMPL) Titlebar action " + curBtn.id;
        }

        curBtn = null;
    }
});

// Capture doubleclicks
document.addEventListener('dblclick', (e) => {
    if (e.button === 0) {
        //$("dbg").innerText += `\nLeft mouse was doubleclicked`;
    } else {
        //$("dbg").innerText += `\nRight mouse was doubleclicked`;
    }
} );
