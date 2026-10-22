# TIMO

TIMO is a lightweight command centre and point-of-sale prototype for a choma chicken business. It gives an owner a clear view of daily sales, cash and M-Pesa revenue, inventory, active staff, and alerts, while giving staff a quick checkout flow.

## Included in this prototype

- Owner dashboard with live-style daily metrics
- Sales history and payment breakdown
- Inventory overview and low-stock alerts
- Staff, expenses, reports, and alerts screens
- Fast POS flow with chicken, chips, and soda products
- Cash checkout and an M-Pesa STK Push simulation

## Run locally

Requirements: Node.js 22.6 or newer.

```bash
npm install
npm run build
npm start
```

Open [http://localhost:4173](http://localhost:4173).

For development without a build step:

```bash
npm run dev
```

## M-Pesa note

The M-Pesa flow in this prototype is a user-interface simulation. A production integration must initiate Daraja STK Push requests from a server, protect credentials in server-side environment variables, process payment callbacks, and only mark a sale paid after verification. TIMO must never request or store a customer M-Pesa PIN.
