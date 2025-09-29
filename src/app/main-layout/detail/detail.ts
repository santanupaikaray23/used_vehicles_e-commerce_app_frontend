import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Auth } from '../../services/auth';
import { Product } from '../../models/product.dto';
import { Location } from '@angular/common';

@Component({
  selector: 'app-detail',
  standalone: false,
  templateUrl: './detail.html',
  styleUrl: './detail.css'
})
export class Detail {
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
