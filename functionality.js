document.addEventListener("DOMContentLoaded", function () {
    var text = "Victor Nxumalo";  // Text to be typed
    var i = 0;  // Start index for typing
    var speed = 150;  // Speed of typing in milliseconds
    
    // Function to type the text
    function typeWriter() {
        if (i < text.length) {
            document.getElementById("typewriter").innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        }
    }
    
    // Start typing after the page has loaded
    typeWriter();
});
