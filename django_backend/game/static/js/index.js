// SHOW SECTIONS:
window.addEventListener('hashchange', function() {
    const sectionId = window.location.hash.substring(1);
    showSection(sectionId);
});
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
        selectedSection.style.display = 'block';

        const offGame = document.getElementById('offline-1x1');
        const offTour = document.getElementById('offline-tournament');
        if (window.getComputedStyle(offGame).display === 'block'){
            console.log('We are in the offline 1x1 game');
            offlineGameReset();
        }
        else if (window.getComputedStyle(offTour).display === 'block'){
            console.log('We are in the offline tournament');
            offlineTourReset();
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
    
    if (sectionId === 'offline-choose-mode' || sectionId === 'id-login' || sectionId === 'id-signup' 
        || sectionId === 'get-started' || sectionId === 'id-update-user' || sectionId === 'id-update-displayname'
        || sectionId === 'id-update-avatar'
        || sectionId === 'profile' || sectionId === 'profile-list-page') {
        if (language) language.style.display = 'block';
        if (headerWelcome) headerWelcome.style.display = 'block';
        if (footer) footer.style.display = 'block'
    } else {
        if (language) language.style.display = 'none';
        if (headerWelcome) headerWelcome.style.display = 'none';
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
 
    if (sectionId === 'offline-ai' || sectionId === 'offline-1x1' || sectionId === 'offline-tournament') {
        if (offHeaderGame) offHeaderGame.style.display = 'block';
    } else {
        if (offHeaderGame) offHeaderGame.style.display = 'none';
    }

    if (sectionId === 'get-started') {
        if (horNav) horNav.style.display = 'block';
    } else {
        if (horNav) horNav.style.display = 'none';
    }

    if (sectionId === 'online-1x1' || sectionId === 'online-4' || sectionId === 'online-tournament') {
        if (onHeaderGame) onHeaderGame.style.display = 'block';
    } else {
        if (onHeaderGame) onHeaderGame.style.display = 'none';
    }
}

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

document.addEventListener('DOMContentLoaded', function() {
    const initialSection = window.location.hash.substring(1) || 'offline-choose-mode';
    showSection(initialSection);

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
				showElement(getStartedDiv);
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


    // Offline game / tournament event listeners:

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && gameState_1x1 === 'start') startGame_1x1();
        if (e.key === 'w') velocity1_1x1 = gameState_1x1 === 'play' ? -paddleSpeed : 0;
        if (e.key === 's') velocity1_1x1 = gameState_1x1 === 'play' ? paddleSpeed : 0;
        if (e.key === 'ArrowUp') velocity2_1x1 = gameState_1x1 === 'play' ? -paddleSpeed : 0;
        if (e.key === 'ArrowDown') velocity2_1x1 = gameState_1x1 === 'play' ? paddleSpeed : 0;
    });

    document.addEventListener('keyup', function (e) {
        if (e.key === 'w' && gameState_1x1 === 'play' || e.key === 's' && gameState_1x1 === 'play') velocity1_1x1 = 0;
        if (e.key === 'ArrowUp' && gameState_1x1 === 'play' || e.key === 'ArrowDown'&& gameState_1x1 === 'play') velocity2_1x1 = 0;
    });

    startGameBtn_1x1.addEventListener('click', function () {
        if (input1_1x1.value === input2_1x1.value) {
            alert('Please enter different names for both players.');
        } else if (input1_1x1.value && input2_1x1.value) {
            document.getElementById('player_form_1x1').style.display = 'none';
            gameState_1x1 = 'start';
            name1_1x1.textContent = input1_1x1.value;
            name2_1x1.textContent = input2_1x1.value;
        } else {
            alert('Please enter names for both players.');
        }
    });

    startTourBtn.addEventListener('click', function () {
        console.log('We are in start tournament');
        if (areNotUnique(input1_4.value, input2_4.value, input3_4.value, input4_4.value)) {
            alert('Please enter unique names for all players.');
        } else if (input1_4.value && input2_4.value && input3_4.value && input4_4.value) {
            document.getElementById('player_form_4').style.display = 'none';
            pl1_4 = input1_4.value;
            pl2_4 = input2_4.value
            pl3_4 = input3_4.value;
            pl4_4 = input4_4.value;
            table1_4.textContent = input1_4.value;
            table2_4.textContent = input2_4.value;
            table3_4.textContent = input3_4.value;
            table4_4.textContent = input4_4.value;
            document.getElementById('tournament-table').style.display = 'block';
            document.getElementById('go-to-match').addEventListener('click', startMatch);
        } else {
            alert('Please enter unique names for all players.');
        }
    });
    
});

