import { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import { getDocs, collection } from "firebase/firestore";
import { Card, CardContent, CardMedia, Typography, Button } from "@mui/material";

const ItemListContainer = () => {
  const [cvs, setCvs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "cv"));
        const cvsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCvs(cvsData);
      } catch (error) {
        console.error("Error fetching documents: ", error);
      }
    };

    fetchData();
  }, []);

  // Función para descargar el PDF
  const handleDownloadPDF = (url) => {
    window.open(url, "_blank");
  };

  // Función para mostrar el CV
  const handleShowCV = (cvId) => {
    const updatedCvs = cvs.map((cv) => {
      if (cv.id === cvId) {
        return { ...cv, showCV: true };
      }
      return cv;
    });
    setCvs(updatedCvs);
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
      <h1>Estoy todos los CV</h1>

      {cvs.map((cv) => (
        <Card key={cv.id} sx={{ maxWidth: 200 }}>
          <CardMedia
            component="img"
            height="140"
            image={cv.Foto}
            alt="CV Foto"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {cv.Nombre} {cv.Apellido}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Edad: {cv.Edad}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Profesión: {cv.Profesion}
            </Typography>
            {/* Condición para mostrar el botón adecuado */}
            {cv.showCV ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleDownloadPDF(cv.cv)}
              >
                Ver CV
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleShowCV(cv.id)}
              >
                Saber Más
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ItemListContainer;
