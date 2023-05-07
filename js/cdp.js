let district_rgb = ['green',
'#b2182b',
'#d6604d',
'#f4a582',
'#92c5de',
'#f7f7f7',
'#d1e5f0',
'#92c5de',
'#4393c3',
'#2166ac',
'#053061',
'#67001f',
'#b2182b',
'#d6604d',
'#f4a582',
'#808000',
'#f7f7f7',
'orange'];

const town_colors_gray = [
    'rgba(255, 255, 255, 1)',
    'rgba(230, 230, 230, 1)',
    'rgba(204, 204, 204, 1)',
    'rgba(179, 179, 179, 1)',
    'rgba(153, 153, 153, 1)',
    'rgba(128, 128, 128, 1)',
    'rgba(102, 102, 102, 1)',
    'rgba(77, 77, 77, 1)',
    'rgba(51, 51, 51, 1)',
    'rgba(26, 26, 26, 1)',
    'rgba(0, 0, 0, 0.9)',
    'rgba(0, 0, 0, 0.8)',
    'rgba(0, 0, 0, 0.7)',
    'rgba(0, 0, 0, 0.6)',
    'rgba(0, 0, 0, 0.5)',
    'rgba(0, 0, 0, 0.4)',
    'rgba(0, 0, 0, 0.3)',
    'rgba(0, 0, 0, 0.2)'
  ];

town_colors_gray.sort(() => Math.random() -0.5);

let district_name = [   "Aveiro",          
"Beja",            
"Braga",          
"Bragança",       
"Castelo Branco",  
"Coimbra",         
"Évora",           
"Faro",            
"Guarda",          
"Leiria",        
"Lisboa",         
"Portalegre",     
"Porto",           
"Santarém",       
"Setúbal",         
"Viana do Castelo",
"Vila Real",       
"Viseu"]; 

let townMask = [];
townMask.length = district_name.length;
townMask.fill(0);

let info;

let audio_click = document.getElementById("audio-click1");
let audio_correct = document.getElementById("audio-correct1");

const mapContainer = document.getElementById("map");




let layers;
let geojson;
let municipalities = [];
let goal_town;
let geojson_data;


loadMap();
hideMap();

function showMap() {
    map.style.display = "block";
}

function hideMap() {
    map.style.display = "none";
}

// Function to load the map
function loadMap() {
    /* Adding background layer to the map */
    let options = {center: [38.43421787890949, -16.044627815603235], zoom: 5};
    options = {center: [39.51, -8.56], zoom: 7};

    let map = L.map("map", options);
    L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
        attribution: "&copy; OpenStreetMap",
        subdomains: 'abcd',
        minZoom: 1,
        maxZoom: 16,
        ext: 'jpg'
    }).addTo(map);

    /* Loading borders of municipalities */
    layers = L.layerGroup().addTo(map);

    fetch("/webpage/data/layers.geojson")
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {  // add GeoJSON layer to the map once the file is loaded
            geojson_data = data;
        });

    /* Adding a legend to the map */
    let legend = L.control({position: "topright"});
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "legend");
        div.innerHTML = '<p id="target"></p>';
        return div;
    }
    legend.addTo(map);
    
    let interface = L.control({position:"topleft"});
    interface.onAdd = function() {
        let div = L.DomUtil.create("div", "legend");
        div.innerHTML = '<button id="btn-map-back">Voltar</button>';
        return div;
    }
    interface.addTo(map);

    document.getElementById("btn-map-back").addEventListener("click", function () {
        hideMap();
        showMenu();
    })
}

function updateOEF(mode) {

    layers.clearLayers();   /* clearing existing features */

    if (mode == 1) {
        console.log("loading feature mode 1");
        geojson = L.geoJSON(geojson_data, {style: borders_style, onEachFeature: OEF_mode1}).addTo(layers); 
    }    
    else
    if (mode == 2) {
        console.log("loading feature mode 2");
        geojson = L.geoJSON(geojson_data, {style: borders_style, onEachFeature: OEF_mode2}).addTo(layers); 
    }


    /* Setup the array of municipalities */

    municipalities.sort(() => Math.random() - 0.5);

    goal_town = municipalities[0];

    info = document.getElementById("target");
    info.innerHTML = goal_town;

}


/* onEachFeature for map type 1 (guess mode) */
function OEF_mode1 (feature, layer) {
    layer.addEventListener("mouseover", featureMouseIN_mode1);
    layer.addEventListener("mouseout", featureMouseOUT_mode1);

    layer.addEventListener("click", featureClick_modeGuess);

    //layer.addEventListener("click", featureClick_debug)

    municipalities.push(feature.properties.NAME_2);

}

function OEF_mode2 (feature, layer) {
    layer.addEventListener("mouseover", featureMouseIN_mode2);
    layer.addEventListener("mouseout", featureMouseOUT_mode2);
}


let highlightStyle = {
    weight: 3,
    color: "black",
fillOpacity: 1
};

function borders_color(p) {
    for (let i = 0; i < district_name.length; i++) 
        if (district_name[i] == p) 
            return district_rgb[i];
}

function borders_style(feature) {
    return {
        color: "black",
        weight: 1,
        fillColor: borders_color(feature.properties.NAME_1),
        fillOpacity: 0.7
    };
}



function featureMouseIN_mode1(e) {
    e.target.setStyle(highlightStyle);
    e.target.bringToFront();

}

function featureMouseOUT_mode1(e) {
    geojson.resetStyle(e.target);
}

let idx = 0;
function featureClick_modeGuess(e) {
    let feature_town = e.target.feature.properties.NAME_2;
    if (feature_town == goal_town) {
        goal_town = municipalities[++idx];
        info.innerHTML = goal_town;
        audio_correct.play();
    }
    else {
        audio_click.play();
    }
    


}


function featureMouseIN_mode2(e) {
    e.target.setStyle(highlightStyle);
    e.target.bringToFront();
    let town = e.target.feature.properties.NAME_2;
    info.innerHTML = town;

}

function featureMouseOUT_mode2(e) {
    geojson.resetStyle(e.target);
    info.innerHTML = "";
}

