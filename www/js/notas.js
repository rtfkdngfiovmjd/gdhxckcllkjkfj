var BASE_URL = 'http://sicof.doctum.edu.br/';
var aluno = localStorage.getItem('aluno');
var unidade = localStorage.getItem('unidade');
$(function(){
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
        	for(var key in ret){
                console.log(ret[key]);
                $('.table-view').append('<li class="table-view-cell"><a class="navigate-right"><span class="badge '+get_class_nota(ret[key].nota)+'">'+ret[key].nota+'</span>'+ret[key].nome+'</a></li>');
        	}
        },
    });
});

function get_class_nota(nota){
    if(nota >= 70){
        return 'badge-positive';
    }
    else{
        return 'badge-negative';
    }
}