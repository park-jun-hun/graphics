//마우스 커서를 따라 이동하도록 설정
//스페이스 키 누를 시 속도 올라가고, 뗄 시 속도 원위치

PlayerSnake = function(game, spriteKey, x, y) {
    Snake.call(this, game, spriteKey, x, y);
    this.cursors = game.input.keyboard.createCursorKeys();
	

	//마우스 입력 추가
	this.game.input.mouse.capture = true;
	
	/***
    //handle the space key so that the player's snake can speed up
    var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    var self = this;
	
    spaceKey.onDown.add(this.spaceKeyDown, this);
    spaceKey.onUp.add(this.spaceKeyUp, this);
	
    this.addDestroyedCallback(function() {
        spaceKey.onDown.remove(this.spaceKeyDown, this);
        spaceKey.onUp.remove(this.spaceKeyUp, this);
    }, this);
	***/
}

PlayerSnake.prototype = Object.create(Snake.prototype);
PlayerSnake.prototype.constructor = PlayerSnake;

/***
//make this snake light up and speed up when the space key is down
PlayerSnake.prototype.spaceKeyDown = function() {
    this.speed = this.fastSpeed;
}
//make the snake slow down when the space key is up again
PlayerSnake.prototype.spaceKeyUp = function() {
    this.speed = this.slowSpeed;
}
***/
//BotSnake와 마찬가지로 tempUpdate함수에 Update 함수 연결 후 진행
//마우스 위치를 계속 받아와서 확인할 수 있도록 한다.

PlayerSnake.prototype.tempUpdate = PlayerSnake.prototype.update;
PlayerSnake.prototype.update = function() {
    //find the angle that the head needs to rotate
    //through in order to face the mouse
    var mousePosX = this.game.input.activePointer.worldX;
    var mousePosY = this.game.input.activePointer.worldY;
    var headX = this.head.body.x;
    var headY = this.head.body.y;
    var angle = (180*Math.atan2(mousePosX-headX,mousePosY-headY)/Math.PI);
    if (angle > 0) {
        angle = 180-angle;
    }
    else {
        angle = -180-angle;
    }
    var dif = this.head.body.angle - angle;
    this.head.body.setZeroRotation();
    //allow arrow keys to be used
    if (this.cursors.left.isDown) {
        this.head.body.rotateLeft(this.rotationSpeed);
    }
    else if (this.cursors.right.isDown) {
        this.head.body.rotateRight(this.rotationSpeed);
    }
    //decide whether rotating left or right will angle the head towards
    //the mouse faster, if arrow keys are not used
    else if (dif < 0 && dif > -180 || dif > 180) {
        this.head.body.rotateRight(this.rotationSpeed);
    }
    else if (dif > 0 && dif < 180 || dif < -180) {
        this.head.body.rotateLeft(this.rotationSpeed);
    }
    // option button
    // click pause
    document.getElementById("Pause").onclick = function (event) {
        alert("Break Time")
    }
    // click restart
    document.getElementById("Restart").onclick = function (event) {
        window.location.reload();
        
    }

    document.getElementById("Difficulty").onclick = function (event) {
        switch (event.target.index) {
            case 0:
               
                break;
            case 1:
              
                // alert("level2 Obstacles are created.");
                break;
            case 2:
               
                // alert("level3 The number of obstacles increases!");
                
                break;
        }
    }



    //call the original snake update method
    this.tempUpdate();
	
	//마우스 왼쪽 버튼 누를 시 속도 증가, 떼면 원상태로
	if(this.game.input.activePointer.leftButton.isDown){
		this.speed = this.fastSpeed;
	}
	else{
		this.speed = this.slowSpeed;
	}
}