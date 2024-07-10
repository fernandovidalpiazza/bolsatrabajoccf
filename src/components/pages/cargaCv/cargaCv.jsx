import React, { useState, useEffect } from "react";
import { Button, TextField, Box, Select, MenuItem, Typography } from "@mui/material";
import { db, auth, uploadFile } from "../../../firebaseConfig";
import { addDoc, collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { RingLoader } from "react-spinners"; // Importa el spinner que deseas utilizar

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
  const [loadingImage, setLoadingImage] = useState(false); // Estado para el spinner de la imagen
  const [loadingCv, setLoadingCv] = useState(false); // Estado para el spinner del CV
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

  const handleImage = async (file) => {
    setLoadingImage(true); // Mostrar spinner de carga para imagen
    let url = await uploadFile(file);
    setNewCv((prevCv) => ({ ...prevCv, Foto: url }));
    setIsImageLoaded(true);
    setLoadingImage(false); // Ocultar spinner de carga para imagen
  };

  const handleCv = async (file) => {
    setLoadingCv(true); // Mostrar spinner de carga para CV
    let url = await uploadFile(file);
    setNewCv((prevCv) => ({ ...prevCv, cv: url }));
    setIsCvLoaded(true);
    setLoadingCv(false); // Ocultar spinner de carga para CV
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImage(file);
    }
  };

  const handleCvChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleCv(file);
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (currentCv) {
        const cvDocRef = doc(db, "cv", currentCv.id);
        await setDoc(cvDocRef, { ...newCv, estado: "pendiente", uid: user.uid }, { merge: true });
        Swal.fire({
          icon: "info",
          title: "CV Actualizado",
          text: "Tu CV ha sido actualizado y está en proceso de revisión.",
        }).then(() => {
          navigate("/");
          setIsChange((prev) => !prev);
          handleClose();
          updateDashboard();
        });
      } else {
        const cvCollection = collection(db, "cv");
        await addDoc(cvCollection, { ...newCv, uid: user.uid });
        Swal.fire({
          icon: "info",
          title: "CV Enviado",
          text: "Tu CV está en proceso de revisión. Te enviaremos un correo electrónico cuando se acepte.",
        }).then(() => {
          navigate("/");
          setIsChange((prev) => !prev);
          handleClose();
          updateDashboard();
        });
      }
    } catch (error) {
      console.error("Error processing document: ", error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h4">
        {currentCv ? "Actualizar tu perfil y CV" : "Cargar perfil y tu CV"}
      </Typography>
      <TextField
        variant="outlined"
        label="Nombre"
        name="Nombre"
        value={newCv.Nombre}
        onChange={handleChange}
        required
        fullWidth
      />
      <TextField
        variant="outlined"
        label="Apellido"
        name="Apellido"
        value={newCv.Apellido}
        onChange={handleChange}
        required
        fullWidth
      />
      <TextField
        variant="outlined"
        label="Edad"
        name="Edad"
        value={newCv.Edad}
        onChange={handleChange}
        required
        fullWidth
      />
      <Box sx={{ width: "100%" }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Profesión
        </Typography>
        <Select
          value={newCv.Profesion}
          onChange={handleProfessionChange}
          displayEmpty
          variant="outlined"
          fullWidth
          required
        >
          <MenuItem value="" disabled>
            Seleccione una profesión
          </MenuItem>
          {professionsList.map((profession, index) => (
            <MenuItem key={index} value={profession}>
              {profession}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <TextField
        variant="outlined"
        label="Ciudad"
        name="Ciudad"
        value={newCv.Ciudad}
        onChange={handleChange}
        required
        fullWidth
      />
      <TextField
        variant="outlined"
        type="email"
        label="Correo Electrónico"
        name="Email"
        value={newCv.Email}
        onChange={handleChange}
        required
        fullWidth
      />
      <TextField
        type="file"
        label="Cargar foto de perfil"
        onChange={handleImageChange}
        InputLabelProps={{
          shrink: true,
        }}
        helperText="Cargar foto de perfil"
        required
        fullWidth
      />
      {loadingImage && <RingLoader color="#36D7B7" size={40} />} {/* Spinner de carga para imagen */}
      {isImageLoaded && (
        <Typography variant="body2" color="textSecondary">
          Foto cargada con éxito
        </Typography>
      )}
      {isImageLoaded && (
        <Button onClick={() => setIsImageLoaded(false)}>
          Modificar Foto
        </Button>
      )}
      <TextField
        type="file"
        label="Cargar CV"
        onChange={handleCvChange}
        InputLabelProps={{
          shrink: true,
        }}
        helperText="Cargar curriculum vitae"
        required
        fullWidth
      />
      {loadingCv && <RingLoader color="#36D7B7" size={40} />} {/* Spinner de carga para CV */}
      {isCvLoaded && (
        <Typography variant="body2" color="textSecondary">
          CV cargado con éxito
        </Typography>
      )}
      {isCvLoaded && (
        <Button onClick={() => setIsCvLoaded(false)}>
          Modificar CV
        </Button>
      )}
      {!isLoading && isImageLoaded && isCvLoaded && (
        <Button variant="contained" type="submit">
          Finalizar Carga
        </Button>
      )}
      <Box sx={{ marginTop: "20px", textAlign: "center" }}>
        <Typography variant="body1">
          En caso de que no puedas cargar tu CV, no te preocupes. Mándanos una foto de perfil y tu CV al correo
          <Typography component="span" variant="body1" sx={{ fontWeight: "bold" }}>
            ccariramallo@gmail.com
          </Typography>
          y nosotros lo cargamos por vos. Tene en cuenta que podemos demorar unos días, por favor, sé paciente.
        </Typography>
      </Box>
    </Box>
  );
};

export default CargaCv;
