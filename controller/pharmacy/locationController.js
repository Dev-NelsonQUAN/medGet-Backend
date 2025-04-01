const locationModel = require('../../model/pharmacies/location');  
const pharmacyModel = require('../../model/pharmacies/pharmacyModel');

exports.createLocation = async (req, res) => {
    try {
      const pharmacyId = req.pharmacy._id;

      const existingLocation = await locationModel.findOne({ pharmacy: pharmacyId });
      if (existingLocation) {
        return res.status(400).json({ message: "Pharmacy already has a location." });
      }
  
      const { name, address, localGovernmentArea, state, street, postalCode, country, phoneNumber } = req.body;
  
      const newLocation = new locationModel({
        pharmacy: pharmacyId,
        name,
        address,
        localGovernmentArea,
        state,
        postalCode,
        street,
        country,
        phoneNumber,
      });
  
      await newLocation.save();
  
      await pharmacyModel.findByIdAndUpdate(pharmacyId, { location: newLocation._id });
  
      return res.status(201).json({ message: "Location created successfully", data: newLocation });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
};

exports.getLocationById = async (req, res) => {
  try {
    const pharmacyId = req.pharmacy._id; 
    const location = await locationModel.findOne({ pharmacy: pharmacyId }).populate('pharmacy', 'pharmacyName email');

    if (!location) {
      return res.status(404).json({ message: "Location not found for this pharmacy" });
    }

    return res.status(200).json(location);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const pharmacyId = req.pharmacy._id;

    const location = await locationModel.findOne({ pharmacy: pharmacyId });

    if (!location) {
      return res.status(404).json({ message: "Location not found for this pharmacy" });
    }

    Object.assign(location, req.body);
    await location.save();

    return res.status(200).json({ message: "Location updated successfully", data: location });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};



exports.getAllPharmacies = async (req, res) => {
  try {
    const { state, city, service } = req.query;
    let filter = {};

    if (state) filter.state = state;
    if (city) filter.city = city;
    if (service) filter.services = { $in: [service] };

    const pharmacies = await locationModel.find(filter).populate('pharmacy', 'pharmacyName email');

    return res.status(200).json(pharmacies);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
