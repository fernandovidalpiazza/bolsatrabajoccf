import { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import { getDocs, collection } from "firebase/firestore";
import { Button, Select, MenuItem, Box, Grid, Container, Typography, Avatar, Paper } from "@mui/material";

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

  // Función para filtrar por profesión
  const handleProfessionChange = (event) => {
    setSelectedProfession(event.target.value);
  };

  // Función para filtrar por ciudad
  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
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
              <MenuItem value="">Ver Todos</MenuItem>
              {professions.map((profession, index) => (
                <MenuItem key={index} value={profession}>{profession}</MenuItem>
              ))}
            </Select>

            <Typography variant="h6" sx={{ fontFamily: 'Cy Grotesk Key' }}>Filtrar por ciudad</Typography>
            <Select
              value={selectedCity || ''}
              onChange={handleCityChange}
              displayEmpty
              variant="outlined"
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">Ver Todos</MenuItem>
              {cities.map((city, index) => (
                <MenuItem key={index} value={city}>{city}</MenuItem>
              ))}
            </Select>
          </Box>
        </Grid>
        <Grid item xs={12} md={9}>
          <Grid container spacing={4}>
            {cvs.filter(cv => 
              cv.estado !== "pendiente" && 
              cv.estado !== "no aprobado" &&
              (selectedProfession === "" || cv.Profesion === selectedProfession) &&
              (selectedCity === "" || cv.Ciudad === selectedCity)
            ).map((cv) => (
              <Grid item xs={12} sm={6} md={4} key={cv.id}>
                <Paper sx={{ padding: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item>
                      <Avatar
                        alt={`${cv.Nombre} ${cv.Apellido}`}
                        src={cv.Foto}
                        sx={{ width: 80, height: 80, objectFit: 'cover' }}
                      />
                    </Grid>
                    <Grid item xs={12} sm container direction="column" spacing={1}>
                      <Grid item xs>
                        <Typography gutterBottom variant="h5" component="div" sx={{ fontFamily: 'Arimo', fontWeight: 'bold' }}>
                          {cv.Nombre} {cv.Apellido}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Cy Grotesk Key' }}>
                          Edad: {cv.Edad}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Cy Grotesk Key' }}>
                          Profesión: {cv.Profesion}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Cy Grotesk Key' }}>
                          Ciudad: {cv.Ciudad}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleDownloadPDF(cv.cv)}
                        >
                          Ver CV
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ItemListContainer;
