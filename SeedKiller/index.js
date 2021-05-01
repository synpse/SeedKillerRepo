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
var colorResource = 'c4a67b';

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
        sleep(150);

        //move(close);
        robot.keyTap('escape');

        if (checkInteracted()) break;
        if (heading == 1) {
            if (isPositionNew(left)) {
                move(left);
                heading = 1;
            }
            else if (isPositionNew(top)) {
                move(top);
                heading = 2;
            }
            else if (isPositionNew(right)) {
                move(right);
                heading = 3;
            }
            else if (isPositionNew(bottom)) {
                move(bottom);
                heading = 4;
            }
            else {
                if (terminateOnFinish) {
                    console.log("No more valid moves. Terminating...")
                    break;
                }
            }
        }
        else if (heading == 2) {
            if (isPositionNew(top)) {
                move(top);
                heading = 2;
            }
            else if (isPositionNew(right)) {
                move(right);
                heading = 3;
            }
            else if (isPositionNew(bottom)) {
                move(bottom);
                heading = 4;
            }
            else if (isPositionNew(left)) {
                move(left);
                heading = 1;
            }
            else {
                if (terminateOnFinish) {
                    console.log("No more valid moves. Terminating...")
                    break;
                }
            }
        }
        else if (heading == 3) {
            if (isPositionNew(right)) {
                move(right);
                heading = 3;
            }
            else if (isPositionNew(bottom)) {
                move(bottom);
                heading = 4;
            }
            else if (isPositionNew(left)) {
                move(left);
                heading = 1;
            }
            else if (isPositionNew(top)) {
                move(top);
                heading = 2;
            }
            else {
                if (terminateOnFinish) {
                    console.log("No more valid moves. Terminating...")
                    break;
                }
            }
        }
        else if (heading == 4) {
            if (isPositionNew(bottom)) {
                move(bottom);
                heading = 4;
            }
            else if (isPositionNew(left)) {
                move(left);
                heading = 1;
            }
            else if (isPositionNew(top)) {
                move(top);
                heading = 2;
            }
            else if (isPositionNew(right)) {
                move(right);
                heading = 3;
            }
            else {
                if (terminateOnFinish) {
                    console.log("No more valid moves. Terminating...")
                    break;
                }
            }
        }

        sleep(1550);

        if (isResourceful) {
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
            if (checkInteracted()) break;
            move(middleCardNorm);
        }
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

function isPositionNew(position) {
    if (getColor(position[0], position[1]) != colorDone) {
        return true;
    }
    return false;
}

function isResourceCard(position) {
    if (getColor(position[0], position[1]) == colorResource) {
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