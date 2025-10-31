import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

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

  constructor(
    private auth: Auth,
    private route: ActivatedRoute,
    private router: Router,
      private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    console.log('🔍 Extracted Product ID:', productId);

    this.fetchBuyerStatuses(productId);
  }

  fetchBuyerStatuses(productId: string | null) {
    if (!productId) {
      console.warn('No productId provided. Redirecting or handling gracefully.');
      this.isLoading = false;
      return;
    }

    this.isLoading = true;

    this.auth.getBuyerStatusByProduct(productId).subscribe({
      next: (res: any) => {
        console.log('API Response:', res);

        // Because your Node route returns an array directly, no "data" key needed
        const rawData = Array.isArray(res) ? res : [res];
        this.buyerStatuses = rawData;

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
        console.log('Final grouped products:', this.products);

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching buyer statuses:', err);
        this.isLoading = false;
      }
    });
  }
  
 markStatus(buyerId: string, statusToBeSet: string) {
  this.isLoading = true;
  this.auth.markContactedByld(buyerId, statusToBeSet).subscribe({
    next: (response) => {
      console.log('Status updated successfully:', response);
      this.products = this.products.map(product => ({
        ...product,
        buyerStatuses: product.buyerStatuses.map((buyer: any) =>
          buyer._id === buyerId ? { ...buyer, status: statusToBeSet } : buyer
        )
      }));
      this.isLoading = false;
      this.cdr.detectChanges(); 
    },
    error: (err) => {
      console.error('Error marking contacted:', err);
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