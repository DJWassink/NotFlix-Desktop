  //remove all the popups
  $(document).on('click', function () {
      $('.movie-popup-active').removeClass('movie-popup-active');
  });

  //live filter
  filter = $('#movie-container').liveFilter('#movie-filter', '.movie-wrapper', {
      filterChildSelector: '.movie-description-small',
      after: function () {
          if (!loadingMovies) {
              movieTemplate.hide();
          }
      }
  });

  function fillMoviePoster(json) {
      var thisMovie = movieTemplateClone.clone();
      thisMovie.data('json', json);

      var thisPoster = new Image();
      thisPoster.src = 'images/posters_thumb/' + json.imdb_id + '_poster.jpg';

      var released = new Date(json.released * 1000);
      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      var releasedStr = released.getDate() + "-" + months[released.getMonth()] + "-" + released.getFullYear();

      thisMovie.find('.movie-description-small').html(json.title + '<br>' + releasedStr + '<br>' + json.runtime + 'min<br>' + json.genres[0]);
      thisMovie.find('.movie-popup-title').html(json.title);
      //thisMovie.find('.movie-popup-rating').html(json.year + '<div class="raty"></div>' + json.genres[0]);
      thisMovie.find('.movie-spinner').remove();


      var ratyContainer = thisMovie.find('.raty');
      ratyContainer.raty({
          starType: 'i',
          score: (json.ratings.percentage / 20),
          half: true,
      });


      thisMovie.find('.movie-popup-overview').html('<p> ' + json.overview + ' </p>');

      //when a movie poster is clicked open the popup
      thisMovie.find('.movie-hover').on('click', function (e) {
          e.stopPropagation();
          e.preventDefault();

          $('.movie-popup-active').removeClass('movie-popup-active');
          thisMovie.find('.movie-popup').addClass('movie-popup-active');
      });

      //find a remove icon (only on the rated page)
      thisMovie.find('.remove-rating').on('click', function (e) {
          e.stopPropagation();
          e.preventDefault();

          calls.removeRate(json.imdb_id, token, function () {
              thisMovie.remove();
          });
          console.log(json);
      });

      thisMovie.find('.movie-popup-more-info').on('click', function (e) {
          //e.stopPropagation();
          //e.preventDefault();

          openFullScreenDialog(json, releasedStr);
      });

      thisPoster.onload = function () {
          thisMovie.find('.movie-poster').attr('src', this.src);
          movieTemplate.before(thisMovie);
      };
  }

  function openFullScreenDialog(json, releasedStr) {
      var dialog = $('.fullscreen-dialog');
      dialog.addClass('fullscreen-dialog-active');
      var fanartImage = new Image();
      fanartImage.src = 'images/fanarts_medium/' + json.imdb_id + '_fanart.jpg';

      fanartImage.onload = function () {
          dialog.css('background-image', 'url("' + this.src + '")');
      };

      dialog.find('.fullscreen-dialog-poster').attr('src', 'images/posters_medium/' + json.imdb_id + '_poster.jpg');
      dialog.find('.fullscreen-title').html(json.title);
      dialog.find('.fullscreen-data').html(releasedStr + " &bull; " + json.runtime + ' min &bull; ' + json.ratings.percentage + '% <i class=\"fa fa-smile-o\"></i> &bull; ' + json.ratings.loved + ' <i class="fa fa-thumbs-o-up"></i> &bull; ' + json.ratings.hated + ' <i class="fa fa-thumbs-o-down"></i> &bull; <a href="http://www.imdb.com/title/' + json.imdb_id + '" target="_BLANK">IMDB</a>');
      dialog.find('.fullscreen-description').html(json.overview);
      dialog.find('.fullscreen-trailer').attr('src', getYoutubeEmbeded(json.trailer));


      dialog.find('.fullscreen-dialog-close').on('click', function () {
          dialog.removeClass('fullscreen-dialog-active');
          dialog.find('.fullscreen-trailer').attr('src', "");
      });
  }


  function getYoutubeEmbeded(url) {
      if (url === null || url === undefined || url === "")
          return;

      var regExp = /^.*(youtube.com\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      var match = url.match(regExp);
      if (match && match[2].length == 11) {
          return "//www.youtube.com/embed/" + match[2];
      } else {
          return null;
      }
  }
