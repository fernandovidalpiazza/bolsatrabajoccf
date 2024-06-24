import { Button, TextField, Box, Select, MenuItem, Typography, LinearProgress } from "@mui/material";
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

  const professionsList = [
    "Ingeniero",
    "Doctor",
    "Abogado",
    "Carpintero",
    "Electricista",
    "Plomero",
    "Profesor",
    "Enfermero",
    "Contador",
    "Mecánico",
    "Empleada Domestica",
    "Administrativo",
    "Vendedor",
    "Albanil",
    "ventas",
    "Cajero",
    "Cocinero",
    "Metalurgico",  
    "Soldador", 
    "Vigilacia de Seguridad",
    "Estilista",
    "Recepcionista",
    "concinero",
    "Jardinero",
    "Peluquero",
    "Desarrollador de software",
    "otros oficios "



  ];

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

  const handleProfessionChange = (e) => {
    setNewCv({ ...newCv, Profesion: e.target.value });
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
      }).then(() => {
        navigate("/");

        setIsChange((prev) => !prev);
        handleClose();
        updateDashboard();
      });
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
        label=" Cargar foto de perfil"
        onChange={(e) => setImageFile(e.target.files[0])}
        InputLabelProps={{
          shrink: true,
        }}
        helperText="Cargar foto de perfil"
        required // Campo requerido
        fullWidth
      />
      {imageFile && (
        <Box sx={{ width: '100%' }}>
          <Button onClick={handleImage} type="button" disabled={isLoading || isImageLoaded}>
           Presione aqui para Confirmar carga de foto de perfil
          </Button>
          {isLoading && <LinearProgress />}
          {isImageLoaded && <Typography variant="body2" color="textSecondary">Cargado con éxito</Typography>}
        </Box>
      )}
      <TextField
        type="file"
        label="Cargar CV"
        onChange={(e) => setCvFile(e.target.files[0])}
        InputLabelProps={{
          shrink: true,
        }}
        helperText=" cargar curriculum vitae"
        required // Campo requerido
        fullWidth
      />
      {cvFile && (
        <Box sx={{ width: '100%' }}>
          <Button onClick={handleCv} type="button" disabled={isLoading || isCvLoaded}>
           Presione aqui para Confirmar Cargar CV
          </Button>
          {isLoading && <LinearProgress />}
          {isCvLoaded && <Typography variant="body2" color="textSecondary">Cargado con éxito</Typography>}
        </Box>
      )}
      {!isLoading && isImageLoaded && isCvLoaded && (
        <Button variant="contained" type="submit">
          Finalizar Carga
        </Button>
      )}
      <Box sx={{ marginTop: "20px", textAlign: "center" }}>
      <Typography variant="body1">
        En caso de que no puedas cargar tu CV, no te preocupes. Mándanos una foto de perfil y tu CV al correo 
        <Typography component="span" variant="body1" sx={{ fontWeight: "bold" }}> ccariramallo@gmail.com </Typography> 
        y nosotros lo cargamos por vos. Tene en cuenta que podemos demorar unos días, por favor, sé paciente.
      </Typography>
    </Box>
    </Box>
  );
};

export default CargaCv;
