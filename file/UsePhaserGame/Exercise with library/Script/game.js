//Define Game Function

Game = function(game){}



Game.prototype = {
	
	
	preload: function(){
	
	//load Assets
	this.game.load.image('circle', 'Assets/circle.png');
	this.game.load.image('background', 'Assets/tile.png');
	
	},
	
	create: function(){
		var width = this.game.width;
		var height = this.game.height;
		
		this.game.world.setBounds(-width, -height, width*2, height*2);
		this.game.stage.backgroundColor = '#444';
		
		//add tileSprite background
		var background = this.game.add.tileSprite(-width, -height, this.game.world.width, this.game.world.height, 'background');
		
		//initialize physics and groups
		this.game.physics.startSystem(Phaser.Physics.P2JS);
		
		this.game.snakes = [];
		
		//create Player
		var snake = new Snake(this.game, 'circle', 0, 0);
		
		//camera follows snake's head position
		this.game.camera.follow(snake.head);
		
	},
	
	update: function(){
		//update gmae components
		for (var i = this.game.snakes.length -1; i>=0 ; i--){
			this.game.snakes[i].update();
		}
	}
	
};