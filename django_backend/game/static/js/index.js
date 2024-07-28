
function showSection(sectionId) {
    // Get all sections
    const sections = document.querySelectorAll('.content-section');
    let location;

    // Hide all sections
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // Show only selected (via click on button/link) section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
        location = sectionId;
        console.log("location: ")
        console.log(location);
    }

    // Conditionally show/hide the logo and language
    const language = document.getElementById('language');
    const headerWelcome = document.getElementById('header-welcome');
    const footer = document.getElementById('footer-welcome')
    const profileNav = document.getElementById('profile-nav');
    const profileNav2 = document.getElementById('profile-nav2');
    
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


    const offHeaderGame = document.getElementById('off-header-game');
    if (sectionId === 'offline-1x1' || sectionId === 'offline-tournament' || sectionId === 'login') {
        if (offHeaderGame) offHeaderGame.style.display = 'block';
    } else {
        if (offHeaderGame) offHeaderGame.style.display = 'none';
    }
    const horNav = document.getElementById('hor-nav');
    if (sectionId === 'get-started') {
        if (horNav) horNav.style.display = 'block';
    } else {
        if (horNav) horNav.style.display = 'none';
    }
    const onHeaderGame = document.getElementById('online-header-game');
    if (sectionId === 'online-1x1' || sectionId === 'online-4' || sectionId === 'online-tournament') {
        if (onHeaderGame) onHeaderGame.style.display = 'block';
    } else {
        if (onHeaderGame) onHeaderGame.style.display = 'none';
    }
}



// Add event listener for hash change to handle browser navigation
window.addEventListener('hashchange', function() {
    console.log('JavaScript file is loaded');
    const sectionId = window.location.hash.substring(1);
    showSection(sectionId);
});


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

