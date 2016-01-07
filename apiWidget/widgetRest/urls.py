from django.conf.urls import url,include

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^comments/', views.comments, name='comments'),
    url(r'^specific_comments/', views.specific_comments, name='specific_comments'),
    url(r'^login/', views.login, name='login'),
    url(r'^registration/', views.registration, name='registration'),
    url(r'^logout/', views.logout, name='logout'),
    url(r'^user_ping/', views.user_ping, name='user_ping'),
    url(r'', include('tokenapi.urls')),
    # url(r'^usuariosActivos/', views.usuariosActivos, name='usuariosActivos'),
]
