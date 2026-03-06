// pages/api/create-payment-intent.js
// Stripe payment intent creation endpoint.
// Requires: STRIPE_SECRET_KEY in .env.local

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Dynamically import stripe only when needed (avoids build issues if key is missing)
  let stripe
  try {
    const Stripe = (await import('stripe')).default
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })
  } catch {
    return res.status(500).json({ error: 'Stripe is not configured. Add STRIPE_SECRET_KEY to .env.local' })
  }

  try {
    const { amount, currency = 'eur', metadata = {} } = req.body

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: 'Invalid amount' })
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe uses cents
      currency,
      metadata,
      automatic_payment_methods: { enabled: true },
    })

    return res.status(200).json({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    console.error('Stripe error:', err)
    return res.status(500).json({ error: err.message })
  }
}
