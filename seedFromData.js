const mongoose = require('mongoose');
const Crops = require('./Model/crops');
const cropsData = require('./Model/data');

mongoose.connect('mongodb://127.0.0.1:27017/AgriBid').then(async () => {
  // Clear the crops collection
  await Crops.deleteMany({});
  console.log("Cleared existing crops data.");

  // Insert from data.js
  await Crops.insertMany(cropsData);
  console.log(`Successfully inserted ${cropsData.length} products into the database.`);

  mongoose.connection.close();
});
