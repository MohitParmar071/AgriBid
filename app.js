const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const Contect = require('./Model/contect')
const Crops = require("./Model/crops")
const Order = require('./Model/order')
const ejsMate = require('ejs-mate')
const method_override = require("method-override");
const session = require("express-session");   //  Add session
const nodemailer = require('nodemailer');
const {generateotp} = require('./Model/otp')
const multer = require("multer");


// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});


const upload = multer({ storage: storage });


// Session middleware
app.use(session({
    secret: "agribid-secret-key",  // put a strong secret here
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 } // 1 hour session
}));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views/GetFolder"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(method_override("_method"));
app.use("/uploads", express.static("public/uploads"));

// Middleware to make user available in all EJS files (navbar, etc.)
app.use((req,res,next)=>{
    res.locals.currentUser = req.session.user || null;
    next();
});

//Genarate OTP
//Genarate OTP
let newotp = () => {
  let otp = generateotp(4);
  return otp;
} 

//STore email and OTp 
const otpStore = {};

//Sending OTP
let SendingOTP = async (email) =>{
  return new Promise(async (resolve, reject) => {
    let otp = newotp()
    let expiresAt = Date.now() + 1 * 60 * 1000;
    otpStore[email] = {otp,expiresAt};
    console.log("OTP Store updated:", otpStore);

    const transporter = nodemailer.createTransport({
      service: "gmail", 
      auth: {
           user: 'agribidpvtltd@gmail.com',
           pass: 'ugyj whvp cggs sjns'
      },
    });

    const mailOptions = {
      from: "agribidpvtltd@gmail.com",
      to: email, 
      subject: "Verification OTP - AgriBid", 
      html: `
      <div style="font-family: Arial, sans-serif; background-color:#f4f6f8; padding:20px;">
      <div style="max-width:600px; margin:auto; background:#ffffff; padding:30px; border-radius:10px; box-shadow:0 0 10px rgba(0,0,0,0.1);">
       
       <h2 style="color:#2e7d32; text-align:center;">Verification By AgriBid</h2>
       
       <p style="font-size:16px; color:#333;">
         Dear User,
       </p>
      
       <p style="font-size:15px; color:#555;">
         Thank you for choosing <b>AgriBid</b> — your trusted platform for smart agricultural trading.
       </p>
      
       <p style="font-size:15px; color:#555;">
         To continue securely, please use the following One-Time Password (OTP) to verify your account:
       </p>
      
       <div style="text-align:center; margin:30px 0;">
         <span style="font-size:28px; letter-spacing:5px; font-weight:bold; color:#2e7d32;">
           ${otp}
         </span>
       </div>
      
       <p style="font-size:14px; color:#555;">
         ⏳ This OTP is valid for <b>1 minute</b>. Please do not share this code with anyone for security reasons.
       </p>
      
       <p style="font-size:14px; color:#555;">
         If you did not request this OTP, please ignore this email.
       </p>
      
       <hr style="margin:25px 0; border:none; border-top:1px solid #ddd;" />
      
       <p style="font-size:13px; color:#888; text-align:center;">
         © ${new Date().getFullYear()} AgriBid. All rights reserved.
       </p>
      
      </div>
      </div>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending OTP email:", error);
        reject(error);
      } else {
        console.log("OTP email sent successfully:", info.response);
        resolve(info);
      }
    });
  });
}

//Index Page
app.get("/",(req,res)=>{
    res.render("EnteringBlog/Index");
})


//LogIn
app.get("/login",(req,res)=>{
    res.render("EnteringBlog/login");
})

app.post("/login", async (req,res)=>{
     try{
        const check = await Contect.findOne({email:req.body.email});

        if(check.password === req.body.password) {
            // Save user info in session
            req.session.user = {
                id: check._id,
                name: check.username,
                email: check.email,
                address:check.address,
                img:check.img
            };
            res.redirect("/home");

        } else {   
            let message = "Incorrect Password";
            res.render("EnteringBlog/login",{message});
        }
    }catch {
        let message = "Invalid Email";
        res.render("EnteringBlog/login",{message});
    }
});

// ================= FORGOT PASSWORD FLOW =================
app.get("/forget", (req, res) => {
    res.render("EnteringBlog/forget", { error: null });
});

app.post("/forget", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await Contect.findOne({ email: email });
        
        if (!user) {
            return res.render("EnteringBlog/forget", { error: "No account found with this email!" });
        }
        
        req.session.resetEmail = email;
        SendingOTP(email);
        
        res.redirect("/forget-verify");
    } catch (err) {
        console.log(err);
        res.render("EnteringBlog/forget", { error: "Something went wrong!" });
    }
});

app.get("/forget-verify", (req, res) => {
    if (!req.session.resetEmail) return res.redirect("/forget");
    res.render("EnteringBlog/forget-verify", { email: req.session.resetEmail, error: null });
});

app.post("/forget-verify", async (req, res) => {
    try {
        const { otp, new_password } = req.body;
        const email = req.session.resetEmail;
        
        if (!email) return res.redirect("/forget");
        
        const record = otpStore[email];
        
        if (!record || Date.now() > record.expiresAt) {
            return res.render("EnteringBlog/forget-verify", { email, error: "OTP expired/invalid. Try again." });
        }
        
        if (record.otp !== otp) {
            return res.render("EnteringBlog/forget-verify", { email, error: "Incorrect OTP." });
        }
        
        // Success: Update Password
        await Contect.findOneAndUpdate({ email: email }, { password: new_password });
        delete otpStore[email];
        delete req.session.resetEmail;
        
        res.render("EnteringBlog/login", { message: "Password reset successfully! Please login." });
        
    } catch (err) {
        console.log(err);
        res.render("EnteringBlog/forget-verify", { email: req.session.resetEmail, error: "Something went wrong!" });
    }
});
// ========================================================


// Registration
app.get("/register", (req, res) => {
    res.render("EnteringBlog/Register", { error: null });
});

app.post("/register", upload.single("img"), async (req, res) => {
  try {
    console.log("Registration attempt:", req.body);
    
    // Multer might not parse nested fields like con[email] into an object.
    // We handle both cases here.
    let data = req.body.con || {};
    
    // If data is empty but we have flat keys like "con[email]"
    if (Object.keys(data).length === 0) {
      data = {
        username: req.body["con[username]"],
        email: req.body["con[email]"],
        mo_num: req.body["con[mo_num]"],
        password: req.body["con[password]"],
        address: req.body["con[address]"]
      };
    }

    let email = data.email;
    if (!email) {
      console.error("Registration error: Email is missing in request body.");
      return res.render("EnteringBlog/Register", { error: "Registration failed: Missing information." });
    }

    // Check duplicate email
    let existingUser = await Contect.findOne({ email: email });
    if (existingUser) {
      return res.render("EnteringBlog/Register", { error: "Email already exists" });
    }

    // Save uploaded file path
    if (req.file) {
      data.img = "/uploads/" + req.file.filename;
    } else {
      // If img is required in schema, we must ensure it's provided.
      // But Register.ejs has 'required' on file input, so this shouldn't happen unless bypassed.
      console.warn("No profile image uploaded during registration.");
      return res.render("EnteringBlog/Register", { error: "Profile image is required." });
    }

    console.log("Saving new user:", data);
    let contectdata = new Contect(data);
    await contectdata.save();

    req.session.email = email;
    
    // Wait for OTP to be sent or at least handle error
    try {
      await SendingOTP(email);
      res.redirect("/otp");
    } catch (otpErr) {
      console.error("Failed to send OTP:", otpErr);
      res.render("EnteringBlog/Register", { error: "Unable to send verification email. Please check your email address." });
    }
  } catch (err) {
    console.error("Registration error details:", err);
    res.render("EnteringBlog/Register", { error: "Something went wrong during registration. Please try again." });
  }
});

//OTP
app.get("/otp", (req, res) => {
  let email = req.session.email;
  if (!email) return res.redirect("/register");
  res.render("EnteringBlog/otp", { email });
});

app.post("/otp", (req, res) => {
  let otp = req.body.otp;
  let email = req.session.email;   // ✅ always use session email

  if (!otp) {
    return res.send(`<script>
      alert("Please enter OTP");
      window.location.href = "/otp";
    </script>`);
  }

  const record = otpStore[email];

  if (!record) {
    return res.send(`<script>
      alert("OTP not found, please resend.");
      window.location.href = "/Re_send";
    </script>`);
  }

  if (Date.now() > record.expiresAt) {
    delete otpStore[email];
    return res.send(`<script>
      alert("OTP expired, please resend.");
      window.location.href = "/Re_send";
    </script>`);
  }

  if (record.otp !== otp) {
    return res.send(`<script>
      alert("Wrong OTP, try again.");
      window.location.href = "/otp";
    </script>`);
  }

  // success
  delete otpStore[email];
  res.redirect("/login");
});

// Re-send OTP
app.get("/Re_send", (req, res) => {
  if (!req.session.email) return res.redirect("/register");
  SendingOTP(req.session.email);
  res.redirect("/otp");
});

//next
app.get("/next",(req,res)=>{
    res.redirect("/otp");
})


// User Profile Page
app.get("/profile", async (req,res)=>{
    if(!req.session.user){
        return res.redirect("/login");
    }
    // Fetch fresh details from DB (in case updated)
    const user = await Contect.findById(req.session.user.id);
    res.render("profile",{user});
})

// Upload Profile Picture
app.post("/upload-profile", upload.single("profileImage"), async (req, res) => {
  try {
    if (!req.session.user) return res.status(401).json({ error: "Unauthorized" });
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const imagePath = "/uploads/" + req.file.filename;

    // Update the database
    await Contect.findByIdAndUpdate(req.session.user.id, { img: imagePath });

    // Update the session
    req.session.user.img = imagePath;

    res.json({ success: true, img: imagePath });
  } catch (err) {
    console.error("Profile upload error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// Logout
app.get("/logout",(req,res)=>{
    req.session.destroy(()=>{
        res.redirect("/");
    });
});


// helper: extract numeric from "5kg"
function parseNumericQty(str) {
  if (!str) return 1;
  const num = parseFloat(str.replace(/[^\d.]/g, ""));
  return isNaN(num) ? 1 : num;
}

// GET /bid  -> show current auctions
app.get("/bid", async (req, res) => {
     if (!req.session.user) {
    return res.redirect("/login");
  }

  try {
    const crops = await Crops.find({Type:"bid"}); // include sold flag; view will show sold label
    res.render("Bid", {user:req.session.user, crops });
  } catch (err) {
    console.error("Error loading bids:", err);
    res.status(500).send("Server error");
  }
});

// POST /bid  -> place a bid (form posts to /bid)
app.post("/bid", async (req, res) => {
  try {
    const { cropId, bidder, email, bidAmount } = req.body;
    if (!cropId || !bidder || !email || !bidAmount) {
      return res.status(400).send("Missing fields");
    }

    const amount = Number(bidAmount);
    if (isNaN(amount) || amount <= 0) return res.status(400).send("Invalid bid amount");

    const crop = await Crops.findById(cropId);
    if (!crop) return res.status(404).send("Crop not found");

    const now = new Date();

    // If auction has ended already
    if (crop.endTime && now > crop.endTime) {
      return res.send(`<script>alert('Auction already ended'); window.location.href='/bid';</script>`);
    }

    // If first valid bid, set startTime and endTime (3 days)
    if (!crop.startTime) {
      crop.startTime = now;
      const end = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days
      crop.endTime = end;
      // initialize highestBid using base price if highestBid is 0
      if (!crop.highestBid || crop.highestBid < crop.price) {
        crop.highestBid = crop.price;
      }
    }

    // bid must be greater than current highestBid
    const currentHighest = crop.highestBid || crop.price || 0;
    if (amount <= currentHighest) {
      return res.send(`<script>alert('Your bid must be higher than current highest bid (₹${currentHighest})'); window.location.href='/bid';</script>`);
    }

    // Update highest bid info
    crop.highestBid = amount;
    crop.highestBidder = bidder;
    crop.highestBidderEmail = email;
    await crop.save();

    return res.redirect("/bid");
  } catch (err) {
    console.error("Error placing bid:", err);
    res.status(500).send("Server error");
  }
});

// POST /bid/withdraw -> Retract a bid (Bidder) or Cancel auction (Seller)
app.post("/bid/withdraw", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  try {
    const { cropId } = req.body;
    const crop = await Crops.findById(cropId);
    if (!crop) return res.status(404).send("Crop not found");

    const isSeller = (req.session.user.email === crop.email);
    const isHighestBidder = (req.session.user.email === crop.highestBidderEmail);

    if (isSeller || isHighestBidder) {
      // Reset bidding state entirely
      crop.highestBid = crop.price || 0;
      crop.highestBidder = null;
      crop.highestBidderEmail = null;
      crop.startTime = null;
      crop.endTime = null;
      crop.sold = false; 
      
      await crop.save();
      return res.redirect("/bid");
    } else {
      return res.status(403).send("Unauthorized to withdraw this bid");
    }
  } catch (err) {
    console.error("Error withdrawing bid:", err);
    res.status(500).send("Server error");
  }
});


app.get("/finalize", async (req, res) => {
  try {
    const now = new Date();
    const { cropId } = req.query;

    // If cropId provided → finalize only that crop
    let query = { endTime: { $lte: now }, sold: false };
    if (cropId) query._id = cropId;

    const ended = await Crops.find(query);
    if (!ended.length) {
      return res.json({ ok: true, processed: 0, details: [] });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
         user: 'agribidpvtltd@gmail.com',
        pass: 'ugyj whvp cggs sjns' // Gmail App Password
      },
    });

    const results = [];

    for (const crop of ended) {
      try {
        if (crop.highestBidder && crop.highestBid > 0 && crop.highestBidderEmail) {
          // Ensure numeric quantity
          const numericQty = parseFloat(crop.quantity) || 0;

          const cartItem = {
            name: crop.name,
            price: crop.highestBid,
            quantity: crop.quantity,
            numericQty,
            image: crop.imageUrl,
            total: crop.highestBid * numericQty,
            sellerEmail: crop.email || "unknown",
          };

          // Save order
          const order = new Order({
            buyerName: crop.highestBidder,
            buyerEmail: crop.highestBidderEmail,
            buyerAddress: "To be provided by buyer",
            cartItems: [cartItem],
            totalAmount: crop.highestBid * numericQty,
            status: "Confirmed",
          });
          await order.save();

          // Send winner email
          try {
            await transporter.sendMail({
              from: "agribidpvtltd@gmail.com",
              to: crop.highestBidderEmail,
              subject: `🎉 You won the auction for ${crop.name}!`,
              html: `
                <h2>Congratulations ${crop.highestBidder}!</h2>
                <p>You won the auction for <b>${crop.name}</b> at ₹${crop.highestBid}/kg.</p>
                <p>Quantity: ${crop.quantity}</p>
                <p>Seller: ${crop.seller} (${crop.city})</p>
                <p>Email : ${crop.email}</p>
                <p>Email : ${crop.contact}</p>
                <p>Please contact the seller to arrange delivery and payment.</p>
              `,
            });
          } catch (mailErr) {
            console.error("Email send error:", mailErr);
          }

          results.push({
            cropId: crop._id.toString(),
            winner: crop.highestBidder,
            amount: crop.highestBid,
            orderId: order._id.toString(),
          });
        } else {
          results.push({ cropId: crop._id.toString(), winner: null });
        }

        // ✅ Remove crop after processing (won or no bid)
        await Crops.findByIdAndDelete(crop._id);

      } catch (innerErr) {
        console.error("Error processing crop:", crop._id, innerErr);
      }
    }

    res.json({ ok: true, processed: results.length, details: results });

  } catch (err) {
    console.error("Finalize error:", err);
    res.status(500).send("Finalize failed");
  }
});


// Crops Details
app.get("/showcrops/:id",async(req,res)=>{
    if (!req.session.user) {
    return res.redirect("/login");
  }

    const {id} = req.params;
    const crops = await Crops.findById(id);
    res.render("showcrops",{crops,user:req.session.user});
})


app.get("/crops",async(req,res)=>{
    if (!req.session.user) {
    return res.redirect("/login");
  }
    let crops = await Crops.find({Type:"buy"});
    res.render("crops",{crops,user:req.session.user})
})


// Add new crops
app.get("/addNew", (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  res.render("addNew", { user: req.session.user });
});

app.post("/crops", upload.single("image"), async (req, res) => {
  try {
    const data = req.body.crops;
    if (req.file) {
      data.imageUrl = "/uploads/" + req.file.filename;
    }
    const crops = new Crops(data);
    await crops.save();
    if (crops.Type == 'buy') {
      res.redirect("/selling");
    } else {
      res.redirect('/selling');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding crop");
  }
});

// Delete Crops
app.delete("/deleteAuth/:id", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  try {
    const { id } = req.params;
    const crop = await Crops.findById(id);
    if (!crop) return res.status(404).send("Crop not found");

    // Only the seller can delete their own item
    if (crop.email === req.session.user.email) {
      const cropName = crop.name;
      await Crops.findByIdAndDelete(id);
      return res.send(`<script>
        alert("Success: Listing for '${cropName}' has been permanently removed.");
        window.location.href = document.referrer || "/home";
      </script>`);
    } else {
      return res.status(403).send("Unauthorized to delete this listing");
    }
  } catch (err) {
    console.error("Error deleting crop:", err);
    res.status(500).send("Server error during deletion");
  }
});

// Edit Crops
app.get("/editAuth/:id", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  let { id } = req.params;
  let crop = await Crops.findById(id);
  res.render('EditCrops', { crop, user: req.session.user });
});

app.patch("/EditCrops/:id", async (req, res) => {
  let { id } = req.params;
  const updatedCrop = await Crops.findByIdAndUpdate(id, { ...req.body.crops }, { new: true });
  if (updatedCrop && updatedCrop.Type === "bid") {
    res.redirect("/bid");
  } else {
    res.redirect("/selling");
  }
});

// Buying Page 
app.post("/buying", (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  let cartItems = [];
  try {
    if (req.body.cartData) {
      cartItems = JSON.parse(req.body.cartData);
      // Sanitize quantity: remove 'kg' and convert to number
      cartItems = cartItems.map(item => ({
        ...item,
        numericQty: parseFloat(String(item.quantity).replace(/[^\d.]/g, "")) || 1
      }));
      req.session.cartItems = cartItems;
    }
  } catch (err) {
    console.error("Error parsing cartData:", err);
  }
  res.render("Buying", { user: req.session.user, cartItems, hideFooter: true });
});

app.post("/order", async (req, res) => {
  try {
    const { buyerName, buyerEmail, buyerAddress, cartData, totalAmount } = req.body;
    if (!buyerName || !buyerEmail || !buyerAddress) return res.status(400).send("Missing buyer details.");

    let cartItems = [];
    try {
      const parsed = typeof cartData === "string" ? JSON.parse(cartData) : cartData || [];
      cartItems = parsed.map((item) => {
        let numericQty = parseFloat(String(item.quantity).replace(/[^\d.]/g, "")) || 1;
        const price = Number(item.price) || 0;
        const total = Math.round(price * numericQty * 100) / 100;
        return {
          name: item.name,
          price,
          quantity: item.quantity || String(numericQty),
          numericQty,
          image: item.image || "",
          total,
          sellerEmail: item.sellerEmail || item.email || "",
        };
      });
    } catch (err) {
      console.error("Error parsing cartData:", err);
      return res.status(400).send("Invalid cart data.");
    }

    const readableOrderId = `AGB-ORD-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder = new Order({
      buyerName,
      buyerEmail,
      buyerAddress,
      cartItems,
      totalAmount: Number(totalAmount) || cartItems.reduce((s, i) => s + (i.total || 0), 0),
      orderId: readableOrderId,
    });
    await newOrder.save();
    return res.render("OrderSuccess", { user: req.session.user, order: newOrder });
  } catch (err) {
    console.error("Order error:", err);
    return res.status(500).send("Order placement failed.");
  }
});

app.get("/Myorder", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  try {
    const orders = await Order.find({ buyerEmail: req.session.user.email }).sort({ createdAt: -1 });
    res.render("Myorder", { user: req.session.user, orders });
  } catch (err) {
    res.status(500).send("Error fetching orders");
  }
});

