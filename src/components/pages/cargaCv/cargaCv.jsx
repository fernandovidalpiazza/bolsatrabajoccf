import React, { useState, useEffect } from "react";
import { Button, TextField, Box, Select, MenuItem, Typography } from "@mui/material";
import { db, auth, uploadFile } from "../../../firebaseConfig";
import { addDoc, collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { RingLoader } from "react-spinners";
import emailjs from '@emailjs/browser';

const CargaCv = ({ handleClose, setIsChange, updateDashboard }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [currentCv, setCurrentCv] = useState(null);
  const [newCv, setNewCv] = useState({
    Nombre: "",
    Apellido: "",
    Edad: "",
    Profesion: "",
    Ciudad: "",
    Email: "",
    Foto: "",
    cv: "",
    estado: "pendiente",
  });

  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isCvLoaded, setIsCvLoaded] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingCv, setLoadingCv] = useState(false);
  const navigate = useNavigate();

  const professionsList = [
    "Ingeniero", "Doctor", "Abogado", "Carpintero", "Electricista", "Plomero",
    "Profesor", "Enfermero", "Contador", "Mecánico", "Empleada Domestica",
    "Administrativo", "Vendedor", "Albanil", "ventas", "Cajero", "Cocinero",
    "Metalurgico", "Soldador", "Vigilacia de Seguridad", "Estilista",
    "Recepcionista", "cocinero", "Jardinero", "Peluquero", "Desarrollador de software",
    "Psicologo", "Acompañante Terapeutico", "Cuidado de personas mayores",
    "otros oficios"
  ];

  const citiesList = [
    "San Nicolás de los Arroyos",
    "Ramallo"
  ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchCurrentCv(currentUser.uid);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchCurrentCv = async (uid) => {
    try {
      const cvCollection = collection(db, "cv");
      const q = query(cvCollection, where("uid", "==", uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          setCurrentCv({ id: doc.id, ...doc.data() });
          setNewCv({ ...doc.data(), estado: "pendiente" });
        });
      }
    } catch (error) {
      Swal.fire("Error", "Error al obtener el CV actual.", "error");
    }
  };

  const handleFileUpload = async (file, type) => {
    if (!file) return;
    if (type === "Foto") setLoadingImage(true);
    if (type === "cv") setLoadingCv(true);

    try {
      let url = await uploadFile(file);
      setNewCv((prevCv) => ({ ...prevCv, [type]: url }));
      Swal.fire("Carga exitosa", `${type} cargado con éxito.`, "success");

      if (type === "Foto") {
        setIsImageLoaded(true);
        setLoadingImage(false);
      }
      if (type === "cv") {
        setIsCvLoaded(true);
        setLoadingCv(false);
      }
    } catch (error) {
      console.error(`Error al cargar ${type}:`, error);
      Swal.fire("Error", `Error al cargar ${type}. Inténtalo nuevamente.`, "error");
      if (type === "Foto") setLoadingImage(false);
      if (type === "cv") setLoadingCv(false);
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    handleFileUpload(file, type);
  };

  const handleChange = (e) => {
    setNewCv({ ...newCv, [e.target.name]: e.target.value });
  };

  // Función para enviar correo electrónico al usuario
  const sendUserEmail = async (userEmail, userName) => {
    try {
      const templateParams = {
        to_email: userEmail,
        to_name: userName,
        message: 'Su registro ha sido realizado con éxito. Su CV está en revisión y pronto estará disponible.',
        subject: 'Registro exitoso en Bolsa de Trabajo CCF',
      };

      // Obtener las variables de entorno
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_USER_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
      
      // Verificar si las variables están definidas
      if (serviceId && templateId && publicKey) {
        await emailjs.send(
          serviceId,
          templateId,
          templateParams,
          publicKey
        );
      } else {
        console.log('Configuración de EmailJS no completada. Saltando envío de correo al usuario.');
      }

      console.log('Correo enviado al usuario exitosamente');
    } catch (error) {
      console.error('Error al enviar correo al usuario:', error);
    }
  };

  // Función para enviar correo electrónico al administrador de Ramallo
  const sendAdminEmail = async (userName, userProfession, userCity) => {
    try {
      const templateParams = {
        to_email: 'ccariramallo@gmail.com', // Correo del administrador de Ramallo
        to_name: 'Administrador de Ramallo',
        message: `Hay un nuevo registro para aprobar:\n\nNombre: ${userName} ${newCv.Apellido}\nProfesión: ${userProfession}\nCiudad: ${userCity}\nEmail: ${newCv.Email}`,
        subject: 'Nuevo registro en Bolsa de Trabajo CCF',
      };

      // Obtener las variables de entorno
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
      
      // Verificar si las variables están definidas
      if (serviceId && templateId && publicKey) {
        await emailjs.send(
          serviceId,
          templateId,
          templateParams,
          publicKey
        );
      } else {
        console.log('Configuración de EmailJS no completada. Saltando envío de correo al administrador.');
      }

      console.log('Correo enviado al administrador exitosamente');
    } catch (error) {
      console.error('Error al enviar correo al administrador:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      let docRef;
      
      if (currentCv) {
        docRef = doc(db, "cv", currentCv.id);
        await setDoc(docRef, { ...newCv, estado: "pendiente", uid: user.uid }, { merge: true });
      } else {
        const docSnap = await addDoc(collection(db, "cv"), { ...newCv, uid: user.uid });
        docRef = docSnap;
      }

      try {
        // Verificar si EmailJS está configurado
        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const userTemplateId = import.meta.env.VITE_EMAILJS_USER_TEMPLATE_ID;
        const adminTemplateId = import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID;
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
        
        // Comprobar si tenemos la configuración completa
        const emailConfigured = serviceId && 
                              userTemplateId && userTemplateId !== 'template_id_usuario' && 
                              adminTemplateId && adminTemplateId !== 'template_id_admin' && 
                              publicKey && publicKey !== 'public_key';
        
        if (emailConfigured) {
          // Enviar correo al usuario independientemente de la ciudad
          await sendUserEmail(newCv.Email, newCv.Nombre);
          
          // Si la ciudad es Ramallo, enviar correo al administrador
          if (newCv.Ciudad === "Ramallo") {
            await sendAdminEmail(newCv.Nombre, newCv.Profesion, newCv.Ciudad);
          }
          console.log('Correos enviados exitosamente');
        } else {
          console.log('EmailJS no está completamente configurado. No se enviarán correos.');
          console.log('Para configurar EmailJS, completa los valores en el archivo .env');
        }
      } catch (emailError) {
        console.error("Error al enviar correos:", emailError);
        // Continuamos con el proceso aunque falle el envío de correos
      }
      // Para San Nicolás, por ahora solo enviamos al usuario
      // Cuando tengas el correo del administrador de San Nicolás, puedes agregar la lógica aquí

      await Swal.fire({
        title: "CV Enviado",
        text: "Su CV está en revisión. Pronto estará disponible.",
        icon: "info",
        confirmButtonText: "Aceptar"
      });

      navigate("/");
      setIsChange((prev) => !prev);
      handleClose();
      updateDashboard();
    } catch (error) {
      console.error("Error al procesar el CV:", error);
      Swal.fire("Error", "Hubo un problema al cargar el CV. Inténtalo nuevamente.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", display: "flex", flexDirection: "column", gap: "20px", alignItems: "center", justifyContent: "center" }}>
      <Typography variant="h4">{currentCv ? "Actualizar tu perfil y CV" : "Cargar perfil y tu CV"}</Typography>
      <TextField variant="outlined" label="Nombre" name="Nombre" value={newCv.Nombre} onChange={handleChange} required fullWidth />
      <TextField variant="outlined" label="Apellido" name="Apellido" value={newCv.Apellido} onChange={handleChange} required fullWidth />
      <TextField variant="outlined" label="Edad" name="Edad" value={newCv.Edad} onChange={handleChange} required fullWidth />
      <Select
        name="Profesion"
        value={newCv.Profesion || ""}
        onChange={(e) => setNewCv((prevCv) => ({ ...prevCv, Profesion: e.target.value }))}
        displayEmpty
        fullWidth
        required
      >
        <MenuItem value="" disabled>Seleccione una profesión</MenuItem>
        {professionsList.map((profession, index) => (
          <MenuItem key={index} value={profession}>{profession}</MenuItem>
        ))}
      </Select>
      <Select
        name="Ciudad"
        value={newCv.Ciudad || ""}
        onChange={(e) => setNewCv((prevCv) => ({ ...prevCv, Ciudad: e.target.value }))}
        displayEmpty
        fullWidth
        required
      >
        <MenuItem value="" disabled>Seleccione una ciudad</MenuItem>
        {citiesList.map((city, index) => (
          <MenuItem key={index} value={city}>{city}</MenuItem>
        ))}
      </Select>
      <TextField type="email" label="Correo Electrónico" name="Email" value={newCv.Email} onChange={handleChange} required fullWidth />
      <TextField type="file" onChange={(e) => handleFileChange(e, "Foto")} helperText="Cargar foto de perfil" required fullWidth />
      {loadingImage && <RingLoader color="#36D7B7" size={40} />}
      <TextField type="file" onChange={(e) => handleFileChange(e, "cv")} helperText="Cargar curriculum vitae" required fullWidth />
      {loadingCv && <RingLoader color="#36D7B7" size={40} />}
      {!isLoading && isImageLoaded && isCvLoaded && (
        <Button variant="contained" type="submit">Finalizar Carga</Button>
      )}
    </Box>
  );
};

export default CargaCv;
