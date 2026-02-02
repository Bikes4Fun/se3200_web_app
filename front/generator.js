// Project 2: Random Generator

const MED_LIST = [
    'Donepezil', 'Rivastigmine', 'Galantamine', 'Memantine', 'Namzaric', 'Aducanumab', 'Lecanemab',
    'Sertraline', 'Citalopram', 'Escitalopram', 'Mirtazapine', 'Trazodone', 'Quetiapine', 'Risperidone',
    'Olanzapine', 'Haloperidol', 'Buspirone', 'Melatonin', 'Lorazepam', 'Clonazepam', 'Zolpidem',
    'Lisinopril', 'Losartan', 'Metoprolol', 'Amlodipine', 'Atorvastatin', 'Simvastatin', 'Aspirin',
    'Clopidogrel', 'Metformin', 'Insulin glargine', 'Insulin lispro', 'Levothyroxine', 'Furosemide',
    'Hydrochlorothiazide', 'Omeprazole', 'Pantoprazole', 'Acetaminophen', 'Gabapentin', 'Oxybutynin',
    'Tamsulosin', 'Finasteride', 'Vitamin D', 'Calcium carbonate', 'Docusate', 'Senna',
    'Polyethylene glycol', 'Albuterol'
];

const SCHEDULE_TIMES = ['06:00', '08:00', '12:00', '14:00', '18:00', '20:00'];

