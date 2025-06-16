document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('access-request-form');
    const emailInput = document.getElementById('email');
    const submitBtn = document.getElementById('submit-btn');
    const statusMessage = document.getElementById('status-message');
    const loading = document.getElementById('loading');

    // Production URL would be the deployed serverless function
    // For development, we'll use a placeholder that would be replaced during deployment
    const API_ENDPOINT = '/.netlify/functions/request-access';
    
    // Variable to store the access link
    let accessLink = null;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const email = emailInput.value.trim();
        
        if (!email) {
            showMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        loading.classList.remove('hidden');
        statusMessage.classList.add('hidden');
        
        try {
            // Make actual API call
            console.log('Making API call to request access');
            try {
                const response = await fetch(API_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || 'An error occurred. Please try again.');
                }
                
                // Immediately redirect to success page
                if (data.accessLink) {
                    accessLink = data.accessLink;
                    redirectToSuccessPage(accessLink);
                } else {
                    // Only show message if we don't have an access link
                    showMessage(data.message || 'Access link has been sent to your email. Please check your inbox.', 'success');
                }
            } catch (fetchError) {
                console.error('API error:', fetchError);
                
                // Extract the error message from the response if available
                let errorMessage = 'Network error. Please try again.';
                
                // This handles fetch API errors which don't have the same structure as axios errors
                if (fetchError.message) {
                    errorMessage = fetchError.message;
                }
                
                throw new Error(errorMessage);
            }
            
            // Reset form
            form.reset();
            
        } catch (error) {
            console.error('Error:', error);
            showMessage(error.message || 'An error occurred. Please try again.', 'error');
        } finally {
            // Hide loading state
            submitBtn.disabled = false;
            loading.classList.add('hidden');
        }
    });
    
    // Function to show a message
    function showMessage(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = type; // Apply the appropriate CSS class
        statusMessage.classList.remove('hidden');
    }
    
    // Function to redirect to the success page with the access link
    function redirectToSuccessPage(accessLink) {
        window.location.href = `success.html?accessLink=${encodeURIComponent(accessLink)}`;
    }
});
