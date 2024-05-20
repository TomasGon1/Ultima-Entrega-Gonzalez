const socket = require("socket.io");
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
const MessageModel = require("../models/message.model.js");

class SocketManager {
    constructor(httpServer) {
        this.io = socket(httpServer);
        this.initSocketEvents();
    }

    async initSocketEvents() {
        this.io.on("connection", async (socket) => {
            console.log("Se conecto un cliente");

            socket.emit("products", await productRepository.getProducts());

            socket.on("deleteProduct", async (id) => {
                await productRepository.deleteProductsById(id);
                this.emitUpdatedProducts(socket);
            });

            socket.on("addProduct", async (product) => {
                await productRepository.addProducts(product);
                this.emitUpdatedProducts(socket);
            });

            socket.on("message", async (data) => {
                await MessageModel.create(data);
                const messages = await MessageModel.find();
                socket.emit("message", messages);
            });
        });
    }

    async emitUpdatedProducts(socket) {
        socket.emit("products", await productRepository.getProducts());
    }
}

module.exports = SocketManager;