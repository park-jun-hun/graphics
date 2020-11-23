Snake = function(game, spriteKey, x, y){
	
	//인자들 받아오는 작업 + 지렁이 초기설정 해주기
	
	
	this.game = game;
	
	//create an array of snakes in the game object and add this snakes
	
	//player snake 중복 생성 방지
	if(!this.game.snakes){
		this.game.snakes = [];
	}
	
	this.game.snakes.push(this);
	
	//debug???
	this.debug = false;
	
	this.snakeLength = 0;
	this.spriteKey = spriteKey;
	
	//various quantities that can be changed
	
	
	this.scale = 0.6;
	
	//
	this.fastSpeed = 200;
	this.slowSpeed = 130;
	this.speed = this.slowSpeed;
	this.rotationSpeed = 40;
	
	//initialize groups and arrays
	
	
	
	
	this.collisionGroup = this.game.physics.p2.createCollisionGroup();
	this.sections = [];
	//CollisionBox 내에서 머리 부분이랑 몸통 부분 분간해주기 위해서
	//머리가 닿을 때만 해줘야 할 일이 있고, 몸통 부분이 닿았을 때 해줘야할 일
	
	//the head path is an array of points that the head of the snake has
    //traveled through
	this.headPath =[];
	this.food = [];
	
	
	//???
	this.preferredDistance = 17 * this.scale;
    this.queuedSections = 0;

    this.sectionGroup = this.game.add.group();
	//지렁이 여러마리라서 해준다.
	//인게임 자체가 동시에 애들이 움직인다.
	//생성되는 푸드 양는 제한적이므로 얘도 Group으로 사용
	
	
    //add the head of the snake
	//
	
    this.head = this.addSectionAtPosition(x,y);
    this.head.name = "head";
    this.head.snake = this;

    this.lastHeadPosition = new Phaser.Point(this.head.body.x, this.head.body.y);
    
	//add 3 sections behind the head
	//머리 뒤에 따라오는 몸통 개수가 설정
	//현재 30
    this.initSections(30);
	
	//눈도 initialize
	this.eyes = new EyePair(this.game, this.head, this.scale);
	
	//나중에 삭제용으로 쓰일 예정
    this.onDestroyedCallbacks = [];
    this.onDestroyedContexts = [];
	
	//CollisionDetection을 위해 추가한다.
	//Snake의 Head 앞 부분 Collision 원을 추가하여 다른 뱀 혹은 먹이와 충돌 감지용
	
	this.edgeOffset = 4;
	this.edge = this.game.add.sprite(x, y - this.edgeOffset, this.spriteKey);
	this.edge.name = "edge";
	this.edge.alpha = 0;
	this.game.physics.p2.enable(this.edge, this.debug);
	this.edge.body.setCircle(this.edgeOffset);

	//constrain edge to the front of the head
	this.edgeLock = this.game.physics.p2.createLockConstraint(
		this.edge.body, this.head.body, [0, -this.head.width*0.5-this.edgeOffset]
	);

	this.edge.body.onBeginContact.add(this.edgeContact, this);
	
	this.onDestroyedCallbacks = [];
    this.onDestroyedContexts = [];
	
}

