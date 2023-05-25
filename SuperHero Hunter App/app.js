/* The code is fetching the data from the API and then it is rendering the data into the superHeroContainer. */
(function () {
    const fetchBtn = document.getElementById("get-image");
    const textBar = document.getElementById("name-input");
    const superHeroContainer = document.getElementById("main-2");
    const hamButton = document.getElementById("ham-btn");
    const hamBar = document.getElementById("ham-bar");
    const mainHeding = document.getElementById("heading-main");
    const toastDiv = document.getElementById("toast-div");

    /**
     * It takes a message and a state, and displays the message in a toast div. If the state is true, the
     * toast div will be green, if the state is false, the toast div will be red.
     */
    let toast = function (msg, state) {
        toastDiv.innerHTML = msg;
        if (state == true) {
            toastDiv.style.backgroundColor = "green";
            toastDiv.style.opacity = 1;
            setTimeout(() => {
                toastDiv.style.opacity = 0;
            }, 1000);
        } else {
            toastDiv.style.backgroundColor = "red";
            toastDiv.style.opacity = 1;
            setTimeout(() => {
                toastDiv.style.opacity = 0;
            }, 1000);
        }
    };

    /* Declaring a variable called `localArrayIds` and assigning it an empty array. */
    let localArrayIds = [];

    /* Getting the value of the key "listFavHero" from the localStorage. */
    let stringOfHeroId = localStorage.getItem("listFavHero");
    /* Checking if the stringOfHeroId is not null or undefined, if it is not, then it is parsing the stringOfHeroId and assigning it to the localArrayIds. */
    if (stringOfHeroId !== null || stringOfHeroId != undefined) {
        localArrayIds = JSON.parse(stringOfHeroId);
    }

    console.log(localArrayIds);

    /* A function that is being called when the hamburger button is clicked. It checks if the maxHeight of the hamburger bar is 0px or empty, 
    if it is, then it sets the maxHeight to 40vh, else it sets the maxHeight to 0px. */
    hamButton.onclick = function () {
        if (hamBar.style.maxHeight == "0px" || hamBar.style.maxHeight == "") {
            hamBar.style.maxHeight = "40vh";
        } else {
            hamBar.style.maxHeight = "0px";
        }
    };

    var getSuperHeroCard = function (sourceImg, name, id) {
        var cardL = document.createElement("div");
        cardL.setAttribute("class", "card-layout");

        // HERO ID
        var idDiv = document.createElement("div");
        idDiv.setAttribute("class", "hero-id");
        idDiv.innerHTML = id;

        // HERO IMAGE CONTAINER
        var imageContainer = document.createElement("div");
        imageContainer.setAttribute("class", "hero-img-container");

        // HERO IMG
        var imgV = document.createElement("img");
        imgV.setAttribute("class", "hero-img");
        imgV.setAttribute("src", sourceImg);
        imgV.setAttribute(
            "onerror",
            "this.onerror= null; this.src='image/image_not_available.png';"
        );

        // CARD BODY
        var cardBody = document.createElement("div");
        cardBody.setAttribute("class", "card-body");

        // HERO NAME
        var heroName = document.createElement("div");
        heroName.setAttribute("class", "hero-name");
        heroName.innerHTML = name;

        // LIKE BTN
        var starredIcon = document.createElement("div");
        starredIcon.setAttribute("class", "starred");

        /* Checking if the id of the hero is present in the localArrayIds, if it is, then it is setting the innerHTML of the starredIcon to the filled heart icon, 
        else it is setting the innerHTML of the starredIcon to the empty heart icon. */
        if (localArrayIds.indexOf(id) !== -1) {
            starredIcon.innerHTML =
                '<i id="star-click" class="fas fa-heart"></i>';
            localStorage.setItem("listFavHero", JSON.stringify(localArrayIds));
        } else {
            starredIcon.innerHTML =
                '<i id="star-click" class="far fa-heart"></i>';
            localStorage.setItem("listFavHero", JSON.stringify(localArrayIds));
        }

        /* Checking if the id of the hero is present in the localArrayIds, if it is, then it is setting the innerHTML of the starredIcon to the filled heart icon, 
        else it is setting the innerHTML of the starredIcon to the empty heart icon. */
        starredIcon.onclick = function () {
            var index = localArrayIds.indexOf(id);
            if (index !== -1) {
                console.log(id);
                localArrayIds.splice(index, 1);
                starredIcon.innerHTML =
                    '<i id="star-click" class="far fa-heart"></i>';
                console.log(localArrayIds);
                localStorage.setItem(
                    "listFavHero",
                    JSON.stringify(localArrayIds)
                );
                toast(heroName.innerHTML + " Removed from Favourites", 0);
            } else {
                localArrayIds.push(id);
                starredIcon.innerHTML =
                    '<i id="star-click" class="fas fa-heart"></i>';
                console.log(localArrayIds);
                localStorage.setItem(
                    "listFavHero",
                    JSON.stringify(localArrayIds)
                );
                toast(heroName.innerHTML + " Added to Favourites", 1);
            }
        };

        cardBody.appendChild(heroName);
        cardBody.appendChild(starredIcon);

        imageContainer.appendChild(imgV);
        cardL.appendChild(idDiv);
        cardL.appendChild(imageContainer);
        cardL.appendChild(cardBody);

        /* Creating a click event on the cardL, and checking if the id of the clicked element is equal to the id of the starredIcon, 
        if it is, then it is returning, else it is opening the superhero.html page in the same tab. */
        cardL.onclick = function (event) {
            if (event.target.id === starredIcon.firstChild.id) {
                return;
            } else {
                window.open("HeroInfo/info.html?hero_id=" + id, "_self");
            }
        };
        return cardL;
    };

    /**
     * It takes in a data object and a name, and if the data object has a results property, and the name is the same as the value of the textBar,
     * it will render the results of the data object into the superHeroContainer.
     * data - the data returned from the API
     * name - the name of the hero
     */
    let renderHeros = async function (data, name) {
        if (data.results == null) {
            superHeroContainer.innerHTML = "";
            return;
        }
        if (textBar.value !== name) {
            return;
        }
        superHeroContainer.innerHTML = "";
        /* Looping through the data.results and appending the getSuperHeroCard function to the superHeroContainer. */
        for (const it of data.results) {
            superHeroContainer.appendChild(
                getSuperHeroCard(it.image.url, it.name, it.id)
            );
        }
    };

    /* A function that is being called when the textBar is being keyed up. It is setting the display of the
mainHeding to none, and then it is checking if the length of the name is 0, if it is, then it is
setting the innerHTML of the superHeroContainer to empty, and then it is setting the display of the
mainHeding to block, else it is fetching the data from the API and then it is calling the
renderHeros function. */
    textBar.onkeyup = async function () {
        mainHeding.style.display = "none";
        let name = textBar.value;
        if (name.length == 0) {
            superHeroContainer.innerHTML = "";
            mainHeding.style.display = "block";
            return;
        }
        // API KEY = 2901696359962694
        /* Fetching the data from the API. */
        let response = await fetch(
            `https://www.superheroapi.com/api.php/2901696359962694/search/${name}`
        ).catch((e) => {
            console.log("error");
        });
        /* Converting the response to a JSON object. */
        let data = await response.json();
        renderHeros(data, name);
    };

    fetchBtn.onclick = () => {
        textBar.onkeyup();
    };
})();
