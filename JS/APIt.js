// Hakukenttien taustavärin muuttaminen
// Olga Jokinen 3.5.2022

let lisatietoaHakukentta = document.getElementById('hakuteksti');
let lisatietoaHakukenttaWeather = document.getElementById('hakutekstiWeather');

//muutetaan taustan väriä, kun hiiri on haun päällä.
function changeColor(){

    lisatietoaHakukentta.style.backgroundColor = 'rgba(0%, 0%, 0%, 0.1)';

}

function changeColorWeather(){

    lisatietoaHakukenttaWeather.style.backgroundColor = 'rgba(0%, 0%, 0%, 0.1)';

}

//palautetaan tausta entiselleen, kun hiiri poistuu haun päältä.
function removeColor(){
    lisatietoaHakukentta.style.backgroundColor = 'revert';

}

function removeColorWeather(){
    lisatietoaHakukenttaWeather.style.backgroundColor = 'revert';

}

//tapahtuman käsittelijät hiiren ollessa haun päällä ja poistuessa sen päältä
lisatietoaHakukentta.addEventListener('mouseover', changeColor);
lisatietoaHakukentta.addEventListener('mouseout', removeColor);

lisatietoaHakukenttaWeather.addEventListener('mouseover', changeColorWeather);
lisatietoaHakukenttaWeather.addEventListener('mouseout', removeColorWeather);



//API, jolla haetaan Helsingin lähialueiden tapahtumia ja tulostetaan ne erilliseen scroll bar boksiin.
// Olga Jokinen 4.5.2022

// välityspalvelimen (AllOrigins) osoite CORS-ongelman ratkaisemiseen
const proxy = 'https://api.allorigins.win/get?url=';

//APIn url
const apiurl = "http://api.hel.fi/linkedevents/v1/event/?division=";
let apiKysely;

// hakukysely, johon on lisätty vielä proxyn vaatima lisäys
let proxyApikysely;

// Etsitään HTML-sivulta tarvittavat komponentit.
const hakunappi = document.getElementById("hakunappi");
const hakuteksti = document.getElementById('hakuteksti');
const tulokset = document.querySelector('#APIhaku');

// lisätään napille tapahtumankäsittelijä
hakunappi.addEventListener('click', teeKysely);

// Funktio muodostaa hakukyselyn.
// Lopuksi funktio kutsuu teeHaku() funktiota.
function teeKysely() {

    //tyhjennetään osio, kun aloitetaan uuden haun tekeminen.
    document.querySelector('#APIhaku').innerHTML = '';

    // hakutulokset tulostetaan erilliseen scrollbar osuuteen. Vaihdetaan scrollbar näkyväksi, kun haku on suoritettu.
    tulokset.style.visibility = "visible";

    let hakusana = hakuteksti.value;

    // muodostetaan ja tulostetaan konsoliin lopullinen hakukysely
    apiKysely = apiurl + hakusana;

// lisätään vielä proxyn osoite (CORS ongelmien ratkaisija)
    proxyApikysely = proxy + encodeURIComponent(apiKysely);

// kutsutaan fetch-jutut hoitavaa funktiota,
// huom: osoite sisältää nyt myös proxyn eli välityspalvelimen osoitteen
    teeHaku(proxyApikysely);        // parametrina proxyn osoite + hakulause
}


// Funktio saa parametrina hakulauseen.
function teeHaku(apiKysely)  {

    // suoritetaan hakukysely, fetch hoitaa mahdolliset tietoliikenneongelmat.
    fetch(apiKysely).then(function(response) {
        return response.json();
    }).then(function(json) {
        naytaVastaus(json);				// siirrytään varsinaisen datan käsittelyyn.
    }).catch(function(error){
        console.log(error);             // kirjoitetaan virhe konsoliin.
    });
}


// Funktio saa parametrina json-muodossa olevan datan.
function naytaVastaus(proxynData) {

    const jsonData = JSON.parse(proxynData.contents);

    //lista, jolla huolehditaan, että sivustolle ei tule samaa tapahtumaa useamman kerran.
    let list_nimet = [];

    //käydään läpi jsondata eli tapahtumat
    for (let i = 0; i < jsonData.data.length; i++) {

        // jos tapahtuma on jo tulostettu sivustolle, ei lisätä sitä uudelleen.
        if (list_nimet.includes(jsonData.data[i].name.fi)) {

            console.log('on jo sivulla.')

        }

        // jos tapahtuman nimeä ei vielä löydy sivustolta, lisätään tapahtuman tiedot sivustolle.
        else {
            let htmlKoodi =
                `
         <h3>${jsonData.data[i].name.fi}</h3>

         ${jsonData.data[i].description.fi}
        
        `;

            tulokset.innerHTML += htmlKoodi;

            //lisätään tapahtuman nimi taulukkoon
            list_nimet.push(jsonData.data[i].name.fi);
        }
    }

}



