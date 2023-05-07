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
    
let goal_town = district_name[0];




/* 
L.tileLayer(
"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", 
{attribution: "&copy; OpenStreetMap"}
).addTo(map);
*/

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
    let geojson;
    let layers = L.layerGroup().addTo(map);

    fetch("/webpage/data/layers.geojson")
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {  // add GeoJSON layer to the map once the file is loaded
            geojson = L.geoJSON(data, {style: borders_style, onEachFeature: borders_onEachFeature}).addTo(layers);
        });
    
/* Adding a legend to the map */
let legend = L.control({position: "topright"});
legend.onAdd = function() {
    let div = L.DomUtil.create("div", "legend");
    div.innerHTML = '<p id="goal"></p>';
    return div;
}
legend.addTo(map);

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

function borders_onEachFeature(feature, layer) {
    layer.addEventListener("mouseover", featureMouseOver_modeGuess);
    layer.addEventListener("mouseout", featureMouseOut_modeGuess);

    layer.addEventListener("click", featureClick_modeGuess);
}


    
    
    let highlightStyle = {
        weight: 3,
        color: "black",
    fillOpacity: 1
};

let info = document.getElementById("goal");
info.innerHTML = goal_town;

function featureMouseOver_modeGuess(e) {
    e.target.setStyle(highlightStyle);
    e.target.bringToFront();

}

function featureMouseOut_modeGuess(e) {
    geojson.resetStyle(e.target);
}

let idx = 0;
function featureClick_modeGuess(e) {
    let feature_town = e.target.feature.properties.NAME_2;
    if (feature_town == goal_town) {
        goal_town = district_name[++idx];
        info.innerHTML = goal_town;
    }
}


function featureMouseOver_modePractise(e) {
    e.target.setStyle(highlightStyle);
    e.target.bringToFront();
    let town = e.target.feature.properties.NAME_2;
    info.innerHTML = town;

}

function featureMouseOut_modePractise(e) {
    geojson.resetStyle(e.target);
    info.innerHTML = "";

}

