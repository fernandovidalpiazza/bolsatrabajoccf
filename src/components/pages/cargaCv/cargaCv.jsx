import { Button, TextField, Box } from "@mui/material";
import { useState, useEffect } from "react";
import { db, auth, uploadFile } from "../../../firebaseConfig";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import Swal from "sweetalert2";
import { Navigate, useNavigate } from "react-router-dom";

const CargaCv = ({ handleClose, setIsChange, updateDashboard }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [newCv, setNewCv] = useState({
    Nombre: "",
    Apellido: "",
    Edad: "",
    Profesion: "",
    Ciudad: "",
    Email: "", // Nuevo campo para el correo electrónico
    Foto: "",
    cv: "",
    estado: "pendiente",
  });

  const [imageFile, setImageFile] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isCvLoaded, setIsCvLoaded] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        checkIfCvExists(currentUser.uid);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const checkIfCvExists = async (uid) => {
    const cvCollection = collection(db, "cv");
    const q = query(cvCollection, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      Swal.fire({
        icon: "warning",
        title: "CV Ya Enviado",
        text: "Usted ya ha enviado un CV.",
        timer: 2000,
        timerProgressBar: true,
      }).then(() => {
        navigate("/");
      });
    }
  };

  const handleImage = async () => {
    setIsLoading(true);
    let url = await uploadFile(imageFile);
    setNewCv({ ...newCv, Foto: url });
    setIsImageLoaded(true);
    setIsLoading(false);
  };

  const handleCv = async () => {
    setIsLoading(true);
    let url = await uploadFile(cvFile);
    setNewCv({ ...newCv, cv: url });
    setIsCvLoaded(true);
    setIsLoading(false);
  };

  const handleChange = (e) => {
    setNewCv({
      ...newCv,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const cvCollection = collection(db, "cv");

    try {
      await addDoc(cvCollection, { ...newCv, uid: user.uid });
      Swal.fire({
        icon: "info",
        title: "CV Enviado",
        text: "Tu CV está en proceso de revisión. Te enviaremos un correo electrónico cuando se acepte.",
      });
      setIsChange((prev) => !prev);
      handleClose();
      updateDashboard();
    } catch (error) {
      console.error("Error adding document: ", error);
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
      <TextField
        variant="outlined"
        label="Nombre"
        name="Nombre"
        value={newCv.Nombre}
        onChange={handleChange}
        required // Campo requerido
        fullWidth
      />
      <TextField
        variant="outlined"
        label="Apellido"
        name="Apellido"
        value={newCv.Apellido}
        onChange={handleChange}
        required // Campo requerido
        fullWidth
      />
      <TextField
        variant="outlined"
        label="Edad"
        name="Edad"
        value={newCv.Edad}
        onChange={handleChange}
        required // Campo requerido
        fullWidth
      />
      <TextField
        variant="outlined"
        label="Profesión"
        name="Profesion"
        value={newCv.Profesion}
        onChange={handleChange}
        required // Campo requerido
        fullWidth
      />
      <TextField
        variant="outlined"
        label="Ciudad"
        name="Ciudad"
        value={newCv.Ciudad}
        onChange={handleChange}
        required // Campo requerido
        fullWidth
      />
      <TextField
        variant="outlined"
        type="email"
        label="Correo Electrónico" // Campo de correo electrónico
        name="Email"
        value={newCv.Email}
        onChange={handleChange}
        required // Campo requerido
        fullWidth
      />
      <TextField
        type="file"
        label="Foto"
        onChange={(e) => setImageFile(e.target.files[0])}
        InputLabelProps={{
          shrink: true,
        }}
        helperText="Ninguna foto seleccionada"
        required // Campo requerido
        fullWidth
      />
      {imageFile && (
        <Button onClick={handleImage} type="button">
          Cargar foto
        </Button>
      )}
      <TextField
        type="file"
        label="CV"
        onChange={(e) => setCvFile(e.target.files[0])}
        InputLabelProps={{
          shrink: true,
        }}
        helperText="Ningún CV seleccionado"
        required // Campo requerido
        fullWidth
      />
      {cvFile && (
        <Button onClick={handleCv} type="button">
          Cargar CV
        </Button>
      )}
      {!isLoading && isImageLoaded && isCvLoaded && (
        <Button variant="contained" type="submit">
          Crear
        </Button>
      )}
    </Box>
  );
};

export default CargaCv;
