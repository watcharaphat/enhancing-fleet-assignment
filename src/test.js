var rockPaperScissors = function(rounds) {
  rounds = rounds || 3;
  var outcomes = [];
  var thrown = [];
  var plays = ['rock', 'paper', 'scissors'];
  
  var combos = function(roundsToGo) {
    // no more rounds to play, return solution array for current round
    if (roundsToGo === 0) {
      outcomes.push(thrown.slice()); // push copy of solution onto outcomes
      return;
    }
    
    for (var i = 0; i < plays.length; i++) {
      thrown.push(plays[i]); // push first play into thrown sandbox
      combos(roundsToGo - 1);  // recursion
      thrown.pop(); // head back up
    }
  };

  combos(rounds); // recursive work-routine

  return outcomes;
};

console.log(rockPaperScissors(3));
