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
var logBtn;
var logP;
var succAttempts = 0;
var totAttempts = 0;

//Log object constructor for user tracking
function Log() {
    var d = new Date();
    this.entry      = d.toString().substring(0, 33) + "\n---------------------------------\n";
    this.send       = function () { sendData({ log:this.entry }); };
    this.logEvent   = function () { 
        var line = "";
        var date = new Date();

        line = date.toString().substring(0, 33) + ": ";
        if (authenticating)
            line += "Authentication - ";
        else
            line += "Passkey trial  - ";
        
        line += state + " - attempt #" + totAttempts + '(' + succAttempts + "/3) - ";

        if (passBox.value == userKeys[state])
            line += "Successful\n"
        else
            line += "Failed\n"

        this.entry += line;

        updateLog(this.entry);
    };
}
var log = new Log();

var updateLog = (text) => {
    s = text;
    while (s.indexOf('\n') != -1)
        s = s.replace('\n', "<br/>");

    logP.innerHTML = s;
}

//on document ready
document.addEventListener('DOMContentLoaded', function(){ 
    instructLbl = document.getElementById("instructLbl")
    nextBtn     = document.getElementById("nextBtn");
    retryBtn    = document.getElementById("retryBtn");
    submitBtn   = document.getElementById("submitBtn");
    logBtn      = document.getElementById("logBtn");
    passBox     = document.getElementById("password");
    logP        = document.getElementById("logP");
}, false);

var sendData = (data) => {
    pkgString = JSON.stringify(data);

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
    succAttempts = 0;
}

var submit = () => {
    log.logEvent();
    var authorized = (passBox.value == userKeys[state]);
    
    totAttempts++;
    if (authenticating)
    {
        if (authorized)
        {
            succAttempts++;
            instructLbl.innerHTML = "Congrats, you remembered it!\n" + succAttempts + "/3";
        }
        else
            instructLbl.innerHTML = "That's not quite right :/\n" + succAttempts + "/3";
        
        if (totAttempts >= 3)
        {
            instructLbl.innerHTML += " - No more attempts."
            nextBtn.disabled = false;
            submitBtn.disabled = true;
        }
    }
    else
    {
        if (authorized)
        {
            succAttempts++;
            instructLbl.innerHTML = "Congrats, you got it right!\n" + userKeys[state] + '\n' + succAttempts + "/3";
        }
        else
            instructLbl.innerHTML = "That's not quite right :/\n" + userKeys[state] + '\n' + succAttempts + "/3";
        
        if (succAttempts >= 3)
            nextBtn.disabled = false;
    }
}

var setInstruct = () => {
    if (state == -1)
        instructLbl.innerHTML = "You've completed the process and the log has been sent.";
    else {
        if (!authenticating)
            instructLbl.innerHTML = "Your passkey for " + state + " is set to: " + userKeys[state];
        else
            instructLbl.innerHTML = "Please attempt to authenticate with the " + state + " passkey.";
    }
}

var next = () => {
    succAttempts = 0;
    totAttempts = 0;
    nextBtn.disabled = true;
    submitBtn.disabled = false;
    if (!authenticating) {//Therefor setting
        if (state == -1)
        {
            state = "mail";
            userKeys[state] = genKey();
            setInstruct();

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
            setInstruct();
        }
        else if (state == "bank")
        {
            state = "shop";
            userKeys[state] = genKey();
            setInstruct();
        }
        else if (state == "shop")
        {
            authenticating = true;
            state = "mail";
            setInstruct();
        }
    }
    else {//authenticating
        if (state == "mail")
        {
            state = "bank";
            setInstruct();
        }
        else if (state == "bank")
        {
            state = "shop";
            setInstruct();
        }
        else if (state == "shop")
        {
            submitBtn.disabled = true;
            state = "-1";
            setInstruct();
            log.send();
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

var showLog = () => {
    if (logP.style.visibility === "visible")
    {
        logBtn.value = "Show Log";
        logP.style.visibility = "hidden";
    }
    else
    {
        logBtn.value = "Hide Log";
        logP.style.visibility = "visible";
    }
}