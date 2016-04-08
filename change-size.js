$(function(){
    //座標計算
    //要素は4列並ぶものとする
    var calcPosition = function(order){
        var x, y; //要素の座標
        var a, b;

        a = order % 4;
        b = (order - a) / 4;

        x = a * 320;
        y = b * 320;

        return [x, y];
    };

    //要素の位置を計算
    var calcOrder = function(tile){
        var x, y;

        x =  +tile.css('left').replace('px', '');
        y = +tile.css('top').replace('px', '');

        return x / 320 + y / 80;
    };


    //並べる要素数
    var count = $("#Container .tile").length;

    //要素を順番に並べ，要素idを付与する
    var order = 0; //要素の位置
    $("#Container .tile").each(function(){
        var pos = calcPosition(order)

        $(this).attr("id", "tile" + order); //初期位置を要素idとする
        $(this).css({"position": "absolute",
                    "left": pos[0], "top": pos[1]});
        order++;
    })

    $(".tile").click(function(){
        var except = []; //すでに埋まってる要素の位置を格納
        //拡大された要素が存在すればもとに戻す
        $("#tile-list").find('li').each(function(){
            if ($(this).is(".large")) {
                $(this).removeClass("large")
                .css({"width":320, "height": 320});
                if ($(this).is(':has(img)')) { //要素内に画像がimgがある場合の処理
                    $(this).children('img').css({"width":320, "height": 320}); //とりあえず4倍にしてたのを戻す
                }
            }
        })

        var large_tile = +$(this).attr("id").substr(4); //拡大する要素のid
        var large_order = calcOrder($(this)); //拡大する要素の位置
        if (large_order % 4 == 3) { //要素が右端の時の対応
            large_order--;
        }
        var large_pos = calcPosition(large_order); //拡大する要素の座標
        except.splice(0, 4, large_order, large_order+1, large_order+4, large_order+5);
        $(this).addClass("large");

        //残りの要素を順番に並べる
        var order = 0; //要素の位置
        $("#Container .tile").each(function(){
            while (except.indexOf(order) >= 0) { //すでに要素で埋まっている位置ならば次の位置へ
                order++;
            }
            if (large_tile == +$(this).attr("id").substr(4)) { //拡大する要素の処理
                $(this).css({"width": 640, "height": 640, "left": large_pos[0], "top": large_pos[1]});
                $(this).animate({"width": 640, "height": 640})
                       .animate({"left": large_pos[0], "top": large_pos[1]});

                if ($(this).is(':has(img)')) { //要素内に画像がimgがある場合の処理
                    $(this).children('img').animate({"width":640, "height": 640}); //とりあえず4倍に 画像変更すべき
                }
                return true;
            }

            var re_pos = calcPosition(order)
            $(this).css({"position": "absolute"})
                   .animate({"left": re_pos[0], "top": re_pos[1]});
            order++;
        })

    });
})
