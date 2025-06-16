# System Patterns: Coworking Space Trial Day Access App

## System Architecture

The application follows a simple client-server architecture with serverless functions:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Client-Side    │     │  Serverless     │     │  External       │
│  Application    │◄────┤  Functions      │◄────┤  Services       │
│  (HTML/JS/CSS)  │     │  (Node.js)      │     │  (Kisi/SendGrid)│
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Key Design Patterns

### 1. Single Responsibility Pattern
Each component handles a specific part of the functionality:
- `request-access.js`: Handles the serverless function logic
- `app.js`: Manages the frontend UI and API interactions
- `style.css`: Handles styling and responsive design
- `index.html`: Provides the basic structure

### 2. API Facade Pattern
The serverless function acts as a facade to simplify interactions with external APIs:
- Abstracts away the complexity of Kisi and SendGrid APIs
- Provides a unified interface for the frontend
- Handles authentication and error management

### 3. Progressive Enhancement
The application is designed to work even with limited JavaScript support:
- Core form submission works without JS
- Enhanced features (direct unlock) require JS
- Graceful degradation if features aren't available

### 4. Stateless Architecture
- No server-side session management
- State is maintained in the frontend during user interaction
- All API calls are independent transactions

## Component Relationships

### Frontend Components
```
┌─────────────────────────────────────┐
│  index.html                         │
│  ┌─────────────────────────────┐    │
│  │  Header Component           │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │  Form Component             │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │  Status Message Component   │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  success.html                       │
│  ┌─────────────────────────────┐    │
│  │  Header Component           │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │  Primary Message Component  │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │  Door Unlock Component      │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │  Info Section Component     │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

### Backend Components
```
┌──────────────────────────────────────────┐
│  request-access.js                       │
│  ┌────────────────────────────────────┐  │
│  │  Trial Status Verification         │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │  Access Link Generation            │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │  Direct Door Unlock                │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │  Email Notification                │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

## Critical Implementation Paths

### 1. Email Submission Flow
```
User Input → Validation → Check Previous Trial → Generate Access → Send Email → Redirect to Success Page
```

### 2. Door Unlock Flow
```
Open Door Button → API Request → Kisi Unlock Endpoint → Success Feedback → Status Update
```

### 3. Error Handling Flow
```
API Error → Log Details → User-friendly Message → Fallback Instructions → Return to Input Form
```

## Key Technical Decisions

1. **Direct API Integration**: Using direct API calls to Kisi and SendGrid rather than intermediary services for simplicity.

2. **Serverless Architecture**: Using Netlify Functions to eliminate the need for a dedicated server and simplify deployment.

3. **No Frontend Frameworks**: Using vanilla JavaScript to minimize dependencies and loading time, important for fast performance on user devices.

4. **Environment-based Logic**: Detecting local vs production environments to provide appropriate behaviors without configuration changes.

5. **Design System Consistency**: Following Outpost's black/white minimalist design language with appropriate spacing, typography, and visual elements.

6. **User Device Flow**: Optimizing for personal devices with emphasis on clear, linear progression rather than kiosk-specific circular flows.
