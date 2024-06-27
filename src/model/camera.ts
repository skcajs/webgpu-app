import { vec3, mat4 } from "gl-matrix"
import { deg2Rad } from "./maths"

export class Camera {
    position: vec3;
    eulers: vec3;
    view: mat4;
    forward: vec3;
    right: vec3;
    up: vec3;

    constructor(position: vec3, theta: number, phi: number) {
        this.position = position;
        this.eulers = [0, phi, theta];
        this.forward = vec3.create();
        this.right = vec3.create();
        this.up = vec3.create();

        this.view = undefined!;
    }

    update() {

        this.forward = [
            Math.cos(deg2Rad(this.eulers[2])) * Math.cos(deg2Rad(this.eulers[1])),
            Math.sin(deg2Rad(this.eulers[2])) * Math.cos(deg2Rad(this.eulers[1])),
            Math.sin(this.eulers[1])
        ];

        vec3.cross(this.right, this.forward, [0, 0, 1]);

        vec3.cross(this.up, this.right, this.forward);

        var target: vec3 = vec3.create();
        vec3.add(target, this.position, this.forward);
        this.view = mat4.create();
        mat4.lookAt(this.view, this.position, target, this.up);
    }

    getView(): mat4 {
        return this.view;
    }
}