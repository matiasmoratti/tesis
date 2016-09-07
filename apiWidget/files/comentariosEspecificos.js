var especificos = new Widget();

especificos.loadWidget = function () {
    params = {};
    params.tipo = 'commentBox';
    items = especificos.getObjectsInUrl(window.location.href, params);
    var data = {items : items,
                file: 'comentariosEspecificos.html'};
    return data;
}

especificos.onReady = function (){
       $('body').on("click", '.iconoComentarioEspecifico', showSpecificBox);
        changeClickListeners();
}

especificos.onCloseWidget = function(){
    revertClickListeners();
}

function showSpecificBox(e){
        var tagAux;
        var boxElement;
        var elementClicked = document.getElementById(e.target.id);
        if(!($(elementClicked).hasClass("iconoClick"))){
            tagAux = getXPath(e.target);
        }
        else{
            tagAux = e.target.id;
        }

        params = {};
        params.tag = tagAux;
        params.tipo = 'commentBox';
        var boxObject = especificos.getObjectInUrl(window.location.href, params);
        if(boxObject == null){
            obj = {};
            obj.tag = tagAux;
            obj.tipo = 'commentBox';
            obj.positionLeft = e.pageX - 10;
            obj.positionTop = e.pageY - 10;
            especificos.saveObject(obj);
            params = {};
            params.tag = tagAux;
            params.tipo = 'commentBox';
            boxObject = especificos.getObjectInUrl(window.location.href, params);
            data = {positionTop : obj.positionLeft,                
                    positionLeft: obj.positionTop,
                    tag: tagAux};
            especificos.injectHtml('commentIcon.html',data);
        }

        positionLeft = boxObject.element.positionLeft - 25;
        positionTop = boxObject.element.positionTop - 25;

        datosComentarios = especificos.getObjectsInUrl(window.location.href, params);

        data = {idWidget : this.idWidget,
                    positionLeft: positionLeft,
                    positionTop: positionTop,
                    tag: tagAux,
                    items: datosComentarios};

        especificos.injectHtml('boxEspecifico.html',data);

        $(".agregarComentarioEspecifico").on('click',function (e) {
            var tag = e.target.id.substr(especificos.idWidget.toString().length + 17);
            var usuarioComentario = especificos.getUser();
            var textoComentarioTag = especificos.getWidgetElement("textoComentario" + tag);
            if (textoComentarioTag.value != "") {
                obj = {}
                obj['texto'] = textoComentarioTag.value;
                obj['tipo'] = 'comment';
                obj['tag'] = tag;
                result = especificos.saveObject(obj);
                if (result != 0) {
                    var parrafo = especificos.getP();
                    var span = especificos.getSpan();
                    span.setAttribute('class', 'sub-text');
                    var d = new Date();
                    var hs = d.getHours();
                    var mins = d.getMinutes();
                    var secs = d.getSeconds();
                    span.innerHTML = usuarioComentario + " dijo el " + $.datepicker.formatDate('dd-mm-yy', d) + " " + hs + ":" + mins + ":" + secs;
                    parrafo.innerHTML = textoComentarioTag.value;
                    var divComentario = especificos.getDiv();
                    divComentario.setAttribute('class', 'commentText');
                    var lineaComentario = especificos.getLi();
                    //Uno los objetos
                    divComentario.appendChild(span);
                    divComentario.appendChild(parrafo);
                    lineaComentario.appendChild(divComentario);
                    $(especificos.getWidgetElement("listaComentario" + tag)).append(lineaComentario);
                    $(textoComentarioTag).val("");
                    $(especificos.getWidgetElement("listaComentario" + tag)).animate({scrollTop: $(especificos.getWidgetElement("listaComentario" + tag))[0].scrollHeight});
                }
            }
            return false;
        });
}



function getXPath(element) {
        var val = element.value;
        var xpath = '';
        for (; element && element.nodeType == 1; element = element.parentNode) {
            var id = $(element.parentNode).children(element.tagName).index(element) + 1;
            id > 1 ? (id = '[' + id + ']') : (id = '');
            xpath = '/' + element.tagName.toLowerCase() + id + xpath;
        }
        return xpath;
}

function toArray(arraylike) {
        var array = new Array(arraylike.length);
        for (var i = 0, n = arraylike.length; i < n; i++)
            array[i] = arraylike[i];
        return array;
}

function changeClickListeners() {
        var all = toArray(document.getElementsByTagName('a')).concat(toArray(document.getElementsByTagName('div')));
        for (var i = 0, max = all.length; i < max; i++) {
                all[i]._onclick = all[i].onclick;
                all[i].onclick = function (e) {
                    if(!($(e.target).parents().hasClass('socialEye'))){
                        e.stopPropagation();
                        e.preventDefault();
                        showSpecificBox(e);
                    }
                }
        }
}

function revertClickListeners() {
        var all = toArray(document.getElementsByTagName('a')).concat(toArray(document.getElementsByTagName('div')));
        for (var i = 0, max = all.length; i < max; i++) {
            if(!($(all[i]).parents().hasClass('socialEye')))
                all[i].onclick = all[i]._onclick;
        }
}
