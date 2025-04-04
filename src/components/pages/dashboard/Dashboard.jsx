import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { db } from "../../../firebaseConfig";
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar } from "@mui/material";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const Dashboard = () => {
  const [activeCVs, setActiveCVs] = useState([]);
  const [pendingCVs, setPendingCVs] = useState([]);
  const [rejectedCVs, setRejectedCVs] = useState([]);
  const [currentView, setCurrentView] = useState("active");

  const fetchCVs = async (status) => {
    const q = query(collection(db, "cv"), where("estado", "==", status));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  useEffect(() => {
    const fetchData = async () => {
      const activeData = await fetchCVs("aprobado");
      const pendingData = await fetchCVs("pendiente");
      const rejectedData = await fetchCVs("no aprobado");
      setActiveCVs(activeData);
      setPendingCVs(pendingData);
      setRejectedCVs(rejectedData);
    };
    fetchData();
  }, []);

  const handleApprove = async (cv) => {
    await updateDoc(doc(db, "cv", cv.id), { estado: "aprobado" });
    setRejectedCVs((prev) => prev.filter((item) => item.id !== cv.id));
    setActiveCVs((prev) => [...prev, { ...cv, estado: "aprobado" }]);
  };

  const handleDelete = async (cv) => {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'No podrás revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(doc(db, "cv", cv.id));
        setActiveCVs((prev) => prev.filter((item) => item.id !== cv.id));
        Swal.fire('Eliminado', 'El CV ha sido eliminado.', 'success');
      }
    });
  };

  const handleDownload = (cv) => {
    window.open(cv.cv, "_blank");
  };

  const handleEdit = (cv) => {
    console.log("Editar CV", cv);
  };

  return (
    <div>
      <Button variant="contained" onClick={() => setCurrentView("active")}>Ver Activos</Button>
      <Button variant="contained" onClick={() => setCurrentView("pending")} style={{ marginLeft: "10px" }}>Ver Pendientes</Button>
      <Button variant="contained" onClick={() => setCurrentView("rejected")} style={{ marginLeft: "10px" }}>Ver No Aprobados</Button>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Foto</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(currentView === "active" ? activeCVs : currentView === "pending" ? pendingCVs : rejectedCVs).map((cv) => (
              <TableRow key={cv.id}>
                <TableCell>{cv.id}</TableCell>
                <TableCell><Avatar src={cv.Foto} alt={cv.Nombre} /></TableCell>
                <TableCell>{cv.Nombre}</TableCell>
                <TableCell>{cv.Apellido}</TableCell>
                <TableCell>
                  {currentView === "active" && (
                    <>
                      <Button variant="contained" startIcon={<EditIcon />} onClick={() => handleEdit(cv)}>Editar</Button>
                      <Button variant="contained" color="error" startIcon={<DeleteForeverIcon />} onClick={() => handleDelete(cv)} style={{ marginLeft: "10px" }}>Eliminar</Button>
                    </>
                  )}
                  {currentView === "rejected" && (
                    <>
                      <Button variant="contained" startIcon={<EditIcon />} onClick={() => handleEdit(cv)}>Editar</Button>
                      <Button variant="contained" color="primary" startIcon={<ThumbUpIcon />} onClick={() => handleApprove(cv)} style={{ marginLeft: "10px" }}>Aprobar</Button>
                      <Button variant="contained" startIcon={<CloudDownloadIcon />} onClick={() => handleDownload(cv)} style={{ marginLeft: "10px" }}>Descargar</Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Dashboard;
