import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-receipt',
  standalone: false,
  templateUrl: './receipt.html',
  styleUrl: './receipt.css'
})
export class Receipt {
   booking: any;

  constructor(private route: ActivatedRoute, private auth: Auth) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.auth.getExpressionsById(id).subscribe((data) => {
        this.booking = data;
      });
    }
  }
  
  printReceipt() {
  const content = document.getElementById('receipt')?.innerHTML;
  const printWindow = window.open('', '', 'width=800,height=600');
  if (printWindow && content) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Booking Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            button { display: none; } /* hide buttons in print */
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }
}

}
