const mongoose = require("mongoose");
const Crops = require("./Model/crops");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/AgriBid");
  console.log("Connected to DB");

  const updates = [
    { name: "Sugarcane Bundle", imageUrl: "/uploads/sugarcane.png" },
    { name: "Red Onions (Lal Pyaz)", imageUrl: "/uploads/red_onions.png" },
    { name: "Fresh Garlic (Lehsun)", imageUrl: "/uploads/garlic.png" },
    { name: "Green Green Peas (Matar)", imageUrl: "/uploads/green_peas.png" }
  ];

  for (const item of updates) {
    await Crops.updateOne({ name: item.name }, { imageUrl: item.imageUrl });
    console.log(`Updated image for ${item.name}`);
  }
  
  mongoose.connection.close();
}

main().catch(err => {
  console.error("Update Failed:", err);
});
