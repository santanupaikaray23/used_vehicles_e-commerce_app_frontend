import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buyerstatus',
  standalone: false,
  templateUrl: './buyerstatus.html',
  styleUrl: './buyerstatus.css'
})
export class Buyerstatus {
 products: any[] = [];
  buyerStatuses: any[] = [];
  isLoading = true;

  displayedColumns: string[] = ['buyerStatuses'];

  constructor(private auth: Auth, private router: Router) {}

  ngOnInit() {
    this.fetchBuyerStatuses();
  }

  fetchBuyerStatuses() {
    this.isLoading = true;
    this.auth.getBuyerStatusByProduct('').subscribe({
      next: (res: any) => {
        console.log('✅ API Response:', res);

        const rawData = res?.data || res || [];
        this.buyerStatuses = Array.isArray(rawData) ? rawData : [rawData];

        const uniqueListings = new Map();
        this.buyerStatuses.forEach((item: any) => {
          if (!uniqueListings.has(item.listing_id)) {
            uniqueListings.set(item.listing_id, {
              _id: item.listing_id,
              vehicle_name: item.vehicle_name,
              vehicle_price: item.vehicle_price,
              buyerStatuses: []
            });
          }
          uniqueListings.get(item.listing_id).buyerStatuses.push(item);
        });

        this.products = Array.from(uniqueListings.values());
        console.log('✅ Final grouped products:', this.products);

        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Error fetching buyer statuses:', err);
        this.isLoading = false;
      }
    });
  }

  markStatus(buyerId: string, statusToBeSet: string) {
    this.isLoading = true;
    this.auth.markContactedByld(buyerId, statusToBeSet).subscribe({
      next: () => {
        this.products.forEach(product => {
          product.buyerStatuses.forEach((buyer: any) => {
            if (buyer._id === buyerId) {
              buyer.status = statusToBeSet;
            }
          });
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Error marking contacted:', err);
        this.isLoading = false;
      }
    });
  }

  contactBuyer(buyer: any): void {
    this.markStatus(buyer._id, 'contacted');
    if (buyer.contact_phone) {
      setTimeout(() => {
        window.open(`tel:${buyer.contact_phone}`, '_self');
      }, 300);
    } else {
      alert('No phone number available for this buyer.');
    }
  }
}
