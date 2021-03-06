/* jshint esversion:6 */

class VanillaFader {

    constructor(options = null) {
        // constants
        this.defaultFadeTime = 250;
        this.modes = ['display', 'visibility'];
        this.intervalTime = 20;

        /**
         * @param {{waitTime: number, fadeTime: number, mode: string, display: string}} options options object for fade:
         * options.waitTime: time in ms to wait before executing;
         * options.fadeTime: time in ms for the fadeIn/fadeOut effects;
         * options.mode: type of fade-out; 'display' or 'visibility';
         * options.display: display the target should have; 'block', 'flex', etc;
         */
        this.setOptions = (options = {}) => {
            // defaults
            this.waitTime = 0;
            this.fadeTime = this.defaultFadeTime;
            this.mode = 'display';
            this.display = 'block';
            if (options.waitTime) {
                this.waitTime = typeof options.waitTime === 'number' ? options.waitTime : 0;
            }
            if (options.fadeTime) {
                this.fadeTime = typeof options.fadeTime === 'number' ? options.fadeTime : this.defaultFadeTime;
            }
            if (options.mode) {
                this.mode = this.modes.includes(options.mode) ? options.mode : 'display';
            }
            if (options.display) {
                this.display = typeof options.display === 'string' ? options.display : 'block';
            }
        };

        /**
         * @param {any} fadeOutTarget element to fade out, or its id
         * @param {function} callback function executed when fade is finished
         * @param {object} options options for fade configuration
         */
        this.fadeOut = (fadeOutTarget, callback = () => {}, skipWait = false) => {

            // check callback
            if (typeof callback !== 'function') {
                callback = () => {};
            }

            // check target
            if (typeof fadeOutTarget === 'string') {
                fadeOutTarget = document.getElementById(fadeOutTarget);
            }

            var isVisible = this.mode === 'visibility' ? (element) => {
                return element.style.visibility !== "hidden";
            } : (element) => {
                return element.style.display !== "none";
            };
            var makeInvisible = this.mode === 'visibility' ? (element) => {
                element.style.visibility = "hidden";
            } : (element) => {
                element.style.display = "none";
            };

            if (fadeOutTarget) {
                if (isVisible(fadeOutTarget)) {
                    var waitTime = skipWait ? 0 : this.waitTime;
                    setTimeout(() => {
                        var opacityInterval = this.intervalTime / this.fadeTime;
                        fadeOutTarget.style.opacity = 1;
                        var fadeOutEffect = setInterval(() => {
                            if (fadeOutTarget.style.opacity > 0) {
                                // fade out a little bit
                                fadeOutTarget.style.opacity -= opacityInterval;
                            } else {
                                clearInterval(fadeOutEffect);
                                makeInvisible(fadeOutTarget);
                                callback();
                            }
                        }, this.intervalTime);
                    }, waitTime);
                } else {
                    callback();
                    // setTimeout(callback, options.fadeTime);
                }
            } else {
                console.log('fadeOut error: no such element exists.');
            }
        };

        /**
         * @param {any} fadeInTarget element to fade in, or its id
         * @param {function} callback function executed when fade is finished
         * @param {object} options options for fade configuration
         */
        this.fadeIn = (fadeInTarget, callback = () => {}, skipWait = false) => {

            // check callback
            if (typeof callback !== 'function') {
                callback = () => {};
            }

            // check target
            if (typeof fadeInTarget === 'string') {
                fadeInTarget = document.getElementById(fadeInTarget);
            }

            // option values
            var isVisible = this.mode === 'visibility' ? (element) => {
                return element.style.visibility !== "hidden";
            } : (element) => {
                return element.style.display !== "none";
            };
            var makeVisible = this.mode === 'visibility' ? (element) => {
                element.style.visibility = "visible";
            } : (element) => {
                element.style.display = this.display;
            };

            if (fadeInTarget) {
                if (!isVisible(fadeInTarget)) {
                    var waitTime = skipWait ? 0 : this.waitTime;
                    setTimeout(() => {
                        if (fadeInTarget) {
                            var opacityInterval = this.intervalTime / this.fadeTime;
                            fadeInTarget.style.opacity = 0;
                            makeVisible(fadeInTarget);
                            var fadeInEffect = setInterval(() => {
                                if (fadeInTarget.style.opacity < 1) {
                                    fadeInTarget.style.opacity = parseFloat(fadeInTarget.style.opacity) + parseFloat(opacityInterval);
                                } else {
                                    clearInterval(fadeInEffect);
                                    callback();
                                }
                            }, this.intervalTime);
                        }
                    }, waitTime);
                } else {
                    callback();
                    // setTimeout(callback, options.fadeTime);
                }
            } else {
                console.log('fadeIn error: no such element exists: ');
            }
        };

        /**
         * @param {any} fadeOutTarget element to fade out, or its id
         * @param {any} fadeInTarget element to fade in, or its id
         * @param {function} callback function executed when fade is finished
         * @param {object} options options for fade configuration
         */
        this.fadeReplace = (fadeOutTarget, fadeInTarget, callback = () => {}) => {

            setTimeout(() => {
                this.fadeOut(fadeOutTarget, () => {
                    this.fadeIn(fadeInTarget, callback, true);
                }, true);
            }, this.waitTime);
        };

        // set options
        this.setOptions(options);
    }
}

function createFader(options = {}) {
    return new VanillaFader(options);
}

function vFadeOut(fadeOutTarget, callback = () => {}, options = {}) {
    var vFader = new VanillaFader(options);
    vFader.fadeOut(fadeOutTarget, callback);
}

function vFadeIn(fadeInTarget, callback = () => {}, options = {}) {
    var vFader = new VanillaFader(options);
    vFader.fadeIn(fadeInTarget, callback);
}

function vFadeReplace(fadeOutTarget, fadeInTarget, callback = () => {}, options = {}) {
    var vFader = new VanillaFader(options);
    vFader.fadeReplace(fadeOutTarget, fadeInTarget, callback);
}