// On initial load, show the appropriate section
document.addEventListener('DOMContentLoaded', function() {
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

    $(document).on('click', '.signup-link', function(event) {
		hideElement(loginFormDiv);
		setElementinnerHTML(document.getElementById('id-signup').querySelector('.error-message'), "");
		showElement(signupFormDiv);

	});

    $(document).on('click', '.login-link', function(event) {
		hideElement(signupFormDiv);
		setElementinnerHTML(document.getElementById('id-login').querySelector('.error-message'), "");
		showElement(loginFormDiv);
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

    const initialSection = window.location.hash.substring(1) || 'offline-choose-mode';
    showSection(initialSection);

    // Offline Game 1x1 ================================================================================

    // Initialize offline games
    initializeOffline1x1Game();
    initializeOfflineTournament();
    console.log('We are in the game');

    //===========================================================================================================
});


// Offline 1x1 game ========================================================================================================

// Initialize Offline 1x1 Game
function initializeOffline1x1Game() {

    const section1 = document.getElementById('offline-1x1');
    if (!section1 || window.getComputedStyle(section1).display !== 'block') return;
    console.log('We are in the 1x1 game');

    let gameState = 'begin';

    let paddle_1, paddle_2, board, ball, score_1, score_2;
    let paddle_1_coord, paddle_2_coord, ball_coord, board_coord;
    let dx, dy, dxd, dyd;

    const paddleSpeed = 3;
    let paddle1Velocity = 0, paddle2Velocity = 0;

    let player1Name = 'Player 1'; // Default names
    let player2Name = 'Player 2';
    let player1 = document.getElementById('player1Name_off_1x1');
    let player2 = document.getElementById('player2Name_off_1x1');
    let player1Input;
    let player2Input;

    let message = document.getElementById('message_off_1x1');
    let winnerMessage = document.getElementById('winnerMessage_off_1x1');

    let startGameBtn = document.getElementById('startGameBtn_1x1');
    let exitOffGameBtn = document.getElementById('exitOffGameBtn_1x1');


    // Event listener for Enter key to start game
    document.addEventListener('keydown', function (e) {
        console.log("1x1 game location!");
        if (e.key === 'Enter' && gameState === 'begin')
        {
            player1Input = document.getElementById('player1NameInput_off_1x1');
            player2Input = document.getElementById('player2NameInput_off_1x1');
            if (player1Input.value === player2Input.value) {
                alert(':) Please enter different names for both players.');
            } else if (player1Input && player2Input) {
                document.getElementById('player_form_1x1').style.display = 'none';
                gameState = 'start';
                player1.textContent = player1Input.value;
                player2.textContent = player2Input.value;
                player1Name = player1Input.value;
                player2Name = player2Input.value;
            } else {
                alert('Please enter names for both players.');
            }
        }
        else if (e.key === 'Enter' && gameState === 'start') startGame();
        if (e.key === 'w') paddle1Velocity = gameState === 'play' ? -paddleSpeed : 0;
        if (e.key === 's') paddle1Velocity = gameState === 'play' ? paddleSpeed : 0;
        if (e.key === 'ArrowUp') paddle2Velocity = gameState === 'play' ? -paddleSpeed : 0;
        if (e.key === 'ArrowDown') paddle2Velocity = gameState === 'play' ? paddleSpeed : 0;
    });

    startGameBtn.addEventListener('click', function () {
        player1Input = document.getElementById('player1NameInput_off_1x1');
        player2Input = document.getElementById('player2NameInput_off_1x1');
        if (player1Input.value === player2Input.value) {
            alert(':) Please enter different names for both players.');
        } else if (player1Input.value && player2Input.value) {
            document.getElementById('player_form_1x1').style.display = 'none';
            gameState = 'start';
            player1.textContent = player1Input.value;
            player2.textContent = player2Input.value;
            player1Name = player1Input.value;
            player2Name = player2Input.value;
        } else {
            alert('Please enter names for both players.');
        }
    });


    exitOffGameBtn.addEventListener('click', function () {
        gameState = 'reset';
        initializeGameElements();
        updatePaddlePositions();
        resetBallPosition();
        resetScores();
        resetPlayers();
        // resetPaddles();
        document.getElementById('message_off_1x1').innerHTML = 'Press Enter to Play'
        document.getElementById('message_off_1x1').style.display = 'block';
        document.getElementById('winnerMessage_off_1x1').style.display = 'none';
        document.getElementById('player_form_1x1').style.display = 'block';
        document.getElementById('player1Name_off_1x1').innerHTML = 'Player 1';
        document.getElementById('player2Name_off_1x1').innerHTML = 'Player 2';
        gameState = 'begin';
        window.location.hash = 'offline-choose-mode';
    });

    // Event listener for keyup to stop paddle movement
    document.addEventListener('keyup', function (e) {
        if (e.key === 'w' || e.key === 's') paddle1Velocity = 0;
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') paddle2Velocity = 0;
    });

    function startGame() {
            message.style.display = 'block';
            winnerMessage.style.display = 'none';
            gameState = 'play';
            message.innerHTML = 'Game Started';
            setTimeout(() => message.innerHTML = '', 1500);
            initializeGameElements();
            updatePaddlePositions();
            resetBallPosition();
            resetScores();
            moveBall(dx, dy, dxd, dyd);
    }

    function initializeGameElements() {
        paddle_1 = document.getElementById('paddle1_off_1x1');
        paddle_2 = document.getElementById('paddle2_off_1x1');
        board = document.getElementById('board_off_1x1');
        ball = document.getElementById('ball_off_1x1');
        score_1 = document.getElementById('score1_off_1x1');
        score_2 = document.getElementById('score2_off_1x1');
        paddle_1_coord = paddle_1.getBoundingClientRect();
        paddle_2_coord = paddle_2.getBoundingClientRect();
        ball_coord = ball.getBoundingClientRect();
        board_coord = board.getBoundingClientRect();
        paddle_common = document.querySelector('.paddle_off').getBoundingClientRect();

        dx = Math.floor(Math.random() * 4) + 3;
        dy = Math.floor(Math.random() * 4) + 3;
        dxd = Math.floor(Math.random() * 2);
        dyd = Math.floor(Math.random() * 2);
        ball.style.top = board_coord.top + (board_coord.height / 2) - (ball_coord.height / 2) + 'px';
        ball.style.left = board_coord.left + (board_coord.width / 2) - (ball_coord.width / 2) + 'px';
    }

    function updatePaddlePositions() {
        paddle_1.style.top = Math.min(Math.max(board_coord.top, paddle_1_coord.top + paddle1Velocity), board_coord.bottom - paddle_1_coord.height) + 'px';
        paddle_2.style.top = Math.min(Math.max(board_coord.top, paddle_2_coord.top + paddle2Velocity), board_coord.bottom - paddle_2_coord.height) + 'px';

        paddle_1_coord = paddle_1.getBoundingClientRect();
        paddle_2_coord = paddle_2.getBoundingClientRect();

        requestAnimationFrame(updatePaddlePositions);
    }

    function resetBallPosition() {
        ball.style.top = board_coord.top + (board_coord.height / 2) - (ball_coord.height / 2) + 'px';
        ball.style.left = board_coord.left + (board_coord.width / 2) - (ball_coord.width / 2) + 'px';
        
        ball_coord = ball.getBoundingClientRect();
    }


    function moveBall(dx, dy, dxd, dyd) {
        ball_coord = ball.getBoundingClientRect();

        if (ball_coord.top <= board_coord.top || ball_coord.bottom >= board_coord.bottom) {
            dyd = 1 - dyd; // Reverse vertical direction
        }

        if (ball_coord.left <= paddle_1_coord.right && ball_coord.top >= paddle_1_coord.top && ball_coord.bottom <= paddle_1_coord.bottom) {
            dxd = 1; // Move ball to the right
            dx = Math.floor(Math.random() * 4) + 3;
            dy = Math.floor(Math.random() * 4) + 3;
        }

        if (ball_coord.right >= paddle_2_coord.left && ball_coord.top >= paddle_2_coord.top && ball_coord.bottom <= paddle_2_coord.bottom) {
            dxd = 0; // Move ball to the left
            dx = Math.floor(Math.random() * 4) + 3;
            dy = Math.floor(Math.random() * 4) + 3;
        }

        if (ball_coord.left <= board_coord.left || ball_coord.right >= board_coord.right) {
            if (ball_coord.left <= board_coord.left) {
                score_2.innerHTML = +score_2.innerHTML + 1;
            } else {
                score_1.innerHTML = +score_1.innerHTML + 1;
            }
            if (checkScores()) return;
            gameState = 'reset';
            resetBallPosition();
            setTimeout(() => {
                gameState = 'play';
                moveBall(dx, dy, dxd, dyd);
            }, 1000);
            return;
        }

        ball.style.top = ball_coord.top + dy * (dyd === 0 ? -1 : 1) + 'px';
        ball.style.left = ball_coord.left + dx * (dxd === 0 ? -1 : 1) + 'px';

        requestAnimationFrame(() => {
            moveBall(dx, dy, dxd, dyd);
        });
    }

    function checkScores() {
        if (parseInt(score_1.innerHTML) >= 3) {
            displayWinner(player1Name);
            return true;
        } else if (parseInt(score_2.innerHTML) >= 3) {
            displayWinner(player2Name);
            return true;
        }
        return false;
    }

    function displayWinner(winnerName) {
        gameState = 'stop';
        winnerMessage.style.display = 'block';
        document.getElementById('winnerName_off_1x1').innerHTML = `${winnerName} wins!`;
        message.style.display = 'block';
        message.innerHTML = 'Game Over! Press Enter to Play Again';
        resetBallPosition();
        resetScores();
        gameState = 'start';
    }

    function resetScores() {
        score_1.innerHTML = '0';
        score_2.innerHTML = '0';
    }

    function resetPlayers() {
        if(player1Input)
            player1Input.value = '';
        if(player2Input)
            player2Input.value = '';
    }
}




//-----------------------------------------------------------------------------------------------------------


// Initialize Offline Tournament
function initializeOfflineTournament() {
    const section2 = document.getElementById('offline-tournament');
    if (!section2 || window.getComputedStyle(section2).display !== 'block') return;

    console.log('We are in the tournament');

    let gameStateTour = 'begin';
    const paddleSpeedTour = 5;
    let paddle1VelocityTour = 0, paddle2VelocityTour = 0;
    let player1InputTour = document.getElementById('player1NameInput_4');
    let player2InputTour = document.getElementById('player2NameInput_4');
    let player3InputTour = document.getElementById('player3NameInput_4');
    let player4InputTour = document.getElementById('player4NameInput_4');
    let startTourBtn = document.getElementById('startTourBtn');
    let table_name1 = document.getElementById('table_name1_4');
    let table_name2 = document.getElementById('table_name2_4');
    let table_name3 = document.getElementById('table_name3_4');
    let table_name4 = document.getElementById('table_name4_4');
    let name1, name2;
    let winner1 = null;
    let winner2 = null;
    let winner_final = null;
    let pl1Name, pl2Name, pl3Name, pl4Name;
    
    let exitOffTourBtn = document.getElementById('exitOffTourBtn');

    exitOffTourBtn.addEventListener('click', function () {
        gameStateTour = 'reset';
        // initializeGameElements();
        // updatePaddlePositions();
        // resetBallPosition();
        // resetScores();
        // resetPlayers();
        // // resetPaddles();
        // document.getElementById('message_off_1x1').innerHTML = 'Press Enter to Play'
        // document.getElementById('message_off_1x1').style.display = 'block';
        // document.getElementById('winnerMessage_off_1x1').style.display = 'none';
        // document.getElementById('player_form_1x1').style.display = 'block';
        // document.getElementById('player1Name_off_1x1').innerHTML = 'Player 1';
        // document.getElementById('player2Name_off_1x1').innerHTML = 'Player 2';
        // gameState = 'begin';
        window.location.hash = 'offline-choose-mode';
    });

    // Event listener for start button click
    startTourBtn.addEventListener('click', startTournament);

    // Event listener for Enter key to start tournament
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && gameStateTour === 'begin') startTournament();
        if (e.key === 'w') paddle1VelocityTour = gameStateTour === 'play' ? -paddleSpeedTour : 0;
        if (e.key === 's') paddle1VelocityTour = gameStateTour === 'play' ? paddleSpeedTour : 0;
        if (e.key === 'ArrowUp') paddle2VelocityTour = gameStateTour === 'play' ? -paddleSpeedTour : 0;
        if (e.key === 'ArrowDown') paddle2VelocityTour = gameStateTour === 'play' ? paddleSpeedTour : 0;
    });

    // Event listener for keyup to stop paddle movement
    document.addEventListener('keyup', function (e) {
        if (e.key === 'w' || e.key === 's') paddle1VelocityTour = 0;
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') paddle2VelocityTour = 0;
    });

    function startTournament() {
        if (areNotUnique(player1InputTour.value, player2InputTour.value, player3InputTour.value, player4InputTour.value)) {
            alert(':) Please enter unique names for all players.');
        } else if (player1InputTour.value && player2InputTour.value && player3InputTour.value && player4InputTour.value) {
            pl1Name = player1InputTour.value;
            pl2Name = player2InputTour.value;
            pl3Name = player3InputTour.value;
            pl4Name = player4InputTour.value;
            table_name1.textContent = pl1Name;
            table_name2.textContent = pl2Name;
            table_name3.textContent = pl3Name;
            table_name4.textContent = pl4Name;
            document.getElementById('player_form_4').style.display = 'none';
            document.getElementById('tournament-table').style.display = 'block';
            document.getElementById('go-to-match').addEventListener('click', startMatch);
        } else {
            alert('Please enter unique names for all players.');
        }
    }

    function startMatch() {
        document.getElementById('tournament-table').style.display = 'none';            
        document.getElementById('tournament-game').style.display = 'block';
        document.getElementById('tour_header').style.display = 'none';
        gameStateTour = 'start';
        let player1 = document.getElementById('player1Name_4');
        let player2 = document.getElementById('player2Name_4');
        winnerMessage = document.querySelector('#winnerMessage_4');
        if (winner1 === null) {
            player1.textContent = pl1Name;
            name1 = pl1Name;
            player2.textContent = pl2Name;
            name2 = pl2Name;
            winnerMessage.querySelector('#winnerName_4').innerHTML = `${pl1Name} vs ${pl2Name}!`;
            winnerMessage.style.display = 'block';
            start_game();
        } else if (winner2 === null) {
            player1.textContent = pl3Name;
            name1 = pl3Name;
            player2.textContent = pl4Name;
            name2 = pl4Name;
            winnerMessage.querySelector('#winnerName_4').innerHTML = `${pl3Name} vs ${pl4Name}!`;
            winnerMessage.style.display = 'block';
            start_game();
        } else if (winner_final === null) {
            player1.textContent = winner1;
            name1 = winner1;
            player2.textContent = winner2;
            name2 = winner2;
            winnerMessage.querySelector('#winnerName_4').innerHTML = `${winner1} vs ${winner2}!`;
            winnerMessage.style.display = 'block';
            start_game();
        }
    }
    
    function areNotUnique(str1, str2, str3, str4) {
        return str1 === str2 || str1 === str3 || str1 === str4 ||
        str2 === str3 || str2 === str4 ||
        str3 === str4;
    }
    
    function start_game() {
        console.log('We are in the game tour');
        initializeElementsTour();
        updatePaddlePositionsTour();
        moveBallTour(dx, dy, dxd, dyd)
        document.getElementById('nextGame').style.display = 'none';
        document.getElementById('nextGame').removeEventListener('click', startTournament);
        document.getElementById('nextGame').addEventListener('click', () => {
            document.getElementById('nextGame').style.display = 'none';
            startMatch();
        });
        // document.getElementById('exitTour').addEventListener('click', () => {
        //     document.getElementById('tournament-table').style.display = 'block';
        //     document.getElementById('tournament-game').style.display = 'none';
        // });
    }
    
    function initializeElementsTour() {
        paddle_1Tour = getElementById('paddle1_off_4');
        paddle_2Tour = getElementById('paddle2_off_4');
        boardTour = getElementById('board_off_4');
        ballTour = getElementById('ball_off_4');
        score_1Tour = getElementById('score1_off_4');
        score_2Tour = getElementById('score1_off_4');
        messageTour = getElementById('message_off_4');
        paddle_1_coordTour = paddle_1.getBoundingClientRect();
        paddle_2_coordTour = paddle_2.getBoundingClientRect();
        ball_coordTour = ball.getBoundingClientRect();
        board_coordTour = board.getBoundingClientRect();
        paddle_commonTour = document.querySelector('.paddle_off').getBoundingClientRect();

        dxTour = Math.floor(Math.random() * 4) + 3;
        dyTour = Math.floor(Math.random() * 4) + 3;
        dxdTour = Math.floor(Math.random() * 2);
        dydTour = Math.floor(Math.random() * 2);

        ballTour.style.top = board_coordTour.top + (board_coordTour.height / 2) - (ball_coordTour.height / 2) + 'px';
        ballTour.style.left = board_coordTour.left + (board_coordTour.width / 2) - (ball_coordTour.width / 2) + 'px';
    }

    function resetScores() {
        score_1Tour.innerHTML = '0';
        score_2Tour.innerHTML = '0';
    }

    function endTournament(winnerNameTour) {
        document.getElementById('megaWinner').style.display = 'block';
        document.getElementById('megaWinnerName').textContent = `🏆 ${winnerNameTour} wins the Tournament! 🏆`;
        document.getElementById('exitTour').style.display = 'block';
    }

    function resetBallPosition() {
        ballTour.style.top = board_coordTour.top + (board_coordTour.height / 2) - (ball_coordTour.height / 2) + 'px';
        ballTour.style.left = board_coordTour.left + (board_coordTour.width / 2) - (ball_coordTour.width / 2) + 'px';
        
        ball_coordTour = ballTour.getBoundingClientRect();
    }

    function moveBallTour(dx, dy, dxd, dyd) {
        ball_coordTour = ballTour.getBoundingClientRect();

        if (ball_coordTour.top <= board_coordTour.top || ball_coordTour.bottom >= board_coordTour.bottom) {
            dyd = 1 - dyd; // Reverse vertical direction
        }

        if (ball_coordTour.left <= paddle_1_coordTour.right && ball_coordTour.top >= paddle_1_coordTour.top && ball_coordTour.bottom <= paddle_1_coordTour.bottom) {
            dxd = 1; // Move ball to the right
            dx = Math.floor(Math.random() * 4) + 3;
            dy = Math.floor(Math.random() * 4) + 3;
        }

        if (ball_coordTour.right >= paddle_2_coordTour.left && ball_coordTour.top >= paddle_2_coordTour.top && ball_coordTour.bottom <= paddle_2_coordTour.bottom) {
            dxd = 0; // Move ball to the left
            dx = Math.floor(Math.random() * 4) + 3;
            dy = Math.floor(Math.random() * 4) + 3;
        }

        if (ball_coordTour.left <= board_coordTour.left || ball_coordTour.right >= board_coordTour.right) {
            if (ball_coordTour.left <= board_coordTour.left) {
                score_2Tour.innerHTML = +score_2Tour.innerHTML + 1;
            } else {
                score_1Tour.innerHTML = +score_1Tour.innerHTML + 1;
            }
            if (checkScoresTour()) return;
            gameStateTour = 'stop';
            resetBallPositionTour();
            setTimeout(() => {
                gameStateTour = 'play';
                moveBallTour(dx, dy, dxd, dyd);
            }, 1000);
            return;
        }

        function checkScoresTour() {
            if (parseInt(score_1.innerHTML) >= 3) {
                if (!winner1)
                {
                    winner1 = name1;
                    gameStateTour = 'stop';
                    displayWinnerTour(name1, false);
                }
                else if (!winner2)
                {
                    winner2 = name1;
                    gameStateTour = 'stop';
                    displayWinnerTour(name1, false);
                }
                else if (!winner_final)
                {
                    winner_final = name1;
                    gameStateTour = 'end';
                    displayWinnerTour(name1, true);
                }
                return true;
            } 
            else if (parseInt(score_2.innerHTML) >= 3) {
                if (!winner1)
                {
                    winner1 = name2;
                    gameStateTour = 'stop';
                    displayWinnerTour(name2, false);
                }
                else if (!winner2)
                {
                    winner2 = name2;
                    gameStateTour = 'stop';
                    displayWinnerTour(name2, false);
                }
                else if (!winner_final)
                {
                    winner_final = name2;
                    gameStateTour = 'end';
                    displayWinnerTour(name2, true);
                }
                return true;
            }
            return false;
        }

        function displayWinnerTour(winnerName, isFinal) {
            if (isFinal === true) {
                endTournament(winnerName);
            } else {
                winnerMessage = document.querySelector('#winnerMessage_4')
                winnerMessage.style.display = 'block';
                winnerMessage.querySelector('#winnerName_4').innerHTML = `${winnerName} wins!`;
                resetScoresTour();
                resetBallPositionTour();
                document.getElementById('nextGame').style.display = 'block';
                document.getElementById('nextGame').addEventListener('click', function() {
                    document.getElementById('nextGame').style.display = 'none';
                    startMatch();
                });
            }
        }

        // if ((ball_coord.top <= board_coord.top && ball_coord.left <= board_coord.left) ||
        //     (ball_coord.top <= board_coord.top && ball_coord.right >= board_coord.right) ||
        //     (ball_coord.bottom >= board_coord.bottom && ball_coord.left <= board_coord.left) ||
        //     (ball_coord.bottom >= board_coord.bottom && ball_coord.right >= board_coord.right)) {
        //     gameStateTour = 'stop';
        //     message.innerHTML = 'Game Over! Press Enter to Play Again';
        //     return;
        // }

        ballTour.style.top = ball_coordTour.top + dy * (dyd === 0 ? -1 : 1) + 'px';
        ballTour.style.left = ball_coordTour.left + dx * (dxd === 0 ? -1 : 1) + 'px';

        requestAnimationFrame(() => {
            moveBallTour(dx, dy, dxd, dyd);
        });
    }

    function updatePaddlePositionsTour() {
        paddle_1Tour.style.top = Math.min(Math.max(board_coordTour.top, paddle_1_coordTour.top + paddle1VelocityTour), board_coordTour.bottom - paddle_1_coordTour.height) + 'px';
        paddle_2Tour.style.top = Math.min(Math.max(board_coordTour.top, paddle_2_coordTour.top + paddle2VelocityTour), board_coordTour.bottom - paddle_2_coordTour.height) + 'px';

        paddle_1_coordTour = paddle_1Tour.getBoundingClientRect();
        paddle_2_coordTour = paddle_2Tour.getBoundingClientRect();

        requestAnimationFrame(updatePaddlePositionsTour);
    }
}
    

    
    // function startMatch() {
    //     document.getElementById('tournament-table').style.display = 'none';            document.getElementById('tournament-game').style.display = 'block';
    //     document.getElementById('tour_header').style.display = 'none';
    //     gameState = 'start';
    //     let player1 = document.getElementById('player1Name');
    //     let player2 = document.getElementById('player2Name');

    //     if (winner1 === null) {
    //         player1.textContent = pl1_name;
    //         name1 = pl1_name;
    //         player2.textContent = pl2_name;
    //         name2 = pl2_name;
    //         winnerMessage.querySelector('#winnerName').innerHTML = `${pl1_name} vs ${pl2_name}!`;
    //         winnerMessage.style.display = 'block';
    //         start_game(pl1_name, pl2_name, 'winner1');
    //     } else if (winner2 === null) {
    //         player1.textContent = pl3_name;
    //         name1 = pl3_name;
    //         player2.textContent = pl4_name;
    //         name2 = pl4_name
    //         winnerMessage.querySelector('#winnerName').innerHTML = `${pl3_name} vs ${pl4_name}!`;
    //         winnerMessage.style.display = 'block';
    //         start_game(pl3_name, pl4_name, 'winner2');
    //     } else if (winner_final === null) {
    //         player1.textContent = winner1;
    //         name1 = winner1;
    //         player2.textContent = winner2;
    //         name2 = winner2;
    //         winnerMessage.querySelector('#winnerName').innerHTML = `${winner1} vs ${winner2}!`;
    //         winnerMessage.style.display = 'block';
    //         start_game(winner1, winner2, 'winner_final');
    //     }
    // }
    
    // function areNotUnique(str1, str2, str3, str4) {
    //     return str1 === str2 || str1 === str3 || str1 === str4 ||
    //     str2 === str3 || str2 === str4 ||
    //     str3 === str4;
    // }
    
    // function start_game(player1Name, player2Name, winnerKey) {
    //     initializeElements();
    //     updatePaddlePositions();

    //     document.getElementById('nextGame').style.display = 'none';
    //     document.getElementById('nextGame').removeEventListener('click', startTournament);
    //     document.getElementById('nextGame').addEventListener('click', () => {
    //         document.getElementById('nextGame').style.display = 'none';
    //         startMatch();
    //     });
    //     // document.getElementById('exitTour').addEventListener('click', () => {
    //     //     document.getElementById('tournament-table').style.display = 'block';
    //     //     document.getElementById('tournament-game').style.display = 'none';
    //     // });
    // }
    
    // function initializeElements() {
    //     paddle_1 = document.querySelector('.paddle_1_off');
    //     paddle_2 = document.querySelector('.paddle_2_off');
    //     board = document.querySelector('.board');
    //     ball = document.querySelector('.ball');
    //     score_1 = document.querySelector('.player_1_score');
    //     score_2 = document.querySelector('.player_2_score');
    //     message = document.querySelector('.message');
    //     paddle_1_coord = paddle_1.getBoundingClientRect();
    //     paddle_2_coord = paddle_2.getBoundingClientRect();
    //     ball_coord = ball.getBoundingClientRect();
    //     board_coord = board.getBoundingClientRect();
    //     paddle_common = document.querySelector('.paddle_off').getBoundingClientRect();
    
    //     dx = Math.floor(Math.random() * 4) + 3;
    //     dy = Math.floor(Math.random() * 4) + 3;
    //        dxd = Math.floor(Math.random() * 2);
    //     dyd = Math.floor(Math.random() * 2);
    
    //     ball.style.top = board_coord.top + (board_coord.height / 2) - (ball_coord.height / 2) + 'px';
    //     ball.style.left = board_coord.left + (board_coord.width / 2) - (ball_coord.width / 2) + 'px';
    // }
    
    // function resetScores() {
    //     score_1.innerHTML = '0';
    //     score_2.innerHTML = '0';
    // }
    
    
    // function checkScores() {
    //     if (parseInt(score_1.innerHTML) >= 3) {
    //         if (!winner1)
    //         {
    //             winner1 = name1;
    //             gameState = 'stop';
    //             displayWinner(name1, false);
    //         }
    //         else if (!winner2)
    //         {
    //             winner2 = name1;
    //             gameState = 'stop';
    //             displayWinner(name1, false);
    //         }
    //         else if (!winner_final)
    //         {
    //             winner_final = name1;
    //             gameState = 'end';
    //             displayWinner(name1, true);
    //         }
    //         return true;
    //     } else if (parseInt(score_2.innerHTML) >= 3) {
    //         if (!winner1)
    //         {
    //             winner1 = name2;
    //             gameState = 'stop';
    //             displayWinner(name2, false);
    //         }
    //         else if (!winner2)
    //         {
    //             winner2 = name2;
    //             gameState = 'stop';
    //             displayWinner(name2, false);
    //         }
    //         else if (!winner_final)
    //         {
    //             winner_final = name2;
    //             gameState = 'end';
    //             displayWinner(name2, true);
    //         }
    //         return true;
    //     }
    //     return false;
    // }
    // function endTournament(winnerName) {
    //     document.getElementById('megaWinner').style.display = 'block';
    //     document.getElementById('megaWinnerName').textContent = `🏆 ${winnerName} wins the Tournament! 🏆`;
    //     document.getElementById('exitTour').style.display = 'block';
    // }
    
    // function displayWinner(winnerName, isFinal) {
    //     if (isFinal === true) {
    //         endTournament(winnerName);
    //     } else {
    //         winnerMessage.style.display = 'block';
    //         winnerMessage.querySelector('#winnerName').innerHTML = `${winnerName} wins!`;
    //         resetScores();
    //         resetBallPosition();
    //         document.getElementById('nextGame').style.display = 'block';
    //         document.getElementById('nextGame').addEventListener('click', function() {
    //             document.getElementById('nextGame').style.display = 'none';
    //             startMatch();
    //         });
    //     }
    // }
    
    // function resetBallPosition() {
    //     ball.style.top = board_coord.top + (board_coord.height / 2) - (ball_coord.height / 2) + 'px';
    //     ball.style.left = board_coord.left + (board_coord.width / 2) - (ball_coord.width / 2) + 'px';
            
    //     ball_coord = ball.getBoundingClientRect();
    // }
    
    // function moveBall(dx, dy, dxd, dyd) {
    //     ball_coord = ball.getBoundingClientRect();
    
    //     if (ball_coord.top <= board_coord.top || ball_coord.bottom >= board_coord.bottom) {
    //         dyd = 1 - dyd; // Reverse vertical direction
    //     }
    
    //     if (ball_coord.left <= paddle_1_coord.right && ball_coord.top >= paddle_1_coord.top && ball_coord.bottom <= paddle_1_coord.bottom) {
    //         dxd = 1; // Move ball to the right
    //         dx = Math.floor(Math.random() * 4) + 3;
    //         dy = Math.floor(Math.random() * 4) + 3;
    //     }
    
    //     if (ball_coord.right >= paddle_2_coord.left && ball_coord.top >= paddle_2_coord.top && ball_coord.bottom <= paddle_2_coord.bottom) {
    //         dxd = 0; // Move ball to the left
    //         dx = Math.floor(Math.random() * 4) + 3;
    //         dy = Math.floor(Math.random() * 4) + 3;
    //     }
    
    //     if (ball_coord.left <= board_coord.left || ball_coord.right >= board_coord.right) {
    //         if (ball_coord.left <= board_coord.left) {
    //             score_2.innerHTML = +score_2.innerHTML + 1;
    //         } else {
    //             score_1.innerHTML = +score_1.innerHTML + 1;
    //         }
    //         if (checkScores()) return;
    //         gameState = 'stop';
    //         resetBallPosition();
    //         setTimeout(() => {
    //             gameState = 'play';
    //             moveBall(dx, dy, dxd, dyd);
    //         }, 1000);
    //         return;
    //     }
    
    //     if ((ball_coord.top <= board_coord.top && ball_coord.left <= board_coord.left) ||
    //         (ball_coord.top <= board_coord.top && ball_coord.right >= board_coord.right) ||
    //         (ball_coord.bottom >= board_coord.bottom && ball_coord.left <= board_coord.left) ||
    //         (ball_coord.bottom >= board_coord.bottom && ball_coord.right >= board_coord.right)) {
    //         gameState = 'stop';
    //         message.innerHTML = 'Game Over! Press Enter to Play Again';
    //         return;
    //     }
    
    //     ball.style.top = ball_coord.top + dy * (dyd === 0 ? -1 : 1) + 'px';
    //     ball.style.left = ball_coord.left + dx * (dxd === 0 ? -1 : 1) + 'px';
    
    //     requestAnimationFrame(() => {
    //         moveBall(dx, dy, dxd, dyd);
    //     });
    // }
    
    // function updatePaddlePositions() {
    //     paddle_1.style.top = Math.min(Math.max(board_coord.top, paddle_1_coord.top + paddle1Velocity), board_coord.bottom - paddle_1_coord.height) + 'px';
    //     paddle_2.style.top = Math.min(Math.max(board_coord.top, paddle_2_coord.top + paddle2Velocity), board_coord.bottom - paddle_2_coord.height) + 'px';
    
    //     paddle_1_coord = paddle_1.getBoundingClientRect();
    //     paddle_2_coord = paddle_2.getBoundingClientRect();
    
    //     requestAnimationFrame(updatePaddlePositions);
    // }
    



