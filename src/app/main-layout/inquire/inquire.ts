import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { Auth } from '../../services/auth';
import { Product } from '../../models/product.dto';

@Component({
  selector: 'app-inquire',
  standalone: true, // <-- Set to true
  imports: [CommonModule], // <-- Add CommonModule
  templateUrl: './inquire.html',
  styleUrl: './inquire.css'
})
export class Inquire implements OnInit {
  vehicle!: Product;
  enquiryid!: string | null;
    currentIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private auth: Auth
  ) {}
  
    setMainImage(index: number) {
    this.currentIndex = index;
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

  ngOnInit(): void {
    const enquiryid = this.route.snapshot.paramMap.get('id');
    console.log("enquiryid:", enquiryid);
    if (enquiryid) {
      this.auth.getvehicleById(enquiryid).subscribe((data) => {
        console.log("Vehicle data:", data);
        this.vehicle = data;
      });
    }
  }
}
