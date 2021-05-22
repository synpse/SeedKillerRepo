// Dependencies
const robot = require('robotjs');
var CONFIG = require('./config.json');

var start = process.hrtime();

// Navigation Positions
var left = [796, 559];
var left2 = [614, 557];
var left3 = [431, 559];
var top = [994, 371];
var right = [1163, 557];
var bottom = [979, 746];

// Navigation Cards
var middleCardNorm = [980, 896];

var leftCard = [877, 938];
var midCard = [982, 923];
var rightCard = [1085, 940];

var leftCard2 = [929, 926];
var rightCard2 = [1035, 929];

// Navigation Other
var close = [1376, 150];
var refresh = [124, 50];
var login = [1174, 537];
var char = [981, 553];
var searchBar = [1267, 788];
var neutralBar = [986, 790];

var inv0 = [616, 886];
var inv1 = [696, 885];
var inv2 = [781, 886];
var inv3 = [862, 887];
var inv4 = [943, 885];
var inv5 = [1028, 886];
var inv6 = [1107, 884];
var inv7 = [1190, 887];
var inv8 = [1273, 886];
var inv9 = [1353, 886];

// Colors
var colorDone = 'b8ffae';
var colorResource1 = 'c4a67b';
var colorResource2 = 'c3a57b';

// Others
var heading = 1; // 1 - Left, 2 - Top, 3 - Right, 4 - Bottom
var interv;
var lastMousePos;
var isResourceful = CONFIG.isResourceful;
var terminateOnFinish = CONFIG.terminateOnFinish;
var leftCount = 0;

function elapsedTime(){
    var precision = 3; // 3 decimal places
    var elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli
    var seconds = process.hrtime(start)[0];
    return seconds;
}

function main() {
    console.log("Starting...");
    console.log("3...");
    sleep(1000);
    console.log("2...");
    sleep(1000);
    console.log("1...");
    sleep(1000);
    console.log("Calibrating...");
    //robot.moveMouse(0, 0);
    lastMousePos = robot.getMousePos();

    //testingGetValues();
    //testingGetColorAtPos(leftCard2);
    interv = setInterval(think, 5);
}

function reload() {
    move(refresh);
    sleep(3000);
    move(login);
}

function think() {
    if (checkInteracted()) clearInterval(interv);
    if (elapsedTime() >= 180) {
        reload();
        start = process.hrtime(); // reset the timer
    }

    if (leftCount == 28) {
        move(top);
        leftCount = 0;
    }

    if (checkInteracted()) clearInterval(interv);
    if (isPositionNew(left) || isPositionNew(left2) || isPositionNew(left3)) {
        if (checkInteracted()) clearInterval(interv);
        move(left);
        leftCount++;
    }
    else if (isPositionNew(top)) {
        if (checkInteracted()) clearInterval(interv);
        move(top);
        leftCount = 0;
    }
    else if (!isPositionNew(left) && !isPositionNew(left2) && !isPositionNew(left3) && !isPositionNew(top) && !isPositionNew(bottom) && !isPositionNew(right)) {
        if (checkInteracted()) clearInterval(interv);
        if (terminateOnFinish) {
            console.log("No more valid moves. Terminating...")
            clearInterval(interv);
        }
        else {
            changeSeed();
        }
        if (checkInteracted()) clearInterval(interv);
    }

    if (isResourceful) {
        sleep(1600);

        if (checkInteracted()) clearInterval(interv);

        if (isResourceCard(leftCard2)) {
            move(leftCard2);
        }
        else if (isResourceCard(rightCard2)) {
            move(rightCard2);
        }
        else if (isResourceCard(midCard)) {
            move(midCard);
        }
        else if (isResourceCard(leftCard)) {
            move(leftCard);
        }
        else if (isResourceCard(rightCard)) {
            move(rightCard);
        }
        else {
            move(middleCardNorm);
        }
    }
    else {
        sleep(1600);

        move(middleCardNorm);
    }

    if (checkInteracted()) clearInterval(interv);

    sleep(5);

    robot.keyTap('escape');

    if (checkInteracted()) clearInterval(interv);
}

function changeSeed() {
    move(char);
    sleep(1000);
    move(searchBar);
    writeWord('seed');
    var chosenSeed = getRandomInt(0, 9);
    sleep(5);
    move(neutralBar);
    sleep(5);

    if (chosenSeed == 0) {
        move(inv0);
    }
    else if (chosenSeed == 1) {
        move(inv1);
    }
    else if (chosenSeed == 2) {
        move(inv2);
    }
    else if (chosenSeed == 3) {
        move(inv3);
    }
    else if (chosenSeed == 4) {
        move(inv4);
    }
    else if (chosenSeed == 5) {
        move(inv5);
    }
    else if (chosenSeed == 6) {
        move(inv6);
    }
    else if (chosenSeed == 7) {
        move(inv7);
    }
    else if (chosenSeed == 8) {
        move(inv8);
    }
    else if (chosenSeed == 9) {
        move(inv9);
    }

    sleep(500);
    robot.keyTap('escape');
}

function writeWord(word) {
    for (var i = 0; i < word.length; i++) {
        robot.keyTap(word.charAt(i));
        sleep(1);
    }
}

function checkInteracted() {
    if (robot.getMousePos().x != lastMousePos.x ||
        robot.getMousePos().y != lastMousePos.y) {
        console.log("Mouse moved! Terminating...")
        return true;
    }

    return false;
}

function move(position) {
    robot.moveMouse(position[0], position[1]);
    robot.mouseClick();
    lastMousePos = robot.getMousePos();
}

function moveRandom() {
    var direction = getRandomInt(1, 4);
    var position;
    switch (direction) {
        case (1): 
            position = left;
            break;

        case(2):
            position = top;
            break;

        case(3):
            position = right;
            break;

        case(4):
            position = bottom;
            break;
    }
    robot.moveMouse(position[0], position[1]);
    robot.mouseClick();
    lastMousePos = robot.getMousePos();
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isPositionNew(position) {
    if (getColor(position[0], position[1]) != colorDone) {
        return true;
    }
    return false;
}

function isResourceCard(position) {
    if (getColor(position[0], position[1]) == colorResource1 ||
        getColor(position[0], position[1]) == colorResource2) {
        return true;
    }
    return false;
}

function getColor(x, y) {
    var img = robot.screen.capture(0, 0, 1920, 1080);
    return img.colorAt(x, y);
}

function printMouse(color, mousePos) {
    console.log('Color: ' + color + ' | Pos: ' + mousePos.x + ', ' + mousePos.y);
}

function sleep(ms) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function printPosColor() {
    var mousePos = robot.getMousePos();
    var color = getColor(mousePos.x, mousePos.y);
    printMouse(color, mousePos);
}

function testingGetColorAtPos(position) {
    var color = getColor(position[0], position[1]);
    robot.moveMouse(position[0], position[1]);
    printMouse(color, robot.getMousePos());
}

function testingGetValues() {
    console.log("Color captured!");
    printPosColor();
}

main();