

additionalText = {
    currentText : "",

    init : function () {
        this.hideText();
    },

    displayText : function(text) {

        console.log("displayText(" + text + ")");

        currentText = text;
        var additionalText = document.getElementById("additionalText");

        console.log(additionalText.getAttribute("display"));
        additionalText.style.display = "block";
        console.log(additionalText.getAttribute("display"));
        additionalText.innerHTML = "<p>" + text + "</p>";

    },
    hideText : function() {
        document.getElementById("additionalText").style.display = "none";
    }

}

additionalText.init();
