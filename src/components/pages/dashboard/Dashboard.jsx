import { useEffect } from "react";
import { useState } from "react";
import { db } from "../../../firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import CVList from "./ProductsList"; // Cambiado de ProductsList a CVList
import { Box, Button, Modal, TextField } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Dashboard = () => {
  const [cvs, setCvs] = useState([]); // Cambiado de products a cvs
  const [isChange, setIsChange] = useState(true);
  const [open, setOpen] = useState(false);
  const [shipmentCost, setShipmentCost] = useState(null);

  useEffect(() => {
    setIsChange(false);
    let cvCollection = collection(db, "cv"); // Cambiado de Cv a cv
    getDocs(cvCollection).then((res) => {
      const newArr = res.docs.map((cv) => { // Cambiado de product a cv
        return {
          ...cv.data(),
          id: cv.id,
        };
      });
      setCvs(newArr); // Cambiado de setProducts a setCvs
    });
  }, [isChange]);

  const handleClose = () => {
    setOpen(false);
  };

  const updateShipment = async () => {
    updateDoc(doc(db, "shipment", "HxMuNKLUglVoHjAyosML"), { cost: shipmentCost });
    setOpen(false);
  };

  return (
    <div>
      
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TextField
            label="Costo"
            onChange={(e) => setShipmentCost(+e.target.value)}
          />
          <Button onClick={updateShipment}>Modificar</Button>
        </Box>
      </Modal>
      <CVList cvs={cvs} setIsChange={setIsChange} /> {/* Cambiado de ProductsList a CVList */}
    </div>
  );
};

export default Dashboard;
