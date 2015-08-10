"use strict";

var giphyLinks = [];

function giphySearch(query) {
    
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://api.giphy.com/v1/gifs/search?q={query}&api_key=dc6zaTOxFJmzC&limit=30'.replace('{query}', query), true);

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 400) {
            var data = JSON.parse(xhr.responseText).data;
            data.forEach(function (e, i) {
                giphyLinks.push('http://i.giphy.com/' + e.id + '.gif');
            }); 
        } else {
            console.log('giphy returned an error');
        }
    };

    xhr.onerror = function () {
        console.log('connection borked');
    };

    xhr.send();
}

// 30 query results, 3 layers, 10 per layer
function pushToLayerBuffers(links) {
    var originalLength = links.length;
    for (var i = 0; i <= originalLength ; i++) {
        if (links.length > 0) {
            for (var n = 0; n <= 2; n++) {
                opts[n].gifLinkBuffer.push(links.pop());
            }
        }
    }
}

function setGIF(layerIndex, src) {
    frames[layerIndex].setAttribute('src', src);
}

function setNewLinkBuffers(query) {
    giphySearch(query);
    setTimeout(function () {
        pushToLayerBuffers(giphyLinks);
    }, 2000)
}

// ID for the drone mode tag so we can add the giphy image
document.querySelector("li.folder .title").setAttribute('id', 'drone-mode-logo');
//document.querySelector("#drone-mode + div").setAttribute('id', 'drone-mode-logo');