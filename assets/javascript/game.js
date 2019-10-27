var rpg = {
    toon: {
        name: ["Charlotte", "Shanoa", "Alucard", "Jonathan"],
        atk: [6, 6, 6, 6],
        hp: [120, 180, 240, 300],
        parry: [20, 20, 20, 20],
        toonPic: ["charlotte.png", "shanoa.png", "alucard.png", "jonathan.png"],
        selectedToons: [],
        heroPos: 0,
        heroOriginalPos: 0,
        enemyPos: 0,
        placeHolder: [],
        placeHolderPos: [],
        enemyExists: false,
    },

    // start the game by population all the characters dynamically
    //TODO: Make the players and info look better
    //TODO: figure out how to make every character have a win path
    gameStart: function () {
        for (let i = 0; i < rpg.toon.name.length; i++) {
            var toonDiv = $("<div>");
            toonDiv.addClass("toonPic col-sm-2");
            toonDiv.attr({
                "onclick": "rpg.toonSelect()",
                "id": rpg.toon.name[i]
            });
            toonDiv.css("background", "url(./assets/images/" + rpg.toon.toonPic[i] + ")")
            toonDiv.css({
                "background": "url(./assets/images/" + rpg.toon.toonPic[i] + ")",
/*                 "width": "200px",
                "height": "150px", */
                "background-repeat": "no-repeat",
                "background-size": "100%"
            });
            toonDiv.text(rpg.toon.name[i] + " HP: " + rpg.toon.hp[i]);
            $("#toon-area").append(toonDiv);
        }
    },

    //removes unclicked-toons and makes them enemies!!! oooooohhhh scary!
    toonSelect: function () {
        rpg.toon.selectedToons.push(rpg.toon.name.indexOf(event.target.id));
        heroOriginalPos = rpg.toon.name.indexOf(event.target.id);
        console.log(heroOriginalPos);
        heroPos = rpg.toon.selectedToons[0];
        for (var i = 0; i < rpg.toon.name.length; i++) {
            if (i != heroPos) {
                $("#" + rpg.toon.name[i]).attr("onclick", "rpg.enemySelect()");
                var moveToon = $("#" + rpg.toon.name[i]).detach(); //detatch is better for memeory
                moveToon.appendTo('#enemy-area');
            } else {
                $("#" + rpg.toon.name[i]).prop("onclick", null);
            }
        }

        console.log("toonSelect() ran with input " + rpg.toon.name[heroPos])

    },

    //removes selected enemy and throws it in the battle arena! dun-DUHN-DUHNN!
    enemySelect: function () {
        rpg.toon.selectedToons.push(rpg.toon.name.indexOf(event.target.id));
        var moveToon = $("#" + rpg.toon.name[rpg.toon.name.indexOf(event.target.id)]).detach();
        moveToon.appendTo('#battle-area');

        for (let i = 0; i < rpg.toon.name.length; i++) {
            $("#" + rpg.toon.name[i]).prop("onclick", null);
        }

        $("button").css("visibility", "visible")
        $("button").attr("onclick", "rpg.onAttack()");
        console.log("enemySelect() ran with input " + rpg.toon.name[rpg.toon.name.indexOf(event.target.id)]);

    },

    //attack happens here damage attacker w/ parry and damage defender with attack
    // attack will go up per swing
    //when coding attacker its pos is always [rpg.toon.selectedToons[0]]
    //when coding defender its pos is always [rpg.toon.selectedToons[rpg.toon.selectedToons.length - 1]] 
    onAttack: function () {
        enemyPos = rpg.toon.selectedToons[rpg.toon.selectedToons.length - 1];

        //attacker does damage
        rpg.toon.hp[enemyPos] -= rpg.toon.atk[heroPos];
        $("#" + rpg.toon.name[enemyPos]).text(rpg.toon.name[enemyPos] + "  HP: " + rpg.toon.hp[enemyPos]);
        //if statement to see if defender died
        if (rpg.toon.hp[enemyPos] <= 0) {
            $("button").css("visibility", "hidden")
                $(".hero-log").text(rpg.toon.name[enemyPos] + " took " + rpg.toon.atk[heroPos] + " damage and is now defeated!");
                $(".enemy-log").text("Please select another enemy to fight!");
                if (rpg.toon.selectedToons.length == rpg.toon.name.length) {
                    $(".enemy-log").text("You Win! Click the title to play again! ");
                    rpg.gameEnd();
                }
                rpg.toon.placeHolder.push($("#" + rpg.toon.name[enemyPos]).detach());
                //name can tell me their orginal postion
                rpg.toon.placeHolderPos.push(enemyPos);
                this.onDeath();
        } else {
            //defender parry damage
            rpg.toon.hp[heroPos] -= rpg.toon.parry[enemyPos];
            $("#" + rpg.toon.name[heroPos]).text(rpg.toon.name[heroPos] + "  HP: " + rpg.toon.hp[heroPos]);
            //see if hero died
            if (rpg.toon.hp[heroPos] <= 0) {
                $("button").css("visibility", "hidden")
                $(".hero-log").text("You have been defeated!");
                $(".enemy-log").text("You Lose! Click the title to play again!");
                rpg.gameEnd();
                rpg.toon.enemyExists = true;
                //display damage delt/taken and make atk+=
            } else {
                // attack+=6
                $(".hero-log").text(rpg.toon.name[heroPos] + " took " + rpg.toon.parry[enemyPos] + " damage and now has " + rpg.toon.hp[heroPos] + "HP!");
                $(".enemy-log").text(rpg.toon.name[enemyPos] + " took " + rpg.toon.atk[heroPos] + " damage and now has " + rpg.toon.hp[enemyPos] + "HP!");


                rpg.toon.atk[heroPos] += 6;
            }
        }
    },

    // allow user to select another enemy by enabeling onclick even rpg.enemySelect() on the enemies left
    // do this by for looping and ignoring if i's value rests inside selectedToons ... .includes?
    onDeath: function () {
        for (var i = 0; i < rpg.toon.name.length; i++) {
            if (!rpg.toon.selectedToons.includes(i)) {
                $("#" + rpg.toon.name[i]).attr("onclick", "rpg.enemySelect()");
            }

        }

    },

    //assign all values back to starting values for atk, hp, parry
    //make sure you empty the array
    gameEnd: function () {
        $("#game-restart").attr("onclick", "rpg.gameRestart()");
    },

    gameRestart() {
        /* $("#" + rpg.toon.name[heroPos]).detach(); */
        rpg.toon.placeHolder.push($("#" + rpg.toon.name[heroPos]).detach());
        rpg.toon.placeHolderPos.push(heroOriginalPos);

        if ( rpg.toon.enemyExists == true) {
            //if enemy exists detach him too
            /* $("#" + rpg.toon.name[enemyPos]).detach(); */
            rpg.toon.placeHolder.push($("#" + rpg.toon.name[enemyPos]).detach());
            rpg.toon.placeHolderPos.push(enemyPos);
        }


        //TODO: this isn't working correctly
        for (var i = 0; i < rpg.toon.name.length; i++) {
            if ( rpg.toon.selectedToons.indexOf(i) != true) {
                rpg.toon.placeHolder.push($("#" + rpg.toon.name[i]).detach());
                rpg.toon.placeHolderPos.push(i);
            }

            //if its not included in array then add it to placholder.
            
        }

        console.log(rpg.toon.placeHolderPos);
        console.log(rpg.toon.placeHolder);

        var postPlace = 0;
        for (var i = 0; i < rpg.toon.name.length; i++) {
            postPlace = rpg.toon.placeHolderPos.indexOf(i);
            rpg.toon.placeHolder[postPlace].appendTo('#toon-area');
            /* $("#" + rpg.toon.name[i]).appendTo('#toon-area'); */
            $("#" + rpg.toon.name[i]).attr("onclick", "rpg.toonSelect()");
            rpg.toon.hp[i] = 120 + (i * 60);
            rpg.toon.atk[i] = 6;
            rpg.toon.parry[i] = 20;
            $("#" + rpg.toon.name[i]).text(rpg.toon.name[i] + "  HP: " + rpg.toon.hp[i]);
            console.log(postPlace);
        }
        rpg.toon.selectedToons = [];
        rpg.toon.heroPos = 0;
        heroOriginalPos = 0;
        rpg.toon.enemyPos = 0;
        rpg.toon.placeHolder = [];
        rpg.toon.placeHolderPos = [];
        rpg.toon.enemyExists = false;

        $(".hero-log").empty();
        $(".enemy-log").empty();


        $("#game-restart").attr("onclick", null);
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