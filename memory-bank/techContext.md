# Technical Context: Coworking Space Trial Day Access App

## Technology Stack

### Frontend
- **HTML/CSS/JavaScript**: Vanilla implementation without frameworks for simplicity
- **Responsive Design**: Mobile and tablet friendly for use on personal devices
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Design System**: Minimalist black/white aesthetic matching Outpost's website
- **CSS Variables**: Used for theming and consistent styling with --color-dark, --color-light, etc.

### Backend
- **Serverless Functions**: Node.js functions deployed on Netlify
- **API Integrations**: Kisi API and SendGrid API
- **Authentication**: API key based authentication for third-party services
- **Environment Variables**: Secure storage of API keys and configuration

## External Services

### Kisi Access Control
- **API Endpoints Used**:
  - `POST /group_links` - Generate temporary access links
  - `POST /locks/{id}/unlock` - Direct door unlock functionality
- **Authentication**: `KISI-LOGIN` header with API key
- **Response Handling**: Extracting `secret` from response to construct access URL

### SendGrid Email Service
- **Features Used**:
  - Contact management
  - Custom fields (trial_used)
  - Email templates
  - Contact search
- **Authentication**: API key
- **Custom Fields**: Using string values ('1') instead of booleans for compatibility

## Development & Deployment

### Local Development
- **Environment**: Local Node.js environment
- **Environment Detection**: Automatic detection of development vs. production mode
- **Mock Data**: Used in development to avoid API calls

### Production Deployment
- **Platform**: Netlify
- **Configuration**: netlify.toml for build settings and redirects
- **Environment Variables**: Configured in Netlify dashboard
- **CI/CD**: Automatic deployment from repository

## Security Considerations

- **API Keys**: Stored as environment variables, never exposed to client
- **Rate Limiting**: Consideration for production deployment
- **Error Handling**: Careful error messages that don't expose sensitive information
- **Input Validation**: Validate email addresses before processing

## Performance Considerations

- **Minimal Dependencies**: Limited use of external libraries
- **Optimized API Calls**: Minimizing number of calls to external services
- **Error Recovery**: Graceful fallback in case of API failures
- **Caching**: Not implemented as real-time access is required
