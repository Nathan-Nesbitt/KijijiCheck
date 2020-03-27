// Gets the current URL //
const currentURL = window.location.href;

// Gets all tags that are dd (How the fields are stored) //
var tags = document.querySelectorAll("dd,span");

// All of the fields we care about //
fields = {
  "itemCondition": "condition",
  "vehicleModelDate": "year",
  "brand": "make",
  "model" : "model",
  "vehicleConfiguration": "trim",
  "color" : "colour",
  "bodyType": "body",
  "driveWheelConfiguration": "drivetrain",
  "vehicleTransmission": "transmission",
  "fuelType": "fuel",
  "mileageFromOdometer": "milage",
  "price": "price"
}

// What we are going to save //
let contentToStore = {};
contentToStore[window.location.href] = {};
contentToStore[window.location.href]["src"] = window.location.href;


// For all of the tags that we found, check to see if they match any of the fields //
for(let tag of Object.values(tags)) {
  // Either the data is stored within the dd tag or it is saved in a <a> tag within //
  if(fields.hasOwnProperty(tag.getAttribute('itemprop'))) {
    if(tag.hasChildNodes()) {
      contentToStore[window.location.href][fields[tag.getAttribute('itemprop')]] = tag.childNodes[0].textContent; 
    }
    else {
      // Save the current tag's inner HTML as the field value //
      contentToStore[window.location.href][fields[tag.getAttribute('itemprop')]] = tag.innerHTML;
    }
  }
}

// Sends the data back to the extension //
if(Object.keys(contentToStore)[0] !== 'undefined') {
  browser.runtime.sendMessage(contentToStore);
}


// Creates a listener from the pop-up to send the car type //
browser.runtime.onMessage.addListener(request => {
    return Promise.resolve(contentToStore);
  });