(function(module) {
    mifosX.models = _.extend(module, {
        Langs: [
            { "name": "English", "code": "en", default: false },            
            { "name": "Español", "code": "es-mx", default: true },
        ]
    });
}(mifosX.models || {}));
