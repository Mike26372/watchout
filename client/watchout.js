// start slingin' some d3 here.
// var watchout = d3.select('#watchout');
// var width = parseInt(d3.select('div.board').style('width'), 10);
// var height = parseInt(d3.select('div.board').style('height'), 10);

// Set watchout SVG height and width to equal current board
// watchout.style('width', '' + width + 'px').style('height', '' + height + 'px');
// window.require = require;
// var d3 = require('d3');
// var d3 = require('d3');
// var d3Selection = require('d3-selection');
// import * as d3 from 'lib/d3.node.js';

var pi = 3.14159;

var gameOptions = {
  height: 450,
  width: 700,
  enemies: 30,
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
    this.x = 350;
    this.y = 225;
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
      return this.x = minX;
    }
    if (x >= maxX) {
      return this.x = maxX;
    }
    return this.x = x;
  }
  setY (y) {
    var minY = this.gameOptions.padding;
    var maxY = this.gameOptions.height - this.gameOptions.padding;
    if (y <= minY) {
      return this.y = minY;
    }
    if (y >= maxY) {
      return this.y = maxY;
    }
    return this.y = y;
  }
  transform (opts) {
    this.angle = opts.angle || this.angle;
    this.setX(opts.x || this.x);
    this.setY(opts.y || this.y);
    return this.el.attr('transform', `rotate(${this.angle}, ${this.getX()}, ${this.getY()}) translate(${this.getX()}, ${this.getY()})`);
  }
  moveAbsolute (x, y) {
    return this.transform(x, y);
  }
  moveRelative (dx, dy) {
    return this.transform({x: this.getX() + dx, y: this.getY() + dy, angle: 360 * ( Math.atan2(dy, dx) / (pi * 2) )});
  }
  setupDragging () {
    var context;
    
    context = window.players[0];
    
    var dragMove = function () {
      // this.moveRelative.call(this, d3.event.dx, d3.event.dy);
      context = window.players[0];
      context.moveRelative(d3.event.dx, d3.event.dy);
    };
    var drag = d3.drag().on('drag', dragMove);
    return this.el.call(drag);
  }
}

var players = [];
players.push(new Player(gameOptions).render(gameBoard));

var createEnemies = function () {
  return _.range(0, gameOptions.enemies).map(function(value) {
    return {
      id: value,
      x: Math.random() * 100,
      y: Math.random() * 100
    };
  });
};

var render = function (enemyData) {
  var enemies;
  enemies = gameBoard.selectAll('circle.enemy').data(enemyData, (data) => data.id);
  
  enemies.enter().append('svg:circle')
                  .attr('class', 'enemy')
                  .attr('cx', (enemy) => axes.x(enemy.x))
                  .attr('cy', (enemy) => axes.y(enemy.y))
                  .attr('r', 0);

  enemies.exit().remove();

  var checkCollision = function(enemy, collidedCallback) {
    return _(players).each(function(player) {
      var radiusSum, xDiff, yDiff, separation;
      radiusSum = parseFloat(enemy.attr('r')) + player.r;
      xDiff = parseFloat(enemy.attr('x') + player.x);
      yDiff = parseFloat(enemy.attr('y') + player.y);

      separation = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
      if (separation < radiusSum) {
        return collidedCallback(player, enemy);
      }
    });
  };

  var onCollision = function() {
    updateBestScore();
    gameStats.score = 0;
    updateScore();
  };

  var tweenWithCollisionDetection = function (endData) {
    var enemy = d3.select(this);
    
    var startPos = {
      x: parseFloat(enemy.attr('cx')),
      y: parseFloat(enemy.attr('cy'))
    };

    var endPos = {
      x: axes.x(endData.x),
      y: axes.y(endData.y)
    };

    return function(t) {
      var enemyNextPos;
      checkCollision(enemy, onCollision);
      enemyNextPos = {
        x: startPos.x + (endPos.x - startPos.x) * t,
        y: startPos.y + (endPos.y - startPos.y) * t
      };
      return enemy.attr('cx', enemyNextPos.x).attr('cy', enemyNextPos.y);
    };
  };

  return enemies.transition()
                .duration(500)
                .attr('r', 10)
                .transition()
                .duration(2000)
                .tween('custom', tweenWithCollisionDetection);
};

var play = function() {
  var gameTurn = function() {
    var newEnemyPositions = createEnemies();
    render(newEnemyPositions); 
  };

  var increaseScore = function() {
    gameStats.score++;
    updateScore();
  };

  gameTurn();
  setInterval(gameTurn, 2000);
  setInterval(increaseScore, 50);
};

play();





