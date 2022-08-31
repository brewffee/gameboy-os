const $ = (x) => document.querySelector(`#${x}`);

let mouseLTime = 0; // for mouse hold tracking
let mouseRTime = 0; // ^

let curBtn = null;  // for tracking selected button
let curW = null;    // current window
let lastActiveWindow = null; // if we need to go back to the last window
let curHandle = null; // current drag handle

// we need to store every window and its order for the wm
// use a map to store the windows and their order
let winMap = new Map();
// map structure
// { pid: { window: <window>, order: x, title: string } }
// { 1: { window: host, order: 0, title: 'Test Window' } }

// getting from map gets NASTY
// use this for now 
const __getPid = (x) => parseInt(x.getAttribute('pid'))
const __getAttr = (x) => winMap.get(parseInt(x.getAttribute('pid')));

let pid = 0; // for generating unique ids for every window

// Log the classlist of the element we're hovering over
document.addEventListener('mouseover', (e) => {
    $("dbg-li").innerText = `Selected: #${e.target.id}, [${e.target.classList}]`;
});

const setCursor = (x) => {
    document.body.style.cursor = `url(cursors/${x}.png), auto`;
}

// take a new approach to focusing windows
const focusWindow = (x) => {
    // x can be a window or null

    // Defocus the currently focused window
    // ALL OF THIS CAN BE SHORTENED BY A TON !!! DO LATER WITH CUSTOM ELMS AND CSS AND ATTRIBS
    //Array.from(document.getElementsByClassName('wcon')).forEach(x => x.style["z-index"] = 10);
    Array.from(document.getElementsByClassName('titlebar-title')).forEach(x => {
        // Remove " (focused)" from the titlebar title
        x.innerText = x.innerText.replace(/ \(focused\)/, "");
    })
    Array.from(document.getElementsByClassName('deco-i')).forEach(i => {
        if (!i.style.background.includes('-l.png')) {
            i.style.background = i.style.background.replace('.png', '-l.png');
        }
    });
    Array.from(document.getElementsByClassName('titlebar-body')).forEach(x => {
        x.style.background = '#7c6d80';
    });    
    Array.from(document.getElementsByClassName('titlebar')).forEach(x => {
        x.style.background = '#7c6d80';
    });

    // move everyone in the map down 1
    winMap.forEach((v, _k) => {
        // 0 order = 1100 z-index
        // 100 order = 1000 z-index
        v.order = v.order + 1;

        // subtract from 1100 to get the z-index
        v.window.style["z-index"] = 1100 - v.order;
    });


    if (x == null) {
        // exit immediately, since there is no window to focus
        return;
    }
    // -------------------------------------------------------------- defocusing done
    // focus the new window
    console.log('trying to focus ' + x.classList);
    // if we're on a window-host class, find a child titlebar-title
    // this wont be necessary after we move to custom elms and css and attrs btw
    if (x.classList.contains('window-host')) {
        title = x.querySelector('.titlebar-title');
        title.innerText += ' (focused)';
    }

    // change image for deco-i elms (should also be cleaned soon)
    Array.from(x.getElementsByClassName('deco-i')).forEach(i => {
        if (i.style.background.includes('-l.png')) {
            i.style.background = i.style.background.replace('-l.png', '.png');
        }
    });

    // fx colors (again, css rules will make this 100% unnecessary)
    x.getElementsByClassName('titlebar-body')[0].style.background = '#382843';
    x.getElementsByClassName('titlebar')[0].style.background = '#382843';

    // reflect the new position in the window map
    // since we're focusing a window, its order is 0
    winMap.set(__getPid(x), { window: x, order: 0, title: x.id });
    console.log(__getPid(x), { window: x, order: 0, title: x.id });


    // remember, 0 order = 1100 z-index, 100 order = 1000 z-index
    x.style["z-index"] = 1100; // since its 0

    // let em know
    onWindowEvent('focus', x);
}

