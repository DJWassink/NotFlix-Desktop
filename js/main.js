var movieTemplate = $('.movie-wrapper').not('#loadMore');
var loadMore = $('#loadMore');
var movieTemplateClone = movieTemplate.clone();
var movieContainer = $('#movie-container');
var filter;
var loadingMovies = false;
var frontPivot = 0;
var endPivot = 60;

$(document).ready(function () {

    loadNextMovies();

    function loadNextMovies() {
        movieTemplate.show();
        loadMore.hide();

        loadingMovies = true;
        $.getJSON('movies.json', function (movies) {
            for (var i = frontPivot; i < endPivot; i++) {
                fillMoviePoster(movies[i]);  
            }
            filter.refresh();
            loadMore.show();
            movieTemplate.hide();
            loadingMovies = false;
            frontPivot = endPivot;
            endPivot += 15;
        });
    }

    $('#loadMore').on('click', function () {
        loadNextMovies();
    });

    //infinite scroll
    $(window).scroll(function () {
        if ($(window).scrollTop() == $(document).height() - $(window).height() && !loadingMovies) {
            loadNextMovies();
        }
    });
});
