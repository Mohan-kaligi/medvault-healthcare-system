# API Specification – MedVault

This document outlines the major REST APIs exposed by the MedVault backend.

## Authentication APIs
- POST /api/auth/login  
  - Description: Authenticate user and initiate session
- POST /api/auth/register  
  - Description: Register patient or doctor account

## Patient APIs
- GET /api/patient/appointments  
  - Description: Fetch patient appointments
- POST /api/patient/book-appointment  
  - Description: Book a new appointment

## Doctor APIs
- GET /api/doctor/appointments  
  - Description: View assigned appointments
- PUT /api/doctor/appointments/{id}/status  
  - Description: Update appointment status

## Admin APIs
- GET /api/admin/users  
  - Description: View all users
 
