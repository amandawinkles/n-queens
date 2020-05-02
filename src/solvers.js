/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other
window.findNRooksSolution = function(n) {
  // rook solution: each row or column contains no more than 1 rook
  // e.g. for n = 4: [[1, 0 ,0 , 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]

  // an container array to hold n arrays of n length each
  let solution = [];

  // create and insert into containing array: n arrays of n length containing all 0's (i.e., a blank board) //can create new board instance, then call this.rows()
  for (let i = 0; i < n; i++) {
    let row = new Array(n);
    for (let j = 0; j < n; j++) {
      row[j] = 0;
    }
    solution.push(row);
  }

  // randomize a sequence of n integers to use as column indices for rooks in each of n rows
  let randIndices = [];
  while (randIndices.length < n) {
    // generate random number between 0 and n - 1
    let randIndex = Math.floor(Math.random() * n);
    // collect num if not already present
    if (!randIndices.includes(randIndex)) {
      randIndices.push(randIndex);
    }
  }

  // insert rook pieces (i.e., 1's) into blank board at randomly generated column indices
  for (let k = 0; k < n; k++) {
    let index = randIndices[k];
    solution[k][index] = 1;
  }

  //console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};
//can use: hasAnyRooksConflicts, togglePiece, backtracking
//time complexity for initial implementation: O(n2)

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
// version 2: uses tree data structure (takes ~ 1 minute for n = 8)
window.countNRooksSolutions = function(n) {
  // counter for number of found solutions
  let solutionCount = 0;

  // table for maximum number of nxn chessboards that exist that contain n rooks not in conflict
  const MaxNumSolutions = {
    '1': 1,
    '2': 2,
    '3': 6,
    '4': 24,
    '5': 120,
    '6': 720,
    '7': 5040,
    '8': 40320
  };

  // a tree to store a collection of 'flattened' matrices
  // e.g., for n = 3:
  // matrices:
  //        [1, 0, 0]  [0, 0, 1]  [1, 0, 0]  [0, 0, 1]  [0, 1, 0]  [0, 1, 0]
  //        [0, 1, 0]  [0, 1, 0]  [0, 0, 1]  [1, 0 ,0]  [1, 0, 0]  [0, 0, 1]
  //        [0, 0, 1]  [1, 0, 0]  [0, 1, 0]  [0, 1, 0]  [0, 0, 1]  [1, 0, 0]
  // 'flattened' matrices:
  //        [0, 1, 2]  [2, 1, 0]  [0, 2, 1]  [2, 0, 1]  [1, 0, 2]  [1, 2, 0]
  // tree of 'flattened' matrices
  //                             [0, 1, 2]
  //                    [1, 2]     [0, 2]     [0, 1]
  //               [2]    [1]    [2]    [0]    [1]    [0]
  //              false  false  false  false  false  false
  let solutionTree = function (n) {
    let node = {};
    node.value = n;
    node.row = [];
    _.extend(node, solutionTreeMethods);
    return node;
  };

  // solutionTree methods
  let solutionTreeMethods = {
    // add new node to tree
    add: function(n) {
      this.row.push(solutionTree(n));
    },
    // search tree to determine if solution is new
    isNewSolution: function(colIndices) {
      let isNewMatrix = false;
      let iterateNodes = function(node, indices) {
        // return true if this solution has not been found before, return false if has already been found
        if (node.row[0].value === false) {
          node.row[0].value = true;
          isNewMatrix = true;
          return;
        } else {
          for (let i = 0; i < node.row.length; i++) {
            if (node.row[i].value === indices[0]) {
              iterateNodes(node.row[i], indices.slice(1));
            }
          }
        }
      };
      iterateNodes(this, colIndices);
      return isNewMatrix;
    },
    // create tree representing all possible n rook solutions
    build: function(colIndices) {
      for (let i = 0; i < colIndices.length; i++) {
        this.add(colIndices[i]);
        let colArray = colIndices.slice();
        colArray.splice(i, 1);
        colArray.length ? this.row[i].build(colArray) : this.row[i].add(false);
      }
    }
  };

  // an array to hold top row nodes of tree
  let matricesArray = [];

  // create a tree containing all permutations of an nxn board with n rooks not in conflict
  let nArray = _.range(n);
  for (let i = 0; i < nArray.length; i++) {
    // add node to top row of tree with one column index
    let newNode = solutionTree(nArray[i]);
    matricesArray.push(newNode);
    // build out branch with the remaining possible column indices
    if (nArray.length > 1) {
      let colArray = nArray.slice();
      colArray.splice(i, 1);
      newNode.build(colArray);
    } else {
      newNode.add(false);
    }
  }

  // repeat until max number of unique matrices are found
  while (solutionCount < MaxNumSolutions[n]) {

    // generate matrix for a nxn board and n-rooks not in conflict
    let rookMatrix = findNRooksSolution(n);

    // flatten matrix to an array of n elements where indices are rows and values are column indices
    // e.g., for n = 3: [0, 1, 0]
    //                  [1, 0, 0]  =>  [1, 0, 2]
    //                  [0, 0, 1]
    let flattenMatrix = [];
    for (let i = 0; i < rookMatrix.length; i++) {
      flattenMatrix.push(rookMatrix[i].indexOf(1));
    }

    // compare to collection of unique matrices
    for (let i = 0; i < matricesArray.length; i++) {
      // search tree when 1st row column index of flattened rook matrix matches value of matricesArray node
      if (matricesArray[i].value === flattenMatrix[0]) {
        // only one solution is possible for n of 1
        // OR
        // remove 1st element (i.e., 1st row column index) from flattenMatrix and search the branch from this node
        if (matricesArray.length === 1 || matricesArray[i].isNewSolution(flattenMatrix.slice(1))) {
          // increment number of found solutions if this matrix has not been generated
          solutionCount++;
        }
      }
    }
  }
  return solutionCount;
};

//time complexity for initial implementation: O(n2)


// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  //get one solution for nxn array/matrix
  //new board instance w/value {'n': n}
  let board;
  //call findNRooksSolution, check if hasAnyQueensConflicts
  //else if conflict, run findNRooksSolution again, use new solution output
  //if n doesn't equal 2 or 3, do..while, else return empty board as solution
  if (n !== 2 && n !== 3) {
    do {
      board = new Board(findNRooksSolution(n));
    } while (board.hasAnyQueensConflicts());
  } else {
    board = new Board({n: n});
  }
  //if no conflicts, or if n equals 2 or 3, solution found
  //convert board to matrix w/arrays
  board = board.rows();

  //console.log('Single solution for ' + n + ' queens:', JSON.stringify(board));
  //return board
  return board;
};

