// Using browserify to bundle up all the required modules
// var Promise = require("bluebird");

// Request data from backend
// It send data to back end, but doesn't get anything from backend.
// Annotation: It is a universal function, you can call this function to send any data back end needs.
//             There are two things you need to do, firstly defining your own recall function to do your job if the back end has received your data.
//             Secondly specifying the url you need to visit, the url connects to a specified resource which back end needs.
//             You can look up the url of resource in app.py.
requestBackEnd = function (para, url) {
    return new Promise(function(resolve, reject) {
        // Send to Server.
        $.ajax({
            contentType: "application/json",
            type:        "POST",
            url :        url,
            // Keep data into a JSON format in order to be concordant with the back end to decode the message.
            data:        JSON.stringify(para),
            async:       true,
            success:     resolve,
            dataType:    "json"
        });
    }).then(function (result) {
        return new Promise(function(resolve, reject) {
            // If response is positive, then execute the recall function.
            if (result.status == 0){
                // If there is no res attribute then invoke recall function directly.
                if (result.res == undefined) {
                    resolve();
                }
                // If there is res then return res to recall function.
                else {
                    resolve(result.res);
                }
            }
            else{
                reject(result.msg);
            }
        });
    });
};