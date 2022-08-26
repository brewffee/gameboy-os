const createWindow = (type, arg) => {
    if (winMap.size >= 99) {
        return alert('stop creating windows !!!');
    }
    // The type of window we are creating is a 'mininal' or 'default' window
    // arg is a set of window options
    // { title: 'test', size: '200x200', pos: '128,128', img: 'tesst.png', buttons: [1,2,3], html: '<span>real</span>' }

    switch (type) {
        case 'default':
        case 'minimal':
            // Start building :)
            let host = document.createElement('div');
            host.id = arg.title.replace(/ /g, '_');
            pid = pid + 1; // Increment the pid
            host.setAttribute('pid', pid); 
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
                elm.className = elms[i] + ' deco-i drag-obj window-draghandle-' + handles[i];
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
                    decoMid.appendChild(titlebBody);

                    if (arg.img) {
                        let img = document.createElement('img');
                        img.src = arg.img;
                        titlebBody.appendChild(img);
                    }

                    let title = document.createElement('span');
                    title.innerHTML = arg.title;
                    title.className = 'titlebar-title titlebar-obj';
                    titlebBody.appendChild(title);

                    let titlebButtons = document.createElement('div');
                    titlebButtons.className = 'titlebar-buttons titlebar-obj';
                    titlebBody.appendChild(titlebButtons);

                    if (arg.buttons) {
                        // THIS CAN BE SHORTENED BUT I DONT CARE !!!! GRAAAAHHHHH !!!
                        // 1 = min, 2 = max/restore, 3 = close
                        if (arg.buttons.includes(1)) {
                            let min = document.createElement('div');
                            min.className = 'titlebar-btn deco-i';
                            min.id = host.id + '_min';
                            min.setAttribute('action', 'min');
                            min.style.background = 'url(min.png) no-repeat';
                            min.style.backgroundSize = 'cover';
                            titlebButtons.appendChild(min);
                        }
                        if (arg.buttons.includes(2)) {
                            let max = document.createElement('div');
                            max.className = 'titlebar-btn deco-i';
                            max.id = host.id + '_max';
                            max.setAttribute('action', 'max');
                            max.style.background = 'url(max.png) no-repeat';
                            max.style.backgroundSize = 'cover';
                            titlebButtons.appendChild(max);
                        }
                        if (arg.buttons.includes(3)) {
                            let close = document.createElement('div');
                            close.className = 'titlebar-btn deco-i';
                            close.id = host.id + '_close';
                            close.setAttribute('action', 'close');
                            close.style.background = 'url(x.png) no-repeat';
                            close.style.backgroundSize = 'cover';
                            titlebButtons.appendChild(close);
                        }
                    }
                } else {
                    if (handles[i] != null) {
                        let elm = document.createElement('div');
                        elm.className = elms[i] + ' deco-i drag-obj window-draghandle-' + handles[i];
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
                    elm.className = elms[i] + ' deco-i drag-obj window-draghandle-' + handles[i];
                    elm.style.background = 'url(window/' + elms[i] + '.png) no-repeat';
                    decoH_.appendChild(elm);
                } else {
                    let elm = document.createElement('div');
                    elm.className = elms[i] + ' deco-i titlebar-obj';
                    elm.style.background = 'url(window/' + elms[i] + '.png) repeat-x';
                    decoH_.appendChild(elm);
                }
            }

            // window body
            let content = document.createElement('div');
            content.className = 'content';
            content.id = host.id + '_content';
            host.appendChild(content);

            // OOPS !!!!!
            let decoT_ = document.createElement('div');
            decoT_.className = 'deco-t content-obj';
            content.appendChild(decoT_);

            // upper decoration
            let decoHW = document.createElement('div');
            decoHW.className = 'deco-h';
            decoT_.appendChild(decoHW);

            elms = ['w-tl', 'w-m', 'w-tr'];
            handles = ['left', null, 'right'];
            for (let i = 0; i < elms.length; i++) {
                if (handles[i] != null) {
                    let elm = document.createElement('div');
                    elm.className = elms[i] + ' deco-i content-obj drag-obj window-draghandle-' + handles[i];
                    elm.id = host.id + '_' + handles[i];
                    elm.style.background = 'url(window/' + elms[i] + '.png) no-repeat';
                    decoHW.appendChild(elm);
                } else {
                    let elm = document.createElement('div');
                    elm.className = elms[i] + ' deco-i content-obj';
                    elm.style.background = 'url(window/' + elms[i] + '.png) repeat-x';
                    decoHW.appendChild(elm);
                }
            }

            //  mid (getting to content actually !!! yippeee)
            let decoMW = document.createElement('div');
            decoMW.className = 'deco-mid';
            decoT_.appendChild(decoMW);

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
                        elm.className = elms[i] + ' deco-i content-obj drag-obj window-draghandle-' + handles[i];
                        elm.id = host.id + '_' + handles[i];
                        elm.style.background = 'url(window/' + elms[i] + '.png) repeat-y';
                        decoMW.appendChild(elm);
                    } else {
                        let elm = document.createElement('div');
                        elm.className = elms[i] + ' deco-i content-obj';
                        decoMW.appendChild(elm);
                    }
                }
            }

            // lower decoration
            let decoHW_ = document.createElement('div');
            decoHW_.className = 'deco-h';
            decoT_.appendChild(decoHW_);

            elms = ['w-bl', 'w-bm', 'w-br'];
            handles = ['bottomL', 'bottom', 'bottomR'];
            for (let i = 0; i < elms.length; i++) {
                let elm = document.createElement('div');
                elm.className = elms[i] + ' deco-i content-obj drag-obj window-draghandle-' + handles[i];
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

           // onWindowEvent('create', { type: 'create', args: {}});
           // winMap.set(__getPid(winMap.get(x).window), { window: winMap.get(x).window, order: winMap.get(x).order + 1, title: winMap.get(x).title });
            


            winMap.set(pid, { window: host, order: winMap.size, title: arg.title });
            onWindowEvent('create', { type: arg.title, args: arg, window: host, pid: pid });
            focusWindow(host);


            return host;
        }
}