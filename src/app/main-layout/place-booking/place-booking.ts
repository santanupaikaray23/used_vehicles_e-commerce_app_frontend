import { Component} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Product } from '../../models/product.dto';
import { Router } from '@angular/router';



@Component({
  selector: 'app-place-booking',
  standalone: false,
  templateUrl: './place-booking.html',
  styleUrl: './place-booking.css'
})
export class PlaceBooking {
   vehicle!: Product;
  bookingId!: string | null;
  bookingForm!: FormGroup;
  buyerId!: string | null;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private auth: Auth,
    private fb: FormBuilder,
    private router: Router  
  ) {}

  ngOnInit(): void {
  this.bookingForm = this.fb.group({
    vehicle_name: ['', Validators.required],
    vehicle_price: ['', Validators.required],
    message: ['', Validators.required],
    contact_phone: [
      '',
      [Validators.required, Validators.pattern(/^[0-9]{10}$/)]
    ],
    preferred_contact_time: ['']
  });

  this.bookingId = this.route.snapshot.paramMap.get('id');
  this.buyerId = localStorage.getItem('buyerId');

  if (this.bookingId) {
    this.auth.getvehicleById(this.bookingId).subscribe((data) => {
      this.vehicle = data;

      // patch values when vehicle loads
      this.bookingForm.patchValue({
        vehicle_name: this.vehicle?.title || '',
        vehicle_price: this.vehicle?.price || ''
      });
    });
  }
}

  onSubmit(): void {
    if (this.bookingForm.valid && this.vehicle ) {
      const bookingData = {
        ...this.bookingForm.value,
        listing_id: this.vehicle._id,            
        vehicle_name: this.vehicle?.title || null,
        vehicle_price: this.vehicle?.price ? Number(this.vehicle.price) : null,
        status: 'new'
      };


      this.auth.addExpressions(bookingData).subscribe({
        next: (res) => {
          console.log('Expression created successfully:', res);
          this.router.navigate(['/buyerdashboard/receipt', res._id]);
        },
        error: (err) => {
          console.error('Error creating expression:', err);
        }
      });
    } else {
      this.bookingForm.markAllAsTouched();
    }
  }
}
