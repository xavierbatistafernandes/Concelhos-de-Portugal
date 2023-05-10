/**
 * @author Xavier Fernandes
 * 
 * 
 */

const colors_many = [
    '#1f77b4',
    '#ff7f0e',
    '#2ca02c',
    '#d62728',
    '#9467bd',
    '#8c564b',
    '#e377c2',
    '#7f7f7f',
    '#bcbd22',
    '#17becf',
    '#aec7e8',
    '#ffbb78',
    '#98df8a',
    '#ff9896',
    '#c5b0d5',
    '#c49c94',
    '#f7b6d2',
    '#c7c7c7'];

const colors_grey = [
    'rgba(240, 240, 240, 0.8)',
    'rgba(228, 228, 228, 0.8)',
    'rgba(216, 216, 216, 0.8)',
    'rgba(204, 204, 204, 0.8)',
    'rgba(192, 192, 192, 0.8)',
    'rgba(180, 180, 180, 0.8)',
    'rgba(168, 168, 168, 0.8)',
    'rgba(156, 156, 156, 0.8)',
    'rgba(144, 144, 144, 0.8)',
    'rgba(132, 132, 132, 0.8)',
    'rgba(120, 120, 120, 0.8)',
    'rgba(108, 108, 108, 0.8)',
    'rgba(96, 96, 96, 0.8)',
    'rgba(84, 84, 84, 0.8)',
    'rgba(72, 72, 72, 0.8)',
    'rgba(60, 60, 60, 0.8)',
    'rgba(48, 48, 48, 0.8)',
    'rgba(36, 36, 36, 0.8)'];

let colors = colors_many;

//town_colors_gray.sort(() => Math.random() - 0.5);

let district_name = [
    "Aveiro",          
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

let target;

let audio_click = document.getElementById("audio-click");
let audio_correct = document.getElementById("audio-correct");
let audio_incorrect = document.getElementById("audio-incorrect");

/* Feature style configurations */
let style_highlight = {weight: 3, color: "black", fillOpacity: 1};
let style_supress = {weight: 1, color: "black", fillOpacity: 0.7};
let style_correct;
let style_incorrect;

function newCOLOR_correct(i) {
    const correctColors = ['#41ab5d','#74c476','#a1d99b'];
    return correctColors[i];
}

function newCOLOR_incorrect(i) {
    const incorrectColors = ['#fed976','#feb24c','#fd8d3c','#fc4e2a', '#e31a1c'];
    return incorrectColors[i];
}

function markCOLOR(i) {
    const colors = ['#41ab5d','#fed976','#feb24c','#fd8d3c','#fc4e2a', '#e31a1c'];
    return colors[i];
}

let layers;
let geojson;


let municipalities = [];
let features = [];

let goal_town;
let geojson_data;

let incorrect_count = 0;
let max_tries = 5;

let map = null;



/* Receive data from the URL */
var urlParams = new URLSearchParams(window.location.search);
var mode = urlParams.get('mode');
console.log("[INFO] mode = " + mode); 

/* Determine the display mode according to URL data */
clearMap();
loadMap();

function clearMap() {
    if (map != null)
        map.remove();
}

function loadMap() {
    
    map = L.map("map").setView([39.51, -8.56], 7);

    L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
        attribution: "&copy; OpenStreetMap",
        subdomains: 'abcd',
        minZoom: 2,
        maxZoom: 10,
        ext: 'jpg'
    }).addTo(map);


    /* Loading borders of municipalities */
    layers = L.layerGroup().addTo(map);

    /* Loads GeoJSON data of the municipalities */
    fetch("./data/portugal.geojson")
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {  // add GeoJSON layer to the map once the file is loaded
            geojson_data = data;

            
            /* Adding an interface to show the targer municipality */
            let legend = L.control({position: "topright"});
            legend.onAdd = function() {
                let div = L.DomUtil.create("div", "legend");
                div.innerHTML = '<p id="target"></p>';
                return div;
            }
            legend.addTo(map);
            target = document.getElementById("target");

            
            initMode(mode);
        });

}


