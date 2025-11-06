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
   isLoading: boolean = false;
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
  this.isLoading = true; // ✅ Start loading
    this.auth.getProducts().subscribe({
      next: (data: any) => {
        const allProducts = Array.isArray(data.data) ? data.data : [];
        this.products = allProducts;
        this.products.forEach((product: any) => {
          if (product._id) this.getBuyerStatusById(product._id);
        });
        this.isLoading = false; // ✅ Stop loading
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.isLoading = false; // ✅ Stop loading on error
      },
    });
}

getUsers() {
 this.isLoading = true; // ✅ Start loading
    this.auth.getUsers().subscribe({
      next: (res: any) => {
        const allUsers = Array.isArray(res.data) ? res.data : [];
        this.users = allUsers;
        this.isLoading = false; // ✅ Stop loading
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.isLoading = false; // ✅ Stop loading on error
      },
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
      console.log('Buyer Status Response:', res);

      // Ensure we have an array response
      const responseArray = Array.isArray(res) ? res : [res];

      // Loop through each returned product detail
      responseArray.forEach((responseData: any) => {
        const productIndex = this.products.findIndex(p => p._id === responseData._id || p._id === id);

    if (productIndex !== -1 && responseArray.length > 0) {
  this.products[productIndex].buyerDetails = responseArray.map((r: any) => ({
    status: r.status || 'N/A',
    message: r.message || 'N/A',
    contact_phone: r.contact_phone || 'N/A',
    preferred_contact_time: r.preferred_contact_time || 'N/A',
  }));
}
      });
    },
    error: (err) => {
      console.error('Error fetching buyer status by id:', err);
    }
  });
}

}