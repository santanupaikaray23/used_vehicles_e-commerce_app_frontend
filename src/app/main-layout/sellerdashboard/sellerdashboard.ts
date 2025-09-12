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

constructor(private auth: Auth) {}

ngOnInit() {
    this.getProducts(); 
  }

getProducts() {
  this.auth.getProducts().subscribe((data: any) => {
    console.log('API response:', data);
    this.products = Array.isArray(data.data) ? data.data : [];
    console.log('Products for table:', this.products);
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
  updateVehicles() {
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
    this.auth.updateVehicles(this.vehicle).subscribe(data => {
      console.log('Update the record Successfully');
      console.log(data);
      this.getProducts();
    });
  }
deleteVehicles(id: number) {
  this.auth.deleteVehicle(id).subscribe(data => {
    console.log('Deleted:', data);
    this.getProducts();
  });
}

}