app.get("/order/:id", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).send("Order not found");
    if (order.status === "Delivered") {
      await Order.findByIdAndDelete(req.params.id);
      return res.redirect("/Myorder");
    }
    res.render("OrderSuccess", { user: req.session.user, order });
  } catch (err) {
    res.status(500).send("Error");
  }
});

app.post("/order/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"].includes(status)) return res.status(400).send("Invalid status");
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (status === "Delivered") await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Status updated", order });
  } catch (err) {
    res.status(500).send("Error");
  }
});

app.delete("/cancelorder/:id", async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.redirect('/Myorder');
});

app.post("/payment", (req, res) => {
  try {
    const { orderId, buyerName, buyerEmail, buyerAddress, totalAmount, cartItems } = req.body;
    res.render("pay/payment", {
      user: req.session.user,
      orderId,
      buyerName,
      buyerEmail,
      buyerAddress,
      totalAmount,
      cartItems: JSON.parse(cartItems),
      hideFooter: true
    });
  } catch (err) {
    res.status(500).send("Payment page error");
  }
});

app.post("/payment/confirm", async (req, res) => {
  try {
    const { orderId, cartItems } = req.body;
    const parsedCart = typeof cartItems === "string" ? JSON.parse(cartItems) : cartItems;
    // Use findOneAndUpdate with the readable orderId
    const order = await Order.findOneAndUpdate({ orderId: orderId }, { status: "Paid" }, { new: true }).lean();
    if (!order) return res.status(404).send("Order not found");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: 'agribidpvtltd@gmail.com', pass: 'ugyj whvp cggs sjns' },
    });

    for (const item of parsedCart) {
      if (!item.sellerEmail) continue;
      await transporter.sendMail({
        from: "agribidpvtltd@gmail.com",
        to: item.sellerEmail,
        subject: `🌾 New Order for Your Crop: ${item.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; background:#f4f4f9; padding:20px;">
            <div style="max-width:600px; margin:auto; background:#fff; border-radius:10px; box-shadow:0 2px 8px rgba(0,0,0,0.1); overflow:hidden;">
              <div style="background:#2d6a4f; color:white; padding:15px; text-align:center;"><h2>🌾 New Order Received</h2></div>
              <div style="padding:20px;">
                <h3 style="color:#333;">Order Details</h3>
                <p><b>Crop:</b> ${item.name}</p>
                <p><b>Price:</b> ₹${item.price}</p>
                <p><b>Quantity:</b> ${item.quantity}</p>
                <p><b>Total:</b> ₹${item.total}</p>
                <p><b>Buyer:</b> ${order.buyerName} (${order.buyerEmail})</p>
                <p><b>Address:</b> ${order.buyerAddress}</p>
              </div>
              <div style="background:#2d6a4f; color:white; text-align:center; padding:10px;"><p>AgriBid 🌱</p></div>
            </div>
          </div>
        `
      });
    }
    res.render("pay/PaymentSuccess", { user: req.session.user, orderId });
  } catch (err) {
    res.status(500).send("Confirmation failed");
  }
});

