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
  let response = await fetch(url);
  let responseJson = await response.json();
  pokeData = responseJson;
  showPokemon(pokeData);
}

async function showPokemon(data) { 
  let pokeInfos = [];
  for (let i = 0; i < data.results.length; i++) {
    pokeCounter++;
    let singlePokeDataUrl = 'https://pokeapi.co/api/v2/pokemon/' + pokeCounter;
    let pokeName = data.results[i].name.toUpperCase();
    pokeInfos.push(fetchSinglePokeDataJson(singlePokeDataUrl, pokeName));
  }
  let allPokeInfos = await Promise.all(pokeInfos);
  allPokeInfos.forEach(data => {
    document.getElementById("pokemonContainer").innerHTML += getPokemonTemplate(data.name, data.id, data.img, data.type1);
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

async function fetchSinglePokeDataJson(url, data) {
  let response = await fetch(url);
  let responseJson = await response.json();
  return {
    name: data,
    id: responseJson.id,
    img: responseJson.sprites.front_default,
    types: responseJson.types,
    type1: responseJson.types[0].type.name
  }
}

function showPokeTypes(pokeTypesData) {
  for (let i = 0; i < pokeTypesData.length; i++) {
    document.querySelectorAll(".pokeTypes")[pokeCounterIndex].innerHTML += `<div class="${pokeTypesData[i].type.name}">${pokeTypesData[i].type.name}</div>`;
  }
  pokeCounterIndex++;
}

function showNextGroupOfPokemon() {
  pokeContainerCounter += 20;
  let nextUrl = `https://pokeapi.co/api/v2/pokemon/?offset=${pokeCounter}&limit=20`;
  fetchPokeDataJson(nextUrl);
}

async function fetchSinglePokeInfos(element, name, id, img, type1, type2) {
  let singlePokeApi = "https://pokeapi.co/api/v2/pokemon/" + element.dataset.id;
  let response = await fetch(singlePokeApi);
  let responseJson = await response.json();
  let pokeHeight = responseJson.height;
  let pokeWeight = responseJson.weight;
  let pokeBaseExp = responseJson.base_experience;
  let abilityArray = responseJson.abilities;
  showPokeCard(element, name, id, img, type1, type2);
  showMainInfosTemplate(pokeHeight, pokeWeight, pokeBaseExp);
  for (let i = 0; i < abilityArray.length; i++) {
    document.getElementById("abilitySpan").innerHTML += `<p>${abilityArray[i].ability.name}</p>`;    
  };
  removeHide();
};

function removeHide() {
  document.getElementById("overlay").classList.remove("hidden");
  document.getElementById("pokePopUp").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function addHide() {
  document.getElementById("overlay").classList.add("hidden");
  document.getElementById("pokePopUp").classList.add("hidden");
  document.body.style.overflow = "";
}

async function saveDataToFilter() {
  let allPokeApi = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1302";
  let response = await fetch(allPokeApi);
  let responseJson = await response.json();
  let pokeSearchArrayFunction = [];
  for (let i = 0; i < responseJson.results.length; i++) {
    let searchCounter = i + 1;
    let pokeName = responseJson.results[i].name;
    pokeSearchArrayFunction.push({name: pokeName, id: searchCounter});
  }
  pokeSearchArray = await Promise.all(pokeSearchArrayFunction);
}

async function filterPokemon() {
  let input = document.getElementById('searchInput').value.toLowerCase();  
  if (input.length < 3) {
    globalReset();
    return;
  }
  let matchingPokemon = pokeSearchArray.filter(pokemon => pokemon.name.includes(input));
  document.getElementById('pokemonContainer').innerHTML = '';
  pokeCounterIndex = 0;
  for (let i = 0; i < Math.min(matchingPokemon.length, 10); i++) {
    let poke = matchingPokemon[i];    
    let card = await fetchSinglePokeCard(poke.id, poke.name);
    document.getElementById('pokemonContainer').innerHTML += card;
    showPokeTypesFilter(poke.id);
  }
}

function globalReset() {
  document.getElementById('pokemonContainer').innerHTML = '';
  pokeCounter = 0;
  pokeCounterIndex = 0;
  pokeContainerCounter = 0;
  pokeDataCounter = 0;
  fetchPokeDataJson('https://pokeapi.co/api/v2/pokemon/');
}

async function fetchSinglePokeCard(id, name) {
  let url = "https://pokeapi.co/api/v2/pokemon/" + id;
  let response = await fetch(url);
  let data = await response.json();
  let img = data.sprites.front_default;
  let popUpType1 = data.types[0].type.name;
  let popUpType2;
  if(data.types[1]) {
    popUpType2 = data.types[1].type.name; 
  }
  return getPokemonTemplate(name, id, img, popUpType1, popUpType2);
}

async function showPokeTypesFilter(id) {
  let url = "https://pokeapi.co/api/v2/pokemon/" + id;
  let response = await fetch(url);
  let data = await response.json();
  showPokeTypes(data.types);
}

async function fetchSinglePokeInfosPrevious(element) {
  if(element.dataset.id === "0") {
    document.getElementById("firstPkmn").style.color = "red";
    return document.getElementById("firstPkmn").innerText = "This is the first Pokemon";
  }  
  let singlePokeApi = "https://pokeapi.co/api/v2/pokemon/" + element.dataset.id;    
  let response = await fetch(singlePokeApi);
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
  let singlePokeApi = "https://pokeapi.co/api/v2/pokemon/" + element.dataset.id;    
  let response = await fetch(singlePokeApi);
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