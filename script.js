window.addEventListener('load', () => {
  fetchPokeDataJson('https://pokeapi.co/api/v2/pokemon/');
  saveDataToFilter();
  document.body.style.overflow = "hidden";
  setTimeout(() => {
    document.getElementById("loadingScreen").style.display = "none";
    document.body.style.overflow = "";
  }, 1000);
});

let pokeData;
let pokeCounter = 0;
let pokeContainerCounter = 0;
let pokeCounterIndex = 0;
let pokeDataCounter = 0;
let pokeSearchArray = [];

async function fetchPokeDataJson(url) {
  try {
    let response = await fetch(url);
    let responseJson = await response.json();
    pokeData = responseJson;
    showPokemon(pokeData);
  } catch (error) {
    document.getElementById("pokemonContainer").innerHTML = `<p>Fehler beim Laden der Pokémon-Daten. Bitte versuche es später erneut.</p>`;
  };  
  document.getElementById("morePkmnButton").disabled = false;
  document.getElementById("morePkmnButton").innerText = "Show more Pokemon";
}

async function showPokemon(data) {
  let pokeInfos = [];
  for (let i = 0; i < data.results.length; i++) {
    pokeCounter++;
    let pokeName = data.results[i].name.toUpperCase();
    pokeInfos.push(fetchSinglePokeDataJson(pokeName, data.results[i].url));
  };
  showPokemonPromiseAll(pokeInfos);
}

async function showPokemonPromiseAll (pokeInfos) {
  let allPokeInfos = await Promise.all(pokeInfos);
  allPokeInfos.forEach(data => {
    document.getElementById("pokemonContainer").innerHTML += getPokemonTemplate(data.name, data.id, data.img, data.type1, data.url, data.type2);
    showPokeTypes(data.types);
  });  
  setPokeData(allPokeInfos);
}

function setPokeData(pokeInfoArray) {
  for (let i = 0; i < pokeInfoArray.length; i++) {
        document.querySelectorAll(".pokeCard")[pokeDataCounter].dataset.name = pokeInfoArray[i].name;
        document.querySelectorAll(".pokeCard")[pokeDataCounter].dataset.id = pokeInfoArray[i].id;
        document.querySelectorAll(".pokeCard")[pokeDataCounter].dataset.img = pokeInfoArray[i].img;
        document.querySelectorAll(".pokeCard")[pokeDataCounter].dataset.type1 = pokeInfoArray[i].types[0].type.name;
        if(pokeInfoArray[i].types[1]) {
          document.querySelectorAll(".pokeCard")[pokeDataCounter].dataset.type2 = pokeInfoArray[i].types[1].type.name;
        }
        pokeDataCounter++;        
  }  
}

async function fetchSinglePokeDataJson(data, pokeUrl) {
  try {
    let response = await fetch(pokeUrl);
    let responseJson = await response.json();
    return fetchSinglePokeDataJsonReturn(data, pokeUrl, responseJson)
  } catch {
    document.getElementById("pokemonContainer").innerHTML = `<p>Fehler beim Laden der Pokémon-Daten. Bitte versuche es später erneut.</p>`;
  }
}

function fetchSinglePokeDataJsonReturn(data, pokeUrl, responseJson) {
  let secondType;
  if(responseJson.types[1]) {
    secondType = responseJson.types[1].type.name;
  } return {
    name: data,
    id: responseJson.id,
    img: responseJson.sprites.front_default,
    types: responseJson.types,
    type1: responseJson.types[0].type.name,
    url: pokeUrl,
    type2: secondType
  }
}

function showPokeTypes(pokeTypesData) {
  for (let i = 0; i < pokeTypesData.length; i++) {
    document.querySelectorAll(".pokeTypes")[pokeCounterIndex].innerHTML += `<div class="${pokeTypesData[i].type.name}">${pokeTypesData[i].type.name}</div>`;
  }
  pokeCounterIndex++;
}

