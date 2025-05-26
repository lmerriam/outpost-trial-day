# Coworking Space Trial Day Access App

A simple web application that allows visitors to request trial day access to a coworking space. The app collects visitor email addresses, checks if they've already received a trial day, and if not, generates a temporary access link via Kisi and sends it to their email using SendGrid.

## Features

- Clean, responsive UI for both tablet and mobile devices
- Email validation and storage via SendGrid
- Temporary access link generation via Kisi API
- Immediate access popup with countdown timer and "Open Door" button
- Serverless architecture for easy deployment and maintenance
- Tracks users who have already received trial access

## User Flow

1. User enters email address
2. System checks if email has been used before
   - If used: Display message explaining policy
   - If new: Proceed to next step
3. System calls Kisi API to generate temporary access link
4. System sends email with access information via SendGrid
5. System stores email in SendGrid contacts with trial_used flag
6. System displays popup with "Open Door" button and 60-second countdown timer
7. User can:
   - Click "Open Door" button for immediate access (popup closes after door opens)
   - Wait for email and use the link later (popup closes after 60 seconds)
8. User receives email with access link that works for the remainder of the day

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Serverless functions (Node.js)
- **Email Service**: SendGrid
- **Access Control**: Kisi API
- **Deployment**: Netlify (recommended)

## Setup Instructions

### Prerequisites

- Node.js and npm installed
- SendGrid account with API key
- Kisi account with API access
- Netlify account (for deployment)

### Installation

1. Clone the repository:
   ```
   git clone [repository-url]
   cd coworking-trial-access
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on the `.env.example` template:
   ```
   cp .env.example .env
   ```

4. Configure your environment variables in the `.env` file:
   - `SENDGRID_API_KEY`: Your SendGrid API key
   - `SENDGRID_TRIAL_LIST_ID`: ID of the SendGrid contact list for trial users
   - `SENDGRID_TEMPLATE_ID`: ID of the SendGrid email template
   - `FROM_EMAIL`: Email address to send from
   - `KISI_API_KEY`: Your Kisi API key
   - `KISI_GROUP_ID`: Your Kisi group ID

### SendGrid Configuration

1. Create an API key in your SendGrid account with permissions for:
   - Contacts
   - Email sending

2. Create a contact list for trial users and note the list ID

3. Create a custom field named `trial_used` (boolean type)

4. Create an email template with dynamic template data:
   - `subject`: Email subject
   - `access_link`: The Kisi access link
   - `expires_at`: When the access expires

### Kisi Configuration

1. Generate an API key in your Kisi account
2. Note your Group ID for the access you want to grant

### Local Development

1. Start the development server:
   ```
   npm start
   ```

2. Visit `http://localhost:8888` in your browser

## Deployment

### Netlify Deployment

1. Connect your repository to Netlify
2. Configure environment variables in Netlify's admin panel
3. Deploy the site

Alternatively, deploy from the command line:
```
netlify deploy --prod
```

## Customization

### Email Template

Create a SendGrid template that includes:
- Your branding elements
- Instructions for using the access link
- Dynamic field for the access link (`{{{access_link}}}`)
- Information about when the access expires (`{{{expires_at}}}`)

### Frontend Styling

Modify `public/style.css` to match your branding:
- Update colors
- Add logos
- Adjust layout

### Security Considerations

- Enable rate limiting on your production deployment
- Consider adding reCAPTCHA to prevent abuse
- Monitor your logs for unusual activity

## Limitations

- Trial access is limited to one per email address
- Access expires at the end of the day it was issued
