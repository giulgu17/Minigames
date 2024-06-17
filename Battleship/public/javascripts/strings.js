function notification(msg) {
    update();
    var notifbox = document.getElementById("notif");
    if (jammed == 0) {
        switch (msg.type) {
            case "start":
                notifbox.innerHTML += "<b>You are now playing against " + opponent + ".</b><br>";
                break;
            case "turn":
                var random = Math.floor(Math.random() * 3);
                switch (random) {
                    case 0:
                        notifbox.innerHTML += "<b>It is now your turn.</b><br>";
                        break;
                    case 1:
                        notifbox.innerHTML += "<b>It's your turn.</b><br>";
                        break;
                    case 2:
                        notifbox.innerHTML += "<b>It's your turn to move.</b><br>";
                        break;
                }
                break;

            case "attack":
                var random = Math.floor(Math.random() * 3);
                switch (random) {
                    case 0:
                        notifbox.innerHTML += "You try shooting in " + msg.box + "...<br>";
                        break;
                    case 1:
                        notifbox.innerHTML += "You aim at " + msg.box + ".<br>";
                        break;
                    case 2:
                        notifbox.innerHTML += "Shooting in " + msg.box + ".<br>";
                        break;
                }
                break;
            case "attackHit":
                var random = Math.floor(Math.random() * 3);
                switch (random) {
                    case 0:
                        notifbox.innerHTML += "You hit a ship!<br>";
                        break;
                    case 1:
                        notifbox.innerHTML += "A ship has been hit!<br>";
                        break;
                    case 2:
                        notifbox.innerHTML += "It's a hit!<br>";
                        break;
                }
                break;
            case "attackMiss":
                var random = Math.floor(Math.random() * 3);
                switch (random) {
                    case 0:
                        notifbox.innerHTML += "You missed.<br>";
                        break;
                    case 1:
                        notifbox.innerHTML += "No ship has been hit.<br>";
                        break;
                    case 2:
                        notifbox.innerHTML += "It's a miss.<br>";
                        break;
                }
                break;
            case "attackBlock":
                var random = Math.floor(Math.random() * 3);
                switch (random) {
                    case 0:
                        notifbox.innerHTML += "You hit a forcefield!<br>";
                        break;
                    case 1:
                        notifbox.innerHTML += "There was a forcefield! Your shell did nothing.<br>";
                        break;
                    case 2:
                        notifbox.innerHTML += "You hit and broke a forcefield.<br>";
                        break;
                }
                break;


            case "resetAttack":
                notifbox.innerHTML += "Unequipping power.<br>";
                break;
            case "activateDouble":
                notifbox.innerHTML += "Equipping Double Shot!<br>";
                break;
            case "activateMortar":
                notifbox.innerHTML += "Equipping Mortar!<br>";
                break;
            case "startMortar":
                notifbox.innerHTML += "Shooting Mortar...<br>The mortar shot in ";
                break;
            case "shotMortar":
                notifbox.innerHTML += msg.box + ", ";
                break;
            case "endMortar":
                notifbox.innerHTML += "and " + msg.box + ".<br>";
                break;
            case "activateForcefield":
                notifbox.innerHTML += "Equipping Forcefield!<br>";
                break;
            case "placeForcefield":
                notifbox.innerHTML += "Forcefield placed in " + msg.box + ".<br>";
                break;
            case "activateTrap":
                notifbox.innerHTML += "Equipping Trap!<br>";
                break;
            case "placeTrap":
                notifbox.innerHTML += "Trap placed in " + msg.box + ".<br>";
                break;
            case "trapTriggered":
                notifbox.innerHTML += "The opponent triggered a trap!<br>";
                break;
            case "trapReport":
                notifbox.innerHTML += "An enemy ship in " + msg.box + " has been spotted!<br>";
                break;
            case "activateHE":
                notifbox.innerHTML += "Equipping High Explosive!<br>";
                break;
            case "highExplosiveHit":
                notifbox.innerHTML += "It was a high explosive shell, it instantly sunk the ship!.<br>";
                break;
            case "activateSonar":
                notifbox.innerHTML += "Equipping Sonar!<br>";
                break;
            case "scan":
                notifbox.innerHTML += "Scanning the area around " + msg.box + "...<br>";
                break;
            case "scanReport":
                if (msg.number == 1) {
                    notifbox.innerHTML += msg.number + " square in the area is occupied by a ship.<br>";
                } else {
                    notifbox.innerHTML += msg.number + " squares in the area are occupied by ships.<br>";
                }
                break;
            case "scanNoShips":
                notifbox.innerHTML += "Looks like there are no ships in the area.<br>";
                break;
            case "activateJammer":
                notifbox.innerHTML += "Disrupting the enemy's signal!<br>";
                break;
            case "jammerEnd":
                notifbox.innerHTML += "The jammer ran out of power.<br>";
                break;
            case "activateSpy":
                notifbox.innerHTML += "You sent a spy to check on " + opponent + "'s actions...<br>You will now be able to see their moves for " + spyDuration + " turns.<br>";
                break;
            case "spyReportForcefield":
                notifbox.innerHTML += "The opponent placed a forcefield in " + msg.box + ".<br>";
                break;
            case "spyReportTrap":
                notifbox.innerHTML += "The opponent placed a trap in " + msg.box + ".<br>";
                break;
            case "spyReportTrapTriggered":
                notifbox.innerHTML += "The spy reports that you just triggered a trap!.<br>";
                break;
            case "spyReportSpy":
                notifbox.innerHTML += "The opponent sent a spy to check on your actions, be careful...<br>";
                break;
            case "spyReportScan":
                notifbox.innerHTML += "The opponent scanned the area around " + msg.box + ".<br>";
                break;
            case "spyEnd":
                notifbox.innerHTML += "The spy is retreating.<br>";
                break;


            case "enemyTurn":
                var random = Math.floor(Math.random() * 3);
                switch (random) {
                    case 0:
                        notifbox.innerHTML += "<b>It's your opponent's turn.</b><br>";
                        break;
                    case 1:
                        notifbox.innerHTML += "<b>It's your opponent's turn.</b><br>";
                        break;
                    case 2:
                        notifbox.innerHTML += "<b>It's your opponent's turn.</b><br>";
                        break;
                }
                break;
            case "enemyAttack":
                notifbox.innerHTML += opponent + " shot in " + msg.box + ".<br>";
                break;
            case "enemyAttackHit":
                notifbox.innerHTML += "They hit a ship!<br>";
                break;
            case "enemyAttackMiss":
                notifbox.innerHTML += "They missed.<br>";
                break;
            case "enemyAttackBlock":
                notifbox.innerHTML += "They hit a forcefield!<br>";
                break;
            case "enemyJammer":
                notifbox.innerHTML += "The opponent is tampering with your connection...<br>You may not be able to see some information for a while.<br>";
                break;
            case "enemyJammerEnd":
                notifbox.innerHTML += "Connection reestablished.<br>";
                break;
            case "enemySpyEnd":
                notifbox.innerHTML += "There were rumors of a spy being active in your lines, but it seems like they're gone now...<br>";
                break;



            case "win":
                notifbox.innerHTML += "You won!<br>";
                break;
            case "lose":
                notifbox.innerHTML += "You lost!<br>";
                break;
        }
    }
    notifbox.scrollTop = notifbox.scrollHeight;
}