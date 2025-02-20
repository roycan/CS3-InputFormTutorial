// ===========================================
// 📝 Form Handling and Validation Functions
// A collection of functions to handle form submissions,
// validate user input, and manage form interactions
// ===========================================

// Display an error message for a form field
function showError(field, message) {
    // Find the error message div for this field
    const errorDiv = document.getElementById(`${field.id}Error`) || 
        field.parentElement.querySelector('.error-message');

    if (errorDiv) {
        // Show the error message
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        // Add visual feedback by changing field style
        field.classList.add('invalid');
        field.classList.remove('valid');
    }
    return false;
}

// Helper function to display submitted form data
function displayFormData(formData, submissionsList) {
    // Create a new card to display the submission
    const submission = document.createElement('div');
    submission.className = 'submission-card';

    // Build HTML to display form data
    let html = '';
    for (const [key, value] of Object.entries(formData)) {
        if (value && key !== 'submissionDate') {
            const displayValue = Array.isArray(value) ? value.join(', ') : value;
            html += `<p><strong>${key}:</strong> ${displayValue}</p>`;
        }
    }
    html += `<p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>`;

    // Add the new submission to the list
    submission.innerHTML = html;
    submissionsList.insertBefore(submission, submissionsList.firstChild);
}

// ===========================================
// 🚀 Main Form Submission Handler
// This function processes form submissions and sends
// data to the server
// ===========================================
async function handleSubmit(event) {
    // Prevent the form from submitting normally
    event.preventDefault();
    const form = event.target;

    try {
        // Create an object to store form data
        const formData = {};
        const formEntries = new FormData(form);

        // Process each form field
        formEntries.forEach((value, key) => {
            // Special handling for checkboxes (they can have multiple values)
            if (key === 'interests') {
                if (!formData[key]) {
                    formData[key] = [];
                }
                formData[key].push(value);
            }
            // Special handling for file inputs
            else if (key === 'avatar' && value instanceof File) {
                formData[key] = value.name;
            }
            // Handle all other input types
            else {
                formData[key] = value;
            }
        });

        console.log('📝 Submitting form data:', formData);

        // Send the form data to our server
        const response = await fetch('/submit/' + form.id.replace('Form', ''), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        // Check if the server accepted our data
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        // Get the server's response
        const result = await response.text();

        // Update the page with the server's response
        document.documentElement.innerHTML = result;

    } catch (error) {
        console.error('❌ Error submitting form:', error);
        alert(`Error: ${error.message || 'An error occurred while submitting the form. Please try again.'}`);
    }
}

// ===========================================
// 📊 Character and Word Count Features
// This section handles real-time counting of
// characters and words in text inputs
// ===========================================
function initializeCounters() {
    const textInputs = document.querySelectorAll('input[type="text"], textarea');
    textInputs.forEach(input => {
        // Create the counter display element
        const counter = document.createElement('div');
        counter.className = 'input-counter';
        counter.innerHTML = `
            <span class="char-count">0 characters</span>
            ${input.type !== 'email' && input.type !== 'tel' ? '<span class="word-count">0 words</span>' : ''}
        `;
        input.parentNode.insertBefore(counter, input.nextSibling);

        // Update counts whenever the user types
        input.addEventListener('input', () => {
            const charCount = input.value.length;
            const wordCount = input.value.trim() ? input.value.trim().split(/\s+/).length : 0;

            const charSpan = counter.querySelector('.char-count');
            const wordSpan = counter.querySelector('.word-count');

            charSpan.textContent = `${charCount} character${charCount !== 1 ? 's' : ''}`;
            if (wordSpan) {
                wordSpan.textContent = `${wordCount} word${wordCount !== 1 ? 's' : ''}`;
            }
        });
    });
}

// ===========================================
// 🎯 Initialize Everything When Page Loads
// Set up all form features and event listeners
// ===========================================
document.addEventListener('DOMContentLoaded', () => {
    // Add submit handlers to all forms
    const forms = document.querySelectorAll('form[id$="Form"]');
    forms.forEach(form => {
        form.addEventListener('submit', handleSubmit);
    });

    // Set up the experience level slider display
    const experienceSlider = document.getElementById('experience');
    const experienceValue = document.getElementById('experienceValue');
    if (experienceSlider && experienceValue) {
        experienceValue.textContent = `${experienceSlider.value} years`;
        experienceSlider.addEventListener('input', () => {
            experienceValue.textContent = `${experienceSlider.value} years`;
        });
    }

    // Set up phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            // Remove non-digits and limit to 10 digits
            let value = e.target.value.replace(/\D/g, '').substring(0, 10);
            // Format as XXX-XXX-XXXX
            if (value.length >= 6) {
                value = value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{3})(\d{0,3})/, '$1-$2');
            }
            e.target.value = value;
        });
    }

    // Set up file input validation
    const avatarInput = document.getElementById('avatar');
    if (avatarInput) {
        avatarInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                // Check if the file type is an allowed image format
                const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
                if (!validTypes.includes(file.type)) {
                    alert('Please select a valid image file (.jpg, .png, or .gif)');
                    e.target.value = '';
                }
            }
        });
    }

    // Initialize character/word counters
    initializeCounters();

    // Set up form reset functionality
    const allForms = document.querySelectorAll('form');
    allForms.forEach(form => {
        // Create and add reset button
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            const resetBtn = document.createElement('button');
            resetBtn.type = 'button';
            resetBtn.className = 'reset-button';
            resetBtn.textContent = 'Reset Form';
            submitBtn.parentNode.insertBefore(resetBtn, submitBtn.nextSibling);

            // Handle form reset
            resetBtn.addEventListener('click', () => {
                form.reset();
                // Reset all counters
                form.querySelectorAll('.input-counter').forEach(counter => {
                    const charSpan = counter.querySelector('.char-count');
                    const wordSpan = counter.querySelector('.word-count');
                    if (charSpan) charSpan.textContent = '0 characters';
                    if (wordSpan) wordSpan.textContent = '0 words';
                });
                // Reset validation states
                form.querySelectorAll('input').forEach(input => {
                    input.classList.remove('valid', 'invalid');
                });
            });
        }
        // Create view code button
        const viewCodeBtn = document.createElement('button');
        viewCodeBtn.type = 'button';
        viewCodeBtn.className = 'view-code-button';
        viewCodeBtn.textContent = 'View Code';
        form.appendChild(viewCodeBtn);

        // Add view code event listener
        viewCodeBtn.addEventListener('click', () => {
            const formHtml = form.outerHTML;
            const validationCode = getValidationCode(form.id);

            const modal = document.createElement('div');
            modal.className = 'code-modal';
            modal.innerHTML = `
                <div class="code-modal-content">
                    <h3>HTML Code</h3>
                    <pre><code class="language-html">${escapeHtml(formHtml)}</code></pre>
                    <h3>Validation Code</h3>
                    <pre><code class="language-javascript">${validationCode}</code></pre>
                    <button class="close-modal">Close</button>
                </div>
            `;

            document.body.appendChild(modal);
            modal.querySelector('.close-modal').addEventListener('click', () => {
                modal.remove();
            });
        });
    });
});

