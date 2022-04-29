'use strict';

/*
	Javascript-tiedosto AJAX-tehtäviä varten.
	Jos etsitään TV-sarjoja haulla "girls", niin TV Maze APIsta suoritettava hakuosoite on:
    http://api.hel.fi/linkedevents/v1/	Testaa haun toimintaa omassa selaimessa.
	Kun koodi toimii, niin poista turhat open höpinät.
*/

// hakuosoitteen vakio-osa.
const apiurl = "http://api.hel.fi/linkedevents/v1/event/?division=";

// lopullinen hakukysely, joka lähetetään nettiin.
let apiKysely;

// Etsitään HTML-sivulta tarvittavat komponentit id:n avulla.
const hakunappi = document.getElementById("hakunappi");
// TODO: etsi hakukenttä eli syöttökenttä johon käyttäjä kirjoittaa hakusanan.
const hakuteksti = document.getElementById('hakuteksti');
// TODO: etsi html-sivulta main-tagi eli minkä sisään hakutulokset laitetaan.
const tulokset = document.querySelector('#APIhaku');


// lisätään napille tapahtumankäsittelijä
hakunappi.addEventListener('click', teeKysely);

// Funktio muodostaa hakukyselyn.
// Lopuksi funktio kutsuu teeHaku() funktiota.
function teeKysely() {

    document.querySelector('#APIhaku').innerHTML = '';

    // TODO: haetaan html-sivulta käyttäjän antama hakuteksti (muista .value)
    const value = hakuteksti.value; 

    // TODO: muuta alla oleva kovakoodaus hakusanasta.
    const hakusana = value;                               //document.getElementById('hakuteksti').value;        

    // muodostetaan ja tulostetaan konsoliin lopullinen hakukysely
    apiKysely = apiurl + hakusana;
    console.log("Lähetettävä kysely: " + apiKysely);

    // kutsutaan fetch-jutut hoitavaa funktiota
    teeHaku(apiKysely);        // parametrina hakulause
}


// Idea: tämä fetch-osa säilyy yleensä samana.
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


// Funktio hoitaa kyselystä saadun json-datan käsittelyn.
// Funktio saa parametrina json-muodossa olevan datan.
function naytaVastaus(jsonData) {

    
    let list_nimet = [];

    for (let i = 0; i < jsonData.data.length; i++) {

        //lista, jolla huolehditaan, että sivustolle ei tule samaa tapahtumaa useamman kerran

        if (list_nimet.includes(jsonData.data[i].name.fi)) {
            console.log('on jo sivulla.')
        }
        // jos tapahtuman nimeä ei vielä löydy sivustolta, lisätään tapahtuman tiedot sivustolle
        else {
            let htmlKoodi =
                `
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
