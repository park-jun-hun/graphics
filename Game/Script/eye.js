Eye = function(game, head, scale) {
	
	//인자 불러오기
    this.game = game;
    this.head = head;
    this.scale = scale;
    this.eyeGroup = this.game.add.group();
    this.collisionGroup = this.game.physics.p2.createCollisionGroup();
    this.debug = false;

    //위치값 고정
	//흰자와 검은자는 거리를 통해서 계속 위치를 유지하도록 함
    this.lock = null;
    this.dist = null;

    //sprite 불러오기
    this.whiteCircle = this.game.add.sprite(
        this.head.body.x, this.head.body.y, "eye-white"
    );
    this.whiteCircle = this.initCircle(this.whiteCircle);

    this.blackCircle = this.game.add.sprite(
        this.whiteCircle.body.x, this.whiteCircle.body.y, "eye-black"
    );
    this.blackCircle = this.initCircle(this.blackCircle);
    this.blackCircle.body.mass = 0.01;
}

Eye.prototype = {
	initCircle: function(circle) {
        circle.scale.setTo(this.scale);
        this.game.physics.p2.enable(circle, this.debug);
        circle.body.clearShapes();
        //give the circle a circular physics body
        circle.body.addCircle(circle.width*0.5);
        circle.body.setCollisionGroup(this.collisionGroup);
        circle.body.collides([]);
        this.eyeGroup.add(circle);
        return circle;
    },
	
	updateConstraints: function(offset) {
        //change where the lock constraint of the white circle
        //is if it already exists
        if (this.lock) {
            this.lock.localOffsetB = [
                this.game.physics.p2.pxmi(offset[0]),
                this.game.physics.p2.pxmi(Math.abs(offset[1]))
            ];
        }
        //create a lock constraint if it doesn't already exist
        else {
            this.lock = this.game.physics.p2.createLockConstraint(
                this.whiteCircle.body, this.head.body, offset, 0
            );
        }

        //change the distance of the distance constraint for
        //the black circle if it exists already
        if (this.dist) {
            this.dist.distance = this.game.physics.p2.pxm(this.whiteCircle.width*0.25);
        }
        //create a distance constraint if it doesn't exist already
        else {
            this.dist = this.game.physics.p2.createDistanceConstraint(
                this.blackCircle.body, this.whiteCircle.body, this.whiteCircle.width*0.25
            );
        }
    },
	
	setScale: function(scale) {
        this.scale = scale;
        for (var i = 0 ; i < this.eyeGroup.children.length ; i++) {
            var circle = this.eyeGroup.children[i];
            circle.scale.setTo(this.scale);
            //change the radii of the circle bodies using pure p2 physics
            circle.body.data.shapes[0].radius = this.game.physics.p2.pxm(circle.width*0.5);
        }

    },
    /**
     * Call from the update loop
     */
    update: function() {
        var mousePosX = this.game.input.activePointer.worldX;
        var mousePosY = this.game.input.activePointer.worldY;
        var headX = this.head.body.x;
        var headY = this.head.body.y;
        var angle = Math.atan2(mousePosY-headY, mousePosX-headX);
        var force = 300;
        //move the black circle of the eye towards the mouse
        this.blackCircle.body.moveRight(force*Math.cos(angle));
        this.blackCircle.body.moveDown(force*Math.sin(angle));
    },
    /**
     * Destroy this eye
     */
    destroy: function() {
        this.whiteCircle.destroy();
        this.blackCircle.destroy();
        this.game.physics.p2.removeConstraint(this.lock);
        this.game.physics.p2.removeConstraint(this.dist);
    }
};

