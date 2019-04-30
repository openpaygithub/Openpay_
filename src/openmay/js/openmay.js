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
    [null, '/images/PNG/Featured/Featured_Openmay.png'],
    ['https://skinnytan.com.au', '/images/PNG/Featured/featured_retail_skinny_tan.png'],
    ['https://tomsaustralia.com.au/', '/images/PNG/Featured/featured_retail_toms.png']
];
const retail = [
    ['https://www.backyardcatenclosures.com.au/', '/images/PNG/retail_backyard_kitten_palaces.png'],
    ['https://charlesandlee.com/', '/images/PNG/retail_charles_and_lee.png'],
    ['https://www.backyardchickencoops.com.au/', '/images/PNG/retail_Chicken_coops.png'],
    ['https://timbuk2.com.au/', '/images/PNG/retail_timbuk2.png'],
    ['https://tomsaustralia.com.au/', '/images/PNG/retail_Toms.png'],
    ['https://skinnytan.com.au', '/images/PNG/Featured/featured_retail_skinny_tan.png']
];
const automotive = [
    ['http://autobahn.net.au/', '/images/PNG/auto_autobahn.png'],
    ['https://www.ultratune.com.au/', '/images/PNG/auto_UltraTune.png'],
    ['https://www.openpay.com.au/', '/images/PNG/auto_generic.png']
];
const home = [
    ['https://ihealthsaunas.com.au/', '/images/PNG/home_iHealth.png'],
    ['https://bedsrus.com.au/', '/images/PNG/home_bedsrus.png'],
    ['https://www.lincraft.com.au/', '/images/PNG/home_Lincraft.png'],
    ['https://myhouse.com.au/', '/images/PNG/home_MyHouse.png'],
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
        let path = "../../openmay/" + element[1];
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
        let path = "/openmay/" + element[1];
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
                },
                breakpoint: 560,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }]
        });
    });
}