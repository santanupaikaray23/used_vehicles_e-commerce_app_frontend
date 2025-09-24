import { Component, OnInit } from '@angular/core';
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
  buyerId!: string | null; // 👈 added buyerId field

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

    // get booking id
    this.bookingId = this.route.snapshot.paramMap.get('id');
    console.log('bookingId:', this.bookingId);

    // get buyerId from localStorage (or Auth service)
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
    if (this.bookingForm.valid) {
      const now = new Date().toISOString(); // ISO timestamp

      const bookingData = {
      ...this.bookingForm.value,
  vehicle_id: Number(this.bookingId),   
  buyer_id: Number(this.buyerId),       
  createdAt: now,
  updatedAt: now,
  status: 'new'
      };

      console.log('Payload sending to backend:', bookingData);

      this.auth.addExpressions(bookingData).subscribe({
        next: (res) => {
          console.log('Expression saved successfully:', res);
          this.location.back();
        },
        error: (err) => {
          console.error('Error saving expression:', err);
        }
      });
    } else {
      this.bookingForm.markAllAsTouched();
    }
  }
}
