(function(module) {
    mifosX.models = _.extend(module, {
        DateFormats: [
            { "local": "dd MMMM yyyy", "moment": "L"},
            { "local": "dd/MMMM/yyyy", "moment": "L"},
            { "local": "dd-MMMM-yyyy", "moment": "L"},
            { "local": "dd-MM-yy", "moment": "L"},
            { "local": "MMMM-dd-yyyy", "moment": "L"},
            { "local": "MMMM dd yyyy", "moment": "L"},
            { "local": "MMMM/dd/yyyy", "moment": "L"},
            { "local": "MM-dd-yy", "moment": "L"},
            { "local": "MM/dd/yyyy", "moment": "L"},
            { "local": "M/d/yyyy", "moment": "L"},
            { "local": "yyyy-MM-dd", "moment": "L"}
        ]
    });
}(mifosX.models || {}));
