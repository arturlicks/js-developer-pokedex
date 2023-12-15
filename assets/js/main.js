const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');

const maxRecords = 151;
const limit = 10;
let offset = 0;
let olList = [];
let currentPokemons = [];

function convertPokemonToLi(pokemon) {
  return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types
                      .map((type) => `<li class="type ${type}">${type}</li>`)
                      .join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    currentPokemons.push(...pokemons);
    const newHtml = pokemons.map(convertPokemonToLi).join('');
    pokemonList.innerHTML += newHtml;
    olList = [...document.querySelector('#pokemonList').children];
    olList.map((item) =>
      item.addEventListener('click', () =>
        showDetail(item.querySelector('span.number').innerText.slice(1))
      )
    );
  });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener('click', () => {
  offset += limit;
  const qtdRecordsWithNexPage = offset + limit;

  if (qtdRecordsWithNexPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit);

    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItens(offset, limit);
  }
});

function showDetail(id) {
  const [pokeDetail] = currentPokemons.filter(
    (pokemon) => pokemon.number == id
  );
  loadMoreButton.style.display = 'none';

  fetch(pokeDetail.urlDetail)
    .then((response) => response.json())
    .then((detail) => {
      let entryWithEffectEn = detail.effect_entries.find(
        (entry) => entry.language.name === 'en'
      );
      const newhtml = displayPokemonDetails(
        pokeDetail,
        detail,
        entryWithEffectEn
      );
      pokemonList.innerHTML = newhtml;
    })
    .catch((error) => console.log(error));
}

function closeDetails() {
  pokemonList.innerHTML = [];
  loadPokemonItens(0, limit);
  loadMoreButton.style.display = 'block';
}

function displayPokemonDetails(pokemon, detail, entryWithEffectEn) {
  return `
        <div class="pokemon ${pokemon.type}">
                    <h1 class="name"> ${pokemon.name} </h1>
                    <span class="number"> <span>#${
                      pokemon.number
                    } </span> </span>
                    <div class="detail">
                      <ol class="types">
                          ${pokemon.types
                            .map(
                              (type) => `<li class="type ${type}">${type}</li>`
                            )
                            .join('')}
                      </ol>
                    </div>
    
                <div class="img-pokemon">
                    <img src="${pokemon.photo}" alt="${pokemon.name}">
                </div>

            <div class="details-section">
                <div class="details-section-content">
                    <h4> Effects </h4>
                    <p class="text texteffects">${entryWithEffectEn.effect} </p>
                    <hr>

                    <h4> Generation </h4>
                    <p class="text">${detail.generation.name} </p>
                    <hr>

                    <h4> Experience </h4>
                    <p class="text">XP-${pokemon.experience} </p>
                    <hr>

                    <h4> Abilities </h4>
                    <ol>
                        ${pokemon.abilities
                          .map((ability) => `<li class="text">${ability}</li>`)
                          .join('')}
                    </ol>
                </div>
            </div>
          <div class="pagination">
              <button id="closeDetailsButton" type="button" class="pagination" aria-label="Close" onClick="closeDetails()">Close</button>
          </div>
        </div>
    `;
}
