// _ = helper functions
let up;
let minutesLeft;

function _parseMillisecondsIntoReadableTime(timestamp) {
  //Get hours from milliseconds
  const date = new Date(timestamp * 1000);
  // Hours part from the timestamp
  const hours = '0' + date.getHours();
  // Minutes part from the timestamp
  const minutes = '0' + date.getMinutes();
  // Seconds part from the timestamp (gebruiken we nu niet)
  // const seconds = '0' + date.getSeconds();

  // Will display time in 10:30(:23) format
  return hours.substr(-2) + ':' + minutes.substr(-2); //  + ':' + s
}

const goSun = function(sun, total, now, interval) {
  if (up < total) {
    up = up + 1;
    // console.log(up);
    now.setMinutes(now.getMinutes() + 1);
    let procent = (up / total) * 100;
    if (now.getMinutes() < 10) {
      sun.dataset.time = `${now.getHours()}:0${now.getMinutes()}`;
    } else {
      sun.dataset.time = `${now.getHours()}:${now.getMinutes()}`;
    }
    sun.style.left = procent + '%';
    if (procent < 50) {
      sun.style.bottom = 2 * procent + '%';
    } else {
      sun.style.bottom = 2 * (100 - procent) + '%';
    }
    minutesLeft.innerHTML = minutesLeft.innerHTML - 1;
  } else {
    document.querySelector('html').classList.add('is-night');
    clearInterval(interval);
  }
};

// 5 TODO: maak updateSun functie
const updateSun = function(up, total, sunrise) {
  let sun = document.querySelector('.js-sun');
  let now = new Date(Date.now());
  let procent = (up / total) * 100;
  if (up < total) {
    // console.log(up);

    let procent = (up / total) * 100;
    if (now.getMinutes() < 10) {
      sun.dataset.time = `${now.getHours()}:0${now.getMinutes()}`;
    } else {
      sun.dataset.time = `${now.getHours()}:${now.getMinutes()}`;
    }
    sun.style.left = procent + '%';
    if (procent < 50) {
      sun.style.bottom = 2 * procent + '%';
    } else {
      sun.style.bottom = 2 * (100 - procent) + '%';
    }
    minutesLeft.innerHTML = minutesLeft.innerHTML - 1;
  }
  // goSun(sun, total, now, interval);
  let interval = setInterval(function() {
    goSun(sun, total, now, interval);
  }, 60000);
};

// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
let placeSunAndStartMoving = (totalMinutes, sunrise) => {
  // In de functie moeten we eerst wat zaken ophalen en berekenen.
  // Haal het DOM element van onze zon op en van onze aantal minuten resterend deze dag.
  // Bepaal het aantal minuten dat de zon al op is.
  // Nu zetten we de zon op de initiële goede positie ( met de functie updateSun ). Bereken hiervoor hoeveel procent er van de totale zon-tijd al voorbij is.
  // We voegen ook de 'is-loaded' class toe aan de body-tag.
  // Vergeet niet om het resterende aantal minuten in te vullen.
  // Nu maken we een functie die de zon elke minuut zal updaten
  // Bekijk of de zon niet nog onder of reeds onder is
  // Anders kunnen we huidige waarden evalueren en de zon updaten via de updateSun functie.
  // PS.: vergeet weer niet om het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten.
  // const sun = document.querySelector('.js-sun');
  minutesLeft = document.querySelector('.js-time-left');
  console.log(minutesLeft);
  let now = new Date(Date.now() - sunrise);
  up = now.getHours() * 60 + now.getMinutes();
  minutesLeft.innerHTML = totalMinutes - up;
  updateSun(up, totalMinutes, sunrise);
};

// 3 Met de data van de API kunnen we de app opvullen
let showResult = queryResponse => {
  // We gaan eerst een paar onderdelen opvullen
  // Zorg dat de juiste locatie weergegeven wordt, volgens wat je uit de API terug krijgt.
  // Toon ook de juiste tijd voor de opkomst van de zon en de zonsondergang.
  // Hier gaan we een functie oproepen die de zon een bepaalde positie kan geven en dit kan updaten.
  // Geef deze functie de periode tussen sunrise en sunset mee en het tijdstip van sunrise.
  document.querySelector('.js-location').innerHTML = `${queryResponse.city.name}, belgium`;
  let sunrise = new Date(queryResponse.city.sunrise * 1000);
  document.querySelector('.js-sunrise').innerHTML = `${sunrise.getHours()}:${sunrise.getMinutes()}`;
  let sunset = new Date(queryResponse.city.sunset * 1000);
  document.querySelector('.js-sunset').innerHTML = `${sunset.getHours()}:${sunset.getMinutes()}`;
  let difference = new Date(sunset - sunrise);
  placeSunAndStartMoving(difference.getHours() * 60 + difference.getMinutes(), sunrise);
};

// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
let getAPI = async (lat, lon) => {
  // Eerst bouwen we onze url op
  // Met de fetch API proberen we de data op te halen.
  // Als dat gelukt is, gaan we naar onze showResult functie.

  let url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=1eb1ad538540d4142343754acf4e24eb&units=metric&lang=nl&cnt=1`;
  let response = await fetch(url);
  let json = await response.json();
  showResult(json);
};

document.addEventListener('DOMContentLoaded', function() {
  // 1 We will query the API with longitude and latitude.
  getAPI(50.8027841, 3.2097454);
});
