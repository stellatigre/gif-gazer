'use strict';

function loadGiphySearchResults(query) {

    var key = 'dc6zaTOxFJmzC'
    var api = 'http://api.giphy.com'
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `${api}/v1/gifs/search?q=${query}&api_key=${key}&limit=30`, true);

    xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 400) {
            var data = JSON.parse(xhr.responseText).data;
            assignLinks(data.map((e, i) => `http://i.giphy.com/${e.id}.gif`));
        } else {
            console.log('giphy returned an error');
        }
    };

    xhr.onerror = () => { console.log('connection borked'); }
    xhr.send();
}

// 30 query results, 3 layers, 10 per layer
function assignLinks(links) {
    var originalLength = links.length;
    for (var i = 0; i < originalLength / 3 ; i++) {
        for (var n = 0; n <= 2; n++) {
            opts[n].gifLinkBuffer.push(links.pop());
        }
    }
}

// ID for the drone mode tag so we can add the giphy image
document.querySelector("li.folder .title").setAttribute('id', 'drone-mode-logo');
//document.querySelector("#drone-mode + div").setAttribute('id', 'drone-mode-logo');
