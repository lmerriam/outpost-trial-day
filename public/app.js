document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('access-request-form');
    const emailInput = document.getElementById('email');
    const submitBtn = document.getElementById('submit-btn');
    const statusMessage = document.getElementById('status-message');
    const loading = document.getElementById('loading');
    const accessModal = document.getElementById('access-modal');
    const openDoorBtn = document.getElementById('open-door-btn');
    const countdownEl = document.getElementById('countdown');
    const timerBar = document.getElementById('timer-bar');

    // Ensure modal is hidden on page load
    accessModal.classList.add('hidden');

    // Production URL would be the deployed serverless function
    // For development, we'll use a placeholder that would be replaced during deployment
    const API_ENDPOINT = '/.netlify/functions/request-access';
    
    // Variables for the countdown timer
    let countdownInterval;
    let accessLink = null;
    const COUNTDOWN_SECONDS = 60;

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
            // Check if we're in development or production mode
            const isDevelopment = window.location.hostname === 'localhost' || 
                                  window.location.hostname === '127.0.0.1' ||
                                  window.location.protocol === 'file:';
            
            if (isDevelopment) {
                // DEVELOPMENT MODE: Mock API response for testing
                console.log('Running in development mode with mock data');
                try {
                    // Simulating API call delay
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    // Mock successful response
                    const mockResponseData = {
                        message: 'Success! Please check your email for access instructions.',
                        accessLink: 'https://example.com/mock-access-link'
                    };
                    
                    // Show success message
                    showMessage(mockResponseData.message, 'success');
                    
                    // Set access link and show modal
                    accessLink = mockResponseData.accessLink;
                    showAccessModal();
                } catch (mockError) {
                    console.error('Mock error:', mockError);
                    throw new Error('Network error. Please try again.');
                }
            } else {
                // PRODUCTION MODE: Make actual API call
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
                    
                    // Show success message
                    showMessage(data.message || 'Access link has been sent to your email. Please check your inbox.', 'success');
                    
                    // Check if we received an access link and show the modal
                    if (data.accessLink) {
                        accessLink = data.accessLink;
                        showAccessModal();
                    }
                } catch (fetchError) {
                    console.error('API error:', fetchError);
                    throw new Error('Network error. Please try again.');
                }
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
    
    // Function to show the access modal and start the countdown
    function showAccessModal() {
        // Reset and show the modal
        countdownEl.textContent = COUNTDOWN_SECONDS;
        timerBar.style.width = '100%';
        accessModal.classList.remove('hidden');
        
        // Start the countdown
        let secondsLeft = COUNTDOWN_SECONDS;
        
        countdownInterval = setInterval(() => {
            secondsLeft--;
            
            // Update the countdown display
            countdownEl.textContent = secondsLeft;
            
            // Update the progress bar
            const percentLeft = (secondsLeft / COUNTDOWN_SECONDS) * 100;
            timerBar.style.width = `${percentLeft}%`;
            
            // If time is up, close the modal
            if (secondsLeft <= 0) {
                closeModal();
            }
        }, 1000);
    }
    
    // Function to close the modal and clear the interval
    function closeModal() {
        clearInterval(countdownInterval);
        accessModal.classList.add('hidden');
    }
    
    // Open door button click handler
    openDoorBtn.addEventListener('click', () => {
        if (accessLink) {
            // Open the access link in a new tab
            window.open(accessLink, '_blank');
            
            // Show message that door is opening
            showMessage('Door is opening. You will also receive an email with access that works all day.', 'success');
            
            // Close the modal after a short delay
            setTimeout(closeModal, 3000);
        }
    });
});
