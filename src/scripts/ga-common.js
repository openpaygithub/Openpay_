var $ios = document.getElementsByClassName('ios-app-download');
var $android = document.getElementsByClassName('android-app-download');
var $merchant = document.getElementsByClassName('merchant-login-link');

[].forEach.call($ios, function (el) {
    el.addEventListener('click', function () {
        if ('sendEvent' in window) window.sendEvent({
            eventCategory: 'Outbound Links',
            eventAction: 'Click',
            eventLabel: 'iOS Footer'
        });
    });
});

[].forEach.call($android, function (el) {
    el.addEventListener('click', function () {
        if ('sendEvent' in window) window.sendEvent({
            eventCategory: 'Outbound Links',
            eventAction: 'Click',
            eventLabel: 'Android Footer'
        });
    })
});

[].forEach.call($merchant, function (el) {
    el.addEventListener('click', function () {
        if ('sendEvent' in window) window.sendEvent({
            eventCategory: 'Outbound Links',
            eventAction: 'Click',
            eventLabel: 'Merchant Login'
        });
    })
});
