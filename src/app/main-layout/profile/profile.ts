import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Product } from '../../models/product.dto';
import { debounceTime } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  products: Product[] = [];
  total = 0;
  pageSize = 6;
  pageIndex = 0;

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
    locationcity: new FormControl('')
    
  });

  filtered$!: Observable<Product[]>;
  paged$!: Observable<Product[]>;
  total$!: Observable<number>;

  fueltype: string[] = [];
  transmissions: string[] = [];
   locationcity: string[] = [];

  constructor(private svc: Auth) {}

  ngOnInit(): void {
    this.loadProducts();

    // Trigger filtering with debounce
    this.filters.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.pageIndex = 0;
      this.loadProducts();
    });
  }

  loadProducts() {
    const params: any = {
      page: this.pageIndex + 1,
      limit: this.pageSize,
      ...this.filters.value
    };

    this.svc.getProducts(params).subscribe({
      next: (res) => {
        this.products = res.data;
        this.total = res.total;
        this.fueltype = Array.from(
          new Set(res.data.map(product => String(product.fueltype)))
        ).filter(f => !!f) as string[];
        this.transmissions = Array.from(
          new Set(res.data.map(product => String((product as any).transmission)))
        ).filter(t => !!t) as string[];


        this. locationcity= Array.from(
          new Set(res.data.map(product => String((product as any). locationcity)))
        ).filter(s => !!s) as string[];
      },
      error: (err) => console.error('API error:', err)
    });
  }

  goToPage(index: number) {
    const totalPages = Math.ceil(this.total / this.pageSize);
    if (index < 0 || index >= totalPages) return;
    this.pageIndex = index;
    this.loadProducts();
  }

  changePageSize(size: number) {
    this.pageSize = +size;
    this.pageIndex = 0; // reset
    this.loadProducts();
  }

  getPageNumbers(): number[] {
    const pages = Math.ceil(this.total / this.pageSize);
    return Array.from({ length: pages }, (_, i) => i);
  }
}