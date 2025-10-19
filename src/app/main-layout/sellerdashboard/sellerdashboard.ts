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
  isLoading: boolean = false; 

  displayedColumns: string[] = [
    'title', 'make', 'images', 'action',
    'auditStatus', 'auditReason', 'buyerStatus',
    'buyerReason', 'buyerContact_phone', 'buyerPreferred_contact_time',
    'actioncontacted', 'actionclosed'
  ];

  statusData: any[] = []
  selectedFiles: File[] = [];
  errorMessage: string = '';
  maxFileSize = 5 * 1024 * 1024;
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

  onFileSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        this.errorMessage = 'Only .jpg and .png formats are allowed!';
        return;
      } else {
        this.errorMessage = '';
      }
      this.selectedFiles[index] = file;
      const reader = new FileReader();
      reader.onload = e => this.photos[index] = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  getProducts() {
    this.isLoading = true;
    this.auth.getProducts().subscribe({
      next: (data: any) => {
        const allProducts = Array.isArray(data.data) ? data.data : [];
        this.products = allProducts;

        this.products.forEach((vehicle: any) => {
          this.updateStatusById(vehicle._id, 'audit');
          this.updateStatusById(vehicle._id, 'buyer');
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.isLoading = false;
      }
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
    formData.append("status", this.status || 'draft');
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

    this.isLoading = true; 

    if (this.isEditMode && this.editVehicleId) {
      this.auth.updateVehicles(this.editVehicleId, formData).subscribe({
        next: (data) => {
          console.log("Vehicle updated", data);
          this.isLoading = false;
       alert('Vehicle updated successfully!');
          this.getProducts();
          this.resetForm();
        },
        error: (err) => {
          console.error("Error updating vehicle:", err);
          this.errorMessage = 'Failed to update vehicle. Please try again.';
          this.isLoading = false;
        }
      });
    } else {
      this.auth.createVehicles(formData).subscribe({
        next: (data) => {
          console.log("Vehicle created", data);
          this.isLoading = false;
       alert('Vehicle submitted successfully!');
          this.getProducts();
          this.resetForm();
        },
        error: (err) => {
          console.error("Error creating vehicle:", err);
          this.errorMessage = 'Please fill in the above fields correctly.';
          this.isLoading = false;
        }
      });
    }
  }

  deleteVehicles(id: number) {
    this.isLoading = true;
    this.auth.deleteVehicle(id).subscribe({
      next: (data) => {
        console.log('Deleted:', data);
      alert('Vehicle deleted successfully.');
        this.getProducts();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error deleting vehicle:', err);
        this.isLoading = false;
      }
    });
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
    this.selectedFiles = [];
    this.photos = Array(5).fill(null);
  }

  cancel() {
    this.resetForm();
    this.isEditMode = false;
  }

  updateStatusById(id: string, type: 'audit' | 'buyer') {
    let apiCall;

    if (type === 'audit') {
      apiCall = this.auth.getStatusById(id);  
    } else {
      apiCall = this.auth.getbuyerStatusById(id);  
    }

    apiCall.subscribe({
      next: (res: any) => {
        const productIndex = this.products.findIndex(p => p._id === id);

        if (productIndex !== -1) {
          if (res && res.length == 0) {
            this.products[productIndex].auditStatus = this.products[productIndex].status;
          } else if (type === 'audit' && Array.isArray(res) && res.length > 0) {
            const latestAudit = res[res.length - 1];
            this.products[productIndex].auditReason = latestAudit.reason || 'N/A';
            this.products[productIndex].auditStatus = latestAudit.to_status || 'N/A';
          } else if (type === 'buyer' && res && res.length > 0) {
            const latestAudit = res[res.length - 1];
            this.products[productIndex].buyerStatus = latestAudit.status || 'N/A';
            this.products[productIndex].buyerReason = latestAudit.message || 'N/A';
            this.products[productIndex].buyerContact_phone = latestAudit.contact_phone || 'N/A';
            this.products[productIndex].buyerPreferred_contact_time = latestAudit.preferred_contact_time || 'N/A';
          }
        }
      },
      error: (err) => {
        console.error(`Error fetching ${type} by id:`, err);
      }
    });
  }

  markStatus(vehicleId: string, statusToBeSet: string) {
    this.isLoading = true;
    this.auth.markContactedByld(vehicleId, statusToBeSet).subscribe({
      next: (res) => {
        const index = this.products.findIndex(p => p._id === vehicleId);
        if (index !== -1) {
          this.products[index].buyerStatus = statusToBeSet;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error marking contacted:', err);
        this.isLoading = false;
      }
    });
  }

  contactBuyer(vehicle: any): void {
    this.markStatus(vehicle._id, 'contacted');
    if (vehicle.buyerContact_phone) {
      setTimeout(() => {
        window.open(`tel:${vehicle.buyerContact_phone}`, '_self');
      }, 300);
    } else {
      alert('No phone number available for this buyer.');
    }
  }
}