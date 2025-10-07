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

  constructor(
    private location: Location,
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
  goBack() {
  this.location.back();
}
}
