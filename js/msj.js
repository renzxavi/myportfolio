const contactForm = document.getElementById('contactForm');
const statusMessage = document.getElementById('statusMessage');

// Esta función muestra el mensaje de alerta
function showStatusMessage(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `alert-message show ${type}`;
    setTimeout(() => {
        statusMessage.classList.remove('show');
        statusMessage.classList.add('hide');
    }, 3000);
}

// Este evento maneja el envío del formulario
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);

    fetch('save_contact.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            showStatusMessage('Successfully!', 'success');
            contactForm.reset();
        } else {
            showStatusMessage('Error!. 😢', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showStatusMessage('Error. 😢', 'error');
    });
});

const notificationsBtn = document.getElementById('notificationsBtn');
const notificationDot = document.getElementById('notificationDot');

// Cuando el usuario hace click, desaparece
notificationsBtn.addEventListener('click', () => {
    notificationDot.style.display = 'none';
});