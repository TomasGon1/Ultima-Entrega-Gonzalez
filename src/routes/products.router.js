const express = require("express");
const router = express.Router();

const ProductManager = require("../controllers/product-manager-db.js");
const productManager = new ProductManager();

//Lista de productos
router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const products = await productManager.getProducts({
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
    res.status(500).json({ status: "error", error: "Error del servidor" });
  }
});

//Traer producto por id
router.get("/:pid", async (req, res) => {
  let id = req.params.pid;

  try {
    const product = await productManager.getProductsById(id);

    if (!product) {
      res.json({ error: "Producto no encontrado" });
    }

    res.json(product);
  } catch (error) {
    console.log("Error al obtener el producto", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

//Agregar nuevo producto
router.post("/", async (req, res) => {
  const newPorduct = req.body;

  try {
    await productManager.addProducts(newPorduct);
    res.status(201).json({ message: "Producto agregado con exito" });
  } catch (error) {
    console.error("Error al agregar el producto", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

//Actualizar por id
router.put("/:pid", async (req, res) => {
  const id = req.params.pid;
  const updateProduct = req.body;

  try {
    await productManager.updateProducts(id, updateProduct);
    res.json({ message: "Prodcuto actualizado con exito!" });
  } catch (error) {
    console.error("Error al actualizar producto", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

//Eliminar producto
router.delete("/:pid", async (req, res) => {
  const id = req.params.pid;

  try {
    await productManager.deleteProductsById(id);
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    console.error("Error al elimiar producto", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

module.exports = router;
