// Demo user profile — same structure as senior project (user + calendar_events + medications + settings).
// In-memory; persists in sessionStorage for the current tab so it survives navigation.

var defaultSettings = {
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    homeLayout: 'horizontal',
    clockProportion: 0.5,
    clockBg: '#1e3a5f',
    medBg: '#2d4a3e',
    eventsBg: '#4a3a2d'
};

var SESSION_KEY = 'demoUserProfile';

var userProfile = {
    user_id: 'demo_user',
    medications: [],
    calendar_events: [],
    settings: Object.assign({}, defaultSettings)
};

function loadDemoUserFromSession() {
    try {
        var raw = sessionStorage.getItem(SESSION_KEY);
        if (raw) {
            var data = JSON.parse(raw);
            if (Array.isArray(data.medications)) userProfile.medications = data.medications;
            if (Array.isArray(data.calendar_events)) userProfile.calendar_events = data.calendar_events;
            if (data.settings && typeof data.settings === 'object') userProfile.settings = Object.assign({}, defaultSettings, data.settings);
        }
    } catch (e) {}
}

function saveDemoUserToSession() {
    try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({
            medications: userProfile.medications,
            calendar_events: userProfile.calendar_events,
            settings: userProfile.settings
        }));
    } catch (e) {}
}

loadDemoUserFromSession();
window.saveDemoUserToSession = saveDemoUserToSession;

// Session: default logged-in user (rest of app treats it as any user)
(function () {
    var LOGGED_IN_KEY = 'loggedInUser';
    window.getLoggedInUser = function () { return sessionStorage.getItem(LOGGED_IN_KEY); };
    window.setLoggedInUser = function (id) { sessionStorage.setItem(LOGGED_IN_KEY, id); };
    if (!window.getLoggedInUser()) window.setLoggedInUser('demo_user');
})();

if (window.getLoggedInUser && window.getLoggedInUser() === 'demo_user' && typeof userProfile !== 'undefined' && userProfile.medications.length === 0 && userProfile.calendar_events.length === 0 && window.runRandomUserGenerator) {
    window.runRandomUserGenerator().then(function () {
        if (window.saveDemoUserToSession) window.saveDemoUserToSession();
        renderProfile();
    });
} else {
    renderProfile();
}