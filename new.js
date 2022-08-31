const $ = (selector) => document.querySelector(selector);

document.oncontextmenu = () => false;

document.addEventListener('mouseover', (e) => {
    $('#log').innerHTML = `${e.target.tagName}: #${e.target.id}, [${e.target.className}]`;
});




