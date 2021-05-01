// Dependencies
const robot = require('robotjs');
var CONFIG = require('./config.json');

// Navigation Positions
var left = [796, 559];
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

// Colors
var colorDone = 'b8ffae';
var colorResource1 = 'c4a67b';
var colorResource2 = 'c3a57b';

// Others
var heading = 1; // 1 - Left, 2 - Top, 3 - Right, 4 - Bottom
var lastMousePos;
var isResourceful = CONFIG.isResourceful;
var terminateOnFinish = CONFIG.terminateOnFinish;

function main() {
    console.log("Starting...");
    console.log("3...");
    sleep(1000);
    console.log("2...");
    sleep(1000);
    console.log("1...");
    sleep(1000);
    console.log("Calibrating...");
    robot.moveMouse(0, 0);
    lastMousePos = robot.getMousePos();
    console.log("x: " + lastMousePos.x);
    console.log("y: " + lastMousePos.y);

    //testingGetValues();
    //testingGetColorAtPos(leftCard2);
    think();
}

function think() {
    while (true) {
        if (checkInteracted()) break;
        if (isPositionNew(left)) {
            move(left);
        }
        else if (isPositionNew(top)) {
            move(top);
        }
        else {
            if (terminateOnFinish) {
                console.log("No more valid moves. Terminating...")
                break;
            }

            move(left);
        }

        if (isResourceful) {
            sleep(1600);

            if (checkInteracted()) break;

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
            sleep(1200);

            if (checkInteracted()) break;

            move(middleCardNorm);
        }

        sleep(50);

        //move(close);
        robot.keyTap('escape');
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
    console.log("3...");
    sleep(1000);
    console.log("2...");
    sleep(1000);
    console.log("1...");
    sleep(1000);

    console.log("Color captured!");
    printPosColor();
}

main();