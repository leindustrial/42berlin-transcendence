
// SHOW SECTIONS // STERT OFFLINE GAMES:

function showSection(sectionId) {
    // Get all sections & hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // Show only selected (via click on button/link) section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
		if (sectionId === 'get-started') {

			// a delay in the loading this setion is necessary to ensure that the event listeners to capture the exit event are set up
			// and cleared after closing the ws connection. delay time filled with a loading animation. without this delay, the exit event
			// it is possible that the user is kicked out of the game when changing sections too fast because the event listeners are still active.
		
			document.getElementById('loading-animation').style.display = 'flex';
			setTimeout(() => {
				document.getElementById('loading-animation').style.display = 'none';
				selectedSection.style.display = 'block';
				console.log('Get started section is now visible.');
			}, 3000);
		}
        else if (sectionId === 'tour-hall') {
			selectedSection.style.display = 'block';
            onTourHallVisible();
        }
        else if (sectionId === 'online-1x1') {
			selectedSection.style.display = 'block';
            gameVisible1x1();
        }
        else if (sectionId === 'online-4') {
			selectedSection.style.display = 'block';
            gameVisible4();
        }
		else {
			selectedSection.style.display = 'block';
		}
    }


    // Conditionally show/hide the logo and language
    const language = document.getElementById('language');
    const headerWelcome = document.getElementById('header-welcome');
    const footer = document.getElementById('footer-welcome')
    const profileNav = document.getElementById('profile-nav');
    const profileNav2 = document.getElementById('profile-nav2');
    const offExitLogin = document.getElementById('off-exit-login');
    const offHeaderGame = document.getElementById('off-header-game');
    const horNav = document.getElementById('hor-nav');
    const onHeaderGame = document.getElementById('online-header-game');
    const blockchain = document.getElementById('blockchain');
    
    if (sectionId === 'offline-choose-mode') {
        if (language) language.style.display = 'block';
    }
    else {
        if (language) language.style.display = 'none';
    }
    
    if (sectionId === 'offline-choose-mode' || sectionId === 'id-login' || sectionId === 'id-signup' 
        || sectionId === 'get-started' || sectionId === 'id-update-user' || sectionId === 'id-update-displayname'
        || sectionId === 'id-update-avatar' || sectionId === 'blockchain'
        || sectionId === 'profile' || sectionId === 'profile-list-page') {
        if (headerWelcome) headerWelcome.style.display = 'block';
    } else {
        if (headerWelcome) headerWelcome.style.display = 'none';
    }

    if (sectionId === 'offline-choose-mode' || sectionId === 'id-login' || sectionId === 'id-signup' 
        || sectionId === 'get-started' || sectionId === 'blockchain') {
        if (footer) footer.style.display = 'block'
    } else {
        if (footer) footer.style.display = 'none'
    }

    if (sectionId === 'profile') {
        if (profileNav) profileNav.style.display = 'block';
    } else {
        if (profileNav) profileNav.style.display = 'none'
    }

    if (sectionId === 'profile-list-page' || sectionId === 'id-update-user' || sectionId === 'id-update-displayname'
        || sectionId === 'id-update-avatar') {
        if (profileNav2) profileNav2.style.display = 'block';
    } else {
        if (profileNav2) profileNav2.style.display = 'none'
    }

    if (sectionId === 'id-login' || sectionId === 'id-signup') {
        if (offExitLogin) offExitLogin.style.display = 'block';
    } else {
        if (offExitLogin) offExitLogin.style.display = 'none';
    }
 
    if (sectionId === 'offline-ai' || sectionId === 'offline-1x1' || sectionId === 'offline-tournament'
        || sectionId === 'blockchain'
    ) {
        if (offHeaderGame) offHeaderGame.style.display = 'block';
    } else {
        if (offHeaderGame) offHeaderGame.style.display = 'none';
    }

    if (sectionId === 'get-started') {
        if (horNav) horNav.style.display = 'block';
    } else {
        if (horNav) horNav.style.display = 'none';
    }

    if (sectionId === 'online-1x1' || sectionId === 'online-4' || sectionId === 'tour-hall') {
        if (onHeaderGame) onHeaderGame.style.display = 'block';
    } else {
        if (onHeaderGame) onHeaderGame.style.display = 'none';
    }
}

// Monitor the visibility of the online games sections: necessary for the browser buttons to function properly
function onTourHallVisible() {
    console.log('Tournament hall is now visible.');
    import ('./tour.js').then(module => {
        module.startTournament();
    });
}

