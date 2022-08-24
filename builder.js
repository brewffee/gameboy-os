const createWindow = (type, arg) => {
    // we need to start programmaticallt generating windows

    // THIS IS WHAT THE GENERATED HTML CODE LOOKS LIKE

        // <div id="Test_Window" class="wcon window-host" style="top: 256;left: 250;">
        //     <div class="titlebar titlebar-obj">
        //         <div class="deco-t titlebar-obj">
        //             <div class="deco-h titlebar-obj">
        //                 <div class="t-tl deco-i drag-obj window-draghandle-topL" style="background: url(window/t-tl.png) no-repeat;"></div>
        //                 <div class="t-m deco-i drag-obj window-draghandle-top" style="background: url(window/t-m.png) repeat-x;"></div>
        //                 <div class="t-tr deco-i drag-obj window-draghandle-topR" style="background: url(window/t-tr.png) no-repeat;"></div>
        //             </div>

        //             <div class="deco-mid titlebar-obj">
        //                 <div class="t-ml deco-i drag-obj window-draghandle-left" style="background: url(window/t-ml.png) repeat-y;"></div>

        //                 <!-- actual titlebar content in this div :3c -->
        //                 <div class="titlebar-body titlebar-obj">
        //                     <img src="tesst.png">
        //                     <span class="titlebar-title titlebar-obj">Test Window</span>

        //                     <div class="titlebar-buttons titlebar-obj">
        //                         <div id="Test_Window_min" class="titlebar-btn deco-i" style="background: url(min.png) no-repeat; background-size: cover;"></div>
        //                         <div id="Test_Window_max" class="titlebar-btn deco-i" style="background: url(max.png) no-repeat; background-size: cover;"></div>
        //                         <div id="Test_Window_close" class="titlebar-btn deco-i" style="background: url(x.png) no-repeat; background-size: cover;"></div>
        //                     </div>
        //                 </div>

        //                 <div class="t-mr deco-i drag-obj window-draghandle-right" style="background: url(window/t-mr.png) repeat-y;"></div>
        //             </div>

        //            <div class="deco-h">
        //                 <div class="t-bl deco-i drag-obj window-draghandle-left" style="background: url(window/t-bl.png) no-repeat;"></div>
        //                 <div class="t-bm deco-i titlebar-obj" style="background: url(window/t-bm.png) repeat-x;"></div>
        //                 <div class="t-br deco-i drag-obj window-draghandle-right" style="background: url(window/t-br.png) no-repeat;"></div>
        //             </div>
        //         </div> 
        //     </div>
        //     <div class="content">
        //         <div class="deco-t content-obj">
        //             <div class="deco-h">
        //                 <div class="w-tl deco-i content-obj drag-obj window-draghandle-left" style="background: url(window/w-tl.png) no-repeat;"></div>
        //                 <div class="w-m deco-i content-obj" style="background: url(window/w-m.png) repeat-x;"></div>
        //                 <div class="w-tr deco-i content-obj drag-obj window-draghandle-right" style="background: url(window/w-tr.png) no-repeat;"></div>
        //             </div>
        //             <div class="deco-mid">
        //                 <div class="w-ml deco-i content-obj drag-obj window-draghandle-left" style="background: url(window/w-ml.png) repeat-y;"></div>
                        
        //                 <!-- actual content in this div :3c -->
        //                 <div class="content-body content-obj">
        //                     <span>howdy</span>
        //                 </div>

        //                 <div class="w-mr deco-i content-obj  drag-obj window-draghandle-right" style="background: url(window/w-mr.png) repeat-y;"></div>
        //             </div>
        //             <div class="deco-h">
        //                 <div class="w-bl deco-i content-obj drag-obj window-draghandle-bottomL" style="background: url(window/w-bl.png) no-repeat;"></div>
        //                 <div class="w-bm deco-i content-obj drag-obj window-draghandle-bottom" style="background: url(window/w-bm.png) repeat-x;"></div>
        //                 <div class="w-br deco-i content-obj drag-obj window-draghandle-bottomR" style="background: url(window/w-br.png) no-repeat;"></div>
        //             </div>    
        //         </div>
        //     </div>
        // </div>

    // ------------------------------------------------------------

    // The type of window we are creating is a 'mininal' or 'default' window
    // For minimal windows, the arg is {title, XxY, WxH, html (opt)}

    switch (type) {
        case 'default':
        case 'minimal':
            // Start building :)
            let host = document.createElement('div');
            host.id = arg.title.replace(/ /g, '_');
            host.className = 'wcon window-host';

            
            let titlebar = document.createElement('div');
            titlebar.className = 'titlebar titlebar-obj';
            host.appendChild(titlebar);

            // Start adding decoration elements (PAINFUL)
            let decoT = document.createElement('div');
            decoT.className = 'deco-t titlebar-obj';
            titlebar.appendChild(decoT);

            let decoH = document.createElement('div');
            decoH.className = 'deco-h titlebar-obj';
            decoT.appendChild(decoH);

            let elms = ['t-tl', 't-m', 't-tr'];
            let handles = ['topL', 'top', 'topR'];
            for (let i = 0; i < elms.length; i++) {
                let elm = document.createElement('div');
                elm.className = elms[i] + ' titlebar-obj drag-obj window-draghandle-' + handles[i];
                elm.id = host.id + '_' + handles[i];
                if (handles[i] == 'top') {
                    elm.style.background = 'url(window/' + elms[i] + '.png) repeat-x';
                } else {
                    elm.style.background = 'url(window/' + elms[i] + '.png) no-repeat';
                }
                decoH.appendChild(elm);
            }

            let decoMid = document.createElement('div');
            decoMid.className = 'deco-mid titlebar-obj';
            decoT.appendChild(decoMid);

            elms = ['t-ml', 'titlebar-body', 't-mr'];
            handles = ['left', null, 'right'];
            for (let i = 0; i < elms.length; i++) {
                if (elms[i] == 'titlebar-body') {
                    let titlebBody = document.createElement('div');
                    titlebBody.className = 'titlebar-body titlebar-obj';
                    titlebBody.id = host.id + '_titlebar-body';
                    decoMid.appendChild(titlebBody);

                    if (arg.img) {
                        let img = document.createElement('img');
                        img.src = arg.img;
                        titlebBody.appendChild(img);
                    }

                    let title = document.createElement('span');
                    title.innerHTML = arg.title;
                    titlebBody.appendChild(title);

                    let titlebButtons = document.createElement('div');
                    titlebButtons.className = 'titlebar-buttons titlebar-obj';
                    titlebBody.appendChild(titlebButtons);

                    if (arg.buttons) {
                        // THIS CAN BE SHORTENED BUT I DONT CARE !!!! GRAAAAHHHHH !!!
                        // 1 = min, 2 = max/restore, 3 = close
                        if (arg.buttons.includes(1)) {
                            let min = document.createElement('div');
                            min.className = 'titlebar-button deco-i';
                            min.id = host.id + '_min';
                            min.style.background = 'url(window/min.png) no-repeat';
                            min.style.backgroundSize = 'cover';
                            titlebButtons.appendChild(min);
                        }
                        if (arg.buttons.includes(2)) {
                            let max = document.createElement('div');
                            max.className = 'titlebar-button deco-i';
                            max.id = host.id + '_max';
                            max.style.background = 'url(window/max.png) no-repeat';
                            max.style.backgroundSize = 'cover';
                            titlebButtons.appendChild(max);
                        }
                        if (arg.buttons.includes(3)) {
                            let close = document.createElement('div');
                            close.className = 'titlebar-button deco-i';
                            close.id = host.id + '_close';
                            close.style.background = 'url(window/close.png) no-repeat';
                            close.style.backgroundSize = 'cover';
                            titlebButtons.appendChild(close);
                        }
                    }
                } else {
                    if (handles[i] != null) {
                        let elm = document.createElement('div');
                        elm.className = elms[i] + ' titlebar-obj drag-obj window-draghandle-' + handles[i];
                        elm.id = host.id + '_' + handles[i];
                        elm.style.background = 'url(window/' + elms[i] + '.png) repeat-y';
                        decoMid.appendChild(elm);
                    } else {
                        let elm = document.createElement('div');
                        elm.className = elms[i] + ' titlebar-obj';
                        decoMid.appendChild(elm);
                    }
                }
            }

            // titlebar bottom decoration
            let decoH_ = document.createElement('div');
            decoH_.className = 'deco-h';
            decoT.appendChild(decoH_);

            elms = ['t-bl', 't-bm', 't-br'];
            handles = ['left', null, 'right'];
            for (let i = 0; i < elms.length; i++) {
                if (handles[i] != null) {
                    let elm = document.createElement('div');
                    elm.className = elms[i] + ' titlebar-obj drag-obj window-draghandle-' + handles[i];
                    elm.id = host.id + '_' + handles[i];
                    elm.style.background = 'url(window/' + elms[i] + '.png) no-repeat';
                    decoH_.appendChild(elm);
                } else {
                    let elm = document.createElement('div');
                    elm.className = elms[i] + ' titlebar-obj';
                    elm.style.background = 'url(window/' + elms[i] + '.png) repeat-x';
                    decoH_.appendChild(elm);
                }
            }

            // window body
            let content = document.createElement('div');
            content.className = 'content';
            content.id = host.id + '_content';
            host.appendChild(content);

            // upper decoration
            let decoHW = document.createElement('div');
            decoHW.className = 'deco-h';
            content.appendChild(decoHW);

            elms = ['w-tl', 'w-tm', 'w-tr'];
            handles = ['left', null, 'right'];
            for (let i = 0; i < elms.length; i++) {
                if (handles[i] != null) {
                    let elm = document.createElement('div');
                    elm.className = elms[i] + ' window-draghandle-' + handles[i];
                    elm.id = host.id + '_' + handles[i];
                    elm.style.background = 'url(window/' + elms[i] + '.png) no-repeat';
                    decoHW.appendChild(elm);
                } else {
                    let elm = document.createElement('div');
                    elm.className = elms[i];
                    elm.style.background = 'url(window/' + elms[i] + '.png) repeat-x';
                    decoHW.appendChild(elm);
                }
            }

            //  mid (getting to content actually !!! yippeee)
            let decoMW = document.createElement('div');
            decoMW.className = 'deco-mid';
            content.appendChild(decoMW);

            // sandwich decoration (yk cause it kinda looks like a sandwich im sorry)
            elms = ['w-ml', 'content-body', 'w-mr'];
            handles = ['left', null, 'right'];
            for (let i = 0; i < elms.length; i++) {
                if (elms[i] == 'content-body') {
                    let contentBody = document.createElement('div');
                    contentBody.className = 'content-body content-obj';
                    contentBody.id = host.id + '_content-body';
                    decoMW.appendChild(contentBody);

                    if (arg.html) {
                        contentBody.innerHTML = arg.html;
                    }
                } else {
                    if (handles[i] != null) {
                        // shouldnt trigger a null handle anyway, prob gonna have to delete
                        let elm = document.createElement('div');
                        elm.className = elms[i] + ' content-obj drag-obj window-draghandle-' + handles[i];
                        elm.id = host.id + '_' + handles[i];
                        elm.style.background = 'url(window/' + elms[i] + '.png) repeat-y';
                        decoMW.appendChild(elm);
                    } else {
                        let elm = document.createElement('div');
                        elm.className = elms[i] + ' content-obj';
                        decoMW.appendChild(elm);
                    }
                }
            }

            // lower decoration
            let decoHW_ = document.createElement('div');
            decoHW_.className = 'deco-h';
            content.appendChild(decoHW_);

            elms = ['w-bl', 'w-bm', 'w-br'];
            handles = ['bottomL', 'bottom', 'bottomR'];
            for (let i = 0; i < elms.length; i++) {
                let elm = document.createElement('div');
                elm.className = elms[i] + ' content-obj drag-obj window-draghandle-' + handles[i];
                elm.id = host.id + '_' + handles[i];
                if (handles[i] == 'bottom') {
                    elm.style.background = 'url(window/' + elms[i] + '.png) repeat-x';
                } else {
                    elm.style.background = 'url(window/' + elms[i] + '.png) no-repeat';
                }
                decoHW_.appendChild(elm);
            }

            // we're done!!
            // just create the window in the document body
            // { title: 'test', size: '200x200', pos: '128,128', img: 'tesst.png', buttons: [1,2,3], html: '<span>real</span>' }
            host.style.position = 'absolute';
            host.style.top = arg.pos.split(',')[0] + 'px';
            host.style.left = arg.pos.split(',')[1] + 'px';
            host.style.width = arg.size.split('x')[0] + 'px';
            host.style.height = arg.size.split('x')[1] + 'px';

            // focus onto the new window as to not break anythibg
            // get the .titlebar and .window-host elements
            let wdow = host;
            let titlebar_ = wdow.getElementsByClassName('titlebar')[0];

            document.body.appendChild(host);

            defocusAll();
            setFocus(titlebar_);
            setFocus(wdow);
            return host;
        }
}