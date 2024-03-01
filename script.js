document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Récupération du jeton CSRF du cookie
    const csrfToken = document.cookie.split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    fetch('/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': csrfToken, // Assurez-vous que le nom d'en-tête correspond à votre configuration csurf
        },
        body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(data => {
        alert('Message envoyé !');
    })
    .catch((error) => {
        console.error('Erreur:', error);
    });
});