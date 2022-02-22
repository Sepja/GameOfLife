let ctx;
let lifeMap = [[]];
let mapWidth;
let mapHeight;
let deathColor = "#ffffff";
let lifeColor = "#000000";
let intervalId;
let ticksPerSecond;
let canvas;

function init() {
    mapWidth = 700;
    mapHeight = 700;
    ticksPerSecond = 15;
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    canvas.width = mapWidth;
    canvas.height = mapHeight;
    lifeMap = init2dArrayWithRandomValues(mapHeight,mapWidth);
    renderMap(lifeMap, null);
    start();
}

function createRandomPattern() {
    lifeMap = init2dArrayWithRandomValues(mapHeight,mapWidth);
    renderComplete(lifeMap);
}

function init2dArrayWithRandomValues(height,width){
    let result = [[]]
    for(let w = 0;w < width;w++){
        result[w] = [];
        for(let h = 0;h < height; h++){
            result[w][h] = Math.random() >= 0.5;
        }
    }
    return result;
}

function init2dArray(height,width) {
    return new Array(height).fill(0).map(() => new Array(width));
}

function start() {

    if (intervalId == null) {
        intervalId = setInterval(function () {
            nextTick();
        }, 1000 / ticksPerSecond)
    }

}

function renderMap(oldMap) {
        renderComplete(oldMap);
}

function colorPixel(canvas, pixels, x, y, lifeMap) {
    if (isSafeAccess(lifeMap, x, y)) {
        let off = (y * canvas.width + x) * 4;
        if (!lifeMap[x][y]) {
            pixels[off] = 255;
            pixels[off + 1] = 255;
            pixels[off + 2] = 255;
            pixels[off + 3] = 255;
        } else {
            pixels[off] = 0;
            pixels[off + 1] = 0;
            pixels[off + 2] = 0;
            pixels[off + 3] = 255;
        }
    }
}

function renderComplete(lifeMap) {
    let id = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let pixels = id.data;
    for (let x = 0; x < canvas.width; ++x) {
        for (let y = 0; y < canvas.height; ++y) {
            colorPixel(canvas, pixels, x, y, lifeMap)
        }
    }
    ctx.putImageData(id, 0, 0);
}

function isSafeAccess(lifeMap, x, y) {
    return lifeMap[x] != null && lifeMap[x][y] != null;
}

function calculateNextStep(field) {
    let result = init2dArray(mapHeight,mapWidth);
    if (fieldSizeIsAtleast3By3(field)) {
        for (let x = 0; x < field.length; x++) {
            for (let y = 0; y < field[0].length; y++) {
                let currentField = field[x][y];
                let countNeighbours = determineLivingNeighbours(field, x, y);
                if (countNeighbours === 3 || (countNeighbours === 2 && currentField)) {
                    result[x][y] = true;
                } else {
                    result[x][y] = false;
                }
            }
        }
        return result;
    } else {
        return field;
    }
}


function determineLivingNeighbours(field, x, y) {
    let result = 0;
    let minX = x - 1 >= 0 ? x - 1 : field.length - 1;
    let plusX = x + 1 < field.length ? x + 1 : 0;
    let minY = y - 1 >= 0 ? y - 1 : field[0].length - 1;
    let plusY = y + 1 < field[0].length ? y + 1 : 0;

    result = field[x][minY] ? result + 1 : result;
    result = field[x][plusY] ? result + 1 : result;
    result = field[minX][minY] ? result + 1 : result;
    result = field[minX][y] ? result + 1 : result;
    result = field[minX][plusY] ? result + 1 : result;
    result = field[plusX][y] ? result + 1 : result;
    result = field[plusX][minY] ? result + 1 : result;
    result = field[plusX][plusY] ? result + 1 : result;
    return result;
}

function fieldSizeIsAtleast3By3(field) {
    if (field.length >= 3) {
        if (field[0].length >= 3) {
            return true;
        }
    }

    return false;
}

function stop() {
    if (intervalId != null) {
        clearInterval(intervalId);
        intervalId = null;
    }
}
function nextTick() {
    let newMap = calculateNextStep(lifeMap);
    //Performance Improvement because of rendering changed pixels
    renderMap(lifeMap, newMap);
    lifeMap = newMap;
}

function clearCanvas() {
    ctx.fillStyle = deathColor;
    ctx.fillRect(0, 0, Number.parseInt(canvas.width), Number.parseInt(canvas.height));
}
