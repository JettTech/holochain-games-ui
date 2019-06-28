
/*========= global variables =========================*/

// Checker Piece Selection
const square_class = document.getElementsByClassName("square");
const white_checker_class = document.getElementsByClassName("white_checker");
const black_checker_class = document.getElementsByClassName("black_checker");
const table = document.getElementById("table");
const score = document.getElementById("score");
const black_background = document.getElementById("black_background");

// View Port Dimensions
const windowHeight = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;  ;
const windowWidth =  window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;
const moveLength = 80 ;
const moveDeviation = 10;
const Dimension = 1;
const selectedPiece,selectedPieceindex;
const upRight,upLeft,downLeft,downRight;
const counter = 0
const gameOver = 0;
const bigScreen = 1;

// Game Moves
const block = [];
const w_checker = [];
const b_checker = [];
const the_checker ;
const oneMove;
const anotherMove;
const mustAttack = false;
const multiplier = 1

const tableLimit,reverse_tableLimit ,  moveUpLeft,moveUpRight, moveDownLeft,moveDownRight , tableLimitLeft, tableLimitRight;


/*===============================  Create Game Canvas =================================*/
	getDimension();
	if(windowWidth > 640){
		moveLength = 80;
		moveDeviation = 10;
	}
	else{
		moveLength = 50;
		moveDeviation = 6;
	}
/*================================*/
  for (const i = 1; i <=64; i++)
  	block[i] =new square_p(square_class[i],i);


    function getDimension (){
    	counter ++;
     windowHeight = window.innerHeight
    	|| document.documentElement.clientHeight
    	|| document.body.clientHeight;  ;
     windowWidth =  window.innerWidth
    	|| document.documentElement.clientWidth
    	|| document.body.clientWidth;
    }

    document.getElementsByTagName("BODY")[0].onresize = function(){
    	getDimension();
    	const cpy_bigScreen = bigScreen ;

    if(windowWidth < 650){
    		moveLength = 50;
    		moveDeviation = 6;
    		if(bigScreen == 1) bigScreen = -1;
    	}
    if(windowWidth > 650){
    		moveLength = 80;
    		moveDeviation = 10;
    		if(bigScreen == -1) bigScreen = 1;
    	}

    	if(bigScreen !=cpy_bigScreen){
    	for(let i = 1; i <= 12; i++){
    		b_checker[i].setCoord(0,0);
    		w_checker[i].setCoord(0,0);
    	}
    	}
    }

/*==================== Create Checkerboard Layout ========================*/
	// white checkers on board
for (let i = 1; i <= 4; i++){
	w_checker[i] = new checker(white_checker_class[i], "white", 2*i -1 );
	w_checker[i].setCoord(0,0);
	block[2*i - 1].ocupied = true;
	block[2*i - 1].pieceId =w_checker[i];
}

for (let i = 5; i <= 8; i++){
	w_checker[i] = new checker(white_checker_class[i], "white", 2*i );
	w_checker[i].setCoord(0,0);
	block[2*i].ocupied = true;
	block[2*i].pieceId = w_checker[i];
}

for (let i = 9; i <= 12; i++){
	w_checker[i] = new checker(white_checker_class[i], "white", 2*i - 1 );
	w_checker[i].setCoord(0,0);
	block[2*i - 1].ocupied = true;
	block[2*i - 1].pieceId = w_checker[i];
}

// black checkers on board
for (let i = 1; i <= 4; i++){
	b_checker[i] = new checker(black_checker_class[i], "black", 56 + 2*i  );
	b_checker[i].setCoord(0,0);
	block[56 +  2*i ].ocupied = true;
	block[56+  2*i ].pieceId =b_checker[i];
}

for (let i = 5; i <= 8; i++){
	b_checker[i] = new checker(black_checker_class[i], "black", 40 +  2*i - 1 );
	b_checker[i].setCoord(0,0);
	block[ 40 + 2*i - 1].ocupied = true;
	block[ 40 + 2*i - 1].pieceId = b_checker[i];
}

