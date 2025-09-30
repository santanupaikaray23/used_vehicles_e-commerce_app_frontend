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
  users: any[] = [];
  errorMessage: string = '';
  displayedColumns: string[] = ['title', 'make', 'images', 'action', 'reason','buyerStatus',
  'buyerReason','buyerContact_phone', 'buyerPreferred_contact_time'];
   error: string | null = null;
   
  @ViewChildren('fileInput') fileInputs!: QueryList<ElementRef<HTMLInputElement>>;
  constructor(private auth: Auth, private router: Router) {}
  ngOnInit() {
    this.getProducts();
    this.getUsers();
  }
 
  getProducts() {
  this.auth.getProducts().subscribe({
    next: (data: any) => {
      console.log('API response:', data);

      const allProducts = Array.isArray(data.data) ? data.data : [];
      this.products = allProducts;

      // Call getBuyerStatusById for each product
      this.products.forEach((product: any) => {
        if (product._id) {
          this.getBuyerStatusById(product._id);
        }
      });
    },
    error: (err) => {
      console.error('Error fetching products:', err);
    }
  });
}

  getUsers() {
  this.auth.getUsers().subscribe({
    next: (res: any) => {
      console.log('API response (users):', res);
      const allUsers = Array.isArray(res.data) ? res.data : [];
      this.users = allUsers;
    },
    error: (err) => {
      console.error('Error fetching users:', err);
    }
  });
}

approveVehicle(id: string, reason?: string) {
  const payload = reason ? { reason } : {}; 
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

soldVehicle(id: string) {
  this.auth.markVehicleSoldByld(id).subscribe({
    next: () => {
      const product = this.products.find(p => p._id === id);
      if (product) {
        product.isActive = true; 
      }
      this.getProducts();

    },
    error: (err) => console.error('Error marking as sold:', err)
  });
}

blockUser(userId: string) {
  this.auth.blockUser(userId).subscribe(() => {
    const user = this.users.find(u => u._id === userId);
    if (user) user.is_blocked = 'true';
  });
}
unblockUser(userId: string) {
  this.auth.unblockUser(userId).subscribe(() => {
    const user = this.users.find(u => u._id === userId);
    if (user) user.is_blocked = 'false';
  });
}

getBuyerStatusById(id: string) {
  this.auth.getbuyerStatusById(id).subscribe({
    next: (res: any) => {
      console.log('Single Buyer Status Response:', res);

      const productIndex = this.products.findIndex(p => p._id === id);

      if (productIndex !== -1 && res) {
        const responseData = Array.isArray(res) ? res[0] : {};
        this.products[productIndex].buyerStatus = responseData.status || this.products[productIndex].status;
        this.products[productIndex].message = responseData.message || 'N/A';
        this.products[productIndex].buyerContact_phone = responseData.contact_phone || 'N/A';
        this.products[productIndex].buyerPreferred_contact_time  = responseData.preferred_contact_time || 'N/A';
      }
    },
    error: (err) => {
      console.error('Error fetching buyer status by id:', err);
    }
  });
}
}