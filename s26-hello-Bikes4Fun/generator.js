// Project 2: Random Generator

(function () {
    const TITLES = ['Dr. Smith - Cardiology', 'Dr. Jones - Primary Care', 'Grocery shopping', 'Pharmacy pickup', 'Physical therapy', 'Dentist - Cleaning', 'Family visit', 'Lab work'];
    const LOCATIONS = ['123 Main St', '456 Oak Ave', '789 Medical Plaza', 'Downtown Pharmacy', 'Care Center'];
    const DRIVERS = ['Sarah', 'Mike', 'James', 'Maria', null];
    const MED_NAMES = ['Lisinopril', 'Metformin', 'Donepezil', 'Memantine', 'Vitamin D3', 'Aspirin', 'Omeprazole', 'Atorvastatin'];
    const DOSAGES = ['5 mg', '10 mg', '25 mg', '50 mg', '81 mg', '500 mg', '1000 mg', 'once daily'];
    const SCHEDULE_TIMES = ['06:00', '08:00', '12:00', '14:00', '18:00', '20:00'];

    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
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

    function buildMedication() {
        const times = SCHEDULE_TIMES.slice().sort(function () { return Math.random() - 0.5; }).slice(0, 1 + Math.floor(Math.random() * 3));
        return { name: pick(MED_NAMES), dosage: pick(DOSAGES), schedule: times.sort() };
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
        card.innerHTML = `
            ${img}
            <h2>${med.name}</h2>
            <p><strong>Dosage:</strong> ${med.dosage}</p>
            <p><strong>Schedule:</strong> ${med.schedule.join(', ')}</p>
        `;
        return card;
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
        const m = 2 + Math.floor(Math.random() * 4);
        output.innerHTML = '';
        medOutput.innerHTML = '';
        medHeading.textContent = '';
        countEl.textContent = 'Loading…';
        countEl.classList.remove('muted');
        btn.disabled = true;

        lastData = Array.from({ length: n }, buildAppointment);
        lastMedData = Array.from({ length: m }, buildMedication);
        const apptImgPromises = lastData.map(function () {
            return fetch('https://picsum.photos/80/80').then(function (r) { return r.blob(); }).then(function (b) { return URL.createObjectURL(b); }).catch(function () { return null; });
        });
        const medImgPromises = lastMedData.map(function () {
            return fetch('https://picsum.photos/80/80').then(function (r) { return r.blob(); }).then(function (b) { return URL.createObjectURL(b); }).catch(function () { return null; });
        });

        Promise.all([].concat(apptImgPromises, medImgPromises)).then(function (urls) {
            lastData.forEach(function (appt, i) { output.appendChild(renderCard(appt, urls[i])); });
            lastMedData.forEach(function (med, i) { medOutput.appendChild(renderMedCard(med, urls[n + i])); });
            medHeading.textContent = 'Medications';
            countEl.textContent = lastData.length + ' appointment(s), ' + lastMedData.length + ' medication(s) generated.';
            countEl.classList.add('muted');
            btn.disabled = false;
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