// any changes to the window's order or a window's state needs to be reflected here
// type could be : 'create', 'destroy', 'focus', 'move', 'resize'
//
// {
//     type: 'create', 'destroy', 'focus', 'unfocus', 'move', 'resize'
//
//     2nd arg could be ,,,,
//     create (opt): { type: string, args: {} }
//     destroy (opt): (window object)
//     focus (opt): (window object)
//     move (opt): (window object)
//     resize (opt): (window object)
// }
//
// onWindowEvent('create', { type: 'create', args: {}});
onWindowEvent = (type, e) => {
    //console.log(`onWindowEvent::${type} ` + __getPid(e), { window: e.window, order: 0, title: e.type });
    switch (type) {
        case 'create':
            // handled elsewhere, can just log
            $('dbg').innerText = `\n${type} ${e.type}`;
            break;
        case 'destroy':
            // move the other windows up, since the last deleted window was likely 0
            Array.from(document.getElementsByClassName('wcon')).forEach(x => {
                console.log(__getPid(x), winMap);
                if (winMap.get(__getPid(x)).order > 0) {
                    // as i was saying before,,, eugh
                    winMap.set(__getPid(x), { window: x, order: __getAttr(x).order - 1, title: __getAttr(x).title });
                }

                // also fix the z-index
                x.style["z-index"] = 1100 - __getAttr(x).order;
            });

            // delete the element from the map and the body
            winMap.delete(__getPid(e));
            document.body.removeChild(e);
            break;
        case 'focus':
            // setfocus is handled elsewhere, before we move it here, just log
            $('dbg').innerText += `\n${e.id} focused (onWindowEvent:focus)`;
            break;
        case 'defocus':
            // just log 
            console.log(`${e.id} defocused (onWindowEvent:defocus)`);
        case 'move':
            // move doesnt impact anything, just log
            $('dbg').innerText += `\n${e.id} moving!! (onWindowEvent:move)`;
            break;
        case 'resize':
            // resize doesnt impact anything, just log
            $('dbg').innerText += `${e.id} resizing!! (onWindowEvent:resize)`;
            break;
    }

    // update the window map, but preserve the order
    let winStr = `${winMap.size} Windows: `;
    
    Array.from(document.getElementsByClassName('wcon')).forEach(x => {
        winStr += `<${__getPid(x)}>[${__getAttr(x).order}] ${__getAttr(x).title}, `; 
    });
    winStr = winStr.replace(/, $/, "");
    $("dbg-win").innerText = winStr;
    console.log(winMap);
}

// Stop the right click menu from appearing ()
document.oncontextmenu = function() {
    return false;
}

// Handle onmousedown events from js instead :(
document.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('content-obj') || e.target.classList.contains('titlebar-obj')) {
        let titlebar, window;

        // Loop until we find the source window element
        window = e.target;
        while (!window.classList.contains('window-host')) {
            window = window.parentElement;
        }

        // Get that window's titlebar (if we dont have one already)
        titlebar = window.getElementsByClassName('titlebar')[0];

        $("dbg").innerText = `Focused on window ${window.id}, defocusing other windows`;

        // Switch focus to the current window
        // if we're already focused (ordrer: 0) then there isnt rlly any need to do anything

        console.log(`windowis ${window}`);
        if (__getAttr(window).order > 0) {
            focusWindow(window);
        }
        
        // if its a titlebar-obj, and we're using mouse2, note its context menu
        if (e.button == 2 && e.target.classList.contains('titlebar-obj')) {
            $('dbg').innerText = `Titlebar context menu opened for ${window.id}`;
        }        
    } else if (e.target.classList.contains('desktop')) {
        focusWindow(null);
    } else if (e.target.parentElement.classList.contains('taskbar-btn-h') && e.target.classList.contains('taskbar-btn')) {
        $("dbg").innerText = 'Focused on a taskbar button, removing focus from all windows';
        focusWindow(null);

        curBtn = e.target.parentElement;
        $('dbg').innerText += "\nSelected a taskbar-btn! Trying to handle button event";

        // button action is actually handled in mouseup

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
        focusWindow(null);
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
            focusWindow(window);
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
        focusWindow(curW);

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

            let btnAction = curBtn.getAttribute('action');
            $('dbg').innerText += "\n(NOT_IMPL) Titlebar action " + btnAction;

            switch (btnAction) {
                case 'minimize':
                    // not implemented
                    break;
                case 'maximize':
                    // not implemented
                    break;
                case 'close':
                    // get its window
                    let win = curBtn.parentElement.parentElement;
                    while (!win.classList.contains('window-host')) {
                        win = win.parentElement;
                    }

                    onWindowEvent('destroy', win);
                    break;
            }
        }

        curBtn = null;
    }
});
