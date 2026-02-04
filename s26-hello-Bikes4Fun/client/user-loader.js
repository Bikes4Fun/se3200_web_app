// Single point where the current user is identified and their profile is loaded.
// Replace this file (or its body) with real auth/API when moving off demo — no other code changes needed.

(function () {
    var LOGGED_IN_KEY = 'loggedInUser';

    window.getCurrentUserId = function () {
        return sessionStorage.getItem(LOGGED_IN_KEY);
    };
    window.setCurrentUserId = function (id) {
        sessionStorage.setItem(LOGGED_IN_KEY, id);
    };
    window.getCurrentUserProfile = function () {
        return window.userProfile || null;
    };

    // Demo: if no user in session, set demo user and load their profile from sessionStorage.
    if (!window.getCurrentUserId()) {
        window.setCurrentUserId('demo_user');
    }
    if (window.getCurrentUserId() === 'demo_user' && typeof window.loadDemoUserFromSession === 'function') {
        window.loadDemoUserFromSession();
    }
})();
