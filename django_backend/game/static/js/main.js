// get profile Id from button data
// function getProfileData() {
// 	$.ajax({
// 		type: 'GET',
// 		url: '/profile/1',
// 		sucess: function(data) {
// 			console.log(data);
// 		},
// 		error: function(data) {
// 			console.log(data);
// 		}
// 	});
// };


// document.addEventListener('DOMContentLoaded', () => {
// 	var script = document.createElement('script');
// 	script.src = "https://code.jquery.com/jquery-3.6.0.min.js";
// 	script.type = 'text/javascript';
// 	script.onload = getProfileData;
// 	const profilePageUsername = document.getElementById('profile-page-username');

// });
// script.js
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    const message = document.createElement('p');
    message.textContent = 'This message is added by JavaScript!';
    container.appendChild(message);

    const fetchButton = document.getElementById('fetchButton');
    fetchButton.addEventListener('click', () => {
		console.log('Button clicked');
		const resultBox = document.getElementById('resultBox')

		// const url = window.location.href + 'json';
		const url = 'http://localhost:8000/game-start/users/json_profile';
		console.log(`Sending fetch request to: ${url}`);

		// $.ajax({
		// 	type: 'GET',
		// 	url: url,
		// 	success: function(data) {
		// 		console.log(data);
		// 		// container.html(JSON.stringify(data)); // Displaying data for debug purposes
		// 	},
		// 	error: function(xhr, status, error) {
		// 		console.error('An error occurred:', status, error);
		// 		// container.html('An error occurred while fetching the profile.');
		// 	}
		// });
        fetch(url, {
				method: 'GET', // Specify the HTTP method
				headers: {
					'Content-Type': 'application/json', // Set content type for JSON response
				}
			})
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                console.log('Fetch request successfully sent');
                return response.json();
            })
            .then(data => {
                console.log('Data received:', data);
                const dataMessage = document.createElement('p');
                dataMessage.textContent = `Fetched Data: ${JSON.stringify(data)}`;
                container.appendChild(dataMessage);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                const errorMessage = document.createElement('p');
                errorMessage.textContent = `Error fetching data: ${error.message}`;
                container.appendChild(errorMessage);
            });
    });
});
