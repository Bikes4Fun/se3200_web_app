// User profile page: display current user profile (grid/card display). No demo/random logic here.

(function () {
    function renderProfile() {
        if (typeof demoUserProfile === 'undefined') return;
        var p = demoUserProfile;
        var settings = p.settings || {};
        var userEl = document.getElementById('profile-user-id');
        var settingsEl = document.getElementById('profile-settings');
        if (userEl) userEl.innerHTML = '<strong>User ID:</strong> ' + (p.user_id || '—');
        if (settingsEl) {
            settingsEl.innerHTML = '<ul><li>High contrast: ' + (settings.highContrast ? 'On' : 'Off') + '</li><li>Large text: ' + (settings.largeText ? 'On' : 'Off') + '</li><li>Layout: ' + (settings.homeLayout || '—') + '</li></ul>';
        }
        if (window.ProfileDisplay && window.ProfileDisplay.renderProfileGrid) {
            window.ProfileDisplay.renderProfileGrid(
                document.getElementById('profile-events'),
                document.getElementById('profile-medications')
            );
        }
    }

    var generateActions = document.getElementById('generate-actions');
    var generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
        if (window.getLoggedInUser && window.getLoggedInUser() === 'demo_user') {
            generateBtn.addEventListener('click', function () {
                var statusEl = document.getElementById('profile-status');
                if (statusEl) statusEl.textContent = 'Generating…';
                generateBtn.disabled = true;
                window.runRandomUserGenerator().then(function (result) {
                    renderProfile();
                    if (statusEl) statusEl.textContent = 'Profile updated with ' + (result.eventsCount || 0) + ' appointment(s) and ' + (result.medicationsCount || 0) + ' medication(s).';
                    generateBtn.disabled = false;
                }).catch(function () {
                    renderProfile();
                    if (statusEl) statusEl.textContent = 'Update failed. Try again.';
                    generateBtn.disabled = false;
                });
            });
        } else if (generateActions) {
            generateActions.style.display = 'none';
        }
    }

    if (window.getLoggedInUser && window.getLoggedInUser() === 'demo_user' && typeof demoUserProfile !== 'undefined' && demoUserProfile.medications.length === 0 && demoUserProfile.calendar_events.length === 0 && window.runRandomUserGenerator) {
        window.runRandomUserGenerator().then(function () {
            if (window.saveDemoUserToSession) window.saveDemoUserToSession();
            renderProfile();
        });
    } else {
        renderProfile();
    }
})();
