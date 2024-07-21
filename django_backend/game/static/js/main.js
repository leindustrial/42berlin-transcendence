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

    const fetchProfileButton = document.getElementById('fetchProfileButton');
    fetchProfileButton.addEventListener('click', () => {
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

	const fetchProfileListButton = document.getElementById('fetchProfileListButton');
    fetchProfileListButton.addEventListener('click', () => {
		console.log('Button clicked');
		const resultBox = document.getElementById('resultBox')

		// const url = window.location.href + 'json';
		const url = 'http://localhost:8000/game-start/users/json_profile_list';
		console.log(`Sending fetch request to: ${url}`);

		$.ajax({
			type: 'GET',
			url: url,
			success: function(data) {
				console.log(data);
				const dataMessage = document.createElement('p');
				dataMessage.textContent = `Fetched Data: ${JSON.stringify(data)}`;
				container.appendChild(dataMessage);
				// container.html(JSON.stringify(data)); // Displaying data for debug purposes
			},
			error: function(xhr, status, error) {
				console.error('An error occurred:', status, error);
				const errorMessage = document.createElement('p');
				errorMessage.textContent = `Error fetching data: ${error.message}`;
				container.appendChild(errorMessage);
				// container.html('An error occurred while fetching the profile.');
			}
		});
        // fetch(url, {
		// 		method: 'GET', // Specify the HTTP method
		// 		headers: {
		// 			'Content-Type': 'application/json', // Set content type for JSON response
		// 		}
		// 	})
        //     .then(response => {
        //         if (!response.ok) {
        //             throw new Error(`HTTP error! status: ${response.status}`);
        //         }
        //         console.log('Fetch request successfully sent');
        //         return response.json();
        //     })
        //     .then(data => {
        //         console.log('Data received:', data);
        //         const dataMessage = document.createElement('p');
        //         dataMessage.textContent = `Fetched Data: ${JSON.stringify(data)}`;
        //         container.appendChild(dataMessage);
        //     })
        //     .catch(error => {
        //         console.error('Error fetching data:', error);
        //         const errorMessage = document.createElement('p');
        //         errorMessage.textContent = `Error fetching data: ${error.message}`;
        //         container.appendChild(errorMessage);
        //     });
    });

	$('#Friends-Form').on('submit', function(event) {
		event.preventDefault();
		const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;

		// var formData = $(this).serialize();

		$.ajax({
			type: 'POST',
			url: $(this).attr('action'),
			data: {
				'csrfmiddlewaretoken': csrf,
				'action':$('#action').val(),
				'user_id':$('#user_id').val(),
			},
			success: function(data) {
				console.log(data);
			},
			error: function(data) {
				console.log(data);
			}
		});
	})

	// console.log($('#signup_form'));
	$('#signup_form').on('submit', function(event) {
		event.preventDefault();
		const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;

		$.ajax({
			type: 'POST',
			url: $(this).attr('action'),
			data: {
				'csrfmiddlewaretoken': csrf,
				'username':$('#id_username').val(),
				'password1':$('#id_password1').val(),
				'password2':$('#id_password2').val(),
			},
			success: function(data) {
				console.log(data);
			},
			error: function(data) {
				console.log(data);
			}
		});

	});

	$('#login_form').on('submit', function(event) {
		event.preventDefault();
		const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;


		$.ajax({
			type: 'POST',
			url: $(this).attr('action'),
			data: {
				'csrfmiddlewaretoken': csrf,
				'username':$('#login_name').val(),
				'password':$('#login_password').val(),
			},
			success: function(data) {
				console.log(data);
			},
			error: function(data) {
				console.log(data);
			}
		});


	});

	update_display_name_form

	$('#update_display_name_form').on('submit', function(event) {
		event.preventDefault();
		// const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;


		$.ajax({
			type: 'POST',
			url: $(this).attr('action'),
			data: {
				'csrfmiddlewaretoken':$('input[name=csrfmiddlewaretoken]').val(),
				'display_name':$('#id_display_name').val(),
			},
			success: function(data) {
				console.log(data);
			},
			error: function(data) {
				console.log(data);
			}
		});


	});

	$('#update_user_form').on('submit', function(event) {
		event.preventDefault();
		// const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;

		$.ajax({
			type: 'POST',
			url: $(this).attr('action'),
			data: {
				'csrfmiddlewaretoken':$('input[name=csrfmiddlewaretoken]').val(),
				'username':$('#update_username').val(),
				'password1':$('#update_password1').val(),
				'password2':$('#update_password2').val(),
			},
			success: function(data) {
				console.log(data);
			},
			error: function(data) {
				console.log(data);
			}
		});


	});

	console.log($('#update_avatar_form'));
	$('#update_avatar_form').on('submit', function(event) {
		event.preventDefault();
		const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;

		const image = document.getElementById('id_avatar')
		const image_data = image.files[0]
		const url = URL.createObjectURL(image_data)
		console.log(url)

		const formData = new FormData
		formData.append('csrfmiddlewaretoken', csrf)
		formData.append('avatar', image.files[0])
		$.ajax({
			type: 'POST',
			url: $(this).attr('action'),
			enctype: 'multipart/form-data',
			data: formData,
			success: function(data) {
				console.log(data);
			},
			error: function(data) {
				console.log(data);
			},
			cache: false,
			contentType: false,
			processData: false,
		});


	});


});
