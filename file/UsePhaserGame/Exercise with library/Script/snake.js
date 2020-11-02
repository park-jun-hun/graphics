Snake = function(game, spriteKey, x, y){
	this.game = game;
	
	//create an array of snakes in the game object and add this snakes
	
	//player snake 중복 생성 방지
	if(!this.game.snakes){
		this.game.snakes = [];
	
	}
	
	this.game.snakes.push(this);
	this.debug = false;
	
	this.snakeLength = 0;
	this.spriteKey = spriteKey;
	
	//various quantities that can be changed
	this.scale = 0.6;
	this.fastSpeed = 200;
	this.slowSpeed = 130;
	this.speed = this.slowSpeed;
	this.ratationSpeed = 40;
	
	//initialize groups and arrays
	this.collisionGroup = this.game.physics.p2.createCollisionGroup();
	this.sections = [];
	
	//the head path is an array of points that the head of the snake has
    //traveled through
	this.headPath =[];
	this.food = [];
	
	this.preferredDistance = 17 * this.scale;
    this.queuedSections = 0;

    this.sectionGroup = this.game.add.group();
	
	
	
    //add the head of the snake
	//
	
    this.head = this.addSectionAtPosition(x,y);
    this.head.name = "head";
    this.head.snake = this;

    this.lastHeadPosition = new Phaser.Point(this.head.body.x, this.head.body.y);
    //add 30 sections behind the head
    this.initSections(30);

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
		this.game.physics.p2.enable(sec, this.debug);
		sec.body.setCollisionGroup(this.collisionGroup);
		sec.body.collides([]);
		sec.body.kinematic = true;

		this.snakeLength++;
		this.sectionGroup.add(sec);
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
		
		
		for (var i = 0 ; i < this.snakeLength ; i++) {

			this.sections[i].body.x = this.headPath[index].x;
			this.sections[i].body.y = this.headPath[index].y;

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
			index = this.findNextPointIndex(index);
		}
		
		//continuously adjust the size of the head path array so that we
		//keep only an array of points that we need
		if (index >= this.headPath.length - 1) {
			var lastPos = this.headPath[this.headPath.length - 1];
			this.headPath.push(new Phaser.Point(lastPos.x, lastPos.y));
		}
		else {
			this.headPath.pop();
		}
		
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

		//scale sections and their bodies
		for (var i = 0 ; i < this.sections.length ; i++) {
			var sec = this.sections[i];
			sec.scale.setTo(this.scale);
			sec.body.data.shapes[0].radius = this.game.physics.p2.pxm(sec.width*0.5);
		}
	},

	incrementSize: function() {
		this.addSectionsAfterLast(1);
		this.setScale(this.scale * 1.01);
	},

	addDestroyedCallback: function(callback, context) {
		this.onDestroyedCallbacks.push(callback);
		this.onDestroyedContexts.push(context);
	},

	destroy: function() {
		this.game.snakes.splice(this.game.snakes.indexOf(this), 1);
		this.sections.forEach(function(sec, index) {
			sec.destroy();
		});

		//call this snake's destruction callbacks
		for (var i = 0 ; i < this.onDestroyedCallbacks.length ; i++) {
			if (typeof this.onDestroyedCallbacks[i] == "function") {
				this.onDestroyedCallbacks[i].apply(
					this.onDestroyedContexts[i], [this]);
			}
		}
	}

};
	