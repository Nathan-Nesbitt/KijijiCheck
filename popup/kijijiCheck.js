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

        // Create the HTML elements //

        var current = document.getElementById("current");
        var historical = document.getElementById("historical");

        var make = document.createElement('p');
        var text = document.createElement('b');
        text.appendChild(document.createTextNode("Make: "));
        make.appendChild(text);
        
        var year = document.createElement('p');
        text = document.createElement('b');
        text.appendChild(document.createTextNode("Year: "));
        year.appendChild(text);

        var model = document.createElement('p');
        text = document.createElement('b');
        text.appendChild(document.createTextNode("Model: "));
        model.appendChild(text);

        var milage = document.createElement('p');
        text = document.createElement('b');
        text.appendChild(document.createTextNode("Milage: "));
        milage.appendChild(text);
        
        
        var cost = document.createElement('p');
        text = document.createElement('b');
        text.appendChild(document.createTextNode("Cost: "));
        cost.appendChild(text);

        var condition = document.createElement('p');
        text = document.createElement('b');
        text.appendChild(document.createTextNode("Condition: "));
        condition.appendChild(text);

        var averageCostForModelEL = document.createElement('p');
        text = document.createElement('b');
        text.appendChild(document.createTextNode("Average / Model: "));
        averageCostForModelEL.appendChild(text);

        var averageCostForModelAndYearEL = document.createElement('p');
        text = document.createElement('b');
        text.appendChild(document.createTextNode("Average / Model and Year: "));
        averageCostForModelAndYearEL.appendChild(text);

        var averageCostForModelAndKiloEL = document.createElement('p');
        text = document.createElement('b');
        text.appendChild(document.createTextNode("Average / Model and KM: "));
        averageCostForModelAndKiloEL.appendChild(text);

        var averageCostForModelAndTransmissionEL = document.createElement('p');
        text = document.createElement('b');
        text.appendChild(document.createTextNode("Average / Model & Transmission: "));
        averageCostForModelAndTransmissionEL.appendChild(text);

        var totalAverageCostPerKiloEL = document.createElement('p');
        text = document.createElement('b');
        text.appendChild(document.createTextNode("Total Average / KM: "));
        totalAverageCostPerKiloEL.appendChild(text);

        var totalAverageCostPerYearEL = document.createElement('p');
        text = document.createElement('b');
        text.appendChild(document.createTextNode("Total Average / Year: "));
        totalAverageCostPerYearEL.appendChild(text);

        var totalAverageCostEL = document.createElement('p');
        text = document.createElement('b');
        text.appendChild(document.createTextNode("Total Average: "));
        totalAverageCostEL.appendChild(text);

        totalAverageCostEL.appendChild(document.createElement('b', "Total Average Cost: " ))

        browser.storage.local.get(response[url].make, function(value) {
            // We can start off by simply assigning all of the data to the doc //
            make.appendChild(document.createTextNode(response[url].make));
            year.appendChild(document.createTextNode(response[url].year));
            model.appendChild(document.createTextNode(response[url].model));
            milage.appendChild(document.createTextNode(response[url].milage + " KM"));
            cost.appendChild(document.createTextNode(response[url].price));
            condition.appendChild(document.createTextNode(response[url].condition));
            
            
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
            averageCostForModelEL.appendChild(document.createTextNode(Number(averageCostForModel).toFixed(2)));
            averageCostForModelAndYearEL.appendChild(document.createTextNode(Number(averageCostForModelAndYear).toFixed(2)));
            averageCostForModelAndKiloEL.appendChild(document.createTextNode(Number(averageCostForModelAndKilo).toFixed(2)));
            averageCostForModelAndTransmissionEL.appendChild(document.createTextNode(Number(averageCostForModelAndTransmission).toFixed(2)));
            totalAverageCostPerKiloEL.appendChild(document.createTextNode(Number(totalAverageCostPerKilo).toFixed(2)));
            totalAverageCostPerYearEL.appendChild(document.createTextNode(Number(totalAverageCostPerYear).toFixed(2)));
            totalAverageCostEL.appendChild(document.createTextNode(Number(totalAverageCost).toFixed(2)));

            current.appendChild(make);
            current.appendChild(year); 
            current.appendChild(model); 
            current.appendChild(milage);
            current.appendChild(cost);
            current.appendChild(condition);

            historical.appendChild(averageCostForModelEL);
            historical.appendChild(averageCostForModelAndYearEL);
            historical.appendChild(averageCostForModelAndKiloEL);
            historical.appendChild(averageCostForModelAndTransmissionEL);
            historical.appendChild(totalAverageCostPerKiloEL);
            historical.appendChild(totalAverageCostPerYearEL); 
            historical.appendChild(totalAverageCostEL);


        });
      }).catch(onError);
    }
  }

browser.tabs.query({
    currentWindow: true,
    active: true
  }).then(sendMessageToTabs);