// Offline Tournament ========================================================================================================

let gameStateTour;
let startTourBtn = document.getElementById('startTourBtn');
let input1_4 = document.getElementById('input1_4');
let input2_4 = document.getElementById('input2_4');
let input3_4 = document.getElementById('input3_4');
let input4_4 = document.getElementById('input4_4');
let pl1_4, pl2_4, pl3_4, pl4_4;
let table1_4 = document.getElementById('table1_4'); 
let table2_4 = document.getElementById('table2_4');
let table3_4 = document.getElementById('table3_4');
let table4_4 = document.getElementById('table4_4');

let name1_4 = document.getElementById('name1_4');
let name2_4 = document.getElementById('name2_4');
let message_4 = document.getElementById('message_4');
let winnerMessage_4 = document.getElementById('winnerMessage_4');
let winnerName_4 = document.getElementById('winnerName_4');

let winner1_4 = null, winner2_4 = null, winner_final_4 = null;


function offlineTourReset() {
    gameStateTour = 'begin';
    document.getElementById('player_form_4').style.display = 'block';
    document.getElementById('tournament-table').style.display = 'none';            
    document.getElementById('tournament-game').style.display = 'none';
    input1_4.value = '';
    input2_4.value = '';
    input3_4.value = '';
    input4_4.value = '';
    name1_4.textContent = 'Player 1';
    name2_4.textContent = 'Player 2';
    winner1_4 = null;
    winner2_4 = null;
    winner_final_4 = null;

    // message_4.innerHTML = 'Press Enter to Play';
    // winnerMessage_4.style.display = 'none';

    // initializeGameElements_1x1()
    // resetScores_1x1();
    // resetBallPosition_1x1();
    // resetPaddlePositions_1x1();
}

function areNotUnique(str1, str2, str3, str4) {
    return str1 === str2 || str1 === str3 || str1 === str4 ||
    str2 === str3 || str2 === str4 ||
    str3 === str4;
}

function startMatch() {
    document.getElementById('tournament-table').style.display = 'none';            
    document.getElementById('tournament-game').style.display = 'block';
    document.getElementById('tour_header').style.display = 'none';
    gameStateTour = 'start';
    if (winner1_4 === null) {
        console.log(pl1_4, pl2_4, name1_4.textContent, name2_4.textContent);
        name1_4.textContent = pl1_4;
        name2_4.textContent = pl2_4;
        winnerName_4.innerHTML = `${pl1_4} vs ${pl2_4}!`;
        winnerMessage_4.style.display = 'block';

    } else if (winner2_4 === null) {
        name1_4.textContent = pl3_4;
        name2_4.textContent = pl4_4;
        winnerMessage_4.innerHTML = `${pl3_4} vs ${pl4_4}!`;
        winnerMessage_4.style.display = 'block';

    } else if (winner_final_4 === null) {
        name1_4.textContent = winner1_4;
        name2_4.textContent = winner2_4;
        winnerMessage_4.innerHTML = `${winner1_4} vs ${winner2_4}!`;
        winnerMessage_4.style.display = 'block';
    }
}

// Offline game 1x1 ==========================================================================================================

