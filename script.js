// add javascript here
let score, answer, level;
let totalWins = 0;
let scores = [];
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

const levelArr = document.getElementsByName('level');
playBtn.addEventListener('click', play)
guessBtn.addEventListener('click', makeGuess);

function determineSuffix(date){
    if(date.toString()[date.toString().length - 1]== "1"){
        if(date.toString() == "11"){
            return "th"
        }
        return "st"
    }
    if(date.toString()[date.toString().length - 1]== "2"){
        if(date.toString() == "12"){
            return "th"
        }
        return "nd"
    }
    if(date.toString()[date.toString().length - 1]== "3"){
        if(date.toString() == "13"){
            return "th"
        }
        return "rd"
    }
    return "th"

}

function time(){
    const d = new Date();
    // date prefix: Month DaySuffix, Year
    const dateStr = months[d.getMonth()] + " " + d.getDate() + determineSuffix(d.getDate()) + ", " + d.getFullYear();

    // 12-hour time with leading zeros for minutes/seconds
    let hours = d.getHours();
    const ampm = hours < 12 ? 'AM' : 'PM';
    hours = hours % 12;
    if (hours === 0) hours = 12; // 12-hour clock

    const pad = (n) => n.toString().padStart(2, '0');
    const timeStr = hours + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds()) + " " + ampm;

    return dateStr + " " + timeStr;
}

// Live-update the #date element every second
const dateEl = document.getElementById('date');
function updateClock(){
    if (dateEl) dateEl.textContent = time();
}
// initialize immediately and then every second
updateClock();
setInterval(updateClock, 1000);

let currentTime;
function play(){
    playBtn.disabled = true;
    guessBtn.disabled = false;
    guess.disabled = false;
    currentTime = Date.now();
    for(let i = 0; i <levelArr.length; i++){
        levelArr[i].disabled = true;
        if(levelArr[i].checked){
            level = levelArr[i].value;
        }
    }

    answer = Math.floor(Math.random() * level)+1
    msg.textContent = "Guess a number 1-" + level;
    guess.placeholder = answer;
    score = 0;
}

function makeGuess(){
    let userGuess = parseInt(guess.value);
    if(isNaN(userGuess)){
        msg.textContent = "INVALID, must be a number!"
        return;
    } else if (userGuess < 1 || userGuess > level){
        msg.textContent = "INVALID, must be between 1-" + level
        return;
    }
    score++;

    if (userGuess < answer){
        msg.textContent = "Too low!"
    } else if (userGuess > answer){
        msg.textContent = "Too high!"
    } else{
        finalTime = Date.now() - currentTime;

        msg.innerHTML = "WOW CONGRATS. Took you " + score + " guesses!<br>Time taken: " + (finalTime/1000).toFixed(2) + " seconds."
        reset()
        updateScore();
    }
}

function reset(){
    playBtn.disabled = false;
    guessBtn.disabled = true;
    guess.value = ""
    guess.placeholder = ""
    guess.disabled = true;
    for(let i = 0; i <levelArr.length; i++){
        levelArr[i].disabled = false;
    }
}

function updateScore(){
    scores.push(score);
    totalWins += 1
    let totalScore = 0;
    scores.sort((a, b) => a-b);
    const lb = document.getElementsByName('leaderboard')


    for (let i = 0; i < scores.length; i++){
        totalScore += scores[i];
        if (i < lb.length){
            lb[i].textContent = scores[i]
        }
    }

    let usrAvgScore = totalScore/(scores.length)
    avgScore.textContent = "Average Score: " + usrAvgScore.toFixed(2);

    wins.textContent = "Total Wins: " + totalWins


    const fastestWinEl = document.getElementById('fastestwin');
    if (fastestWinEl) {
        if (!fastestWinEl.textContent || finalTime < parseFloat(fastestWinEl.textContent)) {
            fastestWinEl.textContent = (finalTime/1000).toFixed(2)
            document.getElementById('extraDate').textContent =  " seconds at " + time();
        } else{
            console.log("Slower time")
            console.log(finalTime/1000)
        }
    }

    
}
