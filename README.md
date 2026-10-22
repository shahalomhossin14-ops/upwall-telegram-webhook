# Upwall → Telegram Lead Webhook

This small Node.js service receives Upwall postbacks and sends a Telegram message. It does not require your own website, but it must be deployed to a public HTTPS host.

## 1) Security first
The Telegram bot token shown in your earlier chat has been exposed. Revoke it with [@BotFather](https://t.me/BotFather) and use the new token only in your host's environment variables. Do not put the token in an Upwall URL.

## 2) Deploy
Deploy this folder as a Node.js web service on a hosting provider that supports Node.js and HTTPS (for example, Render or Railway).
- Build/install command: `npm install`
- Start command: `npm start`
- Add environment variables:
  - `TELEGRAM_BOT_TOKEN` = your new BotFather token
  - `TELEGRAM_CHAT_ID` = your Telegram chat ID
  - `POSTBACK_PASSWORD` = a long random secret
- Do not share these secrets publicly.

After deployment, your base URL will look like `https://YOUR-SERVICE.example.com`.
Your webhook endpoint will be:
`https://YOUR-SERVICE.example.com/upwall-postback`

## 3) Configure Upwall
In Upwall's postback/callback settings, use the endpoint above and configure its macro/query parameters according to Upwall's actual syntax. The receiver supports these parameter names:
`app_name`, `userid`, `password`, `user_amount`, `offer_name`, `offer_id`, `payout`, `ip_address`, `currency_name`, `date`, `transactionID`.

Make sure Upwall sends its password macro as `password` and that its value matches `POSTBACK_PASSWORD`. If Upwall's documentation uses a different parameter syntax or HTTP method, adapt the URL/configuration accordingly. Do not assume this is configured until you test it.

## 4) Test
Open the deployed base URL; it should say the webhook is running.
Then send a test request from your own terminal or a request tool with the correct password and sample fields. A successful response is `OK` and a Telegram message should arrive.
