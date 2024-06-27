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

    forwardAmount: number;
    rightAmount: number;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.renderer = new Renderer(canvas);
        this.scene = new Scene();

        this.forwardAmount = 0;
        this.rightAmount = 0;

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
            this.scene.getCamera(),
            this.scene.getTriangles()
        )

        if (running) {
            requestAnimationFrame(this.run);
        }
    }

    handleKeyDown(event: JQuery.KeyDownEvent) {
        this.keyLabel.innerText = event.code;

        switch (event.code) {
            case "KeyW":
                this.forwardAmount = 0.02;
                break;
            case "KeyS":
                this.forwardAmount = -0.02;
                break;
            case "KeyA":
                this.rightAmount = -0.02;
                break;
            case "KeyD":
                this.rightAmount = 0.02;
        }
    }

    handleKeyUp(event: JQuery.KeyUpEvent) {
        this.keyLabel.innerText = event.code;

        switch (event.code) {
            case "KeyW":
                this.forwardAmount = 0;
                break;
            case "KeyS":
                this.forwardAmount = 0;
                break;
            case "KeyA":
                this.rightAmount = 0;
                break;
            case "KeyD":
                this.rightAmount = 0;
        }
    }

    handleMouseMove(event: MouseEvent) {
        this.mouseXLabel.innerText = event.clientX.toString();
        this.mouseYLabel.innerText = event.clientY.toString();

        this.scene.spinCamera(event.movementX / 10, event.movementY / 100);
    }
}