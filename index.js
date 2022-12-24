require("dotenv").config();

const cors = require("cors");
const express = require("express");

// TODO: add a stripe key
const stripe = require("stripe")(`${process.env.STRIPE_API_SECRET_KEY}`);
const { v4: uuidv4 } = require("uuid");

const app = express();

//middleware
app.use(express.json());
app.use(cors());

//routes
app.get("/", (req, res) => res.send("HEYAA"));

app.post("/payment", (req, res) => {
  const { product, token } = req.body;
  console.log(`PRODUCT: ${product}`);
  console.log(`PRICE: ${product.price}`);

  // ensures user does not get charged twice for the same product
  const idempotencyKey = uuidv4();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges.create(
        {
          amount: product.price * 100, // prices in Stripe are in cents
          currency: "GBP",
          customer: customer.id,
          receipt_email: customer.email,
          description: ` purchase of ${product.name}`,
        },
        { idempotencyKey }
      );
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => console.log(err));
});

//listen
app.listen(8282, () => console.log(`LISTENING AT PORT 8282`));