// Global variables for offline game:
let gameState_1x1;
let input1_1x1 = document.getElementById('input1_1x1');
let input2_1x1 = document.getElementById('input2_1x1');
let name1_1x1 = document.getElementById('name1_1x1');
let name2_1x1 = document.getElementById('name2_1x1');
let message_1x1 = document.getElementById('message_1x1');
let winnerMessage_1x1 = document.getElementById('winnerMessage_1x1');
let winnerName_1x1 = document.getElementById('winnerName_1x1');
let startGameBtn_1x1 = document.getElementById('startGameBtn_1x1');
let score1_1x1 = document.getElementById('score1_1x1');
let score2_1x1 = document.getElementById('score2_1x1');
let board_1x1 = document.getElementById('board_1x1');
let ball_1x1 = document.getElementById('ball_1x1');
let paddle1_1x1 = document.getElementById('paddle1_1x1');
let paddle2_1x1 = document.getElementById('paddle2_1x1');

let paddle1_coord_1x1, paddle2_coord_1x1, paddle_common_1x1;

const paddleSpeed = 3;
let velocity1_1x1 = 0, velocity2_1x1 = 0;

let dx, dy, dxd, dyd;

function offlineGameReset() {
    gameState_1x1 = 'begin';
    document.getElementById('player_form_1x1').style.display = 'block';
    input1_1x1.value = '';
    input2_1x1.value = '';
    name1_1x1.textContent = 'Player 1';
    name2_1x1.textContent = 'Player 2';
    message_1x1.style.display = 'block';
    message_1x1.innerHTML = 'Press Enter to Play';
    winnerMessage_1x1.style.display = 'none';
    // winnerMessage_1x1.innerHTML = '';
    // winnerName_1x1.innerHTML = '';
    initializeGameElements_1x1()
    resetScores_1x1();
    resetBallPosition_1x1();
    resetPaddlePositions_1x1();
}

function initializeGameElements_1x1() {
    ball_coord_1x1 = ball_1x1.getBoundingClientRect();
    board_coord_1x1 = board_1x1.getBoundingClientRect();
    paddle1_coord_1x1 = paddle1_1x1.getBoundingClientRect();
    paddle2_coord_1x1 = paddle2_1x1.getBoundingClientRect();
    paddle_common_1x1 = document.querySelector('.paddle_off').getBoundingClientRect();

    dx = Math.floor(Math.random() * 4) + 3;
    dy = Math.floor(Math.random() * 4) + 3;
    dxd = Math.floor(Math.random() * 2);
    dyd = Math.floor(Math.random() * 2);

    ball_1x1.style.top = board_coord_1x1.top + (board_coord_1x1.height / 2) - (ball_coord_1x1.height / 2) + 'px';
    ball_1x1.style.left = board_coord_1x1.left + (board_coord_1x1.width / 2) - (ball_coord_1x1.width / 2) + 'px';
}

function resetPaddlePositions_1x1() {

    paddle1_1x1.style.top = 360 + 'px';
    paddle2_1x1.style.top = 360 + 'px';

    paddle1_coord_1x1 = paddle1_1x1.getBoundingClientRect();
    paddle2_coord_1x1 = paddle2_1x1.getBoundingClientRect();

}

function updatePaddlePositions_1x1() {

    paddle1_1x1.style.top = Math.min(Math.max(board_coord_1x1.top, paddle1_coord_1x1.top + velocity1_1x1), board_coord_1x1.bottom - paddle1_coord_1x1.height) + 'px';
    paddle2_1x1.style.top = Math.min(Math.max(board_coord_1x1.top, paddle2_coord_1x1.top + velocity2_1x1), board_coord_1x1.bottom - paddle2_coord_1x1.height) + 'px';

    paddle1_coord_1x1 = paddle1_1x1.getBoundingClientRect();
    paddle2_coord_1x1 = paddle2_1x1.getBoundingClientRect();

    requestAnimationFrame(updatePaddlePositions_1x1);

}

