import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Auth } from '../../services/auth';
import { Product } from '../../models/product.dto';

@Component({
  selector: 'app-buyerdashboardthree',
  standalone: false,
  templateUrl: './buyerdashboardthree.html',
  styleUrl: './buyerdashboardthree.css'
})
export class Buyerdashboardthree {
    vehicles: Product[] = [];

  total = 0;
  pageSize = 6;
  pageIndex = 1;

  filters = new FormGroup({
    search: new FormControl(''),
    fueltype: new FormControl(''),
    minPrice: new FormControl(null),
    maxPrice: new FormControl(null),
    minYear: new FormControl(null),
    maxYear: new FormControl(null),
    minMileage: new FormControl(null),
    maxMileage: new FormControl(null),
    transmissions: new FormControl(''),
    locationcity: new FormControl(''),
    sort: new FormControl('newest')
  });

  filtered$!: Observable<Product[]>;
  paged$!: Observable<Product[]>;
  total$!: Observable<number>;

  fueltype: string[] = [];
  transmissions: string[] = [];
  locationcity: string[] = [];

  constructor(private svc: Auth) {}

  ngOnInit(): void {
    this.loadVehicles();
    this.loadTotal();

    this.filters.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.pageIndex = 0;
      this.loadVehicles();
      this.loadTotal();
    });
  }

  loadVehicles() {
    const params: any = {
      page: this.pageIndex + 0,
      limit: this.pageSize,
      ...this.filters.value
    };

    this.svc.readVehicles(params).subscribe({
      next: (res) => {
        this.vehicles = res.data;

        this.fueltype = Array.from(
          new Set(res.data.map(vehicle => String(vehicle.fueltype)))
        ).filter(f => !!f) as string[];

        this.transmissions = Array.from(
          new Set(res.data.map(vehicle => String((vehicle as any).transmission)))
        ).filter(t => !!t) as string[];

        this.locationcity = Array.from(
          new Set(res.data.map(vehicle => String((vehicle as any).locationcity)))
        ).filter(s => !!s) as string[];
      },
      error: (err) => console.error('Buyer Vehicles API error:', err)
    });
  }

  loadTotal() {
    this.svc.readVehicles().subscribe({
      next: (res: any) => {
        this.total = res.total ?? res;
      },
      error: (err) => console.error('Buyer Total API error:', err)
    });
  }

  getValue() {
    return Math.ceil(this.total / this.pageSize);
  }

  changePageSize(size: number) {
    this.pageSize = +size;
    this.pageIndex = 0;
    this.loadVehicles();
  }

  onPageChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    this.loadVehicles();
  }

  getPageNumbers() {
    const totalPages = Math.ceil(this.total / this.pageSize);
    return Array(totalPages).fill(0).map((x, i) => i + 1);
  }


}
