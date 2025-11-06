import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Product } from '../../models/product.dto';
import { Router } from '@angular/router';


@Component({
  selector: 'app-place-bookingtwo',
  standalone: false,
  templateUrl: './place-bookingtwo.html',
  styleUrl: './place-bookingtwo.css'
})
export class PlaceBookingtwo {
   vehicle!: Product;
  bookingId!: string | null;
  bookingForm!: FormGroup;
  buyerId!: string | null;
  isLoading = true; // ✅ Spinner control flag

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
      // vehicle_price: ['', Validators.required],
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
      this.auth.getvehicleById(this.bookingId).subscribe({
        next: (data) => {
          this.vehicle = data;
          this.bookingForm.patchValue({
            vehicle_name: this.vehicle?.title || '',
            vehicle_price: this.vehicle?.price || ''
          });
          this.isLoading = false; // ✅ Stop spinner after vehicle loads
        },
        error: (err) => {
          console.error('Error loading vehicle:', err);
          this.isLoading = false; // ✅ Stop spinner even if error
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  onSubmit(): void {
    if (this.bookingForm.valid && this.vehicle) {
      this.isLoading = true; // ✅ Show spinner during form submission
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
          this.isLoading = false; // ✅ Stop spinner after success
          this.router.navigate(['/admindashboard/receipt-two', res._id]);
        },
        error: (err) => {
          console.error('Error creating expression:', err);
          this.isLoading = false; // ✅ Stop spinner on error too
        }
      });
    } else {
      this.bookingForm.markAllAsTouched();
    }
  }

  goBack() {
    this.location.back();
  }
}
