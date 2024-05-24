import { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import { getDocs, collection } from "firebase/firestore";
import { Card, CardContent, CardMedia, Typography, Button, Select, MenuItem, Box } from "@mui/material";

const ItemListContainer = () => {
  const [cvs, setCvs] = useState([]);
  const [selectedProfession, setSelectedProfession] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [professions, setProfessions] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "cv"));
        const cvsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCvs(cvsData);

        // Obtener lista única de profesiones y ciudades
        const uniqueProfessions = [...new Set(cvsData.map(cv => cv.Profesion))];
        setProfessions(uniqueProfessions);
        
        const uniqueCities = [...new Set(cvsData.map(cv => cv.Ciudad))];
        setCities(uniqueCities);
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

  // Función para filtrar por profesión
  const handleProfessionChange = (event) => {
    setSelectedProfession(event.target.value);
  };

  // Función para filtrar por ciudad
  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <Box sx={{ width: "100%" }}>
        <Typography variant="h3">Estás interesado en encontrar un perfil de trabajo?</Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", gap: "20px" }}>
        <Box sx={{ width: "50%" }}>
          <Typography>Filtrar por profesión</Typography>
          <Select
            value={selectedProfession || ''}
            onChange={handleProfessionChange}
            displayEmpty
            variant="outlined"
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">
              Ver Todos
            </MenuItem>
            {professions.map((profession, index) => (
              <MenuItem key={index} value={profession}>{profession}</MenuItem>
            ))}
          </Select>
        </Box>
        <Box sx={{ width: "50%" }}>
          <Typography>Filtrar por Ciudad</Typography>
          <Select
            value={selectedCity || ''}
            onChange={handleCityChange}
            displayEmpty
            variant="outlined"
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">
              Ver Todos
            </MenuItem>
            {cities.map((city, index) => (
              <MenuItem key={index} value={city}>{city}</MenuItem>
            ))}
          </Select>
        </Box>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
      {cvs.filter(cv => cv.estado !== "pendiente" && cv.estado !== "no aprobado").map((cv) => (
          ((selectedProfession === "" || cv.Profesion === selectedProfession) && 
           (selectedCity === "" || cv.Ciudad === selectedCity)) && (
            <Card key={cv.id} sx={{ maxWidth: 300, marginBottom: "20px" }}>
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
          )
        ))}
      </Box>
    </Box>
  );
};

export default ItemListContainer;
