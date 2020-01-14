// Each toon(character) will be stored within this object
var rpg = {
    toon: {
        name: ["Charlotte", "Shanoa", "Alucard", "Jonathan"],
        atk: [48, 24, 18, 42],
        atkDefault: [],
        hp: [200, 190, 270, 200],
        hpDefault: [],
        parry: [60, 25, 40, 20],
        toonSong: [],
        toonPic: ["charlotte.png", "shanoa.png", "alucard.png", "jonathan.png"],
        special: ["Piercing Beam", "Arma Custos", "Soul Steal", "Stonewall"],
        specialTT: ["Deals 100 damage", "For the next 3 times you take damage - gain 12 attack", "Deal 50 damage and gain 25 health", "The next 3 hits taken deal 1/5 of the damage."],
        currentSpecialCoolDownRates: [4, 5, 10, 8],
        currentSpecialCoolDown: 0,
        currentSpecial: 0,
        currentSpecialAvailable: true,
        currentSpecialActive: false,
        // stonewall will make him take 1/4 damage
        //arma makes atk+ when hit
        // souls steal does damage and gives hp
        // Piercing Beam does 100 DMG
        selectedToons: [],
        heroPos: 0,
        heroOriginalPos: 0,
        enemyPos: 0,
        placeHolder: [],
        placeHolderPos: [],
        enemyExists: false,
        drac: document.createElement("audio"),
        what: document.createElement("audio"),
        hasPlayed: false
    },


    // Start the game by population all the characters dynamically
    gameStart: function () {
        for (let i = 0; i < rpg.toon.name.length; i++) {
            var toonDiv = $("<div>");
            toonDiv.addClass("toonPic col-sm-2");
            toonDiv.attr({
                "onclick": "rpg.toonSelect()",
                "id": rpg.toon.name[i]
            });
            toonDiv.css("background", "url(./assets/images/" + rpg.toon.toonPic[i] + ")");
            toonDiv.css({
                "background": "url(./assets/images/" + rpg.toon.toonPic[i] + ")",
                /*                 "width": "200px",
                                "height": "150px", */
                "background-repeat": "no-repeat",
                "background-size": "100%"
            });
            toonDiv.text(rpg.toon.name[i] + " HP: " + rpg.toon.hp[i]);
            $("#toon-area").append(toonDiv);
            rpg.toon.atkDefault.push(rpg.toon.atk[i]);
            rpg.toon.hpDefault.push(rpg.toon.hp[i]);
        }
        /*         var audioElement = document.createElement("audio");
                var audioElement = document.createElement("audio"); */
        rpg.toon.drac.setAttribute("src", "./assets/audio/drac.mp3");
        rpg.toon.what.setAttribute("src", "./assets/audio/what.mp3");
        $(".toonPic").on("click", function () {
            rpg.toon.drac.volume = 0.2;
            rpg.toon.drac.play();
        });
        $(".toonPic").on("click", function () {
            if (rpg.toon.hasPlayed == false) {
                rpg.toon.what.volume = 0.5;
                rpg.toon.what.play();
                rpg.toon.hasPlayed = true;
            }
        });

        //data-song: "rpg.toon.toonSong[i]"
    },

    // Removes unclicked-toons and makes them enemies!!! oooooohhhh scary!
    toonSelect: function () {
        rpg.toon.selectedToons.push(rpg.toon.name.indexOf(event.target.id));
        heroOriginalPos = rpg.toon.name.indexOf(event.target.id);
        heroPos = rpg.toon.selectedToons[0];

        for (var i = 0; i < rpg.toon.name.length; i++) {
            if (i != heroPos) {
                $("#" + rpg.toon.name[i]).attr("onclick", "rpg.enemySelect()");
                var moveToon = $("#" + rpg.toon.name[i]).remove(); //remove is better for memory
                moveToon.appendTo('#enemy-area');
            } else {
                $("#" + rpg.toon.name[i]).attr("onclick", null);
            }
        }
    },

    // Removes selected enemy and throws it in the battle arena! dun-DUHN-DUHNN!
    enemySelect: function () {
        rpg.toon.selectedToons.push(rpg.toon.name.indexOf(event.target.id));
        var moveToon = $("#" + rpg.toon.name[rpg.toon.name.indexOf(event.target.id)]).remove();
        moveToon.appendTo('#battle-area');

        for (let i = 0; i < rpg.toon.name.length; i++) {
            $("#" + rpg.toon.name[i]).attr("onclick", null);
        }

        $("button").css("visibility", "visible");
        $("#special").text(rpg.toon.special[heroPos]);
        $("#special").attr("data-special", rpg.toon.special[heroPos]);

        if (rpg.toon.currentSpecialCoolDown == 0) {
            $("#tooltip").text("(Ready) " + rpg.toon.specialTT[heroPos]);

        } else {
            $("#tooltip").text("(Ready in " + (rpg.toon.currentSpecialCoolDownRates[heroPos] - rpg.toon.currentSpecialCoolDown + 1) + " turns) " + rpg.toon.specialTT[heroPos]);
        }        $("#tooltip").css("visibility", "visible")
        currentSpecial = rpg.toon.special[heroPos];
        $("button").attr("onclick", "rpg.onAttack()");

    },

    // After Attack button is clicked hero deals dmg to enemy and then receives damage w/ parry value
    // Attack will go up per swing & parry will not
    onAttack: function () {
        enemyPos = rpg.toon.selectedToons[rpg.toon.selectedToons.length - 1];
        if (rpg.toon.currentSpecialCoolDown == rpg.toon.currentSpecialCoolDownRates[heroPos]) {
            rpg.toon.currentSpecialCoolDown = 0;
            rpg.toon.currentSpecialAvailable = true;
            $("#special").removeClass("disabled"); // make disabled $("#special").removeAttr("disabled") to enable
            $("#special").removeAttr("disabled", ""); // make disabled $("#special").removeAttr("disabled") to enable

            if (rpg.toon.currentSpecialCoolDown == 0) {
                $("#tooltip").text("(Ready) " + rpg.toon.specialTT[heroPos]);

            } else {
                $("#tooltip").text("(Ready in " + (rpg.toon.currentSpecialCoolDownRates[heroPos] - rpg.toon.currentSpecialCoolDown + 1) + " turns) " + rpg.toon.specialTT[heroPos]);
            }        
        }


        // Attacker does damage
        var attackHappened = false;
        if (event.target.id == "attack") {
            attackHappened = true;
            rpg.toon.hp[enemyPos] -= rpg.toon.atk[heroPos];
            $("#" + rpg.toon.name[enemyPos]).text(rpg.toon.name[enemyPos] + "  HP: " + rpg.toon.hp[enemyPos]);
            $(".enemy-log").text(rpg.toon.name[enemyPos] + " took " + rpg.toon.atk[heroPos] + " damage and now has " + rpg.toon.hp[enemyPos] + "HP!");
        }

        if (event.target.id == "special") {

            switch (event.target.getAttribute('data-special')) {
                case "Piercing Beam":
                    rpg.toon.hp[enemyPos] -= 100;
                    $("#" + rpg.toon.name[enemyPos]).text(rpg.toon.name[enemyPos] + "  HP: " + rpg.toon.hp[enemyPos]);
                    $(".enemy-log").text(rpg.toon.name[enemyPos] + " took 100 damage and now has " + rpg.toon.hp[enemyPos] + "HP!");
                    break;

                case "Arma Custos":
                    rpg.toon.currentSpecialActive = true;
                    break;

                case "Soul Steal":
                    rpg.toon.hp[enemyPos] -= 50;
                    $("#" + rpg.toon.name[enemyPos]).text(rpg.toon.name[enemyPos] + "  HP: " + rpg.toon.hp[enemyPos]);
                    $(".enemy-log").text(rpg.toon.name[enemyPos] + " took 100 damage and now has " + rpg.toon.hp[enemyPos] + "HP!");
                    rpg.toon.hp[heroPos] += 25;

                    if (rpg.toon.hp[heroPos] > 270) {
                        rpg.toon.hp[heroPos] = 270;
                    }
                    $("#" + rpg.toon.name[heroPos]).text(rpg.toon.name[heroPos] + "  HP: " + rpg.toon.hp[heroPos]);
                    break;

                case "Stonewall":
                    rpg.toon.currentSpecialActive = true;
                    break;

                default:
                    break;
            }
            rpg.toon.currentSpecialAvailable = false;
            $("#special").addClass("disabled"); // make disabled $("#special").removeAttr("disabled") to enable
            $("#special").attr("disabled", ""); // make disabled $("#special").removeAttr("disabled") to enable
        }

        if (rpg.toon.currentSpecialAvailable == false) {
            rpg.toon.currentSpecialCoolDown++;
            if (rpg.toon.currentSpecialCoolDown == 0) {
                $("#tooltip").text("(Ready) " + rpg.toon.specialTT[heroPos]);

            } else {
                $("#tooltip").text("(Ready in " + (rpg.toon.currentSpecialCoolDownRates[heroPos] - rpg.toon.currentSpecialCoolDown + 1) + " turns) " + rpg.toon.specialTT[heroPos]);
            }
        }

        // See if defender died
        if (rpg.toon.hp[enemyPos] <= 0) {
            $("button").css("visibility", "hidden");
            $("#tooltip").css("visibility", "hidden");
            $(".hero-log").text(rpg.toon.name[enemyPos] + " took " + rpg.toon.atk[heroPos] + " damage and is now defeated!");
            $(".enemy-log").text("Please select another enemy to fight!");

            if (rpg.toon.selectedToons.length == rpg.toon.name.length) {
                $(".enemy-log").text("You Win! Click the title to play again! ");
                rpg.gameEnd();
            }
            rpg.toon.placeHolder.push($("#" + rpg.toon.name[enemyPos]).remove());

            /// / Name can tell me their original position
            rpg.toon.placeHolderPos.push(enemyPos);
            this.onDeath();
            rpg.toon.atk[heroPos] += 6;
        } else {

            // Defender deals parry damage to the hero
            if (rpg.toon.currentSpecialAvailable == false && heroPos == 3 && rpg.toon.currentSpecialCoolDown < 4) {
                rpg.toon.hp[heroPos] -= (rpg.toon.parry[enemyPos] / 5);
                $(".hero-log").text(rpg.toon.name[heroPos] + " took " + (rpg.toon.parry[enemyPos] / 5) + " damage and now has " + rpg.toon.hp[heroPos] + "HP!");
            } else {
                rpg.toon.hp[heroPos] -= rpg.toon.parry[enemyPos];
                $(".hero-log").text(rpg.toon.name[heroPos] + " took " + rpg.toon.parry[enemyPos] + " damage and now has " + rpg.toon.hp[heroPos] + "HP!");
            }
            $("#" + rpg.toon.name[heroPos]).text(rpg.toon.name[heroPos] + "  HP: " + rpg.toon.hp[heroPos]);
            
            if (rpg.toon.currentSpecialAvailable == false && heroPos == 1 && rpg.toon.currentSpecialCoolDown < 4) {
                rpg.toon.atk[heroPos] += 12;
                if (attackHappened == true) {
                    rpg.toon.atk[heroPos] += 6;
                }
            } else {
                rpg.toon.atk[heroPos] += 6;
            }
            attackHappened = false;

            // See if hero died
            if (rpg.toon.hp[heroPos] <= 0) {
                rpg.toon.hp[heroPos] = 0;
                $("#" + rpg.toon.name[heroPos]).text(rpg.toon.name[heroPos] + "  HP: " + rpg.toon.hp[heroPos]);
                $("button").css("visibility", "hidden");
                $("#tooltip").css("visibility", "hidden");
                $(".hero-log").text("You have been defeated!");
                $(".enemy-log").text("You Lose! Click the title to play again!");
                rpg.gameEnd();
                rpg.toon.enemyExists = true;
                // Display damage dealt / taken and make atk go up
            } 
        }
    },

    // Allow user to select another enemy by enabling onclick for rpg.enemySelect() on the enemies left
    onDeath: function () {
        for (var i = 0; i < rpg.toon.name.length; i++) {
            if (!rpg.toon.selectedToons.includes(i)) {
                $("#" + rpg.toon.name[i]).attr("onclick", "rpg.enemySelect()");
            }
        }
    },

    // See if user wants to play again
    gameEnd: function () {
        $("#game-restart").attr("onclick", "rpg.gameRestart()");
    },

    // Bring values back to their original states and reset the toons in order.
    gameRestart() {

        // remove hero
        /* $("#" + rpg.toon.name[heroPos]).remove(); */
        rpg.toon.placeHolder.push($("#" + rpg.toon.name[heroPos]).remove());
        rpg.toon.placeHolderPos.push(heroOriginalPos);
        console.log(rpg.toon.placeHolder);
        

        if (rpg.toon.enemyExists == true) {
            // If enemy exists remove them too (the one from the battle arena if user lost)
            /* $("#" + rpg.toon.name[enemyPos]).remove(); */
            rpg.toon.placeHolder.push($("#" + rpg.toon.name[enemyPos]).remove());
            rpg.toon.placeHolderPos.push(enemyPos);
        }


        //TODO: placeHolderPos sometimes has more than 4 pieces of data... find out why...
        // If its not included in array then add it to placeholder.
        for (var i = 0; i < rpg.toon.name.length; i++) {
            if (rpg.toon.selectedToons.indexOf(i) != true) {
                rpg.toon.placeHolder.push($("#" + rpg.toon.name[i]).remove());
                rpg.toon.placeHolderPos.push(i);
            }
        }
        $("#special").removeClass("disabled"); // make disabled $("#special").removeAttr("disabled") to enable
        $("#special").removeAttr("disabled", ""); // make disabled $("#special").removeAttr("disabled") to enable
        rpg.toon.atk = [];
        rpg.toon.hp = [];

        // Re-attach the toons so it looks like gamestart positions
        var postPlace = 0;
        for (var i = 0; i < rpg.toon.name.length; i++) {
            postPlace = rpg.toon.placeHolderPos.indexOf(i);
            rpg.toon.placeHolder[postPlace].appendTo('#toon-area');
            /* $("#" + rpg.toon.name[i]).appendTo('#toon-area'); */
            $("#" + rpg.toon.name[i]).attr("onclick", "rpg.toonSelect()");
            /*             rpg.toon.hp[i] = 120 + (i * 60);
                        rpg.toon.atk[i] = 6;
                        rpg.toon.parry[i] = 20; */
            rpg.toon.atk.push(rpg.toon.atkDefault[i]);
            rpg.toon.hp.push(rpg.toon.hpDefault[i]);
            $("#" + rpg.toon.name[i]).text(rpg.toon.name[i] + "  HP: " + rpg.toon.hp[i]);
        }
        rpg.toon.selectedToons = [];
        rpg.toon.heroPos = 0;
        heroOriginalPos = 0;
        rpg.toon.enemyPos = 0;
        rpg.toon.placeHolder = [];
        rpg.toon.placeHolderPos = [];
        rpg.toon.enemyExists = false;
        rpg.toon.currentSpecialCoolDown = 0;
        rpg.toon.currentSpecial = 0;
        rpg.toon.currentSpecialAvailable = true;
        rpg.toon.currentSpecialActive = false;
        $(".hero-log").empty();
        $(".enemy-log").empty();
        $("#game-restart").attr("onclick", null);
    }
};

//gameflow start
rpg.gameStart();

/////////////////////////////////////////////
// Initial pseudocode
// gameflow
// select char
// select enemy to battle
// choose attack when enemy is in battle area
// fight until someone dies
//      if pc dies offer game restart
//      if enemy  dies allow another enemy select
//      if enemies left = 0  trigger win