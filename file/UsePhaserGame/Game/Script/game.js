//Define Game Function

Game = function(game){}





Game.prototype = {
	
	
	preload: function(){

	
	//load Assets
	this.game.load.image('circle', 'Assets/circle.png');
	this.game.load.image('botcircle', 'Assets/BotCircle.png');
	this.game.load.image('background', 'Assets/tile.png');
	
	this.game.load.image('eye-white', 'Assets/eye-white.png');
    this.game.load.image('eye-black', 'Assets/eye-black.png');
	
	this.game.load.image('food', 'Assets/hex.png');
	
	},
	
	create: function(){
		var width = this.game.width;
		var height = this.game.height;
		
		//함수 찾아보기
		this.game.world.setBounds(-width, -height, width*2, height*2);
		
		this.game.stage.backgroundColor = '#444';
		
		//add tileSprite background
		var background = this.game.add.tileSprite(-width, -height, this.game.world.width, this.game.world.height, 'background');
		
		
		//initialize physics and groups
		this.game.physics.startSystem(Phaser.Physics.P2JS);
		this.foodGroup = this.game.add.group();
        this.snakeHeadCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.foodCollisionGroup = this.game.physics.p2.createCollisionGroup();


        //food 랜덤 위치에 생성
        for (var i = 0 ; i < 100 ; i++) {
            this.initFood(Util.randomInt(-width, width), Util.randomInt(-height, height));
        }

		

		this.game.snakes = [];
		
		//create Player
		var snake = new PlayerSnake(this.game, 'circle', 0, 0);
		
		//camera follows snake's head position
		this.game.camera.follow(snake.head);
		
		//create bots
		new BotSnake(this.game, 'botcircle', -200, 0);
		new BotSnake(this.game, 'botcircle', 200, 0);
		
		//snake head와만 food group이 collision 하도록 설정
        for (var i = 0 ; i < this.game.snakes.length ; i++) {
            var snake = this.game.snakes[i];
            snake.head.body.setCollisionGroup(this.snakeHeadCollisionGroup);
            snake.head.body.collides([this.foodCollisionGroup]);
            //callback for when a snake is destroyed
            snake.addDestroyedCallback(this.snakeDestroyed, this);
        }
		
		
	},
	
	update: function(){
		//update game components
		for (var i = this.game.snakes.length -1; i>=0 ; i--){
			this.game.snakes[i].update();
		}
		for (var i = this.foodGroup.children.length - 1 ; i >= 0 ; i--) {
            var f = this.foodGroup.children[i];
            f.food.update();
        }
	},
	
	//food 생성 이후, 초기화 용
	initFood: function(x, y) {
        var f = new Food(this.game, x, y);
        f.sprite.body.setCollisionGroup(this.foodCollisionGroup);
        this.foodGroup.add(f.sprite);
        f.sprite.body.collides([this.snakeHeadCollisionGroup]);
        return f;
    },
	
	
	//snake 죽을 시 food들을 남기고 죽도록 설정!
	snakeDestroyed: function(snake) {
        //place food where snake was destroyed
        for (var i = 0 ; i < snake.headPath.length ;
        i += Math.round(snake.headPath.length / snake.snakeLength) * 2) {
            this.initFood(
                snake.headPath[i].x + Util.randomInt(-10,10),
                snake.headPath[i].y + Util.randomInt(-10,10)
            );
        }
    }
	
};