import { vec3, mat4 } from "gl-matrix"
import { Triangle } from "./triangle";
import { Camera } from "./camera";

export class Scene {
    triangles: Triangle[];
    camera: Camera;
    objectData: Float32Array;
    triangleCount: number;

    constructor() {
        this.triangles = [];
        this.objectData = new Float32Array(16 * 1024);
        this.triangleCount = 0;

        let i: number = 0;
        for (let y: number = -5; y < 5; y++) {
            this.triangles.push(
                new Triangle(
                    [2, y, 0],
                    0
                )
            );

            // Initialise objectData to a load of identity matrices
            let blankMatrix = mat4.create();
            for (let j: number = 0; j < 16; j++) {
                this.objectData[16 * i + j] = <number>blankMatrix[j];
            }
            ++i;
            this.triangleCount++;
        }

        this.camera = new Camera(
            [-2, 0, 0.5], 0, 0
        );
    }

    update() {
        let i: number = 0;
        this.triangles.forEach(triangle => {
            triangle.update()
            let model = triangle.getModel();
            for (let j: number = 0; j < 16; j++) {
                this.objectData[16 * i + j] = <number>model[j];
            }
            ++i;
        });

        this.camera.update();
    }

    orbitCamera(dx: number, dy: number) {
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

    getTriangles(): Float32Array {
        return this.objectData;
    }
}