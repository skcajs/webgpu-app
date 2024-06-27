import { vec3, mat4 } from "gl-matrix"
import { deg2Rad } from "./maths"

export class Statue {
    position: vec3;
    eulers: vec3;
    model: mat4;

    constructor(position: vec3, eulers: vec3) {
        this.position = position;
        this.eulers = eulers

        this.model = undefined!;
    }

    update() {
        this.eulers[2] += 1;
        this.eulers[2] %= 360;
        this.model = mat4.create();
        mat4.rotateX(this.model, this.model, deg2Rad(90));

        mat4.translate(this.model, this.model, this.position);
        mat4.rotateY(this.model, this.model, deg2Rad(this.eulers[2]));
    }

    getModel(): mat4 {
        return this.model;
    }
}