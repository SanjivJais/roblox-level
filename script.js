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
const fieldAlert = document.getElementById('fieldAlert');


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
    return (1 - (1 / (((d ** 0.2) / 365) + ((b ** 0.7) / (10 * (d ** 0.4))) + 1)));
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

var level = 0;

calcBtn.addEventListener('click', function () {
    if (showAlert() == 0) {
        const d = calcDays();
        level = 0.25 * (150 * dbScore(d, b.value) + 100 * placeScore(p.value) + 90 * followersScore(fo.value, b.value) + 60 * friendsScore(fr.value));
    } else {
        level = 0;
    }
    levelValue.innerHTML = level.toFixed(3);
    setSnapValues();
})



function formatDate(date) {
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
}

const valueCols = document.getElementsByClassName('valCol');
function setSnapValues() {
    valueCols[0].innerHTML = formatDate(new Date(joinDate.value));
    valueCols[1].innerHTML = addComma(b.value);
    valueCols[2].innerHTML = addComma(p.value);
    valueCols[3].innerHTML = addComma(fo.value);
    valueCols[4].innerHTML = addComma(fr.value);

    document.getElementById('lValueResult').innerHTML = level.toFixed(3);
    const currentDate = new Date();
    document.getElementById('todayDate').innerHTML = `${formatDate(currentDate)}`;
}

function setUsername() {
    const robUsername = document.getElementById('robUsername');
    const snapRobUsername = document.getElementById('snapRobUsername');
    if (robUsername.value != "")
        snapRobUsername.innerHTML = `@${robUsername.value}'s`;
    else
        snapRobUsername.innerHTML = "Your";

}

//Result snapshot download functionalities

const resultSnapshot = document.getElementById('resultSnapshot');
const downloadSnapshot = document.getElementById('downloadSnapshot');
var snapFlag = 0;

downloadSnapshot.addEventListener('click', function () {
    if (snapFlag) {
        fieldAlert.style.display = "none";
        setUsername();
        resultSnapshot.style.display = "";
        const options = {
            scale: 1, // Adjust the scale factor as needed
        };
        // Use html2canvas to capture the content of the resultSnapshot element as an image
        html2canvas(resultSnapshot, options).then(canvas => {
            // Convert the canvas to a data URL in JPEG format
            const image = canvas.toDataURL('image/jpeg');

            // Create an anchor element to trigger the download
            const a = document.createElement('a');
            a.href = image;
            a.download = 'snapshot.jpg';
            a.click();

            resultSnapshot.style.display = "none";

        });
    } else {
        fieldAlert.style.display = "";
        fieldAlert.innerHTML = "Please first calculate your level!";
    }

});

//-------------------

// function to show alerts 
function showAlert() {
    fieldAlert.style.display = "none";
    let message = null;
    if (joinDate.value !== "") {
        if (b.value > 0) {
            if (p.value >= 0) {
                if (fo.value >= 0) {
                    if (fr.value >= 0) {
                        snapFlag = 1;
                        return 0;
                    } else {
                        message = "Invalid Friends Number!";
                        show(message);
                    }
                } else {
                    message = "Invalid Followers Number!";
                    show(message);
                }
            } else {
                message = "Invalid Place Visits!";
                show(message);
            }
        }
        else {
            message = "You must have at least one badge to calculate level!";
            show(message);
        }
    } else {
        message = "Select a valid Join Date!";
        show(message);
    }
    function show(message) {
        if (message !== null) {
            fieldAlert.style.display = "";
            fieldAlert.innerHTML = message;
        }
    }
}


//formatting the result in comma separated form
function addComma(numVal) {

    // remove numSign
    var numSign = 1;
    if (numVal < 0) {
        numSign = -1;
        numVal = -numVal;
    }
    // trim the decimal point
    let num = numVal.toString().includes('.') ?
        numVal.toString().split('.')[0] : numVal.toString();
    let len = num.toString().length;
    let numResult = '';
    let numCount = 1;
    for (let i = len - 1; i >= 0; i--) {
        numResult = num.toString()[i] + numResult;
        if (numCount % 3 === 0 && numCount !== 0 && i !== 0) {
            numResult = ',' + numResult;
        }
        numCount++;
    }
    // include number after decimal point
    if (numVal.toString().includes('.')) {
        numResult = numResult + '.' +
            numVal.toString().split('.')[1];
    }
    return numResult;
}

