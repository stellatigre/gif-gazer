"use strict";
var giphyLinks;

giphySearch = function (query) {
    
    xhr = new XMLHttpRequest;
    xhr.open('GET', 'http://api.giphy.com/v1/gifs/search?q={query}&api_key=dc6zaTOxFJmzC&limit=30'.replace('{query}', query), true);

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 400) {
            data = JSON.parse(xhr.responseText).data;
            data.forEach(function (e, i) {
                giphyLinks.push('http://i.giphy.com/' + e.id + '.gif');
            });
            console.log(data);
        } else {
            console.log('reached giphy, but API returned an error');
        }
    };

    xhr.onerror = function () {
        console.log('connection borked');
    };

    xhr.send();
}

function pushToLayerBuffers() {
    for (var i = 0; i <= giphyLinks.length / 10; i++) {

    }
}