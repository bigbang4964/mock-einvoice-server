const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const dayjs = require("dayjs");

const app = express();
app.use(cors());
app.use(express.json());

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.json({
    service: "Mock E-Invoice Server",
    status: "running",
    time: new Date().toISOString(),
  });
});

/* ================= TEST LOGIN ================= */
app.post("/api/auth/token", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  res.json({
    accessToken: "TEST_TOKEN_" + Date.now(),
    expiredAt: new Date(Date.now() + 3600 * 1000),
  });
});

app.post("/api/einvoice/issue", (req, res) => {
  const body = req.body;

  res.json({
    InvoiceNo: Math.floor(Math.random() * 900000 + 100000).toString(),
    TaxAuthorityCode: "TEST-TCT",
    LookupCode: "TEST-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    QRCode: "https://dummyimage.com/300x300/000/fff&text=TEST+QR",
    RawData: body,
  });
});

/* ================= CREATE INVOICE ================= */
app.post("/api/einvoice/create", (req, res) => {
  const { orderId, restaurantId, items, totalAmount } = req.body;

  if (!orderId || !items || !totalAmount) {
    return res.status(400).json({
      success: false,
      message: "Thiếu dữ liệu hóa đơn",
    });
  }

  const invoiceNo = Math.floor(Math.random() * 900000 + 100000);

  res.json({
    success: true,
    provider: "TEST",
    invoiceNo: invoiceNo.toString(),
    series: "TEST/26E",
    lookupCode: uuidv4().slice(0, 8).toUpperCase(),
    issuedAt: dayjs().toISOString(),
    totalAmount,
    orderId,
    pdfUrl: `https://dummyimage.com/600x800/ffffff/000000&text=Invoice+${invoiceNo}`,
  });
});

/* ================= START ================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Mock E-Invoice running on port", PORT);
});
