<?php
/**
 * Created by PhpStorm.
 * User: crazyming.cn
 * Date: 2018/4/23
 * Time: 1:32
 */
header('content-type:text/html;charset=utf-8');
date_default_timezone_set('PRC');
$filename = "msg.txt";
$msg = [];

if (isset($_POST['sub'])) {
    $message = strip_tags($_POST['area']);
    $name = strip_tags($_POST['name']);
    $phone = strip_tags($_POST['phone']);
    $time = time();
    $arr = compact('message', 'name', 'phone', 'time');
    array_push($msg, $arr);
    $msg = serialize($msg);
    if (file_put_contents($filename, $msg)) {

        echo "<script>alert('登记成功');location.href='cooperate.html'</script>";
    }
}
?>