//---------------------------------------------------------------------------------
// document.addEventListener('DOMContentLoaded', function () {
//     // On initial load, show the appropriate section
//     const initialSection = window.location.hash.substring(1) || 'offline-choose-mode';
//     showSection(initialSection);

//     const section1 = document.getElementById('offline-1x1');
//     const section2 = document.getElementById('offline-tournament');
    
//     if (section1 && window.getComputedStyle(section1).display === 'block') {
//         let gameState = 'start';
//         let paddle_1, paddle_2, board, ball, score_1, score_2;
//         let paddle_1_coord, paddle_2_coord, ball_coord, board_coord, paddle_common;
//         let dx, dy, dxd, dyd;
//         let player1Name = 'Player 1'; // Default names
//         let player2Name = 'Player 2';
//         const player1 = document.getElementById('player1Name');
//         const player2 = document.getElementById('player2Name');
//         let paddle1Velocity = 0, paddle2Velocity = 0;
//         const paddleSpeed = 2;
//         let message = document.getElementById('offline-message');
        

//         // Input fields and start button
//         let player1Input = document.getElementById('player1NameInput');
//         let player2Input = document.getElementById('player2NameInput');
//         let startGameBtn = document.getElementById('startGameBtn');

//         // Event listener for start button click
//         startGameBtn.addEventListener('click', function() {
//             message.style.display = 'block';
//             if (player1Input.value === player2Input.value) {
//                 alert('Please enter different names for both players.');
//             }
//             else if (player1Input.value && player2Input.value) {
//                 player1.textContent = player1Input.value;
//                 player1Name = player1Input.value;
//                 player2.textContent = player2Input.value;
//                 player2Name = player2Input.value;
//                 // Hide the name form
//                 document.getElementById('player_form').style.display = 'none';
//                 startGame();

