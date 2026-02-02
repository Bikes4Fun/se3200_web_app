// Search medications API — pure vanilla JS (no Node). Queries openFDA drug label API.

var SearchMedicationsAPI = (function () {
    var OPENFDA_BASE = 'https://api.fda.gov/drug/label.json';

    function searchOne(name) {
        var search = 'openfda.generic_name:"' + String(name).toUpperCase().replace(/"/g, '') + '"';
        var url = OPENFDA_BASE + '?search=' + encodeURIComponent(search) + '&limit=10';
        return fetch(url).then(function (r) { return r.json(); }).then(function (data) {
            var results = data.results || [];
            var r = results.find(function (x) {
                var b = (x.openfda && x.openfda.brand_name && x.openfda.brand_name[0]) || '';
                var g = (x.openfda && x.openfda.generic_name && x.openfda.generic_name[0]) || '';
                return b && b.toUpperCase() !== g.toUpperCase();
            }) || results[0];
            if (!r) return { name: name, fda: {} };
            var openfda = r.openfda || {};
            var doseOpts = (r.dosage_forms_and_strengths && r.dosage_forms_and_strengths.length)
                ? r.dosage_forms_and_strengths.map(function (s) { return String(s); })
                : [];
            return {
                name: name,
                fda: {
                    purpose: (r.purpose && r.purpose[0]) ? r.purpose[0] : null,
                    dosage_and_administration: (r.dosage_and_administration && r.dosage_and_administration[0]) ? r.dosage_and_administration[0] : null,
                    warnings: (r.warnings && r.warnings[0]) ? r.warnings[0] : null,
                    adverse_reactions: (r.adverse_reactions && r.adverse_reactions[0]) ? r.adverse_reactions[0] : null,
                    drug_interactions: (r.drug_interactions && r.drug_interactions[0]) ? r.drug_interactions[0] : null,
                    generic_name: (openfda.generic_name && openfda.generic_name[0]) || null,
                    brand_name: (openfda.brand_name && openfda.brand_name[0]) || null,
                    dose_options: doseOpts
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
