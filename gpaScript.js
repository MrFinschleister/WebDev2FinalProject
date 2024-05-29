var cOne
function cone(classOneText){
    cOne = parseInt(classOneText.value);
};
var cTwo;
function ctwo(classTwoText){
    cTwo = parseInt(classTwoText.value);
};
var cThree;
function cthree(classThreeText){
    cThree = parseInt(classThreeText.value);
};
var cFour;
function cfour(classFourText){
    cFour = parseInt(classFourText.value);
};
var cFive;
function cfive(classFiveText){
    cFive = parseInt(classFiveText.value);
};
var cSix;
function csix(classSixText){
    cSix = parseInt(classSixText.value);
};
var cSeven;
function cseven(classSevenText){
    cSeven = parseInt(classSevenText.value);
};
var oneType;
function tOne(classOneType){
    oneType = classOneType.value
}
var twoType;
function tTwo(classTwoType){
    twoType = classTwoType.value
}
var threeType;
function tThree(classThreeType){
    threeType = classThreeType.value
}
var fourType;
function tFour(classFourType){
    fourType = classFourType.value
}
var fiveType;
function tFive(classFiveType){
    fiveType = classFiveType.value
}
var sixType;
function tSix(classSixType){
    sixType = classSixType.value
}
var sevenType;
function tSeven(classSevenType){
    sevenType = classSevenType.value
}
function submit(){
    let oneResult = calcOne(cOne);
    let twoResult = calcTwo(cTwo);
    let threeResult = calcThree(cThree);
    let fourResult = calcFour(cFour);
    let fiveResult = calcFive(cFive);
    let sixResult = calcSix(cSix);
    let sevenResult = calcSeven(cSeven);
    calculateTypes(oneResult,twoResult,threeResult,fourResult,fiveResult,sixResult,sevenResult,oneType,twoType,threeType,fourType,fiveType,sixType,sevenType)
}
function calcOne(cOne){
    if (cOne > 89.5){
        cOne = 4
    } else if (cOne < 89.5 && cOne > 79.5){
        cOne = 3
    } else if (cOne < 79.5 && cOne > 69.5){
        cOne = 2
    } else if (cOne < 69.5){
        cOne = 1
    }
  return(cOne);
}
function calcTwo(cTwo){
    if (cTwo > 89.5){
        cTwo = 4
    } else if (cTwo < 89.5 && cTwo > 79.5){
        cTwo = 3
    } else if (cTwo < 79.5 && cTwo > 69.5){
        cTwo = 2
    } else if (cTwo < 69.5){
        cTwo = 1
    }
    return(cTwo);
}
function calcThree(cThree){
    if (cThree > 89.5){
        cThree = 4
    } else if (cThree < 89.5 && cThree > 79.5){
        cThree = 3
    } else if (cThree < 79.5 && cThree > 69.5){
        cThree = 2
    } else if (cThree < 69.5){
        cThree = 1
    }
    return(cThree);
}
function calcFour(cFour){
    if (cFour > 89.5){
        cFour = 4
    } else if (cFour < 89.5 && cFour > 79.5){
        cFour = 3
    } else if (cFour < 79.5 && cFour > 69.5){
        cFour = 2
    } else if (cFour < 69.5){
        cFour = 1
    }
    return(cFour);

}
function calcFive(cFive){
    if (cFive > 89.5){
        cFive = 4
    } else if (cFive < 89.5 && cFive > 79.5){
        cFive = 3
    } else if (cFive < 79.5 && cFive > 69.5){
        cFive = 2
    } else if (cFive < 69.5){
        cFive = 1
    }
    return(cFive);
}
function calcSix(cSix){
    if (cSix > 89.5){
        cSix = 4
    } else if (cSix < 89.5 && cSix > 79.5){
        cSix = 3
    } else if (cSix < 79.5 && cSix > 69.5){
        cSix = 2
    } else if (cSix < 69.5){
        cSix = 1
    }
    return(cSix);
}
function calcSeven(cSeven){
    if (cSeven > 89.5){
        cSeven = 4
    } else if (cSeven < 89.5 && cSeven > 79.5){
        cSeven = 3
    } else if (cSeven < 79.5 && cSeven > 69.5){
        cSeven = 2
    } else if (cSeven < 69.5){
        cSeven = 1
    }
    return(cSeven);
}
function calculateTypes(oneResult,twoResult,threeResult,fourResult,fiveResult,sixResult,sevenResult,oneType,twoType,threeType,fourType,fiveType,sixType,sevenType){
   
    if (oneType = "AP"){
        oneResult = parseInt(oneResult) + 2
    } else if (oneType = "Honors"){
        oneResult = parseInt(oneResult) + 1
    } else {
        oneResult = parseInt(oneResult)
    }
    if (twoType = "AP"){
        twoResult = parseInt(twoResult) + 2
    } else if (twoType = "Honors"){
        twoResult = parseInt(twoResult) + 1
    } else {
        twoResult = parseInt(twoResult)
    }
    if (threeType = "AP"){
        threeResult = parseInt(threeResult) + 2
    } else if (threeType = "Honors"){
        threeResult = parseInt(threeResult) + 1
    } else {
        threeResult = parseInt(threeResult)
    }
    if (fourType = "AP"){
        fourResult = parseInt(fourResult) + 2
    } else if (fourType = "Honors"){
        fourResult = parseInt(fourResult) + 1
    } else {
        fourResult = parseInt(fourResult)
    }
    if (fiveType = "AP"){
        fiveResult = parseInt(fiveResult) + 2
    } else if (fiveType = "Honors"){
        fiveResult = parseInt(fiveResult) + 1
    } else {
        fiveResult = parseInt(fiveResult)
    }
    if (sixType = "AP"){
        sixResult = parseInt(sixResult) + 2
    } else if (sixType = "Honors"){
        sixResult = parseInt(sixResult) + 1
    } else {
        sixResult = parseInt(sixResult)
    }
    if (sevenType = "AP"){
        sevenResult = parseInt(sevenResult) + 2
    } else if (sevenType = "Honors"){
        sevenResult = parseInt(sevenResult) + 1
    } else {
        sevenResult = parseInt(sevenResult)
    }
    let finalResult = (oneResult + twoResult + threeResult + fourResult + fiveResult + sixResult + sevenResult)/7
    alert("Your gpa is " + finalResult.toFixed(2))
}