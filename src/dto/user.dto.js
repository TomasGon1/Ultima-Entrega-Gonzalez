class UserDTO {
    constructor(firstName, lastName, role, email, age, cart) {
        this.nombre = firstName;
        this.apellido = lastName;
        this.role = role;
        this.email = email;
        this.age = age;
        this.cart = cart;
    }
}

module.exports = UserDTO;