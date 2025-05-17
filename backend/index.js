const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

app.post("/sendRegistrationEmails", async (req, res) => {
  try {
    const { email, nombre, ciudad } = req.body;

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
      return res.status(400).json({ success: false, error: "Ciudad no soportada" });
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

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en el puerto ${PORT}`);
});
