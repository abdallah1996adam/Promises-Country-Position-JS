let btnClick = document.querySelector('button');
let countriesContainer = document.querySelector('.container');

const renderCountry = function (data, className = '') {
  const html = `
  <article class="country ${className}">
    <img class="country__img" src="${data.flag}" />
    <div class="country__data">
      <h3 class="country__name">${data.name}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)} people</p>
      <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
      <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
    </div>
  </article>
  `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

//function that make a call vers L'API and return it's response in JSON format
const getJson = function (url, errorMsg = `quelque chose s'est mal passé`) {
  return fetch(url).then(res => {
    if (!res.ok) throw new Error(`${errorMsg}(${res.status})`);
    return res.json();
  });
};

const getPosition = function () {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

async function whereAmi() {
  try {
    //GeoLocation
    const position = await getPosition();
    const { latitude: lat, longitude: lng } = position.coords;
    //Reverse GeoCoding
    const posData = await fetch(
      `https://geocode.xyz/${lat}, ${lng}?geoit=json`
    );
    if (!posData.ok) throw new Error('problem getting location data');
    const posDataGeo = await posData.json();
    //Country Data
    const countryData = await fetch(
      `https://restcountries.eu/rest/v2/name/${posDataGeo.country}`
    );
    if (!posData.ok) throw new Error('problem getting country data');
    const data = await countryData.json();
    renderCountry(data[0]);
    //returning value from async function
    return `you are in ${posDataGeo.city}, ${posDataGeo.country} `;
  } catch (err) {
    console.error(err);
    //reject promise returned from async function
    throw err;
  }
}
//reading value that have been returned from async function using old method
// whereAmi()
//   .then(city => console.log(city))
//   .catch(err => console.error(err))
//   .finally(() => console.log('tout va bien'));
//reading value that have been returned from async function using new method
(async function () {
  try {
    const country = await whereAmi();
  } catch (err) {
    console.error(err);
  }
  console.log('tout va bien');
})();

//getting the capital for 3 countries when running Promises in Parallel
async function get3CountriesCapital(C1, C2, C3) {
  try {
    // const [data1] = await getJson(
    //   `https://restcountries.eu/rest/v2/name/${C1}`
    // );
    // const [data2] = await getJson(
    //   `https://restcountries.eu/rest/v2/name/${C2}`
    // );
    // const [data3] = await getJson(
    //   `https://restcountries.eu/rest/v2/name/${C3}`
    // );
    // console.log([data1.capital, data2.capital, data3.capital]);

    //whenever I have a situation in which I need to do multiple async opreations at the same time and operations that dooesn't depend on each other then I should always run them in a Parallel way using promise.all
    const data = await Promise.all([
      getJson(`https://restcountries.eu/rest/v2/name/${C1}`),
      getJson(`https://restcountries.eu/rest/v2/name/${C2}`),
      getJson(`https://restcountries.eu/rest/v2/name/${C3}`),
    ]);
    console.log(data.map(d => d[0].capital));
  } catch (err) {
    console.err(err);
  }
}
get3CountriesCapital('portugal', 'france', 'germany');

//Promise.race it's receives an array of Promises and return a Promise and the Promise that has been returned by Promise.race is settled as soon as one the input promises settles and settled simply means that a value is available, but it doesn't matter if the promise get rejected or fulfilled, at the end the first promise that get fulfilled win the race 

(async function(){
  const country = await Promise.race([
    getJson("https://restcountries.eu/rest/v2/name/italy"),
    getJson("https://restcountries.eu/rest/v2/name/egypt"),
    getJson("https://restcountries.eu/rest/v2/name/turkey") 
  ])
  console.log(country[0]);
})();
