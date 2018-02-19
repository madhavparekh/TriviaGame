const compURL = 'https://opentdb.com/api.php?amount=20&category=18'; //computer
const vgameURL = 'https://opentdb.com/api.php?amount=20&category=15'; //videogame

var correct = 0; //counter
var missed = 0; //counter
var wrong = 0; //counter
var setInt; //setInterval
var counter; //countdown timer
var timeLeft = 15;
const timer = timeLeft * 1000;
var catPicked = false; //if category picked or not
var cat = ""; //holds cat. picked
var correctAns = ""; //holds correct ans
var queArray; //holds questions (api.results) array
var round = 0; // # of games played

$(document).ready(function(){
    $('#puzzle').hide();
    $('.alert').hide();
    var queryURL = "";
    var indxNo = 0;

    //listen for user to pick category
    $('.lead').on('click', function(e){
        if(!catPicked){    
            catPicked = true;
            if(e.target.id === 'comp'){
                queryURL = compURL;
                cat = 'Computer';
                $('#videogame').hide();
            }
            else if(e.target.id === 'videogame'){
                queryURL = vgameURL;
                cat = 'Video Game';
                $('#comp').hide();
            }
            
            //If category picked, fetch 20 questions
            if(catPicked){
                $.ajax({
                    url: queryURL,
                    method: "GET"
                }).then(function(r){
                    console.log(r);
                    queArray = r.results;
                    
                    //show #puzzle div
                    $('#puzzle').show();
                    
                    setInt = setInterval(setTrivia(indxNo), timer, indxNo++)
                });
            }
        }
        else{
            alert('Category already been picked! Finish or Reset the game')
        }
    });

    //listen on answer btn click
    $('.choices').on('click', '.btn', function(e){
        var userChoice = $(this).text();

        console.log('User Pick: ' +userChoice + ' ##Correct Ans: ' +correctAns);
        
        if(userChoice === correctAns){
            correct++;
            $('.score').find('#correct').html(correct);
        }
        else{
            wrong++;
            $('.score').find('#wrong').html(wrong);
        }

        resetRestartTimer();
        
    });

    function setTrivia(i){
        if(i < queArray.length){
            //empty both div
            $('.choices').empty();
            $('.question-area').empty();

            //convert 
            $('.score').find('#missed').html(missed);
            //push all answer choices into an array
            var choices = pushChoicesIntoArray(queArray[i]);
            
            //display que # and que in div .question-area
            var que = $('<h4>').html('Question ' +(i + 1)+ ' : ' +queArray[i].question);
            $('.question-area').append(que).append('<hr>');
    
            //create button for each choices and attach to .choices
            $('.choices').append('<h5>Here are your choices. Click one :</h5>');
            choices.forEach(e => {
                var btn = $('<button>').addClass('btn btn-dark m-2 mx-3').html(e);
                $('.choices').append(btn);
    
            });

            startTimer();
            //indxNo++;

        }
        else{
            //if round is over, reset everything, record scores, and start new game if btn clicked
            clearInterval(setInt);
            clearInterval(counter);
            $('.alert').show();
            $('.trivia').fadeTo(500, 0.4); //fades out .trivia div when round complete
            $('.alert').alert('Game Over! Press "Start Over" to play another game');
            $('.recHeader').append('<h4>Round '+ ++round + ' : ' +cat + ' trivia </h4>');
            $('.score').children().clone().appendTo('.record');

        }
    }


    function resetRestartTimer(){
        timeLeft = 15;
        clearInterval(setInt);
        clearInterval(counter);
        setInt = setInterval(setTrivia(indxNo), timer, indxNo++);
    }

    function startTimer(){
        
        counter = setInterval(function(){
            var paddedTimeLeft = timeLeft < 10 ? '0'+ timeLeft : timeLeft;
            $('#timeleft').html(paddedTimeLeft);
            timeLeft--;
            if(timeLeft < 0){
                missed++;
                timeLeft = 15;
                clearInterval(counter);
                resetRestartTimer();
            }
        }, 1000);
        
    }

});

function pushChoicesIntoArray(que){
    var ansChoices = [];
    //converts HTML Char to special char and stores correct_answer into correctAns (global) push correct answer into array
    correctAns = $('<div>').html(que.correct_answer).text();
    ansChoices.push(que.correct_answer);
    //push incorrect answers
    var incAns = que.incorrect_answers;

    incAns.forEach(e => {
        ansChoices.push(e);
    });
    
    //suffle array so correct ans is not always the first and return
    return ansChoices.sort(() => Math.random() - 0.5);

}