async function showMainInfos(data) {
    let urlFinder = pokeSearchArray.filter(el => el.id === Number(data.dataset.id));
    try {
    let response = await fetch(urlFinder[0].url);
    let responseJson = await response.json();
    showMainInfosTemplate(responseJson.height, responseJson.weight, responseJson.base_experience);
    for (let i = 0; i < responseJson.abilities.length; i++) {
        document.getElementById("abilitySpan").innerHTML += `<p>${responseJson.abilities[i].ability.name}</p>`;    
    };
    document.getElementById("mainButton").style.borderBottom = "4px solid rgb(211, 51, 51)";
    document.getElementById("statsButton").style.borderBottom = "4px solid black";
  } catch {
    console.error("Fehler beim Laden der PokeAPI");
  }
}

async function showStats(data) {
  let urlFinder = pokeSearchArray.filter(el => el.id === Number(data.dataset.id));
  try {
  let response = await fetch(urlFinder[0].url);
  let responseJson = await response.json();    
  showStatsHtml(responseJson);
  document.getElementById("statsButton").style.borderBottom = "4px solid rgb(211, 51, 51)";
  document.getElementById("mainButton").style.borderBottom = "4px solid black";
  } catch {
    console.error("Fehler beim Laden der PokeAPI");
  }
}

function showNextGroupOfPokemon() {
  document.getElementById("morePkmnButton").disabled = true;
  document.getElementById("morePkmnButton").innerText = "Loading...";
  if (document.getElementById("pkmnInfo")) {
    document.getElementById("pkmnInfo").remove();
  }  
  pokeContainerCounter += 20;
  let nextUrl = `https://pokeapi.co/api/v2/pokemon/?offset=${pokeCounter}&limit=20`;
  fetchPokeDataJson(nextUrl);
}

async function fetchSinglePokeInfos(element, name, id, img, type1, url, type2) {
  try {
    let response = await fetch(url);
    let responseJson = await response.json();
    showPokeCard(element, name, id, img, type1, type2);
    showMainInfosTemplate(responseJson.height, responseJson.weight, responseJson.base_experience);
    for (let i = 0; i < responseJson.abilities.length; i++) {
      document.getElementById("abilitySpan").innerHTML += `<p>${responseJson.abilities[i].ability.name}</p>`;    
    };
    toggleHide();  
    document.body.style.overflow = "hidden";
  } catch {
    console.error("Fehler beim Laden der PokeAPI");
  }
};

function toggleHide() {
  document.getElementById("overlay").classList.toggle("hidden");
  document.getElementById("pokePopUp").classList.toggle("hidden");
  document.body.style.overflow = "";
}

async function saveDataToFilter() {
  try {
    let allPokeApi = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1302";
    let response = await fetch(allPokeApi);
    let responseJson = await response.json();
    saveDataToFilterLoop(responseJson);
  } catch {
    console.error("Fehler beim Laden der PokeAPI");
  }  
}

async function saveDataToFilterLoop(responseJson) {
  let pokeSearchArrayFunction = [];
  for (let i = 0; i < responseJson.results.length; i++) {
    let searchCounter = i + 1;
    let pokeName = responseJson.results[i].name;
    pokeSearchArrayFunction.push({name: pokeName, id: searchCounter, url: responseJson.results[i].url});
  }
  pokeSearchArray = await Promise.all(pokeSearchArrayFunction);
}

async function filterPokemon() {
  let input = document.getElementById('searchInput').value.toLowerCase();  
  if (input.length === 0) {
    globalReset();
    fetchPokeDataJson('https://pokeapi.co/api/v2/pokemon/');
  } else if (input.length < 3) {
    return;
  } else {
    filterPokemonElse(input);
  }
}

async function filterPokemonElse(input) {
  globalReset();
  let matchingPokemon = pokeSearchArray.filter(pokemon => pokemon.name.includes(input));
  document.getElementById('pokemonContainer').innerHTML = '';
  pokeCounterIndex = 0;
  for (let i = 0; i < Math.min(matchingPokemon.length, 10); i++) {
    let poke = matchingPokemon[i];    
    let card = await fetchSinglePokeCard(poke.url, poke.id, poke.name);
    document.getElementById('pokemonContainer').innerHTML += card;
    showPokeTypesFilter(poke.url);
  }
  if (!matchingPokemon[0]) {
    document.getElementById('pokemonContainer').innerHTML = '<p id="pkmnInfo">This Pokemon doesnt exist!</p>';
  }
}

