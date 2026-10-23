# 💳 API Reference | مرجع واجهة البرمجة

> **Note:** LAEL IQ's frontend is fully built and ready for server-side integration. The endpoints documented below describe the expected API contract. Backend implementation is pending.

---

## Overview

| Detail | Value |
|---|---|
| **Base URL** | `https://your-domain.com/api` |
| **Content-Type** | `application/json` |
| **Currency** | IQD (Iraqi Dinar / دينار عراقي) |
| **Authentication** | Bearer token (when implemented) |

---

## Endpoints

### `POST /api/payments/charge`

Process a payment for an order.

#### Request Headers

```
Content-Type: application/json
Authorization: Bearer <token>
```

#### Request Body

```json
{
  "orderId": "ORD-20240101-001",
  "amount": 150000,
  "currency": "IQD",
  "paymentMethod": "card",
  "customer": {
    "name": "أحمد محمد",
    "email": "ahmed@example.com",
    "phone": "+964-770-123-4567",
    "address": {
      "street": "شارع الرشيد",
      "city": "بغداد",
      "province": "بغداد",
      "country": "IQ"
    }
  },
  "card": {
    "number": "4111111111111111",
    "expMonth": 12,
    "expYear": 2025,
    "cvv": "123",
    "holderName": "AHMED MOHAMMED"
  },
  "items": [
    {
      "productId": "PROD-001",
      "name": "عطر لائل الفاخر",
      "quantity": 2,
      "unitPrice": 75000
    }
  ]
}
```

#### Request Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `orderId` | string | ✅ | Unique order identifier |
| `amount` | number | ✅ | Total amount in IQD |
| `currency` | string | ✅ | Always `"IQD"` |
| `paymentMethod` | string | ✅ | `"card"` or `"bank_transfer"` |
| `customer` | object | ✅ | Customer details |
| `customer.name` | string | ✅ | Full name |
| `customer.email` | string | ❌ | Email address |
| `customer.phone` | string | ✅ | Phone number with country code |
| `customer.address` | object | ✅ | Delivery address |
| `card` | object | ⚠️ | Required when `paymentMethod` is `"card"` |
| `card.number` | string | ⚠️ | Card number (no spaces) |
| `card.expMonth` | number | ⚠️ | Expiration month (1–12) |
| `card.expYear` | number | ⚠️ | Expiration year (4 digits) |
| `card.cvv` | string | ⚠️ | 3 or 4 digit security code |
| `card.holderName` | string | ⚠️ | Name on card (uppercase) |
| `items` | array | ✅ | Array of order items |

---

#### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "data": {
    "orderId": "ORD-20240101-001",
    "transactionId": "TXN-ABC123DEF456",
    "status": "completed",
    "amount": 150000,
    "currency": "IQD",
    "paymentMethod": "card",
    "processedAt": "2024-01-01T12:00:00Z"
  },
  "message": "Payment processed successfully"
}
```

#### Success Response Fields

| Field | Type | Description |
|---|---|---|
| `success` | boolean | Always `true` on success |
| `data.orderId` | string | The original order ID |
| `data.transactionId` | string | Unique transaction identifier from payment gateway |
| `data.status` | string | `"completed"` or `"pending"` |
| `data.amount` | number | Charged amount in IQD |
| `data.processedAt` | string | ISO 8601 timestamp |

---

#### Error Response

**Status:** `400 Bad Request` / `402 Payment Required` / `500 Internal Server Error`

```json
{
  "success": false,
  "error": {
    "code": "CARD_DECLINED",
    "message": "The card was declined by the issuing bank.",
    "details": "Please try a different payment method or contact your bank."
  }
}
```

#### Error Codes

| Code | HTTP Status | Description |
|---|---|---|
| `INSUFFICIENT_FUNDS` | 402 | The card does not have enough funds |
| `CARD_DECLINED` | 402 | The card was declined by the issuing bank |
| `INVALID_CARD` | 400 | Card number is invalid or expired |
| `INVALID_CVV` | 400 | CVV code is incorrect |
| `EXPIRED_CARD` | 400 | The card has expired |
| `PROCESSING_ERROR` | 500 | Internal server error during processing |
| `DUPLICATE_TRANSACTION` | 409 | This transaction has already been processed |
| `AMOUNT_MISMATCH` | 400 | The amount does not match the order total |
| `INVALID_CURRENCY` | 400 | Unsupported currency (must be `IQD`) |

---

## Payment Methods

### 💵 Cash on Delivery (الدفع عند الاستلام)

Cash on Delivery orders do **not** call the payment API. They are processed entirely on the client side and stored in localStorage with status `"pending"`. When a backend is implemented, a `POST /api/orders` endpoint should be created to register COD orders.

### 💳 Card Payment

Card payments are sent to `POST /api/payments/charge` with `paymentMethod: "card"` and the `card` object populated.

### 🏦 Bank Transfer

Bank transfers are sent to `POST /api/payments/charge` with `paymentMethod: "bank_transfer"`. The response should include bank account details for the customer to complete the transfer:

```json
{
  "success": true,
  "data": {
    "orderId": "ORD-20240101-002",
    "transactionId": "TXN-XYZ789",
    "status": "pending",
    "bankDetails": {
      "bankName": "مصرف الرافدين",
      "accountNumber": "1234567890",
      "accountName": "LAEL IQ LLC",
      "reference": "ORD-20240101-002"
    }
  }
}
```

---

## Frontend Integration Point

The checkout module (`assets/js/checkout.js`) contains the payment submission logic. When integrating a backend, update the `API_BASE_URL` constant:

```javascript
// assets/js/checkout.js
const API_BASE_URL = 'https://your-domain.com/api';

// Payment submission is handled by:
// processCardPayment(orderData) → POST /api/payments/charge
// processBankTransfer(orderData) → POST /api/payments/charge
```

---

## Rate Limiting (Recommended)

When implementing the backend, consider these rate limits:

| Endpoint | Limit |
|---|---|
| `POST /api/payments/charge` | 10 requests per minute per IP |
| `POST /api/orders` | 20 requests per minute per IP |

---

<div align="center">

**LAEL IQ** — من العراق إلى العالم

</div>
