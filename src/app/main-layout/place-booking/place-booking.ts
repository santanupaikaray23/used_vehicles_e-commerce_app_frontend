import { Component} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Product } from '../../models/product.dto';




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
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // initialize the form
    this.bookingForm = this.fb.group({
      message: ['', Validators.required],
      contact_phone: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{10}$/)]
      ],
      preferred_contact_time: ['']
    });

    this.bookingId = this.route.snapshot.paramMap.get('id');
    console.log('bookingId:', this.bookingId);

    // buyerId should be a MongoDB ObjectId string, not number
    this.buyerId = localStorage.getItem('buyerId');
    console.log('buyerId:', this.buyerId);

    if (this.bookingId) {
      this.auth.getvehicleById(this.bookingId).subscribe((data) => {
        console.log('Vehicle data:', data);
        this.vehicle = data;
      });
    }
  }

  onSubmit(): void {
    if (this.bookingForm.valid && this.vehicle ) {
      const bookingData = {
        ...this.bookingForm.value,
        listing_id: this.vehicle._id,             // ✅ backend expects listing_id:number
        vehicle_name: this.vehicle?.title || null,
        vehicle_price: this.vehicle?.price ? Number(this.vehicle.price) : null,
        status: 'new'
      };


      this.auth.addExpressions(bookingData).subscribe({
        next: (res) => {
          console.log('Expression created successfully:', res);
          this.location.back();
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
