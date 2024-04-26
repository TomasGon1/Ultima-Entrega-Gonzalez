const generateTicketCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const codeLength = 8;
    let code = "";

    for (let i = 0; i < codeLength; i++) {
        const ramdom = Math.floor(Math.ramdom() * characters.length);
        code += characters.charAt(ramdom);
    }

    const timebuy = Date.now().toString(36);
    return code + "-" + timebuy;
}

const buyTotal = (products) => {
    let total = 0;

    products.forEach(item => {
        total += item.products.price * item.quantity;
    })

    return total;
}

module.exports = {
    generateTicketCode,
    buyTotal
}