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