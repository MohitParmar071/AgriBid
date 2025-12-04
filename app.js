const express = require('express');
const app = express();
const port = 8080;
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
let newotp = () => {
     let otp = generateotp(4);
     return otp;
} 

//STore email and OTp 
const otpStore = {};

//Sending OTP
let SendingOTP = async (email) =>{
 let otp = newotp()
 let expiresAt = Date.now() + 1 * 60 * 1000;
 otpStore[email] = {otp,expiresAt};
 console.log(otpStore);
const transporter = await nodemailer.createTransport({
  service: "gmail", 
  auth: {
        user: 'mohitparmar0954@gmail.com',
        pass: 'skwr rcih qpoa yums'
  },
});

const mailOptions = await {
     
  from: "mohitparmar0954@gmail.com",
  to: email, 
  subject: "Sending OTP", 
  //text:"sending OTP",
  html:`<h1>Sending Message By Trending Cloth , using this ${otp} otp Login over Page</h1>`,
  };

await transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error("Error sending SMS:", error);
  } else {
    console.log("SMS sent:", info.response);
  
  }
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


// Registration
app.get("/register", (req, res) => {
    res.render("EnteringBlog/Register", { error: null });
});

app.post("/register", upload.single("img"), async (req, res) => {
  try {
    let data = req.body.con;
    let email = data.email;

    // Check duplicate email
    let existingUser = await Contect.findOne({ email: email });
    if (existingUser) {
      return res.render("EnteringBlog/Register", { error: "Email already exists" });
    }

    // Save uploaded file path
    if (req.file) {
      data.img = "/uploads/" + req.file.filename;  // save image path
    }

    let contectdata = new Contect(data);
    await contectdata.save();

    req.session.email = email;
    SendingOTP(email);
    res.redirect("/otp");
  } catch (err) {
    console.log(err);
    res.render("EnteringBlog/Register", { error: "Something went wrong!" });
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
        user: "mohitparmar0954@gmail.com",
        pass: "skwr rcih qpoa yums", // Gmail App Password
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
              from: "mohitparmar0954@gmail.com",
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
app.get("/addNew",(req,res)=>{
    if (!req.session.user) {
    return res.redirect("/login");
  }
    res.render("addNew",{user:req.session.user});
})

app.post("/crops",async (req,res)=>{
  const crops = await new Crops(req.body.crops);
  await crops.save();  

    if(crops.Type == 'buy')
    {
  res.redirect("/crops");
    }else{
      res.redirect('/bid')
    }
})

//delete Crops
app.delete("/deleteAuth/:id",async (req,res)=>{
  let {id} = req.params;
   await Crops.findByIdAndDelete(id);
  res.redirect('/selling')
})

//Edit Crops
app.get("/editAuth/:id",async (req,res)=>{
    if (!req.session.user) {
    return res.redirect("/login");
  }
  let {id} = req.params;
  let crop = await Crops.findById(id);
  res.render('EditCrops',{crop,user:req.session.user});
})

app.patch("/EditCrops/:id",async(req,res)=>{
  let {id} = req.params;
  let data = await Crops.findByIdAndUpdate(id,{...req.body.crops},{new:true});
  res.redirect("/selling");
})

// Buying Page 
app.post("/buying", (req, res) => {
  if (!req.session.user) return res.redirect("/login");

   let cartData = JSON.parse(req.body.cartData);

// sanitize quantity
cartData = cartData.map(crop => ({
  ...crop,
  quantity: Number(String(crop.quantity).replace(/[^0-9.]/g, "")) // remove "kg"
}));

  let cartItems = [];
  try {
    if (req.body.cartData) {
      cartItems = JSON.parse(req.body.cartData);
      req.session.cartItems = cartItems; // save in session
    }
  } catch (err) {
    console.error("Error parsing cartData:", err);
  }

  res.render("Buying", { user: req.session.user, cartItems });
});


app.post("/order", async (req, res) => {
  try {
    const { buyerName, buyerEmail, buyerAddress, cartData, totalAmount } = req.body;

    if (!buyerName || !buyerEmail || !buyerAddress) {
      return res.status(400).send("Missing buyer details.");
    }

    // Parse incoming cart data
    let cartItems = [];
    try {
      const parsed = typeof cartData === "string" ? JSON.parse(cartData) : cartData || [];
      cartItems = parsed.map((item) => {
        let numericQty = 1;
        if (typeof item.quantity === "number") numericQty = item.quantity;
        else {
          const m = String(item.quantity).match(/[\d.]+/);
          numericQty = m ? parseFloat(m[0]) : 1;
        }

        const price = Number(item.price) || 0;
        const total = Math.round(price * numericQty * 100) / 100;

        return {
          name: item.name,
          price,
          quantity: item.quantity || String(numericQty),
          numericQty,
          image: item.image || "",
          total,
          sellerEmail: item.sellerEmail || item.email || "", // accept seller email
        };
      });
    } catch (err) {
      console.error("Error parsing cartData:", err);
      return res.status(400).send("Invalid cart data.");
    }

    // Save order in DB
    const newOrder = new Order({
      buyerName,
      buyerEmail,
      buyerAddress,
      cartItems,
      totalAmount: Number(totalAmount) || cartItems.reduce((s, i) => s + (i.total || 0), 0),
    });
    await newOrder.save();


    // Finally render order success page
    return res.render("OrderSuccess", { user: req.session.user, order: newOrder });

  } catch (err) {
    console.error("Order saving error:", err);
    return res.status(500).send("Something went wrong while placing the order.");
  }
});

// My Orders Route
app.get("/Myorder", async (req, res) => {
  try {
    if (!req.session.user) return res.redirect("/login");

    const email = req.session.user.email;

    // Optional: delete delivered orders if you want cleanup
    // await Order.deleteMany({ buyerEmail: email, status: "Delivered" });

    const orders = await Order.find({ buyerEmail: email }).sort({ createdAt: -1 });

    return res.render("Myorder", {
      user: req.session.user,
      orders,
    });
  } catch (err) {
    console.error("Error fetching orders:", err);
    return res.status(500).send("Something went wrong!");
  }
});

// --- Order detail page (GET /order/:id) ---
app.get("/order/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findById(id);

    if (!order) return res.status(404).send("Order not found.");

    // If you want to remove delivered orders when someone tries to view them:
    if (order.status === "Delivered") {
      // delete and redirect to myorder
      await Order.findByIdAndDelete(id);
      return res.redirect("/myorder");
    }

    return res.render("OrderSuccess", { user: req.session.user, order });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Something went wrong!");
  }
});

// --- (Optional) Admin route: change status (POST /order/:id/status) ---
app.post("/order/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const id = req.params.id;
    if (!["Pending","Confirmed","Shipped","Delivered","Cancelled"].includes(status)) {
      return res.status(400).send("Invalid status");
    }
    const order = await Order.findById(id);
    if (!order) return res.status(404).send("Order not found");

    order.status = status;
    await order.save();

    // If status is Delivered and you want to remove it immediately:
    if (status === "Delivered") {
      // delete after marking delivered
      await Order.findByIdAndDelete(id);
      return res.json({ message: "Order marked Delivered and removed." });
    }

    return res.json({ message: "Status updated", order });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Something went wrong");
}
});

