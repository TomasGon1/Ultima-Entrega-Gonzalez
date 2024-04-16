const ProductModel = require("../models/product.model.js");

class ProductServices {
  async addProducts({
    title,
    description,
    price,
    img,
    code,
    stock,
    category,
    thumbnails,
  }) {
    try {
      if (!title || !description || !price || !code || !stock || !category) {
        console.log("Campos obligatorios");
        return;
      }

      const productExist = await ProductModel.findOne({ code: code });
      if (productExist) {
        console.log("El codigo debe ser unico");
        return;
      }

      const newProduct = new ProductModel({
        title,
        description,
        price,
        img,
        code,
        stock,
        category,
        status: true,
        thumbnails: thumbnails || [],
      });

      await newProduct.save();
    } catch (error) {
      console.log("Error al agregar el producto", error);
      throw error;
    }
  }

  async getProducts({ limit = 10, page = 1, sort, query } = {}) {
    try {
      const skip = (page - 1) * limit;

      let queryOptions = {};
      if (query) {
        queryOptions = { category: query };
      }

      const sortOptions = {};
      if (sort) {
        if (sort === "asc" || sort === "desc") {
          sortOptions.price = sort === "asc" ? 1 : -1;
        }
      }

      const products = await ProductModel.find(queryOptions)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);

      const totalProducts = await ProductModel.countDocuments(queryOptions);

      const totalPages = Math.ceil(totalProducts / limit);
      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;

      return {
        docs: products,
        totalPages,
        prevPage: hasPrevPage ? page - 1 : null,
        nextPage: hasNextPage ? page + 1 : null,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage
          ? `/api/products?limit=${limit}&page=${
              page - 1
            }&sort=${sort}&query=${query}`
          : null,
        nextLink: hasNextPage
          ? `/api/products?limit=${limit}&page=${
              page + 1
            }&sort=${sort}&query=${query}`
          : null,
      };
    } catch (error) {
      console.log("Error al obtener los productos", error);
      throw error;
    }
  }

  async getProductsById(id) {
    try {
      const products = await ProductModel.findById(id);

      if (!products) {
        console.log("Producto no encontrado");
        return null;
      }

      console.log("Producto encontrado!");
      return products;
    } catch (error) {
      console.log("Error al obtener el producto por ID", error);
      throw error;
    }
  }

  async updateProducts(id, productUpdate) {
    try {
      const updated = await ProductModel.findByIdAndUpdate(id, productUpdate);

      if (!updated) {
        console.log("Producto no encontrado");
        return null;
      }

      console.log("Producto actualizado con exito!");
      return updated;
    } catch (error) {
      console.log("Error al actualizar el producto", error);
      throw error;
    }
  }

  async deleteProductsById(id) {
    try {
      const deleteProduct = await ProductModel.findByIdAndDelete(id);

      if (!deleteProduct) {
        console.log("Producto no encontrado");
        return null;
      }

      console.log("Producto eliminado con exito!");
    } catch (error) {
      console.log("Error al eliminar el producto", error);
      throw error;
    }
  }
}

module.exports = ProductServices;