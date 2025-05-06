function getPokemonTemplate(name, id, img, type1, url, type2) {
    if(type2 === undefined) {
        type2 = "";
    }
    return `
            <div data-id="${id}" data-name="${name}" data-img="${img}" data-type1="${type1}" data-url="${url}" data-type2="${type2}" class="pokeCard" onclick="fetchSinglePokeInfos(this, '${name}', '${id}', '${img}', '${type1}', '${url}', '${type2}')">
                <div class="pokeCardTitle">
                    <p>#${id}</p>
                    <p>${name}</p>
                </div>
                <img class="${type1}" src="${img}">
                <div class="pokeTypes">
                </div>
            </div>
        `
}

function showPokeCard(element, name, id, img, type1) {
    document.getElementById("pokePopUp").innerHTML = `
                                                      <div id="pokePopUpContainer">
                                                        <div id="popUpTitle">
                                                            <p>#${id}</p>
                                                            <p>${name}</p>
                                                        </div>
                                                        <img class="${type1}" src="${img}">
                                                        <div id="popUpTypes">
                                                            <p class="${type1}">${type1}</p>
                                                            <p id="type2"></p>
                                                        </div>
                                                        <div id="subNavigation">
                                                            <p id="mainButton" data-id="${id}" onclick="showMainInfos(this)">Main</p>
                                                            <p id="statsButton" data-id="${id}" onclick="showStats(this)">Stats</p>
                                                        </div>
                                                        <div id="cardInfoSelection">                                                            
                                                        </div>
                                                        <div id="switchButtons">
                                                            <button id="previousButton" data-id="${element.dataset.id - 1}" onClick="fetchSinglePokeInfosPrevious(this)">Previous</button>
                                                            <button id="nextButton" data-id="${Number(id) + 1}" onClick="fetchSinglePokeInfosNext(this)">Next</button>
                                                        </div>
                                                        <p id="firstPkmn"></p>
                                                      </div>                                                      
                                                    `;
    document.getElementById("pokePopUp").style.top = `${window.scrollY + 150}px`;
    showType2(element);
}

function showStatsHtml (responseJson) {
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