for (let i = 9; i <= 12; i++){
	b_checker[i] = new checker(black_checker_class[i], "black", 24 + 2*i  );
	b_checker[i].setCoord(0,0);
	block[24 + 2*i ].ocupied = true;
	block[24 + 2*i ].pieceId = b_checker[i];
}
/*========================================================*/


/*===================== Determines Checker Token Type (Basic v King) ==================*/
const square_p = function(square,index){
	this.id = square;
	this.ocupied = false;
	this.pieceId = undefined;
	this.id.onclick = function() {
		makeMove(index);
	}
}

const checker = function(piece,color,square) {
	this.id = piece;
	this.color = color;
	this.king = false;
	this.ocupied_square = square;
	this.alive = true;
	this.attack = false;
	if(square%8){
		this.coordX= square%8;
		this.coordY = Math.floor(square/8) + 1 ;
	}
	else{
		this.coordX = 8;
		this.coordY = square/8 ;
	}
	this.id.onclick = function  () {
		showMoves(piece);
	}
}

checker.prototype.setCoord = function(X,Y){
	const x = (this.coordX - 1  ) * moveLength + moveDeviation;
	const y = (this.coordY - 1 ) * moveLength  + moveDeviation;
	this.id.style.top = y + 'px';
	this.id.style.left = x + 'px';
}

checker.prototype.changeCoord = function(X,Y){
	this.coordY +=Y;
	this.coordX += X;
}

checker.prototype.checkIfKing = function () {
	if(this.coordY == 8 && !this.king &&this.color == "white"){
		this.king = true;
		this.id.style.border = "4px solid #FFFF00";
	}
	if(this.coordY == 1 && !this.king &&this.color == "black"){
		this.king = true;
		this.id.style.border = "4px solid #FFFF00";
	}
}

/////////////////////////////////////////////////////////////////////
/*================ Checker Selection ==============*/
the_checker = w_checker;

function showMoves (piece) {
	const match = false;
	mustAttack = false;
	if(selectedPiece){
			erase_roads(selectedPiece);
	}
	selectedPiece = piece;
	const i,j;
	for ( j = 1; j <= 12; j++){
		if(the_checker[j].id == piece){
			i = j;
			selectedPieceindex = j;
			match = true;
		}
	}

	if(oneMove && !attackMoves(oneMove)){
		changeTurns(oneMove);
		oneMove = undefined;
		return false;
	}
	if(oneMove && oneMove != the_checker[i] ){
		return false;
	}
	if(!match) {
	 return 0 ;
	}

	if(the_checker[i].color =="white"){
		tableLimit = 8;
		tableLimitRight = 1;
		tableLimitLeft = 8;
		moveUpRight = 7;
		moveUpLeft = 9;
		moveDownRight = - 9;
		moveDownLeft = -7;
	}
	else{
		tableLimit = 1;
		tableLimitRight = 8;
		tableLimitLeft = 1;
		moveUpRight = -7;
		moveUpLeft = -9;
		moveDownRight = 9;
		moveDownLeft = 7;
	}
//////////////////////  GAME ACTION MOVES ////////////////////////////////////
		attackMoves(the_checker[i]);

	/*======= action verification table =====*/
 	if(!mustAttack){
 	  downLeft = checkMove( the_checker[i] , tableLimit , tableLimitRight , moveUpRight , downLeft);
		downRight = checkMove( the_checker[i] , tableLimit , tableLimitLeft , moveUpLeft , downRight);
		if(the_checker[i].king){
			upLeft = checkMove( the_checker[i] , reverse_tableLimit , tableLimitRight , moveDownRight , upLeft);
			upRight = checkMove( the_checker[i], reverse_tableLimit , tableLimitLeft , moveDownLeft, upRight)
		}
	}
	if(downLeft || downRight || upLeft || upRight){
			return true;
		}
	return false;
}

