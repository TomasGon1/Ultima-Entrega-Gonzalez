const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();

//Custom Errors:
const { productInfoError } = require("../services/errors/info.js");
const { EErrors } = require("../services/errors/enums.js");
const CustomError = require("../services/errors/custom-error.js");

class ProductController {
  async addProducts(req, res) {
    const newProduct = req.body;
    try {
      const result = await productRepository.addProducts(newProduct);
      res.json(result);
    } catch (error) {
      console.error("Error al agregar el producto", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async getProducts(req, res) {
    try {
      const { limit = 10, page = 1, sort, query } = req.query;

      const products = await productRepository.getProducts({
        limit: parseInt(limit),
        page: parseInt(page),
        sort,
        query,
      });

      res.json({
        status: "success",
        payload: products,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: products.hasPrevPage
          ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}`
          : null,
        nextLink: products.hasNextPage
          ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}`
          : null,
      });
    } catch (error) {
      console.log("Error al obtener los productos", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async getProductsById(req, res) {
    const id = req.params.pid;
    try {
      const product = await productRepository.getProductsById(id);
      if (!product) {
        throw CustomError.createError({
          name: "Invalid product ID",
          cause: productInfoError(product),
          message: "Error al encontrar ese producto",
          code: EErrors.PRODUCT_ERROR,
        });
      }
      res.json(product);
    } catch (error) {
      console.log("Error al obtener el producto", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async updateProducts(req, res) {
    const id = req.params.pid;
    const updateProduct = req.body;
    try {
      const result = await productRepository.updateProducts(id, updateProduct);
      res.json({ result, message: "Producto actualizado con exito!" });
    } catch (error) {
      console.error("Error al actualizar producto", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async deleteProductsById(req, res) {
    const id = req.params.pid;
    try {
      const result = await productRepository.deleteProductsById(id);
      res.json({ result, message: "Producto eliminado con exito!" });
    } catch (error) {
      console.error("Error al elimiar producto", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}

module.exports = ProductController;
