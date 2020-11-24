
Food = function(game, x, y) {
	//인자 받아오고 초기 설정해주기


	
    this.game = game;
    this.debug = false;
    this.sprite = this.game.add.sprite(x, y, 'food');
    
	//색변환이 현재 오류가 있음
	//this.sprite.tint = Util.randomHexColor();

    this.game.physics.p2.enable(this.sprite, this.debug);
    this.sprite.body.clearShapes();
    this.sprite.body.addCircle(this.sprite.width * 0.5);
	
	
	//callback 함수 설정해서, food와 무언가가 만나면 callback
    this.sprite.body.onBeginContact.add(this.onBeginContact, this);

    this.sprite.food = this;

    this.head = null;
    this.constraint = null;
}


Food.prototype = {
    
	//callback 함수
	onBeginContact: function(phaserBody, p2Body) {
        if (phaserBody && phaserBody.sprite.name == "head" && this.constraint === null) {
            this.sprite.body.collides([]);
            
			
			//만약 snake의 머리가 food와 닿을 시, head sprite 가운데로 빨려들게 설정
			//자석 효과처럼 먹을 수 있도록 해줌
            this.constraint = this.game.physics.p2.createRevoluteConstraint(
                this.sprite.body, [0,0], phaserBody, [0,0]
            );
            this.head = phaserBody.sprite;
            this.head.snake.food.push(this);
        }
    },

    update: function() {
        //만약, food가 위에 callback함수에 따라 머리 중앙으로 올 시, food를 destroy하고
		//snake의 size를 키워줌
        if (this.head && Math.round(this.head.body.x) == Math.round(this.sprite.body.x) &&
        Math.round(this.head.body.y) == Math.round(this.sprite.body.y)) {
            this.head.snake.incrementSize();
            this.destroy();
        }
		
		this.sprite.tint = 0xffffff;
    },

	//다른 인자들과 마찬가지로 얘도 Destroy함수가 필요
    destroy: function() {
        if (this.head) {
            this.game.physics.p2.removeConstraint(this.constraint);
            this.sprite.destroy();
            this.head.snake.food.splice(this.head.snake.food.indexOf(this), 1);
            this.head = null;
        }
    }
};




	