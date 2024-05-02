const registerInfoError = (user) => {
  return `Datos invalidos, incompletos o existentes:
    Nombre: ${user.first_name},
    Apellido: ${user.last_name},
    Email: ${user.email},
    Contraseña,
    Edad: ${user.age}
    `;
};

const loginInfoError = (user) => {
  return `Datos invalidos o incorrectos:
    Email: ${user.email},
    Contraseña
    Vuelva a intentarlo!!
    `;
};

const cartInfoError = (cartId) => {
  return `Error al encontrar un carrito con ese ID: ${cartId.cart}, por favor vuelva a intentarlo!`;
};

const productInfoError = (productId) => {
  return `Error al encontrar un producto con el ID: ${productId.product}, por favor intente con otro producto`;
};

module.exports = {
    registerInfoError,
    loginInfoError,
    cartInfoError,
    productInfoError
}