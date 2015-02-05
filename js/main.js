/**
 * Game Of life
 * @author AlgusDark
 * @version 3.0
 */

var App = App || {};

App.GameOfLife = function(){
    /**
     * Creates a new Cell.
     * @class
     */
    function Cell() {
      this.neighbors = 0;
    }

  	/**
  	 * Creates a new Live Cell.
  	 * @class
  	 */
  	function LiveCell() {Cell.call(this);}
    LiveCell.prototype = Object.create(Cell.prototype);
    LiveCell.prototype.constructor = LiveCell;
    LiveCell.prototype.toInt = function() {return 1;};
    LiveCell.prototype.life = function(x,y) {
      var dead = new DeadCell();
      var gen = [dead, dead, this, this, dead, dead, dead, dead, dead]
      return gen[this.neighbors];
    };


  	/**
  	 * Creates a new Dead Cell.
  	 * @class
  	 */
  	function DeadCell() {Cell.call(this);}
    DeadCell.prototype = Object.create(Cell.prototype);
    DeadCell.prototype.constructor = DeadCell;
    DeadCell.prototype.toInt = function() {return 0;};
    DeadCell.prototype.life = function(x,y) {
      var gen = [this, this, this, new LiveCell(), this, this, this, this, this];
      return gen[this.neighbors] ;
    };

    function Board(board_size){
      this.board = [];
      this.initBoard(board_size);
      this.initHTML(board_size);
    }

    /**
     * Function to play the game with setTimeout
     */
    Board.prototype.play = function() {
      this.nextGen();
      this.paint();
      var that = this;
      setTimeout(function() {that.play()}, 100);
    }

    /**
     * Function to play the game with setTimeout
     */
    Board.prototype.nextGen = function() {
      this.setNeighbours();
      this.nextStep();
    }

    /**
     * Populate the total of neighbours inside every Cell Object
     */
    Board.prototype.setNeighbours = function(){
      var that = this;
      $.each(this.board, function(i, value) {
        $.each(value, function(j, cell) {
          cell.neighbors = that.countNeighbours(i,j);
        });
      });
    }

    /**
     * Returns the total of neighbours around the 
     * cell in position [i][j]
     * @param {Number} row position
     * @param {Number} column position
     * @returns {Number} sum of array numbers
     */
    Board.prototype.countNeighbours = function(i,j) {
      var that = this;
      return ([[-1,-1], [-1, 0], [-1,+1], [0,-1], [0,+1],[+1, -1], [+1,0], [+1,+1] ].map(function(pos){
        return (that.board[i+pos[0]] && that.board[i+pos[0]][j+pos[1]]) ? that.board[i+pos[0]][j+pos[1]].toInt() : 0;
        })).reduce(function(a, b) {
        return a + b;
      });
    }

    /**
     * Change the status of all Cells according to his neighbours
     * and actual status
     */
    Board.prototype.nextStep = function(){
      var that = this;
      $.each(this.board, function(i, value) {
        $.each(value, function(j, cell) {
          that.board[i][j] = cell.life();
        });
      });
    }

    /**
     * Populate board with dead cells
     */
    Board.prototype.initBoard = function(board_size){
      for(var i=0; i < board_size; i++){ 
        this.board[i] = [];
        for(var j=0; j < board_size; j++){
          this.board[i][j] = (Math.round(Math.random()) == 1) ? new LiveCell() : new DeadCell();
        }
      }
    }

    /**
     * Init html board "<table>"
     * Only for the sake of the html presentation
     */
    Board.prototype.initHTML = function(board_size) {
      var _data = [];
      for(i=0; i < board_size; i++){
        var row = $('<tr></tr>');
        for(j=0; j < board_size; j++){
          row.append($('<td></td>').addClass('alive-'+this.board[i][j].toInt()));
        }
        _data.push(row);
      }
      $('#board').append(_data);
    }

    /**
     * Draw the new representation of the board "<table>"
     * Only for the sake of the html presentation
     */
    Board.prototype.paint = function() {
      var that = this;
      $("#board tr").each(function(i, v){
          $(this).children('td').each(function(j, w){
              $(this).removeClass().addClass('alive-'+that.board[i][j].toInt());
          }); 
      })
    };


    var myObject =
    {
      init: Board
    };
    return myObject;
}();

$(function(){
  var app = new App.GameOfLife.init(42); // You can change the board size, but 42 is the answer to life, universe and everything.
  app.play();
});
