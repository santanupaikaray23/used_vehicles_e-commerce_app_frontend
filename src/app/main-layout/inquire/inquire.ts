import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,  RouterModule  } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { Auth } from '../../services/auth';
import { Product } from '../../models/product.dto';
import { Location } from '@angular/common';

@Component({
  selector: 'app-inquire',
  standalone: true, 
  imports: [CommonModule, RouterModule], 
  templateUrl: './inquire.html',
  styleUrl: './inquire.css'
})
export class Inquire implements OnInit {
  vehicle!: Product;
  enquiryid!: string | null;
  currentIndex = 0;
  isLoading = true; 

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private auth: Auth
  ) {}

  ngOnInit(): void {
    const enquiryid = this.route.snapshot.paramMap.get('id');
    console.log("enquiryid:", enquiryid);

    if (enquiryid) {
      this.auth.getvehicleById(enquiryid).subscribe({
        next: (data) => {
          console.log("Vehicle data:", data);
          this.vehicle = data;
          this.isLoading = false; // Stop spinner once data arrives
        },
        error: (err) => {
          console.error('Error fetching vehicle:', err);
          this.isLoading = false; // Also stop spinner on error
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  goBack() {
    this.location.back();
  }

  nextImage() {
    if (!this.vehicle?.images?.length) return;
    this.currentIndex = (this.currentIndex + 1) % this.vehicle.images.length;
  }

  prevImage() {
    if (!this.vehicle?.images?.length) return;
    this.currentIndex =
      (this.currentIndex - 1 + this.vehicle.images.length) % this.vehicle.images.length;
  }
}
