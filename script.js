// add javascript here
let score, answer, level;
let totalWins = 0;
let scores = [];
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

const levelArr = document.getElementsByName('level');
date.textContent = time()
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
    let d = new Date();
    let suffix;
    if (d.getDate()[d.getDate().length - 1] == 1){
        suffix = "st"
    }
    let str = months[d.getMonth()] + " " + d.getDate() + determineSuffix(d.getDate()) + ", " + d.getFullYear();
    return str;
}

function play(){
    playBtn.disabled = true;
    guessBtn.disabled = false;
    guess.disabled = false;
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
        msg.textContent = "WOW CONGRATS. Took you " + score + " guesses!"
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


    
}