(function () {
    const TITLES = ['Dr. Smith - Cardiology', 'Dr. Jones - Primary Care', 'Grocery shopping', 'Pharmacy pickup', 'Physical therapy', 'Dentist - Cleaning', 'Family visit', 'Lab work'];
    const LOCATIONS = ['123 Main St', '456 Oak Ave', '789 Medical Plaza', 'Downtown Pharmacy', 'Care Center'];
    const DRIVERS = ['Sarah', 'Mike', 'James', 'Maria', null];

    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
    function pickN(arr, n) {
        const copy = arr.slice();
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy.slice(0, n);
    }
    function randomSchedule() {
        const times = SCHEDULE_TIMES.slice().sort(function () { return Math.random() - 0.5; });
        return times.slice(0, 1 + Math.floor(Math.random() * 3)).sort();
    }
    function randomInRange(min, max) { return min + Math.random() * (max - min); }

    function randomDate(daysFromNow) {
        const d = new Date();
        d.setDate(d.getDate() + Math.floor(Math.random() * daysFromNow));
        d.setHours(9 + Math.floor(Math.random() * 8), Math.random() < 0.5 ? 0 : 30, 0, 0);
        return d;
    }

    function toISO(d) { return d.toISOString().slice(0, 19).replace('T', ' '); }

    function buildAppointment() {
        const start = randomDate(14);
        const end = new Date(start.getTime() + 60 * 60 * (0.5 + Math.random()));
        const driver = pick(DRIVERS);
        const leave = driver ? new Date(start.getTime() - 30 * 60 * 1000) : null;
        const pickup = driver ? new Date(start.getTime() - 15 * 60 * 1000) : null;
        return {
            title: pick(TITLES),
            start_time: toISO(start),
            end_time: toISO(end),
            location: pick(LOCATIONS),
            driver_name: driver,
            pickup_time: pickup ? toISO(pickup) : null,
            leave_time: leave ? toISO(leave) : null
        };
    }


    function renderCard(appt, photoUrl) {
        const card = document.createElement('div');
        card.className = 'card generator-card';
        const img = photoUrl ? `<img src="${photoUrl}" alt="" class="generator-photo">` : '';
        card.innerHTML = `
            ${img}
            <h2>${appt.title}</h2>
            <p><strong>When:</strong> ${appt.start_time} – ${appt.end_time}</p>
            <p><strong>Where:</strong> ${appt.location}</p>
            ${appt.driver_name ? `<p><strong>Driver:</strong> ${appt.driver_name} (leave ${appt.leave_time})</p>` : '<p>Self</p>'}
        `;
        return card;
    }

    function renderMedCard(med, photoUrl) {
        const card = document.createElement('div');
        card.className = 'card generator-card';
        const img = photoUrl ? `<img src="${photoUrl}" alt="" class="generator-photo">` : '';
        const fda = med.fda || {};
        const purpose = fda.purpose ? '<p class="generator-fda"><strong>Uses:</strong> ' + escapeHtml(fda.purpose.slice(0, 300)) + (fda.purpose.length > 300 ? '…' : '') + '</p>' : '';
        const dosage = fda.dosage_and_administration ? '<p class="generator-fda"><strong>Dosage:</strong> ' + escapeHtml(fda.dosage_and_administration.slice(0, 300)) + (fda.dosage_and_administration.length > 300 ? '…' : '') + '</p>' : '';
        const warnings = fda.warnings ? '<p class="generator-fda generator-warnings"><strong>Warnings:</strong> ' + escapeHtml(fda.warnings.slice(0, 200)) + (fda.warnings.length > 200 ? '…' : '') + '</p>' : '';
        card.innerHTML = `
            ${img}
            <h2>${escapeHtml(med.name)}</h2>
            <p><strong>Schedule:</strong> ${(med.schedule || []).join(', ')}</p>
            ${fda.generic_name ? '<p><strong>Generic:</strong> ' + escapeHtml(fda.generic_name) + '</p>' : ''}
            ${purpose}${dosage}${warnings}
        `;
        return card;
    }
    function escapeHtml(s) {
        const div = document.createElement('div');
        div.textContent = s;
        return div.innerHTML;
    }

    let lastData = [];
    let lastMedData = [];

    document.getElementById('generate-btn').onclick = function () {
        const output = document.getElementById('output');
        const medOutput = document.getElementById('med-output');
        const medHeading = document.getElementById('med-heading');
        const countEl = document.getElementById('card-count');
        const btn = document.getElementById('generate-btn');
        const n = 3 + Math.floor(Math.random() * 5);
        output.innerHTML = '';
        medOutput.innerHTML = '';
        medHeading.textContent = '';
        countEl.textContent = 'Loading…';
        countEl.classList.remove('muted');
        btn.disabled = true;

        lastData = Array.from({ length: n }, buildAppointment);
        const apptImgPromises = lastData.map(function () {
            return fetch('https://picsum.photos/80/80').then(function (r) { return r.blob(); }).then(function (b) { return URL.createObjectURL(b); }).catch(function () { return null; });
        });

        // As a user: pick meds, search via API, add to profile
        const medNames = pickN(MED_LIST, 3 + Math.floor(Math.random() * 5));
        SearchMedicationsAPI.search(medNames).then(function (data) {
            const searchResults = (data && data.medications) || [];
            const toAdd = searchResults.map(function (m) {
                return { name: m.name, schedule: randomSchedule(), fda: m.fda || {} };
            });
            lastMedData = toAdd;
            const medImgPromises = lastMedData.map(function () {
                return fetch('https://picsum.photos/80/80').then(function (r) { return r.blob(); }).then(function (b) { return URL.createObjectURL(b); }).catch(function () { return null; });
            });
            return Promise.all([].concat(apptImgPromises, medImgPromises)).then(function (urls) {
                lastData.forEach(function (appt, i) { output.appendChild(renderCard(appt, urls[i])); });
                lastMedData.forEach(function (med, i) { medOutput.appendChild(renderMedCard(med, urls[n + i])); });
                medHeading.textContent = 'Medications';
                countEl.textContent = lastData.length + ' appointment(s), ' + lastMedData.length + ' medication(s) in profile.';
                countEl.classList.add('muted');
                btn.disabled = false;
            });
        }).catch(function () {
            countEl.textContent = 'Appointments generated. Medications unavailable (check network / openFDA).';
            countEl.classList.add('muted');
            btn.disabled = false;
            Promise.all(apptImgPromises).then(function (urls) {
                lastData.forEach(function (appt, i) { output.appendChild(renderCard(appt, urls[i])); });
            });
        });
    };

    document.getElementById('export-btn').onclick = function () {
        if (lastData.length === 0 && lastMedData.length === 0) return;
        const payload = { appointments: lastData, medications: lastMedData };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'demo-data.json';
        a.click();
        URL.revokeObjectURL(a.href);
    };
})();
