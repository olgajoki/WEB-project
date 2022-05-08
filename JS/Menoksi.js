// JavaScript source code
//juomapeli
'use strict';
let juomapelinTehtavat = ["Juoppa vähän vettä!", "Otas yksi huikka", "Näytä kaverille ensimmäinen haalarimerkkisi",
  "Ala laulaa kappaletta, jossa mainitaan joku kuukausi","Ota kaksi huikkaa", "Nyt MENOKSI ja uusien ihmisten luo!"];

for(let i = 1; i <= juomapelinTehtavat.length; i++){
  setTimeout(function(){
    alert("OPISKELIJOIDEN JÄÄNMURTAJA - JUOMAPELI : "  + juomapelinTehtavat[i - 1]);
  }, 20000 * i);
}


// Projektin taustatyölinkin taustavärin muuttaminen
// Olga Jokinen 3.5.2022

let lisatietoaLinkki = document.getElementById('linkki');

//muutetaan tausta transparentiksi, kun hiiri on linkin päällä.
function changeColor(){

  lisatietoaLinkki.style.backgroundColor = 'rgba(0%, 0%, 0%, 0.1)';
}

//palautetaan tausta entiselleen, kun hiiri poistuu linkin päältä.
function removeColor(){
  lisatietoaLinkki.style.backgroundColor = 'revert';
}

//tapahtuman käsittelijät hiiren ollessa linkin päällä ja poistuessa sen päältä
lisatietoaLinkki.addEventListener('mouseover', changeColor);
lisatietoaLinkki.addEventListener('mouseout', removeColor);


// Kartta
const apiKey = "AAPKf8c49bd5910c45f2b0e3cfa504ec9557PWvltKsnoVO6Biz4wH88YOyySeuQG7d8oyoTj9qt9RfKvWnrHPQxe8pk8mdl-aGj";

const basemapEnum = "ArcGIS:Navigation";

const map = L.map("map", {
  minZoom: 2

}).setView([60.165249, 24.936056], 12); // Helsingin koordinaatit

L.esri.Vector.vectorBasemapLayer(basemapEnum, {
  apiKey: apiKey
}).addTo(map);

// Add a DOM Node to display the text routing directions
const directions = document.createElement("div");
directions.id = "directions";
directions.innerHTML = "Klikkaa kartasta ensiksi lähtöpiste ja sitten päätepiste.";
document.body.appendChild(directions);

// Layer Group for start/end-points
const startLayerGroup = L.layerGroup().addTo(map);
const endLayerGroup = L.layerGroup().addTo(map);

// Layer Group for route lines
const routeLines = L.layerGroup().addTo(map);

let currentStep = "start";
let startCoords, endCoords;

function updateRoute() {
  // Create the arcgis-rest-js authentication object to use later.
  const authentication = arcgisRest.ApiKeyManager.fromKey(apiKey);

  // make the API request
  arcgisRest
      .solveRoute({
        stops: [startCoords, endCoords],
        endpoint: "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve",
        authentication
      })
      .then((response) => {
        // Show the result route on the map.
        routeLines.clearLayers();
        L.geoJSON(response.routes.geoJson).addTo(routeLines);

        // Show the result text directions on the map.
        const directionsHTML = response.directions[0].features.map((f) => f.attributes.text).join("<br/>");
        directions.innerHTML = directionsHTML;
        startCoords = null;
        endCoords = null;
      })
      .catch((error) => {
        console.error(error);
        alert("There was a problem using the route service. See the console for details.");
      });
}

// When the map is clicked, get the coordinates, store the start or end
// state, and pass them to the updateRoute function which calls the REST endpoint.
map.on("click", (e) => {
  const coordinates = [e.latlng.lng, e.latlng.lat];

  if (currentStep === "start") {
    startLayerGroup.clearLayers();
    endLayerGroup.clearLayers();
    routeLines.clearLayers();
    L.marker(e.latlng).addTo(startLayerGroup);
    startCoords = coordinates;
    currentStep = "end";
  } else {
    L.marker(e.latlng).addTo(endLayerGroup);
    endCoords = coordinates;
    currentStep = "start";
  }

  if (startCoords && endCoords) {
    updateRoute();
  }
});





