import { Component, OnInit, ViewEncapsulation, Input, OnChanges } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ImageItem } from '../';

interface Item {
  href: string;
  x: number;
  y: number;
  idx: number;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'page-detail',
  templateUrl: 'detail.html',
  inputs: ['colCnt', 'rowCnt']
})

export class DetailPage implements OnInit, OnChanges {
  @Input() colCnt: number;
  @Input() rowCnt: number;
  private imageItem: ImageItem;
  private puzzleImageList: Array<Item>;
  private dx: number;
  private dy: number;
  private viewBox: string;
  private viewBox2: string;
  private timerId;
  private blankItem: Item;
  private colCntArr: Array<number>;
  private rowCntArr: Array<number>;
  private randomMoveType: number;
  @Input() isShowNumber: boolean;


  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ngOnInit() {
    let self = this;

    self.imageItem = {
      src: this.navParams.get('src'),
      title: this.navParams.get('title'),
      subTitle: this.navParams.get('subTitle')
    };
    self.colCnt = 5;
    self.rowCnt = 5;
    self.colCntArr = [2, 3, 4, 5, 6, 7, 8, 9];
    self.rowCntArr = [2, 3, 4, 5, 6, 7, 8, 9];
    self.randomMoveType = 2;
    self.isShowNumber = true;
    self.startGame();
    console.log('ngOnInit DetailPage');
  }

  ngOnChanges(changes) {
    console.log('ngOnChanges: ', changes);
  }

  onChange(value) {
    console.log('ngOnChanges: ', value);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailPage');
    this.startGame();
  }

  startGame() {
    let self = this;
    let image = new Image();
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');

    self.puzzleImageList = new Array<Item>();

    image.src = self.imageItem.src;
    image.onload = function () {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      self.dx = Math.floor(image.naturalWidth / self.colCnt);
      self.dy = Math.floor(image.naturalHeight / self.rowCnt);
      self.viewBox = '0 0 ' + ((self.dx * self.colCnt) + (self.colCnt - 1)) + ' ' + ((self.dy * self.rowCnt) + (self.rowCnt - 1));
      self.viewBox2 = '0 0 ' + (self.dx * self.colCnt * self.rowCnt + self.colCnt * self.rowCnt - 1) + ' ' + self.dy;
      context.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, canvas.width, canvas.height);
      context.fillRect((self.colCnt - 1) * self.dx, (self.rowCnt - 1) * self.dy, self.dx, self.dy);
      let cnv = document.createElement('canvas');
      let ctx = cnv.getContext('2d');
      cnv.width = self.dx;
      cnv.height = self.dy;
      for (let row = 0; row < self.rowCnt; row++) {
        for (let col = 0; col < self.colCnt; col++) {
          let sx = col * self.dx;
          let sy = row * self.dy;
          ctx.putImageData(context.getImageData(sx, sy, self.dx, self.dy), 0, 0);
          let base64URL = cnv.toDataURL('image/png');
          let tmpObj = {
            href: base64URL,
            x: col,
            y: row,
            idx: (row * self.colCnt) + col
          };
          self.puzzleImageList.push(tmpObj);
        }
        cnv.remove();
      }
      canvas.remove();
      self.blankItem = self.puzzleImageList[self.puzzleImageList.length - 1];
      //self.startRandomMove();
    }
    /*
    function convertImgDataToBase64URL(ctx, image, outputFormat) {
      let dataURL;
      canvas.height = image.height;
      canvas.width = image.width;
      ctx.putImageData(image, 0, 0);
      dataURL = canvas.toDataURL(outputFormat);
      return dataURL;
    }
    */
  }
  initGame() {
    let self = this;
    self.stopRandomMove();
    this.stopRandomMove();
    this.startGame();
  }
  moveBlankItemRandom() {
    let self = this;
    let r = Math.floor(Math.random() * 4);
    if (r === 0) {
      self.moveUp();
    }
    else if (r === 1) {
      self.moveRight();
    }
    else if (r === 2) {
      self.moveDown();
    }
    else if (r === 3) {
      self.moveLeft();
    }
  }
  moveBlankItemRandom2() {
    let x = Math.floor(Math.random() * (this.colCnt + 1));
    let y = Math.floor(Math.random() * (this.rowCnt + 1));
    this.moveXY(x, y);
  }
  startRandomMove() {
    let self = this;
    self.stopRandomMove();
    self.timerId = setInterval(function () {
      if (self.randomMoveType === 1) {
        self.moveBlankItemRandom();
      }
      else {
        self.moveBlankItemRandom2();
      }
    }, 50);
  }
  stopRandomMove() {
    let self = this;
    if (self.timerId) clearInterval(this.timerId);
  }
  getTargetItem(x: number, y: number) {
    return this.puzzleImageList.find(function (d) { return d.x === x && d.y === y });
  }
  swapBlankItem(item: Item) {
    if (item) {
      let self = this;
      let tmpItem = { x: self.blankItem.x, y: self.blankItem.y };
      self.blankItem.x = item.x;
      self.blankItem.y = item.y;
      item.x = tmpItem.x;
      item.y = tmpItem.y;
    }
  }
  moveLeft() {
    if (this.blankItem.x > 0) {
      this.swapBlankItem(this.getTargetItem(this.blankItem.x - 1, this.blankItem.y));
    }
  }
  moveRight() {
    if (this.blankItem.x < (this.colCnt - 1)) {
      this.swapBlankItem(this.getTargetItem(this.blankItem.x + 1, this.blankItem.y));
    }
  }
  moveUp() {
    if (this.blankItem.y > 0) {
      this.swapBlankItem(this.getTargetItem(this.blankItem.x, this.blankItem.y - 1));
    }
  }
  moveDown() {
    if (this.blankItem.y < (this.rowCnt - 1)) {
      this.swapBlankItem(this.getTargetItem(this.blankItem.x, this.blankItem.y + 1));
    }
  }
  moveXY(x: number, y: number) {
    if (x < this.blankItem.x) {
      let cnt = this.blankItem.x - x;
      for (let i = 0; i < cnt; i++) this.moveLeft();
    }
    else {
      let cnt = x - this.blankItem.x;
      for (let i = 0; i < cnt; i++) this.moveRight();
    }
    if (y < this.blankItem.y) {
      let cnt = this.blankItem.y - y;
      for (let i = 0; i < cnt; i++) this.moveUp();
    }
    else {
      let cnt = y - this.blankItem.y;
      for (let i = 0; i < cnt; i++) this.moveDown();
    }
  }
  onclickImage(item: Item) {
    if (item.x === this.blankItem.x) {
      if (item.y < this.blankItem.y) {
        let cnt = this.blankItem.y - item.y;
        for (let i = 0; i < cnt; i++) this.moveUp();
      }
      else {
        let cnt = item.y - this.blankItem.y;
        for (let i = 0; i < cnt; i++) this.moveDown();
      }
    }
    if (item.y === this.blankItem.y) {
      if (item.x < this.blankItem.x) {
        let cnt = this.blankItem.x - item.x;
        for (let i = 0; i < cnt; i++) this.moveLeft();
      }
      else {
        let cnt = item.x - this.blankItem.x;
        for (let i = 0; i < cnt; i++) this.moveRight();
      }
    }
  }

}
