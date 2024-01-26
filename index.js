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
    push(allEndorsements, { message, fromName, toName })

    clearInputEl()
})

function clearInputEl() {
    inputEl.value = ""
    fromEl.value = ""
    toEl.value = ""
}

function appendToListEl(endorsement) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `<span class="span1">To : ${endorsement.toName} </span><br><br>${endorsement.message}<br><br><span class="span2">From : ${endorsement.fromName} </span></span>`;
    EndorsementsList.appendChild(listItem);
}