// start slingin' some d3 here.
// var watchout = d3.select('#watchout');
// var width = parseInt(d3.select('div.board').style('width'), 10);
// var height = parseInt(d3.select('div.board').style('height'), 10);

// Set watchout SVG height and width to equal current board
// watchout.style('width', '' + width + 'px').style('height', '' + height + 'px');

var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 30,
  padding: 20
};

var gameStats = {
  score: 0,
  bestScore: 0
};

var axes = {
  x: d3.scaleLinear().domain([0, 100]).range([0, gameOptions.width]),
  y: d3.scaleLinear().domain([0, 100]).range([0, gameOptions.height])
};

var gameBoard = d3.select('.board')
                .append('svg:svg')
                .attr('width', gameOptions.width)
                .attr('height', gameOptions.height);

var updateScore = function() {
  d3.select('.current span').text(gameStats.score.toString());
};

var updateBestScore = function() {
  gameStats.bestScore = _.max([gameStats.bestScore, gameStats.score]);
  d3.select('.highscore span').text(gameStats.bestScore.toString());
};