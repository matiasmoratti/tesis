function saveObject(idWidget,data){
    var success = false;
    $.ajax({
                    url: "http://127.0.0.1:8000/widgetRest/objects/", // the endpoint
                    type: "POST", // http method
                    async: false,
                    data: {
                        data: data,
                        url: window.location.href,
                        idWidget: idWidget
                    }, // data sent with the post request

                    // handle a successful response
                    success: function () {
                        success = true;

                    },

                    // handle a non-successful response
                    error: function (xhr, errmsg, err) {
                        alert("Error al enviar el objeto");
                    }
    });
    return success;
}

function getObjects(idWidget,params){
    var data;
    $.ajax({
            url: "http://127.0.0.1:8000/widgetRest/objects/", // the endpoint
            type: "GET", // http method
            dataType: 'json',
            async: false,
            data : {'url' : window.location.href,
                   'idWidget' : idWidget,
                    'params' : params
            }, // data sent with the post request

// handle a successful response
            success: function (response) {
                data = response
            },

            // handle a non-successful response
            error: function (xhr, errmsg, err) {
                alert("Error al cargar los comentarios");

            }
        });
    return data;

}