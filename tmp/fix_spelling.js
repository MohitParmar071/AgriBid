const mongoose = require('mongoose');
const Crops = require('../Model/crops');

async function fixSpelling() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/AgriBid');
        console.log("Connected to DB");
        
        // Find crops with "Orgenic" in the name
        const cropsToUpdate = await Crops.find({ name: /Orgenic/i });
        console.log(`Found ${cropsToUpdate.length} crop(s) with spelling error.`);
        
        for (let crop of cropsToUpdate) {
            const oldName = crop.name;
            const newName = oldName.replace(/Orgenic/gi, "Organic");
            crop.name = newName;
            await crop.save();
            console.log(`Updated: "${oldName}" -> "${newName}"`);
        }
        
        await mongoose.connection.close();
        console.log("Database connection closed.");
    } catch (err) {
        console.error("Error fixing spelling:", err);
    }
}

fixSpelling();
