// const createVertices = () => {
//     return new Float32Array([
//         0.0, 0.5, 1.0, 0.0, 0.0,
//         -0.5, -0.5, 0.0, 1.0, 0.0,
//         0.5, -0.5, 0.0, 0.0, 1.0
//     ]);
// }

// const createBuffer = (device: GPUDevice, vertices: Float32Array) => {
//     const usage = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST;

//     const descriptor = {
//         size: vertices.byteLength,
//         usage,
//         mappedAtCreation: true
//     };

//     const buffer = device.createBuffer(descriptor);
//     new Float32Array(buffer.getMappedRange()).set(vertices);
//     buffer.unmap();

//     return buffer;
// }

// const createBufferLayout = (): GPUVertexBufferLayout => {
//     return {
//         arrayStride: 20,
//         attributes: [
//             {
//                 shaderLocation: 0,
//                 format: "float32x2",
//                 offset: 0
//             },
//             {
//                 shaderLocation: 1,
//                 format: "float32x3",
//                 offset: 8
//             }
//         ]
//     };
// }

// export const createTriangleMesh = (device: GPUDevice) => {
//     const vertices = createVertices();
//     const buffer = createBuffer(device, vertices);
//     const bufferLayout: GPUVertexBufferLayout = createBufferLayout();

//     return { buffer, bufferLayout };
// }

export class TriangleMesh {

    buffer: GPUBuffer
    bufferLayout: GPUVertexBufferLayout

    constructor(device: GPUDevice) {
        // x y z u v
        const vertices: Float32Array = new Float32Array(
            [
                0.0, 0.0, 0.5, 0.5, 0.0,
                0.0, -0.5, -0.5, 0.0, 1.0,
                0.0, 0.5, -0.5, 1.0, 1.0
            ]
        )

        const usage: GPUBufferUsageFlags = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST;

        const descriptor: GPUBufferDescriptor = {
            size: vertices.byteLength,
            usage,
            mappedAtCreation: true
        };

        this.buffer = device.createBuffer(descriptor);

        new Float32Array(this.buffer.getMappedRange()).set(vertices);
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
}