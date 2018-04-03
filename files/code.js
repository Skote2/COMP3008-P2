//on document ready
document.addEventListener('DOMContentLoaded', function(){ 
    document.getElementById("para1").innerHTML += " <br/> The page has loaded and the JS works"
}, false);

function submit() {//I realize this isn't secure at all and don't care, that is not the point of this exersize
    pass = document.getElementById("password").value;
    console.log(pass);
}