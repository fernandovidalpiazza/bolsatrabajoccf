const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const cors = require("cors")({origin: true}); // Permite cualquier origen, o usa 'http://localhost:5173'

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

exports.sendRegistrationEmails = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Método no permitido");
    }

    try {
      const {email, nombre, ciudad} = req.body;

      let adminMail = "";
      let adminMsg = "";
      const userMsg = `¡Bienvenido/a ${nombre}! Gracias por registrarte en la Bolsa de Trabajo.`;

      if (ciudad === "San Nicolás") {
        adminMail = "coalicioncivicasannicolas@hotmail.com";
        adminMsg = `Se registró una persona de San Nicolás: ${nombre} (${email})`;
      } else if (ciudad === "Ramallo") {
        adminMail = "ccariramallo@gmail.com";
        adminMsg = `Se registró una persona de Ramallo: ${nombre} (${email})`;
      } else {
        return res.status(400).json({success: false, error: "Ciudad no soportada"});
      }

      await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: adminMail,
        subject: "Nuevo registro Bolsa de Trabajo",
        text: adminMsg,
      });

      await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: "Bienvenido/a Bolsa de Trabajo",
        text: userMsg,
      });

      return res.status(200).json({success: true});
    } catch (error) {
      console.error("Error al enviar correo:", error);
      return res.status(500).json({success: false, error: error.message});
    }
  });
});
