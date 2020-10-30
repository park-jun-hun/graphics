var gl;
var points;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }


    //var vertices = new Float32Array([vec2(-1, -1), vec2(0, 1), vec2(1, -1)]);
    var vertices = [
        vec2(-0.8, 0.9),
        vec2(-0.85, 1.0),
        vec2(-0.95, 1.0),
        vec2(-1.0, 0.9),
        vec2(-0.95, 0.8),
        vec2(-0.85, 0.8),
        vec2(-0.8, 0.9)
    ];
    //  Configure WebGL

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate vertex data buffer with shader variables

    var vPosition = gl.getAttribLocation(program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var vOffset = gl.getUniformLocation(program, "vOffset");
    gl.uniform4fv(vOffset, [0,0,0,0])

    var vColor = gl.getUniformLocation(program, "vColor");
    gl.uniform4fv(vColor, [0,0,1,0.4])

    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.LINE_LOOP, 0, 6 );

    for ( x = 0.25; x < 2.0; x = x + 0.25) {
        for ( y = 0.0; y > -2.0; y = y - 0.25) {
            var bufferId1 = gl.createBuffer();
            gl.bindBuffer( gl.ARRAY_BUFFER, bufferId1 );
            gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
            draw(x, y);
    }
}
};

function draw(x, y){
    // Associate vertex data buffer with shader variables

    var vPosition = gl.getAttribLocation(program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var vOffset = gl.getUniformLocation(program, "vOffset");
    gl.uniform4fv(vOffset, [x,y,0,0])

    var vColor = gl.getUniformLocation(program, "vColor");
    gl.uniform4fv(vColor, [0,0,1,0.4])

    gl.drawArrays( gl.LINE_LOOP, 0, 6 );
}

