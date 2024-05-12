import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { db, uploadFile } from "../../../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";

const CvForm = ({
  handleClose,
  setIsChange,
  cvSelected,
  setCvSelected,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [newCv, setNewCv] = useState({
    Nombre: "",
    Apellido: "",
    Edad: "",
    Profesion: "",
    Foto: "",
    cv: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isCvLoaded, setIsCvLoaded] = useState(false);

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

    const cvCollection = collection(db, "cv");

    try {
      await addDoc(cvCollection, newCv);
      setIsChange(true);
      handleClose();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <TextField
          variant="outlined"
          label="Nombre"
          name="Nombre"
          value={newCv.Nombre}
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          label="Apellido"
          name="Apellido"
          value={newCv.Apellido}
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          label="Edad"
          name="Edad"
          value={newCv.Edad}
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          label="Profesión"
          name="Profesion"
          value={newCv.Profesion}
          onChange={handleChange}
        />
        <TextField
          type="file"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
        {imageFile && (
          <Button onClick={handleImage} type="button">
            Cargar imagen
          </Button>
        )}
        <TextField
          type="file"
          onChange={(e) => setCvFile(e.target.files[0])}
        />
        {cvFile && (
          <Button onClick={handleCv} type="button">
            Cargar CV
          </Button>
        )}
        {!isLoading && isImageLoaded && isCvLoaded && (
          <Button variant="contained" type="submit">
            {cvSelected ? "Modificar" : "Crear"}
          </Button>
        )}
      </form>
    </div>
  );
};

export default CvForm;
