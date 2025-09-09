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
    this.loadProducts();
    this.loadTotal();

    this.filters.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.pageIndex = 0;
      this.loadProducts();
      this.loadTotal(); 
    });
  }

  loadProducts() {
    const params: any = {
      page: this.pageIndex + 0,
      limit: this.pageSize,
      ...this.filters.value
    };

    this.svc.getProducts(params).subscribe({
      next: (res) => {
        this.products = res.data;

        this.fueltype = Array.from(
          new Set(res.data.map(product => String(product.fueltype)))
        ).filter(f => !!f) as string[];

        this.transmissions = Array.from(
          new Set(res.data.map(product => String((product as any).transmission)))
        ).filter(t => !!t) as string[];

        this.locationcity = Array.from(
          new Set(res.data.map(product => String((product as any).locationcity)))
        ).filter(s => !!s) as string[];
      },
      error: (err) => console.error('Products API error:', err)
    });
  }

  loadTotal() {
    this.svc.getTotal().subscribe({
      next: (res: any) => {
        this.total = res.total ?? res;
      },
      error: (err) => console.error('Total API error:', err)
    });
  }
getValue(){
  return Math.ceil(this.total/this.pageSize)
}
  changePageSize(size: number) {
    this.pageSize = +size;
    this.pageIndex = 0; 
    this.loadProducts();
  }
onPageChange(pageIndex: number){
  this.pageIndex = pageIndex;
  this.loadProducts();

}
  getPageNumbers(){
  const totalPages = Math.ceil(this.total/this.pageSize)
  return Array(totalPages).fill(0).map((x,i)=> i+1)
  }
}