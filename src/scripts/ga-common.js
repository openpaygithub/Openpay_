var $ios = document.getElementsByClassName('ios-app-download');
var $android = document.getElementsByClassName('android-app-download');
var $merchant = document.getElementsByClassName('merchant-login-link');

[].forEach.call($ios, function (el) {
    el.addEventListener('click', function () {
        if ('sendEvent' in window) window.sendEvent({
            eventCategory: 'iOS App',
            eventAction: 'Download',
            eventLabel: 'iOS App download link footer'
        });
    });
});

[].forEach.call($android, function (el) {
    el.addEventListener('click', function () {
        if ('sendEvent' in window) window.sendEvent({
            eventCategory: 'Android App',
            eventAction: 'Download',
            eventLabel: 'Android App download link footer'
        });
    })
});

[].forEach.call($merchant, function (el) {
    el.addEventListener('click', function () {
        if ('sendEvent' in window) window.sendEvent({
            eventCategory: 'Merchant',
            eventAction: 'Login',
            eventLabel: 'Merchant login clicked header'
        });
    })
});
