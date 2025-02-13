import React, { useState, useEffect } from "react";
import { Button, TextField, Box, Select, MenuItem, Typography } from "@mui/material";
import { db, auth, uploadFile } from "../../../firebaseConfig";
import { addDoc, collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { RingLoader } from "react-spinners";

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
    const cvCollection = collection(db, "cv");
    const q = query(cvCollection, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        setCurrentCv({ id: doc.id, ...doc.data() });
        setNewCv({ ...doc.data(), estado: "pendiente" });
      });
    }
  };

  const handleFileUpload = async (file, type) => {
    if (!file) return;
    if (type === "Foto") setLoadingImage(true);
    if (type === "cv") setLoadingCv(true);

    try {
      let url = await uploadFile(file);
      setNewCv((prevCv) => ({ ...prevCv, [type]: url }));
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
      if (type === "Foto") setLoadingImage(false);
      if (type === "cv") setLoadingCv(false);
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    handleFileUpload(file, type);
  };

  const handleChange = (e) => {
    setNewCv({
      ...newCv,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfessionChange = (e) => {
    setNewCv({ ...newCv, Profesion: e.target.value });
  };

  const handleCiudadChange = (e) => {
    setNewCv({ ...newCv, Ciudad: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      if (currentCv) {
        const cvDocRef = doc(db, "cv", currentCv.id);
        await setDoc(cvDocRef, { ...newCv, estado: "pendiente", uid: user.uid }, { merge: true });
        Swal.fire("CV Actualizado", "Tu CV ha sido actualizado y está en proceso de revisión.", "info");
      } else {
        await addDoc(collection(db, "cv"), { ...newCv, uid: user.uid });
        Swal.fire("CV Enviado", "Tu CV está en proceso de revisión.", "info");
      }
      navigate("/");
      setIsChange((prev) => !prev);
      handleClose();
      updateDashboard();
    } catch (error) {
      console.error("Error procesando el documento:", error);
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

      <Box sx={{ width: "100%" }}>
        <Typography variant="body1" sx={{ mb: 1 }}>Profesión</Typography>
        <Select value={newCv.Profesion} onChange={handleProfessionChange} displayEmpty fullWidth required>
          <MenuItem value="" disabled>Seleccione una profesión</MenuItem>
          {professionsList.map((profession, index) => (
            <MenuItem key={index} value={profession}>{profession}</MenuItem>
          ))}
        </Select>
      </Box>

      <Select value={newCv.Ciudad} onChange={handleCiudadChange} displayEmpty fullWidth required>
        <MenuItem value="" disabled>Seleccione una ciudad</MenuItem>
        <MenuItem value="San Nicolás de los Arroyos">San Nicolás de los Arroyos</MenuItem>
<MenuItem value="General Rojo">General Rojo</MenuItem>
<MenuItem value="Conesa">Conesa</MenuItem>
<MenuItem value="Erézcano">Erézcano</MenuItem>
<MenuItem value="Campos Salles">Campos Salles</MenuItem>
<MenuItem value="La Emilia">La Emilia</MenuItem>
<MenuItem value="Villa Esperanza">Villa Esperanza</MenuItem>
<MenuItem value="Villa Campi">Villa Campi</MenuItem>
<MenuItem value="Villa Canto">Villa Canto</MenuItem>
<MenuItem value="Villa Riccio">Villa Riccio</MenuItem>
<MenuItem value="Villa Hermosa">Villa Hermosa</MenuItem>
<MenuItem value="Villa María">Villa María</MenuItem>
<MenuItem value="Ramallo">Ramallo</MenuItem>
<MenuItem value="Villa Ramallo">Villa Ramallo</MenuItem>
<MenuItem value="Aguirrezabala">Aguirrezabala</MenuItem>
<MenuItem value="La Esperanza">La Esperanza</MenuItem>
<MenuItem value="La Querencia">La Querencia</MenuItem>
<MenuItem value="La Noria">La Noria</MenuItem>
<MenuItem value="La Invernada">La Invernada</MenuItem>
<MenuItem value="La Reina">La Reina</MenuItem>
<MenuItem value="La Stegman">La Stegman</MenuItem>
<MenuItem value="Costa Brava">Costa Brava</MenuItem>
<MenuItem value="El Júpiter">El Júpiter</MenuItem>
<MenuItem value="El Paraíso">El Paraíso</MenuItem>
<MenuItem value="Haras El Ombú">Haras El Ombú</MenuItem>
<MenuItem value="Las Bahamas">Las Bahamas</MenuItem>
<MenuItem value="Pérez Millán">Pérez Millán</MenuItem>

      </Select>

      <TextField type="email" label="Correo Electrónico" name="Email" value={newCv.Email} onChange={handleChange} required fullWidth />

      <TextField type="file" onChange={(e) => handleFileChange(e, "Foto")} helperText="Cargar foto de perfil" required fullWidth />
      {loadingImage && <RingLoader color="#36D7B7" size={40} />}
      {isImageLoaded && <Typography variant="body2">Foto cargada con éxito</Typography>}

      <TextField type="file" onChange={(e) => handleFileChange(e, "cv")} helperText="Cargar curriculum vitae" required fullWidth />
      {loadingCv && <RingLoader color="#36D7B7" size={40} />}
      {isCvLoaded && <Typography variant="body2">CV cargado con éxito</Typography>}

      {!isLoading && isImageLoaded && isCvLoaded && <Button variant="contained" type="submit">Finalizar Carga</Button>}

      <Box sx={{ marginTop: "20px", textAlign: "center" }}>
        <Typography variant="body1">Si no puedes cargar tu CV, envíalo a <strong>ccariramallo@gmail.com</strong> y lo subiremos por ti.</Typography>
      </Box>
    </Box>
  );
};

export default CargaCv;
