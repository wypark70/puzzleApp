import { Component, OnInit } from '@angular/core';

import { NavController } from 'ionic-angular';
import { Camera } from 'ionic-native';

import { ImageItem } from '../';
import { DetailPage } from '../detail/detail';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  private imageList: Array<ImageItem>;
  private selectedImageItem: ImageItem;

  constructor(public navCtrl: NavController) {
  }

  ngOnInit() {
    this.imageList = new Array<ImageItem>();
    let imageList = this.imageList;
    imageList.push({ src: 'assets/img/image01.jpg', title: 'image01', subTitle: '해를 꿈꾸는 달' });
    imageList.push({ src: 'assets/img/image02.jpg', title: 'image02' });
    imageList.push({ src: 'assets/img/image03.jpg', title: 'image03' });
    imageList.push({ src: 'assets/img/image04.jpg', title: 'image04' });
    imageList.push({ src: 'assets/img/image05.jpg', title: 'image05' });
    imageList.push({ src: 'assets/img/image06.jpg', title: 'image06' });
    imageList.push({ src: 'assets/img/image07.jpg', title: 'image07', subTitle: '수현이 운동회' });
  }

  accessGallery() {
    Camera.getPicture({
      sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
      destinationType: Camera.DestinationType.DATA_URL
    }).then((imageData) => {
      this.imageList.splice(0, 0, { src: 'data:image/jpeg;base64,' + imageData, title: 'SAVEDPHOTOALBUM' });
    }, (err) => {
      console.log(err);
    });
  }

  getPicture() {
    Camera.getPicture({
      sourceType: Camera.PictureSourceType.CAMERA,
      destinationType: Camera.DestinationType.DATA_URL
    }).then((imageData) => {
      this.imageList.splice(0, 0, { src: 'data:image/jpeg;base64,' + imageData, title: 'CAMERA' });
    }, (err) => {
      console.log(err);
    });
  }

  goDetailPage(imageItem) {
    this.selectedImageItem = imageItem;
    this.navCtrl.push(DetailPage, imageItem);
  }

}
