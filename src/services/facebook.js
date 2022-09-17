export const login = () =>
	new Promise(async (rs, rj) => {
		window.FB.getLoginStatus(function (response) {
			console.log('...1', response, response.authResponse);
			if (response.status === 'connected') {
				rs({ userId: response.authResponse.userID, accessToken: response.authResponse.accessToken });
			} else {
				window.FB.login(
					function (res) {
						console.log('...2', res?.authResponse);
						if (res?.authResponse?.accessToken) {
							rs({ userId: res.authResponse.userID, accessToken: res.authResponse.accessToken });
						} else {
							rj('User cancelled login');
						}
					},
					{ scope: 'email,public_profile,pages_manage_posts,publish_video' }
				);
			}
		}, true);
	});

export const isLoggedIn = () => {
	return new Promise(async (rs) => {
		window.FB.getLoginStatus(function (response) {
			rs(response.status === 'connected' ? true : false);
		});
	});
};

export const logout = async () =>
	new Promise(async (rs) => {
		const isLogged = await isLoggedIn();

		if (isLogged) {
			window.FB.logout(function (res) {
				rs(true);
			});
		}

		rs(true);
	});

export const getAccountInfo = () => {
	return new Promise((rs, rj) => {
		window.FB.api('/me/accounts', 'GET', { fields: 'picture,access_token,name,id' }, function (response) {
			console.log('getAccountInfo', response);
			rs(response);
		});
	});
};
