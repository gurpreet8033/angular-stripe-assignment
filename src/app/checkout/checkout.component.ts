import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit, ViewChild } from '@angular/core';
import { StripeCardNumberComponent, StripeService } from 'ngx-stripe';
import { NgxStripeModule } from 'ngx-stripe';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { switchMap } from 'rxjs/operators';


import {
  PaymentIntent,
  StripeCardElementOptions,
  StripeElementsOptions,
} from '@stripe/stripe-js';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, NgxStripeModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  // @ViewChild(StripeCardNumberComponent) card: StripeCardNumberComponent;
@ViewChild(StripeCardNumberComponent) card: StripeCardNumberComponent | undefined;

  public cardOptions: StripeCardElementOptions = {
      style: {
        base: {
          fontWeight: 400,
          fontFamily: 'Circular',
          fontSize: '14px',
          iconColor: '#666EE8',
          color: '#002333',
          '::placeholder': {
            color: '#919191',
          },
        },
      },
    };
  
  public elementsOptions: StripeElementsOptions = {
      locale: 'en',
    };
  
    constructor(
      private http: HttpClient,
      private fb: FormBuilder,
      private stripeService: StripeService
    ) {}
  
    ngOnInit() {}

    paymentForm: FormGroup = this.fb.group({
      name: ['John', [Validators.required]],
      email: ['john@gmail.com', [Validators.required]],
      amount: [100, [Validators.required, Validators.pattern(/d+/)]],
  });

  pay(): void {
    if (this.paymentForm.valid) {
      this.createPaymentIntent(this.paymentForm.get('amount')?.value)
        .pipe(
          switchMap((pi:any) =>
            this.stripeService.confirmCardPayment("pk_test_51OHn3WSCEiSENNiO0ItJCUfEeiBJO9BuhrcdltirJ3XvesIFAgwHLjNjqcyxJlMpGYFM6R5bm5WANSCeatk3y97900R3i5KQOF", {
              payment_method: {
                card: this.card!.element,
                billing_details: {
                  name: this.paymentForm.get('name')!.value,
                },
              },
            })
          )
        )
        .subscribe((result:any) => {
          if (result.error) {
            // Show error to your customer (e.g., insufficient funds)
            console.log(result.error.message);
          } else {
            // The payment has been processed!
            if (result.paymentIntent.status === 'succeeded') {
              // Show a success message to your customer
            }
          }
        });
    } else {
      console.log(this.paymentForm);
    }
  }

createPaymentIntent(amount: number): Observable<PaymentIntent> {
    return this.http.post<PaymentIntent>(
      `http://localhost:4200/create-payment-intent`,
      { amount }
    );
 }
  
  
}
