// Settings page logic

const defaultSettings = {
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    homeLayout: 'horizontal',
    clockProportion: 0.5,
    clockBg: '#1e3a5f',
    medBg: '#2d4a3e',
    eventsBg: '#4a3a2d'
};

// Load settings on page load
function loadSettings() {
    const saved = DataService.get('displaySettings') || defaultSettings;
    
    document.getElementById('high-contrast').checked = saved.highContrast;
    document.getElementById('large-text').checked = saved.largeText;
    document.getElementById('reduced-motion').checked = saved.reducedMotion;
    document.getElementById('home-layout').value = saved.homeLayout;
    document.getElementById('clock-proportion').value = saved.clockProportion;
    document.getElementById('clock-bg').value = saved.clockBg;
    document.getElementById('med-bg').value = saved.medBg;
    document.getElementById('events-bg').value = saved.eventsBg;
    
    updateProportionLabel();
}

// Get current form values
function getFormValues() {
    return {
        highContrast: document.getElementById('high-contrast').checked,
        largeText: document.getElementById('large-text').checked,
        reducedMotion: document.getElementById('reduced-motion').checked,
        homeLayout: document.getElementById('home-layout').value,
        clockProportion: parseFloat(document.getElementById('clock-proportion').value),
        clockBg: document.getElementById('clock-bg').value,
        medBg: document.getElementById('med-bg').value,
        eventsBg: document.getElementById('events-bg').value
    };
}

// Save settings
function saveSettings() {
    const settings = getFormValues();
    DataService.set('displaySettings', settings);
    alert('Settings saved!');
    console.log('Settings saved:', settings);
}

// Reset to defaults
function resetSettings() {
    if (confirm('Reset all settings to defaults?')) {
        DataService.set('displaySettings', defaultSettings);
        loadSettings();
    }
}

// Update proportion label
function updateProportionLabel() {
    const value = document.getElementById('clock-proportion').value;
    document.getElementById('clock-proportion-value').textContent = Math.round(value * 100) + '%';
}

// Event listeners
document.getElementById('save-btn').addEventListener('click', saveSettings);
document.getElementById('reset-btn').addEventListener('click', resetSettings);
document.getElementById('clock-proportion').addEventListener('input', updateProportionLabel);

// Load on page ready
loadSettings();
