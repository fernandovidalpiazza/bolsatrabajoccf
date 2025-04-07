import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { db } from '../../../firebaseConfig';
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, IconButton, Modal, Box, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import DownloadIcon from '@mui/icons-material/Download';

const Dashboard = () => {
  const [activeCVs, setActiveCVs] = useState([]);
  const [pendingCVs, setPendingCVs] = useState([]);
  const [rejectedCVs, setRejectedCVs] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCV, setSelectedCV] = useState(null);
  const [currentView, setCurrentView] = useState('active');

  const fetchCVs = async (status) => {
    const q = query(collection(db, 'cv'), where('estado', '==', status));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  const fetchData = async () => {
    const activeData = await fetchCVs('aprobado');
    const pendingData = await fetchCVs('pendiente');
    const rejectedData = await fetchCVs('no aprobado');
    setActiveCVs(activeData);
    setPendingCVs(pendingData);
    setRejectedCVs(rejectedData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showAlert = (title, text, icon) => {
    Swal.fire({ title, text, icon, confirmButtonText: 'Aceptar' });
  };

  const handleDelete = async (cv) => {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'No podrás revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(doc(db, 'cv', cv.id));
        fetchData();
        showAlert('Eliminado', 'El CV ha sido eliminado.', 'success');
      }
    });
  };

  const handleApprove = async (cv) => {
    await updateDoc(doc(db, 'cv', cv.id), { estado: 'aprobado' });
    fetchData();
    showAlert('Aprobado', 'El CV ha sido aprobado.', 'success');
  };

  const handleReject = async (cv) => {
    await updateDoc(doc(db, 'cv', cv.id), { estado: 'no aprobado' });
    fetchData();
    showAlert('Rechazado', 'El CV ha sido rechazado.', 'success');
  };

  const handleEdit = (cv) => {
    setSelectedCV({ ...cv });
    setOpen(true);
  };

  const handleSave = async () => {
    if (selectedCV && selectedCV.id) {
      await updateDoc(doc(db, 'cv', selectedCV.id), selectedCV);
      fetchData();
      setOpen(false);
      showAlert('Actualizado', 'El CV ha sido actualizado.', 'success');
    }
  };

  const handleDownload = (cv) => {
    if (cv.cv) {
      window.open(cv.cv, '_blank');
    } else {
      showAlert('Error', 'No se encontró el archivo del CV.', 'error');
    }
  };

  return (
    <div>
      <Button onClick={() => setCurrentView('active')}>Activos</Button>
      <Button onClick={() => setCurrentView('pending')}>Pendientes</Button>
      <Button onClick={() => setCurrentView('rejected')}>Rechazados</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Foto</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(currentView === 'active' ? activeCVs : currentView === 'pending' ? pendingCVs : rejectedCVs).map((cv) => (
              <TableRow key={cv.id}>
                <TableCell><Avatar src={cv.Foto} /></TableCell>
                <TableCell>{cv.Nombre}</TableCell>
                <TableCell>{cv.Apellido}</TableCell>
                <TableCell>{cv.Email}</TableCell>
                <TableCell>{cv.Telefono}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDownload(cv)}><DownloadIcon /></IconButton>
                  {currentView !== 'active' && (
                    <>
                      <IconButton onClick={() => handleApprove(cv)}><ThumbUpIcon /></IconButton>
                      <IconButton onClick={() => handleReject(cv)}><ThumbDownIcon /></IconButton>
                      <IconButton onClick={() => handleEdit(cv)}><EditIcon /></IconButton>
                    </>
                  )}
                  <IconButton onClick={() => handleDelete(cv)}><DeleteForeverIcon /></IconButton>
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
