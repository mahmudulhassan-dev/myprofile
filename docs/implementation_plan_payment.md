# SSLCommerz Payment Gateway Integration Plan

## Goal
Enable secure online payments (Bkash, Rocket, Nagad, Cards) using SSLCommerz.

## 1. Backend Implementation
- **Dependency**: `sslcommerz-lts` (Node.js wrapper) or direct API calls.
- **Environment Variables**:
    - `STORE_ID`
    - `STORE_PASSWORD`
    - `IS_SANDBOX` (true/false)
- **Database (`Order` Model Update)**:
    - Add: `tran_id` (Unique Transaction ID)
    - Add: `val_id` (Validation ID from SSL)
    - Add: `payment_status` (Pending, Success, Failed, Cancelled)
    - Add: `card_type`, `bank_tran_id` (Optional logs)
- **API Endpoints (`/api/payment`)**:
    - `POST /init`: Create session, update Order, return Gateway URL.
    - `POST /success`: Handle success callback, validate transaction, update Order -> 'Paid', redirect to Frontend Success.
    - `POST /fail`: Update Order -> 'Failed', redirect to Frontend Fail.
    - `POST /cancel`: Update Order -> 'Cancelled', redirect to Frontend Cancel.
    - `POST /ipn`: Background listener.

## 2. Frontend Implementation
- **Checkout Flow**:
    - User clicks "Pay Now".
    - Frontend calls `/api/payment/init` with Order ID.
    - Server returns `{ url: 'https://sandbox.sslcommerz.com/...' }`.
    - Frontend does `window.location.replace(url)`.
- **Pages**:
    - `src/components/payment/PaymentSuccess.jsx`: "Thank you for your payment".
    - `src/components/payment/PaymentFail.jsx`: "Payment failed, try again".

## 3. Manual Steps for User
- Sign up at SSLCommerz (Developer/Sandbox).
- Get `STORE_ID` and `STORE_PASSWORD`.
- Add to `.env` file.
- Set IPN URL in SSLCommerz Dashboard (optional but recommended).

## 4. Dependencies
- `sslcommerz-lts`
- `uuid` (for unique transaction IDs)
