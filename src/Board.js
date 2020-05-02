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

    //time complexity: O(n)

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

    //time complexity: O(n)

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

    //time complexity: O(n)

    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      //count set to 0
      var count = 0;
      //loop through rows
      for (var i = 0; i < this.rows().length; i++) {
        //this.get(i) to get row, check first row index against majorDiagonalColumnIndexAtFirstRow plus 2nd row index, make true or false if truthy/falsey, increment count as incrementing forst row index
        !!this.get(i)[majorDiagonalColumnIndexAtFirstRow + i] && count++;
        //increment count
        //count++;
      }
      //if count is more than 1, return true, else return false //return count>1
      // if (count > 1) {
      //   return true;
      // }
      return count > 1;
    },

    //time complexity for initial implementation: O(n2)
    //time complexity for final: O(n)

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
       //loop through this.rows(), but start at -this.rows() length to account for diagonals index at first row spaces off board
       for (var i = this.rows().length * -1; i < this.rows().length; i++) {
        //if conflict at i, return true, else return false
        if (this.hasMajorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false;
    },

    //time complexity for initial implementation: O(n2)
    //time complexity for final: O(n)

    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
       //same as major, but subtract i from column index @ 1st row
      //count set to 0
      var count = 0;
      //loop through rows
      for (var i = 0; i < this.rows().length; i++) {
        //this.get(i) to get row, check first row index against majorDiagonalColumnIndexAtFirstRow plus 2nd row index, make true or false if truthy/falsey, increment count as incrementing forst row index
        !!this.get(i)[minorDiagonalColumnIndexAtFirstRow - i] && count++;
        //increment count
        //count++;
      }
      //if count is more than 1, return true, else return false
      // if (count > 1) {
      //   return true;
      // }
      return count > 1;
    },

    //time complexity for initial implementation: O(n2)
    //time complexity for final: O(n)

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      //same as major, but loop starting at this.rows().length * 2 and decrement while looping
      //loop through this.rows(), but start at -this.rows() length to account for diagonals index at first row spaces off board
      for (var i = this.rows().length * 2; i > 0; i--) {
        //if conflict at i, return true, else return false
        if (this.hasMinorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false;
    }

    //time complexity for initial implementation: O(n2)
    //time complexity for final: O(n)

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
