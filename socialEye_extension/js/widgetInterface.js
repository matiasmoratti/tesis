 function WidgetInterface(){

    this.getPrincipalBox = function(idWidget,title,idElement,widgetObject){
        divPrincipal = document.createElement("div");
        divPrincipal.classList.add( "detailBox");
        if (!(typeof idElement === 'undefined'))
            divPrincipal.setAttribute('id', idElement);
        divTitulo = document.createElement("div");
        divTitulo.classList.add( "titleBox");
        divTitulo.setAttribute('id', "titulo");
        label = document.createElement("label");
        label.classname='socialEye';
        label.innerHTML = title;
        boton = document.createElement("button");
        boton.classList.add("botonCerrar", 'socialEye', 'cerrar'+idWidget);
        boton['aria-hidden'] = "true";
        boton.innerHTML = '&times;';
        $(boton).on('click',function (e) {
            widgetObject.onCloseWidget();
            clearInterval(widgetObject.intervalPing);
            $("#container"+widgetObject.idWidget).remove();
            $("#widget"+widgetObject.idWidget).removeAttr('style');
        });
        divTitulo.appendChild(label);
        divTitulo.appendChild(boton);
        divPrincipal.appendChild(divTitulo);
        return divPrincipal;
    }

    this.getPrincipalBody = function(idElement){
        divBody = document.createElement("div");
        if (!(typeof idElement === 'undefined'))
            divBody.setAttribute('id', idElement);
        divBody.classList.add("actionBox");
        return divBody;
    }

    this.getPrincipalList = function(idElement){
        ul = document.createElement("ul");
        ul.classList.add("commentList");
        if (!(typeof idElement === 'undefined'))
            ul.setAttribute('id', idElement);
        return ul;
    }

    this.getLi = function(idElement){
        li = document.createElement("li");
        if (!(typeof idElement === 'undefined'))
            li.setAttribute('id', idElement);
        return li;
    }

    this.getForm = function(idElement){
        form = document.createElement("form");
        if (!(typeof idElement === 'undefined'))
            form.setAttribute('id', idElement);
        return form;
    }

    this.getInput = function(type,idElement) {
        input = document.createElement("input");
        input.type = type;
        if (!(typeof idElement === 'undefined'))
            input.setAttribute('id', idElement);
        return input;
    }

    this.getTextArea = function(idElement){
        textarea = document.createElement("textarea");
        if (!(typeof idElement === 'undefined'))
            textarea.setAttribute('id', idElement);
        textarea.classList.add("form-control");
        textarea.type = 'text';
        return textarea;
    }

    this.getSubmitButton = function(idElement){
        buttn = document.createElement("button");
        if (!(typeof idElement === 'undefined'))
            buttn.setAttribute('id', idElement);
        buttn.classList.add('submitButton');
        return buttn;
    }

    this.getListButton = function(idElement){
        buttn = document.createElement("button");
        if (!(typeof idElement === 'undefined'))
            buttn.setAttribute('id', idElement);
        buttn.classList.add('listButton');
        return buttn;
    }

    this.getDiv = function(idElement){
        div = document.createElement("div");
        if (!(typeof idElement === 'undefined'))
            div.setAttribute('id', idElement);
        return div;
    }

    this.getSpan = function(idElement){
        span = document.createElement("span");
        if (!(typeof idElement === 'undefined'))
            span.setAttribute('id', idElement);
        return span;
    }
    this.getP = function(idElement){
        p = document.createElement("p");
        if (!(typeof idElement === 'undefined'))
            p.setAttribute('id', idElement);
        return p;
    }

    this.getA = function(idElement){
        anchor = document.createElement("a");
        if (!(typeof idElement === 'undefined'))
            anchor.setAttribute('id', idElement);
        return anchor;
    }

    this.getI = function(idElement){
        tagI = document.createElement("i");
        if (!(typeof idElement === 'undefined'))
            tagI.setAttribute('id', idElement);
        return tagI;
    }

    this.getLabel = function(idElement,text){
        tagLabel = document.createElement("label");
        if (!(typeof idElement === 'undefined'))
            tagLabel.setAttribute('id', idElement);
        tagLabel.innerHTML = text;
        return tagLabel;
    }


    this.getVideo = function(idElement){
        tagVideo = document.createElement("video");
        if (!(typeof idElement === 'undefined'))
            tagVideo.setAttribute('id', idElement);
        return tagVideo;
    }

    this.getBox = function(idWidget,title,idElement){
        divPrincipal = document.createElement("div");
        divPrincipal.classList.add("detailBox");
        if (!(typeof idElement === 'undefined'))
            divPrincipal.setAttribute('id', idElement);
        divTitulo = document.createElement("div");
        divTitulo.classList.add( "titleBox", "socialEye");
        label = document.createElement("label");
        label.innerHTML = title;
        boton = document.createElement("button");
        boton.setAttribute('id', "cerrar" + idElement);
        boton.classList.add('botonCerrar');
        boton['aria-hidden'] = "true";
        boton.innerHTML = '&times;';
        divTitulo.appendChild(label);
        divTitulo.appendChild(boton);
        divPrincipal.appendChild(divTitulo);
        $(boton).on('click',function (e) {
            $("#container" + idWidget).find("#"+idElement).remove();
        });
        return divPrincipal;
    }
}