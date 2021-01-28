export default class KMatrix extends Float32Array {
  constructor() {
    super(16);
  }
  setIdentity() {
    this[ 0] = 1.0; this[ 1] = 0.0; this[ 2] = 0.0; this[ 3] = 0.0;
    this[ 4] = 0.0; this[ 5] = 1.0; this[ 6] = 0.0; this[ 7] = 0.0;
    this[ 8] = 0.0; this[ 9] = 0.0; this[10] = 1.0; this[11] = 0.0;
    this[12] = 0.0; this[13] = 0.0; this[14] = 0.0; this[15] = 1.0;
    return this;
  }
  static multiply(mat1, mat2, dest) {
    let
      mat1_00 = mat1[ 0], mat1_01 = mat1[ 4], mat1_02 = mat1[ 8], mat1_03 = mat1[12],
      mat1_10 = mat1[ 1], mat1_11 = mat1[ 5], mat1_12 = mat1[ 9], mat1_13 = mat1[13],
      mat1_20 = mat1[ 2], mat1_21 = mat1[ 6], mat1_22 = mat1[10], mat1_23 = mat1[14],
      mat1_30 = mat1[ 3], mat1_31 = mat1[ 7], mat1_32 = mat1[11], mat1_33 = mat1[15],
      mat2_00 = mat2[ 0], mat2_01 = mat2[ 4], mat2_02 = mat2[ 8], mat2_03 = mat2[12],
      mat2_10 = mat2[ 1], mat2_11 = mat2[ 5], mat2_12 = mat2[ 9], mat2_13 = mat2[13],
      mat2_20 = mat2[ 2], mat2_21 = mat2[ 6], mat2_22 = mat2[10], mat2_23 = mat2[14],
      mat2_30 = mat2[ 3], mat2_31 = mat2[ 7], mat2_32 = mat2[11], mat2_33 = mat2[15];
    dest[ 0] = mat1_00 * mat2_00 + mat1_01 * mat2_10 + mat1_02 * mat2_20 + mat1_03 * mat2_30;
    dest[ 1] = mat1_10 * mat2_00 + mat1_11 * mat2_10 + mat1_12 * mat2_20 + mat1_13 * mat2_30;
    dest[ 2] = mat1_20 * mat2_00 + mat1_21 * mat2_10 + mat1_22 * mat2_20 + mat1_23 * mat2_30;
    dest[ 3] = mat1_30 * mat2_00 + mat1_31 * mat2_10 + mat1_32 * mat2_20 + mat1_33 * mat2_30;
    dest[ 4] = mat1_00 * mat2_01 + mat1_01 * mat2_11 + mat1_02 * mat2_21 + mat1_03 * mat2_31;
    dest[ 5] = mat1_10 * mat2_01 + mat1_11 * mat2_11 + mat1_12 * mat2_21 + mat1_13 * mat2_31;
    dest[ 6] = mat1_20 * mat2_01 + mat1_21 * mat2_11 + mat1_22 * mat2_21 + mat1_23 * mat2_31;
    dest[ 7] = mat1_30 * mat2_01 + mat1_31 * mat2_11 + mat1_32 * mat2_21 + mat1_33 * mat2_31;
    dest[ 8] = mat1_00 * mat2_02 + mat1_01 * mat2_12 + mat1_02 * mat2_22 + mat1_03 * mat2_32;
    dest[ 9] = mat1_10 * mat2_02 + mat1_11 * mat2_12 + mat1_12 * mat2_22 + mat1_13 * mat2_32;
    dest[10] = mat1_20 * mat2_02 + mat1_21 * mat2_12 + mat1_22 * mat2_22 + mat1_23 * mat2_32;
    dest[11] = mat1_30 * mat2_02 + mat1_31 * mat2_12 + mat1_32 * mat2_22 + mat1_33 * mat2_32;
    dest[12] = mat1_00 * mat2_03 + mat1_01 * mat2_13 + mat1_02 * mat2_23 + mat1_03 * mat2_33;
    dest[13] = mat1_10 * mat2_03 + mat1_11 * mat2_13 + mat1_12 * mat2_23 + mat1_13 * mat2_33;
    dest[14] = mat1_20 * mat2_03 + mat1_21 * mat2_13 + mat1_22 * mat2_23 + mat1_23 * mat2_33;
    dest[15] = mat1_30 * mat2_03 + mat1_31 * mat2_13 + mat1_32 * mat2_23 + mat1_33 * mat2_33;
    return dest;
  }
  static scale(mat, vec, dest) {
    let temp = new KMatrix();
    temp[ 0] = vec[0];
    temp[ 5] = vec[1];
    temp[10] = vec[2];
    temp[15] = 1.0;
    return KMatrix.multiply(temp, mat, dest);
  }
  static translate(mat, vec, dest) {
    let temp = new KMatrix();
    temp[ 0] = 1.0;
    temp[ 5] = 1.0;
    temp[10] = 1.0;
    temp[15] = 1.0;
    temp[12] = vec[0];
    temp[13] = vec[1];
    temp[14] = vec[2];
    return KMatrix.multiply(temp, mat, dest);
  }
  static rotate(mat, angle, axis, dest) {
    let l = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);
    let n = [axis[0] / l, axis[1] / l, axis[2] / l];
    let temp = new KMatrix();
    let c = Math.cos(angle), s = Math.sin(angle);
    temp[ 0] = c + n[0] * n[0] * (1 - c);
    temp[ 1] = n[1] * n[0] * (1 - c) + n[2] * s;
    temp[ 2] = n[2] * n[0] * (1 - c) - n[1] * s;
    temp[ 3] = 0.0;
    temp[ 4] = n[0] * n[1] * (1 - c) - n[2] * s;
    temp[ 5] = c + n[1] * n[1] * (1 - c);
    temp[ 6] = n[2] * n[1] * (1 - c) + n[0] * s;
    temp[ 7] = 0.0;
    temp[ 8] = n[0] * n[2] * (1 - c) + n[1] * s;
    temp[ 9] = n[1] * n[2] * (1 - c) - n[0] * s;
    temp[10] = c + n[2] * n[2] * (1 - c);
    temp[11] = 0.0;
    temp[12] = 0.0;
    temp[13] = 0.0;
    temp[14] = 0.0;
    temp[15] = 1.0;
    return KMatrix.multiply(temp, mat, dest);
  }
  static lookAt(from, to, up, dest) {
    dest.setIdentity();
    KMatrix.translate(dest, [-from[0], -from[1], -from[2]], dest);
    let v = [to[0] - from[0], to[1] - from[1], to[2] - from[2]];
    let vl = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    v = [v[0] / vl, v[1] / vl, v[2] / vl];
    let ul = Math.sqrt(up[0] * up[0] + up[1] * up[1] + up[2] * up[2]);
    let u = [up[0] / ul, up[1] / ul, up[2] / ul];
    let uv = u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
    let c = 1 / Math.sqrt(1 - uv * uv);
    u = [(u[0] - uv * v[0]) * c, (u[1] - uv * v[1]) * c, (u[2] - uv * v[2]) * c];
    let inv00 = -(u[1] * v[2] - u[2] * v[1]);
    let inv10 = -(u[2] * v[0] - u[0] * v[2]);
    let inv20 = -(u[0] * v[1] - u[1] * v[0]);
    let inv01 = u[0];
    let inv11 = u[1];
    let inv21 = u[2];
    let inv02 = -v[0];
    let inv12 = -v[1];
    let inv22 = -v[2];
    let temp = new KMatrix();
    temp[ 0] = +(inv11 * inv22 - inv12 * inv21);
    temp[ 1] = -(inv10 * inv22 - inv12 * inv20);
    temp[ 2] = +(inv10 * inv21 - inv11 * inv20);
    temp[ 3] = 0;
    temp[ 4] = -(inv01 * inv22 - inv02 * inv21);
    temp[ 5] = +(inv00 * inv22 - inv02 * inv20);
    temp[ 6] = -(inv00 * inv21 - inv01 * inv20);
    temp[ 7] = 0;
    temp[ 8] = +(inv01 * inv12 - inv02 * inv11);
    temp[ 9] = -(inv00 * inv12 - inv02 * inv10);
    temp[10] = +(inv00 * inv11 - inv01 * inv10);
    temp[11] = 0;
    temp[12] = 0;
    temp[13] = 0;
    temp[14] = 0;
    temp[15] = 1;
    return KMatrix.multiply(temp,dest,dest);
  }
  static perspective(fovy, aspect, near, far, dest) {
    let t = Math.tan(fovy / 2);
    dest[ 0] = 1 / t / aspect;
    dest[ 1] = 0;
    dest[ 2] = 0;
    dest[ 3] = 0;
    dest[ 4] = 0;
    dest[ 5] = 1 / t;
    dest[ 6] = 0;
    dest[ 7] = 0;
    dest[ 8] = 0;
    dest[ 9] = 0;
    dest[10] = -(far + near) / (far - near);
    dest[11] = -1;
    dest[12] = 0;
    dest[13] = 0;
    dest[14] = -(far * near * 2) / (far - near);
    dest[15] = 0;
    return dest;
  }
}

