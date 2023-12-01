import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-paymentstatus',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paymentstatus.component.html',
  styleUrl: './paymentstatus.component.css'
})
export class PaymentstatusComponent {
  status: string
  id:string
  constructor(private route: ActivatedRoute){

    console.log(this.route.snapshot);
    
    this.status=this.route.snapshot.queryParams["status"];
    this.id=this.route.snapshot.queryParams["source_redirect_slug"];
  }
}
