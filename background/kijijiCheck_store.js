/**
 * A JS file that handles the data from the page, and stores it in a SQLite database.
 */
browser.runtime.onMessage.addListener(
    function handleMessage(request, sender, sendResponse){
        if(typeof request[Object.keys(request)[0]].make !== 'undefined') {
            var url = Object.keys(request)[0];
        
            var make = request[url].make;

            browser.storage.local.get(make, function(value) {
                if(Object.keys(value).length > 0 && typeof Object.values(value[Object.keys(value)[0]])[0]["make"] !== 'undefined') {
                    // Creates request object based on URL //
                    // Creates a combined stored object //
                    var newValue = {}; 
                    newValue[make] = {...value[make], ...request};
                    // Re-stores the data //
                    browser.storage.local.set(newValue);
                    console.log(newValue);
                }
                else {
                    var newValue = {};
                    newValue[make] = request;
                    browser.storage.local.set(newValue); 
                    console.log(newValue); 
                }
            });

            browser.storage.local.get(make, function(value) {
                console.log(value);
            });
        }
    }
);
