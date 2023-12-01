const express = require("express");

const stripe = require("stripe")(
  "sk_test_51OHn3WSCEiSENNiOtAu2ZJFV4PLMVTLBZnxVLmw8aKyeK5KnUzNBuPoZ1mIXLaJv6HiPUFop6KuDn5mpoU0HtF5U00k7PaF5rA"
);

const app = express();

const bodyParser = require("body-parser");

const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

const calculateTotal = (val) => {
  let total = 0;
  for (let i = 0; i < val.length; i++) {
    total = total + val[i].price * val[i].quantity;
  }
  // console.log("gk",total);
  return total;
};
app.post("/checkout", async (req, res) => {
  //   console.log(req.body);
  try {
    token = req.body.token;
    totalAmount = calculateTotal(req.body.cart);
    const customer = stripe.customers
      .create({
        email: token.email,
        source: token.id,
      })
      .then((customer) => {
        return stripe.paymentIntents.create({
          amount: totalAmount * 100,
          payment_method: customer.default_source,
          receipt_email: customer.email,
          description: "Testing payment",
          currency: "INR",
          customer: customer.id,
        });
      })
      .then((charge) => {
        return stripe.paymentIntents.confirm(
          charge.id,
          {
            payment_method: charge.payment_method,
            return_url: "http://localhost:4200/status?status=success",
          }
        );
      })
      .then((charge) => {
        // console.log(charge);
        res.json({
          status: "success",
          charge: charge,
        });
      })
      .catch((err) => {
        console.log(err);
        res.json({
          status: "failure",
          charge: {
            next_action:{
                redirect_to_url:{
                    url: "http://localhost:4200/status?status=failed"
                }
            }
          },
          error: err,
        });
      });
  } catch (err) {
    console.log(err);
  }
});

// const stripe = require('stripe')('sk_test_51OHn3WSCEiSENNiOtAu2ZJFV4PLMVTLBZnxVLmw8aKyeK5KnUzNBuPoZ1mIXLaJv6HiPUFop6KuDn5mpoU0HtF5U00k7PaF5rA')

// app.post('/checkout', async (req, res) => {
//     console.log("here");
//   const session = await stripe.checkout.sessions.create({
//     line_items: [
//       {
//         price_data: {
//           currency: 'usd',
//           product_data: {
//             name: 'T-shirt',
//           },
//           unit_amount: 2000,
//         },
//         quantity: 1,
//       },
//     ],
//     mode: 'payment',
//     success_url: 'http://localhost:5000/success',
//     cancel_url: 'http://localhost:5000/cancel',
//   });

//   res.redirect(303, session.url);
// });

app.listen(5000, () => {
  console.log("HEllo");
});