function resetBallPosition_1x1() {
    ball_1x1.style.top = board_coord_1x1.top + (board_coord_1x1.height / 2) - (ball_coord_1x1.height / 2) + 'px';
    ball_1x1.style.left = board_coord_1x1.left + (board_coord_1x1.width / 2) - (ball_coord_1x1.width / 2) + 'px';   
    ball_coord_1x1 = ball_1x1.getBoundingClientRect();
}

function resetScores_1x1() {
    score1_1x1.innerHTML = '0';
    score2_1x1.innerHTML = '0';
}

function checkScores_1x1() {
    if (parseInt(score1_1x1.innerHTML) >= 3) {
        displayWinner_1x1(name1_1x1.textContent);
        return true;
    } else if (parseInt(score2_1x1.innerHTML) >= 3) {
        displayWinner_1x1(name2_1x1.textContent);
        return true;
    }
    return false;
}

function displayWinner_1x1(winnerName) {
    gameState_1x1 = 'stop';
    winnerName_1x1.innerHTML = `${winnerName} wins!`;
    winnerMessage_1x1.style.display = 'block';
    message_1x1.style.display = 'block';
    message_1x1.innerHTML = 'Game Over! Press Enter to Play Again';
    resetBallPosition_1x1();
    resetScores_1x1();
    gameState_1x1 = 'start';
}

function moveBall_1x1(dx, dy, dxd, dyd) {
    ball_coord_1x1 = ball_1x1.getBoundingClientRect();

    if (ball_coord_1x1.top <= board_coord_1x1.top || ball_coord_1x1.bottom >= board_coord_1x1.bottom) {
        dyd = 1 - dyd; // Reverse vertical direction
    }

    if (ball_coord_1x1.left <= paddle1_coord_1x1.right && ball_coord_1x1.top >= paddle1_coord_1x1.top && ball_coord_1x1.bottom <= paddle1_coord_1x1.bottom) {
        dxd = 1; // Move ball to the right
        dx = Math.floor(Math.random() * 4) + 3;
        dy = Math.floor(Math.random() * 4) + 3;
    }

    if (ball_coord_1x1.right >= paddle2_coord_1x1.left && ball_coord_1x1.top >= paddle2_coord_1x1.top && ball_coord_1x1.bottom <= paddle2_coord_1x1.bottom) {
        dxd = 0; // Move ball to the left
        dx = Math.floor(Math.random() * 4) + 3;
        dy = Math.floor(Math.random() * 4) + 3;
    }

    if (ball_coord_1x1.left <= board_coord_1x1.left || ball_coord_1x1.right >= board_coord_1x1.right) {
        if (ball_coord_1x1.left <= board_coord_1x1.left) {
            score2_1x1.innerHTML = +score2_1x1.innerHTML + 1;
        } else {
            score1_1x1.innerHTML = +score1_1x1.innerHTML + 1;
        }
        if (checkScores_1x1()) return;
        gameState_1x1 = 'reset';
        resetBallPosition_1x1();
        setTimeout(() => {
            gameState_1x1 = 'play';
            moveBall_1x1(dx, dy, dxd, dyd);
        }, 1000);
        return;
    }

    ball_1x1.style.top = ball_coord_1x1.top + dy * (dyd === 0 ? -1 : 1) + 'px';
    ball_1x1.style.left = ball_coord_1x1.left + dx * (dxd === 0 ? -1 : 1) + 'px';

    requestAnimationFrame(() => {
        moveBall_1x1(dx, dy, dxd, dyd);
    });
}

function startGame_1x1() {   
    console.log(gameState_1x1);
    message_1x1.style.display = 'block';
    winnerMessage_1x1.style.display = 'none';
    gameState_1x1 = 'play';
    message_1x1.innerHTML = 'Game Started';
    setTimeout(() => message_1x1.innerHTML = '', 1500);

    initializeGameElements_1x1();
    updatePaddlePositions_1x1();
    resetBallPosition_1x1();
    resetScores_1x1();
    moveBall_1x1(dx, dy, dxd, dyd);
}