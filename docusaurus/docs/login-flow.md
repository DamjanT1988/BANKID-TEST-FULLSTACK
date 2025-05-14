# BankID Login Flow

1. User opens the Login page.
2. Frontend calls `/auth/login` to initiate BankID.
3. Backend generates QR code and returns `orderRef`.
4. Frontend displays QR and polls `/auth/status/:orderRef`.
5. On `pending` state, keep polling; if `userSign`, show "Sign in your app".
6. On `complete`, show success and user info.
7. Support cancel and restart timer if <30s.
