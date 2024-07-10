import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { Button, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CargaManual from "./CargaManual";
import NoAprobado from "./NoAprobado";


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Dashboard = () => {
  const [pendingCVs, setPendingCVs] = useState([]);
  const [selectedCV, setSelectedCV] = useState(null);
  const [open, setOpen] = useState(false);
  const [showPending, setShowPending] = useState(false);
  const [showRejected, setShowRejected] = useState(false); 

  const fetchPendingCVs = async () => {
    const cvCollection = collection(db, "cv");
    const querySnapshot = await getDocs(cvCollection);
    const pendingCVData = querySnapshot.docs
      .filter((doc) => doc.data().estado === "pendiente")
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    setPendingCVs(pendingCVData);
  };

  useEffect(() => {
    if (showPending) {
      fetchPendingCVs();
    }
  }, [showPending]);

  const handleApprove = async () => {
    if (!selectedCV) return;

    await updateDoc(doc(db, "cv", selectedCV.id), { estado: "aprobado" });
    setSelectedCV(null);
    setOpen(false);
    fetchPendingCVs(); 

    // Enviamos el correo de bienvenida
    EnvioMail(selectedCV);
  };

  const handleDisapprove = async () => {
    if (!selectedCV) return;

    await updateDoc(doc(db, "cv", selectedCV.id), { estado: "no aprobado" });
    setSelectedCV(null);
    setOpen(false);
    setShowPending(false);
    setShowRejected(true);
    fetchPendingCVs();
  };

  const handleOpenModal = (cv) => {
    setSelectedCV(cv);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" onClick={() => setShowPending(true)}>
        Ver Pendientes
      </Button>
      <Button variant="contained" onClick={() => { setShowPending(false); setShowRejected(true); }}>
        Ver No Aprobados
      </Button>
      {showPending && (
        <div>
          <Modal
            open={open}
            onClose={handleCloseModal}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <Paper sx={style}>
              <Typography variant="h5" component="h2" id="modal-title" gutterBottom>
                Detalles del CV Pendiente
              </Typography>
              {selectedCV && (
                <div>
                  <Typography variant="h6" component="h3" gutterBottom>
                    Nombre: {selectedCV.Nombre} {selectedCV.Apellido}
                  </Typography>
                  <Typography variant="body1" component="p" gutterBottom>
                    Edad: {selectedCV.Edad}
                  </Typography>
                  <Typography variant="body1" component="p" gutterBottom>
                    Profesión: {selectedCV.Profesion}
                  </Typography>
                  <Typography variant="body1" component="p" gutterBottom>
                    Ciudad: {selectedCV.Ciudad}
                  </Typography>
                  <img src={selectedCV.Foto} alt="Foto de Perfil" style={{ maxWidth: "200px", maxHeight: "200px" }} />
                  <Button
                    variant="contained"
                    startIcon={<CloudDownloadIcon />}
                    href={selectedCV.cv}
                    target="_blank"
                    download
                  >
                    Descargar CV
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ThumbUpIcon />}
                    onClick={handleApprove}
                    style={{ marginLeft: "10px" }}
                  >
                    Aprobar
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<ThumbDownIcon />}
                    onClick={handleDisapprove}
                    style={{ marginLeft: "10px" }}
                  >
                    Desaprobar
                  </Button>
                </div>
              )}
            </Paper>
          </Modal>
          <TableContainer component={Paper} style={{ marginTop: "20px" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Apellido</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingCVs.map((cv) => (
                  <TableRow key={cv.id}>
                    <TableCell>{cv.id}</TableCell>
                    <TableCell>{cv.Nombre}</TableCell>
                    <TableCell>{cv.Apellido}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleOpenModal(cv)}>Ver Detalles</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <CargaManual />
        </div>
      )}
     
      {showRejected && <NoAprobado />}      
    </div>   
  );
};

export default Dashboard;