//             } else {
//                 alert('Please enter names for both players.');
//             }
//         });

//         document.addEventListener('keydown', function(e) {
//             if (e.key === 'Enter') {
//                 if (player1Input.value === player2Input.value) {
//                     alert('Please enter different names for both players.');
//                 }
//                 else if (player1Input.value && player2Input.value) {
//                     player1.textContent = player1Input.value;
//                     player1Name = player1Input.value;
//                     player2.textContent = player2Input.value;
//                     player2Name = player2Input.value;
//                     // Hide the name form
//                     document.getElementById('player_form').style.display = 'none';
//                     startGame();

//                 } else {
//                     alert('Please enter names for both players.');
//                 }
//             }
//         });

//         function startGame() {

//             // Game initialization logic
//             initializeElements();
//             updatePaddlePositions();

//             // Listen for Enter key to start the game
//             document.addEventListener('keydown', function(e) {
//                 if (e.key === 'Enter') {
//                     if (gameState === 'stop') {
//                         // Hide winner message and reset game state
//                         winnerMessage.style.display = 'none';
//                         gameState = 'start';
//                         resetScores();
//                     }
//                     if (gameState === 'start') {
//                         if (player1Input.value === player2Input.value) {
//                             alert('Please enter different names for both players.');
//                         }
//                         else if (player1Input.value && player2Input.value) {
//                             player1.textContent = player1Input.value;
//                             player1Name = player1Input.value;
//                             player2.textContent = player2Input.value;
//                             player2Name = player2Input.value;
//                             gameState = 'play';
//                             message.innerHTML = 'Game Started';
//                             setTimeout(() => {
//                                 message.innerHTML = '';
//                             }, 1500);
//                             resetBallPosition();
//                             requestAnimationFrame(() => {
//                                 dx = Math.floor(Math.random() * 4) + 3;
//                                 dy = Math.floor(Math.random() * 4) + 3;
//                                 dxd = Math.floor(Math.random() * 2);
//                                 dyd = Math.floor(Math.random() * 2);
//                                 moveBall(dx, dy, dxd, dyd);
//                             });
//                             document.getElementById('player_form').style.display = 'none';
//                             //nameForm.style.display = 'none';
//                             // winnerMessage.style.display = 'none';
//                         } else {
//                             alert('Please enter names for both players.');
//                         }
//                     }
//                 }
//                 if (e.key === 'w') {
//                     if (gameState === 'play') {
//                         paddle1Velocity = -paddleSpeed;
//                     }
//                 }
//                 if (e.key === 's') {
//                     if (gameState === 'play') {
//                         paddle1Velocity = paddleSpeed;
//                     }
//                 }
//                 if (e.key === 'ArrowUp') {
//                     if (gameState === 'play') {
//                         paddle2Velocity = -paddleSpeed;
//                     }
//                 }
//                 if (e.key === 'ArrowDown') {
//                     if (gameState === 'play') {
//                         paddle2Velocity = paddleSpeed;
//                     }
//                 }
//             });
        
