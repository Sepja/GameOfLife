var cellSize =4;
var imgData;
var ctx;
var color = "ff00ff"
var lastMap;
var lifeMap = [[]];
var mapWidth;
var mapHeight;
var deathColor =  "#ffffff";
var lifeColor =  "#000000";
var intervalId;
var framerate;
var canvas;
function init(){
    mapWidth = 500;
    mapHeight= 500;
    framerate = 50;
    updateCurrentFrameRate(framerate);
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d"); 
    canvas.width = mapWidth; 
    canvas.height = mapHeight;
    document.getElementById("heightSlider").value=mapHeight;
    document.getElementById("widthSlider").value=mapWidth;
    document.getElementById("franerate").value=framerate;
    document.getElementById("cellSizeSlider").value=cellSize;
  
    init2dArray(lifeMap);
    renderMap(lifeMap,null);
    displayCellSize();
    displayWidth();
    displayHeight();
}

function draw(){
    
}

function refresh(){
    init2dArray(lifeMap);
    renderComplete(lifeMap);
}

function init2dArray(field){
    for(var w = 0;w < mapWidth
       ;w++){
        field[w] = [];
        for(var h = 0;h < mapHeight; h++){
            field[w][h] = Math.floor(Math.random() * 2);
        }
    }
    return field;
}

function start(){
     
    if(intervalId == null){
        
   intervalId =  setInterval(function(){
        var start = new Date().getTime();
        newMap = calculateNextStep(lifeMap);
        var step1 = new Date().getTime();
        //Performance Improvement because of rendering changed pixels
        renderMap(lifeMap,newMap);   
        lifeMap = newMap;
        var step2 = new Date().getTime();
        
        console.log(step1 - start + "ms calculating next step.")
        console.log(step2 - step1 + "ms rendering picture")
                },1000 / framerate)
    }
     
}

function getDominantValue(field){
    var count0 = 0;
    var count1 = 0;
    for(var x = 0; x < lifeMap.length;x++){
        for(var y = 0;y < lifeMap[0].length;y++){
            if(field[x][y] == 1){
                count1 = count1 + 1;
            }else{
                count0 = count0 + 1;
            }
        }
    }
    return count0 > count1? 0:1;
}

function renderMap(oldMap,newMap){
        if(newMap ==null){
            renderComplete(oldMap);
        }else{
            var minWidthOfMaps = min(oldMap.length,newMap.length);
            var minHeightOfMaps = min(oldMap[0].length,newMap[0].length);
            
            for(var width = 0;width < canvas.width/cellSize;width++){
                for(var height = 0;height< canvas.height/cellSize;height++){
                    //compare each cell of the map
                    //if not the same take the color of the new Map
                    if(isSafeAccess(oldMap,width,height)
                       && isSafeAccess(newMap,width,height)
                        && oldMap[width][height] != newMap[width][height]){
                         colorField(width,height,getColor(newMap[width][height])); 
                    }
                }
            }
        }
}

function min(number1,number2){
    return number1 > number2?number2:number1;
}


function renderComplete(lifeMap){
        var value = getDominantValue(lifeMap); 
        var valueToRender = value == 0?1:0;
        
        if(value == 1){
          ctx.fillStyle = lifeColor ;
        }else{
        ctx.fillStyle = deathColor ;
        }
        ctx.fillRect(0,0,canvas.width ,canvas.height); 
        for(var x = 0; x < canvas.width;x++){
            for(var y = 0;y < canvas.height;y++){
                if(isSafeAccess(lifeMap,x,y) && lifeMap[x][y] == valueToRender){
                    colorField(x,y,getColor(valueToRender));
                }
            }
        }    
}

function isSafeAccess(lifeMap,x,y){
    return lifeMap[x] != null && lifeMap[x][y] != null;
}

function getColor(fieldValue){
    return fieldValue == 0?deathColor:lifeColor;
}