function gameVisible1x1() {
    console.log('1x1 game is now visible.');
    import ('./2player.js').then(module => {
        module.game_handler();
    });
}

function gameVisible4() {
    console.log('4x4 game is now visible.');
    import ('./4player.js').then(module => {
        module.game_handler_4pl();
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // SHOW SECTIONS:
    window.addEventListener('hashchange', function() {
        const sectionId = window.location.hash.substring(1);
        showSection(sectionId);
    });
    const initialSection = window.location.hash.substring(1) || 'offline-choose-mode';
	showSection(initialSection);
	
   // Buttons listeners for online games:
    $(document).on('click', '.btn-2pl-game', function(event) {
		console.log('Online 1x1 game clicked');
        sendLog('info', 'Online 1x1 game clicked');
		//hideElement(document.getElementById('get-started'));
		event.preventDefault();
        window.location.hash = 'online-1x1';
	});

	$(document).on('click', '.btn-4pl-game', function(event) {
		console.log('Online 4x4 game clicked');
		//hideElement(document.getElementById('get-started'));
		event.preventDefault();
        window.location.hash = 'online-4';
	});

    $(document).on('click', '.btn-online-tour', function(event) {
        //hideElement(document.getElementById('get-started'));
        event.preventDefault();
        window.location.hash = 'tour-hall';
	});

    // Buttons listeners for offline games:
    $(document).on('click', '.offline-1x1-button', function(event) {
		console.log('Offline 1x1 game clicked');
		hideElement(document.getElementById('offline-choose-mode'));
		event.preventDefault();
		import ('./offline_game.js').then(module => {
			module.offlineGame_handler();
		});
        window.location.hash = 'offline-1x1';
	});

    $(document).on('click', '.offline-tournament-button', function(event) {
		console.log('Offline TOUR game clicked');
		hideElement(document.getElementById('offline-choose-mode'));
		event.preventDefault();
		import ('./offline_tour.js').then(module => {
			module.offlineTour_handler();
		});
        window.location.hash = 'offline-tournament';
	});

     // Buttons listener for offline AI Opponent:

     $(document).on('click', '.offline-ai-button', function(event) {
		console.log('Offline AI game clicked');
		hideElement(document.getElementById('offline-choose-mode'));
		event.preventDefault();
        window.location.hash = 'offline-ai';
		import ('./offline_ai.js').then(module => {
			module.offlineAI_handler();
		});
	});

    // Buttons listener for blockchain:
    $(document).on('click', '.blockchain-button', function(event) {
		console.log('blockchain clicked');
		hideElement(document.getElementById('tournament-game'));
		event.preventDefault();
        window.location.hash = 'blockchain';
		import ('./blockchain.js').then(module => {
			module.blockchain_handler();
		});
	});

    // USER MANAGEMENT:
    // csrfToken required for POST requests
	const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
	window.csrf = csrfToken;

    window.lastDisplayedElement = null;
    window.userElements = [];

    const loginFormDiv = document.getElementById('id-login');
    const getStartedDiv = document.getElementById('get-started');
    const profilePageDiv = document.getElementById('profile');
    const signupFormDiv = document.getElementById('id-signup');
    const userFormDiv = document.getElementById('id-update-user');
    const displaynameFormDiv = document.getElementById('id-update-displayname');
    const avatarFormDiv = document.getElementById('id-update-avatar');
    const profileListPageDiv = document.getElementById('profile-list-page');

    addElementToArray(window.userElements, profilePageDiv);
	addElementToArray(window.userElements, profileListPageDiv);
	addElementToArray(window.userElements, userFormDiv);
	addElementToArray(window.userElements, displaynameFormDiv);
	addElementToArray(window.userElements, avatarFormDiv);

    $('#login_form').on('submit', function(event) {
		event.preventDefault();

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
				hideElement(loginFormDiv);
				
				// commented this out to prevent the get-started section from showing up after login
				// now the main show section is controlled by the hashchange event listener
				// showElement(getStartedDiv);

				window.location.hash = 'get-started';
			},
			error: function(xhr, status, error) {
				let errorMsg = "Error";
				if (xhr.responseJSON && xhr.responseJSON.error) {
					errorMsg = xhr.responseJSON.error;
				}
				console.log(errorMsg);
				const errorP = document.getElementById('id-login').querySelector('.error-message');
				setElementinnerHTML(errorP, `${errorMsg}`);
			}
		});

	});

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
				hideElement(signupFormDiv);
				// showElement(navbarDiv);
                window.location.hash = 'get-started';
			},
			error: function(xhr, status, error) {
				let errorMsg = "Error";
				if (xhr.responseJSON && xhr.responseJSON.error) {
					errorMsg = xhr.responseJSON.error;
				}
				console.log(errorMsg);
				const errorP = document.getElementById('id-signup').querySelector('.error-message');
				setElementinnerHTML(errorP, `${errorMsg}`);
			}
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
				window.userElements.forEach(element => {
					hideElement(element);
				});
				showElement(loginFormDiv);
                window.location.hash = 'offline-choose-mode';
			},
			error: function(data) {
				console.log(data);
			},
		});
	});

    $(document).on('click', '.logout-link', function(event) {
            event.preventDefault(); // Prevent the default anchor behavior
            $('#logoutform').submit(); // Trigger the form submission
    });

    $(document).on('click', '.login-submit', function(event) {
        event.preventDefault(); // Prevent the default anchor behavior
        $('#login_form').submit(); // Trigger the form submission 
    });

    $(document).on('click', '.signup-submit', function(event) {
        event.preventDefault(); // Prevent the default anchor behavior
        $('#signup_form').submit(); // Trigger the form submission 
    });

    $(document).on('click', '.profile-link', function(event) {
		console.log('Button clicked');

		// const url = window.location.href + 'json';
		const url = '/game-start/users/json_profile/';
		console.log(`Sending fetch request to: ${url}`);

		$.ajax({
			type: 'GET',
			url: url,
			success: function(data) {
				console.log(data);
				// hideElement(window.lastDisplayedElement);
				setElementinnerHTML(profilePageDiv, createProfilePage(data));
				showElement(profilePageDiv);
				// window.lastDisplayedElement = profilePageDiv;
			},
			error: function(xhr, status, error) {
				// console.error('An error occurred:', ${data.error});
				let errorMsg = "Error";
				if (xhr.responseJSON && xhr.responseJSON.error) {
                    errorMsg = xhr.responseJSON.error;
                }
				// hideElement(window.lastDisplayedElement);
				setElementinnerHTML(profilePageDiv, `${errorMsg}`);
				showElement(profilePageDiv);
				// window.lastDisplayedElement = profilePageDiv;
				// container.html('An error occurred while fetching the profile.');
			}
		});
    });

    $(document).on('click', '.profile-list-link', function(event) {
		const url = '/game-start/users/json_profile_list';
		console.log(`Sending fetch request to: ${url}`);

		$.ajax({
			type: 'GET',
			url: url,
			success: function(data) {
				// console.log(data);
				hideElement(window.lastDisplayedElement);
				setElementinnerHTML(profileListPageDiv, createProfileListPage(data));
				showElement(profileListPageDiv);
				window.lastDisplayedElement = profileListPageDiv;
				// container.html(JSON.stringify(data)); // Displaying data for debug purposes
			},
			error: function(xhr, status, error) {
				console.error('An error occurred:', status, error);
			}
		});
    });

    $('#update_user_form').on('submit', function(event) {
		event.preventDefault();
		// const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;

		const successP = document.getElementById('id-update-user').querySelector('.success-message');
		const errorP = document.getElementById('id-update-user').querySelector('.error-message');

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
				setElementinnerHTML(errorP, "");
				setElementinnerHTML(successP, data.msg);
			},
			error: function(xhr, status, error) {
				let errorMsg = "Error";
				if (xhr.responseJSON && xhr.responseJSON.error) {
					errorMsg = xhr.responseJSON.error;
				}
				console.log(errorMsg);
				setElementinnerHTML(successP, "");
				setElementinnerHTML(errorP, `${errorMsg}`);
			}
		});


	});

    $('#update_display_name_form').on('submit', function(event) {
		event.preventDefault();

		const successP = document.getElementById('id-update-displayname').querySelector('.success-message');
		const errorP = document.getElementById('id-update-displayname').querySelector('.error-message');

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
				setElementinnerHTML(errorP, "");
				setElementinnerHTML(successP, data.msg);
                window.location.hash = 'id-update-displayname';
			},
			error: function(xhr, status, error) {
				let errorMsg = "Error";
				if (xhr.responseJSON && xhr.responseJSON.error) {
					errorMsg = xhr.responseJSON.error;
				}
				console.log(errorMsg);
				setElementinnerHTML(successP, "");
				setElementinnerHTML(errorP, `${errorMsg}`);
			}
		});


	});

    $('#update_avatar_form').on('submit', function(event) {
		event.preventDefault();
		// const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;

		const image = document.getElementById('id_avatar')
		const image_data = image.files[0]
		const url = URL.createObjectURL(image_data)
		console.log(url)

		const errorP = document.getElementById('id-update-avatar').querySelector('.error-message');
		const successP = document.getElementById('id-update-avatar').querySelector('.success-message');

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
				setElementinnerHTML(errorP, "");
				setElementinnerHTML(successP, data.msg);
                window.location.hash = 'id-update-avatar';
			},
			error: function(xhr, status, error) {
				let errorMsg = "Error";
				if (xhr.responseJSON && xhr.responseJSON.error) {
					errorMsg = xhr.responseJSON.error;
				}
				console.log(errorMsg);
				setElementinnerHTML(successP, "");
				setElementinnerHTML(errorP, `${errorMsg}`);
			},
			cache: false,
			contentType: false,
			processData: false,
		});
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
				// console.log(data);
				hideElement(window.lastDisplayedElement);
				setElementinnerHTML(profileListPageDiv, createProfileListPage(data));
				showElement(profileListPageDiv);
				window.lastDisplayedElement = profileListPageDiv;
				// window.csrf = data.csrf_token;
			},
			error: function(data) {
				console.log(data);
				// To Do
			}
		});
	})

    $(document).on('click', '.other-profile-link', function(event) {
		event.preventDefault();

		const profileId = $(this).data('id');
		const url = `/en/game-start/users/json_profile/${profileId}`;
		console.log(url);

		$.ajax({
			type: 'GET',
			url: url,
			success: function(response) {
				console.log('Profile details fetched:', response);
				hideElement(window.lastDisplayedElement);
				setElementinnerHTML(profilePageDiv, createOtherProfilePage(response));
				showElement(profilePageDiv);
				window.lastDisplayedElement = profilePageDiv;
				// Optionally display profile details or give feedback to the user
                window.location.hash = 'profile';
			},
			error: function(xhr, status, error) {
				console.error('Error fetching profile details:', status, error);
				// Optionally give feedback to the user
			}
		});
	});
});

