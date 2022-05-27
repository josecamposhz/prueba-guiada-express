const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
});

const sendMail = ({ email, nombre, auth }, nuevoUsuario = true) => {
    return new Promise(async (resolve, reject) => {
        let html = nuevoUsuario ? `<p>Hola, ${nombre}, bienvenido a la NASA, revisaremos tu historial y te notificaremos cuando estés habilitado.</p>`
            : auth
                ? `<p> Hola, ${nombre}, felicitaciones! Estás validado para subir fotos de extraterrestres.</p>`
                : `<p> Hola, ${nombre}, te informamos que fuiste deshabilitado para subir fotos.</p>`;

        let mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Saludos desde la NASA',
            html
        };

        transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
                console.log(err)
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

module.exports = sendMail;