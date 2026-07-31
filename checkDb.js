const mongoose = require('mongoose');
const Crops = require('./Model/crops');
const fs = require('fs');

mongoose.connect('mongodb://127.0.0.1:27017/AgriBid').then(async () => {
  const all = await Crops.find({});
  console.log(`Total documents in crops: ${all.length}`);
  
  const targets = ["Sugarcane Bundle", "Red Onions (Lal Pyaz)", "Fresh Garlic (Lehsun)", "Green Green Peas (Matar)"];
  const found = all.filter(d => targets.includes(d.name));
  
  console.log(`Found ${found.length} target records.`);
  found.forEach(f => {
    console.log(`- ${f.name} | qty: ${f.quantity} | type: ${f.Type} | img: ${f.imageUrl}`);
  });
  
  mongoose.connection.close();
});
