var keySet = [
    ["Apple","Apricot","Avacado","Banana","Plum","Raisin","Blueberry","Currant","Cherry","Coconut","Cranberry","Dragonfruit","Durian","Gooseberry","Grape","Grapefruit","Guava","Kiwi","Lemon","Lime","Lychee","Mango","Melon","Honeydew","Watermelon","Orange","Passionfruit","Peach","Pear","Pineapple"],
    ["Flour","Eggs","Sugar","Milk","Salt","Cream","Butter"],
    ["Sorbet","Cake","Pie","Donut","Cookie","Timbits","Brownie"],
    [0,1,2,3,4,5,6,7,8,9],
    [0,1,2,3,4,5,6,7,8,9],
    ['~','!','@','#','$','%','^','&','*','?']
]

//on document ready
document.addEventListener('DOMContentLoaded', function(){ 
    document.getElementById("para1").innerHTML += " <br/> The page has loaded and the JS works"
}, false);

function submit() {//I realize this isn't secure at all and don't care, that is not the point of this exersize
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