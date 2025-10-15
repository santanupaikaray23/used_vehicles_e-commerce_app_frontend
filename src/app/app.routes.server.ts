import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // ✅ Dynamic routes with parameters (add getPrerenderParams)
  {
    path: 'buyerdashboard/inquire/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      const res = await fetch('https://your-api.com/inquiries');
      const data = await res.json();
      return data.map((item: any) => ({ id: item.id.toString() }));
    },
  },
  {
    path: 'buyerdashboard/place-booking/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      const res = await fetch('https://your-api.com/bookings');
      const data = await res.json();
      return data.map((item: any) => ({ id: item.id.toString() }));
    },
  },
  {
    path: 'admindashboard/buyerdashboardtwo/detail/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      const res = await fetch('https://your-api.com/details');
      const data = await res.json();
      return data.map((item: any) => ({ id: item.id.toString() }));
    },
  },
  {
    path: 'admindashboard/receipt-two/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      const res = await fetch('https://your-api.com/receipts');
      const data = await res.json();
      return data.map((item: any) => ({ id: item.id.toString() }));
    },
  },

  // ✅ Keep your default fallback route at the bottom
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];