




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

function newWidget(name,icon){
    var success = 0;
    $.ajax({
                    url: "http://127.0.0.1:8000/widgetRest/widget/", // the endpoint
                    type: "POST", // http method
                    async: false,
                    data: {
                        name: name,
                        icon: icon,
                    }, // data sent with the post request

                    // handle a successful response
                    success: function (response) {
                        success = response;

                    },

                    // handle a non-successful response
                    error: function (xhr, errmsg, err) {
                        alert("Hay un widget con ese nombre");
                    }
    });
    return success;

}


function initializeWidgets(){
    var name;
    $.ajax({
                    url: "http://127.0.0.1:8000/widgetRest/widget/", // the endpoint
                    type: "GET", // http method
                    async: false,

                    // handle a successful response
                    success: function (data) {
                        $.each(data, function (i, item) {
                            $("#menu").append("<li class='socialEyeWidget socialEye'>  <a id=widget'"+item.id+"' title='"+item.widget_name+"'><span class='fa-stack fa-lg'><i class='fa fa-"+item.widget_icon+" fa-stack-1x '></i></span></a> </li>");
                        });


                    },

                    // handle a non-successful response
                    error: function (xhr, errmsg, err) {
                        alert("Hay un widget con ese nombre");
                    }
    });


}
function inyectHTML(idWidget,html){
    var div = document.createElement('div');
    div.className = 'container'+idWidget;
    div.innerHTML = html;
    $('body').appendChild(div);
}

function closeWidget(idWidget){
    $(".container"+idWidget).hide();
}

function openWidget(idWidget){
    $(".container"+idWidget).show();
}
