import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";

const NoAprobado = () => {
  const [rejectedCVs, setRejectedCVs] = useState([]);

  const fetchRejectedCVs = async () => {
    const cvCollection = collection(db, "cv");
    const querySnapshot = await getDocs(cvCollection);
    const rejectedCVData = querySnapshot.docs
      .filter((doc) => doc.data().estado === "no aprobado")
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    setRejectedCVs(rejectedCVData);
  };

  useEffect(() => {
    fetchRejectedCVs();
  }, []);

  const handleDownloadCV = (cvUrl) => {
    window.open(cvUrl, "_blank");
  };

  return (
    <TableContainer component={Paper} style={{ marginTop: "20px" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Apellido</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Descargar CV</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rejectedCVs.map((cv) => (
            <TableRow key={cv.id}>
              <TableCell>{cv.id}</TableCell>
              <TableCell>{cv.Nombre}</TableCell>
              <TableCell>{cv.Apellido}</TableCell>
              <TableCell>{cv.Email}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  onClick={() => handleDownloadCV(cv.cv)}
                >
                  Descargar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default NoAprobado;
