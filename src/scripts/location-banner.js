function showLocationBanner () {
    var $banner = document.createElement('div');
    $banner.className = 'location-banner';

    var $closeBtn = document.createElement('button');
    $closeBtn.className = 'location-banner_close';
    $closeBtn.innerHTML = '<img src="./images/close.svg" alt="close"/>';

    var $link = document.createElement('a');
    $link.href = 'https://www.myopenpay.co.uk/';
    $link.innerText = 'Take me there';

    $banner.innerHTML = `
        <img src="./images/tower-bridge.svg" alt="UK" class="location-banner_ico" />
        <div class="location-banner_text">
            <p>Looks like you might be in the UK.</p>
        </div>
    `;

    $banner.appendChild($closeBtn);
    $banner.getElementsByClassName('location-banner_text')[0].appendChild($link);

    function onClose() {
        $banner.addEventListener('animationend', function() {
            document.body.removeChild($banner);
            localStorage.setItem('openpay-au-location-checked', 'true');

            if (ga) ga('send', 'event', {
                eventCategory: 'Location Switcher',
                eventAction: 'close',
                eventLabel: 'Location switcher closed'
            });
        });

        $banner.className += ' removing';
    }

    $closeBtn.addEventListener('click', onClose);
    $link.addEventListener('click', function () {
        localStorage.setItem('openpay-au-location-checked', 'true');

        if (ga) ga('send', 'event', {
            eventCategory: 'Location Switcher',
            eventAction: 'redirect',
            eventLabel: 'Location switcher used'
        });
    });

    document.body.appendChild($banner);

    return $banner;
}

if (localStorage.getItem('openpay-au-location-checked') !== 'true') {
    $.ajax({ url: 'https://ipinfo.io/json' }).done(function (json) {
        if (json && json.country === 'UK') showLocationBanner();
    });
}
