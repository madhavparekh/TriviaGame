const compURL = 'https://opentdb.com/api.php?amount=20&category=18'; //computer
const vgameURL = 'https://opentdb.com/api.php?amount=20&category=15'; //videogame

var correct = 0;
var missed = 0;
var wrong = 0;
var timmer; //setInterval
var catPicked = false;
var indxNo = 0;
var correctAns = "";
var queArray; //holds questions (api.results) array

$(document).ready(function(){
    var queryURL = "";
            
    //listen for user to pick category
    $('.lead').on('click', function(e){
        if(!catPicked){    
            catPicked = true;
            if(e.target.id === 'comp'){
                queryURL = compURL;
                $('#videogame').addClass("disabled");
                $('#videogame').attr('aria-disabled', true);
            }
            else if(e.target.id === 'videogame'){
                queryURL = vgameURL;
                $('#comp').addClass("disabled");
                $('#comp').attr('aria-disabled', true);
            }
            
            //If category picked, fetch 20 questions
            if(catPicked){
                $.ajax({
                    url: queryURL,
                    method: "GET"
                }).then(function(r){
                    console.log(r);
                    queArray = r.results;
                    
                    //go thru question array
                    //queArray.forEach(e => {
                    timmer = setInterval(setTrivia, 10000)
                        // if(indxNo < queArray.length){
                        //     //empty both div
                        //     $('.choices').empty();
                        //     $('.question-area').empty();
                        //     //push all answer choices into an array
                        //     var choices = pushChoicesIntoArray(queArray[indxNo]);
                        //     console.log(choices);
                        
                        //     //display que # and que in div .question-area
                        //     var que = $('<h4>').html('Question ' +(indxNo + 1)+ ' : ' +queArray[indxNo].question);
                        //     $('.question-area').append(que).append('<hr>');

                        //     //create button for each choices and attach to .choices
                        //     $('.choices').append('<h5>Here are your choices. Click one :</h5>');
                        //     choices.forEach(e => {
                        //         var btn = $('<button>').addClass('btn btn-dark m-2 mx-3').html(e);
                        //         $('.choices').append(btn);

                        //     });
                        //     indxNo++;
                        // }
                    
                });
            }
        }
        else{
            alert('Category already been picked! Finish or Reset the game')
        }
    });

    function setTrivia(){
        if(indxNo < queArray.length){
            //empty both div
            $('.choices').empty();
            $('.question-area').empty();
            $('#missed').html(missed);
            //push all answer choices into an array
            var choices = pushChoicesIntoArray(queArray[indxNo]);
            console.log(choices);
        
            //display que # and que in div .question-area
            var que = $('<h4>').html('Question ' +(indxNo + 1)+ ' : ' +queArray[indxNo].question);
            $('.question-area').append(que).append('<hr>');

            //create button for each choices and attach to .choices
            $('.choices').append('<h5>Here are your choices. Click one :</h5>');
            choices.forEach(e => {
                var btn = $('<button>').addClass('btn btn-dark m-2 mx-3').html(e);
                $('.choices').append(btn);

            });
            indxNo++;
        }
    }

    //listen on answer btn click
    $('.choices').on('click', '.btn', function(e){
        var userChoice = $(this).text();
        console.log('user choice: ' +userChoice);
        
        clearInterval(timmer);
        
        if(userChoice === correctAns){
            correct++;
            $('#correct').html(correct);
        }
        else{
            wrong++;
            $('#wrong').html(wrong);
        }
        
        timmer = setInterval(setTrivia, 10000);
    });
});

function pushChoicesIntoArray(que){
    var ansChoices = [];
    //store correct_answer into correctAns (global) push correct answer into array
    correctAns = que.correct_answer;
    ansChoices.push(que.correct_answer);
    //push incorrect answers
    var incAns = que.incorrect_answers;

    incAns.forEach(e => {
        ansChoices.push(e);
    });
    
    //suffle array so correct ans is not always the first and return
    return ansChoices.sort(() => Math.random() - 0.5);

}

