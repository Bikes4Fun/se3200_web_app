// Shared: render demoUserProfile calendar_events and medications in the same grid/card format.
// Used by User Profile (and optionally Calendar & Medications view).

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

    function renderMedicationCard(med, photoUrl) {
        var card = document.createElement('div');
        card.className = 'card medication-card';
        var img = photoUrl ? '<img src="' + photoUrl + '" alt="" class="card-photo">' : '';
        var fda = med.fda || {};
        var purpose = fda.purpose ? '<p class="fda-info"><strong>Uses:</strong> ' + escapeHtml(fda.purpose.slice(0, 200)) + (fda.purpose.length > 200 ? '…' : '') + '</p>' : '';
        var dosage = fda.dosage_and_administration ? '<p class="fda-info"><strong>Dosage:</strong> ' + escapeHtml(fda.dosage_and_administration.slice(0, 200)) + (fda.dosage_and_administration.length > 200 ? '…' : '') + '</p>' : '';
        var warnings = fda.warnings ? '<p class="fda-info med-warnings"><strong>Warnings:</strong> ' + escapeHtml(fda.warnings.slice(0, 150)) + (fda.warnings.length > 150 ? '…' : '') + '</p>' : '';
        card.innerHTML = img + '<h2>' + escapeHtml(med.name) + '</h2><p><strong>Schedule:</strong> ' + (med.schedule || []).join(', ') + '</p>' + (fda.generic_name ? '<p><strong>Generic:</strong> ' + escapeHtml(fda.generic_name) + '</p>' : '') + purpose + dosage + warnings;
        return card;
    }

    function fetchPhoto() {
        return fetch('https://picsum.photos/' + PHOTO_SIZE + '/' + PHOTO_SIZE).then(function (r) { return r.blob(); }).then(function (b) { return URL.createObjectURL(b); }).catch(function () { return null; });
    }

    function renderProfileGrid(eventsEl, medsEl) {
        if (!eventsEl || !medsEl || typeof demoUserProfile === 'undefined') return;
        var events = demoUserProfile.calendar_events || [];
        var meds = demoUserProfile.medications || [];
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
})();
