var gl, 
    shaderProgram,
    vertices,
    vertexCount = 5000;

initGL();
createShaders();
createVertices();
draw();


function initGL() {
  var canvas = document.getElementById('canvas');
  gl = canvas.getContext('webgl');
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1, 1, 1, 1);
}

function createShaders() {
  var vertexShader = getShader(gl, 'shader-vs');
  var fragmentShader = getShader(gl, 'shader-fs');

  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  gl.useProgram(shaderProgram);
}

function createVertices() {
  vertices = [];

  for (var i = 0; i < vertexCount; i++) {
    vertices.push(Math.random()*2 - 1);
    vertices.push(Math.random()*2 - 1);
  }

  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  var coords = gl.getAttribLocation(shaderProgram, 'coords');
  //gl.vertexAttrib3f(coords, 0, 0, 0);
  gl.vertexAttribPointer(coords, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(coords);
  //gl.bindBuffer(gl.ARRAY_BUFFER, null);

  var pointSize = gl.getAttribLocation(shaderProgram, 'pointSize');
  gl.vertexAttrib1f(pointSize, 3);

  var color = gl.getUniformLocation(shaderProgram, 'color');
  gl.uniform4f(color, 0, 0, 0, 1);
}

function draw() {
  for (var i = 0; i < vertexCount*2; i+=2) {
    vertices[i] += Math.random()*0.01 - 0.005;
    vertices[i+1] += Math.random()*0.01 - 0.005;
  }

  gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(vertices));
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, vertexCount);

  requestAnimationFrame(draw);
}


// From https://github.com/mdn/webgl-examples/blob/gh-pages/tutorial/sample2/webgl-demo.js
function getShader(gl, id) {
  var shaderScript = document.getElementById(id);

  // Didn't find an element with the specified ID; abort.

  if (!shaderScript) {
    return null;
  }

  // Walk through the source element's children, building the
  // shader source string.

  var theSource = "";
  var currentChild = shaderScript.firstChild;

  while(currentChild) {
    if (currentChild.nodeType == 3) {
      theSource += currentChild.textContent;
    }

    currentChild = currentChild.nextSibling;
  }

  // Now figure out what type of shader script we have,
  // based on its MIME type.

  var shader;

  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;  // Unknown shader type
  }

  // Send the source to the shader object

  gl.shaderSource(shader, theSource);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}