function globalReset() {
  document.getElementById('pokemonContainer').innerHTML = '';
  pokeCounter = 0;
  pokeCounterIndex = 0;
  pokeContainerCounter = 0;
  pokeDataCounter = 0;
}

async function fetchSinglePokeCard(url, id, name) {
    try {
    let response = await fetch(url);
    let data = await response.json();
    let img = data.sprites.front_default;
    let popUpType1 = data.types[0].type.name;
    let popUpType2;
    if(data.types[1]) {
      popUpType2 = data.types[1].type.name; 
    }
    return getPokemonTemplate(name, id, img, popUpType1, url, popUpType2);
  } catch {
    console.error("Fehler beim Laden der PokeAPI:");
  }
}

async function showPokeTypesFilter(url) {
  let response = await fetch(url);
  let data = await response.json();
  showPokeTypes(data.types);
}

async function fetchSinglePokeInfosPrevious(element) {
  if(element.dataset.id === "0") {
    document.getElementById("firstPkmn").style.color = "red";
    return document.getElementById("firstPkmn").innerText = "This is the first Pokemon";
  }  
  let urlFinder = pokeSearchArray.filter(el => el.id === Number(element.dataset.id));  
  try {
    fetchSinglePokeInfosPreviousTry(element, urlFinder);
  } catch {
    console.error("Fehler beim Laden der PokeAPI:", error);
  }
}

async function fetchSinglePokeInfosPreviousTry(element, urlFinder) {  
  let response = await fetch(urlFinder[0].url);
  let responseJson = await response.json();
  document.getElementById("previousButton").dataset.name = responseJson.forms[0].name;
  document.getElementById("previousButton").dataset.img = responseJson.sprites.front_default;
  document.getElementById("previousButton").dataset.type1 = responseJson.types[0].type.name;
  if(responseJson.types[1]) {
    document.getElementById("previousButton").dataset.type2 = responseJson.types[1].type.name;
  }
  showPreviousInfos(responseJson, element);
}

async function fetchSinglePokeInfosNext(element) {
  let urlFinder = pokeSearchArray.filter(el => el.id === Number(element.dataset.id))
  try {
    fetchSinglePokeInfosNextTry(element, urlFinder);
  } catch {
    console.error("Fehler beim Laden der PokeAPI:", error);
  }
}

async function fetchSinglePokeInfosNextTry(element, urlFinder) {     
  let response = await fetch(urlFinder[0].url);
  let responseJson = await response.json();
  document.getElementById("nextButton").dataset.name = responseJson.forms[0].name;
  document.getElementById("nextButton").dataset.img = responseJson.sprites.front_default;
  document.getElementById("nextButton").dataset.type1 = responseJson.types[0].type.name;
  if(responseJson.types[1]) {
    document.getElementById("nextButton").dataset.type2 = responseJson.types[1].type.name;
  }
  showPreviousInfos(responseJson, element);
}

function showPreviousInfos(responseJson, element) {
  let pokeHeight = responseJson.height;
  let pokeWeight = responseJson.weight;
  let pokeBaseExp = responseJson.base_experience;
  let abilityArray = responseJson.abilities;
  showPokeCard(element, element.dataset.name, element.dataset.id, element.dataset.img, element.dataset.type1);
  showMainInfosTemplate(pokeHeight, pokeWeight, pokeBaseExp);
  for (let i = 0; i < abilityArray.length; i++) {
    document.getElementById("abilitySpan").innerHTML += `<p>${abilityArray[i].ability.name}</p>`;    
  };
}

function showType2(element) {
    if(element.dataset.type2) {
        document.getElementById("type2").innerText = element.dataset.type2;
        document.getElementById("type2").className = element.dataset.type2;
    }
}