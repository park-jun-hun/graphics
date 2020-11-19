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
var pace =1;
var position=0;
var xpoint=0;
var ypoint=0;
var slope=0;
var second_x=0;
var second_y=0;

window.onload = function init() {

    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }


    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var vPosition = gl.getAttribLocation(program, "vPosition");

    var vColor = gl.getAttribLocation(program, "vColor");
    var vertexColorBufferId = gl.createBuffer();
    var vOffset = gl.getUniformLocation(program, "vOffset");


    gl.viewport(0, 0, canvas.width, canvas.height);
    // background
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    thetaLoc = gl.getUniformLocation(program, "theta");


    //square
    var cursor = [

        vec2(0.0, 2.5),
        vec2(-0.5, 2.0),
        vec2(0.5, 2.0),

        vec2(-0.25, 2.0),
        vec2(-0.25, 1.5),
        vec2(0.25, 2.25),

        vec2(0.25, 2.25),
        vec2(-0.25, 1.5),
        vec2(0.25, 1.5)

    ];
    var cursor_color = [
        vec4(0.24, 0.7, 0.53, 1.0),
        vec4(0.24, 0.7, 0.53, 1.0),
        vec4(0.24, 0.7, 0.53, 1.0),
        vec4(0.24, 0.7, 0.53, 1.0),
        vec4(0.24, 0.7, 0.53, 1.0),
        vec4(0.24, 0.7, 0.53, 1.0),
        vec4(0.24, 0.7, 0.53, 1.0),
        vec4(0.24, 0.7, 0.53, 1.0),
        vec4(0.24, 0.7, 0.53, 1.0)
    ]
    var cursor_line = [
        vec2(0.0, 2.5),
        vec2(-0.5, 2.0),
        vec2(-0.25, 2.0),
        vec2(-0.25, 1.5),
        vec2(0.25, 1.5),
        vec2(0.25, 2.0),
        vec2(0.5, 2.0),
        vec2(0.0, 2.5)
    ]

    var cursor_line_color = [
        vec4(0.0, 0.0, 0.0, 1.0),
        vec4(0.0, 0.0, 0.0, 1.0),
        vec4(0.0, 0.0, 0.0, 1.0),
        vec4(0.0, 0.0, 0.0, 1.0),
        vec4(0.0, 0.0, 0.0, 1.0),
        vec4(0.0, 0.0, 0.0, 1.0),
        vec4(0.0, 0.0, 0.0, 1.0),
        vec4(0.0, 0.0, 0.0, 1.0),
        vec4(0.0, 0.0, 0.0, 1.0),
        vec4(0.0, 0.0, 0.0, 1.0),
        vec4(0.0, 0.0, 0.0, 1.0)
    ]

    var head = [
        vec2(0.0, 0.0),

        vec2(0.5, 1.0),
        vec2(-0.5, 1.0),

        vec2(-1.0, 0.5),
        vec2(-1.0, -0.5),

        vec2(-0.5, -1),
        vec2(0.5, -1),

        vec2(1.0, -0.5),
        vec2(1.0, 0.5),
        vec2(0.5, 1.0),

    ];

    var food = [
        vec2(0, 2),
        vec2(-2, 0),
        vec2(2, 0),
        vec2(-2, 1.5),
        vec2(0, -0.5),
        vec2(2, 1.5)
    ];

    var food_color = [
        vec4(0.0, 0.0, 0.7, 0.7),
        vec4(0.0, 0.0, 0.0, 1.0),
        vec4(0.0, 0.0, 0.7, 0.7),
        vec4(0.0, 0.0, 0.0, 1.0),
        vec4(0.0, 0.0, 0.7, 0.7),
        vec4(0.0, 0.0, 0.0, 1.0)
    ];

    var obstacle_color = [
        vec4(0.7, 0.0, 0.0, 0.7),
        vec4(0.0, 0.0, 0.0, 0.0),
        vec4(0.7, 0.0, 0.0, 0.7),
        vec4(0.0, 0.0, 0.0, 0.0),
        vec4(0.7, 0.0, 0.0, 0.7),
        vec4(0.0, 0.0, 0.0, 0.0)
    ];

    var head_color = [
        vec4(0.2, 0.4, 0.5, 1.0),
        vec4(0.2, 0.4, 0.5, 0.5),
        vec4(0.2, 0.4, 0.5, 0.5),
        vec4(0.2, 0.4, 0.5, 0.5),
        vec4(0.2, 0.4, 0.5, 0.5),
        vec4(0.2, 0.4, 0.5, 0.5),
        vec4(0.2, 0.4, 0.5, 0.5),
        vec4(0.2, 0.4, 0.5, 0.5),
        vec4(0.2, 0.4, 0.5, 0.5),
        vec4(0.2, 0.4, 0.5, 0.5)
    ]
    var right_eye = [
        vec2(3.0, 7.0),

        vec2(3.5, 8.0),
        vec2(2.5, 8.0),

        vec2(2.0, 7.5),
        vec2(2.0, 6.5),

        vec2(2.5, 6),
        vec2(3.5, 6),

        vec2(4.0, 6.5),
        vec2(4.0, 7.5),
        vec2(3.5, 8.0),
    ]
    var left_eye = [
        vec2(-3.0, 7.0),

        vec2(-2.5, 8.0),
        vec2(-3.5, 8.0),

        vec2(-4.0, 7.5),
        vec2(-4.0, 6.5),

        vec2(-3.5, 6),
        vec2(-2.5, 6),

        vec2(-2.0, 6.5),
        vec2(-2.0, 7.5),
        vec2(-2.5, 8.0),
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
    document.getElementById("Pause").onclick = function (event) {
        start = false;
    }
// click restart
    document.getElementById("Restart").onclick = function (event) {
        start = true;
        object();
    }
// select level
    document.getElementById("Difficulty").onclick = function (event) {
        switch (event.target.index) {
            case 0:
                alert("level1 The number of obstacles decreases!");
                break;
            case 1:
                alert("level2 Obstacles are created.");
                break;
            case 2:
                alert("level3 The number of obstacles increases!");
                break;
        }
    }
// using mouse click down
    canvas.addEventListener("mousemove", function (event) {
        if (start) {
            var p = vec2(2 * event.clientX / canvas.width - 1,
                2 * (canvas.height - event.clientY) / canvas.height - 1);
            var distance = Math.sqrt(p[0] * p[0] + p[1] * p[1]);

            if (p[0] > 0 && p[1] > 0) {
                theta = -1.57 + Math.acos(p[0] / distance);
            } else if (p[0] < 0 && p[1] > 0) {
                theta = -1.57 + Math.acos(p[0] / distance);
            } else if (p[0] < 0 && p[1] < 0) {
                theta = +1.57 + Math.acos(-p[0] / distance);
            } else {
                theta = +1.57 + Math.acos(-p[0] / distance);
            }
            // 30도
            // theta-=0.523;
            // 90도
            // theta -=1.57
            gl.uniform1f(thetaLoc, theta);
            object();
            //   move back ground
            xpoint += p[0] / 30;

            ypoint += p[1] / 30;

            slope = p[0] / p[1];
            second_x = Math.sqrt(1 / (slope * slope + 1));
            second_y = slope * second_x;
            if (p[0] < 0 && p[1] > 0) {
                second_x = -second_x;
                second_y = -second_y
            }
            if (p[0] > 0 && p[1] > 0) {
                second_x = -second_x;
                second_y = -second_y
            }


        }
    });

    object();

    function object() {
        var count = 0;
        var row = 0;
        position += pace;
        draw(gl.TRIANGLES, cursor, cursor_color, [0.0, 0.0, 0.0, 8.5]);
        draw(gl.LINE_STRIP, cursor_line, cursor_line_color, [0.0, 0.0, 0.0, 8.5]);


        draw(gl.TRIANGLE_FAN, right_eye, cursor_line_color, [0.0, 0.0, -1.0, 100.0]);
        draw(gl.TRIANGLE_FAN, left_eye, cursor_line_color, [0.0, 0.0, -1.0, 100.0]);

        // 고정값
        gl.uniform1f(thetaLoc, 0);
        // BODY
        for (count = 0; count < 10; count++) {
            if (count == 1) {
                draw(gl.TRIANGLE_FAN, head, head_color, [second_y, second_x, 0.0, 10 + count]);
            }

            draw(gl.TRIANGLE_FAN, head, head_color, [0.0, -count, 0.0, 10 + count]);

        }
        // back
        for (row = 1; row > -3; row -= 0.2) {
            for (count = -1; count < 2; count += 0.2) {
                if (xpoint > 0.15 || xpoint < -0.2) {
                    xpoint = 0;
                }
                if (ypoint > 0.15 || ypoint < -0.2) {
                    ypoint = 0;
                }
                draw(gl.LINE_LOOP, back, cursor_color, [-xpoint + count, -ypoint + row, 0.1, 0.0]);
            }
        }
        draw(gl.TRIANGLE_FAN, left_eye, cursor_line_color, [2.5, -6.0, 1.0, 0.1]);
        draw(gl.TRIANGLE_FAN, left_eye, cursor_line_color, [3.5, -6.0, 1.0, 0.1]);
        draw(gl.TRIANGLE_FAN, left_eye, cursor_line_color, [2.5, -7.5, 1.0, 0.1]);
        draw(gl.TRIANGLE_FAN, left_eye, cursor_line_color, [3.5, -7.5, 1.0, 0.1]);
    }

    var random = Math.random();
    for (i = -80; i < 80; i = i + random * 20) {
        for (j = -80; j < 80; j = j + random * 20) {
            random = Math.random();
            if (random > 0.6) {
                draw(gl.TRIANGLES, food, food_color, [i + (random * 10), j + (random * 10), 0.0, 50.0]);
            }
        }
    }

    document.getElementById("Difficulty").onclick = function (event) {
        if (event.target.index == 0) {
            var random = Math.random();
            for (i = -80; i < 80; i = i + random * 40) {
                for (j = -80; j < 80; j = j + random * 40) {
                    random = Math.random();
                    if (random > 0.6) {
                        draw(gl.TRIANGLES, food, obstacle_color, [i + (random * 10), j + (random * 10), 0.0, 50.0]);
                    }
                }
            }
        }
        if (event.target.index == 1) {
            var random = Math.random();
            for (i = -80; i < 80; i = i + random * 30) {
                for (j = -80; j < 80; j = j + random * 30) {
                    random = Math.random();
                    if (random > 0.6) {
                        draw(gl.TRIANGLES, food, obstacle_color, [i + (random * 10), j + (random * 10), 0.0, 50.0]);
                    }
                }
            }
        }
        if (event.target.index == 2) {
            var random = Math.random();
            for (i = -80; i < 80; i = i + random * 20) {
                for (j = -80; j < 80; j = j + random * 20) {
                    random = Math.random();
                    if (random > 0.6) {
                        draw(gl.TRIANGLES, food, obstacle_color, [i + (random * 10), j + (random * 10), 0.0, 50.0]);
                    }
                }
            }
        }
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

