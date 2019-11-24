

scoreboard = {
    Players : {},

    addScore : function(name, value) {
        
        this.Players[name] = value;
        //console.log(this.Players);
    },

    getScoreBoard : function() {
        items = [];

        for (var key in this.Players) {
            items.push([key, this.Players[key]]);
        }

        items.sort(function(first, second) {
            return second[1] - first[1];
        });

        // console.log(items);
        return items;
    }

}

function renderScoreBoard(){
    var scoreBoardDiv = document.getElementById("scoreboard");

    scoreBoardDiv.innerHTML = "";

    var ul = document.createElement("ul");

    ul.classList.add("ui-element");

    ul.style = "border: none; padding: 10px;";

    scoreboard.getScoreBoard().forEach( item => {
        console.log(item[0]);
        var li = document.createElement("li");
        li.innerHTML = item[0] + " " + item[1];
        ul.appendChild(li);
    });

    
    // for (var item in scoreboard.getScoreBoard()) {
    //     console.log(item[0]);
    //     var li = document.createElement("li");
    //     li.innerHTML = item[0] + " " + item[1];
    //     ul.appendChild(li); 
    // }
    scoreBoardDiv.appendChild(ul);
}
