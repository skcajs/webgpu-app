import { vec2, vec3 } from "gl-matrix";

export class ObjectMesh {

    buffer: GPUBuffer
    bufferLayout: GPUVertexBufferLayout
    v: vec3[]
    vt: vec2[]
    vn: vec3[]
    vertices: Float32Array;
    vertexCount: number;

    constructor() {
        this.v = [];
        this.vt = [];
        this.vn = [];

        this.buffer = undefined!;
        this.bufferLayout = undefined!;
        this.vertices = undefined!;
        this.vertexCount = undefined!;
    }

    async initialise(device: GPUDevice, url: string) {
        // x y z u v
        await this.readFile(url);
        this.vertexCount = this.vertices.length / 5;

        const usage: GPUBufferUsageFlags = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST;

        const descriptor: GPUBufferDescriptor = {
            size: this.vertices.byteLength,
            usage,
            mappedAtCreation: true
        };

        this.buffer = device.createBuffer(descriptor);

        new Float32Array(this.buffer.getMappedRange()).set(this.vertices);
        this.buffer.unmap();

        this.bufferLayout = {
            arrayStride: 20,
            attributes: [
                {
                    shaderLocation: 0,
                    format: "float32x3",
                    offset: 0
                },
                {
                    shaderLocation: 1,
                    format: "float32x2",
                    offset: 12
                }
            ]
        }
    }

    async readFile(url: string) {

        var result: number[] = [];

        const response: Response = await fetch(url);
        const blob: Blob = await response.blob();
        const fileContents = (await blob.text());
        const lines = fileContents.split("\n");
        lines.forEach(line => {
            if (line[0] == "v" && line[1] == " ") {
                this.readVertexLine(line);
            } else if (line[0] == "v" && line[1] == "t") {
                this.readTexCoordLine(line);
            } else if (line[0] == "v" && line[1] == "n") {
                this.readTexCoordLine(line);
            } else if (line[0] == "f") {
                this.readFaceLine(line, result);
            }
        })

        this.vertices = new Float32Array(result);
    }

    readVertexLine(line: string) {
        const components = line.split(" ");
        const newVertex: vec3 = [
            Number(components[1]).valueOf(),
            Number(components[2]).valueOf(),
            Number(components[3]).valueOf(),
        ]

        this.v.push(newVertex);
    }

    readTexCoordLine(line: string) {
        const components = line.split(" ");
        const newTextCoord: vec2 = [
            Number(components[1]).valueOf(),
            Number(components[2]).valueOf()
        ]

        this.vt.push(newTextCoord);
    }

    readNormalLine(line: string) {
        const components = line.split(" ");
        const newNormal: vec3 = [
            Number(components[1]).valueOf(),
            Number(components[2]).valueOf(),
            Number(components[3]).valueOf()
        ]

        this.vn.push(newNormal);
    }

    readFaceLine(line: string, result: number[]) {
        line = line.replace("\n", ""); // Just to be safe
        const vertexDescriptions = line.split(" ");

        const triangleCount = vertexDescriptions.length - 3; // Number of triangles is n of vertices - 2, minus the first element (f)

        for (let i = 0; i < triangleCount; ++i) {
            this.readCorner(vertexDescriptions[1], result);
            this.readCorner(vertexDescriptions[2 + i], result);
            this.readCorner(vertexDescriptions[3 + i], result);
        }
    }

    readCorner(vertexDescription: string, result: number[]) {
        const vvtvn = vertexDescription.split("/");
        const v = this.v[Number(vvtvn[0]).valueOf() - 1];
        const vt = this.vt[Number(vvtvn[1]).valueOf() - 1];
        result.push(v[0]);
        result.push(v[1]);
        result.push(v[2]);
        result.push(vt[0]);
        result.push(vt[1]);
    }
}