//time complexity for initial implementation:


// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  // table for maximum number of nxn chessboards that exist that contain n queens not in conflict
  const MaxNumQueenSolutions = {
    '0': 1,
    '1': 1,
    '2': 0,
    '3': 0,
    '4': 2,
    '5': 10,
    '6': 4,
    '7': 40,
    '8': 92
  };

  //do same as above, but collect NRooks solution sets for n to find NQueens
  //create count variable set to 0
  //create solutions array set to empty
  let allQueenSolutions = [];

  // generate solutions until all possible solutions have been found:
  while (allQueenSolutions.length < MaxNumQueenSolutions[n]) {
    // generate a solution
    let queenSolution = findNRooksSolution(n);
    let queenBoard = new Board(queenSolution);
    //check if queens conflict
    if (!queenBoard.hasAnyQueensConflicts()) {
      queenSolution = JSON.stringify(queenSolution);

      // determine if solution has already been generated for queens:
      let isUnique = true;
      for (let i = 0; i < allQueenSolutions.length; i++) {
        if (queenSolution === allQueenSolutions[i]) {
          isUnique = false;
          break;
        }
      }
      // add to collection of unique solutions if solution is unique
      if (isUnique) {
        allQueenSolutions.push(queenSolution);
      }
    }
  }

  //console.log('Number of solutions for ' + n + ' queens:', allQueenSolutions.length);
  //return solutionCount or allQueenSolutions.length
  return allQueenSolutions.length;
};

//time complexity for initial implementation:
