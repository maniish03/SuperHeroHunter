(function () {
    const superHeroContainer = document.getElementById("main-2");
    const containerEmptyDiv = document.getElementById("nothing-here");
    const toastDiv = document.getElementById("toast-div");

    /* Creating an empty array. */
    let localArrayIds = [];

    /* Getting the value of the key "listFavHero" from the localStorage. */
    let stringOfHeroId = localStorage.getItem("listFavHero");
    /* Checking if the stringOfHeroId is not null or undefined. If it is not, then it will parse the stringOfHeroId into an array. */
    if (stringOfHeroId !== null || stringOfHeroId != undefined) {
        localArrayIds = JSON.parse(stringOfHeroId);
    }

    /* Checking if the localArrayIds is empty. If it is, then it will display the empty div. */
    if (localArrayIds.length == 0) {
        containerEmptyDiv.style.display = "block";
        return;
    }

    let showError = function () {
        if (localArrayIds.length == 0) {
            containerEmptyDiv.style.display = "block";
            return;
        }
    };

    // Notification
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

    console.log(localArrayIds);

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
        }

        /* Removing the hero from the localStorage. */
        starredIcon.onclick = function () {
            var index = localArrayIds.indexOf(id);
            if (index !== -1) {
                console.log(id);
                localArrayIds.splice(index, 1);
                starredIcon.innerHTML =
                    '<i id="star-click" class="far fa-heart"></i>';
                console.log(localArrayIds);
                superHeroContainer.removeChild(cardL);
                localStorage.setItem(
                    "listFavHero",
                    JSON.stringify(localArrayIds)
                );
                toast(heroName.innerHTML + " Removed from Favourites", 0);
                showError();
            }
        };

        cardBody.appendChild(heroName);
        cardBody.appendChild(starredIcon);

        imageContainer.appendChild(imgV);
        cardL.appendChild(idDiv);
        cardL.appendChild(imageContainer);
        cardL.appendChild(cardBody);

        /* Opening the superhero.html page with the hero_id as the parameter. */
        cardL.onclick = function (event) {
            if (event.target.id === starredIcon.firstChild.id) {
                return;
            } else {
                window.open("../HeroInfo/info.html?hero_id=" + id, "_self");
            }
        };
        return cardL;
    };

    /**
     * The function takes in a data object, creates a new div element, and appends it to the superHeroContainer div.
     * data - the data that is returned from the API call
     */
    let renderHeros = async function (data) {
        let it = data;
        superHeroContainer.appendChild(
            getSuperHeroCard(it.image.url, it.name, it.id)
        );
    };

    // function to load favourites by using id in localStorage.
    /**
     * It fetches the data from the API and then renders the data to the page.
     * id - The id of the hero you want to fetch.
     */
    let loadFavourites = async function (id) {
        let response = await fetch(
            `https://www.superheroapi.com/api.php/2901696359962694/${id}`
        ).catch((e) => {
            console.log("error");
        });
        let data = await response.json();
        renderHeros(data);
    };

    /* Iterating over the localArrayIds and calling the loadFavourites function with the iterator as the parameter. */
    for (const iterator of localArrayIds) {
        loadFavourites(iterator);
    }
})();
