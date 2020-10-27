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
    gl.clearColor( 0.0, 1.0, 1.0, 1.0 );
    gl.clear(gl.COLOR_BUFFER_BIT);

    thetaLoc = gl.getUniformLocation(program, "theta");


    //square
    var cusor = [
    
        vec2(0.0,0.5),
        vec2(-0.5,0.0),
        vec2(0.5,0.0),
      
        vec2(-0.25,0.0),
        vec2(-0.25,-0.5),
        vec2(0.25,0.25),

        vec2(0.25,0.25),
        vec2(-0.25,-0.5),
        vec2(0.25,-0.5)
     
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
        vec2(0.0,0.5),
        vec2(-0.5,0.0),
        vec2(-0.25,0.0),
        vec2(-0.25,-0.5),
        vec2(0.25,-0.5),
        vec2(0.25,0.0),
        vec2(0.5,0.0),
        vec2(0.0,0.5) 
    ]
  
    var cusor_line_color=[
        vec4(0.0,0.0,0.0,1.0),
        vec4(0.0,0.0,0.0,1.0),
        vec4(0.0,0.0,0.0,1.0),
        vec4(0.0,0.0,0.0,1.0),
        vec4(0.0,0.0,0.0,1.0),
        vec4(0.0,0.0,0.0,1.0),
        vec4(0.0,0.0,0.0,1.0),
        vec4(0.0,0.0,0.0,1.0)
    ]
  




// using mouse click down
    canvas.addEventListener("click",function(event){
        var p= vec2(2*event.clientX/canvas.width -1,
            2*(canvas.height-event.clientY)/canvas.height-1);
    //    alert(1/Math.tan(event.clientX/event.clientY));
            theta = 1/Math.tan(event.clientX/event.clientY);
            // alert(event.clientX/event.clientY);
        //30도 theta = cot(x/y)
    //   theta+=0.523;
      gl.uniform1f(thetaLoc, theta);
      object();
    });
    object();
    function object(){

        draw(gl.TRIANGLES, cusor, cusor_color,[0.0,0.0,0.0,5.5]);
        draw(gl.LINE_STRIP, cusor_line, cusor_line_color,[0.0,0.0,0.0,5.5] )
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