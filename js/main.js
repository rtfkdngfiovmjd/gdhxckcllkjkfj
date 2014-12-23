var BASE_URL = 'http://sicof.doctum.edu.br/';
var aluno = localStorage.getItem('aluno');
var unidade = localStorage.getItem('unidade');
var nome = localStorage.getItem('nome');
var data_atualizacao_mural = localStorage.getItem('data_atualizacao_mural');
var data_atualizacao_notas = localStorage.getItem('data_atualizacao_notas');
var data_atualizacao_boletos = localStorage.getItem('data_atualizacao_boletos');
var pagina_atual = 'login';
var lembrar = null;
var notas;
var mural;
var boletos;

$(function(){
    document.addEventListener("deviceready",function() {
        //botão de voltar do android
        document.addEventListener("backbutton", botao_voltar, false);
        $.ajaxSetup({headers: {"Pragma": "no-cache", "Cache-Control": "no-cache"}});
    },false);
    //Sair da aplicação
    $(document).on('click', '#sair', function() {
        sair();
    });
    $(document).on('click', '#notas, #voltar-notas', function() {
        $('body').load('notas.html', function() {
            carrega_pagina();
            $('#menu').load('menu.html',function(){
                $('#notas').addClass('item-ativo').next('hr').addClass('hr-ativo');
            });
        });
    });
    $(document).on('click', '#mural', function() {
        $('body').load('mural.html', function() {
            carrega_pagina();
            $('#menu').load('menu.html', function(){
                $('#mural').addClass('item-ativo').next('hr').addClass('hr-ativo');
            });
        });
    });
    $(document).on('click', '#financeiro', function() {
        $('body').load('financeiro.html', function() {
            carrega_pagina();
            $('#menu').load('menu.html', function(){
                $('#financeiro').addClass('item-ativo').next('hr').addClass('hr-ativo');
            });
        });
    });
    var exibeMenu = function(){
        $('#menu').animate({"left": '0%'},500);
        $("#menu").scrollTop(0);
        $('#container').animate({"left": '70%'},500);
        $('#container').bind('click',escondeMenu);
        $('#abre-menu').unbind('click',exibeMenu);
        return false;
    }
    var escondeMenu = function(event){
        $('#menu').animate({"left": '-70%'},500);
        $('#container').animate({"left": '0%'},500);
        $('#container').unbind('click',escondeMenu);
        $('#abre-menu').bind('click',exibeMenu);
        return false;
    }

    $(document).on('click','#abre-menu',exibeMenu);

    $('*').swipe({
        swipeRight:function() {
            if(pagina_atual == 'mural' || pagina_atual == 'notas' || pagina_atual == 'financeiro'){
                exibeMenu();
            }
        },
        swipeLeft:function() {
            if(pagina_atual == 'mural' || pagina_atual == 'notas' || pagina_atual == 'financeiro'){
                escondeMenu();
            }
        },
        excludedElements: ""
    });

    //Se o aluno existir já entra na aplicação
    if (aluno != null && unidade != null) {
        lembrar = true;
        $('#tela').show();
        pagina_atual = 'mural';
        $('body').load("mural.html", function () {
            $('#menu').load('menu.html', function(){
                $('#mural').addClass('item-ativo').next('hr').addClass('hr-ativo');
            });
        });
        carrega_notas_adx();
        carrega_mural_adx();
        carrega_financeiro_adx();
    } else {
        pagina_atual = 'login';
        $('body').load("login.html");
        $('#tela').show();
    }

    setInterval(function() {
        $('#atualizado-mural').html(data_atualizacao_mural);}, 1000);
    setInterval(function() {
        $('#atualizado-notas').html(data_atualizacao_notas);}, 1000);
});

function carrega_pagina(disciplina) {
    pagina_atual = $('.content').attr('data-page');
    if (pagina_atual == 'notas') {
        gera_html_notas();
    } else if (pagina_atual == 'disciplina') {
        gerar_html_disciplina(disciplina);
    } else if (pagina_atual == 'mural') {
        gerar_html_mural();
    }
    else if (pagina_atual == 'financeiro') {
        gera_html_boletos();
    }
}

function sair() {
    localStorage.clear();
    notas = null;
    lembrar = null;
    aluno = null;
    unidade = null;
    nome = null;
    mural = null;
    data_atualizacao_mural = null;
    data_atualizacao_notas = null;
    pagina_atual = 'login';
    $('body').load('login.html');
    return false;
}

function verifica_usuario() {
    if (aluno == null || unidade == null) {
        alert('Algo aconteceu e você não está mais logado!');
        sair();
    }
}

function notification(text, classe) {
    $('.notification').remove();
    $('body').append($('<div class="notification ' + classe + '"><p>' + text + '</p></div>').hide().fadeIn(800));
    $(document).on('click', 'body', function() {
        $('.notification').fadeOut(800, function() {
            $(this).remove();
        });
    });
    setTimeout(function() {
        $('.notification').fadeOut(800, function() {
            $(this).remove();
        });
    }, 5000);
}

function botao_voltar() {
    if (pagina_atual == 'mural') {
        navigator.app.exitApp();
        return false;
    } else if (pagina_atual == 'notas') {
        $('body').load('mural.html', function() {
            carrega_pagina();
            $('#menu').load('menu.html', function(){
                $('#mural').addClass('item-ativo').next('hr').addClass('hr-ativo');
            });
        });
    } else if (pagina_atual == 'disciplina') {
        $('body').load('notas.html', function() {
            carrega_pagina();
            $('#menu').load('menu.html', function(){
                $('#notas').addClass('item-ativo').next('hr').addClass('hr-ativo');
            });
        });
    } else if (pagina_atual == 'mural-modal') {
        $('#myModal').removeClass('active');
    } else if (pagina_atual == 'financeiro') {
        $('body').load('mural.html', function() {
            carrega_pagina();
            $('#menu').load('menu.html', function(){
                $('#mural').addClass('item-ativo').next('hr').addClass('hr-ativo');
            });
        });
    }
    return false;
}