// USER MANAGEMENT HELPER FUNCTIONS:

function createProfilePage(data) {
    // Construct the HTML for the profile page
    let profilePageHtml = `
    <div class="container profile-container">
        <div class="row justify-content-center">
            <!-- Main Container for Profile, Friends, Stats, and Match History -->
            <div class="col-10">
                <!-- Profile Section -->
                <div class="row mb-4">

                    <!-- Profile Information -->
                    <div class="col-md-6">
                        <h6 class="mb-3">Your Profile</h6>
                        <p><span style="color: #ac8fa5;">Username:</span> <strong>${data.username}</strong></p>
                        <p><span style="color: #ac8fa5;">User ID:</span> <strong>${data.userid}</strong></p>
                        <a href="#id-update-user" class="text-primary mb-3 d-block">Edit Username</a>
                        <p><span style="color: #ac8fa5;">Display Name:</span> <strong>${data.display_name ? data.display_name : '-'}</strong></p>
                        <a href="#id-update-displayname" class="text-primary d-block">Edit Display Name</a>
                    </div>

                    <!-- Avatar Section -->
                    <div class="col-md-6 text-center">
                        <div class="profile-avatar mb-3">
                            ${data.avatar ? `<img src="${data.avatar}" class="img-fluid avatar-square" alt="Profile Picture">` : `<img src="${DEFAULT_AVATAR_URL}" class="img-fluid avatar-square" alt="Default Picture">`}
                        </div>
                        <a href="#id-update-avatar" class="text-primary">Edit Avatar</a>
                    </div>
                </div>

                <!-- Friends Section -->
                <hr class="custom-divider">
                <div class="profile-friends mb-4">
                    <h6>Your  Friends</h6>
                    <ul class="list-unstyled">
                        ${data.friends.map(friend => `
                            <li class="mb-6">
                                <div class="row align-items-center">
                                    <div class="col-auto">
                                        <div class="profile-avatar">
                                            ${friend.avatar ? `<img src="${friend.avatar}" class="img-fluid" style="width: 50px; height: 50px; object-fit: cover;" alt="Friend's Picture">` : `<img src="${DEFAULT_AVATAR_URL}" class="img-fluid" style="width: 50px; height: 50px; object-fit: cover;" alt="Default Picture">`}
                                        </div>
                                    </div>
                                    <div class="col">
                                        <p><span style="color: #ac8fa5;">Username: </span><a href="#profile" class="other-profile-link" data-id="${friend.id}"><strong>${friend.username}</strong></a></p>
                                        <p><span style="color: #ac8fa5;">User ID:</span> <strong>${friend.id}</strong></p>
                                    </div>
                                    <div class="col-auto">
                                        <p>
                                            <span style="color: #ac8fa5;">Status:</span>
                                            <span style="color: ${friend.online_status ? 'green' : 'red'};">${friend.online_status ? 'Online' : 'Offline'}</span>
                                        </p>
                                    </div>
                                    <div class="col-auto">
                                        <form class="Friends-Form" method="POST" action="/en/game-start/users/json_profile_list/">
                                            <input type="hidden" name="action" value="unfriend">
                                            <input type="hidden" name="user_id" value="${friend.id}">
                                            <button type="submit" class="btn btn-outline-danger btn-sm profile-link">Unfriend</button>
                                        </form>
                                    </div>
                                </div>
                            </li><br>
                        `).join('')}
                    </ul>
                    <a href="#profile-list-page" class="profile-list-link">Make New Friends</a>
                </div>

                <!-- Stats Section -->
                <hr class="custom-divider">
                <div class="profile-stats mb-4">
                    <h6>Your Stats</h6>
                    <table class="table table-bordered table-striped table-hover">
                        <thead>
                            <tr>
                                <th style="background-color: transparent; color: #ac8fa5;">Wins</th>
                                <th style="background-color: transparent; color: #ac8fa5;">Losses</th>
                                <th style="background-color: transparent; color: #ac8fa5;">Total Games</th>
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

                <!-- Match History Section -->
                <hr class="custom-divider">
                <div class="profile-match-history">
                    <h6>Your Match History</h6>
                    <table class="table table-bordered table-striped table-hover">
                        <thead>
                            <tr>
                                <th style="background-color: transparent; color: #ac8fa5;">Date</th>
                                <th style="background-color: transparent; color: #ac8fa5;">Winner</th>
                                <th style="background-color: transparent; color: #ac8fa5;">Looser</th>
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
        </div>
    </div>
`;
	return profilePageHtml;
}

