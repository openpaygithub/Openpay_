$('#category').change(function (e) {
    openpayUtils.modifySearchParams({CategoryID: e.currentTarget.value});
    openpayUtils.search();
});

$('#city').change(function (e) {
    openpayUtils.modifySearchParams({SuburbName: e.currentTarget.value});
    openpayUtils.search();
});

$('#query').change(function (e) {
    openpayUtils.modifySearchParams({Keyword: e.currentTarget.value});
    openpayUtils.search();
});

$('#post-code').change(function (e) {
    openpayUtils.modifySearchParams({Postcode: e.currentTarget.value});
    openpayUtils.search();
});

$('#search-btn, #post-code-update-btn').click(function () {
    openpayUtils.search();
});

$('#categories-grid').on('click', '.marketToProvide', function (e) {
    var CategoryID = $(e.currentTarget).data('value');

    if (CategoryID) {
        openpayUtils.modifySearchParams({CategoryID: CategoryID});
        openpayUtils.search();
        $("#category").val(CategoryID);
    }
});
$('#all').click(openpayUtils.handleChangeRetailerAvailability);
$('#online').click(openpayUtils.handleChangeRetailerAvailability);
$('#in-store').click(openpayUtils.handleChangeRetailerAvailability);
$('#switch-view #list').click(openpayUtils.handleChangeView);
$('#switch-view #locations').click(openpayUtils.handleChangeView);
$('#load-more').click(function () {
    openpayUtils.search({loadMore: true})
});

$(document).ready(function () {
    openpayUtils.populateControls();
    var currentParams = openpayUtils.parseParams(location.search.substring(1));

    var shouldSearch = Object.keys(currentParams)
        .filter(function (key) {
            return !!currentParams[key];
        })
        .length > 0;

    if (shouldSearch) {
        openpayUtils.search();
    } else {
        $('#search-results').hide();
    }

    $('.french-retailer').click(function () {
        if ('sendEvent' in window) window.sendEvent({
            eventCategory: 'Outbound Links',
            eventAction: 'Featured retailer',
            eventLabel: 'French connection',
    });
    });

    $('.edge-retailer').click(function () {
        if ('sendEvent' in window) window.sendEvent({
            eventCategory: 'Outbound Links',
            eventAction: 'Featured retailer',
            eventLabel: 'Edge',
        });
    });

    $('.esther-retailer').click(function () {
        if ('sendEvent' in window) window.sendEvent({
            eventCategory: 'Outbound Links',
            eventAction: 'Featured retailer',
            eventLabel: 'Esther',
        });
    });
});
