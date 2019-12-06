var gulp =require("gulp");//gulp基础库
var clean =require("gulp-clean");//清空文件夹
var imagemin=require("gulp-imagemin");//图片压缩
var uglify=require("gulp-uglify");//js压缩
var cleanCss = require('gulp-clean-css');//css压缩
var less=require("gulp-less");//less编译
var sass = require('gulp-sass');//sass编译
var babel = require("gulp-babel");//es6
var concat=require("gulp-concat");//文件合并
var rename=require("gulp-rename");//文件重命名
var rev = require('gulp-rev');//更改版本名
var revCollector = require('gulp-rev-collector');//gulp-rev的插件，用于更改html中的引用路径
var connect = require('gulp-connect');//本地服务器
var livereload = require('gulp-livereload');//实时刷新
var runSequence = require('run-sequence');//同步执行
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;





//定义一个测试任务 可以运行一下这个任务 测试是gulp否可用
gulp.task("test",function () {
    return console.log(" Gulp is running");

});


//定义css、js源文件路径
let htmlSrc = 'src/*.html',//html文件的路径
    cssSrc = 'src/css/*.css',//css路径
    jsSrc = 'src/js/*.js',//js路径
    imgSrc='src/image/*',//图片路径
    otherJsSrc='src/js/other/*.js',//第三方js路径
    lessSrc = 'src/css/*.less',//less文件路径
    scssSrc = 'src/css/*.scss',//scss文件路径
    gulpRevJsonSrc='needless/gulp-rev/*.json';//定义gulp-rev 生成的json文件的路径





//清空项目生成的文件夹，防止文件冗余
gulp.task("clean",function () {
    return  gulp.src(["dist/*","needless/gulp-rev/*"],{read:false}).pipe(clean());//src的第二个参数的{read:false}，是不读取文件加快程序。
});

//拷贝html文件
gulp.task("copyHtml",function () {
    return gulp.src(htmlSrc).pipe(gulp.dest("dist"));

});

//拷贝第三方js文件
gulp.task("copyOtherJs",function () {
    return gulp.src(otherJsSrc).pipe(gulp.dest("dist/js/other"));

});

//编译less
gulp.task("less",function () {
    return gulp.src(lessSrc)
        .pipe(less())
        .pipe(gulp.dest("dist/css"))


});

//编译sass
gulp.task('sass', function () {
    return gulp.src(scssSrc)
        .pipe(sass())
        .pipe(cleanCss())
        .pipe(gulp.dest('dist/css'));
});

//压缩css
gulp.task("cssClean",function () {

    return  gulp.src(cssSrc)
        .pipe(cleanCss())
        .pipe(gulp.dest('dist/css'));

});

//压缩图片
gulp.task("compressImg",function () {
    return  gulp.src(imgSrc)
        .pipe(imagemin())
        .pipe(gulp.dest("dist/image"));
});



//压缩js  包含 压缩js、编辑es6 、添加版本号
gulp.task("compressJs",function () {

    return  gulp.src(jsSrc)   //获得 项目用到的所有js
        .pipe(concat("main.js"))   //合并为main.js
        .pipe(babel({
            presets: ['es2015']
        }))                    //编译es6
        .pipe(uglify())        //压缩js
        // .pipe(rename('./main.min.js'))
        .pipe(rev())        //添加版本号
        .pipe(gulp.dest("dist/js"))   // 将经过优化、添加了版本号的js输出到dist文件夹里
        .pipe(rev.manifest({
            path: 'needless/gulp-rev/rev-manifest.json',
            merge: true
        }))   //将对应的版本号用json表示出来 --加入path和merge可以将多个 js 或css文件版本号写在一个rev-manifest.json中  路径根据需求自定义就好
        .pipe(gulp.dest('./')) //将json文件输出


});


//修改html中js的引用路径
gulp.task('modifyPath', function() {
    return gulp.src([gulpRevJsonSrc, htmlSrc])   // 读取 rev-manifest.json 文件以及需要进行js名替换的文件
        .pipe(revCollector({
            replaceReved:true          ////模板中已经被替换的文件是否还能再被替换,默认是false
        }))                                   // 执行文件内引用的替换
        .pipe(gulp.dest('dist/'));                     // 替换后的html文件输出的目录


});



gulp.task('build',function () {
    runSequence(
        'clean',
        'copyHtml',
        'copyOtherJs',
        'compressImg',
        'compressJs',
        'sass',
        'modifyPath',
        );


});



// 静态服务器 + 监听  文件
gulp.task('dev', function() {

    browserSync.init({
        server: "src"
    });

    gulp.watch(cssSrc).on('change', reload);
    gulp.watch(scssSrc).on('change', reload);
    gulp.watch(htmlSrc).on('change', reload);
    gulp.watch(jsSrc).on('change', reload);
    gulp.watch(imgSrc).on('change', reload);
    gulp.watch(otherJsSrc).on('change', reload);

});






//定义默认任务
// gulp.task("default",function(){
//     return console.log("这是gulp的默认任务，只需要执行gulp就可以了");
// });


//定义默认任务并通过默认任务执行多个任务
gulp.task("default",["webserver","watch"]);


//监听文件是否发生变化
//
// gulp.task("watch",function () {
//     gulp.watch("src/*.html",['copyHtml']);
//     gulp.watch("src/image/*",['img']);
//     gulp.watch("src/js/*.js",['concat','rev']);
//     gulp.watch("src/css/*.less",['less']);
//     livereload.listen();
//     gulp.watch('src/**/*.*', function(event) {
//         livereload.changed(event.path);
//     });
// });
