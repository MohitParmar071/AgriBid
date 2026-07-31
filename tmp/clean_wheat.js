const mongoose = require('mongoose');
const Crops = require('../Model/crops');

async function cleanWheat() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/AgriBid');
        console.log("Connected to DB");
        
        const result = await Crops.deleteMany({ 
            name: /Wheat/i, 
            $or: [{ price: 20 }, { price: 2200 }],
            email: /jeet/i
        });
        
        console.log(`Deleted ${result.deletedCount} wheat item(s) from the database.`);
        
        await mongoose.connection.close();
    } catch (err) {
        console.error("Error cleaning wheat:", err);
    }
}

cleanWheat();
