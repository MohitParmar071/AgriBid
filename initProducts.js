const mongoose = require("mongoose");
const Crops = require("./Model/crops");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/AgriBid");
  console.log("Connected to DB");

  const sampleProducts = [
    {
      name: "Sugarcane Bundle",
      price: 30,
      quantity: "100kg",
      seller: "Rajveer Chaudhary",
      email: "rajveer@example.com",
      contact: 9191919191,
      city: "Meerut",
      imageUrl: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?q=80&w=2000&auto=format&fit=crop",
      Type: "buy"
    },
    {
      name: "Red Onions (Lal Pyaz)",
      price: 25,
      quantity: "50kg",
      seller: "Mukesh Patel",
      email: "mukesh@example.com",
      contact: 9812345670,
      city: "Nashik",
      imageUrl: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?q=80&w=2000&auto=format&fit=crop",
      Type: "buy"
    },
    {
      name: "Fresh Garlic (Lehsun)",
      price: 120,
      quantity: "10kg",
      seller: "Suresh Sharma",
      email: "suresh@example.com",
      contact: 9192939495,
      city: "Ujjain",
      imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=2000&auto=format&fit=crop",
      Type: "buy"
    },
    {
      name: "Green Green Peas (Matar)",
      price: 40,
      quantity: "20kg",
      seller: "Vikram Singh",
      email: "vikram@example.com",
      contact: 9988112233,
      city: "Karnal",
      imageUrl: "https://images.unsplash.com/photo-1592119747782-d8c12c2ea2b7?q=80&w=2000&auto=format&fit=crop",
      Type: "buy"
    }
  ];

  // Insert products
  await Crops.insertMany(sampleProducts);
  console.log("Marketplace products initialized successfully!");
  
  mongoose.connection.close();
}

main().catch(err => {
  console.error("Initialization Failed:", err);
});
