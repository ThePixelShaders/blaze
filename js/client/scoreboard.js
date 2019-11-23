

scoreboard = {
    Players : {},

    addScore : function(name, value) {
        
        this.Players[name] = value;
        console.log(this.Players);
    },

    getScoreBoard : function() {
        items = [];

        for (var key in this.Players) {
            items.push([key, this.Players[key]]);
        }

        items.sort(function(first, second) {
            return second[1] - first[1];
        });

        console.log(items);
    }

}
