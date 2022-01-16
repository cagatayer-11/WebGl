
let gl;

let spin = false; // Control spinning
let angle = 0.0; // Angle for rotation operation

let scale = false; // Control scaling
let change = false; // Changing scale direction
let currentScale = [0.25, 0.25];

let spiral = false; // Control spiral motion
let back = false; // For returning to origin in spiral motion
let spiralAngle = 0.0;
let radius = 200; // Radius for spiral motion
let side = 300; // Side of motion
let distance = 0.0; // Distance from origin for spiral motion

main();
function main() {
    const canvas = document.querySelector("#glCanvas");
    gl = canvas.getContext("webgl2");

    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    animation(gl); // Start animation

    // Set the variables according to buttons
    document.getElementById("StartSpin").onclick = function () {
        spin = true;
    };
    document.getElementById("StopSpin").onclick = function () {
        spin = false;
    };
    document.getElementById("StartScale").onclick = function () {
        scale = true;
    };
    document.getElementById("StopScale").onclick = function () {
        scale = false;
    };
    document.getElementById("StartSpiral").onclick = function () {
        spiral = true ;
    };
    document.getElementById("StopSpiral").onclick = function () {
        spiral = false;
    };



}

function animation(){

    // Draw Face
    posFace();

    // Draw Left Eye
    posLeftEye();

    // Draw Right Eye
    posRightEye();

    // Draw mask's rectangle
    posMask();

    // Draw Upper Mask
    posArc({x: -0.61, y: 0.04}, {x: 0.0, y: 0.6}, {x: 0.62, y: 0.04});

    // Draw Lower Mask
    posArc({x: -0.61, y: -0.6}, {x: 0, y: -1.1}, {x: 0.62, y: -0.58});

    // Draw Ropes of Mask
    posArc({x: -0.1, y: -0.2}, {x: -1.86, y: 0.7}, {x: -0.1,y: -0.4});
    posArc({x: 0.1, y: -0.2}, {x: 1.86, y: 0.7}, {x: 0.1,y: -0.4});
    posArc({x: -0.49, y: -0.53}, {x: -0.93, y: -0.82}, {x: -0.49,y: -0.64});
    posArc({x: 0.49, y: -0.53}, {x: 0.93, y: -0.82}, {x: 0.49,y: -0.64});


    window.requestAnimationFrame(function() {
        if (spin){
            angle += document.getElementById("SpinInput").value*0.015;
        }

        if (scale){
            if(currentScale[0] >= 0.4){
                change = true;
            }
            else if (currentScale[0] <= 0.08){
                change = false;
            }

            if (change){
                currentScale[0]-=0.006;
                currentScale[1]-=0.006;
            }else {
                currentScale[0]+=0.006;
                currentScale[1]+=0.006;
            }
        }

        if (spiral){
            if (radius >=200){
                back = false;
            }else if (radius <=0) {
                back = true;
            }

            if (back){
                radius+=2;
                if (document.getElementById("SpiralInput").value === "0"){
                    distance += 0;
                }else {
                    distance += (radius/side)*0.01;
                }

            }else {
                radius-=2;
                if (document.getElementById("SpiralInput").value === "0"){
                    distance += 0;
                }else {
                    distance -= (radius/side)*0.01;
                }
            }

            if (document.getElementById("SpiralInput").value === "0"){
                spiral += 0;
            }else if (parseInt(document.getElementById("SpiralInput").value) < 0) {
                spiralAngle += (document.getElementById("SpiralInput").value*0.01)-0.1 ;
            }else {
                spiralAngle += (document.getElementById("SpiralInput").value*0.01)+0.1 ;
            }
        }
        animation();
    });


}

function posFace(){
    const positions = [];
    const stops = 360;

    for (let i = 0; i < stops; i++){
        positions.push(Math.cos(i * 2 * Math.PI/stops)); // x coord
        positions.push(Math.sin(i * 2 * Math.PI/stops)); // y coord
    }

    const colors = [];
    for (let i = 0; i <= stops+1; i++){
        colors.push(0.929, 0.831, 0.090,1.0);
    }
    draw(positions,colors);


}