function erase_roads(piece){
	if(downRight) block[downRight].id.style.background = "#BA7A3A";
	if(downLeft) block[downLeft].id.style.background = "#BA7A3A";
	if(upRight) block[upRight].id.style.background = "#BA7A3A";
	if(upLeft) block[upLeft].id.style.background = "#BA7A3A";
}

/*============= Take New Action=====*/
function makeMove (index) {
	const isMove = false;
	if(!selectedPiece)
		return false;
	if(index != upLeft && index != upRight && index != downLeft && index != downRight){
		erase_roads(0);
		selectedPiece = undefined;
		return false;
	}

	if(the_checker[1].color=="white"){
		cpy_downRight = upRight;
		cpy_downLeft = upLeft;
		cpy_upLeft = downLeft;
		cpy_upRight = downRight;
	}
	else{
		cpy_downRight = upLeft;
		cpy_downLeft = upRight;
		cpy_upLeft = downRight;
		cpy_upRight = downLeft;
	}

	if(mustAttack)
		multiplier = 2;
	else
		multiplier = 1;

		if(index == cpy_upRight){
			isMove = true;
			if(the_checker[1].color=="white"){
				executeMove( multiplier * 1, multiplier * 1, multiplier * 9 );
				if(mustAttack) eliminateCheck(index - 9);
			}
			else{
				executeMove( multiplier * 1, multiplier * -1, multiplier * -7);
				if(mustAttack) eliminateCheck( index + 7 );
			}
		}

		if(index == cpy_upLeft){
			isMove = true;
			if(the_checker[1].color=="white"){
				executeMove( multiplier * -1, multiplier * 1, multiplier * 7);
			 	if(mustAttack)	eliminateCheck(index - 7 );
			}
			else{
				executeMove( multiplier * -1, multiplier * -1, multiplier * -9);
				if (mustAttack) eliminateCheck( index + 9 );
			}
		}

		if(the_checker[selectedPieceindex].king){
			if(index == cpy_downRight){
				isMove = true;
				if(the_checker[1].color=="white"){
					executeMove( multiplier * 1, multiplier * -1, multiplier * -7);
					if(mustAttack) eliminateCheck ( index  + 7) ;
				}
				else{
					executeMove( multiplier * 1, multiplier * 1, multiplier * 9);
					if(mustAttack) eliminateCheck ( index  - 9) ;
				}
			}

		if(index == cpy_downLeft){
			isMove = true;
				if(the_checker[1].color=="white"){
					executeMove( multiplier * -1, multiplier * -1, multiplier * -9);
					if(mustAttack) eliminateCheck ( index  + 9) ;
				}
				else{
					executeMove( multiplier * -1, multiplier * 1, multiplier * 7);
					if(mustAttack) eliminateCheck ( index  - 7) ;
				}
			}
		}

	erase_roads(0);
	the_checker[selectedPieceindex].checkIfKing();

	if (isMove) {
			anotherMove = undefined;
		 if(mustAttack) {
			 	anotherMove = attackMoves(the_checker[selectedPieceindex]);
		 }
		if (anotherMove){
			oneMove = the_checker[selectedPieceindex];
			showMoves(oneMove);
		}
		else{
			oneMove = undefined;
		 	changeTurns(the_checker[1]);
		 	gameOver = checkIfLost();
		 	if(gameOver) { setTimeout( declareWinner(),3000 ); return false};
		 	gameOver = checkForMoves();
		 	if(gameOver) { setTimeout( declareWinner() ,3000) ; return false};
		}
	}
}

/*=========== Game Action/Move Functions ======*/
function executeMove (X,Y,nSquare){
	the_checker[selectedPieceindex].changeCoord(X,Y);
	the_checker[selectedPieceindex].setCoord(0,0);
	block[the_checker[selectedPieceindex].ocupied_square].ocupied = false;
	block[the_checker[selectedPieceindex].ocupied_square + nSquare].ocupied = true;
	block[the_checker[selectedPieceindex].ocupied_square + nSquare].pieceId = 	block[the_checker[selectedPieceindex].ocupied_square ].pieceId;
	block[the_checker[selectedPieceindex].ocupied_square ].pieceId = undefined;
	the_checker[selectedPieceindex].ocupied_square += nSquare;

}

