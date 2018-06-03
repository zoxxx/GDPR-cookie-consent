(function () {
    if (document.cookie.indexOf('CM_cookieConsent=1') === -1) {
        if (CM_cookieManager.isGdprZone()) {
            var cookieAlert = document.createElement('div');
            cookieAlert.style.cssText = 'position:fixed;left:0;right:0;bottom:0;padding:0.8em;background-color:lightgrey;font-size:0.9em;color:black;z-index:10000;';
            var text = document.createTextNode("We don't use your private data for profiling or tracking. \
            Storing of cookies on your device is prevented until you give us explicit consent. \
            By continuing to browse this website you agree with our ");
            cookieAlert.appendChild(text);
            var link = document.createElement('a');
            link.style.cssText = 'font-weight: bold;'
            link.setAttribute('href', "https://yourprivacypolicy");
            link.appendChild(document.createTextNode('Privacy Policy.'));
            cookieAlert.appendChild(link);

            var btnWrapper = document.createElement('div');
            btnWrapper.style.cssText = 'padding: 0.5em;';

            var buttonConsent = document.createElement('div');
            buttonConsent.appendChild(document.createTextNode('I CONSENT'));
            buttonConsent.style.cssText = 'display: inline-block;border: 1px solid black;border-radius: 5px;cursor: pointer;margin-left: 1em;padding: 0.5em; font-weight: bold';
            var iConsent = function () {
                CM_cookieManager.consent(true);
                document.body.removeChild(cookieAlert);
            }
            buttonConsent.onclick = function () { iConsent(); }
            btnWrapper.appendChild(buttonConsent);

            var buttonClose = document.createElement('div');
            buttonClose.appendChild(document.createTextNode('CLOSE'));
            buttonClose.style.cssText = 'display: inline-block;border: 1px solid gray;border-radius: 5px;cursor: pointer;color: gray;margin-left: 1em;padding: 0.5em';
            var removeAlert = function () {
                document.body.removeChild(cookieAlert);
            }
            buttonClose.onclick = function () { removeAlert(); }
            btnWrapper.appendChild(buttonClose);

            cookieAlert.appendChild(btnWrapper);
            document.body.appendChild(cookieAlert);
        }
    }
}) ();