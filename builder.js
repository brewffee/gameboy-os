const createWindow = (x) => {
    // we need to start programmaticallt generating windows

    // window structure
/*
        <div id="a" class="wcon window-host" style="top: 92;left: 36;">
            <div class="titlebar titlebar-obj">
                <div class="deco-t titlebar-obj">
                    <div class="deco-h titlebar-obj">
                        <div class="t-tl deco-i titlebar-obj window-draghandle-topL"></div>
                        <div class="t-m deco-i titlebar-obj window-draghandle-top"></div>
                        <div class="t-tr deco-i titlebar-obj window-draghandle-topR"></div>
                    </div>

                    <div class="deco-mid titlebar-obj">
                        <div class="t-ml deco-i titlebar-obj window-draghandle-left"></div>

                        <!-- actual titlebar content in this div :3c -->
                        <div class="titlebar-body titlebar-obj">
                            <span class="titlebar-title titlebar-obj">My PC</span>
                        </div>

                        <div class="t-mr deco-i titlebar-obj window-draghandle-right"></div>
                    </div>

                   <div class="deco-h">
                        <div class="t-bl deco-i titlebar-obj window-draghandle-left"></div>
                        <div class="t-bm deco-i titlebar-obj"></div>
                        <div class="t-br deco-i titlebar-obj window-draghandle-right"></div>
                    </div>
                </div> 
            </div>
            <div class="content">
                <div class="deco-t">
                    <div class="deco-h">
                        <div class="w-tl deco-i window-draghandle-left"></div>
                        <div class="w-m deco-i"></div>
                        <div class="w-tr deco-i window-draghandle-right"></div>
                    </div>
                    <div class="deco-mid">
                        <div class="w-ml deco-i window-draghandle-left"></div>
                        
                        <!-- actual content in this div :3c -->
                        <div class="content-body" style="width: 100%; height: 100%;">
                            <span class="dragHandle">meow :3c</span>
                        </div>

                        <div class="w-mr deco-i window-draghandle-right"></div>
                    </div>
                    <div class="deco-h">
                        <div class="w-bl deco-i window-draghandle-bottomL"></div>
                        <div class="w-bm deco-i window-draghandle-bottom"></div>
                        <div class="w-br deco-i window-draghandle-bottomR"></div>
                    </div>    
                </div>
            </div>
        </div>
*/

    // create the window
    const win = document.createElement('div');
    win.id = x.replace(/\s/g, '-');
    win.classList.add(['wcon', 'window-host']);
    win.style.top = `92px`; // random later mayb
    win.style.left = `48px`; // random later mayb

    // create the titlebar
    const titlebar = document.createElement('div');
    titlebar.classList.add(['titlebar', 'titlebar-obj']);
    win.appendChild(titlebar);

    // create the titlebar decoration
    const decoT = document.createElement('div');
    decoT.classList.add(['deco-t', 'titlebar-obj']);
    titlebar.appendChild(decoT);

    // horizontal decoration layer
    const decoH = document.createElement('div');
    decoH.classList.add(['deco-h', 'titlebar-obj']);
    decoT.appendChild(decoH);

    // decoration objects
    const deco_T_TL = document.createElement('div');
    deco_T_TL.id = 't-tl';
    deco_T_TL.classList.add(['deco-i', 'titlebar-obj', 'window-draghandle-topL']);
    
    const deco_T_M = document.createElement('div');
    deco_T_M.id = 't-m';
    deco_T_M.classList.add(['deco-i', 'titlebar-obj', 'window-draghandle-top']);

    const deco_T_TR = document.createElement('div');
    deco_T_TR.id = 't-tr';
    deco_T_TR.classList.add(['deco-i', 'titlebar-obj', 'window-draghandle-topR']);
    
    decoH.appendChild(deco_T_TL);
    decoH.appendChild(deco_T_M);
    decoH.appendChild(deco_T_TR);



    // set decoration styles (dependent on theme (NOT YET IMPLEMENTED))
    deco_T_TL.style.background = 'url(window/t-tl.png) no-repeat';
    deco_T_M.style.background = 'url(window/t-m.png) repeat-x';
    deco_T_TR.style.background = 'url(window/t-tr.png) no-repeat';

}