# System Architecture – MedVault

MedVault is a full-stack healthcare web application with a clear separation between frontend and backend layers.

## High-Level Architecture
- Frontend: React-based web application
- Backend: Spring Boot REST APIs
- Database: MySQL
- Communication: HTTP/HTTPS using JSON

## Component Overview
- Frontend handles user interface, routing, and API integration
- Backend exposes REST endpoints for authentication, appointments, and medical records
- Database stores user, appointment, and medical data

## Authentication & Authorization
- Role-based access control (Patient, Doctor, Admin)
- Secure authentication using backend-managed authorization logic

## Deployment Readiness
- Backend is cloud-ready with environment-based configuration
- Frontend communicates with backend via configurable API endpoints
 
