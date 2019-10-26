var rpg = {
        toon: {
            name: ["Alucard", "Jonathan", "Charlotte", "Shanoa"],
            atk: [6, 6, 6, 6],
            hp: [240, 300, 120, 180],
            parry: [20, 20, 20, 20],
            /* toonPic: ["./assets/images/alucard.png", "./assets/images/jonathan.png", "./assets/images/charlotte.png", "./assets/images/Shanoa.png"], */
            toonPic: ["alucard.png", "jonathan.png", "charlotte.png", "shanoa.png"],
            selectedToons: [],
        },
        
        // start the game by population all the characters dynamically
        //TODO: Make the players and info look better
        //TODO: figure out how to make every character have a win path
        gameStart: function () {
            for (let i = 0; i < rpg.toon.name.length; i++) {
                var toonDiv = $("<div>");
                toonDiv.addClass("float-left border border-primary");
                toonDiv.attr({"onclick": "rpg.toonSelect()", "id": rpg.toon.name[i]});
                toonDiv.css("background", "url(./assets/images/"+rpg.toon.toonPic[i]+")")
                toonDiv.css({"background": "url(./assets/images/"+rpg.toon.toonPic[i]+")",
                            "width": "200px", 
                            "height": "150px",
                            "background-repeat": "no-repeat",
                            "background-size": "100%"
                            });
                toonDiv.text(rpg.toon.name[i] + "  HP: " + rpg.toon.hp[i] );
                  $("#toon-area").append(toonDiv);
              }
        },

        //removes unclicked-toons and makes them enemies!!! oooooohhhh scary!
        toonSelect: function () {
            rpg.toon.selectedToons.push(rpg.toon.name.indexOf(event.target.id));

            for (var i = 0; i < rpg.toon.name.length; i++) {
                if (i != rpg.toon.selectedToons[0]) {
                    $("#"+rpg.toon.name[i]).attr( "onclick", "rpg.enemySelect()" );
                    var moveToon = $("#"+rpg.toon.name[i]).detach();//detatch is better for memeory
                    moveToon.appendTo('#enemy-area');
                } else {
                    $("#"+rpg.toon.name[i]).prop( "onclick", null );
                }
            }

            console.log("toonSelect() ran with input " + rpg.toon.name[rpg.toon.selectedToons[0]])
            
        },

        //removes selected enemy and throws it in the battle arena! dun-DUHN-DUHNN!
        enemySelect: function () {
            rpg.toon.selectedToons.push(rpg.toon.name.indexOf(event.target.id));
            var moveToon = $("#"+rpg.toon.name[rpg.toon.name.indexOf(event.target.id)]).detach();
            moveToon.appendTo('#battle-area');

            for (let i = 0; i < rpg.toon.name.length; i++) {
                    $("#"+rpg.toon.name[i]).prop( "onclick", null );
                }
            
            $("button").css("visibility", "visible")
            $("button").attr( "onclick", "rpg.onAttack()" );
            console.log("enemySelect() ran with input " + rpg.toon.name[rpg.toon.name.indexOf(event.target.id)]);
            console.log("---------------------");
            
        },

        //attack happens here damage attacker w/ parry and damage defender with attack
        // attack will go up per swing
        //when coding attacker its pos is always [rpg.toon.selectedToons[0]]
        //when coding defender its pos is always [rpg.toon.selectedToons[rpg.toon.selectedToons.length - 1]] 
        onAttack: function () {
            //attacker does damage
            rpg.toon.hp[rpg.toon.selectedToons[rpg.toon.selectedToons.length - 1]] -=  rpg.toon.atk[rpg.toon.selectedToons[0]];
            $("#"+rpg.toon.name[rpg.toon.selectedToons[rpg.toon.selectedToons.length - 1]]).text(rpg.toon.name[rpg.toon.selectedToons[rpg.toon.selectedToons.length - 1]] + "  HP: " + rpg.toon.hp[rpg.toon.selectedToons[rpg.toon.selectedToons.length - 1]] );
            //if statement to see if defender died
            if (rpg.toon.hp[rpg.toon.selectedToons[rpg.toon.selectedToons.length - 1]] <= 0) {
                $("button").css("visibility", "hidden")
                if (rpg.toon.hp[rpg.toon.selectedToons[0]] <= 0) {
                    console.log("player Lost");
                    $(".hero-log").text( "You have been defeated!" );
                    $(".enemy-log").text( "You Lose! Click the title to play again! ");
                    rpg.gameEnd();
                } else {
                    $(".hero-log").text( rpg.toon.name[rpg.toon.selectedToons[rpg.toon.selectedToons.length - 1]] + " took " + rpg.toon.atk[rpg.toon.selectedToons[0]] + " damage and is now defeated!");    
                    $(".enemy-log").text( "Please select another enemy to fight!" );
                    if ( rpg.toon.selectedToons.length == rpg.toon.name.length ) {
                        $("#"+rpg.toon.name[rpg.toon.selectedToons[rpg.toon.selectedToons.length - 1]]).detach();
                        $(".enemy-log").text( "You Win! Click the title to play again! ");
                        rpg.gameEnd();
                        console.log("You Win!");
                    } else {
                        $("#"+rpg.toon.name[rpg.toon.selectedToons[rpg.toon.selectedToons.length - 1]]).detach();
                        this.onDeath();
                    }
                }
            }
            //defender parry damage
            rpg.toon.hp[rpg.toon.selectedToons[0]] -=  rpg.toon.parry[rpg.toon.selectedToons[rpg.toon.selectedToons.length - 1]];
            $("#"+rpg.toon.name[rpg.toon.selectedToons[0]]).text(rpg.toon.name[rpg.toon.selectedToons[0]] + "  HP: " + rpg.toon.hp[rpg.toon.selectedToons[0]] );
            if (rpg.toon.hp[rpg.toon.selectedToons[0]] <= 0) {
                $("button").css("visibility", "hidden")
                console.log("player Lost");
                $(".hero-log").text( "You have been defeated!" );
                $(".enemy-log").text( "You Lose! Click the title to play again!" );
                rpg.gameEnd();
            } else {
                // attack+=6
                $(".hero-log").text( rpg.toon.name[rpg.toon.selectedToons[0]] + " took " + rpg.toon.parry[rpg.toon.selectedToons[rpg.toon.selectedToons.length - 1]] + " damage and now has " + rpg.toon.hp[rpg.toon.selectedToons[0]] + "HP!");
                $(".enemy-log").text( rpg.toon.name[rpg.toon.selectedToons[rpg.toon.selectedToons.length - 1]] + " took " + rpg.toon.atk[rpg.toon.selectedToons[0]] + " damage and now has " + rpg.toon.hp[rpg.toon.selectedToons[rpg.toon.selectedToons.length - 1]] + "HP!");

                console.log("attacker = " + rpg.toon.name[rpg.toon.selectedToons[0]] + " took DMG: " + rpg.toon.parry[rpg.toon.selectedToons[rpg.toon.selectedToons.length - 1]]);
                console.log("defender = " + rpg.toon.name[rpg.toon.selectedToons[rpg.toon.selectedToons.length - 1]] + " took DMG: " + rpg.toon.atk[rpg.toon.selectedToons[0]]);
                console.log("---------------------");

                rpg.toon.atk[rpg.toon.selectedToons[0]] +=6;
            }
            
            
        },

        // allow user to select another enemy by enabeling onclick even rpg.enemySelect() on the enemies left
        // do this by for looping and ignoring if i's value rests inside selectedToons ... .includes?
        onDeath: function () {
            for (var i = 0; i < rpg.toon.name.length; i++) {
                if ( !rpg.toon.selectedToons.includes(i) ) {
                    $("#"+rpg.toon.name[i]).attr( "onclick", "rpg.enemySelect()" );
                }
                
            }
            console.log("Enemy died");
        },

        //TODO:assign all values back to starting values for atk, hp, parry
        //TODO:make sure you empty the array
        gameEnd: function() {
            $("#game-restart").attr( "onclick", "rpg.gameRestart()" );
            console.log("clear pieces to start state");
        },

        //TODO:almost like gameStart but uses appendTo for the dynamic pieces.
        gameRestart() {
            $("#game-restart").attr( "onclick", null );
            console.log("recalibrating")
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