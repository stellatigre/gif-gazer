var gui;

var guiDataWrapper = function () {
    for (var i = 0; i <= 2; i++) {
        this[i] = {
            sourceLink: "",
            opacity: 0.75,
            blendMode: "hard-light",
            playSpeed: 0.5,
            pingPong: false,
            flipX: false,
            flipY: false,
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
};

// everything syncs to this object's values, basically
var opts = new guiDataWrapper();

function updateLayerFilter(layer, filters) {
    layer.style.webkitFilter = "hue-rotate(0deg) contrast(1) saturate(1) brightness(1)"
        .replace("hue-rotate(0", "hue-rotate(" + filters.hueRotate)
        .replace("brightness(1", "brightness(" + filters.brightness)
        .replace("saturate(1", "saturate(" + filters.saturation)
        .replace("contrast(1", "contrast(" + filters.contrast)
}

function makeDatGUI() {
    gui = new dat.GUI();
    var flipX = [];                             
    var flipY = [];                             
    var blendSwitches = [];
    var playSpeeds = [];
    var filterValues = [];
    var idFields = [];
    var pingPongs = [];
    var opacities = [];

    var droneMode = gui.add(opts, 'droneMode').name('drone mode');
    var searchQuery = gui.add(opts, 'searchQuery').name('search query');

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

        var flipModes = v.addFolder('flip mode');                                               // all transform effects go here
        flipX[i] = flipModes.add(opts[i], 'flipX').name("vertical");
        flipY[i] = flipModes.add(opts[i], 'flipY').name("horizontal");

        var filters = v.addFolder('filters');                                                   // filters all go under this
        filters.add(opts[i].filters, 'saturation', 0, 10).step(0.1).name("saturation");
        filters.add(opts[i].filters, 'contrast', 0, 10).step(0.1).name("contrast");
        filters.add(opts[i].filters, 'brightness', 0, 10).step(0.1).name("brightness");
        filters.add(opts[i].filters, 'hueRotate', 0, 360).step(1).name("hue");
        filterValues[i] = filters;
    }
    
    idFields.forEach(function (element, i) {                                                    // these events handle 
        element.onFinishChange(function (value) {                                               // live gif loading
            frames[i].setAttribute('src', value);
        })
    })
    opacities.forEach(function (element, i) {
        element.onChange(function (value) {
            frames[i].style.opacity = value;
        })
    });
    blendSwitches.forEach(function (element, i) {
        element.onChange(function (value) {
            frames[i].style.mixBlendMode = value;
        })
    });
    playSpeeds.forEach(function (element, i) {
        element.onChange(function (value) {
            frames[i].setAttribute('speed', opts[i].playSpeed.toString());
        })
    });
    pingPongs.forEach(function (element, i) {
        element.onChange(function (value) {
            if (value === true) {
                frames[i].setAttribute('ping-pong', opts[i].pingPong);
            } 
            else if (value === false) {
                frames[i].removeAttribute('ping-pong');
            }
        })
    });
    filterValues.forEach(function (element, i) {
        element.__controllers.forEach(function (controller, n) {
            controller.onChange(function (value) {
                updateLayerFilter(frames[i], opts[i].filters)
            });
        });
    });
    flipX.forEach(function (element, i) {                                                       
        element.onChange(function (value) {                                                     
            frames[i].classList.toggle("flipX");                                                
        })                                                                                      
    });
    flipY.forEach(function (element, i) {
        element.onChange(function (value) {
            frames[i].classList.toggle("flipY");
        })
    })
}

function getQueryParameters(str) {
    return (str || document.location.search).replace(/(^\?)/, '').split("&")
                .map(function (n) { return n = n.split("="), this[n[0]] = n[1], this }.bind({}))[0];
}

var gifDefaults = ["http://i.imgur.com/y2wd9rK.gif", "http://i.imgur.com/iKXH4E2.gif", "http://i.giphy.com/inteEJBEqO3cY.gif"];
var params = getQueryParameters(decodeURIComponent(window.location.search));        

if (params.sourceLinks === undefined) {
    var sourceLinks = gifDefaults;            // default to a set i think looks cool if no sourceLinks, will change, probably
} else {
    var sourceLinks = params.sourceLinks.split(",");
}

var frames = Array.prototype.slice.call(document.querySelectorAll('x-gif'));

frames.forEach(function (element, i) {
    opts[i].sourceLink = sourceLinks[i];
});

makeDatGUI();

// ID for the drone mode tag so we can add the giphy image
document.querySelector(".property-name").setAttribute('id', 'drone-mode');
document.querySelector("#drone-mode + div").setAttribute('id', 'drone-mode-logo');
