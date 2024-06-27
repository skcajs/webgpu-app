import { vec3, mat4 } from "gl-matrix"
import { Triangle } from "./triangle";
import { Quad } from "./quad";
import { Camera } from "./camera";
import { objectTypes, RenderData } from "./definitions";

export class Scene {
    triangles: Triangle[];
    quads: Quad[];
    camera: Camera;
    objectData: Float32Array;
    triangleCount: number;
    quadCount: number;

    constructor() {
        this.triangles = [];
        this.quads = [];
        this.objectData = new Float32Array(16 * 1024);
        this.triangleCount = 0;
        this.quadCount = 0;

        this.makeTriangles();
        this.makeQuads();

        this.camera = new Camera(
            [-2, 0, 0.5], 0, 0
        );
    }

    makeTriangles() {
        let i: number = 0;
        for (let y: number = -5; y < 5; y++) {

            this.triangles.push(new Triangle([2, y, 0.75], 0));

            // Initialise objectData to a load of identity matrices
            let blankMatrix = mat4.create();
            for (let j: number = 0; j < 16; j++) {
                this.objectData[16 * i + j] = <number>blankMatrix[j];
            }
            ++i;
            this.triangleCount++;
        }
    }

    makeQuads() {
        let i: number = this.triangleCount
        for (let x: number = -10; x <= 10; ++x) {
            for (let y: number = -10; y <= 10; ++y) {

                this.quads.push(new Quad([x, y, 0]));

                // Initialise objectData to a load of identity matrices
                let blankMatrix = mat4.create();
                for (let j: number = 0; j < 16; j++) {
                    this.objectData[16 * i + j] = <number>blankMatrix[j];
                }
                ++i;
                this.quadCount++;
            }
        }
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

        this.quads.forEach(quad => {
            quad.update()
            let model = quad.getModel();
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

    getRenderables(): RenderData {
        return {
            viewTransform: this.camera.getView(),
            modelTransforms: this.objectData,
            objectCounts: {
                [objectTypes.TRIANGLE]: this.triangleCount,
                [objectTypes.QUAD]: this.quadCount
            }
        }
    }
}