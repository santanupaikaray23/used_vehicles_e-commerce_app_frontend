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
  displayedColumns: string[] = ['_id', 'title', 'make', 'images', 'status', 'action'];
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
    next: (res) => {
      console.log('Vehicle marked as sold:', res);
      this.getProducts();
    },
    error: (err) => {
      console.error('Error marking vehicle as sold:', err);
      this.errorMessage = 'Failed to mark vehicle as sold. Please try again.';
    }
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
}