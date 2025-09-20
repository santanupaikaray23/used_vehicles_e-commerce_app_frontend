import { Component, ElementRef, QueryList, ViewChildren} from '@angular/core';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-admindashboard',
  standalone: false,
  templateUrl: './admindashboard.html',
  styleUrl: './admindashboard.css'
})
export class Admindashboard{
  vehicles: any[] = [];
  products: any[] = [];
  errorMessage: string = '';
  displayedColumns: string[] = ['_id', 'title', 'make', 'images', 'status', 'action'];

  @ViewChildren('fileInput') fileInputs!: QueryList<ElementRef<HTMLInputElement>>;

  constructor(private auth: Auth, private router: Router) {}

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.auth.getProducts().subscribe({
      next: (data: any) => {
        console.log('API response:', data);
        const allProducts = Array.isArray(data.data) ? data.data : [];
        this.products = allProducts;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }

approveVehicle(id: string, reason?: string) {
  const payload = reason ? { reason } : {}; // only include if provided
  this.auth.activateVehicle(id, payload).subscribe({
    next: (res) => {
      console.log('Vehicle approved:', res);
      this.getProducts();
    },
    error: (err) => {
      console.error('Error approving vehicle:', err);
      this.errorMessage = 'Failed to approve vehicle. Please try again.';
    }
  });
}

deactivateVehicle(id: string, reason?: string) {
  const payload = reason ? { reason } : {};
  this.auth.deactivateVehicle(id, payload).subscribe({
    next: (res) => {
      console.log('Vehicle deactivated:', res);
      this.getProducts();
    },
    error: (err) => {
      console.error('Error deactivating vehicle:', err);
      this.errorMessage = 'Failed to deactivate vehicle. Please try again.';
    }
  });
}


  // deleteVehicles(id: number) {
  //   const payload = { created_at: new Date().toISOString() };
  //   this.auth.deleteVehicle(id, payload).subscribe({
  //     next: (data) => {
  //       console.log('Deleted:', data);
  //       this.getProducts();s
  //     },
  //     error: (err) => {
  //       console.error('Error deleting vehicle:', err);
  //     }
  //   });
  // }

}