var state = -1;
var authenticating = false;
var userKeys = {};
//didn't feel like doing it properly because it doesn't matter
var keySet = [
    ["Apple","Apricot","Avacado","Banana","Plum","Raisin","Blueberry","Currant","Cherry","Coconut","Cranberry","Dragonfruit","Durian","Gooseberry","Grape","Grapefruit","Guava","Kiwi","Lemon","Lime","Lychee","Mango","Melon","Honeydew","Watermelon","Orange","Passionfruit","Peach","Pear","Pineapple"],
    ["Flour","Eggs","Sugar","Milk","Salt","Cream","Butter"],
    ["Sorbet","Cake","Pie","Donut","Cookie","Timbits","Brownie"],
    [0,1,2,3,4,5,6,7,8,9],
    [0,1,2,3,4,5,6,7,8,9],
    ['~','!','@','#','$','%','^','&','*','?']
]
var instructLbl;
var nextBtn;
var retryBtn;
var submitBtn;
var passBox;
var attempts = 0;
var log = "The log is currently not being collected and needs to be implemented";

//on document ready
document.addEventListener('DOMContentLoaded', function(){ 
    instructLbl = document.getElementById("instructLbl")
    nextBtn     = document.getElementById("nextBtn");
    retryBtn    = document.getElementById("retryBtn");
    submitBtn   = document.getElementById("submitBtn");
    passBox     = document.getElementById("password");
}, false);

var sendData = (data) => {
    pass = document.getElementById("password").value;

    var pkg = {};
    pkg.pass = pass;
    pkgString = JSON.stringify(pkg);

    console.log(pkgString);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(xhttp.responseText);
        }
    };
    xhttp.open("POST", "/authenticate", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(pkgString);
}

//makes a random key from the scheme
var genKey = () => {
    var key = "";
    for (var i = 0; i < keySet.length; i++) {
        var rndKeyVal = Math.floor(Math.random() * keySet[i].length);
        key += keySet[i][rndKeyVal];
    }
    return key;
}

//sets new user key
var reRoll = () => {
    userKeys[state] = genKey();
    instructLbl.innerHTML = "Your " + state + " passkey has been set to: " + userKeys[state];
    attempts = 0;
}

var submit = () => {
    if (passBox.value == userKeys[state])
    {
        instructLbl.innerHTML = "Congrats, you got it right!\n" + userKeys[state] + '\n' + attempts + "/3";
        attempts++;
    }
    else
        instructLbl.innerHTML = "That's not quite right :/\n" + userKeys[state] + '\n' + attempts + "/3";
    
    if (attempts >= 3)
        nextBtn.disabled = false;
}

var next = () => {
    attempts = 0;
    nextBtn.disabled = true;
    if (!authenticating) {//Therefor setting
        if (state == -1)
        {
            state = "mail";
            userKeys[state] = genKey();
            instructLbl.innerHTML = "Your passkey for " + state + " is set to: " + userKeys[state];

            passBox.disabled = false;
            retryBtn.disabled = false;
            submitBtn.disabled = false;
            nextBtn.value = "next Stage";
            retryBtn.value = "re-roll";
            submitBtn.value = "submit";
        }
        else if (state == "mail")
        {
            state = "bank";
            userKeys[state] = genKey();
            instructLbl.innerHTML = "Your passkey for " + state + " is set to: " + userKeys[state];
        }
        else if (state == "bank")
        {
            state = "shop";
            userKeys[state] = genKey();
            instructLbl.innerHTML = "Your passkey for " + state + " is set to: " + userKeys[state];
        }
        else if (state == "shop")
        {
            authenticating = true;
            state = "mail";
        }
    }
    else {
        if (state == "mail")
        {
            state = "bank";
        }
        else if (state == "bank")
        {
            state = "shop";
        }
        else if (state == "shop")
        {
            state = "-1";
            sendData(log);
        }
    }

    setStage();
}

//makes the stage colour in nice ways
var setStage = () => {
    var s = "<h2>Stage</h2><ul>";

    if (authenticating){
        s += "<li style=\"color:green\">Setting Passwords<ol><li>Mail</li><li>Bank</li><li>Shop</li></ol></li><li>Authenticating<ol><li";
        if (state == "mail")
            s += " style=\"color:red\">Mail</li><li>Bank</li><li>Shop</li></ol></li>";
        else if (state == "bank")
            s += " style=\"color:green\">Mail</li><li style=\"color:red\">Bank</li><li>Shop</li></ol></li>";
        else if (state == "shop")
            s += " style=\"color:green\">Mail</li><li style=\"color:green\">Bank</li><li style=\"color:red\">Shop</li></ol></li>";
    }
    else {
        s += "<li>Setting Passwords<ol><li"
        if (state == "mail")
            s += " style=\"color:red\">Mail</li><li>Bank</li><li>Shop</li></ol></li>";
        else if (state == "bank")
            s += " style=\"color:green\">Mail</li><li style=\"color:red\">Bank</li><li>Shop</li></ol></li>";
        else if (state == "shop")
            s += " style=\"color:green\">Mail</li><li style=\"color:green\">Bank</li><li style=\"color:red\">Shop</li></ol></li>";
        s += "<li>Authenticating<ol><li>Mail</li><li>Bank</li><li>Shop</li></ol></li>";
    }
    s += "</ul>";

    document.getElementById("progressTracker").innerHTML = s;
}