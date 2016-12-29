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
                .attr('width', gameOptions.width + 'px')
                .attr('height', gameOptions.height + 'px');

var updateScore = function() {
  d3.select('.current span').text(gameStats.score.toString());
};

var updateBestScore = function() {
  gameStats.bestScore = _.max([gameStats.bestScore, gameStats.score]);
  d3.select('.highscore span').text(gameStats.bestScore.toString());
};

class Player {
  constructor(gameOptions) {
    this.gameOptions = gameOptions;
    this.path = 'm-7.5,1.62413c0,-5.04095 4.08318,-9.12413 9.12414,-9.12413c5.04096,0 9.70345,5.53145 11.87586,9.12413c-2.02759,2.72372 -6.8349,9.12415 -11.87586,9.12415c-5.04096,0 -9.12414,-4.08318 -9.12414,-9.12415z';
    this.fill = '#ff6600';
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.r = 5;

  }
  render (to) {
    this.el = to.append('svg:path').attr('d', this.path).attr('fill', this.fill);
    this.transform ({ x: this.gameOptions.width * 0.5, y: this.gameOptions.height * 0.5 });
    this.setupDragging();
    return this;
    // CHECK IF ANYTHING NEEDS TO BE PASSED TO SETUPDRAGGING
  }
  getX () {
    return this.x;
  }
  getY () {
    return this.y;
  }
  setX (x) {
    var minX = this.gameOptions.padding;
    var maxX = this.gameOptions.width - this.gameOptions.padding;
    if (x <= minX) {
      this.x = minX;
    }
    if (x >= maxX) {
      this.x = maxX;
    }
  }
  setY (y) {
    var minY = this.gameOptions.padding;
    var maxY = this.gameOptions.height - this.gameOptions.padding;
    if (y <= minY) {
      this.y = minY;
    }
    if (y >= maxY) {
      this.y = maxY;
    }
  }
  transform (opts) {

  }
  moveAbsolute (x, y) {

  }
  moveRelative (dx, dy) {

  }
  setupDragging () {
    var dragMove = this.moveRelative(d3.event.dx, d3.event.dy);
    var drag = d3.behavior.drag().on('drag', dragMove);
    this.el.call(drag);
  }
}





