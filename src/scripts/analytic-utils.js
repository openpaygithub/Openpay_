window.sendEvent = function (event) {
    var evt = event || {};

    if ('ga' in window) {
        ga(function() {
            var tracker = ga.create('UA-84225706-1', 'auto');

            if (tracker) tracker.send('event', evt.eventCategory, evt.eventAction, evt.eventLabel);
        });
    }
};