/* onEachFeature for map type 1 (guess mode) */
function OEF_PlayMode1 (feature, layer) {
    layer.addEventListener("mouseover", featureMouseIN_mode1);
    layer.addEventListener("mouseout", featureMouseOUT_mode1);

    layer.addEventListener("click", featureClick_mode1);

    //layer.addEventListener("click", featureClick_debug)

    municipalities.push(feature.properties.NAME_2);
}

/* onEachFeature for map type 2 (info mode) */
function OEF_LearnMode1 (feature, layer) {
    layer.addEventListener("mouseover", featureMouseIN_mode2);
    layer.addEventListener("mouseout", featureMouseOUT_mode2);
}


function initMode(mode) {
    if (mode == "p1") initPlayMode1(); else
    if (mode == "p2") initPlayMode2(); else
    if (mode == "l1") initLearnMode1();
}

function initPlayMode1() {
    colors = colors_grey; 

    geojson = L.geoJSON(geojson_data, {style: borders_style, onEachFeature: OEF_PlayMode1}).addTo(layers);

    /* Saving references to each municipality */
    geojson.eachLayer(function (layer) {
        features.push(layer);
    });

    /* Setup the array of municipalities */
    municipalities.sort(() => Math.random() - 0.5);

    goal_town = municipalities[0];
    target.innerHTML = goal_town;
}

function initLearnMode1() {
    colors = colors_many;

    console.log("initLearnMode1()");
    geojson = L.geoJSON(geojson_data, {style: borders_style, onEachFeature: OEF_LearnMode1}).addTo(layers); 
}








function borders_color(p) {
    for (let i = 0; i < district_name.length; i++) 
        if (district_name[i] == p) 
            return colors[i];
}

function borders_style(feature) {
    return {color: "black", weight: 1, fillColor: borders_color(feature.properties.NAME_1), fillOpacity: 0.7};
}



function featureMouseIN_mode1(e) {
    e.target.setStyle(style_highlight);
    e.target.bringToFront();
}

function featureMouseOUT_mode1(e) {
    e.target.setStyle(style_supress);
    e.target.bringToFront();
}

function featureClick_mode1(e) {
    let feature_town = e.target.feature.properties.NAME_2;
    
    /* Plays a sound effect when guessing */
    feature_town == goal_town? audio_correct.play(): audio_click.play();

    /* Checking if the guess is correct */
    if (feature_town == goal_town) {
        markFeatureAsDone(e.target);
        selectNewTarget();
        
        e.target.removeEventListener("mouseover", featureMouseIN_mode1);
        e.target.removeEventListener("click", featureClick_mode1);
    }
    else {
        incorrect_count++;
        console.log(incorrect_count);
    }

    if (incorrect_count == max_tries) {
        let feat = getFeatureReference(goal_town);
        console.log(feat);
        console.log(feat.feature.properties.NAME_2);
        markFeatureAsDone(feat);
        audio_incorrect.play();

        selectNewTarget();
        //map.setView([39.51, -8.56], 7)
    }

}

function getFeatureReference(municipality_name) {
    for (let i = 0; i < features.length; i++) {
        if (features[i].feature.properties.NAME_2 == municipality_name) {
            return features[i];
        }
    }
}

function markFeatureAsDone(target) {
    style_correct = {weight: 1, color: "black", fillColor: markCOLOR(incorrect_count), fillOpacity: 1};
    target.setStyle(style_correct);
    target.bringToFront();

    target.removeEventListener("mouseover", featureMouseIN_mode1);
    target.removeEventListener("mouseout", featureMouseOUT_mode1);
    target.removeEventListener("click", featureClick_mode1);
}


function markFeatureAsIncorrect(target) {
    style_correct = {weight: 3, color: "black", fillColor: newCOLOR_incorrect(incorrect_count), fillOpacity: 1};
    target.setStyle(style_correct);
    target.bringToFront();
}

let count = 0;
function selectNewTarget () {
    goal_town = municipalities[++count];
    target.innerHTML = goal_town;
    incorrect_count = 0;
}

function featureMouseIN_mode2(e) {
    e.target.setStyle(style_highlight);
    e.target.bringToFront();
    let town = e.target.feature.properties.NAME_2;
    target.innerHTML = town;

}

function featureMouseOUT_mode2(e) {
    geojson.resetStyle(e.target);
    target.innerHTML = "";

}

