import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  constructor(private http: HttpClient) {
    console.log('constructing StripeService');
  }
  makePayment(stripeToken: any, cart:any): Observable<any> {
    const url = 'http://localhost:5000/checkout';

    return this.http.post<any>(url, { token: stripeToken , cart: cart});
  }
}
