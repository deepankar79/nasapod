const resultsNav = document.getElementById("resultsNav");
const favoritesNav = document.getElementById("favoritesNav");
const imagesContainer = document.querySelector(".images-container");
const saveConfirmed = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");

//NASA API
let apiKey = "";
apiKey = prompt("Enter your api key(leave blank for demo_key)");
if (apiKey === "" || !apiKey) apiKey = "DEMO_KEY";
const count = 10;
const apiURL = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

function showContent() {
  window.scrollTo({
    top: 0,
    behavior: "instant",
  });
  loader.classList.add("hidden");
  if (page === "results") {
    resultsNav.classList.remove("hidden");
    favoritesNav.classList.add("hidden");
  } else {
    resultsNav.classList.add("hidden");
    favoritesNav.classList.remove("hidden");
  }
}

function createDOMNodes(page) {
  const currentArray =
    page === "results" ? resultsArray : Object.values(favorites);
  currentArray.forEach((result) => {
    //card container
    const card = document.createElement("div");
    card.classList.add("card");
    //Link
    const link = document.createElement("a");
    link.href = result.hdurl;
    link.title = "View Full Image";
    link.target = "_blank";
    //img
    const image = document.createElement("img");
    image.src = result.url;
    image.alt = "NASA Picture of the Day";
    image.loading = "lazy";
    image.classList.add("card-img-top");
    //Card body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    //card title
    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = result.title;
    // save text
    const saveText = document.createElement("p");
    saveText.classList.add("clickable");
    if (page === "results") {
      saveText.textContent = "Add to favorites";
      saveText.setAttribute("onclick", `saveFavorite('${result.url}')`);
    } else {
      saveText.textContent = "Remove favorites";
      saveText.setAttribute("onclick", `removeFavorite('${result.url}')`);
    }
    // card text
    const cardText = document.createElement("p");
    card.textContent = result.explanation;
    // footer
    const footer = document.createElement("small");
    footer.classList.add("text-muted");
    //date
    const date = document.createElement("strong");
    date.textContent = result.date;
    //copyright
    const copyrightResult =
      result.copyright === undefined ? "" : result.copyright;
    const copyright = document.createElement("span");
    copyright.textContent = `${copyrightResult}`;

    //append
    footer.append(date, copyright);
    cardBody.append(cardTitle, saveText, cardText, footer);
    link.appendChild(image);
    card.append(link, cardBody);
    imagesContainer.appendChild(card);
  });
}

//updateDOM

function updateDOM(page) {
  // get favs from local storage
  if (localStorage.getItem("nasaFavorites")) {
    favorites = JSON.parse(localStorage.getItem("nasaFavorites"));
  }
  imagesContainer.textContent = "";
  createDOMNodes(page);
  showContent();
}

// get images from api

async function getNasaPictures() {
  // Show loader
  loader.classList.remove("hidden");
  try {
    const response = await fetch(apiURL);
    resultsArray = await response.json();
    console.log(resultsArray);
    updateDOM("results");
  } catch (error) {
    //catch error
  }
}

//add result
function saveFavorite(itemUrl) {
  resultsArray.forEach((item) => {
    if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
      favorites[itemUrl] = item;

      //show save confirmation
      saveConfirmed.hidden = false;
      setTimeout(() => {
        saveConfirmed.hidden = true;
      }, 2000);
    }
    //set fav in local storage
    localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
  });
}

function removeFavorite(itemUrl) {
  if (favorites[itemUrl]) {
    delete favorites[itemUrl];
    //set fav in local storage
    localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    updateDOM("results");
  }
}
//onload

getNasaPictures();
