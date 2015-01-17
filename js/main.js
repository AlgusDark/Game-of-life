$(function(){
	
	init_board(30);

	play_game();

});

// Function to draw the init board
function init_board(board_size)
{
	// We get the table board
	var $board = $('#board');

	$board.data('size', board_size);

	for(i=0; i<board_size; i++){
		var row = $('<tr></tr>');
		for(j=0; j<board_size; j++){
			var alive = Math.round(Math.random());
			var column = $('<td></td>').data('alive', alive).addClass('alive-'+alive);
			row.append(column);
		}
		$board.append(row);
   }
}

//function to draw a new step in the game
function draw_step(cells){
	var $board = $('#board');
	
	$("#board tr").each(function(i, v){
	    $(this).children('td').each(function(j, w){
	    	var alive = cells[i][j];
	        $(this).data('alive', alive).removeClass().addClass('alive-'+alive);
	    }); 
	})
}

// Function to get the cells in the game
function table_to_array(){
	var cells = Array();

	$("#board tr").each(function(i, v){
    	cells[i] = Array();
	    $(this).children('td').each(function(j, w){
	        cells[i][j] = $(this).data('alive');
	    }); 
	})

	return cells;
}

// Cell will live or die?
function life(cells)
{
	var new_cells = Array();
	for (var i = 0; i < cells.length; i++) {
		new_cells[i] = Array();
		for (var j = 0; j < cells.length; j++) {
			var is_alive = cells[i][j];
			var neighbours = countNeighbours(i,j, cells);
			
			if (is_alive == 1){
				if (neighbours < 2 || neighbours > 3) {new_cells[i][j] = 0}
				else if(neighbours >= 2 || neighbours <= 3 ) {new_cells[i][j] = 1}
			}else{
				if (neighbours == 3) {new_cells[i][j] = 1}
				else{new_cells[i][j] = 0}
			}
		}
	}

	return new_cells;
}

function countNeighbours(i,j,cells) {
    var neighbours = 0;


    function exists(i,j) {
        return cells[i] && cells[i][j];
    }
        
    if (exists(i-1, j-1)) neighbours++;
    if (exists(i-1, j  )) neighbours++;
    if (exists(i-1, j+1)) neighbours++;

    if (exists(i,   j-1)) neighbours++;
    if (exists(i,   j+1)) neighbours++;

    if (exists(i+1, j-1)) neighbours++;
    if (exists(i+1, j  )) neighbours++;
    if (exists(i+1, j+1)) neighbours++;
        
    return neighbours;
}


function play_game(){
	var cells = table_to_array();

	cells = life(cells);

	draw_step(cells);

	setTimeout(play_game, 100);
}