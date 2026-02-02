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

var demoUserProfile = {
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
            if (Array.isArray(data.medications)) demoUserProfile.medications = data.medications;
            if (Array.isArray(data.calendar_events)) demoUserProfile.calendar_events = data.calendar_events;
            if (data.settings && typeof data.settings === 'object') demoUserProfile.settings = Object.assign({}, defaultSettings, data.settings);
        }
    } catch (e) {}
}

function saveDemoUserToSession() {
    try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({
            medications: demoUserProfile.medications,
            calendar_events: demoUserProfile.calendar_events,
            settings: demoUserProfile.settings
        }));
    } catch (e) {}
}

loadDemoUserFromSession();
window.saveDemoUserToSession = saveDemoUserToSession;

