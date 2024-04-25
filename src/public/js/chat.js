const socket = io();
let user;
const chatBox = document.getElementById("cahtBox");

Swal.fire({
    title: "Identificate", 
    input: "text",
    text: "Ingresa un nombre para comenzar a chatear", 
    inputValidator: (value) => {
        return !value && "Necesitas escribir un nombre para continuar"
    }, 
    allowOutsideClick: false,
}).then( result => {
    user = result.value;
})

chatBox.addEventListener("keyup", (event) => {
    if(event.key === "Enter") {
        if(chatBox.value.trim().length > 0) {
            socket.emit("message", {user: user, message: chatBox.value});
            chatBox.value = "";
        }
    }
})

socket.on("message", data => {
    let log = document.getElementById("messages");
    let messages = "";

    data.forEach(message => {
        messages = messages + `${message.user} dice: ${message.message} <br>`
    });

    log.innerHTML = messages;
})