const sgClient = require('@sendgrid/client');
const sgMail = require('@sendgrid/mail');
const axios = require('axios');
require('dotenv').config();

// Initialize SendGrid
sgClient.setApiKey(process.env.SENDGRID_API_KEY);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Configure Kisi API
const KISI_API_KEY = process.env.KISI_API_KEY;
const KISI_GROUP_ID = process.env.KISI_GROUP_ID;

// SendGrid list ID for trial users
const TRIAL_LIST_ID = process.env.SENDGRID_TRIAL_LIST_ID;

/**
 * Serverless function to handle trial access requests
 */
exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Ensure this is a POST request
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  try {
    // Parse request body
    const data = JSON.parse(event.body);
    const { email } = data;

    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Email is required' })
      };
    }

    // Check if user has already received a trial
    const hasTrialBefore = await checkIfUserHasTrialBefore(email);

    if (hasTrialBefore) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          message: 'You have already used your trial day. Please contact us for membership options.' 
        })
      };
    }

    // Generate Kisi access link
    const accessLink = await generateKisiAccessLink(email);

    if (!accessLink) {
      throw new Error('Failed to generate access link');
    }

    // Add user to SendGrid contacts and mark as trial user
    await addUserToSendGrid(email);

    // Send email with access information
    await sendAccessEmail(email, accessLink);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'Success! Please check your email for access instructions.',
        accessLink: accessLink // Return the access link directly for immediate use
      })
    };

  } catch (error) {
    console.error('Error processing request:', error);
    
    // Provide more specific error messages based on the error
    let errorMessage = 'An error occurred while processing your request. Please try again.';
    let statusCode = 500;
    
    if (error.response) {
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
      
      // Customize error message based on the status code
      if (error.response.status === 403) {
        errorMessage = 'Authentication error with access control system. Please contact support.';
      } else if (error.response.status === 401) {
        errorMessage = 'Authorization error with access control system. Please contact support.';
      } else if (error.response.status === 404) {
        errorMessage = 'Resource not found. Please verify configuration.';
      } else if (error.response.status >= 400 && error.response.status < 500) {
        errorMessage = 'Invalid request to access control system. Please contact support.';
      }
      
      statusCode = error.response.status >= 400 && error.response.status < 600 
                  ? error.response.status : 500;
    }
    
    return {
      statusCode: statusCode,
      headers,
      body: JSON.stringify({ 
        message: errorMessage
      })
    };
  }
};

/**
 * Check if user has already used their trial day
 */
async function checkIfUserHasTrialBefore(email) {
  try {
    // Use SendGrid contacts API to check if user exists with trial_used flag
    const request = {
      method: 'POST',
      url: '/v3/marketing/contacts/search',
      body: {
        query: `email = '${email}' AND CONTAINS(custom_fields, 'trial_used') AND custom_fields.trial_used = true`
      }
    };

    const [response] = await sgClient.request(request);
    
    // If we get results, user has used trial before
    return response.body.contact_count > 0;
  } catch (error) {
    console.error('Error checking user trial status:', error);
    // If there's an error, we'll assume they haven't used a trial
    // This is safer than blocking a potentially new user
    return false;
  }
}

/**
 * Add user to SendGrid contacts and mark as trial user
 */
async function addUserToSendGrid(email) {
  try {
    // First, upsert the contact with custom field
    const request = {
      method: 'PUT',
      url: '/v3/marketing/contacts',
      body: {
        list_ids: [TRIAL_LIST_ID],
        contacts: [
          {
            email,
            custom_fields: {
              trial_used: true
            }
          }
        ]
      }
    };

    await sgClient.request(request);
    console.log(`User ${email} added to SendGrid contacts with trial_used flag`);
    
    return true;
  } catch (error) {
    console.error('Error adding user to SendGrid:', error);
    throw error;
  }
}

/**
 * Generate a temporary access link via Kisi API
 */
async function generateKisiAccessLink(email) {
  try {
    // Set expiration to end of current day
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    
    // Format dates for Kisi API
    const expiresAt = endOfDay.toISOString();
    
    // Create the group link via Kisi API
    const response = await axios.post(
      'https://api.kisi.io/group_links',
      {
        group_id: KISI_GROUP_ID,
        name: `Trial Day - ${email}`,
        expires_at: expiresAt
      },
      {
        headers: {
          'Authorization': `KISI-LOGIN ${KISI_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    
    // Extract and return the access URL
    return response.data.url;
  } catch (error) {
    console.error('Error generating Kisi access link:', error);
    console.error('Response data:', error.response ? error.response.data : 'No response data');
    console.error('Response status:', error.response ? error.response.status : 'No status code');
    console.error('Response headers:', error.response ? error.response.headers : 'No headers');
    throw error;
  }
}

/**
 * Send email with access information using SendGrid
 */
async function sendAccessEmail(email, accessLink) {
  try {
    const msg = {
      to: email,
      from: process.env.FROM_EMAIL,
      templateId: process.env.SENDGRID_TEMPLATE_ID,
      dynamicTemplateData: {
        subject: 'Your Coworking Space Trial Day Access',
        access_link: accessLink,
        expires_at: 'end of today'
      }
    };
    
    await sgMail.send(msg);
    console.log(`Access email sent to ${email}`);
    
    return true;
  } catch (error) {
    console.error('Error sending access email:', error);
    throw error;
  }
}
