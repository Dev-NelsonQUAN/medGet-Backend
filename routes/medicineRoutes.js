// medicineRoutes.js
const express = require('express');
const upload = require('../middleware/multerMiddlleware');
const authMiddleware = require('../middleware/authMiddleware');
const {createMedicine, updateMedicine, getAllMedicines, getMedicineById, deleteMedicine} = require('../controller/pharmacy/medicineController');

const medicineRoutes = express.Router();

medicineRoutes.post('/createmedicines', authMiddleware, upload.single('image'), createMedicine);
medicineRoutes.put('/updatemedicinesbyid/:id', authMiddleware, upload.single('image'), updateMedicine);
medicineRoutes.get('/getallmedicines', authMiddleware, getAllMedicines);
medicineRoutes.get('/getbyidmedicines/:id', authMiddleware, getMedicineById);
medicineRoutes.delete('/deletemedicines/:id', authMiddleware, deleteMedicine); 

module.exports = medicineRoutes;

