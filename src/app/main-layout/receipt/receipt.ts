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
   isLoading = true; 

  constructor(private route: ActivatedRoute, private auth: Auth) {}

  ngOnInit(): void {
      const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.auth.getExpressionsById(id).subscribe({
        next: (data) => {
          this.booking = data;
          this.isLoading = false; 
        },
        error: (err) => {
          console.error('Error loading booking receipt:', err);
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
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
async downloadReceipt() {
  if (!this.booking) return;

  const receiptContent = `
Booking Receipt
------------------------
Booking ID: ${this.booking._id}
Vehicle: ${this.booking.vehicle_name}
Price: ${this.booking.vehicle_price}
Date: ${new Date(this.booking.created_at).toLocaleString()}
------------------------
Thank you for your booking!
  `;

  const { jsPDF } = await import('jspdf'); // Lazy load here
  const doc = new jsPDF();
  doc.text(receiptContent, 10, 10);
  doc.save(`Booking_Receipt_${this.booking._id}.pdf`);
}
}
