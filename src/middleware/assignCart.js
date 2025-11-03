const CartModel = require("../models/cart.model.js");
const UserModel = require("../models/user.model.js");

async function assignCartToUser(user) {
    if(!user.cart) {
        const newCart = await CartModel.create({ products: [] });
        user.cart = newCart._id;
        await user.save();
    }
}

module.exports = assignCartToUser;