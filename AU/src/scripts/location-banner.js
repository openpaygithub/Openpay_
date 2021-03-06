function showLocationBanner () {
    if ('sendEvent' in window) window.sendEvent({
        eventCategory: 'Location Switcher',
        eventAction: 'show',
        eventLabel: 'Location switcher showed'
    });

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

            if ('sendEvent' in window) window.sendEvent({
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

        if ('sendEvent' in window) window.sendEvent({
            eventCategory: 'Location Switcher',
            eventAction: 'redirect',
            eventLabel: 'Location switcher used'
        });
    });

    document.body.appendChild($banner);

    return $banner;
}

if (localStorage && localStorage.getItem('openpay-au-location-checked') !== 'true') {
    $.ajax({ url: 'https://ip2c.org/s' }).done(function(res) {
        if (res && res.split(';')[1] === 'GB') showLocationBanner();
    });
}
