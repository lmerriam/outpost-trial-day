# Project Brief: Coworking Space Trial Day Access App

## Purpose
Create a web application that allows visitors to a coworking space to request and receive trial day access through email and direct door unlock capabilities.

## Core Requirements
1. Allow visitors to enter their email address to request trial access
2. Verify if the visitor has already used a trial day
3. Generate a temporary access link via Kisi for approved visitors
4. Send access instructions via email using SendGrid
5. Provide immediate access through a direct door unlock feature
6. Track users who have already received trial access
7. Ensure the application is user-friendly and optimized for kiosk usage

## Technical Scope
- Frontend: HTML, CSS, and vanilla JavaScript
- Backend: Serverless functions (Node.js)
- Integration with Kisi API for access control
- Integration with SendGrid for email and contact management
- Deployment on Netlify

## Success Criteria
- Visitors can quickly request and receive trial access
- The system reliably tracks and prevents multiple trial uses
- Door unlock works seamlessly without requiring additional steps
- The application works in kiosk mode without getting stuck
- Email notifications reliably reach users with access information
