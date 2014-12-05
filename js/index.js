var BASE_URL = 'http://sicof.doctum.edu.br/';
var aluno = localStorage.getItem('aluno');
var unidade = localStorage.getItem('unidade');
var nome = localStorage.getItem('nome');
var data_atualizacao_mural = localStorage.getItem('data_atualizacao_mural');
var data_atualizacao_notas = localStorage.getItem('data_atualizacao_notas');
var pagina_atual = 'login';
var lembrar = null;
var notas;
var mural;

$(function(){
    document.addEventListener("deviceready",function() {
        onDeviceReady();
        //botão de voltar do android
        document.addEventListener("backbutton", botao_voltar, false);
        $.ajaxSetup({headers: {"Pragma": "no-cache", "Cache-Control": "no-cache"}});
    },false);
    $(document).on('click', '#atualizar-notas', function() {
        $('#coteudo-notas').hide();
        $('#load').show();
        carrega_notas_adx(true);
    });
    $(document).on('click', '#atualizar-mural', function() {
        $('#conteudo-mural').hide();
        $('#load').show();
        carrega_mural_adx();
    });
    //Sair da aplicação
    $(document).on('click', '#sair', function() {
        sair();
    });
    $(document).on('click', '#notas, #voltar-notas', function() {
        $('body').load('notas.html', function() {
            carrega_pagina();
        });
    });
    $(document).on('click', '#mural', function() {
        $('body').load('mural.html', function() {
            carrega_pagina();
        });
    });
    $(document).on('keyup','#aluno', function(){
       if ($('#aluno').val().length == 9){
           $('#senha').focus();
       }
    });
    $(document).on('click','.limpar',function(){
        $('#aluno').val('');
        $('#senha').val('');
        $('#unidade').val('');
    });

    var returnFalse = function(){
        return false;
    }

    var closePopover = function(){
        $('#popover').hide();
        $('#popover-link').bind('click',openPopover);
        $('body').unbind('click',closePopover);
        return false;
    };

    var openPopover =function(){
        $('#popover').show();
        $('body').bind('click',closePopover);
        $('#popover').bind('click',returnFalse);
        $('#popover-link').unbind('click',openPopover);
        return false;
    };

    $(document).on('click','#popover-link',openPopover);

    //Entrar na aplicação
    $(document).on('click', '#entrar', function() {
        if ($("#unidade").val() == "") {
            notification('Informe a unidade!', 'notification-error');
            return false;
        }
        if ($("#aluno").val() == "") {
            notification('Informe seu usuário!', 'notification-error');
            return false;
        }
        if ($("#senha").val() == "") {
            notification('Informe sua senha!', 'notification-error');
            return false;
        }
        $.ajax({
            type: 'GET', // defaults to 'GET'
            url: BASE_URL + 'loginMobile.php',
            data: {
                unidade: $("#unidade").val(),
                aluno: $("#aluno").val(),
                senha: $("#senha").val()
            },
            dataType: 'json', //'json', 'xml', 'html', or 'text'
            async: true,
            success: function(dados) {
                if (dados.erro == 1) {
                    notification('Dados incorretos!', 'notification-error');
                } else {
                    aluno = $("#aluno").val();
                    unidade = $("#unidade").val();
                    nome = dados.nome;
                    lembrar = $("#lembrar")[0].checked;
                    if (lembrar) {
                        localStorage.setItem('aluno', aluno);
                        localStorage.setItem('unidade', unidade);
                        localStorage.setItem('nome', nome);
                    }
                    pagina_atual = 'mural';
                    $('body').load("mural.html");
                    carrega_mural_adx();
                    carrega_notas_adx();
                };
            },
            error: function() {
                notification('Sem conexão com a internet!', 'notification-error')
            }
        });
    });

    //Se o aluno existir já entra na aplicação
    if (aluno != null && unidade != null) {
        lembrar = true;
        $('#tela').show();
        pagina_atual = 'mural';
        $('body').load("mural.html");
        carrega_notas_adx();
        carrega_mural_adx();
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
}

function get_class_nota(nota, valor) {
    if (isNaN(nota)) {
        return false;
    } else if (parseFloat(nota) >= parseFloat(valor) * 0.7) {
        return 'badge-primary';
    } else {
        return 'badge-negative';
    }
}

function carrega_notas_adx(gerar_html) {
    verifica_usuario();
    $.ajax({
        type: 'GET', // defaults to 'GET'
        url: BASE_URL + 'notasMobile.php',
        data: {
            aluno: aluno,
            unidade: unidade
        },
        dataType: 'json', //'json', 'xml', 'html', or 'text'
        async: true,
        success: function(dados) {
            notas = remove_espaco_nome_disciplina(dados.disciplinas);
            data_atualizacao_notas = dados.hora;
            if (lembrar) {
                localStorage.setItem('notas', JSON.stringify(notas));
                localStorage.setItem('data_atualizacao_notas', dados.hora);
            }
            if (gerar_html) {
                gera_html_notas();
            }
        },
        error: function() {
            notas = JSON.parse(localStorage.getItem('notas'));
            if (gerar_html) {
                notification('Sem conexão com a internet!', 'notification-error')
            }
            if (gerar_html) {
                gera_html_notas();
            }
        }
    });
}


function gera_html_notas() {
    $('#lista-notas').html('');
    $('#lista-notas').append('\
                            <p class="atualizado" id="atualizado-notas">\
                                '+data_atualizacao_notas+'\
                            </p>');
    for (var key in notas) {
        var nota = parseFloat(notas[key].nota).toFixed(1);
        $('#lista-notas').append('\
                                <div class="card">\
                                    <ul class="table-view">\
                                        <li class="table-view-cell">\
                                            <a onclick="$(\'body\').load(\'disciplina.html\',function(){carrega_pagina(\'' + key + '\');})" class="disciplina navigate-right">\
                                                <span class="badge ' + get_class_nota(nota, 100) + '">\
                                                    ' + ((isNaN(nota)) ? "-" : nota) + '\
                                                </span>\
                                                <span class="nome-azul">\
                                                    ' + notas[key].nome + '\
                                                </span>\
                                            </a>\
                                        </li>\
                                    </ul>\
                                </div>');
    }
    $('#load').hide();
    $('#coteudo-notas').show();
}

function gerar_html_disciplina(disciplina) {
    var agendamentos = '';
    $('#conteudo').html('');
    $('#conteudo').append('\
                        <ul class="table-view">\
                            <li class="table-view-cell titulo">\
                                <span class="badge badge-inverted nome">\
                                    Nota\
                                </span>Agendamentos\
                                <p class="nome">\
                                    ' + disciplina + '\
                                </p>\
                            </li>\
                        </ul>');
    $('#conteudo').append('\
                    <p class="atualizado atualizado-disciplina" id="atualizado-notas">\
                        '+data_atualizacao_notas+'\
                    </p>');
    var faltas = '\
                <div class="card">\
                    <ul class="table-view">\
                        <li class="table-view-cell" style="text-align: justify">\
                            <span class="nome-azul">Faltas</span>\
                            <p>Encontros: '+notas[disciplina].faltas.aulas+'</p>\
                            <span class="badge badge-inverted"><a class="not-active" id="popover-link" href="#popover"><span class="icon icon-info vermelho"></span></a></span>\
                            <p>APS: '+((notas[disciplina].faltas.aps == null)? "0" : notas[disciplina].faltas.aps)+'</p>\
                            <p>Total: '+notas[disciplina].faltas.total+'</p>\
                        </li>\
                    </ul>\
                </div>\
                <div id="popover" class="popover-container">\
                    <p>O cálculo das faltas é feito convertendo os 50 minutos de cada falta em horas, somando com as horas de APS não entregues e arredondando sempre para baixo.<br />\
                        Exemplo: <br />\
                        Encontros: 7 -> 5,83 horas<br />\
                        Aps: 1<br />\
                        Total = 1 + 5,83 = 6,83<br />\
                        Arredondando para baixo o total será igual a 6 faltas\
                    </p>\
                </div>';
    $('#conteudo').append(faltas);
    for (var key in notas[disciplina].etapas) {
        if ("" == key) {
            var mensagem = '\
                    <div class="card">\
                        <ul class="table-view">\
                            <li class="table-view-cell" style="text-align: justify">\
                                Ainda não existe agendamentos para essa disciplina!\
                            </li>\
                        </ul>\
                    </div>';
            $('#conteudo').append(mensagem);
        } else {
            agendamentos = '';
            var etapa_nota = parseFloat(notas[disciplina].etapas[key].nota).toFixed(1);
            $('#conteudo').append('\
                        <ul class="table-view etapa">\
                            <li class="table-view-cell etapa-nome">\
                                <span class="badge ' + get_class_nota(etapa_nota, notas[disciplina].etapas[key].pontos) + '">\
                                    ' + ((isNaN(etapa_nota)) ? "-" : etapa_nota) + '\
                                </span>' + key + '\
                            </li>\
                        </ul>');
            agendamentos = agendamentos + '\
                                    <div class="card">\
                                        <ul class="table-view">';
            for (var key2 in notas[disciplina].etapas[key].agenda) {
                var nota = parseFloat(notas[disciplina].etapas[key].agenda[key2].nota).toFixed(1);
                var valor = notas[disciplina].etapas[key].agenda[key2].valor;
                var horas = notas[disciplina].etapas[key].agenda[key2].horas;
                var horas_computadas = notas[disciplina].etapas[key].agenda[key2].horas_computadas;
                if(horas_computadas == 'nao'){
                    horas_computadas = '<span class="vermelho">Não aceito</span>'
                }
                else if(horas_computadas == 'sim'){
                    horas_computadas = '<span class="azul">Aceito</span>'
                }
                else if(horas_computadas == null){
                    horas_computadas = 'Aguardando aprovação'
                }
                agendamentos = agendamentos + '\
                                        <li class="table-view-cell">\
                                            <span class="badge ' + get_class_nota(nota, notas[disciplina].etapas[key].agenda[key2].valor) + '">\
                                                ' + ((isNaN(nota)) ? "-" : nota) + '\
                                            </span>\
                                            <span class="nome-azul">\
                                                ' + notas[disciplina].etapas[key].agenda[key2].nome + '\
                                            </span>\
                                            <p>\
                                                Data: ' + notas[disciplina].etapas[key].agenda[key2].data + '\
                                            </p>\
                                            <p>\
                                                Valor: ' + ((valor == null) ? '-' : valor) + '\
                                            </p>\
                                            ' + ((horas == 0) ? '' : '\
                                                                    <p>\
                                                                        Horas: ' + horas + '\
                                                                    </p>\
                                                                    <p>\
                                                                        Status: ' + horas_computadas + '\
                                                                    </p>') + '\
                                        </li>';
            }
            agendamentos = agendamentos + '\
                                        </ul>\
                                    </div>';
            $('#conteudo').append(agendamentos);
        }
    }
    $('#load').hide();
    $('#conteudo').show();
}

function gerar_html_mural() {
    $('#lista-mural').html('');
    $('#modais').html('');
    $('#nome-usuario').html(aluno + ' - ' + nome);
    $('#lista-mural').append('\
                        <p class="atualizado" id="atualizado-mural">\
                            '+data_atualizacao_mural+'\
                        </p>');
    if (mural == "") {
        $('#lista-mural').append('\
                            <div class="card">\
                                <ul class="table-view">\
                                    <li class="table-view-cell" style="text-align: justify">\
                                        Você não possui avisos!\
                                    </li>\
                                </ul>\
                            </div>');
    } else {
        for (var key in mural) {
            $('#lista-mural').append('\
                                <div class="card">\
                                    <ul class="table-view">\
                                        <li class="table-view-cell media">\
                                            <a onclick="altera_conteudo_modal(\'' + mural[key].assunto + '\',\'' + mural[key].data + '\',\'' + valida_remetente(mural[key].remetente) + '\',\'<pre>' + encodeURI(mural[key].texto) + '</pre>\')" href="#myModal">\
                                                <div class="media-body">\
                                                    <span class="nome-azul">\
                                                        ' + mural[key].assunto + '\
                                                    </span>\
                                                    <p>\
                                                        Toque para visualizar\
                                                    </p>\
                                                </div>\
                                            </a>\
                                        </li>\
                                    </ul>\
                                </div>');
        }
        $('body').append('\
                    <div id="myModal" class="modal">\
                        <header class="bar bar-nav">\
                            <a id="fechar-modal" onclick="pagina_atual = \'mural\'" class="icon icon-left-nav pull-left" href="#myModal">\
                            </a>\
                            <h1 class="title titulo-modal">\
                                AVISOS\
                            </h1>\
                        </header>\
                        <div class="modal-content content">\
                            <ul class="table-view">\
                                <li class="table-view-cell titulo titulo-aviso">\
                                </li>\
                            </ul>\
                            <div class="card">\
                                <span id="data">\
                                </span>\
                                <br />\
                                <span id="remetente">\
                                </span>\
                            </div>\
                            <div class="card content-padded">\
                                <p class="texto-aviso">\
                                </p>\
                            </div>\
                        </div>\
                    </div>');
    }
    $('#load').hide();
    $('#conteudo-mural').show();
}

function carrega_mural_adx() {
    verifica_usuario();
    $.ajax({
        type: 'GET', // defaults to 'GET'
        url: BASE_URL + 'muralMobile.php',
        data: {
            aluno: aluno,
            unidade: unidade
        },
        dataType: 'json', //'json', 'xml', 'html', or 'text'
        async: true,
        success: function(dados) {
            mural = JSON.parse(JSON.stringify(dados).replace('\\n', '<br />')).mural;
            data_atualizacao_mural = dados.hora;
            if (lembrar) {
                var d = new Date();
                localStorage.setItem('mural', JSON.stringify(mural).replace('\\n', '<br />'));
                localStorage.setItem('data_atualizacao_mural', dados.hora);
            }

            gerar_html_mural();
        },
        error: function() {
            mural = JSON.parse(localStorage.getItem('mural'));
            notification('Sem conexão com a internet!', 'notification-error')
            gerar_html_mural();
        }
    });
}

function remove_espaco_nome_disciplina(dados) {
    var key_sem_espaco;
    for (var key in dados) {
        key_sem_espaco = key.trim();
        if (key_sem_espaco != key) {
            dados[key_sem_espaco] = dados[key];
            delete dados[key];
        }
    }
    return dados;
}

function remove_tag_string(html) {
    var div = document.createElement("div");
    div.innerHTML = html;
    var text = div.textContent || div.innerText || "";
    return text;
}

function valida_remetente(text) {
    if (text == null) {
        return 'Não informado'
    } else {
        return text;
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

function altera_conteudo_modal(assunto, data, remetente, text) {
    $('.titulo-aviso').html(assunto);
    $('#data').html('Data: ' + data);
    $('#remetente').html('De: ' + remetente);
    $('.texto-aviso').html(decodeURI(text));
    $('.texto-aviso').find('a').each(function() {
        $(this).attr('onclick', 'window.open("' + $(this).attr('href') + '", "_system")');
        $(this).removeAttr('href');
    });
    pagina_atual = 'mural-modal';
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
        });
    } else if (pagina_atual == 'disciplina') {
        $('body').load('notas.html', function() {
            carrega_pagina();
        });
    } else if (pagina_atual == 'mural-modal') {
        $('#myModal').removeClass('active');
    }
    return false;
}

function onDeviceReady() {
    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-49234389-3']);
    _gaq.push(['_setDomainName', 'none']);
    _gaq.push(['_trackPageview', 'Ready']);
    alert('top');
}