function posLeftEye(){
    const positions = [-0.3,0.5];
    const stops = 360;

    for (let i = 0; i < stops+1; i++){
        positions.push(-0.3+(0.15*Math.cos(i * 2 * Math.PI/stops))); // x
        positions.push(0.5+(0.15*Math.sin(i * 2 * Math.PI/stops))); // y
    }

    const colors = [];
    for (let i = 0; i <= stops+1; i++){
        colors.push(0.231, 0.211, 0.078,1.0);
    }
    draw(positions,colors);


}

function posRightEye(){
    const positions = [0.3,0.5];
    const count = 360;

    for (let i = 0; i < count+1; i++){
        positions.push(0.3+(0.15*Math.cos(i * 2 * Math.PI/count))); // x
        positions.push(0.5+(0.15*Math.sin(i * 2 * Math.PI/count))); // y
    }

    const colors = [];
    for (let i = 0; i <= count+1; i++){
        colors.push(0.231, 0.211, 0.078,1.0);
    }
    draw(positions,colors);



}

function posMask(){

    const positions = [
        -0.6, 0.05, 0.6, 0.05, 0.6, -0.6,
        -0.6, 0.05, -0.6, -0.6, 0.6, -0.6
    ];

    const colors = [
        0.839, 0.878, 0.921, 1,
        0.839, 0.878, 0.921, 1,
        0.839, 0.878, 0.921, 1,
        0.839, 0.878, 0.921, 1,
        0.839, 0.878, 0.921, 1,
        0.839, 0.878, 0.921, 1,
        0.839, 0.878, 0.921, 1,
        0.839, 0.878, 0.921, 1
    ];

    draw(positions,colors);


}


function bezierCurve(t,P0,P1,P2){

    const x_ = (Math.pow(1 - t, 2) * P0.x) + (2 * (1 - t) * t * P1.x) + (Math.pow(t, 2) * P2.x);
    const y_ = (Math.pow(1 - t, 2) * P0.y) + (2 * (1 - t) * t * P1.y) + (Math.pow(t, 2) * P2.y);
    return{
        x:x_,y:y_
    }
    /*
        P = (1−t)**2 P1 + 2 (1−t)t P2 + t**2 P3
 */
}

function posArc(P0,P1,P2){
    const accuracy = 0.011;
    let positions = [P0.x, P0.y];
    let count = 0;
    for (let i = 0; i < 1; i += accuracy) {
        let p = bezierCurve(i, P0, P1, P2);
        positions.push(p.x, p.y);
        count++;
    }

    const colors = [];
    for (let i = 0; i <= count+1; i++){
        colors.push(0.839, 0.878, 0.921,1);
    }
    draw(positions,colors);
}

function draw(positions,colors){
    const shaderProgram = initShaderProgram(gl,vsSource,fsSource);
    gl.useProgram(shaderProgram);

    const positionBuffer =gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(positions),gl.STATIC_DRAW);
    gl.enableVertexAttribArray(gl.getAttribLocation(shaderProgram,"a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(shaderProgram,"a_position"),2,gl.FLOAT,false,0,0);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(colors),gl.STATIC_DRAW);
    gl.enableVertexAttribArray(gl.getAttribLocation(shaderProgram,"a_color"));
    gl.vertexAttribPointer(gl.getAttribLocation(shaderProgram,"a_color"),4,gl.FLOAT,false,0,
        0);


    gl.uniform2fv(gl.getUniformLocation(shaderProgram, "scalingFactor"), currentScale);
    gl.uniform1f(gl.getUniformLocation( shaderProgram, "angle" ),angle);
    gl.uniform1f(gl.getUniformLocation(shaderProgram,"spiralAngle"),spiralAngle);
    gl.uniform1f(gl.getUniformLocation(shaderProgram,"distance"),distance);
    gl.drawArrays(gl.TRIANGLE_FAN,0,positions.length/2);

}







