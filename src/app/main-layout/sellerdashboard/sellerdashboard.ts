import { Component} from '@angular/core';
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
  maxFileSize = 2 * 1024 * 1024; // 2MB
  maxFiles = 5;

constructor(private auth: Auth) {}

ngOnInit() {
    this.getProducts(); 
  }
    onFileSelected(event: any) {
    this.errorMessage = '';
    const files: FileList = event.target.files;
    const validFiles: File[] = [];

    if (files.length > this.maxFiles) {
      this.errorMessage = `You can upload maximum ${this.maxFiles} images.`;
      return;
    }

    for (let i = 0; i < files.length; i++) {
      if (files[i].size > this.maxFileSize) {
        this.errorMessage = 'File too large, max 2MB';
        return;
      }
      validFiles.push(files[i]);
    }

    this.selectedFiles = validFiles;
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
    this.vehicle = {
      title: this.title,
      make: this.make,
      model: this.model,
      variant: this.variant, 
      year: this.year,
      fueltype: this.fueltype,
      transmission: this.transmission,
      ownercount: this.ownercount,
      registrationstate: this.registrationstate,
      price: this.price,
      description: this.description,
      locationcity: this.locationcity,
      localpincode: this.localpincode,
      images: this.images,
      status: this.status,
      statushistory: this.statushistory
    };
    this.auth.createVehicles(this.vehicle).subscribe(data => {
      console.log('Vehicle record Created');
      console.log(data);
      this.getProducts();
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
  this.selectedFiles = vehicle.images; 
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
