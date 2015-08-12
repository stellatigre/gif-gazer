var gui;

var guiDataWrapper = function () {
    for (var i = 0; i <= 2; i++) {
        this[i] = {
            sourceLink: "",
            opacity: 0.75,
            blendMode: "hard-light",
            playSpeed: 0.5,
            pingPong: false,
            flipMode: "",
            filters: {
                hueRotate: 0,
                contrast: 1,
                saturation: 1,
                brightness: 1,
            },
            gifLinkBuffer: []
        }
    }
    this.droneMode = false;
    this.searchQuery = '';
    this.droneSpeed = 2;
};

// everything syncs to this object's values, basically
var opts = new guiDataWrapper();

function updateLayerFilter(layer, filters) {
    layer.style.webkitFilter =
        `hue-rotate(${filters.hueRotate}deg) ` +
        `brightness(${filters.brightness}) ` +
        `saturate(${filters.saturation}) ` +
        `contrast(${filters.contrast})`
}

function makeDatGUI() {
    gui = new dat.GUI();

    var flipModes = [],
		blendSwitches = [],
		playSpeeds = [],
		filterValues = [],
		idFields = [],
		pingPongs = [],
		opacities = [];

    // giphy integration
    var droneMode = gui.addFolder('drone mode')
    var droneEnabled = droneMode.add(opts, 'droneMode', false).name('enabled');
    var searchQuery = droneMode.add(opts, 'searchQuery').name('search query');
    var switchSpeed = droneMode.add(opts, 'droneSpeed', 0.5, 10).step(0.5).name('speed');
    droneMode.open();

    // create controls for all 3 GIF layers
    for (var i = 0; i <= 2; i++) {
        var v = gui.addFolder('gif ' + (i+1));
        idFields[i] = v.add(opts[i], 'sourceLink').name("gif link");
        opacities[i] = v.add(opts[i], 'opacity', 0, 1).name("opacity");
        blendSwitches[i] = v.add(opts[i], 'blendMode',
            ["screen", "multiply", "soft-light", "hard-light", "hue", "overlay",
             "difference", "luminosity", "color-burn", "color-dodge"]
        ).name("blend mode");

        playSpeeds[i] = v.add(opts[i], 'playSpeed', 0, 5).step(0.1).name("play speed");
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

    // next we set up the event handlers for dat.gui change events
	idFields.forEach((element, i) => {
	    element.onFinishChange((value) => {
            frames[i].setAttribute('src', value);
        });
	})
    blendSwitches.forEach((element, i) => {
        element.onChange((value) => {
            frames[i].style.mixBlendMode = value;
        })
    });
    opacities.forEach((element, i) => {
        element.onChange((value) => {
            frames[i].style.opacity = value;
        })
    });
    playSpeeds.forEach((element, i) => {
        element.onChange((value) => {
            frames[i].setAttribute('speed', opts[i].playSpeed.toString());
        })
    });
    pingPongs.forEach((element, i) => {
        element.onChange((value) => {
            if (value === true) {
                frames[i].setAttribute('ping-pong', opts[i].pingPong);
            }
            else if (value === false) {
                frames[i].removeAttribute('ping-pong');
            }
        })
    });
    filterValues.forEach((element, i) => {
        element.__controllers.forEach((controller, n) => {
            controller.onChange((value) => {
                updateLayerFilter(frames[i], opts[i].filters)
            });
        });
    });

    var flipEnum = {
        "" : "rotate3d(0, 0, 0, 180deg)",
        "X" : "rotate3d(1, 0, 0, 180deg)",
        "Y" : "rotate3d(0, 1, 0, 180deg)",
        "Z" : "rotate3d(0, 0, 1, 180deg)"
    }
    flipModes.forEach((element, i) => {
        element.onChange((value) => {
            frames[i].style.transform = flipEnum[value];
        });
    });
}



function getQueryParameters(str) {
    return (str || document.location.search).replace(/(^\?)/, '').split("&")
                .map(function (n) { return n = n.split("="), this[n[0]] = n[1], this }.bind({}))[0];
}

var gifDefaults = ["http://i.imgur.com/y2wd9rK.gif", "http://i.imgur.com/iKXH4E2.gif", "http://i.giphy.com/inteEJBEqO3cY.gif"];
var params = getQueryParameters(decodeURIComponent(window.location.search));

if (params.sourceLinks === undefined) {
    var sourceLinks = gifDefaults;
} else {
    var sourceLinks = params.sourceLinks.split(",");
}

var frames = Array.prototype.slice.call(document.querySelectorAll('x-gif'));

frames.forEach((element, i) => {
    opts[i].sourceLink = sourceLinks[i];
});

// fire it up
makeDatGUI();
