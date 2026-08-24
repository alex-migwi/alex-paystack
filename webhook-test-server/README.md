# Paystack Webhook Receiver Test Server

A minimal Node.js Express server designed to test and verify **Paystack CLI webhook triggers** (`paystack webhook trigger`) and **live event streaming** (`paystack webhook listen`).

---

## Quickstart

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Receiver Server
```bash
npm start
```
*Server will start listening on `http://localhost:3000/webhook`.*

---

## ⚡ Testing Webhook Triggers with Paystack CLI

### Test Event Simulation (`paystack webhook trigger`)
Open a second terminal window and run:

```bash
paystack webhook trigger charge.success \
  --forward-to http://localhost:3000/webhook
```

### Test Live Sandbox Event Streaming (`paystack webhook listen`)
```bash
paystack webhook listen --port 7777 --forward-to http://localhost:3000/webhook
```

---

## HMAC SHA-512 Signature Verification

To verify authentic `x-paystack-signature` headers computed by the CLI, pass your secret key when starting the server:

```bash
PAYSTACK_SECRET_KEY=sk_test_xxxxxx npm start
```
