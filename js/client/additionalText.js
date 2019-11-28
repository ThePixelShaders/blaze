additionalText = {
    currentText : "",
    lasthandler : null,

    init : function () {
        this.hideText();
    },

    displayText : function(text) {

        //console.log("displayText(" + text + ")");

        currentText = text;
        var additionalText = document.getElementById("additionalText");

        //console.log(additionalText.getAttribute("display"));
        additionalText.style.display = "block";
        //console.log(additionalText.getAttribute("display"));
        additionalText.innerHTML = "<p>" + text + "</p>";

        if ( this.lasthandler ){
            clearTimeout(this.lasthandler);
        }
        
        this.lasthandler = setTimeout(function(obj) {
            obj.hideText();
        }, 3000, this);

    },

    hideText : function() {
        document.getElementById("additionalText").style.display = "none";
    }

}

additionalText.init();
