// add javascript here
let score, answer, level, goodorbad;
let totalWins = 0;
let scores = [];
let winTimes = [];
// hints configuration
let hintsPerRound = 1; // change this to allow more hints per round
let hintsUsed = 0;
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const levelArr = document.getElementsByName('level');
playBtn.addEventListener('click', play)
guessBtn.addEventListener('click', makeGuess);
giveUp.addEventListener('click', giveUpGame);

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
    const dateStr = months[d.getMonth()] + " " + d.getDate() + determineSuffix(d.getDate()) + ", " + d.getFullYear();

    let hours = d.getHours();
    const ampm = hours < 12 ? 'AM' : 'PM';
    hours = hours % 12;
    if (hours === 0) hours = 12; 

    const pad = (n) => n.toString().padStart(2, '0');
    const timeStr = hours + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds()) + " " + ampm;

    return dateStr + " " + timeStr;
}

const dateEl = document.getElementById('date');
function updateClock(){
    if (dateEl) dateEl.textContent = time();
}
updateClock();
setInterval(updateClock, 1000);

let currentTime;
let userName;
function play(){
    playBtn.disabled = true;
    guessBtn.disabled = false;
    giveUp.disabled = false;
    guess.disabled = false;
    currentTime = Date.now();
    userName = document.getElementById('name').value;
    userName = case_correctly(userName);
    for(let i = 0; i <levelArr.length; i++){
        levelArr[i].disabled = true;
        if(levelArr[i].checked){
            level = levelArr[i].value;
        }
    }

    answer = Math.floor(Math.random() * level)+1
    if (userName){
        msg.textContent = userName + ", guess a number 1-" + level;
    } else {
        console.log(userName)
        msg.textContent = "Guess a number 1-" + level;
    }
    guess.placeholder = answer;
    score = 0;
    // enable hint button for this round (based on hintsPerRound)
    const hintBtn = document.getElementById('hintBtn');
    if (hintBtn) hintBtn.disabled = (hintsPerRound <= 0);
 
}   

