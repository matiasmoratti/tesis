var comentarios = new Widget();
comentarios.descripcion = "Permite realizar comentarios entre los usuarios sobre una web en particular.";
comentarios.icono = "commenting";
comentarios.tittle = "Comentarios Generales";
comentarios.loadWidget = function () {
    ob = comentarios.getPrincipalBox('comentariosGenerales',comentarios.tittle);
    body = comentarios.getPrincipalBody('principalGenerales');
    lista = comentarios.getPrincipalList('listaComentariosGenerales');
    //Creo los objetos
    data = comentarios.getObjectsInUrl(window.location.href);
    $.each(data, function (i, item) {
        li = comentarios.getLi();
        div = comentarios.getDiv();
        div.classList.add('commentText');
        span = comentarios.getSpan();
        span.classList.add('sub-text');
        span.innerHTML=item.username + " dijo el " + item.date;
        p = comentarios.getP();
        p.innerHTML=item.element.texto;
        div.appendChild(span);
        div.appendChild(p);
        li.appendChild(div);
        //li.innerHTML=div;
        lista.appendChild(li);
    });
    body.appendChild(lista);
    form=comentarios.getForm('');
    textarea=comentarios.getTextArea('textoComentarioGeneral');
    textarea.placeholder = 'Escriba su comentario...';
    buttn=comentarios.getSubmitButton('agregarComentarioGeneral');
    buttn.innerHTML='Agregar';
    form.appendChild(textarea);
    form.appendChild(buttn);
    body.appendChild(form);
    ob.appendChild(body);
    return ob;    
}

comentarios.onCloseWidget = function (){
    $("#textoComentarioGeneral").val("");
}


comentarios.onReady = function () {
    $("#"+comentarios.idWidget+"listaComentariosGenerales").scrollTop($("#"+comentarios.idWidget+"listaComentariosGenerales")[0].scrollHeight);
    $("#"+comentarios.idWidget+"cerrarBoxGenerales").on("click", function (event) {
        comentarios.close();
    });

    $(comentarios.getWidgetElement("agregarComentarioGeneral")).on('click', function (event) {
        if ($(comentarios.getWidgetElement("textoComentarioGeneral")).val() != "") {
            var c = {};
            c['texto'] = $(comentarios.getWidgetElement("textoComentarioGeneral")).val();
            result = comentarios.saveObject(c);
            if (result != 0) {
                var parrafo = comentarios.getP();
                var span = comentarios.getSpan();
                span.setAttribute('class', 'date sub-text');
                var d = new Date();
                var hs = d.getHours();
                var mins = d.getMinutes();
                var secs = d.getSeconds();
                span.innerHTML = comentarios.getUser() + " dijo el " + $.datepicker.formatDate('dd-mm-yy', d) + " " + hs + ":" + mins + ":" + secs;
                parrafo.innerHTML = $(comentarios.getWidgetElement("textoComentarioGeneral")).val();
                var divComentario = comentarios.getDiv();
                divComentario.setAttribute('class', 'commentText');
                var lineaComentario = comentarios.getLi();
                //Uno los objetos
                divComentario.appendChild(span);
                divComentario.appendChild(parrafo);
                lineaComentario.appendChild(divComentario);
                listaAux = comentarios.getWidgetElement("listaComentariosGenerales");
                $(listaAux).append(lineaComentario);
                $(comentarios.getWidgetElement("textoComentarioGeneral")).val("");
                $(listaAux).animate({scrollTop: $(listaAux)[0].scrollHeight});
            }
        }

        return false;
    });
}


