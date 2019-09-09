var openpayUtils = (function () {
    var PAGE_SIZE_OFFSET = 21;
    var API_HOST = 'https://openpaywebapi.myopenpay.com.au/';
    var API_BRANDS = 'Brands';
    var API_LOCATIONS = 'Locations';
    var API_SUBURBS = 'Suburbs';
    var categoryIdMap = {
        209002: 'Health & wellbeing',
        209003: 'Fashion',
        209004: 'Lifestyle',
        209007: 'Beauty',
        209008: 'Trades & services',
        209001: 'Automotive',
        209005: 'Home & garden',
        209006: 'Dental',
        209009: 'Sports & Outdoors'
    };

    var availabilityEnum = ['Online Store', 'In Store', 'Online And In Store'];

    var trackingCode = '?utm_source=openpay&utm_medium=referral&utm_campaign=search';

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

    function stringifyParams(obj) {
        return Object.keys(obj).reduce(function (acc, key) {
            var prefix = (acc === '' ? '' : '&');

            return acc + prefix + key + '=' + obj[key];
        }, '');
    }

    function modifySearchParams(patch) {
        if (!history.pushState || !Object.assign) return console.error('Update your browser');

        var currentParams = parseParams(location.search.substring(1));
        var newParams = Object.assign({}, currentParams, patch);
        var path = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + $.param(newParams);

        window.history.pushState({path: path}, '', path);
    }

    function populateFilters() {
        var currentParams = parseParams(location.search.substring(1));
        if (currentParams.View === 'Locations') {
            $('#switch-view #locations').prop('checked', true);
            $('#post-code-search-box').show();
            $('#switch-availability').hide();
        } else {
            $('#switch-view #list').prop('checked', true);
            $('#post-code-search-box').hide();
            $('#switch-availability').show();
        }
    }

    function populateControls() {
        var currentParams = parseParams(location.search.substring(1));
        if (currentParams.CategoryID) $('#category').val(currentParams.CategoryID);
        if (currentParams.Keyword) $('#query').val(currentParams.Keyword);
        if (currentParams.Postcode) $('#post-code').val(currentParams.Postcode);
        if (currentParams.RetailerAvailability) {
            switch (currentParams.RetailerAvailability) {
                case 'All':
                    $('#all').prop('checked', true);
                    break;
                case 'Online':
                    $('#online').prop('checked', true);
                    break;
                case 'InStore':
                    $('#in-store').prop('checked', true);
                    break;
                default:
                    console.error('Unrecognized retailer availability param', currentParams.RetailerAvailability);
                    break;
            }
        }
        populateFilters();
        if (currentParams.SuburbName) $('#city').val(currentParams.SuburbName);
    }

    function createBrandItem(brand) {
        var path = window.location.protocol + "//" + window.location.host + window.location.pathname.split('/').slice(0, -1).join('/');
        var url = path + '/shop-brand?BrandID=' + brand.brandID;
        var item = $('<a class="brand" href="' + url + '"></a>');
        var title = $('<h2>' + brand.brandName +'</h2>');
        var retailerAvailability = $('<p>'+ availabilityEnum[brand.retailerAvailability] + ' · ' + brand.categoryName + '</p>');

        item.append(title, retailerAvailability);

        return item;
    }

    function notEmpty(val) {
        if (typeof val === 'string') {
            return !!val.trim();
        }

        return !!val;
    }

    function escapeURL(val) {
        return decodeURI(val).replace(' ', '+').replace('&', '+');
    }

    function getAddress(retailer) {
        return [retailer.storeAddress1, retailer.storeAddress2, retailer.locationName, retailer.storePostCode]
            .filter(notEmpty)
            .join(', ');
    }

    function getDistance(retailer) {
        if (retailer.distance >= 1000) {
            return (retailer.distance / 1000).toFixed(1).toString() + 'km';
        }

        return retailer.distance.toString() + 'm';
    }

    function createRetailerLocationItem(retailer) {
        var params = parseParams(location.search.substring(1));
        var path = window.location.protocol + "//" + window.location.host + window.location.pathname.split('/').slice(0, -1).join('/');
        var url = [path, '/shop-retailer?BrandID=', retailer.brandID, '&RetailerID=', retailer.retailerLocationID].join('');
        var item = $('<a class="brand" href="' + url + '"></a>');
        var title = $('<h2>' + retailer.brandName +'</h2>');
        var locationAddress = $('<div class="location-address">' + getDistance(retailer) + ' · ' + getAddress(retailer) +'</div>');
        var category = $('<div class="location-category-name">' + retailer.categoryName +'</div>');

        item.append(title, locationAddress, category);

        return item;
    }

    function createRetailerItem(retailer) {
        var params = parseParams(location.search.substring(1));
        var path = window.location.protocol + "//" + window.location.host + window.location.pathname.split('/').slice(0, -1).join('/');
        var url = [path, '/shop-retailer?BrandID=', params.BrandID, '&RetailerID=', retailer.retailerLocationID].join('');
        var item = $('<a class="brand" href="' + url + '"></a>');
        var title = $('<h2>' + (params.BrandID == 'SkFYIFR5cmVz' ? retailer.locationName : retailer.brandName) +'</h2>');
        var retailerAvailability = $('<p>' + getDistance(retailer) + ' · ' + getAddress(retailer) +'</p>');

        item.append(title, retailerAvailability);

        return item;
    }

    function createEmptyView() {
        var empty = document.createElement('div');

        empty.className = 'empty';
        empty.innerText = 'There is no results for given search query';

        return empty;
    }

    function setDefaultPageSize() {
        modifySearchParams({PageSize: PAGE_SIZE_OFFSET});
    }

    function setNextPageSize() {
        var params = parseParams(location.search.substring(1));

        modifySearchParams({PageSize: parseInt(params.PageSize, 10) + PAGE_SIZE_OFFSET});
    }

    function getSearchResultsHeading(id) {
        var maybeHeading = categoryIdMap[id];

        if (maybeHeading) return maybeHeading;

        return 'Search results';
    }

    function enableLoader() {
        $('#promotions').hide();
        $('#categories-grid').hide();
        $('#featured').hide();
        $('#load-more').hide();
        $('#results').html('');
        $('#search-results').show();
        $('#loader').show();
    }

    function getSuburbLocation(suburbs) {
        var defaultLocation = '-37.815018,144.946014';
        if (!suburbs || !suburbs[0]) return '&Location=' + defaultLocation;

        return '&Location=' + [suburbs[0].latitude, suburbs[0].longitude].join(',');
    }

    function searchBrands(options) {
        enableLoader();
        if (options && options.loadMore) {
            setNextPageSize();
        } else {
            setDefaultPageSize();
        }

        var currentParams = parseParams(location.search.substring(1));
        delete currentParams.Postcode;

        $('#search-results-heading').text(getSearchResultsHeading(currentParams.CategoryID));

        $.ajax({
            url: API_HOST + API_BRANDS + '?' + stringifyParams(currentParams),
        }).done(function (payload) {
            $('#loader').hide();
            $('#search-results-count').text(payload.total);
            if (payload.brands.length === 0) return $('#results').html(createEmptyView());
            if (parseInt(currentParams.PageSize, 10) < payload.total) $('#load-more').show();
            $('#results').html(payload.brands.map(createBrandItem));
            window.scrollTo(0, 0);
        });
    }

    function searchRetailers(options) {
        enableLoader();
        if (options && options.loadMore) {
            setNextPageSize();
        } else {
            setDefaultPageSize();
        }

        var currentParams = parseParams(location.search.substring(1));
        $('#search-results-heading').text(getSearchResultsHeading(currentParams.CategoryID));

        function fetchRetailers(suburbs) {
            $.ajax({
                url: API_HOST + API_LOCATIONS + '?' + location.search.substring(1) + getSuburbLocation(suburbs),
            }).done(function (payload) {
                $('#loader').hide();
                $('#search-results-count').text(payload.total);
                if (payload.retailerLocations.length === 0) return $('#results').html(createEmptyView());
                if (parseInt(currentParams.PageSize, 10) < payload.total) $('#load-more').show();
                $('#results').html(payload.retailerLocations.map(createRetailerLocationItem));
                window.scrollTo(0, 0);
            });
        }

        if (!currentParams.Postcode) return fetchRetailers();

        return $.ajax({
            url: API_HOST + API_SUBURBS + '?Keyword=' + currentParams.Postcode,
        }).done(fetchRetailers);
    }

    function getRetailerAvailability() {
        if ($('#all').prop('checked')) return 'All';
        if ($('#online').prop('checked')) return 'Online';
        if ($('#in-store').prop('checked')) return 'InStore';

        return '';
    }

    function getView() {
        if ($('#switch-view #list').prop('checked')) return 'List';
        if ($('#switch-view #locations').prop('checked')) return 'Locations';

        return '';
    }

    function search(options) {
        if (getView() === 'Locations') {
            searchRetailers(options)
        } else {
            searchBrands(options);
        }
    }

    function handleChangeRetailerAvailability() {
        modifySearchParams({RetailerAvailability: getRetailerAvailability()});
        search();
    }

    function handleChangeView() {
        modifySearchParams({ View: getView() });
        populateFilters();
        search();
    }

    function getFullAdress(location) {
        return [location.storeAddress1, location.storeAddress2, location.storePostCode, location.storeState, location.storeSuburb]
            .filter(notEmpty)
            .map(escapeURL)
            .join('+');
    }

    function getMapUrl(location) {
        var base = 'https://www.google.com/maps/embed/v1/place';
        var key = 'AIzaSyDXbDVMNsMoFdQM1lK5hZqroj5rdjO5jgY';

        return [base, '?q=', getFullAdress(location), '&key=', key].join('');
    }

    function getDirectionUrl(origin, location) {
        if (!origin.coords) return '';
        var base = 'https://www.google.com/maps/dir/?api=1';
        var coords = [origin.coords.latitude, origin.coords.longitude].join(',');

        return [base, '&origin=', coords, '&destination=', getFullAdress(location)].join('');
    }

    function firstWord(test) {
        return test.replace(/ .*/,'');
    }

    function fetchBrand(cb, params) {
        return function (pos) {
            var hasLocation = !!pos.coords;
            var maybeLocation = hasLocation ? '&location=' + pos.coords.latitude + ',' + pos.coords.longitude : '';

            $.ajax({
                url: API_HOST + API_BRANDS + '/' + params.BrandID + '?pageSize=100' + maybeLocation
            }).done(function (brand) {
                $('#brand-name').text(brand.brandName);
                $('#available-count').text(brand.retailerLocations.length);
                $('#locations-count').text(brand.retailerLocations.length);
                $('#availability').text(availabilityEnum[brand.retailerAvailability]);
                $('#loader').hide();
                $('#url').attr('href', brand.url + trackingCode);
                if (!brand.url) $('#url').hide();
                $('#featured-brand').show();
                $('#search-results-heading').show();
                $.ajax({
                    url: API_HOST + API_BRANDS + '?Keyword=' + firstWord(brand.brandName) + '&PageSize=300'
                }).done(function (payload) {
                    var targetBrand = payload.brands.find(function (item) {
                        return params.BrandID.replace(/=/g, '') === item.brandID.replace(/=/g, '');
                    });

                    $('#category').text(targetBrand.categoryName);
                    $('#subcategory').text(targetBrand.subCategoryName);
                });

                if (typeof cb === 'function') return cb(brand, pos);
                if (brand.retailerLocations.length === 0) return $('#results').html(createEmptyView());
                $('#results').html(brand.retailerLocations.map(createRetailerItem));
            });
        }
    }

    function fetchCurrentBrand(cb) {
        var params = parseParams(location.search.substring(1));

        if (!params.BrandID) {
            return console.error('No brand is specified');
        }

        $('#featured-brand').hide();
        $('#search-results-heading').hide();

        navigator.geolocation.getCurrentPosition(fetchBrand(cb, params), fetchBrand(cb, params));
    }

    function fetchCurrentRetailer() {
        var params = parseParams(location.search.substring(1));

        if (!params.RetailerID) {
            return console.error('No retailer is specified');
        }

        fetchCurrentBrand(function (brand, pos) {
            var currentRetailer = brand.retailerLocations.find(function(location) {
                return location.retailerLocationID == params.RetailerID;
            });
            var restRetailers = brand.retailerLocations.filter(function(location) {
                return location.retailerLocationID != params.RetailerID;
            });

            var url = currentRetailer.url || brand.url;

            if (!currentRetailer) return console.error('Invalid retailer ID specified');
            $('#map').attr('src', getMapUrl(currentRetailer));
            $('#url').attr('href', url + trackingCode);
            if (!url) $('#url').hide();
            $('#phone').attr('href', ['tel', currentRetailer.phoneNumber].join(':'));
            $('#brand-address').text(getAddress(currentRetailer));
            $('#brand-phone').text(currentRetailer.phoneNumber);
            $('#brand-mail').text(currentRetailer.email);
            $('#direction').attr('href', getDirectionUrl(pos, currentRetailer));
            if (!currentRetailer.phoneNumber) $('#phone').hide();

            if (restRetailers.length === 0) {
                $('#search-results-heading').hide();
            } else {
                $('#results').html(restRetailers.map(createRetailerItem));
            }
        });
    }

    return {
        modifySearchParams: modifySearchParams,
        search: search,
        handleChangeRetailerAvailability: handleChangeRetailerAvailability,
        handleChangeView: handleChangeView,
        parseParams: parseParams,
        populateControls: populateControls,
        fetchCurrentBrand: fetchCurrentBrand,
        fetchCurrentRetailer: fetchCurrentRetailer
    }
})();

