const compURL = 'https://opentdb.com/api.php?amount=20&category=18'; //computer
const vgameURL = 'https://opentdb.com/api.php?amount=20&category=15'; //videogame

var correct = 0;
var missed = 0;
var wrong = 0;
var setInt; //setInterval
var counter; //countdown timer
var timeLeft = 15;
const timer = timeLeft * 1000;
var catPicked = false;


var correctAns = "";
var queArray; //holds questions (api.results) array

$(document).ready(function(){
    $('#puzzle').hide();
    var queryURL = "";
    var indxNo = 0;

    //listen for user to pick category
    $('.lead').on('click', function(e){
        if(!catPicked){    
            catPicked = true;
            if(e.target.id === 'comp'){
                queryURL = compURL;
                $('#videogame').hide();
                // $('#videogame').addClass("disabled");
                // $('#videogame').attr('aria-disabled', true);
            }
            else if(e.target.id === 'videogame'){
                queryURL = vgameURL;
                $('#comp').hide();
                // $('#comp').addClass("disabled");
                // $('#comp').attr('aria-disabled', true);
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
            $('#correct').html(correct);
        }
        else{
            wrong++;
            $('#wrong').html(wrong);
        }

        resetRestartTimer();
        
    });

    function setTrivia(i){
        if(i < queArray.length){
            //empty both div
            $('.choices').empty();
            $('.question-area').empty();

            //convert 
            $('#missed').html(missed);
            //push all answer choices into an array
            //console.log("i :" +i);
            var choices = pushChoicesIntoArray(queArray[i]);
            //console.log(choices);
        
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
            clearInterval(setInt);
            clearInterval(counter);
            $()
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

