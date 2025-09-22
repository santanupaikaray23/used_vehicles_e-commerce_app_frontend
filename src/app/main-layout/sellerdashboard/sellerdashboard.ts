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
  // status: string | undefined;
  // statushistory: string | undefined;

  vehicles: any[] = [];
  vehicle: any;
  products: any[] = [];
  isEditMode: boolean = false;
  editVehicleId: string | null = null;
  displayedColumns: string[] = ['_id', 'title', 'make', 'images', 'action'];

  selectedFiles: File[] = [];
  errorMessage: string = '';
  maxFileSize = 2 * 1024 * 1024; 
  maxFiles = 5;

  photos: (string | null)[] = Array(5).fill(null);

  @ViewChildren('fileInput') fileInputs!: QueryList<ElementRef<HTMLInputElement>>;

  constructor(private auth: Auth, private router: Router) {} 

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

  getProducts() {
    this.auth.getProducts().subscribe((data: any) => {
      console.log('API response:', data);
      const allProducts = Array.isArray(data.data) ? data.data : [];
      this.products = allProducts;
      console.log('Latest product for table:', this.products);
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
    // this.status = '';
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
}