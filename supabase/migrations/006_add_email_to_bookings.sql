-- Optional customer email, used to send the booking tracking code.
ALTER TABLE bookings ADD COLUMN customer_email text;
