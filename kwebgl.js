import KMatrix from "./kmatrix.js";

const TRIANGLE = [
  0.0, 0.0, 0.0,
  1.0, 0.0, 0.0,
  0.0, 1.0, 0.0,
];

export default class KWebGL {
  #canvas
  #gl
  constructor(id) {
    this.#canvas = document.getElementById(id);
    this.#canvas.width = 256;
    this.#canvas.height = 128;
    this.#gl = this.#canvas.getContext("webgl");

    let gl = this.#gl;
    let w = this.#canvas.width;
    let h = this.#canvas.height;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let vs = null, fs = null, pgm = null;
    fetch("./default.vert")
      .then(res => res.text())
      .then(vss => {
        vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, vss);
        gl.compileShader(vs);
        createProgram();
      });
    fetch("./default.frag")
      .then(res => res.text())
      .then(fss => {
        fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fs, fss);
        gl.compileShader(fs);
        createProgram();
      });
    function createProgram() {
      if (!vs || !fs) {
        return;
      }
      pgm = gl.createProgram();
      gl.attachShader(pgm, vs);
      gl.attachShader(pgm, fs);
      gl.linkProgram(pgm);
      gl.useProgram(pgm);
      
      generateTriangle();
    }

    function generateTriangle () {
      let attLocation = gl.getAttribLocation(pgm, "position");
      let attStride = 3;
      let vbo = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(TRIANGLE), gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);

      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.enableVertexAttribArray(attLocation);
      gl.vertexAttribPointer(attLocation, attStride, gl.FLOAT, false, 0, 0);

      let mMatrix = (new KMatrix()).setIdentity();
      let vMatrix = (new KMatrix()).setIdentity();
      let pMatrix = (new KMatrix()).setIdentity();
      let mvpMatrix = new KMatrix();

      KMatrix.translate(mMatrix, [0.0, 0.0, 0.0], mMatrix);
      KMatrix.lookAt([0.0, 0.0, 1.0], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0], vMatrix);
      KMatrix.perspective(90, w / h, 0.1, 100, pMatrix);

      KMatrix.multiply(pMatrix, vMatrix, mvpMatrix);
      KMatrix.multiply(mvpMatrix, mMatrix, mvpMatrix);

      let uniLocation = gl.getUniformLocation(pgm, "mvpMatrix");
      gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      gl.flush();

    }
    
    


  }
}

