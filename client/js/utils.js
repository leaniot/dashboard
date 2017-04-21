var   token = '';
// Types of data sources
const dataSourceType = {
    line: [0, 1], 
    geo: 2
};

// URLs
const url = {
    iconUrl: "http://developer.baidu.com/map/jsdemo/img/dest_markers.png"
}

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

// Formatted String
// It's a utility for getting formatted string. 
// e.g. String.format("{0}:{1}:{2} {3}:{4}:{5}", year, month, day, hour, min, sec);
String.format = function() {
    // The string containing the format items (e.g. "{0}")
    // will and always has to be the first argument.
    var theString = arguments[0];
    // start with the second argument (i = 1)
    for (var i = 1; i < arguments.length; i++) {
        // "gm" = RegEx options for Global search (more than one instance)
        // and for Multiline search
        var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
        theString = theString.replace(regEx, arguments[i]);
    }
    return theString;
}