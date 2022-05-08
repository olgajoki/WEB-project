
//API, jolla haetaan Helsoingin lähialueiden tapahtumia ja tulostetaan ne erilliseen scroll bar boksiin.
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


//Tulostetaan json kosoliin
function naytaVastausWeather(proxynData) {

    const jsonData = JSON.parse(proxynData.contents);

    console.log("json muotoinen data sellaisenaan");
    console.log(jsonData);
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
         <br>
         <h4>Sää huomenna:</h4>     
            <figure>
                <img src=" ${jsonData.next_days[1].iconURL}" alt="weather icon">
            </figure>
         <p>Asteita: ${jsonData.next_days[1].min_temp.c}° - ${jsonData.next_days[1].max_temp.c}°</p>

         <br>
         <h4>Sää ylihuomenna:</h4>       
            <figure>
                <img src="${jsonData.next_days[2].iconURL}" alt="weather icon">          
            </figure> 
         <p>Asteita: ${jsonData.next_days[2].min_temp.c}° - ${jsonData.next_days[2].max_temp.c}°</p>

            `;

    tuloksetWeather.innerHTML += htmlKoodiWeather;

}