//Calcal Order
app.delete("/cancelorder/:id",async(req,res)=>{
  let {id} = req.params;
   await Order.findByIdAndDelete(id)
   res.redirect('/Myorder')
})

// Load Payment Page
app.post("/payment", (req, res) => {
  try {
    const { orderId, buyerName, buyerEmail, buyerAddress, totalAmount, cartItems } = req.body;
    const parsedCart = JSON.parse(cartItems);

    res.render("pay/payment", {
       user: req.session.user,
      orderId,
      buyerName,
      buyerEmail,
      buyerAddress,
      totalAmount,
      cartItems: parsedCart
    });
  } catch (err) {
    console.error("Payment route error:", err);
    res.status(500).send("Error loading payment page.");
  }
});

//cofirm payment
app.post("/payment/confirm", async (req, res) => {
  try {
    const { orderId, cartItems } = req.body;

    // Parse cart items
    const parsedCart = typeof cartItems === "string" ? JSON.parse(cartItems) : cartItems;

    // Fetch order from DB
    const order = await Order.findByIdAndUpdate(orderId, { status: "Paid" }, { new: true }).lean();
    if (!order) return res.status(404).send("Order not found");

    const { buyerName, buyerEmail, buyerAddress } = order;

    // Nodemailer setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mohitparmar0954@gmail.com",
        pass: "skwr rcih qpoa yums",
      },
    });

    // Send email to each seller
    for (const item of parsedCart) {
      if (!item.sellerEmail) continue;

      const mailOptions = {
        from: "mohitparmar0954@gmail.com",
        to: item.sellerEmail,
        subject:` 🌾 New Order for Your Crop: ${item.name}`,
        html:`
          <div style="font-family: Arial, sans-serif; background:#f4f4f9; padding:20px;">
            <div style="max-width:600px; margin:auto; background:#fff; border-radius:10px; box-shadow:0 2px 8px rgba(0,0,0,0.1); overflow:hidden;">
              
              <div style="background:#2d6a4f; color:white; padding:15px; text-align:center;">
                <h2>🌾 New Order Received</h2>
              </div>

              <div style="padding:20px;">
                <h3 style="color:#333;">Crop Details</h3>
                <table style="width:100%; border-collapse:collapse;">
                  <tr><td><b>Crop</b></td><td>${item.name}</td></tr>
                  <tr><td><b>Price</b></td><td>₹${item.price}</td></tr>
                  <tr><td><b>Quantity</b></td><td>${item.quantity}</td></tr>
                  <tr><td><b>Total</b></td><td>₹${item.total}</td></tr>
                  ${item.image ? `<tr><td colspan="2" style="text-align:center;">
                    <img src="${item.image}" alt="${item.name}" style="max-width:200px; border-radius:8px;"/>
                  </td></tr>` : ""}
                </table>

                <h3 style="margin-top:20px; color:#333;">Buyer Details</h3>
                <p><b>Name:</b> ${buyerName}</p>
                <p><b>Email:</b> ${buyerEmail}</p>
                <p><b>Address:</b> ${buyerAddress}</p>

                <div style="margin-top:20px; padding:15px; background:#f1f8f4; border-left:4px solid #2d6a4f;">
                  Please contact the buyer directly for delivery and coordination.
                </div>
              </div>

              <div style="background:#2d6a4f; color:white; text-align:center; padding:10px;">
                <p>AgriBid - Connecting Farmers & Buyers 🌱</p>
              </div>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email sent to seller: ${item.sellerEmail}`);
    }

    res.render("pay/PaymentSuccess", { user: req.session.user, orderId });

  } catch (err) {
    console.error("❌ Payment confirmation error:", err);
    res.status(500).send("Payment failed.");
  }
});

