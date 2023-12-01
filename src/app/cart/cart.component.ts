import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StripeService } from '../stripe.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  providers: [StripeService],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  cart = [
    {
      id: '1',
      title: 'For sure',
      sub: 'Creamy matte lipstick',
      quantity: 3,
      quantityType: '1pc',
      price: 2100,
      img: 'https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/25310394/2023/11/2/253abf37-4328-4b6b-bed5-efc68ecf80241698925226902ForSureCremyMatteLongLastingLipstick-35g-Nude621.jpg',
    },
    {
      id: '2',
      title: 'Faces Canada',
      sub: 'Weightless stay matte compact',
      quantity: 1,
      price: 200,
      quantityType: '1pc',
      img: 'https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/10924310/2023/2/13/3adc67e8-414d-4525-9563-a1fd771af0d01676282588910-FACES-CANADA-Weightless-Stay-Matte-Compact-SPF20-with-Vitami-1.jpg',
    },
    {
      id: '3',
      title: 'Lakme',
      sub: 'Face it compact',
      quantity: 2,
      price: 500,
      quantityType: '1pc',
      img: 'https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/15678708/2021/10/12/b9989b8f-33dd-43fb-bb4d-8fa0e0bbeae81633989584395DoveLightHydrationBodyLotion400mlFalseEyelashesMissClaireWom1.jpg',
    },
  ];

  constructor(private checkoutService: StripeService, private router: Router) {
    this.calculateTotal();
  }

  total = 0;
  calculateTotal = () => {
    this.total = 0;
    this.cart.forEach((item) => {
      this.total += item.price * item.quantity;
    });
    // return total;
  };
  handler: any = null;
  ngOnInit() {
    this.loadStripe();
  }

  pay(amount: any) {
    var handler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51OHn3WSCEiSENNiO0ItJCUfEeiBJO9BuhrcdltirJ3XvesIFAgwHLjNjqcyxJlMpGYFM6R5bm5WANSCeatk3y97900R3i5KQOF',
      locale: 'INR',
      token: function (token: any) {
        // You can access the token ID with `token.id`.
        // Get the token ID to your server-side code for use.
        console.log(token);
        // alert('Token Created!!');
        paymentStripe(token);
      },
    });
    const paymentStripe = (stripeToken: any) => {
      this.checkoutService
        .makePayment(stripeToken, this.cart)
        .subscribe((res: any) => {
          let url = res.charge.next_action.redirect_to_url.url;
          window.location.href = url;
          // setTimeout(()=>{
          //   this.router.navigateByUrl("status")
          // }, 2000);
        });
    };

    handler.open({
      name: 'Gurpreet Kaur Store',
      currency: 'INR',
      description: 'Testing Stripe Payments Service',
      amount: amount * 100,
    });
  }

  loadStripe() {
    if (!window.document.getElementById('stripe-script')) {
      var s = window.document.createElement('script');
      s.id = 'stripe-script';
      s.type = 'text/javascript';
      s.src = 'https://checkout.stripe.com/checkout.js';
      s.onload = () => {
        this.handler = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51OHn3WSCEiSENNiO0ItJCUfEeiBJO9BuhrcdltirJ3XvesIFAgwHLjNjqcyxJlMpGYFM6R5bm5WANSCeatk3y97900R3i5KQOF',
          locale: 'INR',
          token: function (token: any) {
            // You can access the token ID with `token.id`.
            // Get the token ID to your server-side code for use.
            console.log(token);
            alert('Payment Success!!');
          },
        });
      };

      window.document.body.appendChild(s);
    }
  }

  handleQuantityChange = (type: any, id: any) => {
    switch (type) {
      case '+':
        this.cart = this.cart.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              quantity: item.quantity + 1,
            };
          }
          return item;
        });

        break;
      case '-':
        this.cart = this.cart.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              quantity: item.quantity - 1,
            };
          }
          return item;
        });
        break;
      default:
        break;
    }
    this.calculateTotal();

    // let c = cart.filter((item) => item.quantity !== 0);
    // setCart((prev)=>[...c]);
  };
}
