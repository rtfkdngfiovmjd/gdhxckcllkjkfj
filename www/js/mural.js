var BASE_URL = 'http://sicof.doctum.edu.br/';
var aluno = localStorage.getItem('aluno');
var unidade = localStorage.getItem('unidade');
pagina_atual = 'mural';
//Carrega notas quando abrir app pela primeira vez
$(function(){
	carrega_notas();
	$(document).on('click','#atualizar-notas',function(){
		$('#lista-notas').hide();
		$('#load').show();
		carrega_notas();
		exibe_notas('atualiza');
		alert(pagina_atual);
	});
});


function exibe_notas(acao){
	if(acao != 'atualiza'){
		pagina_atual = altera_pagina(pagina_atual);
	}
	if(pagina_atual == 'notas'){
		gera_html_notas();
	    $('#load').hide();
	    $('#lista-notas').show();
	}	
}

function get_class_nota(nota){
    if(nota >= 70){
        return 'badge-primary';
    }
    else{
        return 'badge-negative';
    }
}

function altera_pagina(pagina){
	if (pagina == 'mural') {
		return 'notas';
	}
	else{
		return 'mural';
	}
}

function carrega_notas(){
	$.ajax({
        type: 'GET', // defaults to 'GET'
        url: BASE_URL+'notasMobile.php',
        data:{
            aluno:aluno,
			unidade:unidade
        },
        dataType: 'json', //'json', 'xml', 'html', or 'text'
        async: true,
        success: function(ret) {
        	alert('carregou');
        	localStorage.setItem('ret',JSON.stringify(ret));
        },
    });
}

function gera_html_notas(){
	var ret = jQuery.parseJSON(localStorage.getItem('ret'));
	$('.table-view').html('');
	for(var key in ret){
        $('.table-view').append('<li class="table-view-cell"><a class="navigate-right"><span class="badge '+get_class_nota(ret[key].nota)+'">'+ret[key].nota+'</span>'+ret[key].nome+'</a></li>');
	}
}

window.addEventListener('push', exibe_notas);