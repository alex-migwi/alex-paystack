const express = require('express');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';

// Capture raw body for authentic HMAC SHA-512 signature verification
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

// Root endpoint - Healthcheck & Usage instructions
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Paystack Webhook Test Receiver is active',
    webhookEndpoint: `http://localhost:${PORT}/webhook`,
    usage: {
      cliTriggerExample: `paystack webhook trigger charge.success --forward-to http://localhost:${PORT}/webhook`,
      cliListenExample: `paystack webhook listen --port 7777 --forward-to http://localhost:${PORT}/webhook`
    }
  });
});

// Main Webhook Receiver Endpoint
app.post('/webhook', (req, res) => {
  const timestamp = new Date().toISOString();
  const signature = req.headers['x-paystack-signature'];
  const event = req.body;

  console.log('\n==================================================');
  console.log(`Webhook Event Received at [${timestamp}]`);
  console.log('==================================================');

  // Verify HMAC SHA-512 Signature if PAYSTACK_SECRET_KEY is configured
  if (PAYSTACK_SECRET_KEY && req.rawBody) {
    const calculatedSignature = crypto
      .createHmac('sha512', PAYSTACK_SECRET_KEY)
      .update(req.rawBody)
      .digest('hex');

    const isValid = calculatedSignature === signature;
    console.log(`HMAC SHA-512 Signature Check: ${isValid ? 'VALID MATCH' : 'INVALID SIGNATURE'}`);
  } else if (signature) {
    console.log(`Received Signature: ${signature.substring(0, 20)}...`);
    console.log(`(Set PAYSTACK_SECRET_KEY env variable to verify HMAC calculation)`);
  }

  console.log(`Event Type: ${event.event || 'Unknown Event'}`);

  if (event.data) {
    if (event.data.reference) console.log(`Reference: ${event.data.reference}`);
    if (event.data.amount) console.log(`Amount: ${event.data.amount / 100} ${event.data.currency || 'NGN'}`);
    if (event.data.customer?.email) console.log(`Customer Email: ${event.data.customer.email}`);
    if (event.data.status) console.log(`Event Status: ${event.data.status}`);
  }

  console.log('--------------------------------------------------');
  console.log('Raw Event Body Payload:');
  console.log(JSON.stringify(event, null, 2));
  console.log('==================================================\n');

  // Acknowledge receipt with HTTP 200 OK
  return res.status(200).json({ status: true, message: 'Webhook received successfully' });
});

app.listen(PORT, () => {
  console.log(`\nPaystack Webhook Receiver running on http://localhost:${PORT}`);
  console.log(`Webhook URL: http://localhost:${PORT}/webhook`);
  console.log(`Ready to receive CLI triggers: paystack webhook trigger charge.success --forward-to http://localhost:${PORT}/webhook\n`);
});
