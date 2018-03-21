
function execApiCall (url, method, data, callback) {

    console.log('calling ' + url);

    var options = {
        method: method,
        contentType: 'application/json',
        cache: false,
        /*beforeSend: (req) => {
            req.setRequestHeader("authtoken", cookies.getAuthToken())
        },*/
        success: function (result) {
            console.log(result);
            callback(result, null);
        },
        error: function (err) {
            console.log(err);
            callback(null, err);
        }
    };

    if (data) {
        options.dataType = 'json';
        options.data = JSON.stringify(data);
        //alert(options.data);
    }

    $.ajax(url, options);
}

function postUser(userId, callback) {
    execApiCall(config.apiUrl + '/users/', 'POST', { userId:userId}, callback);
}


$(document).ready(function () {
    window.api = {
        postUser
    };
}); 