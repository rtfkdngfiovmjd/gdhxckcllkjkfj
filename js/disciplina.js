$(function(){
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
});

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
                            <span class="badge badge-inverted"><a class="not-active" id="popover-link" href="#popover"><span class="icon icon-info-circled vermelho"></span></a></span>\
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