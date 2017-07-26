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



    this.ping = function(idWidget){
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

    this.createTemplate = function(idTemplate, title, htmlFile, data,boxInvisible){
        this.templates[idTemplate] = new Template(idTemplate, title, this,boxInvisible);
        this.injectInTemplate(idTemplate, htmlFile,data,'',boxInvisible);
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

    this.setTemplateWidth = function(idTemplate, width){
        this.getTemplate(idTemplate).setWidth(width);
    }

    this.setTemplateHeight= function(idTemplate, height){
        this.getTemplate(idTemplate).setHeight(height);
    }

    this.injectInTemplate = function(idTemplate, htmlFile,  data, cssSelector,boxInvisible){
        var widget = this;
        this.filesHTML.forEach(function(item,index){
            if (item.name == htmlFile){
                widget.getTemplate(idTemplate).injectHtml(item.data,data,cssSelector,boxInvisible);
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
            url: "https://127.0.0.1:8000/widgetRest/objects/",
            type: "POST",
            async: false,
            data: {
                data: JSON.stringify(data),
                url: window.location.href,
                idWidget: this.idWidget
            },
            success: function (data) {
                idAgregado = data;

            },


            error: function (xhr, errmsg, err) {
                alert("Error al intentar guardar el objeto");
            }
        });
        return idAgregado;
    }

    this.updateObject = function (object, params){
        var success = false;
        $.ajax({
            url: "https://127.0.0.1:8000/widgetRest/updateObject/",
            type: "POST",
            async: false,
            data: {
                object: JSON.stringify(object),
                idWidget: this.idWidget,
                params: JSON.stringify(params)
            },
            success: function () {
                success = true;

            },

            error: function (xhr, errmsg, err) {
                alert("Error al intentar actualizar el objeto");
            }
        });
        return success;
    }

    this.getObjects = function (params){
        var data;
        $.ajax({
            url: "https://127.0.0.1:8000/widgetRest/objects/",
            type: "GET",
            dataType: 'json',
            async: false,
            data : {idWidget : this.idWidget,
                params : JSON.stringify(params)
            },
            success: function (response) {
                data = response
            },

            error: function (xhr, errmsg, err) {
                alert("Error al intentar recuperar los datos del widget");

            }
        });
        return data;

    }

    this.getObject = function (params){
        var data;
        $.ajax({
            url: "https://127.0.0.1:8000/widgetRest/objects/",
            type: "GET",
            dataType: 'json',
            async: false,
            data : {idWidget : this.idWidget,
                params : JSON.stringify(params)
            },
            success: function (response) {
                if(response.length > 1){
                    alert("Error: más de un objeto con los parámetros especificados");
                    return null;
                }
                else{
                    data = response[0];
                }
            },

            error: function (xhr, errmsg, err) {
                alert("Error al intentar recuperar el dato del widget");

            }
        });
        return data;
    }

    this.getObjectsInUrl = function (url, params){
        var data;
        var urlAux = url;
        //La url enviada no contiene http/https, por lo que es un nombre de dominio o una url inválida.
        if((url.indexOf("http://") == -1) && (url.indexOf("https://") == -1)){
            var href = window.location.href;
            urlAux = href.split("/", 3).join("/") + "/";
        }
        $.ajax({
            url: "https://127.0.0.1:8000/widgetRest/objects/",
            type: "GET",
            dataType: 'json',
            async: false,
            data : {url : urlAux,
                idWidget : this.idWidget,
                params : JSON.stringify(params)
            },
            success: function (response) {
                data = response
            },


            error: function (xhr, errmsg, err) {
                alert("Error al intentar recuperar los datos del widget en la url");

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
            url: "https://127.0.0.1:8000/widgetRest/objects/",
            type: "GET",
            dataType: 'json',
            async: false,
            data : {url : urlAux,
                idWidget : this.idWidget,
                params : JSON.stringify(params)
            },
            success: function (response) {
                if(response.length > 1){
                    alert("Error: más de un objeto con los parámetros especificados");
                    return null;
                }
                else{
                    data = response[0];
                }
            },

            error: function (xhr, errmsg, err) {
                alert("Error al intentar recuperar el dato del widget en la url");

            }
        });
        return data;
    }

    this.getUsersConnected = function (){
        var data;
        $.ajax({
            url: "https://127.0.0.1:8000/widgetRest/user_ping/",
            type: "GET",
            dataType: 'json',
            async: false,
            data : {url : window.location.hostname,
            },
            success: function (response) {
                data = response
            },

            error: function (xhr, errmsg, err) {
                alert("Error al intentar recuperar los usuarios conectados");

            }
        });
        return changeUserAttributeName(data);
    }

    this.getUsersConnectedInWidget = function (){
        var data;
        $.ajax({
            url: "https://127.0.0.1:8000/widgetRest/user_ping/",
            type: "GET",
            dataType: 'json',
            async: false,
            data : {url : window.location.hostname,
                idWidget : this.idWidget
            },
            success: function (response) {
                data = response
            },

            error: function (xhr, errmsg, err) {
                alert("Error al intentar recuperar los usuarios conectados al widget");

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
        return this.interface.getForm(idElement);
    }

    this.getInput = function(type,idElement){
        return this.interface.getInput(type,idElement);
    }

    this.getTextArea = function(idElement){
        return this.interface.getTextArea(idElement);
    }

    this.getPrincipalBox = function(idElement,title){
        return getPrincipalBox = this.interface.getPrincipalBox(this.idWidget,title,idElement,this);
    }

    this.getBox = function(idElement,title){
        return this.interface.getBox(this.idWidget,title,idElement);
    }

    this.getPrincipalList = function(idElement){
        return this.interface.getPrincipalList(idElement);
    }
    this.getPrincipalBody = function(idElement){
        return this.interface.getPrincipalBody(idElement);
    }
    this.getLi = function(idElement){
        return this.interface.getLi(idElement);
    }

    this.getSubmitButton = function(idElement){
        return this.interface.getSubmitButton(idElement);
    }

    this.getListButton = function(idElement){
        return this.interface.getListButton(idElement);
    }

    this.getDiv = function(idElement){
        return this.interface.getDiv(idElement);
    }
    this.getSpan = function(idElement){
        return this.interface.getSpan(idElement);
    }
    this.getP = function(idElement){
        return this.interface.getP(idElement);
    }
    this.getA = function(idElement){
        return this.interface.getA(idElement);
    }
    this.getI = function(idElement){
        return this.interface.getI(idElement);
    }
    this.getLabel = function(idElement,text){
        return this.interface.getLabel(idElement,text);
    }
    this.getVideo = function(idElement){
        return this.interface.getVideo(idElement);
    }
    this.getWidgetElement = function(selector){
        return $('#container' + this.idWidget).find(selector)[0];
    }

    this.getWidgetElements = function(selector){
        return $('#container' + this.idWidget).find(selector);
    }
    this.onCloseBox = function(idElement, event){ //Permite redefinir al usuario el evento onClose de un box.
        $("#cerrar" + idElement).prop('onclick',null).off('click');
        $("#cerrar" + idElement).on('click', event);
    }
    this.setBoxTitle = function(idBoxElement, newTitle){
        $("#"+ idBoxElement + "Title").text(newTitle);
    }

}

function Template(idTemplate, title, widget,boxInvisible){
    this.idTemplate = idTemplate;
    this.title = title;
    this.widget = widget;
    if (!boxInvisible) {
      this.box = getTemplateBox(idTemplate, title, widget);
      $("#container"+widget.idWidget).append(this.box);
      this.box.firstChild.onmousedown = function(event){
        _drag_init(this.parentElement, event);
        document.addEventListener('mousemove',_move_elem);
        document.addEventListener('mouseup',_destroy);
      };
    }

    this.injectHtml = function(html,data,cssSelector,boxInvisible){
        var template = _.template(html);
        var test = template(data);
        if (cssSelector) {
            if ($(this.box).is($(cssSelector))) {
                if (!boxInvisible) {
                    $(this.box).append(test);
                } else {
                    $("#container" + widget.idWidget).append(test);
                }
            } else {
                if (!boxInvisible) {
                    $(this.box).find(cssSelector).append(test);
                } else {
                    $("#container" + widget.idWidget).append(test);
                }

            }
        } else {
            if (!boxInvisible) {
                $(this.box).append(test);
            } else {
                $("#container" + widget.idWidget).append(test);
            }
        }

    }

    this.setPosition = function(top, left){
        this.box.style.top = top;
        this.box.style.left = left;
    }

    this.setWidth = function(width){
        this.box.style.width = width;
    }

    this.setHeight = function(height){
        this.box.style.height = height;
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
        divTitulo.setAttribute('id', idTemplate + "Title");
        divTitulo.classList.add("titleBox", "socialEyeDragableWindow");
        label = document.createElement("label");
        label.innerHTML = title;
        boton = document.createElement("button");
        boton.classList.add("botonCerrar");
        boton['aria-hidden'] = "true";
        boton.innerHTML = '&times;';
        $(boton).on('click',function (e) {
            widget.closeTemplate(idTemplate);
            $("#"+idTemplate+widget.idWidget).remove();
        });
        divTitulo.appendChild(label);
        divPrincipal.appendChild(divTitulo);
        divPrincipal.appendChild(boton);
        return divPrincipal;
}
