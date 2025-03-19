// medicineController.js
const Medicine = require("../../model/pharmacies/medicineModel");
const { cloudinary } = require("../../config/cloudinaryConfig");

exports.createMedicine = async (req, res) => {
  try {
    const pharmacyId = req.pharmacy.id;
    const {
      name,
      genericName,
      sku,
      weight,
      category,
      manufacturer,
      price,
      manufacturerPrice,
      stock,
      expireDate,
      status,
      details,
    } = req.body;

    const existingMedicine = await Medicine.findOne({ sku });
    if (existingMedicine) {
      return res
        .status(400)
        .json({ message: "Medicine with this SKU already exists." });
    }

    let imageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "medicines",
        transformation: [{ width: 500, height: 500, crop: "limit" }],
      });
      imageUrl = result.secure_url;
    }

    const newMedicine = new Medicine({
      pharmacy: pharmacyId,
      image: imageUrl,
      name,
      genericName,
      sku,
      weight,
      category,
      manufacturer,
      price,
      manufacturerPrice,
      stock,
      expireDate,
      status,
      details,
    });

    await newMedicine.save();
    res.status(201).json({
      message: "Medicine created successfully.",
      medicine: newMedicine,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.updateMedicine = async (req, res) => {
  try {
    const pharmacyId = req.pharmacy.id;
    const medicineId = req.params.id;

    const medicine = await Medicine.findOne({
      _id: medicineId,
      pharmacy: pharmacyId,
    });
    if (!medicine) {
      return res.status(404).json({
        message:
          "Medicine not found or you don't have permission to update it.",
      });
    }

    const allowedUpdates = [
      "price",
      "manufacturerPrice",
      "stock",
      "expireDate",
      "status",
      "details",
    ];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((field) =>
      allowedUpdates.includes(field)
    );

    if (!isValidOperation) {
      return res.status(400).json({
        message:
          "Invalid updates. You can only update price, stock, status, details, etc.",
      });
    }

    updates.forEach((update) => {
      medicine[update] = req.body[update];
    });

    if (req.file) {
      const publicId = medicine.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`medicines/${publicId}`);

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "medicines",
        transformation: [{ width: 500, height: 500, crop: "limit" }],
      });
      medicine.image = result.secure_url;
    }

    await medicine.save();
    res
      .status(200)
      .json({ message: "Medicine updated successfully.", medicine });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllMedicines = async (req, res) => {
  try {
    const pharmacyId = req.pharmacy.id;
    const medicines = await Medicine.find({ pharmacy: pharmacyId });
    res.status(200).json(medicines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMedicineById = async (req, res) => {
  try {
    const pharmacyId = req.pharmacy.id;
    const medicineId = req.params.id;

    const medicine = await Medicine.findOne({
      _id: medicineId,
      pharmacy: pharmacyId,
    });
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found." });
    }

    res.status(200).json(medicine);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteMedicine = async (req, res) => {
  try {
    const pharmacyId = req.pharmacy.id;
    const medicineId = req.params.id;

    const medicine = await Medicine.findOneAndDelete({
      _id: medicineId,
      pharmacy: pharmacyId,
    });
    if (!medicine) {
      return res.status(404).json({
        message:
          "Medicine not found or you do not have permission to delete it.",
      });
    }

    const publicId = medicine.image.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`medicines/${publicId}`);

    res.status(200).json({ message: "Medicine deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
