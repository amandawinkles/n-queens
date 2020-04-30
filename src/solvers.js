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

  // create and insert into containing array: n arrays of n length containing all 0's (i.e., a blank board)
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

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  // number of solutions for 1 <= n <= 8: 1, 2, 6, 24, 120, 720, 5040, 40320
  // e.g., for n = 3: [1, 0, 0]  [0, 0, 1]  [1, 0, 0]  [0, 0, 1]  [0, 1, 0]  [0, 1, 0]
  //                  [0, 1, 0]  [0, 1, 1]  [0, 0, 1]  [1, 0 ,0]  [1, 0, 0]  [0, 0, 1]
  //                  [0, 0, 1]  [1, 0, 0]  [0, 1, 0]  [0, 1, 0]  [0, 0, 1]  [1, 0, 0]

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

  // collection of unique rook solutions
  let allRookSolutions = [];

  // a n-rook solution
  let rookSolution;

  // generate solutions until all possible solutions have been found:
  while (allRookSolutions.length < MaxNumSolutions[n]) {

    // generate a solution
    rookSolution = JSON.stringify(findNRooksSolution(n));

    // determine if solution has already been generated:
    let isUnique = true;
    for (let i = 0; i < allRookSolutions.length; i++) {
      if (rookSolution === allRookSolutions[i]) {
        isUnique = false;
        break;
      }
    }

    // add to collection of unique solutions if solution is unique
    if (isUnique) {
      allRookSolutions.push(rookSolution);
    }
  }

  console.log('Number of solutions for ' + n + ' rooks:', allRookSolutions.length);
  return allRookSolutions.length;
};

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

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(board));
  //return board
  return board;
};

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

  console.log('Number of solutions for ' + n + ' queens:', allQueenSolutions.length);
  //return solutionCount or allQueenSolutions.length
  return allQueenSolutions.length;
};
