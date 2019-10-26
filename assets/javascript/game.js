var rpg = {
        toon: {
            name: ["Alucard", "Jonathan", "Charlotte", "Shanoa"],
            atk: [6, 6, 6, 6],
            hp: [200, 200, 200, 200],
            parry: [50, 50, 50, 50],
            /* toonPic: ["./assets/images/alucard.png", "./assets/images/jonathan.png", "./assets/images/charlotte.png", "./assets/images/Shanoa.png"], */
            toonPic: ["alucard.png", "jonathan.png", "charlotte.png", "shanoa.png"],
            heroNum: 0,
        },
        
        // start the game by population all the characters dynamically
        //TODO: add hp value and make data look better
        gameStart: function () {
            for (let i = 0; i < rpg.toon.name.length; i++) {
                var toonDiv = $("<div>");
                /* var toonImage = $("<img>"); */
                toonDiv.addClass("float-left border border-primary");
                toonDiv.attr({"onclick": "rpg.toonSelect()", "id": rpg.toon.name[i]});
                toonDiv.css("background", "url(./assets/images/"+rpg.toon.toonPic[i]+")")
                toonDiv.css({"background": "url(./assets/images/"+rpg.toon.toonPic[i]+")",
                            "width": "200px", 
                            "height": "150px",
                            "background-repeat": "no-repeat",
                            "background-size": "100%"
                            });
                toonDiv.text(rpg.toon.name[i]);
                /* toonImage.attr("src", "./assets/images/"+rpg.toon.toonPic[i]); */
                  $("#toon-area").append(toonDiv);
                /*   $("#"+rpg.toon.name[i]).append(toonImage); */
                
              }
        },

        //removes unclicked-toons and makes them enemies!!! oooooohhhh scary!
        //TODO: $(toonboishere).remove() to remove the divs and make them anew so the onclick is new
        toonSelect: function () {
            rpg.toon.heroNum = rpg.toon.name.indexOf(event.target.id);

            for (var i = 0; i < rpg.toon.name.length; i++) {
                if (i != rpg.toon.heroNum) {
                    $("#"+rpg.toon.name[i]).attr( "onclick", "rpg.enemySelect()" );
                    var moveToon = $("#"+rpg.toon.name[i]).detach();
                    moveToon.appendTo('#enemy-area');
                    /* $("#"+rpg.toon.name[i]).remove(); */  //detatch is better for memeory
                } else {
                    $("#"+rpg.toon.name[i]).prop( "onclick", null );
                }
            }

            /* console.log("character selected and enemies moved to defender area");
            console.log(event.target.id);
            console.log($(event.target)[0].id);
            console.log(rpg.toon.heroNum); */
            console.log("toonSelect() ran with input " + rpg.toon.name[rpg.toon.heroNum])
            
        },

        //removes selected enemy and throws it in the battle arena! dun-DUHN-DUHNN!
        enemySelect: function () {
            var enemyNum = rpg.toon.name.indexOf(event.target.id);
            var bbeeooo = $("#"+rpg.toon.name[enemyNum]).detach();
            bbeeooo.appendTo('#battle-area');

            for (let i = 0; i < rpg.toon.name.length; i++) {
                    $("#"+rpg.toon.name[i]).prop( "onclick", null );
                }

            console.log("enemySelect() ran with input " + rpg.toon.name[enemyNum]);
        
        },


        onAttack: function () {
                    console.log("took dmg");
                    console.log("gave dmg");
                },

        gameEnd: function() {
            console.log("cleared pieces to start state");
        }
};

//gameflow start

rpg.gameStart();





// gameflow
// select char
// select enemy to battle
// choose attack when enemy is in battle area
// fight until someone dies
//      if pc dies offer game restart
//      if enemy  dies allow another enemy select
//      if enemies left = 0  trigger win