Snake.prototype = {
	

	initSections: function(num) {
		//create a certain number of sections behind the head
		//only use this once
		for (var i = 1 ; i <= num ; i++) {
			var x = this.head.body.x;
			var y = this.head.body.y + i * this.preferredDistance;
			
			this.addSectionAtPosition(x, y);
			//add a point to the head path so that the section stays there
			this.headPath.push(new Phaser.Point(x,y));
		}

	},
	

	addSectionAtPosition: function(x,y){
		//initialize a new section
		var sec = this.game.add.sprite(x, y, this.spriteKey);
		
		//원 하나에 collision 추가
		this.game.physics.p2.enable(sec, this.debug);
		
		//collsionGroup으로 연결
		sec.body.setCollisionGroup(this.collisionGroup);
		sec.body.collides([]);
		sec.body.kinematic = true;
			
		this.snakeLength++;
		
		this.sectionGroup.add(sec);
		
		//?
		sec.sendToBack();
		sec.scale.setTo(this.scale);

		this.sections.push(sec);

		//add a circle body to this section
		sec.body.clearShapes();
		sec.body.addCircle(sec.width*0.5);

		return sec;
	},

	addSectionsAfterLast: function(amount) {
		this.queuedSections += amount;
	},

	update: function(){
		var speed = this.speed;
		this.head.body.moveForward(speed);

		var point = this.headPath.pop();
		point.setTo(this.head.body.x, this.head.body.y);
		this.headPath.unshift(point);
		
		var index = 0;
		var lastIndex = null;
		
		//3
		for (var i = 0 ; i < this.snakeLength ; i++) {

			this.sections[i].body.x = this.headPath[index].x;
			this.sections[i].body.y = this.headPath[index].y;

			//새로 생성되는 꼬리가 겹쳐서 생성되는 오류를 방지하기 위해 추가
			//동시에 2개 생성 시, 순서 붙여주기
			//hide sections if they are at the same position
			if (lastIndex && index == lastIndex) {
				this.sections[i].alpha = 0;
			}
			else {
				this.sections[i].alpha = 1;
			}

			lastIndex = index;
			
			
			//this finds the index in the head path array that the next point
			//should be at
			
			//맨날 마지막 몸통 가리켜라
			index = this.findNextPointIndex(index);
		}
		
		//????
		//continuously adjust the size of the head path array so that we
		//keep only an array of points that we need
		if (index >= this.headPath.length - 1) {
			var lastPos = this.headPath[this.headPath.length - 1];
			this.headPath.push(new Phaser.Point(lastPos.x, lastPos.y));
		}
		else {
			this.headPath.pop();
		}
		
		
		//????
		var i = 0;
		var found = false;
		while (this.headPath[i].x != this.sections[1].body.x &&
		this.headPath[i].y != this.sections[1].body.y) {
			if (this.headPath[i].x == this.lastHeadPosition.x &&
			this.headPath[i].y == this.lastHeadPosition.y) {
				found = true;
				break;
			}
			i++;
		}
		if (!found) {
			this.lastHeadPosition = new Phaser.Point(this.head.body.x, this.head.body.y);
			this.onCycleComplete();
		}
		
		//update Eyes
		this.eyes.update();
		
	},

	onCycleComplete: function(){
		if (this.queuedSections > 0) {
			var lastSec = this.sections[this.sections.length - 1];
			this.addSectionAtPosition(lastSec.body.x, lastSec.body.y);
			this.queuedSections--;
		}
	},
	
	
	
	findNextPointIndex: function(currentIndex) {
		var pt = this.headPath[currentIndex];
		//we are trying to find a point at approximately this distance away
		//from the point before it, where the distance is the total length of
		//all the lines connecting the two points
		var prefDist = this.preferredDistance;
		var len = 0;
		var dif = len - prefDist;
		var i = currentIndex;
		var prevDif = null;
		
		//this loop sums the distances between points on the path of the head
		//starting from the given index of the function and continues until
		//this sum nears the preferred distance between two snake sections
		while (i+1 < this.headPath.length && (dif === null || dif < 0)) {
			//get distance between next two points
			var dist = Util.distanceFormula(
				this.headPath[i].x, this.headPath[i].y,
				this.headPath[i+1].x, this.headPath[i+1].y
			);
			len += dist;
			prevDif = dif;
			//we are trying to get the difference between the current sum and
			//the preferred distance close to zero
			dif = len - prefDist;
			i++;
		}

		
		//choose the index that makes the difference closer to zero
		//once the loop is complete
		if (prevDif === null || Math.abs(prevDif) > Math.abs(dif)) {
			return i;
		}
		else {
			return i-1;
		}
	},

	setScale: function(scale) {
		this.scale = scale;
		this.preferredDistance = 17 * this.scale;
		
		//머리 크기가 커지면 Edge 크기도 커지도록 설정
		this.edgeLock.localOffsetB = [
			0, this.game.physics.p2.pxmi(this.head.width*0.5+this.edgeOffset)
		];
		
		//scale sections and their bodies
		for (var i = 0 ; i < this.sections.length ; i++) {
			var sec = this.sections[i];
			sec.scale.setTo(this.scale);
			sec.body.data.shapes[0].radius = this.game.physics.p2.pxm(sec.width*0.5);
		}
		
		//scale eyes
        this.eyes.setScale(scale);
	},

	incrementSize: function() {
		//?
		this.addSectionsAfterLast(1);
		//1.01배씩 증가시킨다.
		this.setScale(this.scale * 1.01);
	},

	addDestroyedCallback: function(callback, context) {
		this.onDestroyedCallbacks.push(callback);
		this.onDestroyedContexts.push(context);
	},


	destroy: function() {
		this.game.snakes.splice(this.game.snakes.indexOf(this), 1);
		
		//Snake가 Destroy될 시, Edge도 삭제할 수 있도록 추가
		this.game.physics.p2.removeConstraint(this.edgeLock);
        this.edge.destroy();
		
		//머리 중앙에 닿을 시, food 삭제
		for (var i = this.food.length - 1 ; i >= 0 ; i--) {
            this.food[i].destroy();
        }
		
		
		this.sections.forEach(function(sec, index) {
			sec.destroy();
		});
		this.eyes.destroy();

		//call this snake's destruction callbacks
		for (var i = 0 ; i < this.onDestroyedCallbacks.length ; i++) {
			if (typeof this.onDestroyedCallbacks[i] == "function") {
				this.onDestroyedCallbacks[i].apply(
					this.onDestroyedContexts[i], [this]);
			}
		}
	},
	
	edgeContact: function(phaserBody) {
        //만약 Edge가 다른 Snake와 충돌 시, Destroy시킨다.
        if (phaserBody && this.sections.indexOf(phaserBody.sprite) == -1) {
            this.destroy();
        }
        //자신 몸통과의 충돌은 체크하지 않도록 한다.
		//이를 위해 몸통과 만날 시, Edge를 머리 중앙으로 넣어서 충돌이 이뤄지지 않도록 방지한다.
        else if (phaserBody) {
            this.edge.body.x = this.head.body.x;
            this.edge.body.y = this.head.body.y;
        }
    }

};
	