app.get("/selling", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  const crops = await Crops.find({ email: req.session.user.email });
  res.render("Selling", { user: req.session.user, crops });
});

app.get("/schemes", (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  res.render("Schemes", { user: req.session.user });
});

const farmingArticles = [
  {
    id: "soil-preparation",
    title: "How to Prepare Soil Before Sowing",
    image: "/uploads/farm_bg1.png",
    images: ["/uploads/farm_bg1.png", "/uploads/article1_img1_1776099635242.png", "/uploads/article1_img2_1776099652143.png"],
    excerpt: "Enrich your soil organically and scientifically for maximum yield.",
    content: `
      <h2>The Foundation of Great Yields</h2>
      <p>Preparing the soil before sowing is the most crucial step in agriculture. Poor soil preparation can lead to stunted root growth, weak plants, and poor water retention.</p>
      
      <h3>1. Soil Testing and Analysis</h3>
      <p>Before adding any fertilizers, it's essential to understand your soil's pH and nutrient levels (NPK - Nitrogen, Phosphorus, Potassium). A balanced pH (typically between 6.0 and 7.0) ensures that nutrients are readily available to the plants.</p>
      
      <h3>2. Tillage and Loosening</h3>
      <p>Tillage helps in breaking the hardpan, allowing roots to penetrate deeper. It also exposes soil pests to natural predators and sunlight, naturally reducing their population.</p>
      
      <h3>3. Organic Matter Integration</h3>
      <p>Mixing well-rotted farmyard manure (FYM) or compost into the soil drastically improves its organic carbon content. This enhances the soil's water-holding capacity and encourages the growth of beneficial microbes.</p>
      
      <h3>4. Soil Sterilization (Solarization)</h3>
      <p>Covering the prepared beds with transparent polythene sheets for a few weeks during peak summer can naturally kill off weed seeds, nematodes, and soil-borne pathogens.</p>
      
      <blockquote>"A well-prepared soil is half the battle won in farming."</blockquote>
    `,
    date: "12 Apr, 2026"
  },
  {
     id: "crop-diseases",
     title: "5 Common Crop Diseases and Prevention",
     image: "/uploads/pest_control.png",
     images: ["/uploads/pest_control.png", "/uploads/article2_img1_1776099671800.png", "/uploads/article2_img2_1776099746827.png"],
     excerpt: "Learn how to prevent diseases without relying heavily on harmful chemicals.",
     content: `
       <h2>Protecting Your Harvest</h2>
       <p>Crop diseases can wipe out an entire season's hard work if not detected and managed early. Here are the 5 most common diseases and how to easily prevent them natively.</p>

       <h3>1. Powdery Mildew</h3>
       <p><strong>Symptoms:</strong> White, powdery spots on the leaves and stems.<br>
       <strong>Prevention:</strong> Ensure adequate spacing between plants to improve air circulation. Avoid overhead watering, and apply a mixture of neem oil and water as a preventive spray.</p>

       <h3>2. Root Rot</h3>
       <p><strong>Symptoms:</strong> Yellowing leaves, stunted growth, and mushy, dark roots.<br>
       <strong>Prevention:</strong> Improve soil drainage. Raised beds are excellent for avoiding root rot. Applying Trichoderma (a beneficial fungus) to the soil can prevent pathogenic fungi from establishing.</p>

       <h3>3. Blight (Early & Late)</h3>
       <p><strong>Symptoms:</strong> Brown or black lesions on leaves, surrounded by a yellow halo.<br>
       <strong>Prevention:</strong> Practice crop rotation. Never plant crops from the same family in the exact same spot year after year. Copper-based organic fungicides can be used early on.</p>

       <h3>4. Rust</h3>
       <p><strong>Symptoms:</strong> Orange, yellow, or brown pustules on the undersides of leaves.<br>
       <strong>Prevention:</strong> Remove infected plant debris immediately. Use sulfur dust as an early organic intervention.</p>

       <h3>5. Aphid-Transmitted Viruses</h3>
       <p><strong>Symptoms:</strong> Curled leaves, mosaic patterns, and stunted growth.<br>
       <strong>Prevention:</strong> Plant companion crops like marigolds to deter aphids. Ladybugs are natural predators that can keep aphid populations in check.</p>
     `,
     date: "10 Apr, 2026"
  },
  {
      id: "smart-irrigation",
      title: "Smart Irrigation for Water Conservation",
      image: "/uploads/farm_bg3.png",
      images: ["/uploads/farm_bg3.png", "/uploads/article3_img1_1776099773027.png", "/uploads/article3_img2_1776099802426.png"],
      excerpt: "Maximize your crop yield while saving precious water resources through modern techniques.",
      content: `
        <h2>Every Drop Counts</h2>
        <p>With changing climate patterns, water scarcity is a looming threat over agriculture. Transitioning to smart irrigation is no longer a luxury; it is an absolute necessity.</p>
        
        <h3>1. Drip Irrigation Systems</h3>
        <p>Drip irrigation delivers water directly to the plant's roots, minimizing evaporation and runoff. It can save up to 50% more water compared to traditional flood irrigation. Plus, nutrients can be mixed directly into the water supply (fertigation) for precise feeding.</p>

        <h3>2. Soil Moisture Sensors</h3>
        <p>Instead of watering on a fixed schedule, soil moisture sensors tell you exactly when the soil is dry. This prevents over-watering, which can lead to root rot and nutrient leaching.</p>

        <h3>3. Mulching</h3>
        <p>Covering the soil surface with organic mulch (like straw or dry leaves) or plastic mulch traps moisture, significantly reducing the evaporation rate. It also naturally suppresses water-stealing weeds.</p>

        <h3>4. Rainwater Harvesting</h3>
        <p>Creating farm ponds to capture monsoon runoff can provide a reliable water buffer during dry spells. This also helps in recharging the local groundwater table.</p>

        <blockquote>"Adopt water conservation today, ensure food security for tomorrow."</blockquote>
      `,
      date: "05 Apr, 2026"
  }
];