//             document.addEventListener('keyup', function(e) {
//                 if (e.key === 'w' || e.key === 's') {
//                     paddle1Velocity = 0;
//                 }
//                 if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
//                     paddle2Velocity = 0;
//                 }
//             });
//         }

//         function initializeElements() {
//             paddle_1 = document.querySelector('.paddle_1_off');
//             paddle_2 = document.querySelector('.paddle_2_off');
//             board = document.querySelector('.board');
//             ball = document.querySelector('.ball');
//             score_1 = document.querySelector('.player_1_score');
//             score_2 = document.querySelector('.player_2_score');
//             // message = document.querySelector('.message');
//             paddle_1_coord = paddle_1.getBoundingClientRect();
//             paddle_2_coord = paddle_2.getBoundingClientRect();
//             ball_coord = ball.getBoundingClientRect();
//             board_coord = board.getBoundingClientRect();
//             paddle_common = document.querySelector('.paddle_off').getBoundingClientRect();

//             dx = Math.floor(Math.random() * 4) + 3;
//             dy = Math.floor(Math.random() * 4) + 3;
//             dxd = Math.floor(Math.random() * 2);
//             dyd = Math.floor(Math.random() * 2);
//             ball.style.top = board_coord.top + (board_coord.height / 2) - (ball_coord.height / 2) + 'px';
//             ball.style.left = board_coord.left + (board_coord.width / 2) - (ball_coord.width / 2) + 'px';
//         }

