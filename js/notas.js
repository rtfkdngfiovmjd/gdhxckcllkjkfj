$(function(){
    $(document).on('click', '#atualizar-notas', function() {
        $('#coteudo-notas').hide();
        $('#load').show();
        carrega_notas_adx(true);
    });
    $(document).on('click','.disciplina',function(event){
        var disciplina = $(this).attr('data-key');
        $('body').load('disciplina.html',function(){
            carrega_pagina(disciplina);
        });
    });
});

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
        error: function(x, t, m) {
            notas = JSON.parse(localStorage.getItem('notas'));
            if (gerar_html) {
                if(t==="timeout"){
                    notification('Erro, tente novamente!', 'notification-error');
                }
                else{
                    notification('Sem conexão com a internet!', 'notification-error');
                    gera_html_notas();
                }
            }
        }
    });
}


function gera_html_notas() {
    $('#nome-usuario').html(aluno + ' - ' + nome);
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
                                            <a class="disciplina navigate-right" data-key="' + key + '">\
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

function get_class_nota(nota, valor) {
    if (isNaN(nota)) {
        return false;
    } else if (parseFloat(nota) >= parseFloat(valor) * 0.7) {
        return 'badge-primary';
    } else {
        return 'badge-negative';
    }
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