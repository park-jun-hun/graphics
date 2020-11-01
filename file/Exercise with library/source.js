var gl;
var points;
var index=0;
var state=false;
var place=[];
var delay=10;
var intervalId;
var SSVmove=0;
var state=0;
var w_point=[0,0,0,0,0,0];
var direction = 1;
var theta=0;
var thetaLoc;
var start=true;

window.onload = function init()
{

    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }


    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var vPosition = gl.getAttribLocation( program, "vPosition" );

    var vColor = gl.getAttribLocation(program, "vColor");
    var vertexColorBufferId = gl.createBuffer();
    var vOffset = gl.getUniformLocation(program,"vOffset");


    gl.viewport( 0, 0, canvas.width, canvas.height );
    // background
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    
    thetaLoc = gl.getUniformLocation(program, "theta");


    //square
    var cusor = [
    
        vec2(0.0,2.5),
        vec2(-0.5,2.0),
        vec2(0.5,2.0),
      
        vec2(-0.25,2.0),
        vec2(-0.25,1.5),
        vec2(0.25,2.25),

        vec2(0.25,2.25),
        vec2(-0.25,1.5),
        vec2(0.25,1.5)
     
    ];
    var cusor_color=[
        vec4(0.24,0.7,0.53,1.0),
        vec4(0.24,0.7,0.53,1.0),
        vec4(0.24,0.7,0.53,1.0),
        vec4(0.24,0.7,0.53,1.0),
        vec4(0.24,0.7,0.53,1.0),
        vec4(0.24,0.7,0.53,1.0),
        vec4(0.24,0.7,0.53,1.0),
        vec4(0.24,0.7,0.53,1.0),
        vec4(0.24,0.7,0.53,1.0)
    ]
    var cusor_line=[
        vec2(0.0,2.5),
        vec2(-0.5,2.0),
        vec2(-0.25,2.0),
        vec2(-0.25,1.5),
        vec2(0.25,1.5),
        vec2(0.25,2.0),
        vec2(0.5,2.0),
        vec2(0.0,2.5) 
    ]
  
    var cusor_line_color=[
        vec4(0.0,0.0,0.0,1.0),
        vec4(0.0,0.0,0.0,1.0),
        vec4(0.0,0.0,0.0,1.0),
        vec4(0.0,0.0,0.0,1.0),
        vec4(0.0,0.0,0.0,1.0),
        vec4(0.0,0.0,0.0,1.0),
        vec4(0.0,0.0,0.0,1.0),
        vec4(0.0,0.0,0.0,1.0),
        vec4(0.0,0.0,0.0,1.0),
        vec4(0.0,0.0,0.0,1.0),
        vec4(0.0,0.0,0.0,1.0)
    ]

    var head =[
      vec2(0.0,0.0),

      vec2(0.5,1.0),
      vec2(-0.5,1.0),

      vec2(-1.0,0.5),
      vec2(-1.0,-0.5),

      vec2(-0.5,-1),
      vec2(0.5,-1),

      vec2(1.0,-0.5),
      vec2(1.0,0.5),
      vec2(0.5,1.0),
      
    ];
    
    var head_color=[
        vec4(0.2,0.4,0.5,1.0),
        vec4(0.2,0.4,0.5,0.5),
        vec4(0.2,0.4,0.5,0.5),
        vec4(0.2,0.4,0.5,0.5),
        vec4(0.2,0.4,0.5,0.5),
        vec4(0.2,0.4,0.5,0.5),
        vec4(0.2,0.4,0.5,0.5),
        vec4(0.2,0.4,0.5,0.5),
        vec4(0.2,0.4,0.5,0.5),
        vec4(0.2,0.4,0.5,0.5)
    ]
    var right_eye=[
        vec2(3.0,7.0),

      vec2(3.5,8.0),
      vec2(2.5,8.0),

      vec2(2.0,7.5),
      vec2(2.0,6.5),

      vec2(2.5,6),
      vec2(3.5,6),

      vec2(4.0,6.5),
      vec2(4.0,7.5),
      vec2(3.5,8.0),
    ]
    var left_eye=[
        vec2(-3.0,7.0),

        vec2(-2.5,8.0),
        vec2(-3.5,8.0),
  
        vec2(-4.0,7.5),
        vec2(-4.0,6.5),
  
        vec2(-3.5,6),
        vec2(-2.5,6),
  
        vec2(-2.0,6.5),
        vec2(-2.0,7.5),
        vec2(-2.5,8.0),
    ]
    var back = [
        vec2(-0.8, 0.9),
        vec2(-0.85, 1.0),
        vec2(-0.95, 1.0),
        vec2(-1.0, 0.9),
        vec2(-0.95, 0.8),
        vec2(-0.85, 0.8),
        vec2(-0.8, 0.9)
    ];


