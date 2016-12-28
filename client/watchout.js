// start slingin' some d3 here.
var watchout = d3.select('#watchout');
var width = parseInt(d3.select('div.board').style('width'), 10);
var height = parseInt(d3.select('div.board').style('height'), 10);

// Set watchout SVG height and width to equal current board
watchout.style('width', '' + width + 'px').style('height', '' + height + 'px');

var numEnemies = 10;