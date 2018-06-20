Component({
  properties: {
    images: {
      type: Array,
      value: [],
      observer(newVal, oldVal) {
        if (oldVal.length > 0) {
          this.create();
        }
      },
    },
    texts: {
      type: Array,
      value: [],
      observer(newVal, oldVal) {
        if (oldVal.length > 0) {
          this.create();
        }
      },
    },
    width: {
      type: Number,
      value: 750,
    },
    height: {
      type: Number,
      value: 750,
    },
    backgroundColor: {
      type: String,
      value: '#ffffff',
    },
    debug: {    // 如果为true会展示canvas，为false则会隐藏
      type: Boolean,
      value: false,
    },
  },
  data: {
    drawArr: [],
  },
  created() {
    const sysInfo = wx.getSystemInfoSync();
    const screenWidth = sysInfo.screenWidth;
    // rpx（responsive pixel）: 规定屏幕宽为750rpx, 所以只需关心rpx即可
    this.factor = sysInfo.pixelRatio //screenWidth / 350;
  },
  attached() {
    this.ctx = wx.createCanvasContext('imgCanvas', this);   // 加上this才能选中组件内的canvas元素
    this.setData({
      pxWidth: this.toPx(this.data.width),
      pxHeight: this.toPx(this.data.height),
    });
  },
  methods: {
    /**
     * 生成海报
     */
    create() {
      // 清空画布
      this.ctx.clearRect(0, 0, this.toPx(this.data.width), this.toPx(this.data.height));
      // 设置画布底色
      this.ctx.setFillStyle(this.data.backgroundColor);
      this.ctx.fillRect(0, 0, this.toPx(this.data.width), this.toPx(this.data.height));
      this.ctx.draw(true);

      const { images } = this.data;
      const drawList = [];
      this.data.drawArr = [];
      images.forEach((image, index) => drawList.push(this.drawImage(image, index)));
      wx.showLoading({ title: '生成中' });
      Promise.all(drawList)
        .then(() => {
          // 按照顺序排序
          this.data.drawArr.sort(function (a, b) {
            return a.index - b.index;
          });
          // 将图片渲染到画布
          const len = this.data.drawArr.length;
          this.data.drawArr.forEach(({ imgPath, sx, sy, sw, sh, x, y, w, h }, index) => {
            this.ctx.drawImage(imgPath, sx, sy, sw, sh, x, y, w, h);
            this.ctx.draw(true);
            if (index + 1 === len) {
              this.drawText();
            }
          })
          if (len === 0) {
            this.drawText();
          }
          // 将canvas转为图片
          return this.toImage(this.ctx);
        })
        .then((imgPath) => {
          // 生成成功
          wx.hideLoading();
          this.triggerEvent('success', {
            imgPath
          });
        })
        .catch((err) => {
          wx.hideLoading();
          console.error(err);
        })
    },
    /**
     * 绘制文字
     */
    drawText() {
      const texts = this.data.texts;
      texts.forEach(({ text, fontSize, color, textAlign, x, y, width = this.data.width, lineNum, lineHeight }) => {
        const everyLintNum = Math.round(width / fontSize);
        const textArr = [];
        for (let i = 0; i <= text.length; i += everyLintNum) {
          textArr.push(text.slice(i, i + everyLintNum));
        }
        const fontSizePx = this.toPx(fontSize);
        const len = textArr.length;
        for (let j = 0; j < len; j++) {
          let everyText = '';
          if (j + 1 === lineNum) {
            // 最后一行渲染，查询是否还有没渲染完的文字，有的话用...代替
            if (typeof textArr[j + 1] !== 'undefined') {
              everyText = textArr[j].replace(/(.{2})$/, '...');
            } else {
              everyText = textArr[j];
            }
          } else {
            everyText = textArr[j];
          }
          let lineHeightDis = lineHeight ? this.toPx(lineHeight) : Math.round(fontSizePx);
          this.ctx.setTextBaseline('top');
          this.ctx.setFontSize(fontSizePx);
          this.ctx.setTextAlign(textAlign);
          this.ctx.setFillStyle(color);
          this.ctx.fillText(everyText, this.toPx(x), this.toPx(y) + lineHeightDis * j);
        }

      });
      this.ctx.draw(true);
    },

    drawRect() {
      const rects = this.data.rects;
      // ctx.setFillStyle('rgba(0,0,0,0.6)')
      // ctx.fillRect(0, 0, this.data.windowWidth * XS, 242 * XS)
    },

    /**
     * 将canvas转为图片，由于需要等待绘制完成，这里需要延时
     * @param {*} ctx 
     */
    toImage(ctx) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          wx.canvasToTempFilePath({
            canvasId: 'imgCanvas',
            success(res) {
              resolve(res.tempFilePath);
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success(result) {
                  wx.showToast({
                    title: '图片保存成功',
                    icon: 'success',
                    duration: 2000
                  })
                }
              })
            },
            fail(err) {
              reject(err);
            }
          }, this);
        }, 300);
      });
    },
    /**
     * 绘制图片
     * @param {*} image 
     * @param {*} index 
     */
    drawImage(image, index) {
      return new Promise((resolve, reject) => {
        const { x, y, url } = image;
        // 下载图片
        this.downImage(url)
          // 获取图片信息
          .then((imgPath) => { return this.getImageInfo(imgPath, index); })
          .then(({ imgPath, imgInfo, index }) => {
            // 根据画布的宽高计算出图片绘制的大小，这里会保证图片绘制不变形
            let sx;
            let sy;
            const setWidth = image.width;
            const setHeight = image.height;
            const width = imgInfo.width;
            const height = imgInfo.height;

            if (width / height <= setWidth / setHeight) {
              sx = 0;
              sy = (height - ((width / setWidth) * setHeight)) / 2;
            } else {
              sy = 0;
              sx = (width - ((height / setHeight) * setWidth)) / 2;
            }
            this.data.drawArr.push({
              index,
              imgPath,
              sx, sy, sw: (width - (sx * 2)), sh: (height - (sy * 2)),
              x: this.toPx(x), y: this.toPx(y), w: this.toPx(setWidth), h: this.toPx(setHeight),
            });
            resolve();
          })
          .catch((err) => reject(err));
      });
    },
    /**
     * 下载图片资源
     * @param {*} imageUrl 
     */
    downImage(imageUrl) {
      return new Promise((resolve, reject) => {
        wx.downloadFile({
          url: imageUrl,
          success(res) {
            if (res.statusCode === 200) {
              resolve(res.tempFilePath);
            } else {
              reject(res.errMsg);
            }
          },
          fail(err) {
            reject(err);
          }
        });
      });
    },
    /**
     * 获取图片信息
     * @param {*} imgPath 
     * @param {*} index 
     */
    getImageInfo(imgPath, index) {
      return new Promise((resolve, reject) => {
        wx.getImageInfo({
          src: imgPath,
          success(res) {
            resolve({ imgPath, imgInfo: res, index });
          },
          fail(err) {
            reject(err);
          }
        });
      });
    },
    /**
     * 单位转换
     * @param {*} rpx 
     */
    toPx(rpx) {
      return rpx * this.factor;
    }
  }
})