app.get("/home", (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  res.render("home", { user: req.session.user, footerType: 'pro', farmingArticles });
});

app.get("/weather", (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  res.render("Weather", { user: req.session.user });
});

// farmingArticles moved above
app.get("/article/:id", (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  const articleObj = farmingArticles.find(a => a.id === req.params.id);
  if (!articleObj) return res.status(404).send("Article not found");
  res.render("Article", { user: req.session.user, article: articleObj });
});


app.get("/guidance", (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  res.render("guidance", { user: req.session.user });
});

app.get('/market', async (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  try {
    const allCrops = await Crops.find().lean();
    const filtered = allCrops.filter(crop => {
      const num = parseInt(String(crop.quantity).replace(/\D/g, ''), 10);
      return !isNaN(num) && num > 100;
    });
    const q = (req.query.q || '').trim().toLowerCase();
    let results = filtered;
    if (q) {
      results = results.filter(c =>
        (c.name || '').toLowerCase().includes(q) ||
        (c.seller || '').toLowerCase().includes(q) ||
        (c.city || '').toLowerCase().includes(q)
      );
    }
    const sort = req.query.sort || 'newest';
    if (sort === 'price-asc') results.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') results.sort((a, b) => b.price - a.price);
    else if (sort === 'qty-desc') results.sort((a, b) => {
      const an = parseInt(String(a.quantity).replace(/\D/g, ''), 10) || 0;
      const bn = parseInt(String(b.quantity).replace(/\D/g, ''), 10) || 0;
      return bn - an;
    });
    else results.reverse();
    res.render('market', { user: req.session.user, crops: results, query: q, sort });
  } catch (err) {
    res.status(500).send('Market error');
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  if (req.path.startsWith("/upload-profile") || req.xhr) return res.status(500).json({ success: false, error: err.message });
  res.status(500).send("Something went wrong!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
