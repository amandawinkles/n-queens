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
  // number of unique solutions for 1 <= n <= 9: 1, 1, 2, 6, 24, 120, 720, 5040, 40320
  // e.g., for n = 3: [1, 0, 0]  [1, 0, 0]
  //                  [0, 1, 0]  [0, 0, 1]
  //                  [0, 0, 1]  [0, 1, 0]

  // counter for number of generated nxn chessboards containing n rooks not in conflict
  let solutionCount = 0;

  // table for maximum number of nxn chessboards that exist that contain n rooks not in conflict
  const NumSolutions = {
    '1': 1,
    '2': 1,
    '3': 2,
    '4': 6,
    '5': 24,
    '6': 120,
    '7': 720,
    '8': 5040,
    '9': 40320
  };

  // maximum number of unique solutions
  let numUniqueSolutions = NumSolutions[n];

  // collection of unique solutions
  let uniqueSolutions = [];

  // generate solutions until all possible solutions have been found:
  while (solutionCount < numUniqueSolutions) {
    // (1) generate a solution matrix
    let oneSolution = findNRooksSolution(n);
    let oneSolutionVariants = [];


    // perform symmetry operations (reflection, rotation) to create solution variants
    // rotation: 0˚, 90˚, 180˚, 270˚ and 1 reflection for each rotation (8 variants per solution)
    // rotation(90˚) = top row becomes end column
    // reflection = top row becomes bottom row
    let reflection = [];
    let rotation = [];
    let symmetryCount = 0;

    // build out rotation matrix
    for (let i = 0; i < oneSolution.length; i++) {
      rotation.push([]);
      for (let j = 0; j < oneSolution.length; j++) {
        rotation[i].push(0);
      }
    }



    // rotate matrix by 90˚
    let rotationOperation = function (matrix) {
      // make a 90˚ rotation on matrix and add to collection of variants
      for (let j = 0; j < matrix.length; j++) {
        for (let k = 0; k < matrix[j].length; k++) {
          rotation[k][matrix.length - (j + 1)] = matrix[j][k];
        }
      }
      oneSolutionVariants.push(JSON.stringify(rotation));

      reflectionOperation(rotation);

      symmetryCount++;

      if (symmetryCount < 3) {
        rotationOperation(rotation);
      } else {
        return;
      }
    };

    // reflect matrix
    let reflectionOperation = function (matrix) {
      // reflect matrix and add to collection of variants
      for (let i = matrix.length - 1; i >= 0; i--) {
        reflection.push(matrix[i]);
      }
      oneSolutionVariants.push(JSON.stringify(reflection));

      // reset reflection matrix
      reflection = [];
    };

    // add 0˚ rotation to collection of variants
    oneSolutionVariants.push(JSON.stringify(oneSolution));

    // reflect 0˚ rotation and to collection of variants
    reflectionOperation(oneSolution);

    // make rotation and reflection variants on original matrix
    rotationOperation(oneSolution);


    // (2) determine if solution has already been generated:
    let isUnique = true; // trigger to stop comparisons
    for (let i = 0; i < uniqueSolutions.length; i++) {
      // get a unique solution
      let unique = uniqueSolutions[i];
      if (isUnique) {
        for (let j = 0; j < oneSolutionVariants.length; j++) {
          let variant = oneSolutionVariants[j];
          // stop comparing solution variants when solution not unique
          if (unique === variant) {
            isUnique = false;
            break;
          }
        }
      } else {
        // stop comparing solution variants when solution not unique
        break;
      }
    }


    // (3) if solution is unique:
    if (isUnique) {
      // add to collection of unique solutions
      uniqueSolutions.push(JSON.stringify(oneSolution));
      // increment counter of unique solutions
      solutionCount++;
    }

  }

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = undefined; //fixme

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
