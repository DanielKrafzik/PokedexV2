let pokeData;

fetch('https://pokeapi.co/api/v2/pokemon/')
  .then((res) => res.json())
  .then((data) => {
    pokeData = data;
    console.log(pokeData)
  })
  .catch((err) => {
    console.log(err)
  });

function loadPokemon() {
    setTimeout(document.getElementById("pokemon").innerHTML = pokeData.result[0].name, 2000)
    console.log(pokeData)
}