// API, jolla haetaan käyttäjän kirjoittaman kaupungin lähipäivien säätiedot.
//Olga Jokinen 3.5.2022


const apiurlWeather = "https://weatherdbi.herokuapp.com/data/weather/";

// hakukysely, jolla dataa haetaan.
let apiKyselyWeather;

// Etsitään HTML-sivulta tarvittavat komponentit id:n avulla.
const hakunappiWeather = document.getElementById("hakunappiWeather");
const hakutekstiWeather = document.getElementById('hakutekstiWeather');
const tuloksetWeather = document.querySelector('#APIhakuWeather');


// lisätään napille tapahtumankäsittelijä
hakunappiWeather.addEventListener('click', teeKyselyWeather);

// Funktio muodostaa hakukyselyn.
// Lopuksi funktio kutsuu teeHaku() funktiota.
function teeKyselyWeather() {

    //tyhjennetään osio, kun aloitetaan uuden haun tekeminen.
    document.querySelector('#APIhakuWeather').innerHTML = '';

    let hakusanaWeather = hakutekstiWeather.value;
    let proxyApikysely;
    // muodostetaan ja tulostetaan konsoliin lopullinen hakukysely
    apiKyselyWeather = apiurlWeather + hakusanaWeather;
    // lisätään vielä proxyn osoite (CORS ongelmien ratkaisija)
    proxyApikysely = proxy + encodeURIComponent(apiKyselyWeather);

    // kutsutaan fetch-jutut hoitavaa funktiota,
    // huom: osoite sisältää nyt myös proxyn eli välityspalvelimen osoitteen
    teeHakuWeather(proxyApikysely);        // parametrina proxyn osoite + hakulause
}

function teeHakuWeather(apiKyselyWeather)  {

    // suoritetaan hakukysely, fetch hoitaa mahdolliset tietoliikenneongelmat.
    fetch(apiKyselyWeather).then(function(response) {
        return response.json();
    }).then(function(json) {
        naytaVastausWeather(json);				// siirrytään varsinaisen datan käsittelyyn.
    }).catch(function(error){         // Jos tapahtuu virhe,
        // Pyydetään käyttäjää tarkistamaan hakusana.
        let htmlVirhe =
            `
        <p>Tarkista hakusanasi.</p>
        `;
        tuloksetWeather.innerHTML += htmlVirhe;

        console.log(error);             // kirjoitetaan virhe konsoliin.
    });
}


//Tulostetaan json konsoliin
function naytaVastausWeather(proxynDataWeather) {
    console.log('Hakusanassa ei ole vikaa, mutta koodissa \n const jsonDataWeather = JSON.parse(proxynDataWeather.contents);\n vaikuttaisi olevan. :(')
    const jsonDataWeather = JSON.parse(proxynDataWeather.contents);

    console.log("json muotoinen data sellaisenaan");
    console.log(jsonDataWeather);
    console.log("Sellainen se json oli.");

//Lisätään tämän hetkinen, huomisen ja ylihuomisen säätiedot html:ään

    let htmlKoodiWeather = `
<br>
        <h3> Paikka:</h3> ${jsonData.region}

        <h4>Sää tällä hetkellä:</h4>
            <figure>
                <img src="${jsonData.currentConditions.iconURL}" alt="weather icon">
            </figure>
         <p>Asteita: ${jsonData.currentConditions.temp.c} °</p>
         
         <h4>Sää huomenna:</h4>     
            <figure>
                <img src=" ${jsonData.next_days[1].iconURL}" alt="weather icon">
            </figure>
         <p>Asteita: ${jsonData.next_days[1].min_temp.c}° - ${jsonData.next_days[1].max_temp.c}°</p>

         
         <h4>Sää ylihuomenna:</h4>       
            <figure>
                <img src="${jsonData.next_days[2].iconURL}" alt="weather icon">          
            </figure> 
         <p>Asteita: ${jsonData.next_days[2].min_temp.c}° - ${jsonData.next_days[2].max_temp.c}°</p>

            `;

    tuloksetWeather.innerHTML += htmlKoodiWeather;

}

// Kartta, jossa reititystoiminto
// Olga Jokinen 8.5.2022

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

