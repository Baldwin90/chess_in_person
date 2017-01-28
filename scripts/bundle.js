/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var View = __webpack_require__(1);
	
	document.addEventListener('DOMContentLoaded', function () {
	  var mainEl = document.getElementsByClassName('main')[0];
	  new View(mainEl);
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Colors = __webpack_require__(2);
	var Board = __webpack_require__(3);
	var MoveResults = __webpack_require__(13);
	var Unicode = __webpack_require__(5);
	var Clock = __webpack_require__(15);
	
	var View = function View(mainEl) {
	  this.mainEl = mainEl;
	  createWinMessage.call(this);
	  createPawnConversionTab.call(this);
	
	  createTimeQuestion.call(this);
	  createClockDisplays.call(this);
	  this.chessBoardDisplay = mainEl.querySelector('.chess-board');
	  this.board = new Board();
	  setUp.call(this);
	  this.toMove = Colors.WHITE;
	  this.startPos = null;
	  this.squareClickDisabled = true;
	};
	
	function createClockDisplays() {
	  this.blackClockDisplay = document.createElement('div');
	  this.blackClockDisplay.className = 'just-moved-clock clock-display';
	
	  this.whiteClockDisplay = document.createElement('div');
	  this.whiteClockDisplay.className = 'to-move-clock clock-display';
	
	  this.mainEl.appendChild(this.whiteClockDisplay);
	  this.mainEl.appendChild(this.blackClockDisplay);
	}
	
	function createTimeQuestion() {
	  this.timeQuestionTab = document.createElement('div');
	  this.timeQuestionTab.className = 'time-question-tab';
	  this.timeQuestionTab.innerHTML = '<div class="time-question-container"><span class="time-choices"></span></div>';
	  var timeChoiceBox = this.timeQuestionTab.firstChild.firstChild;
	  var MINUTES = [5, 10, 15, 30];
	  timeChoiceBox.innerHTML = '<button class="time-choice">' + MINUTES[0] + ' minutes</button><button class="time-choice">' + MINUTES[1] + ' minutes</button><button class="time-choice">' + MINUTES[2] + ' minutes</button><button class="time-choice">' + MINUTES[3] + ' minutes</button>';
	  var timeChoices = timeChoiceBox.children;
	  timeChoices[0].onclick = this.setUpClock.bind(this, MINUTES[0]);
	  timeChoices[1].onclick = this.setUpClock.bind(this, MINUTES[1]);
	  timeChoices[2].onclick = this.setUpClock.bind(this, MINUTES[2]);
	  timeChoices[3].onclick = this.setUpClock.bind(this, MINUTES[3]);
	
	  var direction = document.createElement('span');
	  direction.innerHTML = 'Choose A Play Clock!';
	  direction.className = 'time-direction';
	
	  timeChoiceBox.appendChild(direction);
	
	  this.mainEl.appendChild(this.timeQuestionTab);
	}
	
	function createPawnConversionTab() {
	  this.pawnConversionTab = document.createElement('div');
	  this.pawnConversionTab.className = 'pawn-conversion-tab';
	  this.mainEl.appendChild(this.pawnConversionTab);
	
	  this.pawnConversionTab.innerHTML = '<span class="pawn-conversion-piece">' + Unicode.BLACK_ROOK + '</span><span class="pawn-conversion-piece">' + Unicode.BLACK_KNIGHT + '</span><span class="pawn-conversion-piece">' + Unicode.BLACK_BISHOP + '</span><span class="pawn-conversion-piece">' + Unicode.BLACK_QUEEN + '</span>';
	}
	
	function createWinMessage() {
	  var _this = this;
	
	  this.winMessage = document.createElement('div');
	  this.winMessage.className = 'win-message';
	
	  var winMessageContainer = document.createElement('div');
	  winMessageContainer.className = 'win-message-container';
	  this.winMessage.appendChild(winMessageContainer);
	
	  winMessageContainer.innerHTML = "<span class='close-message-button'>x</span><span class='message-content'></span>";
	  var closeButton = winMessageContainer.firstChild;
	  this.winMessageContent = winMessageContainer.lastChild;
	  closeButton.addEventListener('click', function () {
	    _this.winMessage.style.display = 'none';
	  });
	
	  this.mainEl.appendChild(this.winMessage);
	}
	
	function setUp() {
	  setUpBoard.call(this);
	}
	
	View.prototype.setUpClock = function (minutes) {
	  this.squareClickDisabled = false;
	  this.timeQuestionTab.style.display = 'none';
	  this.whiteClock = new Clock(minutes, this.renderWon.bind(this), this.whiteClockDisplay);
	  this.blackClock = new Clock(minutes, this.renderWon.bind(this), this.blackClockDisplay);
	
	  this.whiteClock.start();
	};
	
	View.prototype.switchClockRunning = function () {
	  this.whiteClock.toggleRunning();
	  this.blackClock.toggleRunning();
	};
	
	function setUpBoard() {
	  var html = '';
	  for (var i = 0; i < 8; i++) {
	    for (var j = 0; j < 8; j++) {
	      var square = document.createElement('li');
	      square.addEventListener('click', this.squareClick.bind(this, { row: i, col: j }));
	
	      if ((i + j) % 2 === 0) {
	        square.className = 'white';
	      } else {
	        square.className = 'black';
	      }
	
	      square.innerHTML = '<span></span>';
	      this.chessBoardDisplay.appendChild(square);
	    }
	  }
	
	  this.render();
	};
	
	View.prototype.render = function () {
	  this.board.renderPieces(this.chessBoardDisplay.querySelectorAll('span'));
	};
	
	View.prototype.squareClick = function (pos) {
	  if (this.squareClickDisabled === true) {
	    return;
	  }
	
	  if (this.startPos === null) {
	    return this.selectPiece(pos);
	  } else {
	    if (pos === this.startPos) {
	      this.unselectPiece();
	      this.render();
	    } else {
	      var moveResult = this.move(pos);
	      if (moveResult !== MoveResults.FAILURE && moveResult !== MoveResults.CHECKMATE && moveResult !== MoveResults.SUCCESS) {
	        //pawn promotions position was returned
	        this.render();
	        return this.demandPawnPromotion(moveResult);
	      }
	      if (moveResult === MoveResults.SUCCESS) {
	        this.renderMoveResult();
	      }
	      if (moveResult === MoveResults.CHECKMATE) {
	        this.renderMoveResult();
	        this.renderWon();
	      }
	      return moveResult;
	    }
	  }
	};
	
	View.prototype.renderMoveResult = function () {
	  this.switchClockRunning();
	  this.unselectPiece();
	  this.render();
	  this.changeToMove();
	  this.flipBoard();
	  this.flipClocks();
	};
	
	View.prototype.demandPawnPromotion = function (pos) {
	  this.squareClickDisabled = true;
	  var pieces = this.pawnConversionTab.children;
	  pieces[0].onclick = this.makePromotion.bind(this, pos, 'Rook');
	  pieces[1].onclick = this.makePromotion.bind(this, pos, 'Knight');
	  pieces[2].onclick = this.makePromotion.bind(this, pos, 'Bishop');
	  pieces[3].onclick = this.makePromotion.bind(this, pos, 'Queen');
	
	  this.pawnConversionTab.style.display = 'flex';
	};
	
	View.prototype.makePromotion = function (pos, chosenPiece) {
	  var moveResult = this.board.makePromotion(pos, chosenPiece);
	  this.pawnConversionTab.style.display = 'none';
	  this.renderMoveResult();
	  if (moveResult === MoveResults.CHECKMATE) {
	    return this.renderWon();
	  }
	
	  this.squareClickDisabled = false;
	};
	
	View.prototype.selectPiece = function (pos) {
	  var piece = this.board.getPiece(pos);
	  if (piece.color !== this.toMove) {
	    return 'invalid selection';
	  } else {
	    this.startPos = pos;
	    this.addSelectedClass(pos);
	    this.render();
	  }
	};
	
	View.prototype.unselectPiece = function () {
	  this.removeSelectedClass();
	  this.startPos = null;
	};
	
	View.prototype.addSelectedClass = function (pos) {
	  var squareIdx = pos.row * 8 + pos.col;
	  var square = this.chessBoardDisplay.children[squareIdx];
	
	  square.className += ' selected';
	};
	
	View.prototype.removeSelectedClass = function () {
	  var squareIdx = this.startPos.row * 8 + this.startPos.col;
	  var square = this.chessBoardDisplay.children[squareIdx];
	
	  var selectedMatch = new RegExp('(^|\\s)' + 'selected' + '(\\s|$)');
	  square.className = square.className.replace(selectedMatch, ' ');
	};
	
	View.prototype.move = function (endPos) {
	  //return successful move
	  var move_results = this.board.move(this.startPos, endPos);
	
	  return move_results;
	};
	
	View.prototype.changeToMove = function () {
	  this.toMove = this.toMove === Colors.WHITE ? Colors.BLACK : Colors.WHITE;
	};
	
	View.prototype.flipBoard = function () {
	  this.chessBoardDisplay.className = this.chessBoardDisplay.className === "chess-board" ? "chess-board black-to-move" : "chess-board";
	};
	
	View.prototype.flipClocks = function () {
	  this.whiteClockDisplay.className = this.whiteClockDisplay.className === "to-move-clock clock-display" ? "just-moved-clock clock-display" : "to-move-clock clock-display";
	  this.blackClockDisplay.className = this.blackClockDisplay.className === "to-move-clock clock-display" ? "just-moved-clock clock-display" : "to-move-clock clock-display";
	};
	
	View.prototype.renderWon = function () {
	  this.changeToMove();
	  var winner = this.toMove;
	  var message = winner + ' WINS!';
	  this.winMessageContent.innerHTML = message;
	  this.winMessage.style.display = 'block';
	  this.squareClickDisabled = true;
	};
	
	module.exports = View;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	var COLORS = {
	  BLACK: 'BLACK',
	  WHITE: 'WHITE'
	};
	
	module.exports = COLORS;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var NullPiece = __webpack_require__(4);
	var Bishop = __webpack_require__(6);
	var Knight = __webpack_require__(8);
	var Rook = __webpack_require__(9);
	var Pawn = __webpack_require__(10);
	var King = __webpack_require__(11);
	var Queen = __webpack_require__(12);
	var COLORS = __webpack_require__(2);
	var MoveResults = __webpack_require__(13);
	var HelperMethods = __webpack_require__(14);
	
	var Board = function Board() {
	  this.grid = new Array(8);
	
	  for (var rowIdx = 0; rowIdx < 8; rowIdx++) {
	    this.grid[rowIdx] = new Array(8);
	    for (var colIdx = 0; colIdx < 8; colIdx++) {
	      this.grid[rowIdx][colIdx] = new NullPiece({ row: rowIdx, col: colIdx });
	    }
	  }
	
	  this.whitePawns = [];
	  this.blackPawns = [];
	  placePawns.call(this, COLORS.BLACK, 1);
	  placePawns.call(this, COLORS.WHITE, 6);
	
	  placeMajors.call(this, COLORS.BLACK, 0);
	  placeMajors.call(this, COLORS.WHITE, 7);
	};
	
	Board.prototype.flattenedGrid = function () {
	  return Array.prototype.concat.apply([], this.grid);
	};
	
	function placePawns(color, rowIdx) {
	  var _this = this;
	
	  var pawnsArr = color === COLORS.WHITE ? this.whitePawns : this.blackPawns;
	
	  this.grid[rowIdx].forEach(function (_, colIdx) {
	    _this.grid[rowIdx][colIdx] = new Pawn(color, { row: rowIdx, col: colIdx }, _this);
	    pawnsArr.push(_this.grid[rowIdx][colIdx]);
	  });
	}
	
	Board.prototype.nullifyEnpassantOptions = function (colorJustMoved) {
	  var pawnsArr = colorJustMoved === COLORS.WHITE ? this.whitePawns : this.blackPawns;
	
	  pawnsArr.forEach(function (pawn) {
	    pawn.enpassantOption = null;
	  });
	};
	
	function placeMajors(color, rowIdx) {
	  this.grid[rowIdx][0] = new Rook(color, { row: rowIdx, col: 0 }, this);
	  this.grid[rowIdx][7] = new Rook(color, { row: rowIdx, col: 7 }, this);
	
	  this.grid[rowIdx][1] = new Knight(color, { row: rowIdx, col: 1 }, this);
	  this.grid[rowIdx][6] = new Knight(color, { row: rowIdx, col: 6 }, this);
	
	  this.grid[rowIdx][2] = new Bishop(color, { row: rowIdx, col: 2 }, this);
	  this.grid[rowIdx][5] = new Bishop(color, { row: rowIdx, col: 5 }, this);
	
	  this.grid[rowIdx][3] = new Queen(color, { row: rowIdx, col: 3 }, this);
	  this.grid[rowIdx][4] = new King(color, { row: rowIdx, col: 4 }, this);
	}
	
	Board.prototype.getPiece = function (pos) {
	  return this.grid[pos.row][pos.col];
	};
	
	Board.prototype.castle = function (king, endCoords) {
	  //need to return success failure or checkmate
	  if (king.color === COLORS.WHITE && endCoords.col === 6 && endCoords.row === 7 || king.color === COLORS.BLACK && endCoords.col === 6 && endCoords.row === 0) {
	    return this.kingSideCastle(king);
	  }
	  if (king.color === COLORS.WHITE && endCoords.col === 2 && endCoords.row === 7 || king.color === COLORS.BLACK && endCoords.col === 2 && endCoords.row === 0) {
	    return this.queenSideCastle(king);
	  }
	
	  return MoveResults.FAILURE;
	};
	
	Board.prototype.kingSideCastle = function (king) {
	  var kingRow = king.pos.row;
	
	  var rook = this.getPiece({ row: kingRow, col: 7 });
	  if (rook.hasMoved || king.hasMoved) {
	    return MoveResults.FAILURE;
	  }
	  var bishopSquare = this.getPiece({ row: kingRow, col: 5 });
	  var knightSquare = this.getPiece({ row: kingRow, col: 6 });
	
	  if (bishopSquare.constructor !== NullPiece || knightSquare.constructor !== NullPiece) {
	    return MoveResults.FAILURE;
	  }
	
	  if (this.isInCheck(king.color)) {
	    return MoveResults.FAILURE;
	  }
	
	  if (this.wouldBeInCheckAfterMove(king.pos, bishopSquare.pos)) {
	    return MoveResults.FAILURE;
	  }
	
	  if (this.wouldBeInCheckAfterMove(king.pos, knightSquare.pos)) {
	    return MoveResults.FAILURE;
	  }
	
	  this.movePiece(king, knightSquare.pos);
	  return this.actualMove(rook.pos, bishopSquare.pos);
	};
	
	Board.prototype.queenSideCastle = function (king) {
	  var kingRow = king.pos.row;
	  var rook = this.getPiece({ row: kingRow, col: 0 });
	  if (rook.hasMoved || king.hasMoved) {
	    return MoveResults.FAILURE;
	  }
	
	  var queenSquare = this.getPiece({ row: kingRow, col: 3 });
	  var bishopSquare = this.getPiece({ row: kingRow, col: 2 });
	  var knightSquare = this.getPiece({ row: kingRow, col: 1 });
	
	  if (bishopSquare.constructor !== NullPiece || knightSquare.constructor !== NullPiece || queenSquare.constructor !== NullPiece) {
	    return MoveResults.FAILURE;
	  }
	
	  if (this.isInCheck(king.color)) {
	    return MoveResults.FAILURE;
	  }
	
	  if (this.wouldBeInCheckAfterMove(king.pos, bishopSquare.pos)) {
	    return MoveResults.FAILURE;
	  }
	
	  if (this.wouldBeInCheckAfterMove(king.pos, queenSquare.pos)) {
	    return MoveResults.FAILURE;
	  }
	
	  this.movePiece(king, bishopSquare.pos);
	  return this.actualMove(rook.pos, queenSquare.pos);
	};
	
	Board.prototype.move = function (startCoords, endCoords) {
	  var movingPiece = this.getPiece(startCoords);
	
	  if (movingPiece.constructor === King && Math.abs(startCoords.col - endCoords.col) === 2 && startCoords.row === endCoords.row) {
	    return this.castle(movingPiece, endCoords);
	  }
	
	  if (this.isValidMove(movingPiece, endCoords)) {
	    return this.actualMove(startCoords, endCoords);
	  } else {
	
	    if (movingPiece.constructor === Pawn && Math.abs(startCoords.col - endCoords.col) === 1) {
	      return this.tryEnpassant(movingPiece, endCoords);
	    }
	
	    return MoveResults.FAILURE;
	  }
	};
	
	Board.prototype.tryEnpassant = function (pawn, endCoords) {
	  if (pawn.enpassantOption === null) {
	    return MoveResults.FAILURE;
	  }
	
	  if (HelperMethods.arePositionsEqual(endCoords, pawn.enpassantOption.move)) {
	    var pawnTaken = pawn.enpassantOption.targetPawn;
	    var pawnTakenPos = pawnTaken.pos;
	    this.grid[pawnTakenPos.row][pawnTakenPos.col] = new NullPiece(pawnTakenPos);
	
	    return this.actualMove(pawn.pos, endCoords);
	  } else {
	
	    return MoveResults.FAILURE;
	  }
	};
	
	Board.prototype.actualMove = function (startCoords, endCoords) {
	  var movingPiece = this.getPiece(startCoords);
	  movingPiece.hasMoved = true;
	  this.nullifyEnpassantOptions(movingPiece.color);
	
	  this.movePiece(movingPiece, endCoords);
	
	  if (movingPiece.constructor === Pawn) {
	    if (endCoords.row === 7 || endCoords.row === 0) {
	      return endCoords;
	    }
	
	    if (Math.abs(endCoords.row - startCoords.row) === 2) {
	      var targetRow = startCoords.row > endCoords.row ? endCoords.row + 1 : startCoords.row + 1;
	      this.giveEnpassantOption(targetRow, endCoords);
	    }
	  }
	
	  if (this.isInCheckMate(movingPiece.color)) {
	    return MoveResults.CHECKMATE;
	  }
	
	  return MoveResults.SUCCESS;
	};
	
	Board.prototype.giveEnpassantOption = function (targetRow, endCoords) {
	  var targetPawn = this.getPiece(endCoords);
	  if (endCoords.col > 0) {
	    var leftPiece = this.getPiece({ row: endCoords.row, col: endCoords.col - 1 });
	    if (leftPiece.constructor === Pawn && leftPiece.color !== targetPawn.color) {
	      leftPiece.enpassantOption = { targetPawn: targetPawn,
	        move: { row: targetRow, col: targetPawn.pos.col } };
	    }
	  }
	
	  if (endCoords.col < 7) {
	    var rightPiece = this.getPiece({ row: endCoords.row, col: endCoords.col + 1 });
	    if (rightPiece.constructor === Pawn && rightPiece.color !== targetPawn.color) {
	      rightPiece.enpassantOption = { targetPawn: targetPawn,
	        move: { row: targetRow, col: targetPawn.pos.col } };
	    }
	  }
	};
	
	Board.prototype.makePromotion = function (pos, piece) {
	  var pieceConstructor = this.determinePieceConstructor(piece);
	  var pawnToPromote = this.getPiece(pos);
	  this.grid[pos.row][pos.col] = new pieceConstructor(pawnToPromote.color, pos, this);
	  if (this.isInCheckMate(pawnToPromote.color)) {
	    return MoveResults.CHECKMATE;
	  } else {
	    return MoveResults.SUCCESS;
	  }
	};
	
	Board.prototype.determinePieceConstructor = function (piece) {
	  switch (piece) {
	    case 'Rook':
	      {
	        return Rook;
	      }
	    case 'Knight':
	      {
	        return Knight;
	      }
	    case 'Bishop':
	      {
	        return Bishop;
	      }
	    case 'Queen':
	      {
	        return Queen;
	      }
	  }
	};
	
	Board.prototype.isInCheckMate = function (checkingColor) {
	  var _this2 = this;
	
	  var checkedColor = checkingColor === COLORS.BLACK ? COLORS.WHITE : COLORS.BLACK;
	  if (!this.isInCheck(checkedColor)) {
	    return false;
	  }
	
	  var moves = this.movesByColor(checkedColor);
	  var hasAValidMove = !moves.some(function (move) {
	    return !_this2.wouldBeInCheckAfterMove(move.startCoords, move.endCoords);
	  });
	
	  return hasAValidMove;
	};
	
	Board.prototype.movePiece = function (movingPiece, endCoords) {
	  this.grid[movingPiece.pos.row][movingPiece.pos.col] = new NullPiece(movingPiece.pos);
	  movingPiece.pos = endCoords;
	  this.grid[endCoords.row][endCoords.col] = movingPiece;
	};
	
	Board.prototype.isValidMove = function (movingPiece, endCoords) {
	  if (!movingPiece.moves().some(function (move) {
	    return HelperMethods.arePositionsEqual(endCoords, move);
	  })) {
	    return false;
	  }
	
	  return !this.wouldBeInCheckAfterMove(movingPiece.pos, endCoords);
	};
	
	Board.prototype.wouldBeInCheckAfterMove = function (startCoords, endCoords) {
	  var toPlaceBack = this.getPiece(endCoords);
	  var movingPiece = this.getPiece(startCoords);
	  this.movePiece(movingPiece, endCoords);
	
	  var inCheckAfterMove = this.isInCheck(movingPiece.color);
	
	  this.movePiece(movingPiece, startCoords);
	  this.movePiece(toPlaceBack, endCoords);
	
	  return inCheckAfterMove;
	};
	
	Board.prototype.renderPieces = function (squares) {
	  this.grid.forEach(function (row, rowIdx) {
	    row.forEach(function (piece, colIdx) {
	      var squareIdx = 8 * rowIdx + colIdx;
	      squares[squareIdx].innerHTML = piece.symbol;
	    });
	  });
	};
	
	Board.prototype.isInRange = function (pos) {
	  if (pos.row < 0 || pos.row > 7 || pos.col < 0 || pos.col > 7) {
	    return false;
	  } else {
	    return true;
	  }
	};
	
	Board.prototype.isInCheck = function (checkedColor) {
	  var checkingColor = checkedColor === COLORS.BLACK ? COLORS.WHITE : COLORS.BLACK;
	  var checkingMoves = this.movesByColor(checkingColor);
	  var checkedKing = this.findKingByColor(checkedColor);
	
	  return checkingMoves.some(function (move) {
	    return HelperMethods.arePositionsEqual(move.endCoords, checkedKing.pos);
	  });
	};
	
	Board.prototype.movesByColor = function (color) {
	  var squares = this.flattenedGrid();
	  var totalMovesByColor = squares.reduce(function (totalMoves, square) {
	    if (square.color === color) {
	      var endCoords = square.moves();
	      var moves = endCoords.map(function (endCoord) {
	        return { startCoords: square.pos, endCoords: endCoord };
	      });
	
	      totalMoves = totalMoves.concat(moves);
	    }
	    return totalMoves;
	  }, []);
	
	  return totalMovesByColor;
	};
	
	Board.prototype.findKingByColor = function (color) {
	  var squares = this.flattenedGrid();
	  for (var i = 0; i < squares.length; i++) {
	    if (squares[i].constructor === King && squares[i].color === color) {
	      return squares[i];
	    }
	  }
	};
	
	module.exports = Board;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var ChessUnicode = __webpack_require__(5);
	var Colors = __webpack_require__(2);
	
	var NullPiece = function NullPiece(pos) {
	  this.symbol = '';
	  this.color = 'none';
	  this.pos = pos;
	};
	
	NullPiece.prototype.moves = function () {
	  return [];
	};
	
	module.exports = NullPiece;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';
	
	var Unicode = {
	  WHITE_KING: '&#9812',
	  WHITE_QUEEN: '&#9813',
	  WHITE_ROOK: '&#9814',
	  WHITE_BISHOP: '&#9815',
	  WHITE_KNIGHT: '&#9816',
	  WHITE_PAWN: '&#9817',
	  BLACK_KING: '&#9818',
	  BLACK_QUEEN: '&#9819',
	  BLACK_ROOK: '&#9820',
	  BLACK_BISHOP: '&#9821',
	  BLACK_KNIGHT: '&#9822',
	  BLACK_PAWN: '&#9823'
	};
	
	module.exports = Unicode;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var ChessUnicode = __webpack_require__(5);
	var Colors = __webpack_require__(2);
	var Deltas = __webpack_require__(7);
	
	var Bishop = function Bishop(color, pos, board) {
	  this.color = color;
	  this.pos = pos;
	  this.board = board;
	  setUnicode.call(this);
	  this.deltas = Deltas.DIAGONALS;
	};
	
	Bishop.prototype.moves = Deltas.slidingMoves;
	
	Bishop.prototype.checkDirection = Deltas.checkDirection;
	
	function setUnicode() {
	  if (this.color === Colors.BLACK) {
	    this.symbol = ChessUnicode.BLACK_BISHOP;
	  } else {
	    this.symbol = ChessUnicode.WHITE_BISHOP;
	  }
	}
	
	module.exports = Bishop;

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';
	
	var Deltas = {
	  DIAGONALS: [{ row: -1, col: -1 }, { row: 1, col: 1 }, { row: -1, col: 1 }, { row: 1, col: -1 }],
	  NOTDIAGONALS: [{ row: 0, col: -1 }, { row: 0, col: 1 }, { row: -1, col: 0 }, { row: 1, col: 0 }],
	  slidingMoves: function slidingMoves() {
	    var _this = this;
	
	    var moves = [];
	
	    this.deltas.forEach(function (delta) {
	      _this.checkDirection(moves, delta);
	    });
	
	    return moves;
	  },
	  checkDirection: function checkDirection(moves, delta) {
	    var newMove = {};
	    newMove.row = this.pos.row + delta.row;
	    newMove.col = this.pos.col + delta.col;
	    while (this.board.isInRange(newMove)) {
	      var piece = this.board.getPiece(newMove);
	      if (piece.color === 'none') {
	        moves.push(newMove);
	      } else if (piece.color === this.color) {
	        return moves;
	      } else {
	        moves.push(newMove);
	        return moves;
	      }
	
	      var nextNewMove = {
	        row: newMove.row + delta.row,
	        col: newMove.col + delta.col
	      };
	      newMove = nextNewMove;
	    }
	  },
	
	  steppingMoves: function steppingMoves() {
	    var moves = [];
	    this.stepDeltas.forEach(function (delta) {
	      var newMove = { row: this.pos.row + delta.row, col: this.pos.col + delta.col };
	      if (!this.board.isInRange(newMove)) {
	        return;
	      }
	      var targetSquare = this.board.getPiece(newMove);
	      if (targetSquare.color !== this.color) {
	        moves.push(newMove);
	      }
	    }, this);
	
	    return moves;
	  }
	};
	
	module.exports = Deltas;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var ChessUnicode = __webpack_require__(5);
	var Colors = __webpack_require__(2);
	var Deltas = __webpack_require__(7);
	
	var Knight = function Knight(color, pos, board) {
	  this.color = color;
	  this.pos = pos;
	  this.board = board;
	  setUnicode.call(this);
	  this.stepDeltas = [{ row: -2, col: 1 }, { row: -2, col: -1 }, { row: 2, col: 1 }, { row: 2, col: -1 }, { row: -1, col: 2 }, { row: 1, col: 2 }, { row: -1, col: -2 }, { row: 1, col: -2 }];
	};
	
	Knight.prototype.moves = Deltas.steppingMoves;
	
	function setUnicode() {
	  if (this.color === Colors.BLACK) {
	    this.symbol = ChessUnicode.BLACK_KNIGHT;
	  } else {
	    this.symbol = ChessUnicode.WHITE_KNIGHT;
	  }
	}
	
	module.exports = Knight;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var ChessUnicode = __webpack_require__(5);
	var Colors = __webpack_require__(2);
	var Deltas = __webpack_require__(7);
	
	var Rook = function Rook(color, pos, board) {
	  this.color = color;
	  this.pos = pos;
	  this.board = board;
	  this.hasMoved = false;
	  setUnicode.call(this);
	  this.deltas = Deltas.NOTDIAGONALS;
	};
	
	Rook.prototype.moves = Deltas.slidingMoves;
	
	Rook.prototype.checkDirection = Deltas.checkDirection;
	
	function setUnicode() {
	  if (this.color === Colors.BLACK) {
	    this.symbol = ChessUnicode.BLACK_ROOK;
	  } else {
	    this.symbol = ChessUnicode.WHITE_ROOK;
	  }
	}
	
	module.exports = Rook;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var ChessUnicode = __webpack_require__(5);
	var Colors = __webpack_require__(2);
	
	var Pawn = function Pawn(color, pos, board) {
	  this.color = color;
	  this.enpassantOption = null;
	  this.pos = pos;
	  this.board = board;
	  this.hasMoved = false;
	  this.firstMoveDelta = { row: 0, col: 0 };
	  this.delta = { row: 0, col: 0 };
	  this.killDeltas = [{ row: 0, col: 1 }, { row: 0, col: -1 }];
	
	  if (this.color === Colors.BLACK) {
	    this.delta.row++;
	    this.firstMoveDelta.row += 2;
	    this.killDeltas.forEach(function (killDelta) {
	      killDelta.row++;
	    });
	  } else {
	    this.delta.row--;
	    this.firstMoveDelta.row -= 2;
	    this.killDeltas.forEach(function (killDelta) {
	      killDelta.row--;
	    });
	  }
	  setUnicode.call(this);
	};
	
	Pawn.prototype.moves = function () {
	  var moves = [];
	
	  this.pushKillMoves(moves);
	
	  var frontMove = {
	    row: this.pos.row + this.delta.row,
	    col: this.pos.col + this.delta.col
	  };
	  var inFront = this.board.getPiece(frontMove);
	  if (inFront.color !== 'none') {
	    return moves;
	  }
	
	  moves.push(frontMove);
	
	  if (this.hasMoved === false) {
	    this.pushJumpMove(moves);
	  }
	
	  return moves;
	};
	
	Pawn.prototype.pushKillMoves = function (moves) {
	  var _this = this;
	
	  this.killDeltas.forEach(function (killDelta) {
	    var newMove = {
	      row: _this.pos.row + killDelta.row,
	      col: _this.pos.col + killDelta.col
	    };
	
	    if (!_this.board.isInRange(newMove)) {
	      return;
	    }
	    var targetSquare = _this.board.getPiece(newMove);
	    if (targetSquare.color !== 'none' && targetSquare.color !== _this.color) {
	      moves.push(newMove);
	    }
	  });
	  return moves;
	};
	
	Pawn.prototype.pushJumpMove = function (moves) {
	  var jumpMove = {
	    row: this.pos.row + this.firstMoveDelta.row,
	    col: this.pos.col + this.firstMoveDelta.col
	  };
	
	  var twoAhead = this.board.getPiece(jumpMove);
	  if (twoAhead.color !== 'none') {
	    return moves;
	  } else {
	    moves.push(jumpMove);
	    return moves;
	  }
	};
	
	function setUnicode() {
	  if (this.color === Colors.BLACK) {
	    this.symbol = ChessUnicode.BLACK_PAWN;
	  } else {
	    this.symbol = ChessUnicode.WHITE_PAWN;
	  }
	}
	
	module.exports = Pawn;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var ChessUnicode = __webpack_require__(5);
	var Colors = __webpack_require__(2);
	var Deltas = __webpack_require__(7);
	
	var King = function King(color, pos, board) {
	  this.color = color;
	  this.pos = pos;
	  this.board = board;
	  this.hasMoved = false;
	  setUnicode.call(this);
	  this.stepDeltas = [{ row: 1, col: -1 }, { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 0, col: -1 }, { row: 0, col: 1 }, { row: -1, col: -1 }, { row: -1, col: 0 }, { row: -1, col: 1 }];
	};
	
	King.prototype.moves = Deltas.steppingMoves;
	
	function setUnicode() {
	  if (this.color === Colors.BLACK) {
	    this.symbol = ChessUnicode.BLACK_KING;
	  } else {
	    this.symbol = ChessUnicode.WHITE_KING;
	  }
	}
	
	module.exports = King;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var ChessUnicode = __webpack_require__(5);
	var Colors = __webpack_require__(2);
	var Deltas = __webpack_require__(7);
	
	var Queen = function Queen(color, pos, board) {
	  this.color = color;
	  this.pos = pos;
	  this.board = board;
	  setUnicode.call(this);
	  this.deltas = Deltas.DIAGONALS.concat(Deltas.NOTDIAGONALS);
	};
	
	Queen.prototype.moves = Deltas.slidingMoves;
	
	Queen.prototype.checkDirection = Deltas.checkDirection;
	
	function setUnicode() {
	  if (this.color === Colors.BLACK) {
	    this.symbol = ChessUnicode.BLACK_QUEEN;
	  } else {
	    this.symbol = ChessUnicode.WHITE_QUEEN;
	  }
	}
	
	module.exports = Queen;

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';
	
	var MOVE_RESULTS = {
	  SUCCESS: 'successful move',
	  FAILURE: 'invalid move',
	  CHECKMATE: 'checkmate'
	};
	
	module.exports = MOVE_RESULTS;

/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";
	
	var HelperMethods = {
	  arePositionsEqual: function arePositionsEqual(pos1, pos2) {
	    return pos1.row === pos2.row && pos1.col === pos2.col;
	  }
	};
	
	module.exports = HelperMethods;

/***/ },
/* 15 */
/***/ function(module, exports) {

	"use strict";
	
	var Clock = function Clock(minutes, renderWon, clockDisplay) {
	  //need 15:00 to render.  try to do this in her
	  this.seconds = minutes * 60;
	  this.renderWon = renderWon;
	  this.isRunning = false;
	  this.clockDisplay = clockDisplay;
	  this.renderDisplay();
	};
	
	Clock.prototype.start = function () {
	  var _this = this;
	
	  this.isRunning = true;
	  this.intervalId = setInterval(function () {
	    _this.seconds--;
	    _this.checkForExpiration();
	    _this.renderDisplay();
	  }, 1000);
	};
	
	Clock.prototype.toggleRunning = function () {
	  if (this.isRunning) {
	    this.stop();
	  } else {
	    this.start();
	  }
	};
	
	Clock.prototype.stop = function () {
	  this.isRunning = false;
	  clearInterval(this.intervalId);
	};
	
	Clock.prototype.renderDisplay = function () {
	  var minutes = Math.floor(this.seconds / 60);
	  var seconds = this.seconds % 60;
	
	  var minutesString = minutes > 0 ? "" + minutes : "" + 0;
	  var secondsString = seconds > 9 ? "" + seconds : "0" + seconds;
	  var displayString = minutesString + ":" + secondsString;
	
	  this.clockDisplay.innerHTML = displayString;
	};
	
	Clock.prototype.checkForExpiration = function () {
	  if (this.seconds <= 0) {
	    this.stop();
	    this.renderWon();
	  }
	};
	
	module.exports = Clock;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map