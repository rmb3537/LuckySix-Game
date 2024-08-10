import { kvote } from "./kvote.js";
import { allBalls } from "./balls.js";

let ballsHolder = document.querySelector('.balls-holder');
let numbersDiv = document.querySelector('.numbers');
let ballsDisplay = document.querySelector('.balls-display')
let startBtn = document.querySelector('#start');
let mainBall = document.querySelector('#main-ball')
let speedTimes = document.querySelectorAll('.speed-time');
let info = document.querySelector('.info')
let winTitle = document.querySelector('.win-title')
let resetBtn = document.querySelector('.reset')
let fiveBalls = document.querySelectorAll('.ball > img');

let pickedBalls = [];
let selectedNumbers = [];
let generalTime = 2000;
let animationTime = 1000;
let totalSix = 0;
let winKvota = 0;

createBallsGrid();
createNumbersGrid();

let allNumbers = document.querySelectorAll('.number');

allNumbers.forEach(num => num.addEventListener('click',selectNumber))
startBtn.addEventListener('click',main);
speedTimes.forEach(time => time.addEventListener('click',setSpeed))
resetBtn.addEventListener('click', resetGame)

function resetGame(){
    selectedNumbers = [];
    pickedBalls = [];
    totalSix = 0;

    info.style.display = "none";
    startBtn.style.display = "block";

    allNumbers.forEach(num => num.removeAttribute('style'))
    createBallsGrid()
    fiveBalls.forEach(ball => ball.setAttribute('src','lucky6Images/basic.png'));

    let pickedImages = document.querySelectorAll('.picked');
    pickedImages.forEach(ball => {
        ball.setAttribute('src','lucky6Images/basic.png');
        ball.classList.remove('win');
    })

    addAllClicks()
}

function addAllClicks(){
    allNumbers.forEach(num => num.addEventListener('click',selectNumber));
}

function main(){
    if(selectedNumbers.length === 6){
        this.style.display = "none";
        removeAllClicks()
        displaySelecteBalls()
        startGame()
    }else {
        alert("U must pick 6 numbers")
    }
}

function setSpeed(){
    speedTimes.forEach(t => t.classList.remove('speed-light'));
    this.classList.add('speed-light')
    generalTime = this.getAttribute('data-speed').split('-')[0]
    animationTime = this.getAttribute('data-speed').split('-')[1]
}

function displaySelecteBalls(){
    let text = "";
    selectedNumbers.forEach(num => {
        let currentBall = allBalls.find(ball => ball.number == num)
        text += `
        <img src="lucky6Images/${currentBall.image}" data-selected="${currentBall.number}" class="picked" />
        `.trim()
    })
    ballsDisplay.innerHTML = text;
}

function removeAllClicks(){
    allNumbers.forEach(num => num.removeEventListener('click',selectNumber))
}


function selectNumber(){
    let currentNum = this.innerHTML;
    if(!selectedNumbers.includes(currentNum)){
        selectedNumbers.push(currentNum)
        this.style.background = this.classList[1]
    }else{
        selectedNumbers = selectedNumbers.filter(el => el !== currentNum);
        this.removeAttribute('style');
    }

    if(selectedNumbers.length === 6){
        startBtn.classList.add('ready');
    }else{
        startBtn.classList.remove('ready');
    }
}

function startGame(){
    let counter = 0;
    let currentBalls = [...allBalls];
    let loop = setInterval(() => {
        mainBall.style.opacity = 1;
        counter++;
        let rand = Math.floor(Math.random() * currentBalls.length);
        pickedBalls.push(currentBalls[rand]);
        mainBall.setAttribute('src','lucky6Images/' + currentBalls[rand].image)
        mainBall.style.width = "190px";
        currentBalls.splice(rand,1);
        setTimeout(() => {
            updateScreen()
            mainBall.style.opacity = 0;
            mainBall.style.width = 0;
            if(counter === 35){
                clearInterval(loop);
                endGame()
            }
        },animationTime)
    },generalTime)
}

function endGame(){
    let msg = '';
    (totalSix < 6) ? msg = "You loose ! Try again" : msg = `You WIN x${winKvota}! Play again`;
    winTitle.innerHTML = msg;
    info.style.display = "block";
}

function updateScreen(){
    let image = document.querySelector(`[data-index="${pickedBalls.length}"]`);
    image.setAttribute('src','lucky6Images/' + pickedBalls[pickedBalls.length-1].image)

    let selectedImage = document.querySelector(`[data-selected="${pickedBalls[pickedBalls.length-1].number}"]`)
    if(selectedImage){
        selectedImage.classList.add('win');
        totalSix++;
        if(totalSix === 6){
            winKvota = kvote[pickedBalls.length - 6];
        }
    }
}

function createNumbersGrid(){
    allBalls.forEach(ball => {
        let newBall = document.createElement('div');
        newBall.classList.add('number');
        newBall.addEventListener('mouseover',function(){
            this.classList.add(ball.color)
        })
        newBall.addEventListener('mouseout',function(){
            this.classList.remove(ball.color)
        })
        newBall.innerHTML = ball.number;
        numbersDiv.appendChild(newBall)
    })
}

function createBallsGrid(){
    let positions = make3Random()
    let text = "";
    kvote.forEach((kvota,index) => {
        text += `
        <div class="win-chance">
            <img data-index="${index + 6}" src="lucky6Images/basic.png" />
            <div class="kvota">${kvota}</div>
            ${positions.includes(index) ?
            `<img class="bonus" src="lucky6Images/bonus.png" />` : ``
            }
        </div>
        `.trim()
    })
    ballsHolder.innerHTML = text;
}

function make3Random(){
    const indexes = Array.from(Array(30).keys());
    let positions = [];
    for (let i = 0; i < 3; i++) {
       let rand = Math.floor(Math.random() * indexes.length);
       positions.push(indexes[rand]);
       indexes.splice(rand,1); 
    }
    return positions;
}