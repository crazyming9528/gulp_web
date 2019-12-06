<?php
/**
 * Created by PhpStorm.
 * User: crazyming.cn
 * Date: 2018/4/23
 * Time: 1:50
 */
header('content-type:text/html;charset=utf-8');
date_default_timezone_set('PRC');
$filename = "msg.txt";
$msg = [];
if (file_exists($filename)) {
    $content = file_get_contents($filename);
    if (strlen($content) > 0) {
        $msg = unserialize($content);
    }
}


if (isset($_POST['del'])) {


          file_put_contents($filename,'');
         echo "<script>alert('操作成功');location.href='view.php'</script>";

}


?>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" type="text/css" href="//apps.bdimg.com/libs/bootstrap/3.3.4/css/bootstrap.min.css">
    <script src="//apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js"></script>
    <script src="//apps.bdimg.com/libs/bootstrap/3.3.4/js/bootstrap.min.js"></script>
    <title>留言板</title>
    <style>
        .from-group {
            margin-bottom: 10px;
        }
    </style>
</head>
<body>

<div class="container-fluid">
    <div class="container">


        <div class="row">
            <div class="col-md-6">
                <h1>查看登记信息</h1>
                <p>信息来源于官网<a href="cooperate.html#form">合作页面底部</a>的表单</p>

                <form method="post" action="view.php">
                    <button class="btn btn-success" onclick="window.location.href=window.location.href">刷新</button>
                    <input name="del" class="btn btn-danger" type="submit" value="清空消息">
                </form>
            </div>
            <div class="col-md-6">
                <h3>已登记的信息：</h3>
                <hr/>
                <?php if (is_array($msg) && count($msg) > 0) {

                    foreach ($msg as $val) {
                        echo '<span class="text-primary">' . $val["name"] . '</span>&nbsp;&nbsp;<span class="text-primary">' . date("Y-m-d H:i:s", $val["time"]) . '</span>';

                        echo ' <p>意向合作区域：' . $val["message"] . '，电话：'.$val["phone"].'</p>';

                        echo '<hr/>';

                    }
                } ?>

            </div>

        </div>
    </div>


</div>

</body>
</html>