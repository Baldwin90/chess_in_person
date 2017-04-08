# Chess In Person
[Chess In Person](https://osandoval42.github.io/local_chess/)

Chess In Person is a front end web application facilitating two friends to play the greatest game in history side by side.  All features including Castling, Pawn Promotion, and [En Passant](https://en.wikipedia.org/wiki/En_passant) are included.  The state of the game is maintained in Object Oriented fashion and rendered after each move via React.js.

## Implementation

Each type of `Piece` keeps track of its position on the `Board`, whose state is represented by an 8 row by 8 column matrix.  A piece can generate its potential moves at any given moment and likewise a color can determine all its potential moves by summing up all the potential moves of its pieces.

![](https://github.com/osandoval42/local_chess/blob/master/screenshots/castling.png "Game")

Excluding Enpassant and Castling, when a move is attempted the board first checks that the move is valid before actually committing the move.  Until a move is actually committed, the player to move won't be changed and the UI won't re-render:

```javascript
  if (this.isValidMove(movingPiece, endCoords)){
    return this.actualMove(startCoords, endCoords);
  }
```

A move is valid if it is indeed one of the pieces potential moves at that moment, and if the move would not leave the player in check.  To determine if the move would leave the player in check, the board executes the move in question and calls `isInCheck` (a function also used to determine checkmate) before finally restoring the board to its previous state.  

```javascript
Board.prototype.isValidMove = function(movingPiece, endCoords){
  if (!movingPiece.moves().some((move) => {
    return HelperMethods.arePositionsEqual(endCoords, move);
  })){
    return false;
  }

  return !this.wouldBeInCheckAfterMove(movingPiece.pos, endCoords);
}

Board.prototype.wouldBeInCheckAfterMove = function(startCoords, endCoords){
  const toPlaceBack = this.getPiece(endCoords);
  const movingPiece = this.getPiece(startCoords);
  this.movePiece(movingPiece, endCoords);

  const inCheckAfterMove = this.isInCheck(movingPiece.color);

  this.movePiece(movingPiece, startCoords);
  this.movePiece(toPlaceBack, endCoords)

  return inCheckAfterMove;
}
```

At any given point `isInCheck` can determine whether a player is in check by finding the location of the King, and asking if any of the opposing player's potential moves are equal to that location.  Similarly, `isInCheckmate` (which must be called after every move to decide if the game is over), will ask if the player to move is in check, and if so, ask if any of his or her potential moves would change this.

```javascript
Board.prototype.isInCheckMate = function(checkingColor){
  const checkedColor = checkingColor === COLORS.BLACK ? COLORS.WHITE : COLORS.BLACK;
  if (!this.isInCheck(checkedColor)){
    return false;
  }

  const moves = this.movesByColor(checkedColor);
  const hasNoValidMove = !moves.some((move) =>{
    return !this.wouldBeInCheckAfterMove(move.startCoords, move.endCoords)
  })

  return hasNoValidMove;
};
```

### Castling

![](https://github.com/osandoval42/local_chess/blob/master/screenshots/game.png "Game")

To castle, in addition to the usual constraint that the king not be in check post-move, it must also be the case that the king is not currently in check, that the spaces between the castle and the king are not potential moves of the opposing player, and that the king and castle have not yet moved.

```javascript
Board.prototype.kingSideCastle = function(king){
  let kingRow = king.pos.row

  let rook = this.getPiece({row: kingRow, col: 7});
  if (rook.hasMoved || king.hasMoved){
    return MoveResults.FAILURE;
  }
  let bishopSquare = this.getPiece({row: kingRow, col: 5})
  let knightSquare = this.getPiece({row: kingRow, col: 6})

  if (bishopSquare.constructor !== NullPiece || knightSquare.constructor!== NullPiece){
    return MoveResults.FAILURE;
  }

  if (this.isInCheck(king.color)){
    return MoveResults.FAILURE;
  }

  if (this.wouldBeInCheckAfterMove(king.pos, bishopSquare.pos)){
    return MoveResults.FAILURE;
  }

  if (this.wouldBeInCheckAfterMove(king.pos, knightSquare.pos)){
    return MoveResults.FAILURE;
  }

  this.movePiece(king, knightSquare.pos);
  return this.actualMove(rook.pos, bishopSquare.pos);
}
```

### En Passant

On commiting a move, if the rules justify, a player grants the opposing player the right to enpassant on the next move only.  Likewise, any right to en passant previously had is forfeited.

```javascript
  this.nullifyEnpassantOptions(movingPiece.color);

  this.movePiece(movingPiece, endCoords);

  if (movingPiece.constructor === Pawn){
    if (endCoords.row === 7 || endCoords.row === 0){
      return endCoords;
    }

    if (Math.abs(endCoords.row - startCoords.row) === 2){
      let targetRow = startCoords.row > endCoords.row ? (endCoords.row + 1) : (startCoords.row + 1);
      this.giveEnpassantOption(targetRow, endCoords);
    }
  }
```
## Author

Oscar Sandoval
