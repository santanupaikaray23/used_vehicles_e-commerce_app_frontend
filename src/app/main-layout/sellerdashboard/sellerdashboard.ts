import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sellerdashboard',
  standalone: false,
  templateUrl: './sellerdashboard.html',
  styleUrl: './sellerdashboard.css'
})
export class Sellerdashboard {
  title: string | undefined;
  make: string | undefined;
  model: string | undefined;
  variant: string | undefined;
  year: number | undefined;
  fueltype: string | undefined;
  transmission: string | undefined;
  ownercount: number | undefined;
  registrationstate: string | undefined;
  price: number | undefined;
  description: string | undefined;
  locationcity: string | undefined;
  localpincode: number | undefined;
  images: string | undefined;
  mileage_km: string | undefined;
  status: string | undefined;

  audit: any;
  vehicles: any[] = [];
  vehicle: any;
  products: any[] = [];
  isEditMode: boolean = false;
  editVehicleId: string | null = null;
  displayedColumns: string[] = ['title', 'make', 'images', 'action',   'auditStatus',
  'auditReason',
  'buyerStatus',
  'buyerReason','buyerContact_phone', 'buyerPreferred_contact_time'];
  statusData: any[] = []
  selectedFiles: File[] = [];
  errorMessage: string = '';
  maxFileSize = 2 * 1024 * 1024;
  maxFiles = 5;

  photos: (string | null)[] = Array(5).fill(null);

  @ViewChildren('fileInput') fileInputs!: QueryList<ElementRef<HTMLInputElement>>;

  constructor(private auth: Auth, private router: Router) { }

  ngOnInit() {
    this.getProducts();
  }

  triggerFileInput(index: number) {
    const input = this.fileInputs.toArray()[index].nativeElement;
    input.click();
  }

  onFileSelected(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > this.maxFileSize) {
        this.errorMessage = 'File too large, max 2MB';
        return;
      }
      this.selectedFiles[index] = file;
      this.photos[index] = URL.createObjectURL(file);
      this.errorMessage = '';
    }
  }

  // getProducts() {
  //   this.auth.getProducts().subscribe((data: any) => {
  //     console.log('API response:', data);
  //     const allProducts = Array.isArray(data.data) ? data.data : [];
  //     this.products = allProducts;
  //     console.log('Latest product for table:', this.products);

  //     this.products.forEach((vehicle: any) => {
  //       this.getStatusById(vehicle._id); // send vehicle._id
  //     });

  //   });
  // }

  getProducts() {
  this.auth.getProducts().subscribe((data: any) => {
    console.log('API response:', data);
    const allProducts = Array.isArray(data.data) ? data.data : [];
    this.products = allProducts;
    console.log('Latest product for table:', this.products);

    this.products.forEach((vehicle: any) => {
      // Fetch both audit + buyer statuses for each product
      this.updateStatusById(vehicle._id, 'audit');
      this.updateStatusById(vehicle._id, 'buyer');
    });

  });
}

  updateVehicles(vehicle: any) {
    this.isEditMode = true;
    this.editVehicleId = vehicle._id;
    this.title = vehicle.title;
    this.make = vehicle.make;
    this.model = vehicle.model;
    this.variant = vehicle.variant;
    this.year = vehicle.year;
    this.fueltype = vehicle.fueltype;
    this.transmission = vehicle.transmission;
    this.ownercount = vehicle.ownercount;
    this.registrationstate = vehicle.registrationstate;
    this.price = vehicle.price;
    this.description = vehicle.description;
    this.locationcity = vehicle.locationcity;
    this.localpincode = vehicle.localpincode;
    this.mileage_km = vehicle.mileage_km;
    this.status = vehicle.status;
    // this.status = vehicle.status;
    // this.statushistory = vehicle.statushistory;

    this.selectedFiles = [];
    this.photos = (vehicle.images || []).map((img: any) =>
      img.data ? `data:${img.mimetype};base64,${img.data}` : null
    );
  }

  saveVehicle() {
    this.errorMessage = '';
    const hasExistingPhotos = this.photos && this.photos.length > 0;

    if (!this.isEditMode && this.selectedFiles.length === 0) {
      this.errorMessage = 'At least one photo is required before submitting.';
      return;
    }

    if (this.isEditMode && !hasExistingPhotos && this.selectedFiles.length === 0) {
      this.errorMessage = 'Please upload at least one photo since none exist yet.';
      return;
    }

    const formData = new FormData();
    formData.append("title", this.title || '');
    formData.append("make", this.make || '');
    formData.append("model", this.model || '');
    formData.append("variant", this.variant || '');
    formData.append("year", String(this.year || ''));
    formData.append("fueltype", this.fueltype || '');
    formData.append("transmission", this.transmission || '');
    formData.append("ownercount", String(this.ownercount || ''));
    formData.append("registrationstate", this.registrationstate || '');
    formData.append("price", String(this.price || ''));
    formData.append("description", this.description || '');
    formData.append("locationcity", this.locationcity || '');
    formData.append("localpincode", String(this.localpincode || ''));
    formData.append("mileage_km", String(this.mileage_km || ''));
    formData.append("status", this.status || 'drafted');
    formData.append("isActive", "false");

    const now = new Date().toISOString();
    if (this.isEditMode) {
      formData.append("updated_at", now);
    } else {
      formData.append("created_at", now);
      formData.append("updated_at", now);
    }

    const imageIndexes: number[] = [];
    this.selectedFiles.forEach((file, index) => {
      if (file) {
        formData.append("images", file, file.name);
        imageIndexes.push(index);
      }
    });

    formData.append("imageIndexes", JSON.stringify(imageIndexes));
    if (this.isEditMode && this.editVehicleId) {
      this.auth.updateVehicles(this.editVehicleId, formData).subscribe({
        next: (data) => {
          console.log("Vehicle updated", data);
          this.getProducts();
          this.resetForm();
        },
        error: (err) => {
          console.error("Error updating vehicle:", err);
          this.errorMessage = 'Failed to update vehicle. Please try again.';
        }
      });
    } else {
      this.auth.createVehicles(formData).subscribe({
        next: (data) => {
          console.log("Vehicle created", data);
          this.getProducts();
          this.resetForm();
        },
        error: (err) => {
          console.error("Error creating vehicle:", err);
          this.errorMessage = 'Failed to create vehicle. Please try again.';
        }
      });
    }
  }

  resetForm() {
    this.isEditMode = false;
    this.editVehicleId = null;
    this.title = '';
    this.make = '';
    this.model = '';
    this.variant = '';
    this.year = undefined;
    this.fueltype = '';
    this.transmission = '';
    this.ownercount = undefined;
    this.registrationstate = '';
    this.price = undefined;
    this.description = '';
    this.locationcity = '';
    this.localpincode = undefined;
    this.mileage_km = undefined;
    this.status = '';
    // this.statushistory = '';
    this.selectedFiles = [];
    this.photos = Array(5).fill(null);
  }

  deleteVehicles(id: number) {
    this.auth.deleteVehicle(id).subscribe({
      next: (data) => {
        console.log('Deleted:', data);
        this.getProducts();
      },
      error: (err) => {
        console.error('Error deleting vehicle:', err);
      }
    });
  }

  cancel() {
    this.resetForm();
    this.router.navigate(['/vehicles']);
  }

