var movieTemplate = $('.movie-wrapper').not('#loadMore');
var loadMore = $('#loadMore');
var movieTemplateClone = movieTemplate.clone();
var movieContainer = $('#movie-container');
var filter;
var loadingMovies = false;
var frontPivot = 0;
var endPivot = 10;

$(document).ready(function () {

    loadMore.hide();
    loadNextMovies();

    function loadNextMovies() {
        loadingMovies = true;
        $.getJSON('movies.json', function (movies) {
            for (var i = frontPivot; i < endPivot; i++) {

                var movie = movies[i];
                fillMoviePoster(movie, function (err) {
                    if (err) {
                        alert(err);
                    } else {
                        filter.refresh();
                        loadMore.show();
                        movieTemplate.hide();
                        loadingMovies = false;
                    }
                });
            }
            loadingMovies = false;
            frontPivot += 15;
            endPivot += 15;
            if ($(window).scrollTop() == $(document).height() - $(window).height() && !loadingMovies) {
                movieTemplate.show();
                loadMore.hide();
                loadNextMovies();
            }
        });
    }

    $('#loadMore').on('click', function () {
        movieTemplate.show();
        loadMore.hide();
        loadNextMovies();
    });

    //infinite scroll
    $(window).scroll(function () {
        if ($(window).scrollTop() == $(document).height() - $(window).height() && !loadingMovies) {
            movieTemplate.show();
            loadMore.hide();
            loadNextMovies();
        }
    });
});
