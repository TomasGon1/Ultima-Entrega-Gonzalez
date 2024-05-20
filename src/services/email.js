const nodemailer = require("nodemailer");

class EmailManager {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      auth: {
        user: "xnicksyux@gmail.com",
        pass: "zpve jvsk bxsl ozah",
      },
    });
  }

  async sendMailBuy(email, first_name, ticket) {
    try {
      const mailOpts = {
        from: "ecomerce <xnicksyux@gmail.com>",
        to: email,
        subject: "Confirmacion de compra",
        html: `
                        <h1>Confirmacion d ecompra</h1>
                        <p>Gracias por tu compra en Tienda Gamer, ${first_name}</p>
                        <p>Tu numero de orden es: ${ticket}</p>
                        `,
      };

      await this.transporter.sendMail(mailOpts);
    } catch (error) {
      console.error("Error al enviar el correo: ", error);
    }
  }

  async restorePassword(email, first_name, token) {
    try {
      const mailOpts = {
        form: "xnicksyux@gmail.com",
        to: email,
        subject: "Restablecimiento de contraseña",
        html: `
                        <h1>Restablecimiento de Contraseña</h1>
                        <p>${first_name} solicitaste restablecer tu contraseña. Utiliza el siguiente codigo:</p>
                        <p><strong>${token}</strong></p>
                        <p>Este codigo expirara en 1 hora.</p>
                        <a href="http://localhost:8080/password"> Restablecer Contraseña</a>
                        <p>Si no has sido tu, ignora este correo.</p>
                        `,
      };

      await this.transporter.sendMail(mailOpts);
    } catch (error) {
      console.error("Error al enviar correo: ", error);
      throw new Error("Error al enviar correro electronico");
    }
  }
}

module.exports = EmailManager;