function colorField(x,y,color){
              ctx.fillStyle = color;
              ctx.fillRect(Math.floor(x) * cellSize,Math.floor(y) * cellSize,cellSize,cellSize); 
}

function calculateNextStep(field){
    var result = [[]];
    init2dArray(result);
    if(fieldSizeIsAtleast3By3(field)){
        for(var x = 0; x < field.length;x++){
            for(var y = 0;y < field[0].length;y++){
                var currentField = field[x][y];
                var countNeighbours =  determineLivingNeighbours(field,x,y);
                if(countNeighbours == 3 || (countNeighbours == 2 && currentField == 1)){
                    result[x][y] = 1;
                }else{
                    result[x][y] = 0;
                }
            }
        }
        lastMap = field;
        return result;
    }else{
        return field;
    }
}


function determineLivingNeighbours(field,x,y){
    var result = 0;
    var minX = x - 1 >= 0 ? x-1:field.length-1;
    var plusX = x + 1 < field.length?x+1:0;
    var minY = y -1 >=0 ? y-1:field[0].length-1;
    var plusY = y+1 < field[0].length?y+1:0;

    result = field[minX][minY] == 1?result + 1:result;
    result = field[x][minY] == 1?result + 1:result;
    result = field[plusX][minY] == 1?result + 1:result;
    result = field[minX][y] == 1?result + 1:result;
    result = field[plusX][y] == 1?result + 1:result;
    result = field[minX][plusY] == 1?result + 1:result;
    result = field[x][plusY] == 1?result + 1:result;
    result = field[plusX][plusY] == 1?result + 1:result;
    return result;
}

function fieldSizeIsAtleast3By3(field){
    if(field.length >= 3){
        if(field[0].length >= 3){
            return true;
        }
    }
    
    return false;
}

function stop(){
    if(intervalId != null){
        clearInterval(intervalId);
        intervalId =null;
    }
}

function onFrameRateChanged(){
    var userFrameRate =  Number.parseInt(document.getElementById("franerate").value);
    if(isFrameRateValid(userFrameRate)){
        updateCurrentFrameRate(userFrameRate);
        
        framerate = userFrameRate;
        if(intervalId != null){   
            stop();
            start();
        }
    }

}

function updateCurrentFrameRate(framerate){
    document.getElementById("currentFramerate").innerHTML = "Framerate " + framerate;
}

function isFrameRateValid(framerate){
    return Number.isInteger(framerate) && framerate > 0;
}

function onHeightChanged(){
   var userHeight =  Number.parseInt(document.getElementById("heightSlider").value); 
    if(userHeight > 0){
        canvas.height = userHeight;
        renderComplete(lifeMap);
    }
}

function onWidthChanged(){
    var userWidth =  Number.parseInt(document.getElementById("widthSlider").value); 
    if(userWidth > 0){
        canvas.width = userWidth;
        renderComplete(lifeMap);
    }
  
}

function displayCellSize(){
        var cs =  Number.parseInt(document.getElementById("cellSizeSlider").value);
        document.getElementById("cellSizeDisplay").innerHTML = "Cellsize " + cs;
}function displayWidth(){
        var currentWidth =  Number.parseInt(document.getElementById("widthSlider").value);
        document.getElementById("widthDisplay").innerHTML = "Width " + currentWidth;
}function displayHeight(){
        var currentHeight =  Number.parseInt(document.getElementById("heightSlider").value);
        document.getElementById("heightDisplay").innerHTML = "Height " + currentHeight;
     
}
                          
function onCellSizeChanged(){
     cellSize =  Number.parseInt(document.getElementById("cellSizeSlider").value);
    //old rendered picture should be cleared.
    renderComplete(lifeMap);
}

function clearCanvas(){
      ctx.fillStyle = deathColor;
      ctx.fillRect(0,0,Number.parseInt(canvas.width),Number.parseInt(canvas.height)); 
}
