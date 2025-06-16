document.addEventListener('DOMContentLoaded', () => {
    const openDoorBtn = document.getElementById('open-door-btn');
    const statusMessage = document.getElementById('status-message');
    const loading = document.getElementById('loading');
    
    // Get access link from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const accessLink = urlParams.get('accessLink');
    
    // Show status message function
    function showMessage(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = type; // Apply the appropriate CSS class
        statusMessage.classList.remove('hidden');
    }
    
    // Open door button click handler
    openDoorBtn.addEventListener('click', async () => {
        if (accessLink) {
            try {
                // Show loading state
                openDoorBtn.disabled = true;
                loading.classList.remove('hidden');
                openDoorBtn.textContent = 'Opening...';
                
                // Call the unlock endpoint - ensure we're using the full path including any base directory
                const response = await fetch('/.netlify/functions/request-access/unlock', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({}),
                });
                
                const data = await response.json();
                
                if (response.ok && data.success) {
                    // Door unlocked successfully
                    showMessage('Door unlocked! You will also receive an email with access that works all day.', 'success');
                } else {
                    // Instruct to check email
                    showMessage('Could not unlock door directly. Please check your email for the access link.', 'error');
                }
            } catch (error) {
                console.error('Error unlocking door:', error);
                
                // Instruct to check email
                showMessage('Could not unlock door directly. Please check your email for the access link.', 'error');
            } finally {
                // Reset button state
                openDoorBtn.disabled = false;
                openDoorBtn.textContent = 'OPEN DOOR';
                loading.classList.add('hidden');
            }
        } else {
            showMessage('No access link available. Please check your email for access instructions.', 'error');
        }
    });
});
