'use strict';

/*
	Javascript-tiedosto AJAX-tehtäviä varten.
	Jos etsitään TV-sarjoja haulla "girls", niin TV Maze APIsta suoritettava hakuosoite on:
    http://api.hel.fi/linkedevents/v1/	Testaa haun toimintaa omassa selaimessa.
	Kun koodi toimii, niin poista turhat open höpinät.
*/

// hakuosoitteen vakio-osa.
const apiurl = "http://api.hel.fi/linkedevents/v1/event/?start=";

// lopullinen hakukysely, joka lähetetään nettiin.
let apiKysely;

// Etsitään HTML-sivulta tarvittavat komponentit id:n avulla.
const hakunappi = document.getElementById("hakunappi");
// TODO: etsi hakukenttä eli syöttökenttä johon käyttäjä kirjoittaa hakusanan.
const hakuteksti = document.getElementById('hakuteksti');
// TODO: etsi html-sivulta main-tagi eli minkä sisään hakutulokset laitetaan.
const tulokset = document.querySelector('main');


// lisätään napille tapahtumankäsittelijä
hakunappi.addEventListener('click', teeKysely);

// Funktio muodostaa hakukyselyn.
// Lopuksi funktio kutsuu teeHaku() funktiota.
function teeKysely() {


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
    // AJAX-tehtävän vaihe 1 on suoritettu, jos alla oleva koodi
    // tulostaa konsoliin noin 10 sarjan tiedot (Array, jonka koko on 10).
    // Muuta kuitenkin koodia että hakee käyttäjän antamalla hakusanalla.
    console.log("json sellaisenaan");
    console.log(jsonData);
    console.log("Sellainen se json oli.");

    /*
        Aha, json-dataoliot ovat siis taulukossa.
        Yksi dataolio sisältää yhden sarjan tiedot.
        Ope ei osaa käsitellä kuin eka sarjan tietoja.
        Mistä mikin data löytyy: katso TV-Mazen API-kuvauksesta.
    */


    // Tulostetaan konsoliin muutama tieto eka sarjasta jsonData[0].
    console.log("Eka sarjan nimi: " + jsonData[0].name);

    // TODO: kerää tarvittava data ja tulosta se web-sivulle.
    // Valmistellaan html-sivulle tuleva koodi.

    //vaihe 2


        let htmlKoodi =
            `
<br>Eka sarjan nimi:  + ${jsonData[0]}
        
        `;

        
    tulokset.innerHTML += htmlKoodi;

/*
    
        //vaihe 3
        for (let i = 0; i < jsonData.length; i++) {


        

            let htmlKoodi =
                `
        <h2>Hakemasi sarjan nimi:</h2> <b>${jsonData[i].show.name}</b> <br>

        Sarjan genret: <i>${jsonData[i].show.genres.join(", ")}</i>
        <br>
        
        <a href="${jsonData[i].show.officialSite}" target="_blank" rel="noopener noreferrer">Sarjan kotisivu</a>
        <br>
        <figure>
            <img src="${jsonData[i].show.image.medium}">
        </figure>
         <br>
            <h3>Summary:</h3> ${jsonData[i].show.summary}

        `;
            let kuvanOsoite;
            if (jsonData[i].show.image == null || jsonData[i].show.image.medium == null) {
                kuvanOsoite = "img/not-found.jpg";

            }
            else {
                kuvanOsoite = jsonData[i].show.image.medium;
            }

            tulokset.innerHTML += htmlKoodi;
        }*/
    
}
