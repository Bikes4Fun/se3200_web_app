// General frontend JS functionality:
// NOTE: contents of app.js SHOULD NOT care or know that the user is a DEMO user EXCEPT for the button 'generate demo user'
//      EVERYTHING else should be able to be switched out for a real user at any time and work just the same.

// contents:
//      Nav: applies everywhere for consistent nav functionality and content
//      Pages:
//          render demoUserProfile: calendar_events and medications in the same grid/card format.
//              Used by User Profile (and optionally Calendar & Medications view).

// start nav component
const navLinks = [
    { href: 'index.html', label: 'Dashboard' },
    { href: 'user-profile.html', label: 'User Profile' },
    { href: 'settings.html', label: 'Settings' }
];

function initNav() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;
    const pathname = window.location.pathname || '';
    const base = pathname.indexOf('demo_user') !== -1 ? '../front/' : ''; // TODO: app.js should not care that it's 'demo_user' it only knows it's loading a user, 
    const currentPage = pathname.split('/').pop() || 'index.html';
    nav.innerHTML = `
        <a href="${base}index.html" class="logo">Dementia TV</a>
        ${navLinks.map(link =>
            `<a href="${base}${link.href}" ${link.href === currentPage ? 'class="active"' : ''}>${link.label}</a>`
        ).join('')}
    `;
    
    // Add pop animation to nav links
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            console.log('nav button was clicked');
            this.classList.add('pop');
            setTimeout(() => this.classList.remove('pop'), 1000);
        });
    });
}

// Data Service - LocalStorage wrapper (easy to swap to API later)
const DataService = {
    get(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    remove(key) {
        localStorage.removeItem(key);
    }
};

// Initialize nav on page load
initNav();


// start render user profile
(function () {
    var PHOTO_SIZE = 40;

    function escapeHtml(s) {
        var div = document.createElement('div');
        div.textContent = s;
        return div.innerHTML;
    }

    function renderEventCard(evt, photoUrl) {
        var card = document.createElement('div');
        card.className = 'card event-card';
        var img = photoUrl ? '<img src="' + photoUrl + '" alt="" class="card-photo">' : '';
        var title = evt.title || '';
        var when = (evt.start_time && evt.end_time) ? evt.start_time + ' – ' + evt.end_time : '';
        var where = evt.location || '';
        var driver = evt.driver_name ? 'Driver: ' + evt.driver_name + (evt.leave_time ? ' (leave ' + evt.leave_time + ')' : '') : 'Self';
        card.innerHTML = img + '<h2>' + escapeHtml(title) + '</h2><p><strong>When:</strong> ' + escapeHtml(when) + '</p><p><strong>Where:</strong> ' + escapeHtml(where) + '</p><p>' + escapeHtml(driver) + '</p>';
        return card;
    }

    // TODO: something somewhere needs to filter data from the medications database and only display whats most important.
    function renderMedicationCard(med, photoUrl) {
        var card = document.createElement('div');
        card.className = 'card medication-card';
        var img = photoUrl ? '<img src="' + photoUrl + '" alt="" class="card-photo">' : '';
        var fda = med.fda || {};
        var schedule = (med.schedule || []).join(', ');
        var title = med.display_name || med.name;
        var generic = fda.generic_name;
        if (generic && generic.toUpperCase().trim() !== (title || '').toUpperCase().trim()) title += ' (' + generic + ')';
        var dose = med.selected_dose ? '<p><strong>Dose:</strong> ' + escapeHtml(med.selected_dose) + '</p>' : '';
        var sideEffects = fda.adverse_reactions ? '<p class="fda-info"><strong>Side effects:</strong> ' + escapeHtml(fda.adverse_reactions.slice(0, 150).trim()) + (fda.adverse_reactions.length > 150 ? '…' : '') + '</p>' : '';
        var interactions = fda.drug_interactions ? '<p class="fda-info"><strong>Drug interactions:</strong> ' + escapeHtml(fda.drug_interactions.slice(0, 150).trim()) + (fda.drug_interactions.length > 150 ? '…' : '') + '</p>' : '';
        var warningLine = fda.warnings ? '<p class="med-warnings"><strong>Note:</strong> ' + escapeHtml(fda.warnings.slice(0, 120).trim()) + (fda.warnings.length > 120 ? '…' : '') + '</p>' : '';
        card.innerHTML = img + '<h2>' + escapeHtml(title) + '</h2><p><strong>Schedule:</strong> ' + schedule + '</p>' + dose + sideEffects + interactions + warningLine;
        return card;
    }

    function fetchPhoto() {
        return fetch('https://picsum.photos/' + PHOTO_SIZE + '/' + PHOTO_SIZE).then(function (r) { return r.blob(); }).then(function (b) { return URL.createObjectURL(b); }).catch(function () { return null; });
    }

    function renderProfileGrid(eventsEl, medsEl) {
        var profile = window.getCurrentUserProfile && window.getCurrentUserProfile();
        if (!eventsEl || !medsEl || !profile) return;
        var events = profile.calendar_events || [];
        var meds = profile.medications || [];
        eventsEl.innerHTML = '';
        medsEl.innerHTML = '';
        events.forEach(function (evt) {
            fetchPhoto().then(function (url) {
                eventsEl.appendChild(renderEventCard(evt, url));
            });
        });
        meds.forEach(function (med) {
            fetchPhoto().then(function (url) {
                medsEl.appendChild(renderMedicationCard(med, url));
            });
        });
    }

    window.ProfileDisplay = { renderProfileGrid: renderProfileGrid };


    // User-profile page: render profile, wire generate button, auto-run once if empty
    // TODO / QUESTION: How does this differ from the section above? 
    var profileEventsEl = document.getElementById('profile-events');
    if (!profileEventsEl) return;
    function renderProfile() {
        var p = window.getCurrentUserProfile && window.getCurrentUserProfile();
        if (!p) return;
        var settings = p.settings || {};
        var userEl = document.getElementById('profile-user-id');
        var settingsEl = document.getElementById('profile-settings');
        if (userEl) userEl.innerHTML = '<strong>User ID:</strong> ' + (p.user_id || '—');
        if (settingsEl) settingsEl.innerHTML = '<ul><li>High contrast: ' + (settings.highContrast ? 'On' : 'Off') + '</li><li>Large text: ' + (settings.largeText ? 'On' : 'Off') + '</li><li>Layout: ' + (settings.homeLayout || '—') + '</li></ul>';
        renderProfileGrid(document.getElementById('profile-events'), document.getElementById('profile-medications'));
    }

    var generateBtn = document.getElementById('generate-btn');
    var generateActions = document.getElementById('generate-actions');
    if (generateBtn) {
        if (window.getCurrentUserId && window.getCurrentUserId() !== 'demo_user' && generateActions) generateActions.style.display = 'none';
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
    }

    // TODO: this should be somewhere else?
    // places in 'demo user' for now to test
    // if (window.getLoggedInUser && window.getLoggedInUser() === 'demo_user' && typeof userProfile !== 'undefined' && userProfile.medications.length === 0 && userProfile.calendar_events.length === 0 && window.runRandomUserGenerator) {
    //     window.runRandomUserGenerator().then(function () {
    //         if (window.saveDemoUserToSession) window.saveDemoUserToSession();
    //         renderProfile();
    //     });
    // } else {
    //     renderProfile();
    // }
})();
