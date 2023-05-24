const itemsPerPage = 10; // Cantidad de pokémones por página
let currentPage = 1; // Página actual

const pokemonListElement = document.getElementById("pokemon-list");
const searchInput = document.getElementById("search-input");
const paginationElement = document.getElementById("pagination");

// Función para hacer una solicitud a la API de PokeApi y obtener la lista de pokémones
async function fetchPokemonList() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000");
    const data = await response.json();
    const pokemonList = data.results;

    return pokemonList;
  } catch (error) {
    console.log("Error al obtener la lista de pokémones:", error);
    return [];
  }
}

// Función para obtener los detalles de un pokémon dado su URL en la API
async function fetchPokemonDetails(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    const pokemon = {
      name: data.name,
      type: data.types.map(type => type.type.name).join("/"),
      image: data.sprites.front_default
    };

    return pokemon;
  } catch (error) {
    console.log("Error al obtener los detalles del pokémon:", error);
    return null;
  }
}

// Función para mostrar los pokémones en la página actual
async function displayPokemonList() {
  pokemonListElement.innerHTML = "";

  // Obtener la lista completa de pokémones
  const pokemonList = await fetchPokemonList();

  // Filtrar pokémones por nombre
  const searchTerm = searchInput.value.toLowerCase().trim();
  const filteredPokemonList = pokemonList.filter(pokemon => pokemon.name.toLowerCase().includes(searchTerm));

  // Calcular índices de inicio y fin según la página actual y cantidad de elementos por página
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Obtener los pokémones de la página actual con sus detalles
  const paginatedPokemonList = [];
  for (let i = startIndex; i < endIndex; i++) {
    if (filteredPokemonList[i]) {
      const pokemon = await fetchPokemonDetails(filteredPokemonList[i].url);
      if (pokemon) {
        paginatedPokemonList.push(pokemon);
      }
    }
  }

  paginatedPokemonList.forEach(pokemon => {
    const listItem = document.createElement("li");
    const pokemonImage = document.createElement("img");
    const pokemonName = document.createElement("h2");
    const pokemonType = document.createElement("p");

    pokemonImage.src = pokemon.image;
    pokemonName.textContent = pokemon.name;
    pokemonType.textContent = "Type: " + pokemon.type;

    listItem.appendChild(pokemonImage);
    listItem.appendChild(pokemonName);
    listItem.appendChild(pokemonType);

    pokemonListElement.appendChild(listItem);
  });

  // Actualizar paginador
  updatePaginator(filteredPokemonList.length);
}

// Función para actualizar el paginador
function updatePaginator(totalItems) {
  paginationElement.innerHTML = "";

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const pageLink = document.createElement("a");
    pageLink.href = "#";
    pageLink.textContent = i;

    if (i === currentPage) {
      pageLink.classList.add("active");
    }

    pageLink.addEventListener("click", () => {
      currentPage = i;
      displayPokemonList();
    });

    paginationElement.appendChild(pageLink);
  }
}

// Manejar cambios en el campo de búsqueda
searchInput.addEventListener("input", () => {
  currentPage = 1;
  displayPokemonList();
});

// Mostrar la lista de pokémones inicial
displayPokemonList();

  