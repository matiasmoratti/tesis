



function Widget(){
    this.idWidget=null;



    //this.ping = function(idWidget){
    //     setInterval(function () {
    //        jQuery.ajax({
    //            type: "POST",
    //            url: "http://127.0.0.1:8000/widgetRest/user_ping/",
    //            data: {
    //                url: window.location.hostname,
    //                id: idWidget
    //            },
    //            success: function () {
    //            }
    //        });
    //    }, 30000);
    //};

    //this.ping(this.idWidget);

    this.ping = function(idWidget){
        setInterval(function(){
            $.ajax({
                type: "POST",
                url: "http://127.0.0.1:8000/widgetRest/user_ping/",
                data: {
                    url: window.location.hostname,
                    id: idWidget
                },
                success: function () {
                }
            });
        },30000);
    }






    this.loadWidget = function (){
        //
    };

    this.openWidget = function () {
       $(".container"+this.idWidget).show();
    }

    this.onCloseWidget = function (){
        //
    };

    this.onReady = function (){
        //codigo javasript que se ejecutara despues de
        // que la estructura del widget haya sido cargada
    };

    this.inyectHTML = function (html){
            $('.container'+this.idWidget).append(html);
    }


    this.close = function (){
        this.onCloseWidget();
        $(".container"+this.idWidget).hide();
    }

    this.saveObject = function (data){
        var success = false;
        $.ajax({
            url: "http://127.0.0.1:8000/widgetRest/objects/", // the endpoint
            type: "POST", // http method
            async: false,
            data: {
                data: JSON.stringify(data),
                url: window.location.href,
                idWidget: this.idWidget
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

    this.getObjects = function (params){
        var data;
        $.ajax({
            url: "http://127.0.0.1:8000/widgetRest/objects/", // the endpoint
            type: "GET", // http method
            dataType: 'json',
            async: false,
            data : {url : window.location.href,
                idWidget : this.idWidget,
                params : params
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

    this.getUsersConnected = function (){
        var data;
        $.ajax({
            url: "http://127.0.0.1:8000/widgetRest/user_ping/", // the endpoint
            type: "GET", // http method
            dataType: 'json',
            async: false,
            data : {url : window.location.hostname,
            }, // data sent with the post request

            // handle a successful response
            success: function (response) {
                data = response
            },

            // handle a non-successful response
            error: function (xhr, errmsg, err) {
                alert("Error al cargar los usuarios");

            }
        });
        return JSON.parse(data);
    }

    this.getUsersConnectedInWidget = function (){
        var data;
        $.ajax({
            url: "http://127.0.0.1:8000/widgetRest/user_ping/", // the endpoint
            type: "GET", // http method
            dataType: 'json',
            async: false,
            data : {url : window.location.hostname,
                idWidget : this.idWidget
            }, // data sent with the post request

            // handle a successful response
            success: function (response) {
                data = response
            },

            // handle a non-successful response
            error: function (xhr, errmsg, err) {
                alert("Error al cargar los usuarios");

            }
        });
        return JSON.parse(data);
    }





}