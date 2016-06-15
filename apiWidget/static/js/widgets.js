/**
 * Created by ferminrecalt on 19/5/16.
 */
$(function () {
    $('.removeLink').on('click', function (e) {
        e.preventDefault();
        link=this.href;
        bootbox.confirm({
            title: 'Eliminar Widget',
            message: 'Esta seguro de eliminar el widget?',
            buttons: {
                'cancel': {
                    label: 'No',
                    className: 'btn-default pull-left'
                },
                'confirm': {
                    label: 'Si',
                    className: 'btn-danger pull-right'
                }
            },
            callback: function (result) {
                if (result==true)
                    window.location=link;
                else return true;
            }
        });
    });
});