//         function resetScores() {
//             score_1.innerHTML = '0';
//             score_2.innerHTML = '0';
//         }

//         function checkScores() {
//             if (parseInt(score_1.innerHTML) >= 3) {
//                 displayWinner(player1Name);
//                 return true;
//             } else if (parseInt(score_2.innerHTML) >= 3) {
//                 displayWinner(player2Name);
//                 return true;
//             }
//             return false;
//         }

//         function displayWinner(winnerName) {
//             gameState = 'stop';
//             message.style.display = 'block';
//             message.innerHTML = 'Game Over! Press Enter to Play Again';
//             winnerMessage.style.display = 'block';
//             winnerMessage.getElementById('winnerName').innerHTML = `${winnerName} wins!`;
//             gameState = 'start';
//             resetScores();
//             resetBallPosition();
//         }

//         function resetBallPosition() {
//             ball.style.top = board_coord.top + (board_coord.height / 2) - (ball_coord.height / 2) + 'px';
//             ball.style.left = board_coord.left + (board_coord.width / 2) - (ball_coord.width / 2) + 'px';
            
//             ball_coord = ball.getBoundingClientRect();
//         }

//         function moveBall(dx, dy, dxd, dyd) {
//             ball_coord = ball.getBoundingClientRect();

//             if (ball_coord.top <= board_coord.top || ball_coord.bottom >= board_coord.bottom) {
//                 dyd = 1 - dyd; // Reverse vertical direction
//             }

//             if (ball_coord.left <= paddle_1_coord.right && ball_coord.top >= paddle_1_coord.top && ball_coord.bottom <= paddle_1_coord.bottom) {
//                 dxd = 1; // Move ball to the right
//                 dx = Math.floor(Math.random() * 4) + 3;
//                 dy = Math.floor(Math.random() * 4) + 3;
//             }

//             if (ball_coord.right >= paddle_2_coord.left && ball_coord.top >= paddle_2_coord.top && ball_coord.bottom <= paddle_2_coord.bottom) {
//                 dxd = 0; // Move ball to the left
//                 dx = Math.floor(Math.random() * 4) + 3;
//                 dy = Math.floor(Math.random() * 4) + 3;
//             }

//             if (ball_coord.left <= board_coord.left || ball_coord.right >= board_coord.right) {
//                 if (ball_coord.left <= board_coord.left) {
//                     score_2.innerHTML = +score_2.innerHTML + 1;
//                 } else {
//                     score_1.innerHTML = +score_1.innerHTML + 1;
//                 }
//                 if (checkScores()) return;
//                 gameState = 'reset';
//                 resetBallPosition();
//                 setTimeout(() => {
//                     gameState = 'play';
//                     moveBall(dx, dy, dxd, dyd);
//                 }, 1000);
//                 return;
//             }

//             if ((ball_coord.top <= board_coord.top && ball_coord.left <= board_coord.left) ||
//                 (ball_coord.top <= board_coord.top && ball_coord.right >= board_coord.right) ||
//                 (ball_coord.bottom >= board_coord.bottom && ball_coord.left <= board_coord.left) ||
//                 (ball_coord.bottom >= board_coord.bottom && ball_coord.right >= board_coord.right)) {
//                 gameState = 'stop';
//                 message.innerHTML = 'Game Over! Press Enter to Play Again';
//                 return;
//             }

