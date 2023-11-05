// Trigerred tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
//-------------------

const joinDate = document.getElementById('joinDate');
const p = document.getElementById('placeVisits');
const b = document.getElementById('badges');
const fo = document.getElementById('followers');
const fr = document.getElementById('friends');
const ir = document.getElementById('incomingRobux');
const or = document.getElementById('outgoingRobux');
const calcBtn = document.getElementById('calcBtn');
const levelValue = document.getElementById('levelValue');

// Function to specify max date
function updateMaxDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Month is 0-based
    const dd = String(today.getDate()).padStart(2, '0');
    const maxDate = `${yyyy}-${mm}-${dd}`;

    joinDate.setAttribute('max', maxDate);
    joinDate.removeAttribute('disabled')
}
window.addEventListener('load', updateMaxDate);


const calcDays = () => {
    // Calculating the account age in days
    const selectedDate = new Date(joinDate.value);

    // Getting the current date
    const currentDate = new Date();

    // Calculating time difference in miliseconds 
    const timeDiff = currentDate - selectedDate;

    // Converting miliseconds into days
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    return days;
}

const dbScore = (d, b) => {
    return (1 - (1 / (((d ** 0.2) / 365) + ((b ** 0.7) / (10*(d**0.4))) + 1)));
}
const placeScore = (p) => {
    return (1 - (1 / (((p ** 0.5) / 150) + 1)));
}
const followersScore = (fo, b) => {
    return (1 - (1 / (((fo ** 1) / (50 * (b ** 0.6))) + 1)));
}
const friendsScore = (fr) => {
    return (1 - (1 / (((fr ** 0.7) / 10) + 1)));
}

calcBtn.addEventListener('click', function () {
    const d = calcDays();
    let level = 0;
    if (d === 0) {
        level = 0;
    }
    else {
        level = 0.25 * (150 * dbScore(d, b.value) + 100 * placeScore(p.value) + 90 * followersScore(fo.value, b.value) + 60 * friendsScore(fr.value));
    }
    levelValue.innerHTML = level.toFixed(3);
    console.log(d);
})



