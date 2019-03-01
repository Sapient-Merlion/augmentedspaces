'use strict';

import 'babel-polyfill';
import * as jQuery from 'jquery';
import anime from 'animejs';
import * as magnificpopup from 'magnific-popup';
import CanvasAnimate from './components/canvasAnimate';

import '!!file-loader?name=images/[name].[ext]!images/gallery/photo1.jpg';
import '!!file-loader?name=images/[name].[ext]!images/gallery/photo2.jpg';
import '!!file-loader?name=images/[name].[ext]!images/gallery/photo3.jpg';
import '!!file-loader?name=images/[name].[ext]!images/gallery/photo4.jpg';
import '!!file-loader?name=images/[name].[ext]!images/gallery/photo5.jpg';
import '!!file-loader?name=images/[name].[ext]!images/gallery/photo6.jpg';
import '!!file-loader?name=images/[name].[ext]!images/gallery/photo7.jpg';
import '!!file-loader?name=images/[name].[ext]!images/gallery/photo8.jpg';
import '!!file-loader?name=images/[name].[ext]!images/gallery/photo9.jpg';
import '!!file-loader?name=images/[name].[ext]!images/gallery/photo10.jpg';
import '!!file-loader?name=images/[name].[ext]!images/gallery/photo11.jpg';
import '!!file-loader?name=images/[name].[ext]!images/gallery/photo12.jpg';
import '!!file-loader?name=images/[name].[ext]!images/gallery/photo13.jpg';
import '!!file-loader?name=images/[name].[ext]!images/gallery/photo14.jpg';
import '!!file-loader?name=images/[name].[ext]!images/gallery/photo15.jpg';
import '!!file-loader?name=images/[name].[ext]!images/gallery/photo16.jpg';

import '../styles/style.scss';

//bind plugin definition to jQuery
window.jQuery = $;
window.$ = $;

const files = require.context('../icons/', false, /.*\.svg$/);
files.keys().forEach(files);

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
    const galleryContainer = $(this);
    galleryContainer
      .next()
      .find('.showall')
      .show();

    // check if total photo lesser that the initial show value
    if (initialShow >= galleryContainer.find('.photothumb').length) {
      galleryContainer
        .next()
        .find('.showall')
        .hide();
    }

    galleryContainer.find('.photothumb').each(function(i) {
      if (i > initialShow - 1) {
        $(this)
          .parent()
          .removeAttr('style');
      }
    });

    galleryContainer.attr('data-origheight', galleryContainer.outerHeight());

    galleryContainer.find('.photothumb').each(function(i) {
      if (i > initialShow - 1) {
        $(this)
          .parent()
          .css({
            display: 'none'
          });
      }
    });

    const shortenheight = $(this).outerHeight();
    galleryContainer.css({
      height: shortenheight
    });

    galleryContainer.find('.photothumb').each(function(i) {
      if (i > initialShow - 1) {
        $(this)
          .parent()
          .removeAttr('style');
      }
    });

    galleryContainer
      .next()
      .find('.showall')
      .off()
      .on('click', function() {
        const totalHeight = galleryContainer.data('origheight');
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
  initTabs();
  initViewall();
  window.dispatchEvent(new Event('resize'));
});
