
var canvas;
var gl;

var NumVertices  = 36;
var texSize = 64;

var points = [];
var colors = [];
var tex = [];
var texture;
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;




var modelViewMatrixLoc;

var texCoord = [
    vec2(0,0),
    vec2(0,1),
    vec2(1,1),
    vec2(1,0)
]

//vertices definition
var vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ), // 0
    vec4( -0.5,  0.5,  0.5, 1.0 ), // 1
    vec4(  0.5,  0.5,  0.5, 1.0 ), // 2
    vec4(  0.5, -0.5,  0.5, 1.0 ), // 3
    vec4( -0.5, -0.5, -0.5, 1.0 ), // 4
    vec4( -0.5,  0.5, -0.5, 1.0 ), // 5
    vec4(  0.5,  0.5, -0.5, 1.0 ), // 6
    vec4(  0.5, -0.5, -0.5, 1.0 )  // 7
];
var square =[
    vec2(1,1),
    vec2(0,1),
    vec2(0,0),
    vec2(0,1)
]


function configureTexture(image) {
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D,texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.uniform1i(gl.getUniformLocation(program,"texture"), 0);
}


window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    colorCube();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // color array atrribute buffer
  

    // vertex array attribute buffer
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );


    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(tex), gl.STATIC_DRAW );


    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );

    var url = "https://media.giphy.com/media/3o6ozhxFlr4Ung40RG/giphy.gif";

    var image = new Image();
    image.onload = function() {
        configureTexture(image);
    }
    image.crossOrigin = "";
    image.src = url;

    //use modelViewMat for CTM

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );

    //event listeners for buttons x,Y,Z button
    // rendering
    document.getElementById( "xButton" ).onclick = function () {
        axis = xAxis;
        render();
    };
    document.getElementById( "yButton" ).onclick = function () {
        axis = yAxis;
        render();
    };
    document.getElementById( "zButton" ).onclick = function () {
        axis = zAxis;
        render();
    };

    render();
}

function colorCube()
{
    //express color of side
    quad( 1, 0, 3, 2 ); // blue

}

function quad(a, b, c, d)
{
    points.push(vertices[a]);

    tex.push(texCoord[0]);

    points.push(vertices[b]);

    tex.push(texCoord[1]);

    points.push(vertices[c]);
    tex.push(texCoord[2]);

    points.push(vertices[a]);
    tex.push(texCoord[0]);

    points.push(vertices[c]);
     tex.push(texCoord[2]);

    points.push(vertices[d]);
    tex.push(texCoord[3]);

}

function render()
{

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawArrays( gl.TRIANGLES, 0, 4 );
  
}
