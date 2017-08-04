var alphabet = 'abcdefghijklmnopqrstuvwxyz'.split(''),
		puzzle = '',
		puzzleLetterContainers = [],
		previouslyChosen = '',
		totalIncorrect = 0,
		remainingBlanks = 0,
		puzzleList = [
	"buzz", "hive", "queen", "honey", "worker bee", "pollen", "nectar", "honeycomb", "royal jelly"
],
		hangmanParts = [
			'<circle stroke-width="10" stroke-miterlimit="10" cx="254.404" cy="174.26" r="29.412"/>',
'<line stroke-width="10" stroke-miterlimit="10" x1="254.404" y1="203.672" x2="254.404" y2="314.056"/>',
'<line stroke-width="10" stroke-miterlimit="10" x1="255.339" y1="311.094" x2="185.875" y2="406.468"/>',
'<line stroke-width="10" stroke-miterlimit="10" x1="323.46" y1="406.468" x2="253.996" y2="311.094"/>',
'<line stroke-width="10" stroke-miterlimit="10" x1="254.404" y1="229.409" x2="164.11" y2="256.834"/>',
'<line stroke-width="10" stroke-miterlimit="10" x1="254.404" y1="229.409" x2="344.699" y2="256.834"/>',
'<circle fill="#000000" cx="243.663" cy="169.333" r="3.667"/>',
'<circle fill="#000000" cx="265.663" cy="169.333" r="3.667"/>',
'<path stroke-width="4" stroke-miterlimit="10" d="M245.571,190.082c0-4.879,3.955-8.833,8.833-8.833 c4.879,0,8.833,3.955,8.833,8.833"/>'
		];

//add alphabet to div
alphabet.forEach((i) => {
    $('.hangman-letters').append(`<div>${i}</div>`);
	});

//set up initial puzzle
setUp();

//set up new puzzle when user clicks "start over"
$('#game-over-replay').click(function(){
	setUp();
});

//use the function that checks letters, then disable that letter and check if gameover
$('.hangman-letters div').click(function(){
	var isCorrect = letterChosen(this.innerHTML);
	if(isCorrect) $(this).addClass('disabled correct');
	else $(this).addClass('disabled');
	if(remainingBlanks < 1) {
		gameOver(true);
	}
	if(totalIncorrect >= hangmanParts.length + 1) {
		gameOver(false);
	}
});

//functions

//wipe variables and containers and set up new game
function setUp(){
  $('.game-over').hide();
	puzzle = newPuzzle();
	puzzleLetterContainers = [];
	previouslyChosen = '';
	totalIncorrect = 0;
	remainingBlanks = puzzle.length;
	$('.hangman-puzzle').html('');
	$('#added-parts').html('');
	$('.hangman-letters div').each(function(){
		this.classList = '';
	})

	puzzle.split('').forEach((i) => {
		var thisClass = "hangman-puzzle-letters";
		if(i == ' ') {
			thisClass += ' space';
			remainingBlanks--;
		}
		$('.hangman-puzzle').append(`<div class="${thisClass}">&nbsp;</div>`);
	});
	puzzleLetterContainers = document.getElementsByClassName('hangman-puzzle-letters');
}

//check if the letter is correct, then add it to the board
function letterChosen(letter) {
	if(previouslyChosen.indexOf(letter) < 0) {
		previouslyChosen+=letter;
		var checkResults = checkLetter(puzzle, letter);
		if(checkResults) {
			checkResults.forEach(function(item) {
				puzzleLetterContainers[item].innerHTML = letter;
				remainingBlanks--;
			});
			return true;
		}
		else {
			wrongAnswer(letter);
			return false;
		}
	}
}

//check submitted letter against puzzle and return false or every index of letter
function checkLetter(solution, thisLetter) {
	var indexes = [];
	solution.split('').forEach(function(item, index){
		if(item == thisLetter) {
			indexes.push(index);
		}
	});
	return indexes.length > 0 ? indexes : false;
}

//when answer is wrong, add to the hangman
function wrongAnswer(letter) {
	document.getElementById('added-parts').appendChild(parseSVG(hangmanParts[totalIncorrect]));
	totalIncorrect++;
}

//grab new puzzle from array
function newPuzzle() {
	var newPuzzle = puzzleList.splice(Math.floor(Math.random()*puzzleList.length), 1);
	return newPuzzle[0];
}

//svg parser from stackoverflow so I can just append new shapes to existing svg
function parseSVG(s) {
	var div= document.createElementNS('https://www.w3.org/1999/xhtml', 'div');
	div.innerHTML= '<svg xmlns="https://www.w3.org/2000/svg">'+s+'</svg>';
	var frag= document.createDocumentFragment();
	while (div.firstChild.firstChild)
		frag.appendChild(div.firstChild.firstChild);
	return frag;
}

//take true/false for win/lose and pop up the dialog/replay
function gameOver(won) {
	if(!won) {
		$('.game-over-lost').show();
		$('.game-over-won').hide();
		$('.hangman-puzzle-letters').each(function(index) {
			console.log($(this).html());
			if($(this).html() == "&nbsp;" && !$(this).hasClass("space")) {
				$(this).html(puzzle.charAt(index));
				$(this).addClass('game-lost');
			}
		});
	}
	else {
		$('.game-over-lost').hide();
		$('.game-over-won').show();
	}
	$('.game-over').show();
}
