    function WidgetInterface(){

    this.getPrincipalBox = function(idWidget,title,idElement,widgetObject){
        divPrincipal = document.createElement("div");
        divPrincipal.classList.add( "detailBox", "socialEye", idWidget);
        if (!(typeof idElement === 'undefined'))
            divPrincipal.setAttribute('id', idWidget+idElement);
        divTitulo = document.createElement("div");
        divTitulo.classList.add( "titleBox", "socialEye");
        divTitulo.setAttribute('id', "titulo"+idWidget);
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

    this.getPrincipalBody = function(idWidget,idElement){
        divBody = document.createElement("div");
        if (!(typeof idElement === 'undefined'))
            divBody.setAttribute('id', idWidget+idElement);
        divBody.classList.add( "actionBox", "socialEye", "principal"+idWidget);
        return divBody;
    }

    this.getPrincipalList = function(idWidget,idElement){
        ul = document.createElement("ul");
        ul.classList.add( "commentList", "socialEye","list"+idWidget);
        if (!(typeof idElement === 'undefined'))
            ul.setAttribute('id', idWidget+idElement);
        return ul;
    }

    this.getLi = function(idWidget,idElement){
        li = document.createElement("li");
        li.classname = 'socialEye';
        if (!(typeof idElement === 'undefined'))
            li.setAttribute('id', idWidget+idElement);
        return li;
    }

    this.getForm = function(idWidget,idElement){
        form = document.createElement("form");
        if (!(typeof idElement === 'undefined'))
            form.setAttribute('id', idWidget+idElement);
        form.classList.add("socialEye","form"+idWidget);
        return form;
    }

    this.getInput = function(idWidget,type,idElement) {
        input = document.createElement("input");
        input.type = type;
        if (!(typeof idElement === 'undefined'))
            input.setAttribute('id', idWidget+idElement);
        input.classname='input'+idWidget;
        input.classList.add('socialEyeInput'+type,'socialEye');
        return input;
    }

    this.getTextArea = function(idWidget,idElement){
        textarea = document.createElement("textarea");
        if (!(typeof idElement === 'undefined'))
            textarea.setAttribute('id', idWidget+idElement);
        textarea.classList.add( "form-control", "socialEye","textArea"+idWidget);
        textarea.type = 'text';
        return textarea;
    }

    this.getSubmitButton = function(idWidget,idElement){
        buttn = document.createElement("button");
        if (!(typeof idElement === 'undefined'))
            buttn.setAttribute('id', idWidget+idElement);
        buttn.classList.add('submitButton','socialEye',"button"+idWidget);
        return buttn;
    }

    this.getListButton = function(idWidget,idElement){
        buttn = document.createElement("button");
        if (!(typeof idElement === 'undefined'))
            buttn.setAttribute('id', idWidget+idElement);
        buttn.classList.add('listButton','socialEye',"button"+idWidget);
        return buttn;
    }

    this.getDiv = function(idWidget,idElement){
        div = document.createElement("div");
        if (!(typeof idElement === 'undefined'))
            div.setAttribute('id', idWidget+idElement);
        div.classList.add('socialEye');
        return div;
    }

    this.getSpan = function(idWidget,idElement){
        span = document.createElement("span");
        if (!(typeof idElement === 'undefined'))
            span.setAttribute('id', idWidget+idElement);
        span.classList.add('socialEye');
        return span;
    }
    this.getP = function(idWidget,idElement){
        p = document.createElement("p");
        if (!(typeof idElement === 'undefined'))
            p.setAttribute('id', idWidget+idElement);
        p.classList.add('socialEye');
        return p;
    }

    this.getA = function(idWidget,idElement){
        anchor = document.createElement("a");
        if (!(typeof idElement === 'undefined'))
            anchor.setAttribute('id', idWidget+idElement);
        anchor.classList.add('socialEye');
        return anchor;
    }

    this.getI = function(idWidget,idElement){
        tagI = document.createElement("i");
        if (!(typeof idElement === 'undefined'))
            tagI.setAttribute('id', idWidget+idElement);
        tagI.classList.add('socialEye');
        return tagI;
    }

    this.getLabel = function(idWidget,idElement,text){
        tagLabel = document.createElement("label");
        if (!(typeof idElement === 'undefined'))
            tagLabel.setAttribute('id', idWidget+idElement);
        tagLabel.classList.add('socialEye');
        tagLabel.innerHTML = text;
        return tagLabel;
    }


    this.getVideo = function(idWidget,idElement){
        tagVideo = document.createElement("video");
        if (!(typeof idElement === 'undefined'))
            tagVideo.setAttribute('id', idWidget+idElement);
        tagVideo.classList.add('socialEye');
        return tagVideo;
    }

    this.getBox = function(idWidget,title,idElement){
        divPrincipal = document.createElement("div");
        divPrincipal.classList.add("detailBox", "socialEye", idWidget);
        if (!(typeof idElement === 'undefined'))
            divPrincipal.setAttribute('id', idWidget+idElement);
        divTitulo = document.createElement("div");
        divTitulo.classList.add( "titleBox", "socialEye");
        divTitulo.setAttribute('id', "titulo"+idWidget);
        label = document.createElement("label");
        label.setAttribute('id', "label"+idWidget+idElement);
        label.classname='socialEye';
        label.innerHTML = title;
        boton = document.createElement("button");
        boton.setAttribute('id', 'cerrar'+idWidget + idElement);
        boton.classList.add('botonCerrar', 'socialEye', 'cerrar'+idWidget + idElement);
        boton['aria-hidden'] = "true";
        boton.innerHTML = '&times;';
        divTitulo.appendChild(label);
        divTitulo.appendChild(boton);
        divPrincipal.appendChild(divTitulo);
        $(boton).on('click',function (e) {
            document.getElementById(idWidget + idElement).remove();
        });
        return divPrincipal;
    }
}