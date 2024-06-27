import { vec3 } from "gl-matrix"
import { Triangle } from "./triangle";
import { Camera } from "./camera";

export class Scene {
    triangles: Triangle[];
    camera: Camera;

    constructor() {
        this.triangles = [];
        this.triangles.push(
            new Triangle(
                [2, 0, 0],
                0
            )
        );

        this.camera = new Camera(
            [-2, 0, 0.5], 0, 0
        );
    }

    update() {
        this.triangles.forEach(triangle => triangle.update());
        this.camera.update();
    }

    spinCamera(dx: number, dy: number) {
        this.camera.eulers[2] -= dx;
        this.camera.eulers[2] %= 360;

        this.camera.eulers[1] = Math.min(89, Math.max(-89, this.camera.eulers[1] + dy));
    }

    moveCamera(forwardAmount: number, rightAmount: number) {
        vec3.scaleAndAdd(this.camera.position, this.camera.position, this.camera.forward, forwardAmount);
        vec3.scaleAndAdd(this.camera.position, this.camera.position, this.camera.right, rightAmount);
    }

    getCamera(): Camera {
        return this.camera;
    }

    getTriangles(): Triangle[] {
        return this.triangles;
    }
}