var CM_cookieManager = (function() {
    // set activeForAll to true if you want to activate consent management for all visitors regardless of geolocation
    // if activeForAll is fakse than consent management is only active for EU locations
    const activeForAll = false;
    // if you really really need session cookie
    const ignoredCookie = 'session_cookie';
    var gdprZone = false;
    var intervalId = -1;
    var removedCookies = new Array();

    var killCookies = function () {
        var killCount = 0;
        var lastCookiePropLength = document.cookie.length;
        // nothing to kill
        if (lastCookiePropLength === 0) return killCount;

        document.cookie.split(";").forEach(function(c) {
            // skip removal if cookie is session cookie
            if (c.indexOf(ignoredCookie) !== -1) return;

            var kuki = c.replace(/^ +/, "");

            var removeCookie = function (s) {
                document.cookie = kuki.replace(/=.*/, "=" + sufix + ";expires=" + new Date().toUTCString());
                if (document.cookie.length < lastCookiePropLength) {
                    // successfully removed cookie
                    lastCookiePropLength = document.cookie.length;
                    removedCookies.push(kuki + s);
                    //console.log(kuki + sufix);
                    killCount++;
                    return true;
                }
                return false;
            }

            var sufix = ";path=/";
            if (removeCookie(sufix) == true) return;

            var sufix = ";domain=." + location.host + ";path=/";
            if (removeCookie(sufix) == true) return;

            var sufix = ";domain=." + location.host.split('.').slice(-2).join(".") + ";path=/";;
            if (removeCookie(sufix) == true) return;

            //console.log('Couldn\'t kill cookie: ' + kuki);
        });

        //console.log('Removed: ' + killCount + ' cookie(s)');
        return killCount;
    }

    return {
        start: function () {
            if (document.cookie.indexOf('CM_cookieConsent=1') === -1) {
                var janOffset = new Date(new Date().getFullYear(), 0, 1).getTimezoneOffset();
                var julOffset = new Date(new Date().getFullYear(), 6, 1).getTimezoneOffset();

                // almost only EU countries in 0, +1 and +2 have DST
                if ((janOffset >= -120 && janOffset <= 0 && julOffset < janOffset) || activeForAll === true) {
                    gdprZone = true;
                    // make sure no cookies before me
                    killCookies();
                    var cookieDesc = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie') ||
                                    Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'cookie');
                    if (cookieDesc && cookieDesc.configurable) {
                        Object.defineProperty(document, 'cookie', {
                            get: function () {
                                return cookieDesc.get.call(document);
                            },
                            set: function (val) {
                                //console.log('Cookie proxy: ' + val);
                                if (val.indexOf('CM_cookieConsent') !== -1 || document.cookie.indexOf('CM_cookieConsent=1') !== - 1 || val.indexOf(ignoredCookie) !== -1) {
                                    cookieDesc.set.call(document, val);
                                } else {
                                    removedCookies.push(val);
                                }
                            }
                        });
                    } else {
                        // for Safari browsers we need to
                        // check for cookies every second
                        intervalId = setInterval(function () {
                            killCookies();
                        }, 1000);
                    }
                }
            }
        },
        isGdprZone: function () {
            return gdprZone;
        },
        consent: function () {
            //console.log('received consent');
            if (intervalId !== -1) {
                clearInterval(intervalId);
            }

            var cookieDate = new Date;
            cookieDate.setFullYear(cookieDate.getFullYear() + 2);
            var cookieExpString = cookieDate.toGMTString();
            //console.log(cookieExpString);

            document.cookie = 'CM_cookieConsent=1;expires=' + cookieExpString + ';domain=.' + location.host.split('.').slice(-2).join(".") + ';path=/';
            var c = '';
            while (c = removedCookies.pop()) {
                //console.log(c + ';expires=' + cookieExpString);
                if (c.indexOf('expires=') !== -1) {
                    document.cookie = c;
                } else {
                    document.cookie = c + ';expires=' + cookieExpString;
                }
            }
        },
        getRemoved: function () {
            return removedCookies;
        }
    }
}) ();
CM_cookieManager.start();