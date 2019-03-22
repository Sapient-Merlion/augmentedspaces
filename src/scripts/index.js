'use strict';

import 'babel-polyfill';
import 'jquery';
import 'magnific-popup';
import './modules/image-loader';
import LazyLoad from 'lazyload';
import anime from 'animejs';
import CanvasAnimate from './components/canvasAnimate';
import '../styles/style.scss';

//bind plugin definition to jQuery
window.jQuery = $;
window.$ = $;

CanvasAnimate();

function initTabs() {
  $('.tabs').each(function() {
    $(this)
      .find('li')
      .each(function() {
        $(this)
          .find('a')
          .on('click', function(evt) {
            evt.preventDefault();
            $('.tabs')
              .find('li')
              .removeClass('selected');
            $(this)
              .parent()
              .addClass('selected');
            const panelID = $(this).attr('href');
            $('.tab-panel').hide();
            $(panelID).show();
            $(panelID).css({
              opacity: 0
            });
            anime({
              targets: panelID,
              opacity: 1,
              easing: 'easeOutCubic',
              duration: 350
            });
            initViewall();
          });
      });
  });
  $('.tab-panel').hide();
  $('.tab-panel')
    .first()
    .show();
  $('.tabs')
    .find('li')
    .first()
    .addClass('selected');
}

function initViewall() {
  let initialShow = 12;
  if (getBootstrapDeviceSize() === 'sm') {
    initialShow = 9;
  } else if (getBootstrapDeviceSize() === 'xs') {
    initialShow = 6;
  }

  $('.galleryphotos').removeAttr('style');
  $('.galleryphotos').each(function() {
    const $galleryContainer = $(this);
    const $btnShowAll = $galleryContainer.next().find('.showall');
    $btnShowAll.show();

    const shortenheight = $galleryContainer.find('.gallery').outerHeight() * 2;
    $galleryContainer.attr('data-origheight', $galleryContainer.outerHeight());
    $galleryContainer.css({
      height: shortenheight,
    });

    $btnShowAll.off().on('click', function() {
      const totalHeight = $galleryContainer.data('origheight');
      anime({
        targets: '.galleryphotos',
        height: totalHeight,
        easing: 'easeOutCubic',
        duration: 350
      });
      $(this).hide();
    });
  });
}

function getBootstrapDeviceSize() {
  return $('#users-device-size')
    .find('div:visible')
    .first()
    .attr('id');
}

$(() => {
  window.onresize = () => {
    initViewall();
  };

  $('.menuclick').on('click', function() {
    $('body').addClass('expand');
    $('#bottom-menu').hide();
    initViewall();
  });

  $('.close-menu').on('click', function() {
    $('body').removeClass('expand');
    $('#bottom-menu').show();
  });

  $('.photothumb').magnificPopup({
    type: 'image',
    closeOnContentClick: true,
    closeBtnInside: false,
    mainClass: 'mfp-no-margins mfp-with-zoom', // class to remove default margin from left and right side
    image: {
      verticalFit: true
    },
    gallery: {
      enabled: true
    },
    zoom: {
      enabled: true,
      duration: 300 // don't foget to change the duration also in CSS
    }
  });

  if (window.location.hash.slice(1) === 'gallery') {
    $('.menuclick').trigger('click');
    setTimeout(function() {
      $('.bottom-drawer').animate(
        {
          scrollTop: $('.anchor-gallery').offset().top
        },
        500
      );
    }, 800);
  }

  initTabs();
  window.dispatchEvent(new Event('resize'));

  new LazyLoad();
});
