function createProfilePage(data) {
    // Construct the HTML for the profile page
    let profilePageHtml = `
        <div class="profile-container">
            <h2>Profile</h2>

            <p><strong>User ID:</strong> ${data.userid}</p>
            <p><strong>Username:</strong> ${data.username}</p>
			<a href="#" class="update-useraccount-link">edit</a>

			<p><strong>Display Name:</strong> ${data.display_name}</p>
			<a href="#" class="update-displayname-link">edit</a>

            <div class="profile-avatar">
                ${data.avatar ? `<img src="${data.avatar}" width=200 height=200 alt="Profile Picture">` : `<img src="/media/avatars/kermit.png" width=200 height=200 alt="Default Picture">`}
            </div>
			<a href="#" class="update-avatar-link">edit</a>

            <div class="profile-friends">
                <h3>Friends</h3>
                <ul>
                    ${data.friends.map(friend => `
                        <li>
                            <p><strong>Username:</strong> ${friend.username}</p>
                            <p><strong>ID:</strong> ${friend.id}</p>
                            <p><strong>Online Status:</strong> ${friend.online_status ? 'Online' : 'Offline'}</p>
                        </li>
                    `).join('')}
                </ul>
				<a href="#" class="profile-list-link">make new friends</a>
            </div>

			<div class="profile-stats">
                <h3>Stats</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Wins</th>
                            <th>Losses</th>
                            <th>Total Games</th>
                        </tr>
                    </thead>
                    <tbody>
                            <tr>
                                <td>${data.wins}</td>
                                <td>${data.losses}</td>
                                <td>${data.total_games}</td>
                            </tr>
                    </tbody>
                </table>
            </div>
            <div class="profile-match-history">
                <h3>Match History</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Winner</th>
                            <th>Looser</th>
                        </tr>
                    </thead>
                    <tbody>
						${data.match_history.filter(match => match.length === 3 && match.every(item => item)).map(match => `
                            <tr>
                                <td>${match[0]}</td>
                                <td>${match[1]}</td>
                                <td>${match[2]}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
	return profilePageHtml;
}

function createOtherProfilePage(data) {
    // Construct the HTML for the profile page
    let profilePageHtml = `
        <div class="profile-container">
            <h2>Profile</h2>

            <p><strong>User ID:</strong> ${data.userid}</p>
            <p><strong>Username:</strong> ${data.username}</p>

			<p><strong>Display Name:</strong> ${data.display_name}</p>

            <div class="profile-avatar">
                ${data.avatar ? `<img src="${data.avatar}" width=200 height=200 alt="Profile Picture">` : `<img src="/media/avatars/kermit.png" width=200 height=200 alt="Default Picture">`}
            </div>

            <div class="profile-friends">
                <h3>Friends</h3>
                <ul>
                    ${data.friends.map(friend => `
                        <li>
                            <p><strong>Username:</strong> ${friend.username}</p>
                        </li>
                    `).join('')}
                </ul>
            </div>

			<div class="profile-stats">
                <h3>Stats</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Wins</th>
                            <th>Losses</th>
                            <th>Total Games</th>
                        </tr>
                    </thead>
                    <tbody>
                            <tr>
                                <td>${data.wins}</td>
                                <td>${data.losses}</td>
                                <td>${data.total_games}</td>
                            </tr>
                    </tbody>
                </table>
            </div>
            <div class="profile-match-history">
                <h3>Match History</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Winner</th>
                            <th>Looser</th>
                        </tr>
                    </thead>
                    <tbody>
						${data.match_history.filter(match => match.length === 3 && match.every(item => item)).map(match => `
                            <tr>
                                <td>${match[0]}</td>
                                <td>${match[1]}</td>
                                <td>${match[2]}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
	return profilePageHtml;
}



// <input type="hidden" name="csrfmiddlewaretoken" value="${window.csrfToken}">

