const locationModel = require('../../model/common/location');  
const pharmacyModel = require('../../model/pharmacies/pharmacyModel');


exports.createLocation = async (req, res) => {
    try {
      const pharmacyId = req.pharmacy.id;
  
      const pharmacy = await pharmacyModel.findById(pharmacyId);
      if (pharmacy.location) {
        return res.status(400).json({ message: "Pharmacy already has a location." });
      }
  
      const { name, address, city, state, postalCode, country, phoneNumber, email, services } = req.body;
  
      const newLocation = new locationModel({
        pharmacy: pharmacyId,
        name,
        address,
        city,
        state,
        postalCode,
        country,
        phoneNumber,
        email,
        services
      });
  
      await newLocation.save();
  
      pharmacy.location = newLocation._id;
      await pharmacy.save();
  
      res.status(201).json({ message: "Location created successfully", data: newLocation });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  


exports.getAllLocations = async (req, res) => {
  try {
    const locations = await locationModel.find().populate('pharmacy', 'pharmacyName email');
    res.status(200).json(locations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getLocationById = async (req, res) => {
  try {
    const location = await locationModel.findById(req.params.id).populate('pharmacy', 'pharmacyName email');
    if (!location) return res.status(404).json({ message: "Location not found" });

    res.status(200).json(location);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.updateLocation = async (req, res) => {
  try {
    const location = await locationModel.findById(req.params.id);
    if (!location) return res.status(404).json({ message: "Location not found" });

    Object.assign(location, req.body);
    await location.save();

    res.status(200).json({ message: "Location updated successfully", data: location });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.deleteLocation = async (req, res) => {
  try {
    const location = await locationModel.findByIdAndDelete(req.params.id);
    if (!location) return res.status(404).json({ message: "Location not found" });

    await pharmacyModel.findByIdAndUpdate(location.pharmacy, { $unset: { location: "" } });


    res.status(200).json({ message: "Location deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllPharmacies = async (req, res) => {
  try {
      const pharmacies = await locationModel.find({});
      res.status(200).json(pharmacies);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

exports.getNearbyPharmacies = async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required.' });
  }

  try {
      const radius = 10; // 10 kilometers radius, adjust as needed

      const nearbyPharmacies = await locationModel.find({
          latitude: { $gte: parseFloat(latitude) - (radius / 111.32), $lte: parseFloat(latitude) + (radius / 111.32) },
          longitude: { $gte: parseFloat(longitude) - (radius / (111.32 * Math.cos(parseFloat(latitude) * Math.PI / 180))), $lte: parseFloat(longitude) + (radius / (111.32 * Math.cos(parseFloat(latitude) * Math.PI / 180))) },
      });

      res.status(200).json(nearbyPharmacies);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
