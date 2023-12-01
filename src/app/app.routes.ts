import { Routes } from '@angular/router';
import { PaymentstatusComponent } from './paymentstatus/paymentstatus.component';
import { CartComponent } from './cart/cart.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
    {component: PaymentstatusComponent, path:"status"},
    {path:"cart", component: CartComponent},
    {path:"", component: AppComponent}
];