function case_correctly(name){
    if (!name) return name;
    return name
        .trim()
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

function giveUpGame(){
    if (parseInt(guess.value)){
        score = Math.abs(parseInt(guess.value) - parseInt(answer));
    } else {
        score = parseInt(answer);
    }
    // include hint penalties in final recorded score for give-up
    const finalScore = score + (2 * hintsUsed);
    msg.textContent = "You gave up. The answer was " + answer + ". Your score has been set to " + finalScore + ".";
    reset();
    updateScore(false, finalScore);
}

function makeGuess(){
    let userGuess = parseInt(guess.value);
    if(isNaN(userGuess)){
        if (userName){
            msg.textContent = userName + ", that was INVALID. Input must be a number!"
        } else {
            msg.textContent = "INVALID, must be a number!"
        }
        return;
    } else if (userGuess < 1 || userGuess > level){
        if (userName){
            msg.textContent = userName + ", that was INVALID. Input must be a number!"
        } else {
            msg.textContent = "INVALID, must be a number!"
        }        
        return;
    }
    score++;
    if (userName){
        if (Math.abs(userGuess - answer) >= 20){
            msg.textContent = userName + "... that was ice cold..."
            } else if (Math.abs(userGuess - answer) >= 10){
                msg.textContent = userName + "... that was cold..."
            } else if (Math.abs(userGuess - answer) >= 5){
                msg.textContent = userName + "... that was warm..."
            } else if (Math.abs(userGuess - answer) >= 3){
                msg.textContent = userName + "... that was hot..."
            } else if (Math.abs(userGuess - answer) >= 1){
                msg.textContent = userName + "... that was very hot..."
            }
    } else {
        if (Math.abs(userGuess - answer) >= 20){
            msg.textContent = "Ice cold..."
            } else if (Math.abs(userGuess - answer) >= 10){
                msg.textContent = "Cold..."
            } else if (Math.abs(userGuess - answer) >= 5){
                msg.textContent = "Warm..."
            } else if (Math.abs(userGuess - answer) >= 3){
                msg.textContent = "Hot..."
            } else if (Math.abs(userGuess - answer) >= 1){
                msg.textContent = "Very hot..."
            }
        }
 

    if (userGuess < answer){
        msg.textContent += " Too low!"
    } else if (userGuess > answer){
        msg.textContent += " Too high!"
    } else{
        finalTime = Date.now() - currentTime;
        if (level == 3){
            if (score == 1){
                goodorbad = "good";
            } else if (score == 2){
                goodorbad = "ok";
            } else if (score >= 3){
                goodorbad = "bad";
            }
        } else if (level == 10){
            if (score == 1){
                goodorbad = "amazing!";
            } else if (score == 2){
                goodorbad = "good";
            } else if (score == 3){
                goodorbad = "ok";
            } else if (score >= 4){
                goodorbad = "bad";
            }
        } else if (level == 100){
            if (score == 1){
                goodorbad = "incredible!";
            } else if (score <= 3){
                goodorbad = "amazing!";
            } else if (score <= 5){
                goodorbad = "good";
            } else if (score <= 6){
                goodorbad = "ok";
            } else if (score > 6){
                goodorbad = "bad";
            }
        }
        // slow-motion reveal of the answer, then show final message and confetti
        revealAnswerSlowly(answer, function(){
                // compute final score including hint penalties
                const finalScore = score + (2 * hintsUsed);
                if (userName){
                    msg.innerHTML = userName + ", that was <strong>" + goodorbad + "</strong> <br><br>WOW CONGRATS. Took you " + score + " guesses and " + hintsUsed + " hints. Your final score is " + finalScore + ".<br><br>Time taken: " + (finalTime/1000).toFixed(2) + " seconds.</strong>"
                } else {
                    msg.innerHTML = "That was " + goodorbad + "<br><br>WOW CONGRATS. Took you " + score + " guesses and " + hintsUsed + " hints. Your final score is " + finalScore + ".<br><br>Time taken: " + (finalTime/1000).toFixed(2) + " seconds.</strong>"
                }
                // confetti celebration
                confettiBurst();
                reset();
                updateScore(true, finalScore);
        });
    }
}

function reset(){
    playBtn.disabled = false;
    guessBtn.disabled = true;
    guess.value = ""
    guess.placeholder = ""
    guess.disabled = true;
    giveUp.disabled = true;
    // disable hint button on reset and clear hintsUsed
    const hintBtn = document.getElementById('hintBtn');
    if (hintBtn) hintBtn.disabled = true;
    hintsUsed = 0;
    for(let i = 0; i <levelArr.length; i++){
        levelArr[i].disabled = false;
    }
}

function updateScore(isWin = true, finalScore = score){
    scores.push(finalScore);
    if (isWin) totalWins += 1;
    if (isWin && typeof finalTime !== 'undefined') {
        winTimes.push(finalTime);
    }
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
        if (!fastestWinEl.textContent || finalTime/1000 < parseFloat(fastestWinEl.textContent)) {
            fastestWinEl.innerHTML = (finalTime/1000).toFixed(2) + "<span id='extraTime'></span>";
            document.getElementById('extraTime').textContent =  " seconds at " + time();
        } else{
            console.log("Slower time")
            console.log(finalTime/1000)
            console.log(parseFloat(fastestWinEl.textContent))
            console.log(parseFloat(fastestWinEl.textContent) - finalTime/1000)

        }
    }

    const avgTimeEl = document.getElementById('avgTime');
    if (avgTimeEl) {
        if (winTimes.length > 0) {
            const avgMs = winTimes.reduce((a, b) => a + b, 0) / winTimes.length;
            avgTimeEl.textContent = "Average Time: " + (avgMs / 1000).toFixed(2) + " seconds";
        } else {
            avgTimeEl.textContent = "Average Time: N/A";
        }
    }

    
}

