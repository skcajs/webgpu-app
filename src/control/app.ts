import { Renderer } from "../view/renderer";
import { Scene } from "../model/scene";
import $ from "jquery";

export class App {
    canvas: HTMLCanvasElement;
    renderer: Renderer;
    scene: Scene;

    keyLabel: HTMLElement;
    mouseXLabel: HTMLElement;
    mouseYLabel: HTMLElement;

    keysPressed: Set<string>;
    speed: number;
    forwardAmount: number;
    rightAmount: number;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.renderer = new Renderer(canvas);
        this.scene = new Scene();

        this.speed = 0.02;
        this.forwardAmount = 0;
        this.rightAmount = 0;
        this.keysPressed = new Set();

        this.keyLabel = <HTMLElement>document.getElementById("key-label");
        $(document).on("keydown", (event => this.handleKeyDown(event)));
        $(document).on("keyup", (event => this.handleKeyUp(event)));

        this.mouseXLabel = <HTMLElement>document.getElementById("mouse-x-label");
        this.mouseYLabel = <HTMLElement>document.getElementById("mouse-y-label");
        this.canvas.onclick = () => {
            this.canvas.requestPointerLock();
        }
        this.canvas.addEventListener("mousemove", (event) => { this.handleMouseMove(event) });


    }

    async initialise() {
        await this.renderer.initialize();
    }

    run = () => {
        var running: boolean = true;

        this.scene.update();
        this.scene.moveCamera(this.forwardAmount, this.rightAmount);

        this.renderer.render(
            this.scene.getRenderables()
        );

        if (running) {
            requestAnimationFrame(this.run);
        }
    }

    handleKeyDown(event: JQuery.KeyDownEvent) {
        this.keyLabel.innerText = event.code;
        this.keysPressed.add(event.code);

        this.updateSpeed();
        this.updateMovement();
    }

    handleKeyUp(event: JQuery.KeyUpEvent) {
        this.keyLabel.innerText = event.code;
        this.keysPressed.delete(event.code);

        this.updateSpeed();
        this.updateMovement();
    }

    updateSpeed() {
        if (this.keysPressed.has("ShiftLeft")) {
            this.speed = 0.04;
        } else {
            this.speed = 0.02;
        }
    }

    updateMovement() {
        if (this.keysPressed.has("KeyW")) {
            this.forwardAmount = this.speed;
        } else if (this.keysPressed.has("KeyS")) {
            this.forwardAmount = -this.speed;
        } else {
            this.forwardAmount = 0;
        }

        if (this.keysPressed.has("KeyA")) {
            this.rightAmount = -this.speed;
        } else if (this.keysPressed.has("KeyD")) {
            this.rightAmount = this.speed;
        } else {
            this.rightAmount = 0;
        }
    }

    handleMouseMove(event: MouseEvent) {
        this.mouseXLabel.innerText = event.clientX.toString();
        this.mouseYLabel.innerText = event.clientY.toString();
        if (document.pointerLockElement === this.canvas) {
            this.scene.orbitCamera(event.movementX * 0.1, event.movementY * -0.005);
        }
    }
}