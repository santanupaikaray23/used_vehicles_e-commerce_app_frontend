import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Auth } from '../../services/auth';

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
  status: string | undefined;
  statushistory: string | undefined;

  vehicles: any[] = [];
  vehicle: any;
  products: any[] = [];

  displayedColumns: string[] = ['_id', 'title', 'make', 'images', 'action'];

  selectedFiles: File[] = [];
  errorMessage: string = '';
  maxFileSize = 2 * 1024 * 1024; 
  maxFiles = 5;

  photos: (string | null)[] = Array(5).fill(null);

  @ViewChildren('fileInput') fileInputs!: QueryList<ElementRef<HTMLInputElement>>;

  constructor(private auth: Auth) {}

  ngOnInit() {
    this.getProducts();
  }

  triggerFileInput(index: number) {
    const input = this.fileInputs.toArray()[index].nativeElement;
    input.click();
  }

  onFileSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (file.size > this.maxFileSize) {
        this.errorMessage = 'File too large, max 2MB';
        return;
      }

      this.selectedFiles[index] = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photos[index] = e.target.result; 
      };
      reader.readAsDataURL(file);
    }
  }

  getProducts() {
    this.auth.getProducts().subscribe((data: any) => {
      console.log('API response:', data);
      const allProducts = Array.isArray(data.data) ? data.data : [];
      this.products = allProducts.length > 0 ? [allProducts[allProducts.length - 1]] : [];
      console.log('Latest product for table:', this.products);
    });
  }

 createVehicles() {
    this.errorMessage = '';
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
    formData.append("status", this.status || '');
    formData.append("statushistory", this.statushistory || '');

    this.selectedFiles.forEach(file => {
      formData.append("images", file, file.name);
    });

    this.auth.createVehicles(formData).subscribe({
      next: (data) => {
        console.log("Vehicle record Created", data);
        this.getProducts();
        this.errorMessage = '';
      },
      error: (err) => {
        console.error("Error creating vehicle:", err);
        if (err.error && err.error.error) {
          this.errorMessage = `${err.error.error}`;
        } else {
          this.errorMessage = 'Failed to create vehicle. Please try again.';
        }
      }
    });
  }

  updateVehicles(vehicle: any) {
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
    this.status = vehicle.status;
    this.statushistory = vehicle.statushistory;

    this.selectedFiles = [];
    this.photos = vehicle.images || [];
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
}