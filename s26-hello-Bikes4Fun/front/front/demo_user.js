// Demo user profile — same structure as senior project (user + calendar_events + medications + settings).
// In-memory; updates when generator runs or settings are saved.

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

var demoUserProfile = {
    user_id: 'demo_user',
    medications: [],
    calendar_events: [],
    settings: Object.assign({}, defaultSettings)
};

