(function () {
    const url = new URL(window.location.href);
    var heroId = url.searchParams.get("hero_id");

    const heroImg = document.getElementById("main-hero-img");
    const heroName = document.getElementById("hero-name");
    const starredIcon = document.getElementById("starred");
    const toastDiv = document.getElementById("toast-div");

    // Notification
    let toast = function (msg, state) {
        toastDiv.innerHTML = msg;
        if (state == true) {
            toastDiv.style.backgroundColor = "green";
            toastDiv.style.opacity = 1;
            setTimeout(() => {
                toastDiv.style.opacity = 0;
            }, 800);
        } else {
            toastDiv.style.backgroundColor = "red";
            toastDiv.style.opacity = 1;
            setTimeout(() => {
                toastDiv.style.opacity = 0;
            }, 800);
        }
    };

    /* Getting the value of the key "listFavHero" from the localStorage. */
    let stringOfHeroId = localStorage.getItem("listFavHero");
    /* Checking if the stringOfHeroId is not null or undefined, if it is not, then it is parsing the stringOfHeroId and assigning it to the localArrayIds. */
    if (stringOfHeroId !== null || stringOfHeroId != undefined) {
        localArrayIds = JSON.parse(stringOfHeroId);
    }

    console.log(localArrayIds);

    // function to render bio of superhero
    const renderHeroBio = function (bio) {
        for (const it in bio) {
            document.getElementById(it).innerHTML = bio[it];
        }
    };

    // function to render appearance of superhero
    const renderHeroAppearence = function (appearance) {
        for (const it in appearance) {
            document.getElementById(it).innerHTML = appearance[it];
        }
    };

    // function to render powerstats of superhero
    const renderPowerStats = function (powerstats) {
        for (const it in powerstats) {
            let skill = document.getElementById(it);
            skill.style.width = `${powerstats[it]}%`;
        }
    };

    // function to render work of superhero
    const renderHeroWork = function (work) {
        for (const it in work) {
            document.getElementById(it).innerHTML = work[it];
        }
    };

    // function to render connections of superhero
    const renderHeroConnections = function (connections) {
        for (const it in connections) {
            document.getElementById(it).innerHTML = connections[it];
        }
    };

    const renderHero = function (data) {
        heroImg.setAttribute("src", data.image.url);
        heroName.innerHTML = data.name;
        renderHeroBio(data.biography);
        renderPowerStats(data.powerstats);
        renderHeroAppearence(data.appearance);
        renderHeroWork(data.work);
        renderHeroConnections(data.connections);

        /* This is checking if the heroId is present in the localArrayIds. If it is present, then it is showing
        the filled heart icon, else it is showing the hollow heart icon. */
        if (localArrayIds.indexOf(heroId) !== -1) {
            starredIcon.innerHTML =
                '<i id="star-click" class="fas fa-heart"></i>';
        } else {
            starredIcon.innerHTML =
                '<i id="star-click" class="far fa-heart"></i>';
        }

        /* This is the code that is responsible for adding and removing the heroId from the localStorage. */
        starredIcon.onclick = function () {
            var index = localArrayIds.indexOf(heroId);
            if (index !== -1) {
                console.log(heroId);
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
                localArrayIds.push(heroId);
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
    };

    // function to load hero with id fetched from urlParams.
    const loadHeroFromId = async function (heroId) {
        let response = await fetch(
            `https://www.superheroapi.com/api.php/2901696359962694/${heroId}`
        ).catch((e) => {
            console.log("error");
        });
        let data = await response.json();
        renderHero(data);
    };

    loadHeroFromId(heroId);
})();