// click pause 
document.getElementById("Pause").onclick=function(event){
    start=false;
}
// click restart
document.getElementById("Restart").onclick=function(event){
    start=true;
    object();
}
// select level 
document.getElementById("Difficulty").onclick=function(event){
    switch(event.target.index){
        case 0:
            alert("level1");
            break;
        case 1:
            alert("level2");
            break;
        case 2:
            alert("level3");
            break;
    }
}
// using mouse click down
    canvas.addEventListener("mousemove",function(event){
        if(start){
        var p= vec2(2*event.clientX/canvas.width -1,
            2*(canvas.height-event.clientY)/canvas.height-1);
            var distance = Math.sqrt(p[0]*p[0] +p[1]*p[1]);

            if(p[0]>0&&p[1]>0){
                theta=-1.57+Math.acos(p[0]/distance);
            }
            else if(p[0]<0&&p[1]>0){
                theta=-1.57+Math.acos(p[0]/distance);
            }
            else if(p[0]<0&&p[1]<0){
                theta=+1.57+Math.acos(-p[0]/distance);
            }
            else{
                theta=+1.57+Math.acos(-p[0]/distance);
            }
    // 30도  
    // theta-=0.523;
    // 90도
    // theta -=1.57
      gl.uniform1f(thetaLoc, theta);
      object();
        }
    });

    object();
    function object(){
        var count=0;
        var row=0;
        
		

        draw(gl.TRIANGLES, cusor, cusor_color,[0.0,0.0,0.0,8.5]);
        draw(gl.LINE_STRIP, cusor_line, cusor_line_color,[0.0,0.0,0.0,8.5]);
        draw(gl.TRIANGLE_FAN,head,head_color,[0.0,0.0,0.0,10.0]);
        draw(gl.TRIANGLE_FAN,right_eye,cusor_line_color,[0.0,0.0,-1.0,100.0]);
        draw(gl.TRIANGLE_FAN,left_eye,cusor_line_color,[0.0,0.0,-1.0,100.0]);
        // BODY 
        for(count=0;count<10;count++){
        draw(gl.TRIANGLE_FAN,head,head_color,[0.0,-count,0.0,10+count]);
        }

        // 고정값 
        gl.uniform1f(thetaLoc,0);
        // back
        for(row=0;row>-3;row-=0.2){
            for(count=0;count<2;count+=0.2){
            draw(gl.LINE_LOOP, back, cusor_color,[count,row,0.1,0.0]);
            }
    }
    draw(gl.TRIANGLE_FAN,left_eye,cusor_line_color,[2.5,-6.0,1.0,0.1]);
    draw(gl.TRIANGLE_FAN,left_eye,cusor_line_color,[3.5,-6.0,1.0,0.1]);
    draw(gl.TRIANGLE_FAN,left_eye,cusor_line_color,[2.5,-7.5,1.0,0.1]);
    draw(gl.TRIANGLE_FAN,left_eye,cusor_line_color,[3.5,-7.5,1.0,0.1]);
    // draw(gl.TRIANGLE_FAN,left_eye,cusor_line_color,[4.0,-6.0,1.0,0.5]);
    }
    // drawing square
    function draw(shape,vertex,color,offset){
       
        var buffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, buffer);
        gl.bufferData( gl.ARRAY_BUFFER,flatten(vertex), gl.STATIC_DRAW );

        gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vPosition );

        // object color
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBufferId);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(color), gl.STATIC_DRAW);

        gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vColor);

        gl.uniform4fv(vOffset,offset);

        // draw
        render(shape,0,vertex.length);
        // initialize postion
        gl.uniform4fv(vOffset,[0,0,0,0]);
    }

  


    function MoveRender(){
        for( i=0;i<6;i++){
            w_point[i]+=(0.01*direction);
        }
        
        object();
        
		requestAnimationFrame(MoveRender);
		CombineCanvas();
		
    }



    // if(state==1){
    //     intervalId = setInterval(MoveRender,delay);
    // }
    // if(state==2){
    //     intervalId = setInterval(MoveRender,delay);
    // }

};

// drawing each object
function render(shape,start, end) {

    gl.drawArrays( shape,start,end);
    // window.requestAnimationFrame(render);
}

function CombineCanvas(){
	var can = document.getElementById('gl-canvas');
	var ctx = can.getContext('2d');

	var can2 = document.getElementById('p5-canvas');
	var ctx2 = can2.getContext('2d');

	var can3 = document.getElementById('canvas3');
	var ctx3 = can3.getContext('2d');


	ctx3.drawImage(can, 0, 0);
	ctx3.drawImage(can2, 0, 0);
}