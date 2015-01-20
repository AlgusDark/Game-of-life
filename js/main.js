/**
 * Game Of life
 * @author AlgusDark
 * @version 2.0
 */

$(function(){
	var game = new GameOfLife(42); // You can change the board size, but 42 is the answer to life, universe and everything.
	game.play_game();
});

/**
 * Creates a new Cell.
 * @class
 */
function Cell() {
	this.neighbors = 0;
	this.alive = Math.round(Math.random()) == 1;
}

/**
 * Returns 1 or 0 if the cell is alive or dead
 * @returns {Number} numeric boolean representation
 */
Cell.prototype.toInt = function () { return (this.alive) ? 1 : 0 }

/**
 * Save the next step of the cell
 */
Cell.prototype.next_step = function () { this.alive = (this.alive) ? this.neighbors == 2 || this.neighbors == 3 : this.neighbors == 3; }

/**
 * Game Of Life.
 * @class
 * @param {Number} board size
 */
function GameOfLife(board_size){
	this.cells = Array();
	this.init_cells(board_size);
	this.init_board(board_size);
}

/**
 * Populate cells array with cell objects
 */
GameOfLife.prototype.init_cells = function(board_size){
	for(var i=0; i < board_size; i++){ 
		this.cells[i] = Array();
		for(var j=0; j < board_size; j++){
			this.cells[i][j] = new Cell();
		}
	}
}

/**
 * Function to play the game with setTimeout
 */
GameOfLife.prototype.play_game = function() {
	this.next_step();
	this.draw_step();
	var that = this;
	setTimeout(function() {that.play_game()}, 100);
}

/**
 * Function to play the game with setTimeout
 */
GameOfLife.prototype.next_step = function() {
	this.setNeighbours();
	this.new_status();
}

/**
 * Populate the total of neighbours inside every Cell Object
 */
GameOfLife.prototype.setNeighbours = function(){
	var that = this;
	$.each(this.cells, function(i, value) {
		$.each(value, function(j, cell) {
			cell.neighbors = that.countNeighbours(i,j);
		});
	});
}

/**
 * Change the status of all Cells according to his neighbours
 * and actual status
 */
GameOfLife.prototype.new_status = function(){
	$.each(this.cells, function(i, value) {
		$.each(value, function(j, cell) {
			cell.next_step();
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
GameOfLife.prototype.countNeighbours = function(i,j) {
	var that = this;
	return ([[-1,-1], [-1, 0], [-1,+1], [0,-1], [0,+1],[+1, -1], [+1,0], [+1,+1] ].map(function(pos) {
		return (that.cells[i+pos[0]] && that.cells[i+pos[0]][j+pos[1]]) ? that.cells[i+pos[0]][j+pos[1]].toInt() : 0;
	})).reduce(function(a, b) {
		return a + b;
	});
}

/**
 * Init html board "<table>"
 * Only for the sake of the html presentation
 */
GameOfLife.prototype.init_board = function(board_size) {
	var _data = Array();
	for(i=0; i < board_size; i++){
		var row = $('<tr></tr>');
		for(j=0; j < board_size; j++){
			row.append($('<td></td>').addClass('alive-'+this.cells[i][j].alive));
		}
		_data.push(row);
	}
	$('#board').append(_data);
}
/**
 * Draw the new representation of the board "<table>"
 * Only for the sake of the html presentation
 */
GameOfLife.prototype.draw_step = function() {
	var that = this;
	$("#board tr").each(function(i, v){
	    $(this).children('td').each(function(j, w){
	    	var _alive = that.cells[i][j].alive;
	        $(this).removeClass().addClass('alive-'+_alive);
	    }); 
	})
};