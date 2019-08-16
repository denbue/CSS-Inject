var img = document.createElement("img");
 img.id = "animate";
 
function getCat() { 
 var random = (new Date()).getTime();
 img.src = "https://cataas.com/cat/says/"+random+"?size=0&color=red";
 document.body.appendChild(img);
}

var interval = setInterval(function() {
	getCat()
}, 5000);
getCat();


