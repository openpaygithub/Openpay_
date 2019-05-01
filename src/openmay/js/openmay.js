/**
 * @fileoverview scripts for the OpenMay site. Controls all the promo cards and other javascript usages.
 */

/**
 * Arrays for the items on each of the promo category. Each array is a 2 dimensional array. 
 * For each sub-array, the first item (array [n][0]) is a link and the second (array [n][1]) is the path to the image.
 * Change these arrays to update the cards, leave the first value as null if the image is a placeholder.
 * 
 *  @featured the array containing the featured promotion
 *  @retail the array containing all promotions in the retail category
 *  @automotive the array containing all promotions in the automotive category
 *  @home  the array containing all promotions in the home category
 */
const featured = [
    [null, '/images/JPG/featured/openmay.jpg'],
    ['https://skinnytan.com.au', '/images/JPG/featured/skinny tan.jpg'],
    ['https://tomsaustralia.com.au/', '/images/JPG/featured/toms.jpg']
];
const retail = [
    ['https://www.backyardcatenclosures.com.au/', '/images/JPG/retail/backyard kitten palaces.jpg'],
    ['https://charlesandlee.com/', '/images/JPG/retail/charles and lee.jpg'],
    ['https://www.backyardchickencoops.com.au/', '/images/JPG/retail/chicken coops.jpg'],
    ['https://timbuk2.com.au/', '/images/JPG/retail/timbuk2.jpg'],
    ['https://tomsaustralia.com.au/', '/images/JPG/retail/toms.jpg'],
    ['https://www.greggrantsaddlery.com.au/', '/images/JPG/retail/gregsaddelry.jpg'],
    ['https://skinnytan.com.au', '/images/JPG/retail/skinny tan.jpg']
];
const automotive = [
    ['http://autobahn.net.au/', '/images/JPG/auto/autobahn.jpg'],
    ['https://www.ultratune.com.au/', '/images/JPG/auto/ultratune.jpg'],
    [null, '/images/JPG/auto/generic.jpg']
];
const home = [
    ['https://ihealthsaunas.com.au/', '/images/JPG/home/ihealth.jpg'],
    ['https://bedsrus.com.au/', '/images/JPG/home/bedsrus.jpg'],
    ['https://www.robinskitchen.com.au/', '/images/JPG/home/robins.jpg'],
    ['https://myhouse.com.au/', '/images/JPG/home/myhouse.jpg'],
];

/**
 * Function to create the carousel images. 
 * Iterates through a 2D array and generates:
 *   <div>
 *      <a href="array[n][0]" target="_blank">
 *        <img src="path">
 *      </a>
 *   </div>
 *   ...
 * which will be appended to the div with the id === parent element.
 * @param {string} parentElement The parent element. Case sensitive.
 * @param {array} array The source array that will be used to generate the div.
 */
function createCarouselImages(parentElement, array) {
    let parent = document.getElementById(parentElement);
    console.log('creating images');
    array.forEach(element => {
        let child = document.createElement('div');
        let img = document.createElement('img');
        let path = "../../openmay" + element[1];
        let link = document.createElement('a');
        if (element[0] !== null) {
            link.setAttribute('href', element[0]);
            link.setAttribute('target', '_blank');
        }
        img.setAttribute('src', path);
        img.className = "img-fluid promo-card";
        link.appendChild(img);
        child.appendChild(link);
        parent.appendChild(child);
    });
}

/**
 * Function to create the images for the front page to keep the featured promotion in sync with the mainpage.
 * Iterates only the first 3 items of the featured array and generates the card.
 */
function createFrontPagePromo() {
    let parent = document.getElementById("promotion");
    let array;
    if (featured.length > 3) {
        array = featured.slice(0, 3);
    } else {
        array = featured;
    }
    array.forEach(element => {
        let child = document.createElement('div');
        let img = document.createElement('img');
        let path = "/openmay" + element[1];
        let link = document.createElement('a');
        if (element[0] === null) {
            link.setAttribute('href', '/openmay');
        } else {
            link.setAttribute('href', element[0]);
        }
        img.className = 'promo-card';
        img.setAttribute('src', path);
        link.appendChild(img);
        child.appendChild(link);
        parent.appendChild(child);
    })
}


/**
 * Initializes the OpenMay webpage - creates the carousels and kickstarts the slick
 */

function initOpenmay() {
    createCarouselImages('featured', featured);
    createCarouselImages('retail', retail);
    createCarouselImages('automotive', automotive);
    createCarouselImages('home', home);
    /**
     * jQuery to initialize the carousel.
     */
    $(document).ready(function () {
        $('.multiple-items').slick({
            lazyLoad: 'ondemand',
            autoplay: true,
            autoplaySpeed: 5000,
            slidesToShow: 3,
            slidesToScroll: 3,
            dots: true,
            responsive: [{
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });
    });
}