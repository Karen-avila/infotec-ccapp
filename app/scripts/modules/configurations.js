angular.module('configurations', [])
    .constant('API_VERSION', '/fineract-provider/api/v1')
    .constant('IDLE_DURATION', 30 * 60)
    .constant('WARN_DURATION', 10)
    .constant('KEEPALIVE_INTERVAL', 15 * 60)
    .constant('SECURITY', 'basicauth')
// Use SECURITY constant as 'basicauth' to enable Basic on community app
// Use SECURITY constant as 'oauth' to enable Oauth2 on community app
// Use SECURITY constant as 'jwtauth' to use JWT tokens community app
    .constant('MULTILANGUAGE', false)
;