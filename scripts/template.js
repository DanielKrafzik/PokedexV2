function getPokemonTemplate(name, id, img) {
    return `
            <div class="pokeCard" onclick="fetchSinglePokeInfos(this)">
                <div class="pokeCardTitle">
                <p>#${id}</p>
                <p>${name}</p>
                </div>
                <img src="${img}">
                <div class="pokeTypes">
                </div>
            </div>
        `
}

function showPokeCard(element) {
    document.getElementById("pokePopUp").innerHTML = `
                                                      <div>
                                                        <p>${element.dataset.name}</p>
                                                        <p>${element.dataset.id}</p>
                                                        <img src="${element.dataset.img}">
                                                        <div>
                                                            <p>${element.dataset.type1}</p>
                                                            <p id="type2"></p>
                                                        </div>
                                                        <div>
                                                            <p data-id="${element.dataset.id}" onclick="showMainInfos(this)">Main</p>
                                                            <p data-id="${element.dataset.id}" onclick="showStats(this)">Stats</p>
                                                        </div>
                                                        <div id="cardInfoSelection">                                                            
                                                        </div>
                                                      </div>                                                      
                                                    `;
    showType2(element);
}

function showType2(element) {
    if(element.dataset.type2) {
        document.getElementById("type2").innerText = element.dataset.type2;
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
        <span>: ${responseJson.stats[2].base_stat}</span><div>
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
console.log(Object.keys(responseJson));

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
    }
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
            <span id="abilitySpan">:</span>
        </div>
    `
}