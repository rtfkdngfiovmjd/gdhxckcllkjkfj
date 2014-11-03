var BASE_URL = 'http://sicof.doctum.edu.br/';
localStorage.clear();
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

        	}
            console.log(ret);
        },
    });
});