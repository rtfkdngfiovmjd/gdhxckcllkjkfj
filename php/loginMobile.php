<?php 
header('Access-Control-Allow-Origin: *');
$db = mysql_connect('192.168.10.238','root','xad11doc'); 

$unidades["1"] = "crgola";
$unidades["2"] = "ctga";
$unidades["3"] = "cat";
$unidades["4"] = "gpi";
$unidades["5"] = "iuna";
$unidades["6"] = "ipa";
$unidades["7"] = "jm";
$unidades["8"] = "jf";
$unidades["9"] = "leo";
$unidades["10"] = "mhu";
$unidades["11"] = "serra";
$unidades["12"] = "to";
$unidades["13"] = "vila";
$unidades["14"] = "vitoria";

mysql_select_db('harrison_ctga', $db); 

$result = mysql_query("set names 'utf8'"); 
$query = "SELECT CONCAT(substring_index(trim(nome),' ',1),' ',substring_index(trim(nome),' ',-1))
	FROM acess_usuario u
	INNER JOIN acad_aluno a ON a.codigo = u.user_aluno
	WHERE login ='{$_GET['aluno']}'
	AND senha = PASSWORD('{$_GET['senha']}')
	";

$result = mysql_query($query)or die(mysql_error()); 
//echo $query;
//print_r($_GET);
//print_r($_POST);
$row = mysql_fetch_row($result);
if(mysql_num_rows($result)>0){
	echo json_encode(array('erro'=>0,'nome'=>ucwords(strtolower($row[0]))));
}else{
	echo json_encode(array('erro'=>1,'q'=>$query,'p'=>$_POST,'g'=>$_GET));
}
?> 
