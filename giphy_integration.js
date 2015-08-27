'use strict';

// obvious SO rip, i didn't write this function - just a utility
function shuffle(o){
    for(var j, x, i = o.length; i;
        j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

// callback is going to be beginTV , but it's nice to be flexible
function loadGiphySearchResults(query, callback) {

    var key = 'dc6zaTOxFJmzC'
    var api = 'http://api.giphy.com/v1/gifs/search'
    var queryLimit = 45;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `${api}?q=${query}&api_key=${key}&limit=${queryLimit}`, true);

    xhr.onload = () => {
        //
        if (xhr.status >= 200 && xhr.status < 400) {
            clearInterval(TV.ticker);
            var data = JSON.parse(xhr.responseText).data;
            assignLinks(data.map((e, _) => `http://i.giphy.com/${e.id}.gif`));
        } else {
            console.log('giphy returned an error');
        }
        if (callback != undefined) { callback() };
    };

    xhr.onerror = () => { console.log('connection borked'); }
    xhr.send();
}

function assignLinks(links) {
    var originalLength = links.length;
    links = shuffle(links);
    for (var i = 0; i < originalLength / 3 ; i++) {
        for (var n = 0; n <= 2; n++) {
            opts[n].gifLinkBuffer[i] = links.pop();
        }
    }
}

function beginTV () {
    for (var i in frames) {
        frames[i].setAttribute('src', opts[i].gifLinkBuffer[0]);
    }
    setNewSpeedTicker();
    TV.lastSwitchedLayer = 2;
}

function switchOneLayer () {
    console.log("trying to switch a GIF layer...");

    var index = TV.lastSwitchedLayer;
    var currentGIF = frames[index].getAttribute('src');
    if (TV.lastSwitchedLayer === 2) { TV.lastSwitchedLayer = -1 }

    var currentIndex = opts[index].gifLinkBuffer.indexOf(currentGIF);

    // end of the the line, cycle back + shuffle
    if (currentIndex === 14) {
        currentIndex = -1;
        shuffleLinkBuffers();
    }
    frames[index].setAttribute('src', opts[index].gifLinkBuffer[currentIndex + 1]);
    TV.lastSwitchedLayer += 1;
}

function setNewSpeedTicker () {
    console.log("handling speed switch...");
    clearInterval(TV.ticker);
    TV.ticker = setInterval(() => { switchOneLayer() }, 30000 / TV.speed );
}

// used to keep the order from becoming predicatable
function shuffleLinkBuffers () {
    console.log("shuffling link buffers...");
    for (var i in opts) {
        opts[i].gifLinkBuffer = shuffle(opts[i].gifLinkBuffer);
    }
}
// ID for the drone mode tag so we can add the giphy image
document.querySelector("li.folder .title").setAttribute('id', 'drone-mode-logo');
//document.querySelector("#drone-mode + div").setAttribute('id', 'drone-mode-logo');
