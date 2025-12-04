const cropsdata = [
    {
    name: "Tomatoes",
    price: 20,
    quantity: "10kg",
    seller: "Sunita Mehra",
    email: "sunita.mehra@example.com",
    contact: "9123456789",
    city: "Mumbai",
    imageUrl: "https://imgs.search.brave.com/BjiRQ48OxjMy8r993C_RwsoMkQblecv2ZsZ4gX6fV14/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAwLzY5LzI4LzI3/LzM2MF9GXzY5Mjgy/NzY5X25uR1g3U2lk/QUZRczhTd1VnbVpG/eDVabHo2c1hSa2w0/LmpwZw"
  },
  {
    name: "Raythm (tal)",
    price: 35,
    quantity: "50kg",
    seller: "Ravi Kumar",
    email: "ravi.kumar@example.com",
    contact: "9876543210",
    city: "Delhi",
    imageUrl: "https://imgs.search.brave.com/qX1MMM2r0DpemZRmbH08cRos8MvuSWgyNPolSMvAuKw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aGVm/cnVpdHlqZW0uY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDI0/LzAxL3doaXRlLXNl/c2FtZS1zZWVkcy16/b29tZWQtaW4uanBn"
  },
  {
    name: "GinGer (Aadu)",
    price: 100,
    quantity: "5kg",
    seller: "Amit Verma",
    email: "amit.verma@example.com",
    contact: "9898989898",
    city: "Lucknow",
    imageUrl: "https://imgs.search.brave.com/G_CVTD9byEHskiGz1bMXAkI2wwhTI8lbQjGlFOD_rhI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjYv/NjU1LzIyOS9zbWFs/bC9haS1nZW5lcmF0/ZWQtYWktZ2VuZXJh/dGl2ZS1naW5nZXIt/cm9vdC12ZWdldGFi/bGUtb3JnYW5pYy1l/Y28tZm9vZC1udXRy/aXRpb24tY3VsaW5h/cnktc3BpY3ktaGVh/bHRoeS1mcmVzaC1o/ZXJiLWdyYXBoaWMt/YXJ0LXBob3RvLmpw/Zw"
  },
  {
    name: "Lemon",
    price: 25,
    quantity: "10kg",
    seller: "Priya Sharma",
    email: "priya.sharma@example.com",
    contact: "9000000001",
    city: "Pune",
    imageUrl: "https://imgs.search.brave.com/5-NFKSQ5GjM0d_Q1sqdYnfPhTHoRuH-wsLAugomXbdQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5zcGxhc2gu/Y29tL3Bob3RvLTE1/OTA1MDI1OTM3NDct/NDJhOTk2MTMzNTYy/P2ZtPWpwZyZxPTYw/Jnc9MzAwMCZpeGxp/Yj1yYi00LjEuMCZp/eGlkPU0zd3hNakEz/ZkRCOE1IeHpaV0Z5/WTJoOE1ueDhiR1Z0/YjI1OFpXNThNSHg4/TUh4OGZEQT0"
  },
  {
    name: "Tuwer",
    price: 40,
    quantity: "12kg",
    seller: "Karan Patel",
    email: "karan.patel@example.com",
    contact: "9023456789",
    city: "Ahmedabad",
    imageUrl: "https://imgs.search.brave.com/pBbSoujZenntv_w89YS-Y-FDTfIj-2Zx8_A0DLF9npg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hdGZn/cmVlbnMuY29tL2Nk/bi9zaG9wL3Byb2R1/Y3RzL1BpZ2VvbnBl/YXMtdHV3ZXJfNTgw/eC5qcGc_dj0xNTg4/MDA0MDE1"
  },
  {
    name: "Rajma",
    price: 18,
    quantity: "10kg",
    seller: "Neha Reddy",
    email: "neha.reddy@example.com",
    contact: "9812345678",
    city: "Hyderabad",
    imageUrl: "https://imgs.search.brave.com/4ARylcy0KH-Pd_wJ66ah2NMyIDjww6sApH5jOa-Amos/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9nb25l/ZmFybWVycy5jb20v/Y2RuL3Nob3AvcHJv/ZHVjdHMvaW1hZ2Vf/ODkyNDhiOGQtYjFh/Yi00MGRjLTkyMDct/MTk4ODYwMmQzN2Fh/X2NvbXBhY3QuanBn/P3Y9MTYzNTk0NTg3/Ng"
  },
  {
    name: "Peanuts",
    price: 30,
    quantity: "5kg",
    seller: "Sohan Lal",
    email: "sohan.lal@example.com",
    contact: "9700000000",
    city: "Jaipur",
    imageUrl: "https://imgs.search.brave.com/pvQNZS6SLSqDjFNDZHbS7emEI0Z7EjL712VgnYwM1wo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy8z/LzM2L1JvYXN0ZWRf/UGVhbnV0c193aXRo/X3NoZWxsLmpwZw"
  },
  {
    name: "basmati Rice",
    price: 45,
    quantity: "25kg",
    seller: "Manish Gupta",
    email: "manish.gupta@example.com",
    contact: "9654321000",
    city: "Patna",
    imageUrl: "https://imgs.search.brave.com/50oC6UPl1rwPWlvMXGBhpe5WVNbER75EO14E8yeMuVw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9iYXNt/YXRpLXJpY2Utc2Fj/ay03MjI5ODg1Lmpw/Zw"
  },
  {
    name: "orgenic Chai",
    price: 120,
    quantity: "5kg",
    seller: "Pooja Yadav",
    email: "pooja.yadav@example.com",
    contact: "9871234560",
    city: "Shimla",
    imageUrl: "https://imgs.search.brave.com/g_Dz6lftXy57PjFn3o4lJFlrETYOm7ilKISs5_P_eCo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLmV0/c3lzdGF0aWMuY29t/LzU4MDAzMTYvci9p/bC83MTE0NTYvODcx/OTMyMDIwL2lsXzc5/NHhOLjg3MTkzMjAy/MF8yZ2ZnLmpwZw"
  },
  {
    name: "Makai",
    price: 35,
    quantity: "4kg",
    seller: "Rajeev Singh",
    email: "rajeev.singh@example.com",
    contact: "9100001111",
    city: "Varanasi",
    imageUrl: "https://imgs.search.brave.com/RQM575IAKTi3rzit4McEZ5ebEZc51pNs_Ybsw_jJxww/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5zcGxhc2gu/Y29tL3Bob3RvLTE2/MzQ0Njc1MjQ4ODQt/ODk3ZDBhZjVlMTA0/P2ZtPWpwZyZxPTYw/Jnc9MzAwMCZpeGxp/Yj1yYi00LjEuMCZp/eGlkPU0zd3hNakEz/ZkRCOE1IeHpaV0Z5/WTJoOE0zeDhZMjl5/Ym54bGJud3dmSHd3/Zkh4OE1BPT0"
  },
  
  {
    name: "Brinjal (Baingan)",
    price: 35,
    quantity: "50kg",
    seller: "Ravi Kumar",
    email: "ravi.kumar@example.com",
    contact: "9876543210",
    city: "Delhi",
    imageUrl: "https://imgs.search.brave.com/nnVLgDFmhEFdHnyHX_hG7pVpbLvESNmbDh9clGYhh1M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly92aXJz/YW5naHZpLmNvbS9V/cGxvYWRlZEZpbGVz/L0ZDa0ltYWdlcy9i/cmluamFsLmpwZw"
  },
  {
    name: "Sitafal",
    price: 20,
    quantity: "10kg",
    seller: "Sunita Mehra",
    email: "sunita.mehra@example.com",
    contact: "9123456789",
    city: "Mumbai",
    imageUrl: "https://imgs.search.brave.com/RJVJ1k1_M0cQSVU9Uu6kR1sgSXuDuTdpONbyWMa1dno/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTM1/NDQ0NjAwMi9waG90/by9hLWNsb3NlLXVw/LWN1c3RhcmQtYXBw/bGUtZnJ1aXQtdG8t/c2VsbC1pbi1mcmVz/aC1tYXJrZXQtYW5u/b25hLXJldGljdWxh/dGEuanBnP3M9NjEy/eDYxMiZ3PTAmaz0y/MCZjPTg0NWJLRHha/ck5PRjZkdk1WOG5B/RHBjbmZfMnhTSE45/MlpCeFp3V1FoUU09"
  },
  {
    name: "Dadam",
    price: 100,
    quantity: "5kg",
    seller: "Amit Verma",
    email: "amit.verma@example.com",
    contact: "9898989898",
    city: "Lucknow",
    imageUrl: "https://imgs.search.brave.com/WW4r7dQGChFJIRsaKKl_SC47CItLZ08OtQIHKY5q3ao/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly81Lmlt/aW1nLmNvbS9kYXRh/NS9ZSC9VRy9NWS00/NzYzOTgyOS9mcmVz/aC1wb21lZ3JhbmF0/ZS01MDB4NTAwLmpw/Zw"
  },
  {
    name: "Chille(mirch)",
    price: 25,
    quantity: "10kg",
    seller: "Priya Sharma",
    email: "priya.sharma@example.com",
    contact: "9000000001",
    city: "Pune",
    imageUrl: "https://imgs.search.brave.com/mqd9vDqcJcBv69T0EkEyPu5xnm-Tb1ofcoPcf0W8eLc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NTFRbGFwQlFPUUwu/anBn"
  },
  {
    name: "Tuber",
    price: 40,
    quantity: "12kg",
    seller: "Karan Patel",
    email: "karan.patel@example.com",
    contact: "9023456789",
    city: "Ahmedabad",
    imageUrl: "https://imgs.search.brave.com/VvlKTfW0kGwf-RSgQ4hW7G_rdL3L4E95DMscPDeasts/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMuZWNob2NvbW11/bml0eS5vcmcvaW1h/Z2VzLzdmZjZiZjU5/LTgyMWUtNGVjYS1h/OGYyLTEzN2M4ZDRi/NGIwYy9lY2hvLXRl/Y2gtbm90ZS04MS1y/b290LWNyb3BzLWZp/Z3VyZS02X21kLmpw/Zw"
  },
  {
    name: "baby Potato",
    price: 18,
    quantity: "10kg",
    seller: "Neha Reddy",
    email: "neha.reddy@example.com",
    contact: "9812345678",
    city: "Hyderabad",
    imageUrl: "https://imgs.search.brave.com/imHQ86oANK1UsQsrEYM3BQ-qahJRRGyg4UVPX6Jp2Jo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9yYXct/YmFieS1wb3RhdG9l/cy1zYWNrLWNsb3Nl/LXVwLWZvb2QtMzE0/MjMzMDguanBn"
  },
  {
    name: "white Raw Kapas",
    price: 30,
    quantity: "5kg",
    seller: "Sohan Lal",
    email: "sohan.lal@example.com",
    contact: "9700000000",
    city: "Jaipur",
    imageUrl: "https://imgs.search.brave.com/2_2S_d4UdZxKc5JPKt6yQ-QAkFXTRbvJpFe9FYee0Xc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly81Lmlt/aW1nLmNvbS9kYXRh/NS9UQy9PTC9HRy9B/TkRST0lELTEwNTEw/NzIzMS9wcm9kdWN0/LWpwZWctMTAwMHgx/MDAwLmpwZw"
  },
  {
    name: "Bajri",
    price: 45,
    quantity: "25kg",
    seller: "Manish Gupta",
    email: "manish.gupta@example.com",
    contact: "9654321000",
    city: "Patna",
    imageUrl: "https://imgs.search.brave.com/T9UpsuXLX8jYjx6vhjst2pFy9yT-NRC2KM92w5oYRDg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMyLmJpZ3N0b2Nr/cGhvdG8uY29tLzQv/MS85L2xhcmdlMi85/MTQ0MTQ1Ny5qcGc"
  },
  {
    name: "Apple",
    price: 120,
    quantity: "5kg",
    seller: "Pooja Yadav",
    email: "pooja.yadav@example.com",
    contact: "9871234560",
    city: "Shimla",
    imageUrl: "https://imgs.search.brave.com/9DIOT5QCxA-GFa2MJLMrmL7COz9CI6-LyAnMzgsZDfs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wbHVz/LnVuc3BsYXNoLmNv/bS9wcmVtaXVtX3Bo/b3RvLTE2NjcwNDky/OTI5ODMtZDI1MjRk/ZDBlZjA4P2ZtPWpw/ZyZxPTYwJnc9MzAw/MCZpeGxpYj1yYi00/LjEuMCZpeGlkPU0z/d3hNakEzZkRCOE1I/eHpaV0Z5WTJoOE1Y/eDhZWEJ3YkdWemZH/VnVmREI4ZkRCOGZI/d3c"
  },
  {
    name: "Kohlrabi",
    price: 35,
    quantity: "4kg",
    seller: "Rajeev Singh",
    email: "rajeev.singh@example.com",
    contact: "9100001111",
    city: "Varanasi",
    imageUrl: "https://imgs.search.brave.com/9Q4gxDgCwK7I8h_35LfKa9yyi3l-gdic_LczPs_S8MI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NTFXT3IwNms0Wkwu/anBn"
  },
  {
    name: "Wheat",
    price: 35,
    quantity: "50kg",
    seller: "Ravi Kumar",
    email: "ravi.kumar@example.com",
    contact: "9876543210",
    city: "Delhi",
    imageUrl: "https://imgs.search.brave.com/NVOdH6Gn7PiW6LyaAswZnxaEvwYXd4yYlyze7ic52xc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by93aGVhdC1ncmFp/bnMtYmFja2dyb3Vu/ZC1wcm9jZXNzZWQt/b3JnYW5pYy1kcnkt/d2hlYXQtc2VlZHNf/MTU3ODM3LTE5ODcu/anBnP3NlbXQ9YWlz/X2h5YnJpZCZ3PTc0/MA"
  },
  {
    name: "Tomatoes",
    price: 20,
    quantity: "10kg",
    seller: "Sunita Mehra",
    email: "sunita.mehra@example.com",
    contact: "9123456789",
    city: "Mumbai",
    imageUrl: "https://imgs.search.brave.com/r-um12Mbwpaj1xo7O_2oqQ55tRuavTQx9-3hclXlPmA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNTE5/NjYzMzE4L3Bob3Rv/L3RvbWF0b3MtYmFj/a2dyb3VuZC5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9TUJC/Z1AzdnJSZ2psaWpP/U2ZlT3RiR2podTRC/MzQ1bFBMLUZud1FX/dEpKVT0"
  },
  {
    name: "Gir Mango",
    price: 100,
    quantity: "5kg",
    seller: "Amit Verma",
    email: "amit.verma@example.com",
    contact: "9898989898",
    city: "Lucknow",
    imageUrl: "https://imgs.search.brave.com/olkhvbf70cXA_L9CdcNTzTzk5pavRmEY8CjjH82lgoo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAwLzA3LzU2LzEw/LzM2MF9GXzc1NjEw/ODNfVTRZZVYzWndR/V25aVFVpcHFZRkR6/bkJmVVNYTHMyVEQu/anBn"
  },
  {
    name: "Onions",
    price: 25,
    quantity: "10kg",
    seller: "Priya Sharma",
    email: "priya.sharma@example.com",
    contact: "9000000001",
    city: "Pune",
    imageUrl: "https://imgs.search.brave.com/KrRhHGxmqq-kP0fYd285AIY36ovfCRFFPGfeSQQ13Nc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTI5/NjExNDczNi9waG90/by9mcmVzaC1vbmlv/bnMtaW4teWVsbG93/LWh1c2tzLWJhY2tn/cm91bmQuanBnP3M9/NjEyeDYxMiZ3PTAm/az0yMCZjPWhNMURn/VklJMS1MZVNpWTNr/aV9SajJuMERaZ3h6/WVBzRHpGMlp0LUI3/WHc9"
  },
  {
    name: "Banana",
    price: 40,
    quantity: "12kg",
    seller: "Karan Patel",
    email: "karan.patel@example.com",
    contact: "9023456789",
    city: "Ahmedabad",
    imageUrl: "https://imgs.search.brave.com/FO95h1mFKxj9zMbwfA_STLzWebJm10Jlel50HvNkY08/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9udXRy/aXRpb25zb3VyY2Uu/aHNwaC5oYXJ2YXJk/LmVkdS93cC1jb250/ZW50L3VwbG9hZHMv/MjAxOC8wOC9iYW5h/bmFzLTEzNTQ3ODVf/MTkyMC0xMDI0eDY4/My5qcGc"
  },
  {
    name: "Potato",
    price: 18,
    quantity: "10kg",
    seller: "Neha Reddy",
    email: "neha.reddy@example.com",
    contact: "9812345678",
    city: "Hyderabad",
    imageUrl: "https://imgs.search.brave.com/igsQWS2okEg3K4G5hUTEPaGLofD6XL-eXG6gCX9dcpA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMucGV4ZWxzLmNv/bS9waG90b3MvNzEy/OTE0NS9wZXhlbHMt/cGhvdG8tNzEyOTE0/NS5qcGVnP2F1dG89/Y29tcHJlc3MmY3M9/dGlueXNyZ2ImZHBy/PTEmdz01MDA"
  },
  {
    name: "Carrot",
    price: 30,
    quantity: "5kg",
    seller: "Sohan Lal",
    email: "sohan.lal@example.com",
    contact: "9700000000",
    city: "Jaipur",
    imageUrl: "https://imgs.search.brave.com/Ub0leS80ZQAtimu7TqpQhS91eFtKcQfM2ABp77k2zsw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9leHRl/bnNpb24udXN1LmVk/dS95YXJkYW5kZ2Fy/ZGVuL2ltYWdlcy9j/YXJyb3RzLWNyb3Bw/ZWQucG5n"
  },
  {
    name: "Rice",
    price: 45,
    quantity: "25kg",
    seller: "Manish Gupta",
    email: "manish.gupta@example.com",
    contact: "9654321000",
    city: "Patna",
    imageUrl: "https://imgs.search.brave.com/tgCaVPVqbqaqX5L1pgkZlzs2E4cIMSvKnvBc4lC_kks/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMjIw/NjcxNTQ1My9waG90/by9yaWNlLWJhY2tn/cm91bmQud2VicD9h/PTEmYj0xJnM9NjEy/eDYxMiZ3PTAmaz0y/MCZjPXROSUptSF9M/d01vU3NDV3FieTgy/S1NPb01lTDFtVmVt/TlVtTVVLNWxDRjA9"
  },
  {
    name: "Green Apple",
    price: 120,
    quantity: "5kg",
    seller: "Pooja Yadav",
    email: "pooja.yadav@example.com",
    contact: "9871234560",
    city: "Shimla",
    imageUrl: "https://imgs.search.brave.com/6iulDOvG6tlDXw9DrN4Ny5yupVBTfzgl9fcJXOkUmzo/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/c2h1dHRlcnN0b2Nr/LmNvbS9pbWFnZS1w/aG90by9ncmVlbi1h/cHBsZXMtd2F0ZXIt/ZHJvcGxldHMtMjYw/bnctMjI4ODc5NTEy/MS5qcGc"
  },
  {
    name: "Cauliflower",
    price: 35,
    quantity: "4kg",
    seller: "Rajeev Singh",
    email: "rajeev.singh@example.com",
    contact: "9100001111",
    city: "Varanasi",
    imageUrl: "https://imgs.search.brave.com/tt_8bbG3gRspW9PvG5OUcVMdeBU2zXDDZYdAr9J7y_k/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAxOS8x/MS8xMi8xOC8wMC9j/YXVsaWZsb3dlci00/NjIxNjg2XzY0MC5q/cGc"
  }


]

module.exports = cropsdata;




