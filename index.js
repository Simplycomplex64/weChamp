import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://endorsements-simply-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)

const allEndorsements = ref(database, "Endorsments")

const inputEl = document.getElementById("input-el")
const publishBtnEl = document.getElementById("publish-btn-el")
const EndorsementsList = document.getElementById("Endorsements-list")
const fromEl = document.getElementById("from-el")
const toEl = document.getElementById("to-el")
let isLiked = false;

onValue(allEndorsements, function(snapshot) {
    let endoArray = Object.entries(snapshot.val())



    EndorsementsList.innerHTML = ""

    for (let i = 0; i < endoArray.length; i++) {
        let currentEndo = endoArray[i]
        let currentEndoID = currentEndo[0]
        let currentEndoValue = currentEndo[1]

        appendToListEl(currentEndoValue)
    }
})

publishBtnEl.addEventListener("click", function() {
    let message = inputEl.value
    let fromName = fromEl.value
    let toName = toEl.value
    push(allEndorsements, { message, fromName, toName, likesCount: 0 })

    clearInputEl()
})

function clearInputEl() {
    inputEl.value = ""
    fromEl.value = ""
    toEl.value = ""
}

function appendToListEl(endorsement) {
    const listItem = document.createElement("li");

    listItem.innerHTML = `<span class="span1">To : ${endorsement.toName} </span><br><br>${endorsement.message}<br><br><span class="span2">From : ${endorsement.fromName} </span><span class="span3"><img src="images/beforeLike.png" id="span3" alt="like heart button"></span><span><label class="theLabel">${endorsement.likesCount || 0}</label></span>`;
    EndorsementsList.appendChild(listItem);

    const span3 = listItem.querySelector(".span3");
    const label = listItem.querySelector(".theLabel");

    span3.addEventListener("click", function () {
        isLiked = !isLiked;

        // Update the likes count
        endorsement.likesCount = isLiked ? endorsement.likesCount + 1 : Math.max(0, endorsement.likesCount - 1);

        // Set the appropriate image based on the toggle state
        if (isLiked) {
            span3.innerHTML = `<img src="images/afterLike.png" alt="Liked">`;
        } else {
            span3.innerHTML = `<img src="images/beforeLike.png" alt="Like heart button">`;
        }

        // Update the label with the current number of likes
        label.textContent = `${endorsement.likesCount}`;

        // Update the likes count in the database
        updateLikesCount(endorsement.id, endorsement.likesCount);
    });
}

function updateLikesCount(endorsementID, newLikesCount) {
    const endorsementRef = ref(database, `Endorsments/${endorsementID}`);
    set(endorsementRef, { likesCount: newLikesCount });
}