//Selling
app.get("/selling", async (req, res) => {

  if (!req.session.user) {
    return res.redirect("/login");
  }

  const userEmail = req.session.user.email;
  const crops = await Crops.find({ email: userEmail });
  //const cropIds = crops.map(c => c._id.toString());
  //const orders = await Orders.find({ cropId: { $in: cropIds } });

  res.render("Selling", { user: req.session.user, crops });
});  

// HOME
app.get("/home",(req,res)=>{
    if(!req.session.user){
        return res.redirect("/login");
    }
    res.render("home",{user:req.session.user});
})

// Weather
app.get("/weather",(req,res)=>{
    res.render("Weather",{user:req.session.user});
})

//Guidance
app.get("/guidance",(req,res)=>{
    res.render("guidance",{user:req.session.user});
})

//Market
app.get('/market', async (req, res) => {
   if(!req.session.user){
        return res.redirect("/login");
    }
  try {
    // Fetch all crops (or you can limit fields)
    const allCrops = await Crops.find().lean();

    // Parse numeric quantity from strings like "150kg", "200 kg", "300 Kg"
    const filtered = allCrops.filter(crop => {
      if (!crop.quantity) return false;
      // extract digits
      const num = parseInt(String(crop.quantity).replace(/\D/g, ''), 10);
      return !isNaN(num) && num > 100;
    });

    // Optionally support query params for search / sort on server
    const q = (req.query.q || '').trim().toLowerCase();
    let results = filtered;
    if (q) {
      results = results.filter(c =>
        (c.name || '').toLowerCase().includes(q) ||
        (c.seller || '').toLowerCase().includes(q) ||
        (c.city || '').toLowerCase().includes(q)
      );
    }

    const sort = req.query.sort || 'newest'; // newest, price-asc, price-desc, qty-desc
    if (sort === 'price-asc') results.sort((a,b)=> a.price - b.price);
    else if (sort === 'price-desc') results.sort((a,b)=> b.price - a.price);
    else if (sort === 'qty-desc') results.sort((a,b)=>{
      const an = parseInt(String(a.quantity).replace(/\D/g,''),10)||0;
      const bn = parseInt(String(b.quantity).replace(/\D/g,''),10)||0;
      return bn - an;
    });
    else results.reverse(); // newest assuming DB order, or you can sort by _id/date

    res.render('market', {
      user:req.session.user,
      crops: results,
      query: q,
      sort,
      user: req.user || null
    });
  } catch (err) {
    console.error('Market route error:', err);
    res.status(500).send('Server error');
  }
});

//listen port
app.listen(port,()=>{
    console.log(`Port running at ${port}`);
})

