var PAGE_SIZE_OFFSET = 21;

function parseParams(str) {
    if (str.trim() === '') return {};

    return str.split('&').reduce(function (params, param) {
        var paramSplit = param.split('=').map(function (value) {
            return decodeURIComponent(value.replace(/\+/g, ' '));
        });
        params[paramSplit[0]] = paramSplit[1];
        return params;
    }, {});
}

function modifySearchParams(patch) {
    if (!history.pushState || !Object.assign) return console.error('Update your browser');

    var currentParams = parseParams(location.search.substring(1));
    var newParams = Object.assign({}, currentParams, patch);
    var path = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + $.param(newParams);

    window.history.pushState({ path: path }, '', path);
}

function populateControls() {
    var currentParams = parseParams(location.search.substring(1));
    if (currentParams.CategoryID) $('#category').val(currentParams.CategoryID);
    if (currentParams.Keyword) $('#query').val(currentParams.Keyword);
}

function createBrandItem(brand) {
    var availabilityEnum = ['Online', 'In Store', 'All'];

    var item = document.createElement('div');
    item.className = 'brand';

    var title = document.createElement('h2');
    title.innerText = brand.brandName;

    var retailerAvailability = document.createElement('p');
    retailerAvailability.innerText = availabilityEnum[brand.retailerAvailability];

    item.appendChild(title);
    item.appendChild(retailerAvailability);

    return item;
}

function createEmptyView() {
    var empty = document.createElement('div');

    empty.className = 'empty';
    empty.innerText = 'There is no results for given search query';

    return empty;
}

function setDefaultPageSize() {
    modifySearchParams({ PageSize: PAGE_SIZE_OFFSET });
}

function setNextPageSize() {
    var params = parseParams(location.search.substring(1));

    modifySearchParams({ PageSize: parseInt(params.PageSize, 10) + PAGE_SIZE_OFFSET });
}

function searchBrands(options) {
    var API_HOST = 'https://edf6f0c232.execute-api.ap-southeast-2.amazonaws.com/prod/';
    var API_SUBJECT = 'Brands';

    $('#promotions').hide();
    $('#categories-grid').hide();
    $('#featured').hide();
    $('#load-more').hide();
    $('#results').html('');
    $('#search-results').show();
    $('#loader').show();
    if (options && options.loadMore) {
        setNextPageSize();
    } else {
        setDefaultPageSize();
    }

    var currentParams = parseParams(location.search.substring(1));

    $.ajax({
        url: API_HOST + API_SUBJECT + '?' + location.search.substring(1)
    }).done(function (e) {
        $('#loader').hide();
        $('#search-results-count').text(e.length);
        if (e.length === 0) return $('#results').html(createEmptyView());
        if (e.length === parseInt(currentParams.PageSize, 10)) $('#load-more').show();
        $('#results').html(e.map(createBrandItem));
    });
}

function getRetailerAvailability() {
    var isOnline = $('#online').prop('checked');
    var isInStore = $('#in-store').prop('checked');

    if (isOnline && isInStore) return 'All';
    if (isOnline) return 'Online';
    if (isInStore) return 'InStore';

    return '';
}

function handleChangeRetailerAvailability() {
    modifySearchParams({ RetailerAvailability: getRetailerAvailability() });
    searchBrands();
}

$('#category').change(function (e) {
    modifySearchParams({ CategoryID: e.currentTarget.value });
    searchBrands();
});

$('#query').change(function (e) {
    modifySearchParams({ Keyword: e.currentTarget.value });
    searchBrands();
});

$('#search-btn').click(function () {
    searchBrands();
});

$('#categories-grid').click(function(e) {
    var CategoryID = $(e.target).data('value');

    if (CategoryID) {
        modifySearchParams({ CategoryID: CategoryID });
        searchBrands();
    }
});

$('#online').click(handleChangeRetailerAvailability);
$('#in-store').click(handleChangeRetailerAvailability);
$('#load-more').click(function () {
    searchBrands({ loadMore: true })
});

$(document).ready(function() {
    populateControls();
    var currentParams = parseParams(location.search.substring(1));

    var shouldSearch = Object.keys(currentParams)
        .filter(function (key) {
            return !!currentParams[key];
        })
        .length > 0;

    if (shouldSearch) {
        searchBrands();
    } else {
        $('#search-results').hide();
    }
});
