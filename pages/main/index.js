Page({
    data: {
        images: [{
            url: "https://img.zai-art.com/zaiart_article%2F55153cb868bcbcde645a8cc640e773aa.jpeg" + '?imageView2/1/w/750/h/484',
            width: 750,             // 单位 rpx
            height: 484,
            x: 0,
            y: 0,
        },
        {
            url: 'https://lc-i0j7ktvk.cn-n1.lcfile.com/8eb44bfd6dd7e94e1b51.png',
            width: 160,
            height: 160,
            x: 200,
            y: 585,
        }
        ],
        texts: [{
          text: 'The Beatles, Tomorrow 披头士世界巡回展',
            color: 'white',           // 文字颜色
            fontSize: 32,           // 字体 单位rpx
            textAlign: 'left',      // 对齐方式：left center right
            x: 32,                   // 坐标x，以文字的右上角为原点，单位rpx
            y:268,                   // 坐标y，以文字的右上角为原点，单位rpx
            width: 690,             // 文字区域的宽度
            lineNum: 1,             // 文字行数，放不下使用...代替
            lineHeight: 48,         // 行高 单位rpx
        },
        {
          text: '80-136',
            color: 'white',           // 文字颜色
            fontSize: 32,           // 字体 单位rpx
            textAlign: 'left',      // 对齐方式：left center right
            x: 32,                   // 坐标x，以文字的右上角为原点，单位rpx
            y: 328,                   // 坐标y，以文字的右上角为原点，单位rpx
            width: 500,             // 文字区域的宽度
            lineNum: 1,             // 文字行数，放不下使用...代替
            lineHeight: 50,         // 行高 单位rpx
        }
        ],
        width: 750,
        height: 1334,
        backgroundColor: '#fff',
        debug: true,
    },
    onLoad: function () {
    }
})