// getStatusById(id: string) {
//   this.auth.getStatusById(id).subscribe({
//     next: (res: any[]) => {
//       console.log('Single Audit Response:', res);

//       // find the product in the products list
//       const productIndex = this.products.findIndex(p => p._id === id);
//       if (productIndex !== -1 && Array.isArray(res) && res.length > 0) {
//         // take the last audit (most recent)
//         const latestAudit = res[res.length - 1];
//         this.products[productIndex].reason = latestAudit.reason || 'N/A';
//         this.products[productIndex].status = latestAudit.to_status || this.products[productIndex].status;
//       }
//     },
//     error: (err) => {
//       console.error('Error fetching audit by id:', err);
//     }
//   });
// }

// getBuyerStatusById(id: string) {
//   this.auth.getbuyerStatusById(id).subscribe({
//     next: (res: any) => {
//       console.log('Single Buyer Status Response:', res);

//       const productIndex = this.products.findIndex(p => p._id === id);

//       if (productIndex !== -1 && res) {
//         this.products[productIndex].status = res.status || this.products[productIndex].status;
//         this.products[productIndex].reason = res.message || 'N/A';
//       }
//     },
//     error: (err) => {
//       console.error('Error fetching buyer status by id:', err);
//     }
//   });
// }
updateStatusById(id: string, type: 'audit' | 'buyer') {
  let apiCall;

  if (type === 'audit') {
    apiCall = this.auth.getStatusById(id);  // returns array
  } else {
    apiCall = this.auth.getbuyerStatusById(id);  // returns single object
  }

  apiCall.subscribe({
    next: (res: any) => {
      console.log(`Single ${type} Response:`, res);

      const productIndex = this.products.findIndex(p => p._id === id);

      if (productIndex !== -1) {
        if (type === 'audit' && Array.isArray(res) && res.length > 0) {
          const latestAudit = res[res.length - 1];
          this.products[productIndex].auditReason = latestAudit.reason || 'N/A';
          this.products[productIndex].auditStatus = latestAudit.to_status || 'N/A';
        } 
        
        if (type === 'buyer' && res) {
          const latestAudit = res[res.length - 1];

          this.products[productIndex].buyerStatus = latestAudit.status || 'N/A'; 
          this.products[productIndex].buyerReason = latestAudit.message || 'N/A';
          this.products[productIndex].buyerContact_phone=latestAudit.contact_phone || 'N/A';
          this.products[productIndex].buyerPreferred_contact_time=latestAudit.preferred_contact_time || 'N/A';
        }
      }
    },
    error: (err) => {
      console.error(`Error fetching ${type} by id:`, err);
    }
  });
}
}