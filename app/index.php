<?php
$lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
switch ($lang){
  case "it":
    header("Location: https://www.faustomiceli.me/it");
    break;
  case "en":
    header("Location: https://www.faustomiceli.me/en");
    break;
  default:
    header("Location: https://www.faustomiceli.me/en");
    break;
}
?>
