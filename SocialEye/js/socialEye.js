function Widget(){
    this.idWidget=null;
    this.descripcion;
    this.icono;
    this.intervalPing;
    
    this.getUser =  function() {
        return localStorage['username'];
    }

    this.ping = function(idWidget){ //Encontrar otra solución para no repetir (me rompí el coco ya)
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
        this.intervalPing = setInterval(function(){
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
        },15000);
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
        clearInterval(this.intervalPing);
        $(".container"+this.idWidget).remove();
        $("#widget"+this.idWidget).removeAttr('style');
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

    this.updateObject = function (object, params){
        var success = false;
        $.ajax({
            url: "http://127.0.0.1:8000/widgetRest/updateObject/", // the endpoint
            type: "POST", // http method
            async: false,
            data: {
                object: JSON.stringify(object),
                idWidget: this.idWidget,
                params: params
            }, // data sent with the post request

            // handle a successful response
            success: function () {
                success = true;

            },

            // handle a non-successful response
            error: function (xhr, errmsg, err) {
                alert("Error al actualizar el objeto");
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
            data : {idWidget : this.idWidget,
                params : JSON.stringify(params)
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

    this.getObject = function (params){
        var data;
        $.ajax({
            url: "http://127.0.0.1:8000/widgetRest/objects/", // the endpoint
            type: "GET", // http method
            dataType: 'json',
            async: false,
            data : {idWidget : this.idWidget,
                params : JSON.stringify(params)
            }, // data sent with the post request

            // handle a successful response
            success: function (response) {
                if(response.length > 1){
                    alert("Error: más de un objeto con los parámetros especificados");
                    return null;
                }
                else{
                    data = response[0];
                }
            },

            // handle a non-successful response
            error: function (xhr, errmsg, err) {
                alert("Error al cargar los comentarios");

            }
        });
        return data;
    }

    this.getObjectsInUrl = function (url, params){
        var data;
        $.ajax({
            url: "http://127.0.0.1:8000/widgetRest/objects/", // the endpoint
            type: "GET", // http method
            dataType: 'json',
            async: false,
            data : {url : url,
                idWidget : this.idWidget,
                params : JSON.stringify(params)
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

    this.getObjectInUrl = function (url, params){
        var data;
        $.ajax({
            url: "http://127.0.0.1:8000/widgetRest/objects/", // the endpoint
            type: "GET", // http method
            dataType: 'json',
            async: false,
            data : {url : url,
                idWidget : this.idWidget,
                params : JSON.stringify(params)
            }, // data sent with the post request

            // handle a successful response
            success: function (response) {
                if(response.length > 1){
                    alert("Error: más de un objeto con los parámetros especificados");
                    return null;
                }
                else{
                    data = response[0];
                }
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
        return changeUserAttributeName(data);
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
        return changeUserAttributeName(data);
    }

    this.isUserConnected = function (userName){
        var data;
        var connected = false;
        data = this.getUsersConnected();
        $.each(data, function (i, item) {    
            if(item.userName == userName){
                connected = true;
                return false;
            }
        });   
        return connected;
    }

    this.isUserConnectedInWidget = function (userName){
        var data;
        var connected = false;
        data = this.getUsersConnectedInWidget();
        $.each(data, function (i, item) {   
            if(item.userName == userName){
                connected = true;
                return false;
            }
        });   
        return connected;
    }


    function changeUserAttributeName(data){
        result = [];
        $.each(data, function (i, item) {    
            userAux = new Object();
            userAux.userName = item.user__username;
            result[i] = userAux;
        });     
        return result;
    }





}