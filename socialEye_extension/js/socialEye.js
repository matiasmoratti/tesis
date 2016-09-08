function Widget(){
    this.idWidget=null;
    this.descripcion;
    this.icono;
    this.intervalPing;
    this.tittle;
    this.interface = new WidgetInterface();
    this.filesHTML;
    this.templates = {};

    this.getIdWidget = function(){
        return this.idWidget;
    }

    this.setIdWidget = function(id){
        this.idWidget = id;
    }

    this.getDescription = function(){
        return this.descripcion;
    }

    this.setDescription = function(descripcion){
        this.descripcion = descripcion;
    }

    this.getIcon = function(){
        return this.icono;
    }

    this.setIcon = function(icono){
        this.icono = icono;
    }

    this.getTitle = function(){
        return this.tittle;
    }

    this.setTitle = function(title){
        this.tittle = title;
    }

    this.getInterface = function(){
        return this.interface;
    }

    this.setInterface = function(interface){
        this.interface = interface;
    }

    this.getUser =  function() {
        return localStorage['username'];
    }



    this.ping = function(idWidget){ //Encontrar otra solución para no repetir (me rompí el coco ya)
        $.ajax({
                type: "POST",
                url: "https://127.0.0.1:8000/widgetRest/user_ping/",
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
                url: "https://127.0.0.1:8000/widgetRest/user_ping/",
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
    }

    this.openWidget = function () {
       $("#container"+this.idWidget).show();
    }

    this.onCloseWidget = function (){
        //
    }

    this.onReady = function (){
        //codigo javasript que se ejecutara despues de
        // que la estructura del widget haya sido cargada
    }

    this.createTemplate = function(idTemplate, title, htmlFile, data){
        this.templates[idTemplate] = new Template(idTemplate, title, this);
        this.injectInTemplate(idTemplate, "#"+idTemplate+this.idWidget, htmlFile,data);
    }

    this.getTemplate = function(idTemplate){
        return this.templates[idTemplate];
    }

    this.showTemplate = function(idTemplate){
        this.getTemplate(idTemplate).show();
    }

    this.closeTemplate = function(idTemplate){
        this.getTemplate(idTemplate).onCloseTemplate();
        this.getTemplate(idTemplate).close();
    }

    this.setTemplatePosition = function(idTemplate, top, left){
        this.getTemplate(idTemplate).setPosition(top,left);
    }

    this.injectInTemplate = function(idTemplate, cssSelector, htmlFile,  data){
        var widget = this;
        this.filesHTML.forEach(function(item,index){
            if (item.name == htmlFile){
                widget.getTemplate(idTemplate).injectHtml(item.data,cssSelector ,data);
            }
        });
        
    }

    this.onCloseTemplate = function(idTemplate, callBackfunction){
        this.getTemplate(idTemplate).onCloseTemplate = callBackfunction;
    }

    this.close = function (){
        this.onCloseWidget();
        clearInterval(this.intervalPing);
        $("#container"+this.idWidget).remove();
        $("#widget"+this.idWidget).removeAttr('style');
    }

    this.saveObject = function (data){
        var idAgregado=0;
        $.ajax({
            url: "https://127.0.0.1:8000/widgetRest/objects/", // the endpoint
            type: "POST", // http method
            async: false,
            data: {
                data: JSON.stringify(data),
                url: window.location.href,
                idWidget: this.idWidget
            }, // data sent with the post request

            // handle a successful response
            success: function (data) {
                idAgregado = data;

            },

            // handle a non-successful response
            error: function (xhr, errmsg, err) {
                alert("Error al enviar el objeto");
            }
        });
        return idAgregado;
    }

    this.updateObject = function (object, params){
        var success = false;
        $.ajax({
            url: "https://127.0.0.1:8000/widgetRest/updateObject/", // the endpoint
            type: "POST", // http method
            async: false,
            data: {
                object: JSON.stringify(object),
                idWidget: this.idWidget,
                params: JSON.stringify(params)
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
            url: "https://127.0.0.1:8000/widgetRest/objects/", // the endpoint
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
            url: "https://127.0.0.1:8000/widgetRest/objects/", // the endpoint
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
        var urlAux = url;
        console.log(url);
        //La url enviada no contiene http/https, por lo que es un nombre de dominio o una url inválida.
        if((url.indexOf("http://") == -1) && (url.indexOf("https://") == -1)){
            var href = window.location.href;
            urlAux = href.split("/", 3).join("/") + "/";
        }
        $.ajax({
            url: "https://127.0.0.1:8000/widgetRest/objects/", // the endpoint
            type: "GET", // http method
            dataType: 'json',
            async: false,
            data : {url : urlAux,
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
        var urlAux = url;
        console.log(url);
        //La url enviada no contiene http/https, por lo que es un nombre de dominio o una url inválida.
        if((url.indexOf("http://") == -1) && (url.indexOf("https://") == -1)){
            var href = window.location.href;
            urlAux = href.split("/", 3).join("/") + "/";
        }
        console.log(urlAux);
        $.ajax({
            url: "https://127.0.0.1:8000/widgetRest/objects/", // the endpoint
            type: "GET", // http method
            dataType: 'json',
            async: false,
            data : {url : urlAux,
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
            url: "https://127.0.0.1:8000/widgetRest/user_ping/", // the endpoint
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
            url: "https://127.0.0.1:8000/widgetRest/user_ping/", // the endpoint
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

    this.getWidgetContainer = function(){
        return $("#container" + this.idWidget);
    }

    this.addPrincipalBox = function(idElement){
        $("#container"+this.idWidget).append(this.interface.getPrincipalBox(this.idWidget,this.tittle,idElement));
    }

    this.getForm = function(idElement){
        return this.interface.getForm(this.idWidget,idElement);
    }

    this.getInput = function(type,idElement){
        return this.interface.getInput(this.idWidget,type,idElement);
    }

    this.getTextArea = function(idElement){
        return this.interface.getTextArea(this.idWidget,idElement);
    }

    this.getPrincipalBox = function(idElement,title){
        return principalBox = this.interface.getPrincipalBox(this.idWidget,title,idElement,this);
    }

    this.getBox = function(idElement,title){
        return this.interface.getBox(this.idWidget,title,idElement);
    }

    this.getPrincipalList = function(idElement){
        return this.interface.getPrincipalList(this.idWidget,idElement);
    }
    this.getPrincipalBody = function(idElement){
        return this.interface.getPrincipalBody(this.idWidget,idElement);
    }
    this.getLi = function(idElement){
        return this.interface.getLi(this.idWidget,idElement);
    }

    this.getSubmitButton = function(idElement){
        return this.interface.getSubmitButton(this.idWidget,idElement);
    }

    this.getListButton = function(idElement){
        return this.interface.getListButton(this.idWidget,idElement);
    }

    this.getDiv = function(idElement){
        return this.interface.getDiv(this.idWidget,idElement);
    }
    this.getSpan = function(idElement){
        return this.interface.getSpan(this.idWidget,idElement);
    }
    this.getP = function(idElement){
        return this.interface.getP(this.idWidget,idElement);
    }
    this.getA = function(idElement){
        return this.interface.getA(this.idWidget,idElement);
    }
    this.getI = function(idElement){
        return this.interface.getI(this.idWidget,idElement);
    }
    this.getLabel = function(idElement,text){
        return this.interface.getLabel(this.idWidget,idElement,text);
    }
    this.getVideo = function(idElement){
        return this.interface.getVideo(this.idWidget,idElement);
    }
    this.getWidgetElement = function(idElement){
        return document.getElementById(this.idWidget + idElement);
    }
    this.onCloseBox = function(idElement, event){ //Permite redefinir al usuario el evento onClose de un box.
        $("#cerrar" + this.idWidget + idElement).prop('onclick',null).off('click');
        $("#cerrar" + this.idWidget + idElement).on('click', event);
    }
    this.setBoxTitle = function(idBoxElement, newTitle){
        $("#label"+this.idWidget + idBoxElement).text(newTitle);
    }

}

function Template(idTemplate, title, widget){
    this.idTemplate = idTemplate;
    this.title = title;
    this.widget = widget;
    this.box = getTemplateBox(idTemplate, title, widget);
    $("#container"+widget.idWidget).append(this.box);

    this.injectHtml = function(html,cssSelector,data){
        var template = _.template(html);
        var test = template(data);
        if($(this.box).is($(cssSelector))){
            $(this.box).append(test);
        }
        else{
            $(this.box).find(cssSelector).append(test);
        }      
    }

    this.setPosition = function(top, left){
        this.box.style.top = top;
        this.box.style.left = left;
    }

    this.close = function(){
        this.box.style.display = 'none';
    }

    this.show = function(){
        this.box.style.display = 'initial';
    }

    this.onCloseTemplate = function(){
        //
    }
}

function getTemplateBox(idTemplate, title, widget){
        divPrincipal = document.createElement("div");
        divPrincipal.setAttribute('id', idTemplate+widget.idWidget);
        divPrincipal.classList.add( "detailBox","specificBox");
        divPrincipal.style.position = "absolute";
        divPrincipal.style.top = '50%';
        divPrincipal.style.left = '50%';
        divTitulo = document.createElement("div");
        divTitulo.classList.add( "titleBox");
        label = document.createElement("label");
        label.innerHTML = title;
        boton = document.createElement("button");
        boton.classList.add("botonCerrar", 'cerrar'+idTemplate+widget.idWidget);
        boton['aria-hidden'] = "true";
        boton.innerHTML = '&times;';
        $(boton).on('click',function (e) {
            widget.closeTemplate(idTemplate);
            $("#"+idTemplate+widget.idWidget).remove();
        });
        divTitulo.appendChild(label);
        divTitulo.appendChild(boton);
        divPrincipal.appendChild(divTitulo);
        return divPrincipal;
}