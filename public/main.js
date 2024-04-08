// main.js

document.addEventListener('DOMContentLoaded', () => {
    const userNameLink = document.getElementById('user-name-link');

    if (userNameLink) {
        userNameLink.addEventListener('click', async (event) => {
            event.preventDefault(); // Prevent default link behavior

            try {
                const response = await fetch('/user/details', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user details');
                }

                const userDetails = await response.json();
                displayUserDetails(userDetails);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        });
    }
});

function displayUserDetails(userDetails) {
    const userDetailsContainer = document.getElementById('user-details-container');
    userDetailsContainer.innerHTML = ''; // Clear previous content

    // Create a card to display user details
    const card = document.createElement('div');
    card.classList.add('card');

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    // Populate card body with user details
    const nameElement = document.createElement('h5');
    nameElement.classList.add('card-title');
    nameElement.textContent = userDetails.name;

    const emailElement = document.createElement('p');
    emailElement.classList.add('card-text');
    emailElement.textContent = `Email: ${userDetails.email}`;

    const phoneElement = document.createElement('p');
    phoneElement.classList.add('card-text');
    phoneElement.textContent = `Phone Number: ${userDetails.phoneNumber || 'Not available'}`;

    // Append elements to card body
    cardBody.appendChild(nameElement);
    cardBody.appendChild(emailElement);
    cardBody.appendChild(phoneElement);

    // Append card body to card
    card.appendChild(cardBody);

    // Append card to user details container
    userDetailsContainer.appendChild(card);
}

