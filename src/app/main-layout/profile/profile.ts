import { Component} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Product } from '../../models/product.dto';
import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { debounceTime, startWith, map } from 'rxjs/operators';



@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  private products$ = new BehaviorSubject<Product[]>([]);


  filters = new FormGroup({
    search: new FormControl(''),
    fueltype: new FormControl(''),
    minPrice: new FormControl(null),
    maxPrice: new FormControl(null),
    minYear: new FormControl(null),
    maxYear: new FormControl(null),
    minMileage: new FormControl(null),
    maxMileage: new FormControl(null)
  });

  pageSize = 12;
  pageIndex = 0;

  filtered$!: Observable<Product[]>;
  paged$!: Observable<Product[]>;
  total$!: Observable<number>;
   fueltype: string[] = [];



  constructor(private svc: Auth) {}

  ngOnInit(): void {
     this.svc.getProducts().subscribe({
  next: (products) => {
    this.products$.next(products);

    // Extract unique fuel types for the dropdown
    this.fueltype = Array.from(
  new Set(products.map(p => String(p.fueltype)))
).filter(f => !!f) as string[];
  },
  error: (err) => console.error('API error:', err)
});
    const search$ = this.filters.controls.search.valueChanges.pipe(startWith(''), debounceTime(250));
    const fueltype$ = this.filters.controls.fueltype.valueChanges.pipe(startWith(''));
    const minPrice$ = this.filters.controls.minPrice.valueChanges.pipe(startWith(null));
    const maxPrice$ = this.filters.controls.maxPrice.valueChanges.pipe(startWith(null));
    const minYear$ = this.filters.controls.minYear.valueChanges.pipe(startWith(null));
    const maxYear$ = this.filters.controls.maxYear.valueChanges.pipe(startWith(null));
    const minMileage$ = this.filters.controls.minMileage.valueChanges.pipe(startWith(null));
    const maxMileage$ = this.filters.controls.maxMileage.valueChanges.pipe(startWith(null));


    this.filtered$ = combineLatest([
      this.products$,
      search$,
      minPrice$,
      maxPrice$,
      minYear$,
      maxYear$,
      minMileage$,
      maxMileage$,
      fueltype$
    ]).pipe(
      map(([products, search, fueltype, minP, maxP, minY, maxY,minM,maxM]) => {
        this.pageIndex = 0;
        search = (search || '').toString().trim().toLowerCase();
        return products.filter(p => {
          const combined = `${p.make} ${p.model} ${p.title || ''} ${p.description || ''}`.toLowerCase();
          if (search && !combined.includes(search)) return false;
          if (fueltype && fueltype !== '' && p.fueltype !== fueltype) return false;
          if (minP != null && minP !== '' && Number(p.price) < +minP) return false;
          if (maxP != null && maxP !== '' && Number(p.price) > +maxP) return false;
          if (minY != null && minY !== '' && (p.year as number) < +minY) return false;
          if (maxY != null && maxY !== '' && (p.year as number) > +maxY) return false;
          const mileage = Number(p.mileage);
if (isNaN(mileage)) return false;
if (minM != null && minM !== '' && mileage < +minM) return false;
if (maxM != null && maxM !== '' && mileage > +maxM) return false;
          return true;
        });
      })
    );
this.paged$ = this.filtered$.pipe( map(list => { const start = this.pageIndex * this.pageSize; return list.slice(start, start + this.pageSize); }) ); this.total$ = this.filtered$.pipe(map(list => list.length)); }
goToPage(index: number) {
  const totalPages = Math.ceil(this.products$.value.length / this.pageSize);
  if (index < 0) index = 0;
  if (index >= totalPages) index = totalPages - 2;
  this.pageIndex = index;
  this.products$.next(this.products$.value);
}
changePageSize(size: number) {
  this.pageSize = +size;
  this.pageIndex = 0; // reset to first page
  this.products$.next(this.products$.value);
}
getPageNumbers(totalItems: number): number[] {
  const pages = Math.ceil(totalItems / this.pageSize);
  return Array.from({ length: pages }, (_, i) => i);
}
}
