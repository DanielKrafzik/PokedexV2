function getPokemonTemplate(name, id, img, type) {
    return `
            <div data-id="${id}" data-name="${name}" data-img="${img}" data-type1="${type}" class="pokeCard" onclick="fetchSinglePokeInfos(this, '${type}')">
                <div class="pokeCardTitle">
                    <p>#${id}</p>
                    <p>${name}</p>
                </div>
                <img class="${type}" src="${img}">
                <div class="pokeTypes">
                </div>
            </div>
        `
}

function showPokeCard(element, type) {
    document.getElementById("pokePopUp").innerHTML = `
                                                      <div id="pokePopUpContainer">
                                                        <div id="popUpTitle">
                                                            <p>#${element.dataset.id}</p>
                                                            <p>${element.dataset.name}</p>
                                                        </div>
                                                        <img class="${type}" src="${element.dataset.img}">
                                                        <div id="popUpTypes">
                                                            <p class="${element.dataset.type1}">${element.dataset.type1}</p>
                                                            <p id="type2"></p>
                                                        </div>
                                                        <div id="subNavigation">
                                                            <p id="mainButton" data-id="${element.dataset.id}" onclick="showMainInfos(this)">Main</p>
                                                            <p id="statsButton" data-id="${element.dataset.id}" onclick="showStats(this)">Stats</p>
                                                        </div>
                                                        <div id="cardInfoSelection">                                                            
                                                        </div>
                                                      </div>                                                      
                                                    `;
                                                    document.getElementById("pokePopUp").style.top = `${window.scrollY + 150}px`;
    showType2(element);
}

function showType2(element) {
    if(element.dataset.type2) {
        document.getElementById("type2").innerText = element.dataset.type2;
        document.getElementById("type2").className = element.dataset.type2;
    }
}

async function showStats(data) {
  let singlePokeApi = "https://pokeapi.co/api/v2/pokemon/" + data.dataset.id;
  let response = await fetch(singlePokeApi);
  let responseJson = await response.json();    
  document.getElementById("cardInfoSelection").innerHTML = `
    <div>
        <span>Hp</span>
        <span>: ${responseJson.stats[0].base_stat}</span>
    </div>
    <div>
        <span>Attack</span>
        <span>: ${responseJson.stats[1].base_stat}</span>
    </div>
    <div>
        <span>Defense</span>
        <span>: ${responseJson.stats[2].base_stat}</span>
    </div>
    <div>
        <span>Special-Attack</span>
        <span>: ${responseJson.stats[3].base_stat}</span>
    </div>
    <div>
        <span>Special-Defense</span>
        <span>: ${responseJson.stats[4].base_stat}</span>
    </div>
    <div>
        <span>Speed</span>
        <span>: ${responseJson.stats[5].base_stat}</span>
    </div>
`;
document.getElementById("statsButton").style.borderBottom = "4px solid rgb(211, 51, 51)";
document.getElementById("mainButton").style.borderBottom = "4px solid black";
}

async function showMainInfos(data) {
    let singlePokeApi = "https://pokeapi.co/api/v2/pokemon/" + data.dataset.id;
    let response = await fetch(singlePokeApi);
    let responseJson = await response.json(); 
    let pokeHeight = responseJson.height;
    let pokeWeight = responseJson.weight;
    let pokeBaseExp = responseJson.base_experience;
    let abilityArray = responseJson.abilities;
    showMainInfosTemplate(pokeHeight, pokeWeight, pokeBaseExp);
    for (let i = 0; i < abilityArray.length; i++) {
        document.getElementById("abilitySpan").innerHTML += `<p>${abilityArray[i].ability.name}</p>`;    
    };
    document.getElementById("mainButton").style.borderBottom = "4px solid rgb(211, 51, 51)";
    document.getElementById("statsButton").style.borderBottom = "4px solid black";
}

function showMainInfosTemplate(height, weight, exp) {
    document.getElementById("cardInfoSelection").innerHTML = `
        <div>
            <span>Height</span>
            <span>: ${height}</span>
        </div>
        <div>
            <span>Weight</span>
            <span>: ${weight}</span>
        </div>
        <div>
            <span>Base experience</span>
            <span>: ${exp}</span>
        </div>
        <div>
            <span>Abilitites</span>
            <span id="abilitySpan"></span>
        </div>
    `
}