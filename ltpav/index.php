<?php
header("Content-type:application/json");
header('Access-Control-Allow-Origin: *');
header("Content-type:text/html; charset=utf-8");
$con = mysqli_connect("45.84.204.103", "u686881845_koronamap", "g20011219", "u686881845_api");
$con -> set_charset("utf8");
mysqli_query("SET NAMES 'utf8'");

if(!$con){
	die('Could not connect: '.mysql_error());
}

$result = mysqli_query($con, "SELECT * FROM world");

while($row = mysqli_fetch_assoc($result)){
	$output[]=$row;
}

print(json_encode($output, JSON_PRETTY_PRINT));

mysqli_close($con);
?>