function createProfileListPage(data) {
	// Construct the HTML for the profile list page
	let profileListPageHtml = `
		<div class="profile-list-container">
			<h2>Profile List</h2>
			<ul>
				${data.profiles.map(profile => `
					<li>
						<p><strong>Username:</strong> <a href="#" class="profile-link" data-id="${profile.id}">${profile.username}</a></p>
						<p><strong>ID:</strong> ${profile.id}</p>
						<form class="Friends-Form" method="POST" action="/en/game-start/users/json_profile_list/">
							<input type="hidden" id="action" name="action" value="${profile.is_friend ? 'unfriend' : 'befriend'}">
							<input type="hidden" id="user_id" name="user_id" value="${profile.id}">
							<button type="submit">
								${profile.is_friend ? 'Unfriend' : 'Befriend'}
							</button>
						</form>
					</li>
				`).join('')}
			</ul>
		</div>
	`;
	return profileListPageHtml;
}

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    const message = document.createElement('p');
    message.textContent = 'This message is added by JavaScript!';
    container.appendChild(message);

	const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
	window.csrf = csrfToken;
	window.lastDisplayedElement = null;

	// get Page Elements
	const profilePageDiv = document.getElementById('ProfilePage');
	const profileListPageDiv = document.getElementById('ProfileListPage');
	const userFormDiv = document.getElementById('id-update-user');
	const displaynameFormDiv = document.getElementById('id-update-displayname');
	const avatarFormDiv = document.getElementById('id-update-avatar');

    const fetchProfileButton = document.getElementById('fetchProfileButton');
    fetchProfileButton.addEventListener('click', () => {
		console.log('Button clicked');

		// const url = window.location.href + 'json';
		const url = 'http://localhost:8000/game-start/users/json_profile';
		console.log(`Sending fetch request to: ${url}`);

		$.ajax({
			type: 'GET',
			url: url,
			success: function(data) {
				console.log(data);
				const dataMessage = document.createElement('p');
                dataMessage.textContent = `Fetched Data: ${JSON.stringify(data)}`;
                container.appendChild(dataMessage);
				if (window.lastDisplayedElement != null) {
					window.lastDisplayedElement.style.display = 'none';
				}
				profilePageDiv.innerHTML = createProfilePage(data);
				profilePageDiv.style.display = 'block';
				window.lastDisplayedElement = profilePageDiv;
				// container.html(JSON.stringify(data)); // Displaying data for debug purposes
			},
			error: function(xhr, status, error) {
				// console.error('An error occurred:', ${data.error});
				let errorMsg = "Error";
				if (xhr.responseJSON && xhr.responseJSON.error) {
                    errorMsg = xhr.responseJSON.error;
                }
				if (window.lastDisplayedElement != null) {
					window.lastDisplayedElement.style.display = 'none';
				}
				profilePageDiv.innerHTML = `${errorMsg}`;
				profilePageDiv.style.display = 'block';
				window.lastDisplayedElement = profilePageDiv;
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

	$(document).on('click', '.update-useraccount-link', function(event) {
		event.preventDefault();

		if (window.lastDisplayedElement != null) {
			window.lastDisplayedElement.style.display = 'none';
		}
		userFormDiv.style.display = 'block';
		window.lastDisplayedElement = userFormDiv;
	});

	$(document).on('click', '.update-displayname-link', function(event) {
		event.preventDefault();

		if (window.lastDisplayedElement != null) {
			window.lastDisplayedElement.style.display = 'none';
		}
		displaynameFormDiv.style.display = 'block';
		window.lastDisplayedElement = displaynameFormDiv;
	});

	$(document).on('click', '.update-avatar-link', function(event) {
		event.preventDefault();

		if (window.lastDisplayedElement != null) {
			window.lastDisplayedElement.style.display = 'none';
		}
		avatarFormDiv.style.display = 'block';
		window.lastDisplayedElement = avatarFormDiv;
	});

	$(document).on('click', '.profile-link', function(event) {
		event.preventDefault();

		const profileId = $(this).data('id');
		const url = `/en/game-start/users/json_profile/${profileId}`;
		console.log(url);

		$.ajax({
			type: 'GET',
			url: url,
			success: function(response) {
				console.log('Profile details fetched:', response);
				if (window.lastDisplayedElement != null) {
					window.lastDisplayedElement.style.display = 'none';
				}
				profilePageDiv.innerHTML = createOtherProfilePage(response);
				profilePageDiv.style.display = 'block';
				window.lastDisplayedElement = profilePageDiv;
				// Optionally display profile details or give feedback to the user
			},
			error: function(xhr, status, error) {
				console.error('Error fetching profile details:', status, error);
				// Optionally give feedback to the user
			}
		});
	});



	// const fetchProfileListButton = document.getElementById('fetchProfileListButton');
    // fetchProfileListButton.addEventListener('click', () => {
	$(document).on('click', '.profile-list-link', function(event) {
		// console.log('Button clicked');

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
				if (window.lastDisplayedElement != null) {
					window.lastDisplayedElement.style.display = 'none';
				}
				profileListPageDiv.innerHTML = createProfileListPage(data);
				profileListPageDiv.style.display = 'block';
				window.lastDisplayedElement = profileListPageDiv;
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

	$(document).on('submit', '.Friends-Form', function(event) {
		event.preventDefault();
		// const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;
		console.log('Button clicked');
		// var formData = $(this).serialize();
		const form = $(this);
		console.log(form.find('input[name="action"]').val());
		console.log(form.find('input[name="user_id"]').val());

		$.ajax({
			type: 'POST',
			url: $(this).attr('action'),
			data: {
				'csrfmiddlewaretoken': window.csrf,
				'action':form.find('input[name="action"]').val(),
				'user_id':form.find('input[name="user_id"]').val(),
			},
			success: function(data) {
				console.log(data);
				if (window.lastDisplayedElement != null) {
					window.lastDisplayedElement.style.display = 'none';
				}
				profileListPageDiv.innerHTML = createProfileListPage(data);
				profileListPageDiv.style.display = 'block';
				window.lastDisplayedElement = profileListPageDiv;
				// window.csrf = data.csrf_token;
			},
			error: function(data) {
				console.log(data);
			}
		});
	})

	// console.log($('#signup_form'));
	$('#signup_form').on('submit', function(event) {
		event.preventDefault();
		// const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;

		$.ajax({
			type: 'POST',
			url: $(this).attr('action'),
			data: {
				'csrfmiddlewaretoken': window.csrf,
				'username':$('#id_username').val(),
				'password1':$('#id_password1').val(),
				'password2':$('#id_password2').val(),
			},
			success: function(data) {
				console.log(data.msg);
				window.csrf = data.csrf_token;
			},
			error: function(data) {
				console.log(data);
			}
		});

	});

	$('#login_form').on('submit', function(event) {
		event.preventDefault();
		// const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;


		$.ajax({
			type: 'POST',
			url: $(this).attr('action'),
			data: {
				'csrfmiddlewaretoken': window.csrf,
				'username':$('#login_name').val(),
				'password':$('#login_password').val(),
			},
			success: function(data) {
				console.log(data.msg);
				window.csrf = data.csrf_token;
			},
			error: function(data) {
				console.log(data);
			}
		});


	});


	$('#update_display_name_form').on('submit', function(event) {
		event.preventDefault();
		// const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;
		// 'csrfmiddlewaretoken':$('input[name=csrfmiddlewaretoken]').val(),

		$.ajax({
			type: 'POST',
			url: $(this).attr('action'),
			data: {
				'csrfmiddlewaretoken': window.csrf,
				'display_name':$('#id_display_name').val(),
			},
			success: function(data) {
				console.log(data.msg);
				window.csrf = data.csrf_token;
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
				'csrfmiddlewaretoken': window.csrf,
				'username':$('#update_username').val(),
				'password1':$('#update_password1').val(),
				'password2':$('#update_password2').val(),
			},
			success: function(data) {
				console.log(data.msg);
				window.csrf = data.csrf_token;
			},
			error: function(data) {
				console.log(data);
			}
		});


	});

	console.log($('#update_avatar_form'));
	$('#update_avatar_form').on('submit', function(event) {
		event.preventDefault();
		// const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;

		const image = document.getElementById('id_avatar')
		const image_data = image.files[0]
		const url = URL.createObjectURL(image_data)
		console.log(url)

		const formData = new FormData
		formData.append('csrfmiddlewaretoken', window.csrf)
		formData.append('avatar', image.files[0])
		$.ajax({
			type: 'POST',
			url: $(this).attr('action'),
			enctype: 'multipart/form-data',
			data: formData,
			success: function(data) {
				console.log(data.msg);
				window.csrf = data.csrf_token;
			},
			error: function(data) {
				console.log(data);
			},
			cache: false,
			contentType: false,
			processData: false,
		});


	});

	$('#logoutform').on('submit', function(event) {
		event.preventDefault();
		// const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;

		const formData = new FormData();
		formData.append('csrfmiddlewaretoken', window.csrf)
		$.ajax({
			type: 'POST',
			url: $(this).attr('action'),
			data: formData,
			processData: false,
			contentType: false,
			success: function(data) {
				console.log(data.msg);
				window.csrf = data.csrf_token;
			},
			error: function(data) {
				console.log(data);
			},
		});


	});

});
