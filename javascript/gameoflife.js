var cellSize = 10;
var imgData;
var ctx;
var color = "ff00ff"
var lifeMap = [[]];
var width;
var height;
var deathColor =  "#ffffff";
var lifeColor =  "#000000";
var intervalId;
function init(){

    var c = document.getElementById("myCanvas");
    ctx = c.getContext("2d"); 
    c.width = 1000; 
    c.height = 1000;
    
    width= 1000;
    height= 1000;
    init2dArray(lifeMap);
    renderMap(lifeMap);
}

function init2dArray(field){
    for(var w = 0;w < width;w++){
        field[w] = [];
        for(var h = 0;h < height; h++){
            field[w][h] = Math.floor(Math.random() * 2);
        }
    }
    return field;
}

function colorCoordinate(x,y){
     var randomColor = getRandomHexCode();
    ctx.fillStyle = "#" + getRandomHexCode() ;
    ctx.fillRect(Math.floor(x) * cellSize,Math.floor(y) * cellSize,cellSize,cellSize);   
}


function start(){
     
    if(intervalId == null){
        
   intervalId =  setInterval(function(){
        var start = new Date().getTime();
        lifeMap = calculateNextStep(lifeMap);
        var step1 = new Date().getTime();
                   renderMap(lifeMap);   
        var step2 = new Date().getTime();
        
        console.log(step1 - start + " calculate")
        console.log(step2 - step1 + " rendering")
                },10)
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

function renderMap(lifeMap){
        var value = getDominantValue(lifeMap); 
        var valueToRender = value == 0?0:1;
        
    if(value == 1){
        ctx.fillStyle = lifeColor ;
    }else{
        ctx.fillStyle = deathColor ;
    }
        ctx.fillRect(0,0,width,height); 
        for(var x = 0; x < lifeMap.length;x++){
            for(var y = 0;y < lifeMap[0].length;y++){
                if(lifeMap[x][y] == valueToRender){
                    ctx.fillStyle = valueToRender == 0?lifeColor:deathColor;
                    ctx.fillRect(Math.floor(x) * cellSize,Math.floor(y) * cellSize,cellSize,cellSize); 
                }
            }
        }    

}
function calculateNextStep(field){
    var result = [[]];
    init2dArray(result);
    if(fieldSizeIsAtleast3By3(field)){
        for(var x = 0; x < field.length;x++){
            for(var y = 0;y < field[0].length;y++){
                var currentField = field[x][y];
                var countNeighbours =  determineLivingNeighbours(field,x,y);
                if(countNeighbours == 3){
                    result[x][y] = 1;
                }else if(countNeighbours == 2 && currentField == 1){
                    result[x][y] = 1;
                }else{
                    result[x][y] = 0;
                }
            }
        }
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
function getRandomHexCode(){
    var hex = "";
    for(var i = 0; i < 6;i++){
        var randomNumber = Math.random()  * 16;
        hex = hex + convertToHexSign(randomNumber);
        
    }
    return hex;
}
function stop(){
    if(intervalId != null){
        clearInterval(intervalId);
        intervalId =null;
    }
}

function convertToHexSign(number){
    number = Math.floor(number);
    if(number < 10){
        return number;
    }else{
        number -= 9;
        switch(number){
            case 1:return 'a';
            case 2:return 'b';
            case 3:return 'c';
            case 4:return 'd';
            case 5:return 'e';
            case 6:return 'f';     
        }
    }
}