EyePair = function(game, head, scale) {
	
	//인자 불러오기
    this.game = game;
    this.head = head;
    this.scale = scale;
    this.eyes = [];

    this.debug = false;

    //눈 두개 생성
    var offset = this.getOffset();
    this.leftEye = new Eye(this.game, this.head, this.scale);
    this.leftEye.updateConstraints([-offset.x, -offset.y]);
    this.eyes.push(this.leftEye);

    this.rightEye = new Eye(this.game, this.head, this.scale);
    this.rightEye.updateConstraints([offset.x, -offset.y]);
    this.eyes.push(this.rightEye);
}

EyePair.prototype = {
	//위치값 설정
    getOffset: function() {
        var xDim = this.head.width*0.25;
        var yDim = this.head.width*.125;
        return {x: xDim, y: yDim};
    },

    setScale: function(scale) {
		
		//snake scale에 따라서 눈 크기도 변경
        this.leftEye.setScale(scale);
        this.rightEye.setScale(scale);
        //크기가 변경됨에 따라 눈 위치값도 업데이트 해주기
        var offset = this.getOffset();
        this.leftEye.updateConstraints([-offset.x, -offset.y]);
        this.rightEye.updateConstraints([offset.x, -offset.y]);
    },
	
	//Snake.js Update에서 사용할 용도
    update: function() {
        for (var i = 0 ; i < this.eyes.length ; i++) {
            this.eyes[i].update();
        }
    },
	//마찬가지로 Snake.js의 Destroy funtion에 연결해서, 눈도 같이 사라지게 하는 용
    destroy: function() {
        this.leftEye.destroy();
        this.rightEye.destroy();
    }
};