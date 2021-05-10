const maxNominations = 5;
let currNominations = 0;
let nominations = [];
const form = document.querySelector("#searchForm");
form.addEventListener("submit", async function(e) {
    e.preventDefault();
    const userInput = form[0].value;
    const searchResult = await axios.get("https://www.omdbapi.com/?s=" + userInput + "&apikey=150162fe");
    renderSearchResults(searchResult.data.Search);
})

function renderSearchResults(movies) {
    const oldResultList = document.getElementById("resultList");
    if (oldResultList != null) {
        console.log("to delete", oldResultList);
        clearResults(oldResultList);
    }
    const resultList = document.createElement('ul');
    const resultsDiv = document.getElementById("resultDiv");
    resultList.setAttribute("id", "resultList");
    resultsDiv.append(resultList);
    for (let i = 0; i < movies.length; i++) {
        let img;
        const listEntry = document.createElement("li");
        img = document.createElement('img');
        if (movies[i].Poster) {
            img.src = movies[i].Poster;
        } else {
            img.src = "movie_placeholder.png";
        }
        const movieString = movies[i].Title + " (" + movies[i].Year + ")";
        const button = document.createElement("button"); 
        if (nominations.includes(movieString)) {
            button.disabled = true;
        }
        button.textContent = "Nominate";
        listEntry.setAttribute("id", movieString);
        listEntry.setAttribute("style", "list-style-type:none");
        listEntry.setAttribute("class", "result");
        resultList.append(listEntry);
        listEntry.append(img);
        listEntry.append(movieString);
        listEntry.append(button);
        button.setAttribute("id", movieString);
        addNominationListener(listEntry);

    }
}

function addNominationListener(listEntry) {
    const button = listEntry.getElementsByTagName("button")[0];
    button.addEventListener("click", function() {
        if (currNominations === maxNominations) {
            alert("The maximum number of nominations has already been reached!");
            return;
        }
        if (!nominations.includes(button.id)) {
            nominations.push(button.id);
            console.log("Success!!", nominations, button.id);
            addNominationToList(listEntry);
            alert(button.id + "has been added to the nomination list!");
            button.disabled = true;
            currNominations++;
            if (currNominations === maxNominations) {
                displayBanner();
            }
        } else {
            alert("That film has already been nominated!");
        }
    })
}

function addNominationToList(nomination) {
    console.log(nomination);
    const nominationList = document.getElementById("nominationList");
    const nominationElement = document.createElement("li");
    const imageSource = nomination.getElementsByTagName("img")[0].src;
    console.log(imageSource);
    const movieTitle = nomination.id;
    const img = document.createElement("img");
    nominationElement.setAttribute("style", "list-style-type:none");
    nominationList.append(nominationElement);
    nominationElement.append(img);
    nominationElement.append(movieTitle);
    img.setAttribute("src", imageSource);
    nomination.getElementsByTagName("button")[0].disabled = true;
    const deleteNominationButton = document.createElement("button");
    deleteNominationButton.textContent = "Remove Nomination";
    deleteNominationButton.setAttribute("id", movieTitle);
    nominationElement.append(deleteNominationButton);
    addRemoveNominationListener(nominationElement);
}

function displayBanner(){
    const banner = document.createElement("h1");
    banner.setAttribute("id", "banner");
    banner.textContent = "Congratulations, you have nominated 5 films for the Best Picture award. And the Oscar goes to...";
    const title = document.getElementById("title");
    console.log(title);
    title.after(banner);
}

function addRemoveNominationListener(nominee) {
    const button = nominee.getElementsByTagName("button")[0];
    button.addEventListener("click", function() {
        const movieTitle = button.id;
        button.parentElement.remove();
        const index = nominations.indexOf(movieTitle);
        nominations.splice(index,1);
        currNominations--;
        const banner = document.getElementById("banner");
        if (banner != null) {
            banner.remove();
        }        
        const resultEntryToEnable = document.getElementById(movieTitle);
        console.log(resultEntryToEnable.getElemen);
        const buttonToEnable = resultEntryToEnable.getElementsByTagName("button")[0];
        buttonToEnable.disabled = false;
        
        
    })
}

function clearResults(resultList) {
    resultList.remove();
}
