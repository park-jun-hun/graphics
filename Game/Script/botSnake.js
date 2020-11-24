BotSnake = function(game, spriteKey, x, y){
	
	//인자들 받아오는 작업
	//Snake.js 참조해서 설정
	//field 설정 = trend 사용
	Snake.call(this, game, spriteKey, x, y);
	this.trend = 1;
		
	
}
//snake prototype 연결
//이걸 통해서 BotSnake도 Snake의 함수들을 사용할 수 있음
BotSnake.prototype = Object.create(Snake.prototype);
BotSnake.prototype.constructor = BotSnake;

//update함수를 직접적으로 사용하기 힘드므로 (Clone해서 여러개 만들꺼라서 안되나 봄)
//tempUpdate란 함수에 연결해서 사용한다.
//Update 함수 내부에는 BotSnake 머리 좌우로 랜덤하게 움직이도로 설정

BotSnake.prototype.tempUpdate = BotSnake.prototype.update;
BotSnake.prototype.update = function() {
    this.head.body.setZeroRotation();

    //ensure that the bot keeps rotating in one direction for a
    //substantial amount of time before switching directions
    if (Util.randomInt(1,20) == 1) {
        this.trend *= -1;
    }
    this.head.body.rotateRight(this.trend * this.rotationSpeed);
    this.tempUpdate();
}


	