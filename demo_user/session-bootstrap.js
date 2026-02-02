// Session bootstrap: on load, check if a user is logged in. If not, set current user and load profile.
// This is the only place that sets the default logged-in user; the rest of the app treats it as any user.

(function () {
    var LOGGED_IN_KEY = 'loggedInUser';

    window.getLoggedInUser = function () {
        return sessionStorage.getItem(LOGGED_IN_KEY);
    };

    window.setLoggedInUser = function (id) {
        sessionStorage.setItem(LOGGED_IN_KEY, id);
    };

    if (!window.getLoggedInUser()) {
        window.setLoggedInUser('demo_user');
    }
})();
