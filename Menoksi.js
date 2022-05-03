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

//API, jolla haetaan Helsoingin lähialueiden tapahtumia.

const apiurl = "http://api.hel.fi/linkedevents/v1/event/?division=";
let apiKysely;

// Etsitään HTML-sivulta tarvittavat komponentit id:n avulla.
const hakunappi = document.getElementById("hakunappi");
const hakuteksti = document.getElementById('hakuteksti');
const tulokset = document.querySelector('#APIhaku');


// lisätään napille tapahtumankäsittelijä
hakunappi.addEventListener('click', teeKysely);

// Funktio muodostaa hakukyselyn.
// Lopuksi funktio kutsuu teeHaku() funktiota.
function teeKysely() {

  document.querySelector('#APIhaku').innerHTML = '';

  let value = hakuteksti.value;

  let hakusana = value;

  // muodostetaan ja tulostetaan konsoliin lopullinen hakukysely
  apiKysely = apiurl + hakusana;
  console.log("Lähetettävä kysely: " + apiKysely);

  // kutsutaan fetch-jutut hoitavaa funktiota
  teeHaku(apiKysely);
}


// Funktio saa parametrina hakulauseen.
function teeHaku(apiKysely)  {

  // suoritetaan hakukysely, fetch hoitaa mahdolliset tietoliikenneongelmat.
  fetch(apiKysely).then(function(response) {
    return response.json();
  }).then(function(json) {
    naytaVastaus(json);				// siirrytään varsinaisen datan käsittelyyn.
  }).catch(function(error){           // Jos tapahtuu virhe,
    console.log(error);             // kirjoitetaan virhe konsoliin.
  });
}


// Funktio saa parametrina json-muodossa olevan datan.
function naytaVastaus(jsonData) {

  //lista, jolla huolehditaan, että sivustolle ei tule samaa tapahtumaa useamman kerran

  let list_nimet = [];

  //käydään läpi jsondata eli tapahtumat
  for (let i = 0; i < jsonData.data.length; i++) {

    // jos tapahtuma on jo tulostettu sivustolle, ei lisätä sitä uudelleen.
    if (list_nimet.includes(jsonData.data[i].name.fi)) {
      console.log('on jo sivulla.')
    }
    // jos tapahtuman nimeä ei vielä löydy sivustolta, lisätään tapahtuman tiedot sivustolle.
    else {
      let htmlKoodi = `
<br>
        <h3> Tapahtuman nimi:</h3> ${jsonData.data[i].name.fi}

        <h4>Tapahtuman kuvaus:</h4> ${jsonData.data[i].description.fi}
        `;
      tulokset.innerHTML += htmlKoodi;

      //lisätään tapahtuman nimi taulukkoon
      list_nimet.push(jsonData.data[i].name.fi);
    }
  }

}

// projektin taustatyön linkin taustavärin muuttaminen

let lisatietoaLinkki = document.getElementById('linkki');

//muutetaan tausta transparentiksi, kun hiiri on linkin päällä
function changeColor(evt){

  lisatietoaLinkki.style.backgroundColor = 'rgba(0%, 0%, 0%, 0.1)';
}
//palautetaan tausta entiselleen, kun hiiri poistuu linkin päältä
function removeColor(evt){
  lisatietoaLinkki.style.backgroundColor = 'revert';
}

lisatietoaLinkki.addEventListener('mouseover', changeColor);
lisatietoaLinkki.addEventListener("mouseout", removeColor);



//

// välityspalvelimen (AllOrigins) osoite CORS-ongelman ratkaisemiseen
const proxy = 'https://api.allorigins.win/get?url=';
const apiurlweather = "https://weatherdbi.herokuapp.com/data/weather/";

// hakukysely, jolla dataa haetaan.
let apiKyselyweather;
// hakukysely, johon on lisätty vielä proxyn vaatima lisäys
let proxyApikysely;

// Etsitään HTML-sivulta tarvittavat komponentit id:n avulla.
const hakunappiweather = document.getElementById("hakunappiweather");
const hakutekstiweather = document.getElementById('hakutekstiweather');
const tuloksetweather = document.querySelector('#APIhakuweather');


// lisätään napille tapahtumankäsittelijä
hakunappiweather.addEventListener('click', teeKyselyweather);

// Funktio muodostaa hakukyselyn.
// Lopuksi funktio kutsuu teeHaku() funktiota.
function teeKyselyweather() {

  document.querySelector('#APIhakuweather').innerHTML = '';

  let valueweather = hakutekstiweather.value;

  let hakusanaweather = valueweather;

  // muodostetaan ja tulostetaan konsoliin lopullinen hakukysely
  apiKyselyweather = apiurlweather + hakusanaweather;
  console.log('normaali hakukysely: ' + apiKyselyweather);
  // lisätään vielä proxyn osoite (CORS ongelmien ratkaisija)
  proxyApikysely = proxy + encodeURIComponent(apiKyselyweather);
  console.log("cors-kysely: " + proxyApikysely);

  // kutsutaan fetch-jutut hoitavaa funktiota,
  // huom: osoite sisältää nyt myös proxyn eli välityspalvelimen osoitteen
  teeHakuweather(proxyApikysely);        // parametrina proxyn osoite + hakulause
}

function teeHakuweather(apiKyselyweather)  {

  // suoritetaan hakukysely, fetch hoitaa mahdolliset tietoliikenneongelmat.
  fetch(apiKyselyweather).then(function(response) {
    return response.json();
  }).then(function(json) {
    naytaVastausweather(json);				// siirrytään varsinaisen datan käsittelyyn.
  }).catch(function(error){           // Jos tapahtuu virhe,
    console.log(error);             // kirjoitetaan virhe konsoliin.
  });
}



function naytaVastausweather(proxynData) {

  const jsonData = JSON.parse(proxynData.contents);

  console.log("json muotoinen data sellaisenaan");
  console.log(jsonData);

  console.log("Sellainen se json oli.");


  let htmlKoodiweather = `
<br>
        <h3> Paikka:</h3> ${jsonData.region}

        <h4>Sää tällä hetkellä:</h4>
            <figure>
                <img src="${jsonData.currentConditions.iconURL}">
            </figure>
         <p>Asteita: ${jsonData.currentConditions.temp.c} °</p>
         <br><h4>Sää huomenna:</h4>     
            <figure>
            <img src=" ${jsonData.next_days[1].iconURL}">
            </figure>
         <p>Asteita: ${jsonData.next_days[1].min_temp.c}° - ${jsonData.next_days[1].max_temp.c}°</p>

          <br> <h4>Sää ylihuomenna:</h4>       
            <figure>
            <img src="${jsonData.next_days[2].iconURL}">          
            </figure> 
         <p>Asteita: ${jsonData.next_days[2].min_temp.c}° - ${jsonData.next_days[2].max_temp.c}°</p>


            `;
  tuloksetweather.innerHTML += htmlKoodiweather;


}