function createProfileListPage(data) {
	// Construct the HTML for the profile list page
	let profileListPageHtml = `
    <div class="container profile-list-container">
        <div class="row justify-content-center">
            <div class="col-10">
                <h6>Registered Users</h6>
                <ul class="list-unstyled">
                    ${data.profiles.map(profile => `
                        <li class="mb-3">
                            <div class="row align-items-center">
                                <div class="col-auto">
                                    <div class="profile-avatar">
                                        ${profile.avatar ? `<img src="${profile.avatar}" class="img-fluid" style="width: 50px; height: 50px; object-fit: cover;" alt="Profile Picture">` : `<img src="${DEFAULT_AVATAR_URL}" class="img-fluid" style="width: 50px; height: 50px; object-fit: cover;" alt="Default Picture">`}
                                    </div>
                                </div>
                                <div class="col">
                                    <p>
                                        <span style="color: #ac8fa5;">Username:</span> <a href="#" class="other-profile-link" data-id="${profile.id}">${profile.username}</a>
                                        <span style="color: #ac8fa5;"> | ID:</span> ${profile.id}
                                    </p>
                                </div>
                                <div class="col-auto">
                                    <form class="Friends-Form" method="POST" action="/en/game-start/users/json_profile_list/">
                                        <input type="hidden" name="action" value="${profile.is_friend ? 'unfriend' : 'befriend'}">
                                        <input type="hidden" name="user_id" value="${profile.id}">
                                        <button type="submit" class="btn btn-outline-primary btn-sm">
                                            ${profile.is_friend ? 'Unfriend' : 'Befriend'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>
    </div>
`;

	return profileListPageHtml;
}

function createOtherProfilePage(data) {
    // Construct the HTML for the profile page
    let profilePageHtml = `
    <div class="container profile-container">
        <div class="row justify-content-center">
            <div class="col-10">

                <div class="row mb-4">
                    
                    <!-- Profile Information on the Left -->
                    <div class="col-md-6">
                        <h6 class="mb-3">Profile</h6>
                        <p><span style="color: #ac8fa5;">Username:</span> <strong>${data.username}</strong></p>
                        <p><span style="color: #ac8fa5;">User ID:</span> <strong>${data.userid}</strong></p> 
                        <p><span style="color: #ac8fa5;">Display Name:</span> <strong>${data.display_name ? data.display_name : '-'}</strong></p>
                        </div>

                    <!-- Avatar on the Right -->
                    <div class="col-md-6 text-center">
                        <div class="profile-avatar mb-3">
                            ${data.avatar ? `<img src="${data.avatar}" class="img-fluid avatar-square" alt="Profile Picture">` : `<img src="${DEFAULT_AVATAR_URL}" class="img-fluid avatar-square" alt="Default Picture">`}
                        </div>
                    </div>
                </div>

                <!-- Friends Section -->
                <hr class="custom-divider">
                <div class="profile-friends mb-4">
                    <h6 class="mb-3">Friends</h6>
                    <ul class="list-unstyled">
                        ${data.friends.map(friend => `
                            <li class="mb-3">
                                <div class="row align-items-center">
                                    <div class="col-auto">
                                        <div class="profile-avatar">
                                            ${friend.avatar ? `<img src="${friend.avatar}" class="img-fluid" style="width: 50px; height: 50px; object-fit: cover;" alt="Friend's Picture">` : `<img src="/media/avatars/kermit.png" class="img-fluid" style="width: 50px; height: 50px; object-fit: cover;" alt="Default Picture">`}
                                        </div>
                                    </div>
                                    <div class="col">
                                        <p><span style="color: #ac8fa5;">Username: </span><a href="#profile" class="other-profile-link" data-id="${friend.id}"><strong>${friend.username}</strong></a></p>
                                        <p><span style="color: #ac8fa5;">User ID: </span> <strong>${friend.id}</strong></p>

                                    </div>
                                    <div class="col-auto">
                                        <p>
                                            <span style="color: #ac8fa5;">Status:</span>
                                            <span style="color: ${friend.online_status ? 'green' : 'red'};">${friend.online_status ? 'Online' : 'Offline'}</span>
                                        </p>
                                    </div>
                                    <div class="col-auto">
                                        <form class="Friends-Form" method="POST" action="/en/game-start/users/json_profile_list/">
                                            <input type="hidden" name="action" value="unfriend">
                                            <input type="hidden" name="user_id" value="${friend.id}">
                                        </form>
                                    </div>
                                </div>
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <!-- Stats Section -->
                <hr class="custom-divider">
                <div class="profile-stats mb-4">
                    <h6>Stats</h6>
                    <table class="table table-bordered table-striped table-hover">
                        <thead>
                            <tr>
                                <th style="background-color: transparent; color: #ac8fa5;">Wins</th>
                                <th style="background-color: transparent; color: #ac8fa5;">Losses</th>
                                <th style="background-color: transparent; color: #ac8fa5;">Total Games</th>
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

                <!-- Match History Section -->
                <hr class="custom-divider">
                <div class="profile-match-history">
                    <h6>Match History</h6>
                    <table class="table table-bordered table-striped table-hover">
                        <thead>
                            <tr>
                                <th style="background-color: transparent; color: #ac8fa5;">Date</th>
                                <th style="background-color: transparent; color: #ac8fa5;">Winner</th>
                                <th style="background-color: transparent; color: #ac8fa5;">Looser</th>
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
        </div>
    </div>
`;

	return profilePageHtml;
}

function addElementToArray(array, element) {
	if (element) {
		array.push(element);
	}
}

function showElement(element) {
	if (element) {
		element.style.display = 'block';
	}
}

function hideElement(element) {
	if (element) {
		element.style.display = 'none';
	}
}

function setElementinnerHTML(element, string) {
	if (element) {
		element.innerHTML = string;
	}
}

// LOGGING SERVICE: IT SENDS LOGS TO THE BACKEND VIA API

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');

function sendLog(level, message) {
	fetch('/api/logs/', {
	  method: 'POST',
	  headers: {
		'Content-Type': 'application/json',
		'X-CSRFToken': getCookie('csrftoken')
	  },
	  body: JSON.stringify({
		level: level,
		message: message
	  })
	})
	.then(response => {
	  if (response.ok) {
		console.log('Log successfully sent.');
	  } else {
		console.error('Error sending log:', response.statusText);
	  }
	})
	.catch(error => console.error('Error:', error));
}
  
