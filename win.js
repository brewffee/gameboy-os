const $ = (x) => document.querySelector(`#${x}`);

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
        console.log(i.style.background);
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

// Stop the right click menu from appearing
document.oncontextmenu = function() {
    return false;
}

// Handle onmousedown events from js instead :(
document.addEventListener('mousedown', (e) => {
    console.log(e.target.classList);

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
    } else if (e.target.classList.contains('taskspace-obj')) {
        $("dbg").innerText = 'Focused on taskbar free space, removing focus from all windows';
        defocusAll();
    } else if (e.target.classList.contains('taskbar-btn')) {
        $("dbg").innerText = 'Focused on a taskbar button, removing focus from all windows';
        defocusAll();
    }
});

let mouseLTime = 0; // for mouse hold tracking
let mouseRTime = 0; // ^
let curW = null;    // current window
let curHandle = null; // current drag handle

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
    console.log ("curW: " + curW);
    if (e.buttons === 1 && curW != null && curHandle == null) {
        // we've clearly established to the code that we're dragging a window; now
        // give the user some feedback by changing the cursor
        setCursor("move");

        const { top, left } = curW.getBoundingClientRect();

        // gets the direction of the mouse as it moves
        const { movementX, movementY } = e;

        // update the position of the window
        curW.style.top = `${top + movementY}px`;
        curW.style.left = `${left + movementX}px`;
    } else if (e.buttons === 1 && curHandle != null && curW != null) {
        // we're resizing a window here :)
        console.log("resizing window");

        // get the current window
        const { top, left, width, height, x, y } = curW.getBoundingClientRect();
        const { movementX, movementY, pageX, pageY } = e;

        console.log(curW.getBoundingClientRect());

        let mouseDirV = 0; // 1 = up, 0 = down
        let mouseDirH = 0; // 1 = left, 0 = right

        console.log("mouse directions: " + mouseDirV + " " + mouseDirH, movementX, movementY);

        const { style } = curW;

        // for top left resizing, subtract from the top and left pos values, as well as maintain width and height
        if (curHandle.classList.contains('window-draghandle-topL')) {
            // set the body's cursor to the drag cursor
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
            // set the body's cursor to the drag cursor
            setCursor("n-resize");
            
            // update vertical position if the window isnt gonna get any smaller
            if (!(height + (top - pageY) <= 64)) {
                style.top = `${pageY}px`;
                style.height = `${height + (top - pageY)}px`;
            }

        }

        // for top right resizing, subtract from the top pos value, add to the width, and maintain the height
        else if (curHandle.classList.contains('window-draghandle-topR')) {
            // set the body's cursor to the drag cursor
            setCursor("ne-resize");

            // calculate what px size we need, considering the offset of the window's position and current width
            const newWidth = pageX - left;
            console.log(pageX, " should be equal to ", pageX - left);
            
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
            // set the body's cursor to the drag cursor
            setCursor("w-resize");

            // update horizontal position if the window isnt gonna get any smaller
            if (!(width + (left - pageX) <= 192)) {
                style.left = `${pageX}px`;
                style.width = `${width + (left - pageX)}px`;
            }

        }

        // for right resizing, add to the width
        else if (curHandle.classList.contains('window-draghandle-right')) {
            // set the body's cursor to the drag cursor
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
            // set the body's cursor to the drag cursor
            setCursor("sw-resize"); 

            // update horizontal position if the window isnt gonna get any smaller
            if (!(width + (left - pageX) <= 192)) {
                style.left = `${pageX}px`;
                style.width = `${width + (left - pageX)}px`;
            }

            // calculate what px size we need, considering the offset of the window's position and current height
            const newHeight = pageY - top;
            console.log(pageY, " should be equal to ", pageY - top);

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
            $("dbg").innerText += `\nLeft mouse was held down for ${(Date.now() - mouseLTime) / 1000}s`;
        } else {
            $("dbg").innerText += `\nLeft mouse was clicked`;
        }
    } else {
        if ((Date.now() - mouseRTime) > 80) {
            $("dbg").innerText += `\nRight mouse was held down for ${(Date.now() - mouseRTime) / 1000}s`;
        } else {
            $("dbg").innerText += `\nRight mouse was clicked`;
        }
    }

    // deselect window, and reset cursor
    curW = null;
    curHandle = null;
    setCursor("default");
});

// Capture doubleclicks
document.addEventListener('dblclick', (e) => {
    if (e.button === 0) {
        $("dbg").innerText += `\nLeft mouse was doubleclicked`;
    } else {
        $("dbg").innerText += `\nRight mouse was doubleclicked`;
    }
} );