//             ball.style.top = ball_coord.top + dy * (dyd === 0 ? -1 : 1) + 'px';
//             ball.style.left = ball_coord.left + dx * (dxd === 0 ? -1 : 1) + 'px';

//             requestAnimationFrame(() => {
//                 moveBall(dx, dy, dxd, dyd);
//             });
//         }

//         function updatePaddlePositions() {
//             paddle_1.style.top = Math.min(Math.max(board_coord.top, paddle_1_coord.top + paddle1Velocity), board_coord.bottom - paddle_1_coord.height) + 'px';
//             paddle_2.style.top = Math.min(Math.max(board_coord.top, paddle_2_coord.top + paddle2Velocity), board_coord.bottom - paddle_2_coord.height) + 'px';

//             paddle_1_coord = paddle_1.getBoundingClientRect();
//             paddle_2_coord = paddle_2.getBoundingClientRect();

//             requestAnimationFrame(updatePaddlePositions);
//         }

//         initializeElements();
//         updatePaddlePositions();
//         updatePlayerNames();
//     }
    
//     else if (section2 && window.getComputedStyle(section2).display === 'block'){
//         let gameState = 'begin';
//         let name1, name2;
//         let pl1_name = 'Player 1';
//         let pl2_name = 'Player 2';
//         let pl3_name = 'Player 3';
//         let pl4_name = 'Player 4';
//         let table_name1 = document.getElementById('table_name1');
//         let table_name2 = document.getElementById('table_name2');
//         let table_name3 = document.getElementById('table_name3');
//         let table_name4 = document.getElementById('table_name4');
//         let paddle_1, paddle_2, board, ball, score_1, score_2, message;
//         let paddle_1_coord, paddle_2_coord, ball_coord, board_coord, paddle_common;
//         let dx, dy, dxd, dyd;
//         let winner1 = null;
//         let winner2 = null;
//         let winner_final = null;
    
//         let paddle1Velocity = 0, paddle2Velocity = 0;
//         const paddleSpeed = 5;
    
//         let pl1_input = document.getElementById('player1NameInput');
//         let pl2_input = document.getElementById('player2NameInput');
//         let pl3_input = document.getElementById('player3NameInput');
//         let pl4_input = document.getElementById('player4NameInput');
//         let startGameBtn = document.getElementById('startGameBtn');
    
//         // Event listener for start button click
//         startGameBtn.addEventListener('click', function() {
//             startTournament();
//         });
    
//         document.addEventListener('keydown', function(e) {
//             if (e.key === 'Enter' && gameState === 'begin') 
//             {
//                     startTournament();
//             } 
//             else if (gameState === 'start')
//             {
//                     if (gameState === 'start') {
//                         gameState = 'play';
//                         message.innerHTML = 'Game Started';
//                         resetBallPosition();
//                         requestAnimationFrame(() => {
//                             dx = Math.floor(Math.random() * 4) + 3;
//                             dy = Math.floor(Math.random() * 4) + 3;
//                             dxd = Math.floor(Math.random() * 2);
//                             dyd = Math.floor(Math.random() * 2);
//                             moveBall(dx, dy, dxd, dyd);
//                         });
//                         winnerMessage.style.display = 'none';
//                         setTimeout(() => {
//                             message.innerHTML = '';
//                         }, 1000);
//                     }
//             }
//             if (e.key === 'w') {
//                 if (gameState === 'play') {
//                     paddle1Velocity = -paddleSpeed;
//                 }
//             }
//             if (e.key === 's') {
//                 if (gameState === 'play') {
//                     paddle1Velocity = paddleSpeed;
//                 }
//             }
//             if (e.key === 'ArrowUp') {
//                 if (gameState === 'play') {
//                     paddle2Velocity = -paddleSpeed;
//                 }
//             }
//             if (e.key === 'ArrowDown') {
//                 if (gameState === 'play') {
//                     paddle2Velocity = paddleSpeed;
//                 }
//             }
//         });
    
//         document.addEventListener('keyup', function(e) {
//             if (e.key === 'w' || e.key === 's') {
//                 paddle1Velocity = 0;
//             }
//             if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
//                 paddle2Velocity = 0;
//             }
//         });
    
//         function startTournament() {
//             if (areNotUnique(pl1_input.value, pl2_input.value, pl3_input.value, pl4_input.value)) {
//                 alert('Please enter unique names for all players.');
//             }
//             else if (pl1_input.value && pl2_input.value && pl3_input.value && pl4_input.value) {
//                 pl1_name = pl1_input.value;
//                 pl2_name = pl2_input.value;
//                 pl3_name = pl3_input.value;
//                 pl4_name = pl4_input.value;
//                 table_name1.textContent = pl1_name;
//                 table_name2.textContent = pl2_name;
//                 table_name3.textContent = pl3_name;
//                 table_name4.textContent = pl4_name;
//                 // Hide / show :
//                 document.getElementById('player_form').style.display = 'none';
//                 document.getElementById('tournament-table').style.display = 'block';
//                 document.getElementById('go-to-match').addEventListener('click', startMatch);
//             } else {
//                 alert('Please enter unique names for all players.');
//             }
//         }
    
//         function startMatch() {
//             document.getElementById('tournament-table').style.display = 'none';
//             document.getElementById('tournament-game').style.display = 'block';
//             document.getElementById('tour_header').style.display = 'none';
//             gameState = 'start';
//             let player1 = document.getElementById('player1Name');
//             let player2 = document.getElementById('player2Name');
    
//             if (winner1 === null) {
//                 player1.textContent = pl1_name;
//                 name1 = pl1_name;
//                 player2.textContent = pl2_name;
//                 name2 = pl2_name;
//                 winnerMessage.querySelector('#winnerName').innerHTML = `${pl1_name} vs ${pl2_name}!`;
//                 winnerMessage.style.display = 'block';
//                 start_game(pl1_name, pl2_name, 'winner1');
//             } else if (winner2 === null) {
//                 player1.textContent = pl3_name;
//                 name1 = pl3_name;
//                 player2.textContent = pl4_name;
//                 name2 = pl4_name
//                 winnerMessage.querySelector('#winnerName').innerHTML = `${pl3_name} vs ${pl4_name}!`;
//                 winnerMessage.style.display = 'block';
//                 start_game(pl3_name, pl4_name, 'winner2');
//             } else if (winner_final === null) {
//                 player1.textContent = winner1;
//                 name1 = winner1;
//                 player2.textContent = winner2;
//                 name2 = winner2;
//                 winnerMessage.querySelector('#winnerName').innerHTML = `${winner1} vs ${winner2}!`;
//                 winnerMessage.style.display = 'block';
//                 start_game(winner1, winner2, 'winner_final');
//             }
//         }
    
//         function areNotUnique(str1, str2, str3, str4) {
//             return str1 === str2 || str1 === str3 || str1 === str4 ||
//             str2 === str3 || str2 === str4 ||
//             str3 === str4;
//         }
    
//         function start_game(player1Name, player2Name, winnerKey) {
//             initializeElements();
//             updatePaddlePositions();
    
