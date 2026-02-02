// User profile page: display user profile (same grid/card display as old generator) and "Generate random user" button.

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

    document.getElementById('generate-btn').addEventListener('click', function () {
        var statusEl = document.getElementById('profile-status');
        var btn = document.getElementById('generate-btn');
        if (statusEl) statusEl.textContent = 'Generating…';
        if (btn) btn.disabled = true;
        window.runRandomUserGenerator().then(function (result) {
            renderProfile();
            if (statusEl) statusEl.textContent = 'Profile updated with ' + (result.eventsCount || 0) + ' appointment(s) and ' + (result.medicationsCount || 0) + ' medication(s).';
            if (btn) btn.disabled = false;
        }).catch(function () {
            renderProfile();
            if (statusEl) statusEl.textContent = 'Update failed. Try again.';
            if (btn) btn.disabled = false;
        });
    });

    renderProfile();
})();