function checkMove(Apiece,tLimit,tLimit_Side,moveDirection,theDirection){
	if(Apiece.coordY != tLimit){
		if(Apiece.coordX != tLimit_Side && !block[ Apiece.ocupied_square + moveDirection ].ocupied){
			block[ Apiece.ocupied_square + moveDirection ].id.style.background = "#704923";
			theDirection = Apiece.ocupied_square + moveDirection;
		}
	else
			theDirection = undefined;
	}
	else
		theDirection = undefined;
	return theDirection;
}

function  checkAttack( check , X, Y , negX , negY, squareMove, direction){
	if(check.coordX * negX >= 	X * negX && check.coordY *negY <= Y * negY && block[check.ocupied_square + squareMove ].ocupied && block[check.ocupied_square + squareMove].pieceId.color != check.color && !block[check.ocupied_square + squareMove * 2 ].ocupied){
		mustAttack = true;
		direction = check.ocupied_square +  squareMove*2 ;
		block[direction].id.style.background = "#704923";
		return direction ;
	}
	else
		direction =  undefined;
		return direction;
}

function eliminateCheck(indexx){
	if(indexx < 1 || indexx > 64)
		return  0;

	const x =block[ indexx ].pieceId ;
	x.alive =false;
	block[ indexx ].ocupied = false;
	x.id.style.display  = "none";
}


function attackMoves(ckc){
 		upRight = undefined;
 		upLeft = undefined;
 		downRight = undefined;
 		downLeft = undefined;

 	if(ckc.king ){
 		if(ckc.color == "white"){
			upRight = checkAttack( ckc , 6, 3 , -1 , -1 , -7, upRight );
			upLeft = checkAttack( ckc, 3 , 3 , 1 , -1 , -9 , upLeft );
		}
		else{
	 		downLeft = checkAttack( ckc , 3, 6, 1 , 1 , 7 , downLeft );
			downRight = checkAttack( ckc , 6 , 6 , -1, 1 ,9 , downRight );
		}
	}
	if(ckc.color == "white"){
	 	downLeft = checkAttack( ckc , 3, 6, 1 , 1 , 7 , downLeft );
		downRight = checkAttack( ckc , 6 , 6 , -1, 1 ,9 , downRight );
	}
	else{
		upRight = checkAttack( ckc , 6, 3 , -1 , -1 , -7, upRight );
		upLeft = checkAttack( ckc, 3 , 3 , 1 , -1 , -9 , upLeft );
	}

 	if(ckc.color== "black" && (upRight || upLeft || downLeft || downRight ) ) {
	 	const p = upLeft;
	 	upLeft = downLeft;
	 	downLeft = p;

	 	p = upRight;
	 	upRight = downRight;
	 	downRight = p;

	 	p = downLeft ;
	 	downLeft = downRight;
	 	downRight = p;

	 	p = upRight ;
	 	upRight = upLeft;
	 	upLeft = p;
 	}
 	if(upLeft != undefined || upRight != undefined || downRight != undefined || downLeft != undefined){
 		return true;

 	}
 	return false;
}

function changeTurns(ckc){
		if(ckc.color=="white")
	the_checker = b_checker;
else
	the_checker = w_checker;
 }

function checkIfLost(){
	let i;
	for(i = 1 ; i <= 12; i++)
		if(the_checker[i].alive)
			return false;
	return true;
}

function  checkForMoves(){
	let i ;
	for(i = 1 ; i <= 12; i++)
		if(the_checker[i].alive && showMoves(the_checker[i].id)){
			erase_roads(0);
			return false;
		}
	return true;
}

function declareWinner(){
	black_background.style.display = "inline";
	score.style.display = "block";
0
if(the_checker[1].color == "white")
	score.innerHTML = "Black wins";
else
	score.innerHTML = "Red wins";
}
