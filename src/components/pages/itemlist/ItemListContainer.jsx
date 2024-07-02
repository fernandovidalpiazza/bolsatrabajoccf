import { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import { getDocs, collection } from "firebase/firestore";
import { Card, CardContent, CardMedia, Typography, Button, Select, MenuItem, Box, Grid, Container } from "@mui/material";

const ItemListContainer = () => {
  const [cvs, setCvs] = useState([]);
  const [selectedProfession, setSelectedProfession] = useState("");
  const [professions, setProfessions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "cv"));
        const cvsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCvs(cvsData);

        // Obtener lista única de profesiones
        const uniqueProfessions = [...new Set(cvsData.map(cv => cv.Profesion))];
        setProfessions(uniqueProfessions);
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

  // Función para filtrar por profesión
  const handleProfessionChange = (event) => {
    setSelectedProfession(event.target.value);
  };

  return (
    <Container>
      <Typography variant="h3" sx={{ mb: 4, textAlign: 'center', fontFamily: 'Arimo', fontWeight: 'bold' }}>
        Conecta con perfiles laborales
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Typography variant="h6" sx={{ fontFamily: 'Cy Grotesk Key' }}>Filtrar por profesión</Typography>
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
        </Grid>
        <Grid item xs={12} md={9}>
          <Grid container spacing={4}>
            {cvs.filter(cv => cv.estado !== "pendiente" && cv.estado !== "no aprobado").map((cv) => (
              ((selectedProfession === "" || cv.Profesion === selectedProfession)) && (
                <Grid item xs={12} sm={6} md={4} key={cv.id}>
                  <Card sx={{ height: '100%' }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={cv.Foto}
                      alt="CV Foto"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div" sx={{ fontFamily: 'Arimo', fontWeight: 'bold' }}>
                        {cv.Nombre} {cv.Apellido}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Cy Grotesk Key' }}>
                        Edad: {cv.Edad}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Cy Grotesk Key' }}>
                        Profesión: {cv.Profesion}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleDownloadPDF(cv.cv)}
                        sx={{ mt: 2 }}
                      >
                        Ver CV
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              )
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ItemListContainer;