// ===========================================
// 🔍 Helper Functions
// Utility functions used throughout the code
// ===========================================

// Helper function to get validation code for a form
function getValidationCode(formId) {
    const validationCode = {
        personalForm: `
// Personal Information Form Validation
function validatePersonalForm() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const age = document.getElementById('age');

    // Name validation: minimum 2 characters
    if (name.value.length < 2) {
        return showError(name, 'Name must be at least 2 characters');
    }

    // Email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        return showError(email, 'Please enter a valid email address');
    }

    // Age validation: between 13 and 120
    if (age.value) {
        const ageNum = parseInt(age.value);
        if (ageNum < 13 || ageNum > 120) {
            return showError(age, 'Age must be between 13 and 120');
        }
    }

    return true;
}`,
        contactForm: `
// Contact Form Validation
function validateContactForm() {
    const phone = document.getElementById('phone');
    const preferredTime = document.getElementById('preferredTime');

    // Phone validation using regex (optional field)
    if (phone.value) {
        const phoneRegex = /^\\d{3}-\\d{3}-\\d{4}$/;
        if (!phoneRegex.test(phone.value)) {
            return showError(phone, 'Please enter a valid phone number (123-456-7890)');
        }
    }

    return true;
}`,
        // Add validation code for other forms...
    };

    return validationCode[formId] || '// No specific validation code for this form';
}

// Escape HTML characters to prevent XSS attacks
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}