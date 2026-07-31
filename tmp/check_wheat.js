const mongoose = require('mongoose');
const Crops = require('./Model/crops');

async function checkWheat() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/AgriBid');
        console.log("Connected to DB");
        
        const wheats = await Crops.find({ name: /Wheat/i });
        console.log(`Found ${wheats.length} wheat items:`);
        wheats.forEach(w => {
            console.log(`- ID: ${w._id}, Price: ${w.price}, Qty: ${w.quantity}, City: ${w.city}, Seller: ${w.email}`);
        });
        
        await mongoose.connection.close();
    } catch (err) {
        console.error("Error checking wheat:", err);
    }
}

checkWheat();