// --- Confetti animation (DOM-based) ---
function confettiBurst(opts = {}){
    const count = opts.count || 40;
    const colors = opts.colors || ['#ff6b6b','#ffd166','#6ee7b7','#7c3aed','#60a5fa'];
    const pieces = [];
    const centerX = window.innerWidth / 2;
    const startY = window.innerHeight * 0.25;

    for (let i = 0; i < count; i++){
        const el = document.createElement('div');
        const size = Math.floor(Math.random() * 10) + 6;
        el.style.position = 'fixed';
        el.style.left = centerX + (Math.random() * 200 - 100) + 'px';
        el.style.top = startY + (Math.random() * 40 - 20) + 'px';
        el.style.width = size + 'px';
        el.style.height = (size * (Math.random() * 0.6 + 0.6)) + 'px';
        el.style.background = colors[Math.floor(Math.random() * colors.length)];
        el.style.opacity = '1';
        el.style.pointerEvents = 'none';
        el.style.zIndex = 9999;
        el.style.borderRadius = (Math.random() > 0.5 ? '3px' : '50%');
        document.body.appendChild(el);

        pieces.push({
            el,
            x: parseFloat(el.style.left),
            y: parseFloat(el.style.top),
            vx: (Math.random() - 0.5) * 8,
            vy: - (Math.random() * 10 + 6),
            rot: Math.random() * 360,
            vrot: (Math.random() - 0.5) * 12,
            life: 0,
            ttl: 2000 + Math.random() * 1000
        });
    }

    let last = performance.now();
    function step(now){
        const dt = now - last;
        last = now;
        for (let i = pieces.length - 1; i >= 0; i--){
            const p = pieces[i];
            p.life += dt;
            p.vy += 0.035 * dt; // gravity scaled
            p.x += p.vx * (dt/16);
            p.y += p.vy * (dt/16);
            p.rot += p.vrot * (dt/16);
            const t = p.life / p.ttl;
            p.el.style.left = p.x + 'px';
            p.el.style.top = p.y + 'px';
            p.el.style.transform = 'rotate(' + p.rot + 'deg)';
            p.el.style.opacity = Math.max(0, 1 - t*1.2).toString();
            if (p.life > p.ttl){
                p.el.remove();
                pieces.splice(i,1);
            }
        }
        if (pieces.length > 0) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

// --- Slow-motion reveal of the answer digits ---
function revealAnswerSlowly(answer, cb){
    // answer is a number; reveal digits one-by-one inside #msg
    const container = msg;
    if (!container) return cb && cb();
    container.textContent = '';
    const wrapper = document.createElement('div');
    wrapper.style.fontSize = '1.25rem';
    wrapper.style.letterSpacing = '2px';
    wrapper.style.padding = '8px 0';
    wrapper.textContent = 'Revealing the answer: ';
    const digitsSpan = document.createElement('span');
    digitsSpan.style.opacity = '0.9';
    wrapper.appendChild(digitsSpan);
    container.appendChild(wrapper);

    const s = String(answer);
    let i = 0;
    const revealInterval = 350; // ms between digits (slow-motion feel)
    function showNext(){
        if (i >= s.length){
            // small pause then callback
            setTimeout(() => cb && cb(), 400);
            return;
        }
        digitsSpan.textContent = s.slice(0, i+1);
        // subtle scale animation
        digitsSpan.style.transform = 'scale(1.15)';
        digitsSpan.style.transition = 'transform 180ms ease';
        setTimeout(()=> digitsSpan.style.transform = 'scale(1)', 180);
        i++;
        setTimeout(showNext, revealInterval);
    }
    // start after a short dramatic pause
    setTimeout(showNext, 300);
}

// --- Hint button and logic ---
function ensureHintButton(){
    if (document.getElementById('hintBtn')) return;
    const hintBtn = document.createElement('button');
    hintBtn.id = 'hintBtn';
    hintBtn.textContent = 'Hint';
    hintBtn.disabled = true;
    hintBtn.style.background = 'linear-gradient(90deg,#f97316,#fb923c)';
    hintBtn.addEventListener('click', giveHint);
    // try to insert into the controls wrapper
    const controls = document.querySelector('.controls');
    if (controls){
        controls.appendChild(hintBtn);
    } else {
        // fallback: append near giveUp button
        const giveUpEl = document.getElementById('giveUp');
        if (giveUpEl && giveUpEl.parentElement) giveUpEl.parentElement.insertBefore(hintBtn, giveUpEl.nextSibling);
        else document.body.appendChild(hintBtn);
    }
}

function giveHint(){
    // usage: costs a penalty (+2 guesses) and disables further hints in this round
    const hintBtn = document.getElementById('hintBtn');
    if (!answer || !level || (hintBtn && hintBtn.disabled)) return;
    const lvl = parseInt(level);
    const width = Math.max(1, Math.floor(lvl / 4));
    const low = Math.max(1, answer - width);
    const high = Math.min(lvl, answer + width);
    hintsUsed += 1; // track usage
    msg.textContent = 'Hint: the answer is between ' + low + ' and ' + high + ' (hint used: ' + hintsUsed + '/' + hintsPerRound + ', penalty: +2 each)';
    if (hintBtn) hintBtn.disabled = (hintsUsed >= hintsPerRound);
}

// ensure hint button exists as soon as script runs
ensureHintButton();
