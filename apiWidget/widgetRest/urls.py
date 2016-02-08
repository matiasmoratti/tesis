from django.conf.urls import url,include

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^comments/', views.comments, name='comments'),
    url(r'^specific_comments/', views.specific_comments, name='specific_comments'),
    url(r'^registration/', views.registration, name='registration'),
    url(r'^logout/', views.logout, name='logout'),
    url(r'^user_ping/', views.user_ping, name='user_ping'),
    url(r'', include('tokenapi.urls')),
    url(r'^poll_list/', views.poll_list, name='poll_list'),
    url(r'^poll_add/', views.poll_add, name='poll_add'),
     url(r'^poll_vote/', views.poll_vote, name='poll_vote'),
    # url(r'^usuariosActivos/', views.usuariosActivos, name='usuariosActivos'),
]
