function onError(error) {
    console.error(`Error: ${error}`);
}

function sendMessageToTabs(tabs) {
    for (let tab of tabs) {
      browser.tabs.sendMessage(
        tab.id,
        {request: "GETDATA"}
      ).then(response => {
        var url = Object.keys(response)[0];

        browser.storage.local.get(response[url].make, function(value) {
            // We can start off by simply assigning all of the data to the doc //
            document.getElementById("make").innerHTML += response[url].make;
            document.getElementById("year").innerHTML += response[url].year;
            document.getElementById("model").innerHTML += response[url].model;
            document.getElementById("milage").innerHTML += response[url].milage + " KM";
            document.getElementById("cost").innerHTML += response[url].price;
            document.getElementById("condition").innerHTML += response[url].condition;
            
            
            // These are some variables for summary values for our specific model //
            var averageCostForModel = 0;
            var averageCostForModelAndYear = 0;
            var averageCostForModelAndKilo = 0;
            var averageCostForModelAndTransmission = 0;
            // Since we have a smaller sample for each of these, we are using little n with name//
            var nModel = 0;
            var nModelYear = 0;
            var nModelKilo = 0;
            var nModelTrans = 0;

            // These are the variables for the total summary //
            var totalAverageCostPerYear = 0;
            var totalAverageCostPerKilo = 0;
            var totalAverageCost = 0;
            
            // Total number of cars we are considering (N or population in stats) //
            var NYear = 0;
            var NKilo = 0;
            var N = 0;
            
            
            Object.keys(value[response[url].make]).forEach(function(key){
              var car = value[response[url].make][key];

              // This handles the case that the price wasn't defined in an ad (damn dealers) //
              if(typeof car["price"] !== 'undefined') {
                
                // This only compares the data if it is the same model of car //
                if(car.model == response[url].model){
                  // Adds value to average cost for model //
                  averageCostForModel += parseFloat(Number(car['price'].substr(1).replace(/[^0-9\.]+/g, "")));
                  nModel++;
                  
                  // Comparison for cars with the same year and model //
                  if(car.year == response[url].year) {
                    averageCostForModelAndYear += parseFloat(Number(car['price'].substr(1).replace(/[^0-9\.]+/g, "")));
                    nModelYear++;
                  }
                  
                  // Comparison for cars with similar kilometers and model by using 5% bounds //
                  if( 
                    ((car.milage + (car.milage) * 0.95) > response[url].milage && response[url].milage >= car.milage )
                    || (( car.milage - (car.milage) * 0.95) < response[url].milage && response[url].milage <= car.milage)) {
                      averageCostForModelAndKilo += parseFloat(Number(car['price'].substr(1).replace(/[^0-9\.]+/g, "")));
                      nModelKilo++;
                    }

                  else {
                    averageCostForModelAndKilo = parseFloat(Number(car['price'].substr(1).replace(/[^0-9\.]+/g, "")));
                    nModelKilo = 1; 
                  }
                  
                  // Comparison for cars with same transmission and model //
                  if(car.transmission == response[url].transmission) {
                    averageCostForModelAndTransmission += parseFloat(Number(car['price'].substr(1).replace(/[^0-9\.]+/g, "")));
                    nModelTrans++;
                  }

                }
              
                // If they have the same year but not the same model //
                if(car.year == response[url].year) {
                  totalAverageCostPerYear += parseFloat(Number(car['price'].substr(1).replace(/[^0-9\.]+/g, "")));
                  NYear++;
                }

                // If they have the same kilometers but not the same model //
                if( 
                  ((car.milage + (car.milage * 0.95)) >= response[url].milage && response[url].milage >= car.milage )
                  || (( car.milage - (car.milage * 0.95)) < response[url].milage && response[url].milage <= car.milage)) {
                    totalAverageCostPerKilo += parseFloat(Number(car['price'].substr(1).replace(/[^0-9\.]+/g, "")));
                    NKilo++;
                  }
                else {
                  totalAverageCostPerKilo = parseFloat(Number(car['price'].substr(1).replace(/[^0-9\.]+/g, "")));
                  NKilo = 1; 
                }
                
                // Calculates the total average cost of the cars //
                totalAverageCost += parseFloat(Number(car['price'].substr(1).replace(/[^0-9\.]+/g, "")));
                N++;

              }
              
            });
            
            // Calculates the mean for all of the calculations //
            averageCostForModel /= nModel;
            averageCostForModelAndYear /= nModelYear;
            averageCostForModelAndKilo /= nModelKilo;
            averageCostForModelAndTransmission /= nModelTrans;
            totalAverageCostPerKilo /= NKilo;
            totalAverageCostPerYear /= NYear;
            totalAverageCost /= N;

            // Sets the remaining values for the calculations //
            document.getElementById("averageCostForModel").innerHTML += "$" + Number(averageCostForModel).toFixed(2);
            document.getElementById("averageCostForModelAndYear").innerHTML += "$" + Number(averageCostForModelAndYear).toFixed(2);
            document.getElementById("averageCostForModelAndKilo").innerHTML += "$" + Number(averageCostForModelAndKilo).toFixed(2);
            document.getElementById("averageCostForModelAndTransmission").innerHTML += "$" + Number(averageCostForModelAndTransmission).toFixed(2);
            document.getElementById("totalAverageCostPerKilo").innerHTML += "$" + Number(totalAverageCostPerKilo).toFixed(2);
            document.getElementById("totalAverageCostPerYear").innerHTML += "$" + Number(totalAverageCostPerYear).toFixed(2);
            document.getElementById("totalAverageCost").innerHTML += "$" + Number(totalAverageCost).toFixed(2);


        });
      }).catch(onError);
    }
  }

browser.tabs.query({
    currentWindow: true,
    active: true
  }).then(sendMessageToTabs);