import express from "express";

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const POSTBACK_PASSWORD = process.env.POSTBACK_PASSWORD;

app.get("/", (_req, res) => {
  res.type("text").send("Upwall → Telegram webhook is running.");
});

app.all("/upwall-postback", async (req, res) => {
  try {
    const data = { ...req.query, ...(req.body || {}) };

    // Configure the same password in Upwall and the POSTBACK_PASSWORD env var.
    if (POSTBACK_PASSWORD && data.password !== POSTBACK_PASSWORD) {
      return res.status(403).send("Invalid postback password");
    }

    if (!BOT_TOKEN || !CHAT_ID) {
      return res.status(500).send("Server is missing Telegram configuration");
    }

    const get = (...keys) => {
      for (const key of keys) {
        if (data[key] !== undefined && data[key] !== "") return String(data[key]);
      }
      return "N/A";
    };

    const message = [
      "🔔 New Upwall Lead",
      `App: ${get("app_name")}`,
      `User ID: ${get("userid", "user_id")}`,
      `Offer: ${get("offer_name")}`,
      `Offer ID: ${get("offer_id")}`,
      `User Amount: ${get("user_amount")}`,
      `Payout: $${get("payout")}`,
      `Transaction ID: ${get("transactionID", "transaction_id")}`,
      `Date: ${get("date")}`,
      `IP: ${get("ip_address")}`,
      `Currency: ${get("currency_name")}`
    ].join("\n");

    const tg = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text: message })
    });

    const result = await tg.json();
    if (!tg.ok || !result.ok) {
      console.error("Telegram API error:", result);
      return res.status(502).send("Telegram delivery failed");
    }

    return res.status(200).send("OK");
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).send("Webhook error");
  }
});

app.listen(PORT, () => console.log(`Webhook listening on port ${PORT}`));
