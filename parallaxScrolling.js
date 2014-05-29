/**
 * Parallax Scrolling v0.1 / 2014-05-29
 * Copyright (c) 2014 Evgeniy Chubar
 * polizey565@gmail.com
 */
(function() {
    'use strict';

    var cfg = {defSpeed: 0.35},
        $window = $(window),
        $parallaxBlocks = $('[data-parallax]'),
        modernBrowser = true,

        imageLoadHandler = (function() {
            // if modern browser
            if('backgroundSize' in document.documentElement.style) {
                return function($block) {
                    // cache props to block data
                    $block
                        .css({backgroundImage: 'url("' + this.src + '")', backgroundRepeat: 'repeat'})
                        .data({nWidth: this.naturalWidth, nHeight: this.naturalHeight, speed: getSpeed($block)});

                    // run update for block
                    $.proxy(updateBlock, $block)();
                };

            // if old browser
            } else {
                modernBrowser = false;
                return function($block) {
                    // just set background image
                    $block.css({background: 'url("' + this.src + '") 50% 0'});
                };
            }

//            imageLoadHandler($block, src);
        }()),

        // get parallax speed from block attr
        getSpeed = function($block) {
            var ps = $block.attr('data-parallax-speed');

            // if incorrect value
            if (!ps || isNaN(ps) || ps > 1 || ps < 0) {
                // use defaults
                ps = cfg.defSpeed;
            }

            return ps;
        },

        // init collect data from blocks
        initBlocks = function() {
            var $block = $(this),
                src = $block.attr('data-parallax'),
                $image = $(new Image());

            // on image load
            $image.on('load', function() {
                $.proxy(imageLoadHandler, this, $block)();
            }).attr('src', src);
        },

        // update block background properties
        updateBlock = function() {
            var $block = $(this),
                blockWidth = $block.innerWidth(),
                blockHeight = $block.innerHeight(),
                imgWidth = $block.data('nWidth'),
                imgHeight = $block.data('nHeight'),
                speed = $block.data('speed'),
                scroll, width, height, left, top;

            // if no needed values - return
            if (!imgWidth || !imgHeight || !speed) {
                return;
            }

            scroll = ($window.scrollTop() - $block.offset().top) / blockHeight;
            scroll = Math.min(1, Math.max(-1, scroll));
            width = blockWidth;
            height = Math.ceil(width * imgHeight / imgWidth);
            if (height < blockHeight) {
                height = blockHeight;
                width = Math.ceil(height * imgWidth / imgHeight);
            }
            left = Math.round((blockWidth - width) / 2);
            top = Math.round((blockHeight - height) / 2) + scroll * speed * blockHeight;

            $block.css({backgroundSize: width + 'px ' + height + 'px', backgroundPosition: left + 'px ' + top + 'px'});
        },

        // updates all blocks
        updateAll = function() {
            $parallaxBlocks.each(updateBlock);
        };

    // onload init
    $parallaxBlocks.each(initBlocks);

    if (modernBrowser) {
        // update on window resize or scroll
        $window.on('resize scroll', updateAll);
    }
}());