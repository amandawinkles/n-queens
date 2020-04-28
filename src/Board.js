// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


    /*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

    */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      // has conflict if rowIndex sums to greater than 1
      let sum = this.get(rowIndex).reduce((acc, cur) => acc + cur);
      return sum > 1;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      // get number of rows for this board
      let numRows = this.get('n');

      // has conflict if any row sums to greater than 1
      for (let i = 0; i < numRows; i++) {
        if (this.hasRowConflictAt(i)) {
          return true;
        }
      }
      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      // get number of rows for this board
      let numRows = this.get('n');

      // has conflict if colIndex across all rows sums to greater than 1
      let sum = 0;
      for (let i = 0; i < numRows; i++) {
        sum += this.get(i)[colIndex];
      }

      return sum > 1;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      // get number of columns for this board
      let numCols = this.get('n');

      // has conflict if any col sums to greater than 1
      for (let i = 0; i < numCols; i++) {
        if (this.hasColConflictAt(i)) {
          return true;
        }
      }
      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      // get number of rows/cols for this board
      let numRows = this.get('n');
      let numCols = numRows;

      // sum values across a major diagonal
      let majorIndex = majorDiagonalColumnIndexAtFirstRow; // majorIndex = col_index - row_index
      let sum = 0;
      // rows = index 'i'; cols = index 'j'
      for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
          if (j - i === majorIndex) {
            // get(n) returns an array of length n representing the nth row
            sum += this.get(i)[j];
          }
        }
      }

      // has conflict if major diagonal sums to greater than 1
      return sum > 1;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      // get number of rows/cols for this board
      let numRowsCols = this.get('n');

      // rows = index 'i'; cols = index 'j'
      for (let i = 0; i < numRowsCols; i++) {
        for (let j = 0; j < numRowsCols; j++) {
          let majorIndex = j - i; // majorIndex = col_index - row_index
          // has conflict if any major diagonal sums to greater than 1
          if (this.hasMajorDiagonalConflictAt(majorIndex)) {
            return true;
          }
        }
      }
      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      // get number of rows/cols for this board
      let numRowsCols = this.get('n');

      // sum values across a minor diagonal
      let minorIndex = minorDiagonalColumnIndexAtFirstRow; // minorIndex = col_index + row_index
      let sum = 0;
      // rows = index 'i'; cols = index 'j'
      for (let i = 0; i < numRowsCols; i++) {
        for (let j = 0; j < numRowsCols; j++) {
          if (j + i === minorIndex) {
            sum += this.get(i)[j];
          }
        }
      }

      // has conflict if minor diagonal sums to greater than 1
      return sum > 1;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      // get number of rows/cols for this board
      let numRowsCols = this.get('n');

      // rows = index 'i'; cols = index 'j'
      for (let i = 0; i < numRowsCols; i++) {
        for (let j = 0; j < numRowsCols; j++) {
          let minorIndex = j + i; // minorIndex = col_index + row_index
          // has conflict if any minor diagonal sums to greater than 1
          if (this.hasMinorDiagonalConflictAt(minorIndex)) {
            return true;
          }
        }
      }
      return false;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
