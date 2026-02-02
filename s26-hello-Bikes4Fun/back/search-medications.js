// Search medications API — pure vanilla JS (no Node). Queries openFDA drug label API.

var SearchMedicationsAPI = (function () {
    var OPENFDA_BASE = 'https://api.fda.gov/drug/label.json';

    function searchOne(name) {
        var search = 'openfda.generic_name:"' + String(name).toUpperCase().replace(/"/g, '') + '"';
        var url = OPENFDA_BASE + '?search=' + encodeURIComponent(search) + '&limit=1';
        return fetch(url).then(function (r) { return r.json(); }).then(function (data) {
            var r = data.results && data.results[0];
            if (!r) return { name: name, fda: {} };
            var openfda = r.openfda || {};
            return {
                name: name,
                fda: {
                    purpose: (r.purpose && r.purpose[0]) ? r.purpose[0].slice(0, 500) : null,
                    dosage_and_administration: (r.dosage_and_administration && r.dosage_and_administration[0]) ? r.dosage_and_administration[0].slice(0, 500) : null,
                    warnings: (r.warnings && r.warnings[0]) ? r.warnings[0].slice(0, 500) : null,
                    generic_name: (openfda.generic_name && openfda.generic_name[0]) || null,
                    brand_name: (openfda.brand_name && openfda.brand_name[0]) || null,
                    manufacturer_name: (openfda.manufacturer_name && openfda.manufacturer_name[0]) || null
                }
            };
        }).catch(function () { return { name: name, fda: {} }; });
    }

    function search(names) {
        var list = Array.isArray(names) ? names : (typeof names === 'string' ? [names] : []);
        if (list.length === 0) return Promise.resolve({ medications: [] });
        return Promise.all(list.map(searchOne)).then(function (medications) {
            return { medications: medications };
        });
    }

    return { search: search };
})();