//             document.getElementById('nextGame').style.display = 'none';
//             document.getElementById('nextGame').removeEventListener('click', startTournament);
//             document.getElementById('nextGame').addEventListener('click', () => {
//                 document.getElementById('nextGame').style.display = 'none';
//                 startMatch();
//             });
//             // document.getElementById('exitTour').addEventListener('click', () => {
//             //     document.getElementById('tournament-table').style.display = 'block';
//             //     document.getElementById('tournament-game').style.display = 'none';
//             // });
//         }
    
//         function initializeElements() {
//             paddle_1 = document.querySelector('.paddle_1_off');
//             paddle_2 = document.querySelector('.paddle_2_off');
//             board = document.querySelector('.board');
//             ball = document.querySelector('.ball');
//             score_1 = document.querySelector('.player_1_score');
//             score_2 = document.querySelector('.player_2_score');
//             message = document.querySelector('.message');
//             paddle_1_coord = paddle_1.getBoundingClientRect();
//             paddle_2_coord = paddle_2.getBoundingClientRect();
//             ball_coord = ball.getBoundingClientRect();
//             board_coord = board.getBoundingClientRect();
//             paddle_common = document.querySelector('.paddle_off').getBoundingClientRect();
    
//             dx = Math.floor(Math.random() * 4) + 3;
//             dy = Math.floor(Math.random() * 4) + 3;
//             dxd = Math.floor(Math.random() * 2);
//             dyd = Math.floor(Math.random() * 2);
    
//             ball.style.top = board_coord.top + (board_coord.height / 2) - (ball_coord.height / 2) + 'px';
//             ball.style.left = board_coord.left + (board_coord.width / 2) - (ball_coord.width / 2) + 'px';
//         }
    
//         function resetScores() {
//             score_1.innerHTML = '0';
//             score_2.innerHTML = '0';
//         }
    
    
//         function checkScores() {
//             if (parseInt(score_1.innerHTML) >= 3) {
//                 if (!winner1)
//                 {
//                     winner1 = name1;
//                     gameState = 'stop';
//                     displayWinner(name1, false);
//                 }
//                 else if (!winner2)
//                 {
//                     winner2 = name1;
//                     gameState = 'stop';
//                     displayWinner(name1, false);
//                 }
//                 else if (!winner_final)
//                 {
//                     winner_final = name1;
//                     gameState = 'end';
//                     displayWinner(name1, true);
//                 }
//                 return true;
//             } else if (parseInt(score_2.innerHTML) >= 3) {
//                 if (!winner1)
//                 {
//                     winner1 = name2;
//                     gameState = 'stop';
//                     displayWinner(name2, false);
//                 }
//                 else if (!winner2)
//                 {
//                     winner2 = name2;
//                     gameState = 'stop';
//                     displayWinner(name2, false);
//                 }
//                 else if (!winner_final)
//                 {
//                     winner_final = name2;
//                     gameState = 'end';
//                     displayWinner(name2, true);
//                 }
//                 return true;
//             }
//             return false;
//         }
//         function endTournament(winnerName) {
//             document.getElementById('megaWinner').style.display = 'block';
//             document.getElementById('megaWinnerName').textContent = `🏆 ${winnerName} wins the Tournament! 🏆`;
//             document.getElementById('exitTour').style.display = 'block';
//         }
    
//         function displayWinner(winnerName, isFinal) {
//             if (isFinal === true) {
//                 endTournament(winnerName);
//             } else {
//                 winnerMessage.style.display = 'block';
//                 winnerMessage.querySelector('#winnerName').innerHTML = `${winnerName} wins!`;
//                 resetScores();
//                 resetBallPosition();
//                 document.getElementById('nextGame').style.display = 'block';
//                 document.getElementById('nextGame').addEventListener('click', function() {
//                     document.getElementById('nextGame').style.display = 'none';
//                     startMatch();
//                 });
//             }
//         }
    
//         function resetBallPosition() {
//             ball.style.top = board_coord.top + (board_coord.height / 2) - (ball_coord.height / 2) + 'px';
//             ball.style.left = board_coord.left + (board_coord.width / 2) - (ball_coord.width / 2) + 'px';
            
//             ball_coord = ball.getBoundingClientRect();
//         }
    
//         function moveBall(dx, dy, dxd, dyd) {
//             ball_coord = ball.getBoundingClientRect();
    
//             if (ball_coord.top <= board_coord.top || ball_coord.bottom >= board_coord.bottom) {
//                 dyd = 1 - dyd; // Reverse vertical direction
//             }
    
//             if (ball_coord.left <= paddle_1_coord.right && ball_coord.top >= paddle_1_coord.top && ball_coord.bottom <= paddle_1_coord.bottom) {
//                 dxd = 1; // Move ball to the right
//                 dx = Math.floor(Math.random() * 4) + 3;
//                 dy = Math.floor(Math.random() * 4) + 3;
//             }
    
//             if (ball_coord.right >= paddle_2_coord.left && ball_coord.top >= paddle_2_coord.top && ball_coord.bottom <= paddle_2_coord.bottom) {
//                 dxd = 0; // Move ball to the left
//                 dx = Math.floor(Math.random() * 4) + 3;
//                 dy = Math.floor(Math.random() * 4) + 3;
//             }
    
//             if (ball_coord.left <= board_coord.left || ball_coord.right >= board_coord.right) {
//                 if (ball_coord.left <= board_coord.left) {
//                     score_2.innerHTML = +score_2.innerHTML + 1;
//                 } else {
//                     score_1.innerHTML = +score_1.innerHTML + 1;
//                 }
//                 if (checkScores()) return;
//                 gameState = 'stop';
//                 resetBallPosition();
//                 setTimeout(() => {
//                     gameState = 'play';
//                     moveBall(dx, dy, dxd, dyd);
//                 }, 1000);
//                 return;
//             }
    
//             if ((ball_coord.top <= board_coord.top && ball_coord.left <= board_coord.left) ||
//                 (ball_coord.top <= board_coord.top && ball_coord.right >= board_coord.right) ||
//                 (ball_coord.bottom >= board_coord.bottom && ball_coord.left <= board_coord.left) ||
//                 (ball_coord.bottom >= board_coord.bottom && ball_coord.right >= board_coord.right)) {
//                 gameState = 'stop';
//                 message.innerHTML = 'Game Over! Press Enter to Play Again';
//                 return;
//             }
    
//             ball.style.top = ball_coord.top + dy * (dyd === 0 ? -1 : 1) + 'px';
//             ball.style.left = ball_coord.left + dx * (dxd === 0 ? -1 : 1) + 'px';
    
//             requestAnimationFrame(() => {
//                 moveBall(dx, dy, dxd, dyd);
//             });
//         }
    
//         function updatePaddlePositions() {
//             paddle_1.style.top = Math.min(Math.max(board_coord.top, paddle_1_coord.top + paddle1Velocity), board_coord.bottom - paddle_1_coord.height) + 'px';
//             paddle_2.style.top = Math.min(Math.max(board_coord.top, paddle_2_coord.top + paddle2Velocity), board_coord.bottom - paddle_2_coord.height) + 'px';
    
//             paddle_1_coord = paddle_1.getBoundingClientRect();
//             paddle_2_coord = paddle_2.getBoundingClientRect();
    
//             requestAnimationFrame(updatePaddlePositions);
//         }
    
//         // initializeElements();
//         // updatePaddlePositions();
//         // updatePlayerNames();
//     }
// });
