'use strict';

var gui;

var guiDataWrapper = function guiDataWrapper() {
    for (var i = 0; i <= 2; i++) {
        this[i] = {
            url: "",
            opacity: 0.75,
            blendMode: "hard-light",
            speed: 0.5,
            pingPong: false,
            flipMode: "",
            filters: {
                hueRotate: 0,
                contrast: 1,
                saturation: 1,
                brightness: 1
            },
            gifLinkBuffer: []
        };
    }
};

// everything syncs to this object's values, basically
var opts = new guiDataWrapper();

var TV = {
    speed: 2,
    query: "vaporwave",
    ticker: null,
    lastSwitchedLayer: null
};

function updateFilter(layer, filters) {
    layer.style.webkitFilter = "hue-rotate(" + filters.hueRotate + "deg) " + ("brightness(" + filters.brightness + ") ") + ("saturate(" + filters.saturation + ") ") + ("contrast(" + filters.contrast + ")");
}

function makeDatGUI() {
    gui = new dat.GUI();

    var flipModes = [],
        blendSwitches = [],
        speeds = [],
        filterValues = [],
        idFields = [],
        pingPongs = [],
        opacities = [];

    // giphy integration
    var tvMode = gui.addFolder('tv mode');
    var searchQuery = tvMode.add(TV, 'query').name('search query');
    var tvSpeed = tvMode.add(TV, 'speed', 1, 6).step(1).name('speed');
    tvMode.open();

    // create controls for all 3 GIF layers
    for (var i = 0; i <= 2; i++) {
        var v = gui.addFolder('gif ' + (i + 1));
        idFields[i] = v.add(opts[i], 'url').name("gif link");
        opacities[i] = v.add(opts[i], 'opacity', 0, 1).name("opacity");
        blendSwitches[i] = v.add(opts[i], 'blendMode', ["screen", "multiply", "soft-light", "hard-light", "hue", "overlay", "difference", "luminosity", "color-burn", "color-dodge"]).name("blend mode");

        speeds[i] = v.add(opts[i], 'speed', 0, 5).step(0.1).name("play speed");
        pingPongs[i] = v.add(opts[i], 'pingPong').name("ping-pong");
        v.open();

        flipModes[i] = v.add(opts[i], 'flipMode', ['', 'X', 'Y', 'Z']).name('flip mode');

        var filters = v.addFolder('filters');
        filters.add(opts[i].filters, 'saturation', 0, 10).step(0.1).name("saturation");
        filters.add(opts[i].filters, 'contrast', 0, 10).step(0.1).name("contrast");
        filters.add(opts[i].filters, 'brightness', 0, 10).step(0.1).name("brightness");
        filters.add(opts[i].filters, 'hueRotate', 0, 360).step(1).name("hue");
        filterValues[i] = filters;
    }

    // all GUI event handlers go under here
    // here we assume TV mode is off until a search query is entered
    searchQuery.onFinishChange(function (value) {
        loadGiphySearchResults(value, beginTV);
    });

    tvSpeed.onFinishChange(function (_) {
        handleSpeedSwitch();
    });

    idFields.forEach(function (element, i) {
        element.onFinishChange(function (value) {
            frames[i].setAttribute('src', value);
        });
    });
    blendSwitches.forEach(function (element, i) {
        element.onChange(function (value) {
            frames[i].style.mixBlendMode = value;
        });
    });
    opacities.forEach(function (element, i) {
        element.onChange(function (value) {
            frames[i].style.opacity = value;
        });
    });
    speeds.forEach(function (element, i) {
        element.onChange(function (value) {
            frames[i].setAttribute('speed', value);
        });
    });
    pingPongs.forEach(function (element, i) {
        element.onChange(function (value) {
            if (value === true) {
                frames[i].setAttribute('ping-pong', opts[i].pingPong);
            } else if (value === false) {
                frames[i].removeAttribute('ping-pong');
            }
        });
    });
    filterValues.forEach(function (element, i) {
        element.__controllers.forEach(function (control, _) {
            control.onChange(function (value) {
                updateFilter(frames[i], opts[i].filters);
            });
        });
    });

    var flipEnum = {
        "": "rotate3d(0, 0, 0, 180deg)",
        "X": "rotate3d(1, 0, 0, 180deg)",
        "Y": "rotate3d(0, 1, 0, 180deg)",
        "Z": "rotate3d(0, 0, 1, 180deg)"
    };
    flipModes.forEach(function (element, i) {
        element.onChange(function (value) {
            frames[i].style.transform = flipEnum[value];
        });
    });
}

// this line is important, lots of code relies on "frames" and "opts"
var frames = Array.from(document.querySelectorAll('x-gif'));

// fire it up
makeDatGUI();

