const mongoose = require('mongoose');
const Crops = require('../Model/crops');

async function deleteDhana() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/AgriBid');
        console.log("Connected to DB");
        
        const result = await Crops.deleteMany({ 
            name: { $regex: /Dhana/i }, 
            email: "jeetrupareliya253@gmail.com" 
        });
        console.log(`Deleted ${result.deletedCount} crop(s) matching "Dhana" for user jeetrupareliya253@gmail.com`);
        
        await mongoose.connection.close();
    } catch (err) {
        console.error("Error deleting crop:", err);
    }
}

deleteDhana();
