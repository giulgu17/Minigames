/*Powerups:



DOUBLE SHOT:
Makes you shoot twice per turn.



SCATTERSHOT:
Shoots 5 random squares in a 3x3, 5x5 or 7x7 area.



FORCEFIELD:
Places a forcefield on a square. The forcefield breaks after being shot once.
On hit:
    "The shell is blown up in mid-air. Looks like you hit a forcefield."
    "There was a forcefield on {Square} and the shell exploded on it."



SPOT TRAP:
Places a hidden trap on a square. When the enemy shoots it, the trap explodes and a random ship square gets marked on your map.
The enemy doesn't get notified of the trap.
On activation:
    "{Enemy} has activated a trap. A random ship square has been marked on your map."
    "Looks like {Enemy} has fallen into the trap, now you can see where one of their ships is."



HIGH-EXPLOSIVE SHELL:
A special shell designed to instantly sink a ship.
On hit:
    "It was a high explosive shell! it instantly sunk the ship!"



SPY:
Allows you to see the enemy's inventory and you get notified of every move they make. Lasts for 5 turns.
On activation:
    "You sent a spy to check on {Enemy}'s activies..."
    "{Enemy} is now under surveillance, let's see what they're up to..."
On enemy's move:
    "{Enemy} has placed a {Object} on {square}"
    "The spy reports that {Enemy} put down a {Object} on {square}"
On deactivation:
    "The spy is retreating before {Enemy} notices them."
    "The spy is back. {Enemy} is no longer under surveillance."




SONAR:
Allows you to scan a 5x5 area to see how many ships are present.
On activation:
    "You activated the sonar. Scanning the area..."
    "The sonar is scanning the area..."
On success:
    "{Number} of squares in the area are occupied by ships."
    "The sonar detected {Number} of ships in the area."
On failure:
    "The sonar didn't detect any ships in the area."
    "Looks like there are no ships in the area."
*/
