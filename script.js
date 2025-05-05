window.addEventListener('load', () => {
  fetchPokeDataJson('https://pokeapi.co/api/v2/pokemon/');
});

let pokeData;
let pokeCounter = 0;
let pokeContainerCounter = 0;
let pokeCounterIndex = 0;

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
    let pokeName = data.results[i].name;
    pokeInfos.push(fetchSinglePokeDataJson(singlePokeDataUrl, pokeName));
  }
  let allPokeInfos = await Promise.all(pokeInfos);
  allPokeInfos.forEach(data => {
    document.getElementById("pokemonContainer").innerHTML += getPokemonTemplate(data.name, data.id, data.img);
    showPokeTypes(data.types);
  });  
  setPokeData(allPokeInfos);
}

function setPokeData(pokeInfoArray) {
  for (let i = 0; i < pokeInfoArray.length; i++) {
        document.querySelectorAll(".pokeCard")[i].dataset.name = pokeInfoArray[i].name;
        document.querySelectorAll(".pokeCard")[i].dataset.id = pokeInfoArray[i].id;
        document.querySelectorAll(".pokeCard")[i].dataset.img = pokeInfoArray[i].img;
        document.querySelectorAll(".pokeCard")[i].dataset.type1 = pokeInfoArray[i].types[0].type.name;
        if(pokeInfoArray[i].types[1]) {
          document.querySelectorAll(".pokeCard")[i].dataset.type2 = pokeInfoArray[i].types[1].type.name;
        }
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
  }
}

function showPokeTypes(pokeTypesData) {
  for (let i = 0; i < pokeTypesData.length; i++) {
    document.querySelectorAll(".pokeTypes")[pokeCounterIndex].innerHTML += `<div>${pokeTypesData[i].type.name}</div>`;    
  }
  pokeCounterIndex++;
}

function showNextGroupOfPokemon() {
  pokeContainerCounter += 20;
  let nextUrl = `https://pokeapi.co/api/v2/pokemon/?offset=${pokeCounter}&limit=20`;
  fetchPokeDataJson(nextUrl)
}

async function fetchSinglePokeInfos(element) {
  let singlePokeApi = "https://pokeapi.co/api/v2/pokemon/" + element.dataset.id;
  let response = await fetch(singlePokeApi);
  let responseJson = await response.json();
  let pokeHeight = responseJson.height;
  let pokeWeight = responseJson.weight;
  let pokeBaseExp = responseJson.base_experience;
  let abilityArray = responseJson.abilities;
  showPokeCard(element);
  showMainInfosTemplate(pokeHeight, pokeWeight, pokeBaseExp);
  for (let i = 0; i < abilityArray.length; i++) {
    document.getElementById("abilitySpan").innerHTML += `<p>${abilityArray[i].ability.name}</p>`;    
  }
};
