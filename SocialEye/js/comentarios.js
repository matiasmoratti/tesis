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
        span.classList.add('date','sub-text');
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
    buttn=comentarios.getButton('agregarComentarioGeneral');
    buttn.innerHTML='Agregar';
    form.appendChild(textarea);
    form.appendChild(buttn);
    body.appendChild(form);
    ob.appendChild(body);
    return ob;
    //var commentBox = "<div class='detailBox socialEye' id='comentariosGenerales'>";
    //commentBox += "<div class='titleBox socialEye'>";
    //commentBox += "<label class='socialEye'>Comentarios Generales</label>";
    //commentBox += "<button type='button' class='close botonCerrar socialEye' id='cerrarBoxGenerales' aria-hidden='true'>&times;</button>";
    //commentBox += "</div>";
    //commentBox += "<div class='actionBox socialEye'>";
    //commentBox += "<ul id='listaComentariosGenerales' class='commentList socialEye'>";
    ////Creo los objetos
    //data = comentarios.getObjectsInUrl(window.location.href);
    //$.each(data, function (i, item) {
    //    commentBox += "<li class='socialEye'><div class='commentText socialEye'>";
    //    commentBox += "<span class='date sub-text socialEye'>" + item.username + " dijo el " + item.date + "</span>";
    //    commentBox += "<p class='socialEye'>" + item.element.texto + "</p>";
    //    commentBox += "</div>";
    //    commentBox += "</li>";
    //});
    //
    //
    //
    //commentBox += "</ul>";
    //commentBox += "<form class='form-inline socialEye' role='form'>";
    //commentBox += "<textarea class='form-control socialEye' id='textoComentarioGeneral' type='text' placeholder='Escribe un comentario' ></textarea>";
    //commentBox += "<button id='agregarComentarioGeneral' class='btn btn-primary socialEye'>Agregar</button>";
    //commentBox += "</form>";
    //commentBox += "</div>";
    //commentBox += "</div>";
    //return commentBox;
}

comentarios.onCloseWidget = function (){
    $("#textoComentarioGeneral").val("");
}


comentarios.onReady = function () {
    $("#"+comentarios.idWidget+"listaComentariosGenerales").scrollTop($("#"+comentarios.idWidget+"listaComentariosGenerales")[0].scrollHeight);
    $("#"+comentarios.idWidget+"cerrarBoxGenerales").on("click", function (event) {
        comentarios.close();
    });

    $("#"+comentarios.idWidget+"agregarComentarioGeneral").on('click', function (event) {
        if ($("#"+comentarios.idWidget+"textoComentarioGeneral").val() != "") {
            var c = {};
            c['texto'] = $("#"+comentarios.idWidget+"textoComentarioGeneral").val();
            //Funcion del framework que guarda los objetos
            result = comentarios.saveObject(c);
            if (result == true) {
                var parrafo = comentarios.getP();
                var span = comentarios.getSpan();
                span.setAttribute('class', 'date sub-text');
                var d = new Date();
                var hs = d.getHours();
                var mins = d.getMinutes();
                var secs = d.getSeconds();
                span.innerHTML = comentarios.getUser() + " dijo el " + $.datepicker.formatDate('dd-mm-yy', d) + " " + hs + ":" + mins + ":" + secs;
                parrafo.innerHTML = $("#"+comentarios.idWidget+"textoComentarioGeneral").val();
                var divComentario = comentarios.getDiv();
                divComentario.setAttribute('class', 'commentText');
                var lineaComentario = comentarios.getLi();
                //Uno los objetos
                divComentario.appendChild(span);
                divComentario.appendChild(parrafo);
                lineaComentario.appendChild(divComentario);
                $("#"+comentarios.idWidget+"listaComentariosGenerales").append(lineaComentario);
                $("#"+comentarios.idWidget+"textoComentarioGeneral").val("");
                $("#"+comentarios.idWidget+"listaComentariosGenerales").animate({scrollTop: $("#"+comentarios.idWidget+"listaComentariosGenerales")[0].scrollHeight});
            }
        }

        return false;
    });
}


