// Random user generator — only this file knows the potential contents (MED_LIST, TITLES, etc.).
// Updates demoUserProfile; returns a Promise that resolves when done.

(function () {
    var MED_LIST = [
        'Donepezil', 'Rivastigmine', 'Galantamine', 'Memantine', 'Namzaric', 'Aducanumab', 'Lecanemab',
        'Sertraline', 'Citalopram', 'Escitalopram', 'Mirtazapine', 'Trazodone', 'Quetiapine', 'Risperidone',
        'Olanzapine', 'Haloperidol', 'Buspirone', 'Melatonin', 'Lorazepam', 'Clonazepam', 'Zolpidem',
        'Lisinopril', 'Losartan', 'Metoprolol', 'Amlodipine', 'Atorvastatin', 'Simvastatin', 'Aspirin',
        'Clopidogrel', 'Metformin', 'Insulin glargine', 'Insulin lispro', 'Levothyroxine', 'Furosemide',
        'Hydrochlorothiazide', 'Omeprazole', 'Pantoprazole', 'Acetaminophen', 'Gabapentin', 'Oxybutynin',
        'Tamsulosin', 'Finasteride', 'Vitamin D', 'Calcium carbonate', 'Docusate', 'Senna',
        'Polyethylene glycol', 'Albuterol'
    ];
    var SCHEDULE_TIMES = ['06:00', '08:00', '12:00', '14:00', '18:00', '20:00'];
    var TITLES = ['Dr. Smith - Cardiology', 'Dr. Jones - Primary Care', 'Grocery shopping', 'Pharmacy pickup', 'Physical therapy', 'Dentist - Cleaning', 'Family visit', 'Lab work'];
    var LOCATIONS = ['123 Main St', '456 Oak Ave', '789 Medical Plaza', 'Downtown Pharmacy', 'Care Center'];
    var DRIVERS = ['Sarah', 'Mike', 'James', 'Maria', null];

    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
    function pickN(arr, n) {
        var copy = arr.slice();
        for (var i = copy.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = copy[i]; copy[i] = copy[j]; copy[j] = t;
        }
        return copy.slice(0, n);
    }
    function randomSchedule() {
        var times = SCHEDULE_TIMES.slice().sort(function () { return Math.random() - 0.5; });
        return times.slice(0, 1 + Math.floor(Math.random() * 3)).sort();
    }
    function randomDate(daysFromNow) {
        var d = new Date();
        d.setDate(d.getDate() + Math.floor(Math.random() * daysFromNow));
        d.setHours(9 + Math.floor(Math.random() * 8), Math.random() < 0.5 ? 0 : 30, 0, 0);
        return d;
    }
    function toISO(d) { return d.toISOString().slice(0, 19).replace('T', ' '); }
    function buildAppointment() {
        var start = randomDate(14);
        var end = new Date(start.getTime() + 60 * 60 * (0.5 + Math.random()));
        var driver = pick(DRIVERS);
        var leave = driver ? new Date(start.getTime() - 30 * 60 * 1000) : null;
        var pickup = driver ? new Date(start.getTime() - 15 * 60 * 1000) : null;
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

    function run() {
        var appointments = [];
        for (var i = 0; i < 3; i++) appointments.push(buildAppointment());
        demoUserProfile.calendar_events = appointments.map(function (a, i) {
            return {
                id: 'demo-' + Date.now() + '-' + i,
                user_id: demoUserProfile.user_id,
                title: a.title,
                description: null,
                start_time: a.start_time,
                end_time: a.end_time,
                location: a.location,
                driver_name: a.driver_name,
                driver_contact_id: null,
                pickup_time: a.pickup_time,
                leave_time: a.leave_time
            };
        });
        var medNames = pickN(MED_LIST, 3);
        return SearchMedicationsAPI.search(medNames).then(function (data) {
            var list = (data && data.medications) || [];
            demoUserProfile.medications = list.map(function (m) {
                return { name: m.name, schedule: randomSchedule(), fda: m.fda || {} };
            });
            if (window.saveDemoUserToSession) window.saveDemoUserToSession();
            return { eventsCount: appointments.length, medicationsCount: demoUserProfile.medications.length };
        }).catch(function () {
            return { eventsCount: appointments.length, medicationsCount: 0 };
        });
    }

    window.runRandomUserGenerator = run;
})();
