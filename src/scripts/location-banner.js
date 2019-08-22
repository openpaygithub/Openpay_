function sendEvent(event) {
    var evt = event || {};
    if ('ga' in window) {
        tracker = ga.getAll()[0];
        if (tracker) tracker.send('event', evt.eventCategory, evt.eventAction, evt.eventLabel);
    }
}

function showLocationBanner () {
    var $banner = document.createElement('div');
    $banner.className = 'location-banner';

    var $closeBtn = document.createElement('button');
    $closeBtn.className = 'location-banner_close';
    $closeBtn.innerHTML = '<img src="./images/close.svg" alt="close"/>';

    var $link = document.createElement('a');
    $link.href = 'https://www.myopenpay.co.uk/';
    $link.innerText = 'Visit Openpay UK';

    $banner.innerHTML = '<img src="./images/tower-bridge.svg" alt="UK" class="location-banner_ico" />' +
        '<div class="location-banner_text">' +
            '<p>Hi! Looks like you\'re in the UK.</p>' +
        '</div>';

    $banner.appendChild($closeBtn);
    $banner.getElementsByClassName('location-banner_text')[0].appendChild($link);

    function onClose() {
        $banner.addEventListener('animationend', function() {
            document.body.removeChild($banner);
            if (localStorage) localStorage.setItem('openpay-au-location-checked', 'true');

            sendEvent({
                eventCategory: 'Location Switcher',
                eventAction: 'close',
                eventLabel: 'Location switcher closed'
            });
        });

        $banner.className += ' removing';
    }

    $closeBtn.addEventListener('click', onClose);
    $link.addEventListener('click', function () {
        if (localStorage) localStorage.setItem('openpay-au-location-checked', 'true');

        sendEvent({
            eventCategory: 'Location Switcher',
            eventAction: 'redirect',
            eventLabel: 'Location switcher used'
        });
    });

    document.body.appendChild($banner);

    return $banner;
}

if (localStorage && localStorage.getItem('openpay-au-location-checked') !== 'true') {
    $.ajax({ url: 'https://ipinfo.io/json?token=a2cf39fba6a7e3' }).done(function (json) {
        if (json && json.country === 'GB') showLocationBanner();
    });
}
