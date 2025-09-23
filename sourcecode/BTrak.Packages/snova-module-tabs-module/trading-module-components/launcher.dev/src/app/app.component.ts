import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageProperties } from 'trading-module-components/trading-components/src/lib/billing/constants/localstorage-properties';
import { environment } from 'trading-module-components/trading-components/src/lib/globaldependencies/environments/environment';
import { info } from 'trading-module-components/trading-components/src/lib/globaldependencies/constants/modules';
import { tap } from 'rxjs/operators';
// import { NgxCaptureService } from 'ngx-capture';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  img = '';
  body = document.body;
  @ViewChild('divscreen', { static: true }) divscreen: any;
  @ViewChild('tablescreen', { static: true }) tablescreen: any;
  items = [
    { id: 'one', status: 'complete', task: 'build' },
    { id: 'two', status: 'working', task: 'test' },
    { id: 'three', status: 'failed', task: 'deploy' }
  ]
  constructor(translate: TranslateService,
    // private captureService: NgxCaptureService
  ) {
    console.log('test 2');
    translate.setDefaultLang('en');
    translate.use('en');
    console.log(translate);
    localStorage.setItem(LocalStorageProperties.Modules, JSON.stringify(info.modules));
    localStorage.setItem(LocalStorageProperties.Environment, JSON.stringify(environment));
  }
  ngOnInit() {
    //this.setUpDownloadPageAsImage();
  }
  // divCapture() {
  //   this.captureService
  //     .getImage(this.divscreen.nativeElement, true)
  //     .pipe(
  //       tap((img: string) => {
  //         this.img = img;
  //         console.log(img);
  //       })
  //     )
  //     .subscribe();
  // }
  // tableCapture() {
  //   this.captureService
  //     .getImage(this.tablescreen.nativeElement, true)
  //     .pipe(
  //       tap((img: string) => {
  //         this.img = img;
  //         console.log(img);
  //       })
  //     )
  //     .subscribe();
  // }
  // fullCapture() {
  //   this.captureService
  //     .getImage(this.body, true)
  //     .pipe(
  //       tap((img: string) => {
  //         this.img = img;
  //         console.log(img);
  //       })
  //     )
  //     .subscribe();
  // }
  // fullCaptureWithDownload() {
  //   this.captureService
  //     .getImage(this.body, true)
  //     .pipe(
  //       tap((img: string) => {
  //         this.img = img;
  //         console.log(img);
  //       }),
  //       tap((img) => {
  //         //  this.downloadUrl(img, "capture") 
  //         this.captureService.downloadImage(img);
  //       })
  //     )
  //     .subscribe();
  // }
  // downloadUrl(url: string, fileName: string) {
  //   const a: any = document.createElement('a');
  //   a.href = url;
  //   a.download = fileName;
  //   document.body.appendChild(a);
  //   a.style = 'display: none';
  //   a.click();
  //   a.remove();
  // };
  // html2canvasfind() {
  //   // html2canvas(this.body).then(function (canvas) {
  //   //   document.body.appendChild(canvas);
  //   // });
  //   html2canvas(this.body, {
  //     allowTaint: true,
  //     useCORS: true,
  //   })
  //     .then(canvas =>
  //       // It will return a canvas element
  //       canvas.toDataURL("image/png", 0.5)
  //     )
  //     .then(data => data ? this.setImage(data) : null)
  //     .catch((e) => {
  //       // Handle errors
  //       console.log(e);
  //     });
  // }
  // setImage(img) {
  //   this.img = img;
  //   const a: any = document.createElement('a');
  //   a.href = img;
  //   a.download = "capture";
  //   document.body.appendChild(a);
  //   a.style = 'display: none';
  //   a.click();
  //   a.remove();
  // }
  // setUpDownloadPageAsImage() {
  //   document.getElementById("download-page-as-image").addEventListener("click", function () {
  //     html2canvas(document.body).then(function (canvas) {
  //       console.log(canvas);
  //       this.simulateDownloadImageClick(canvas.toDataURL(), 'file-name.png');
  //     });
  //   });
  // }
  // simulateDownloadImageClick(uri, filename) {
  //   var link = document.createElement('a');
  //   if (typeof link.download !== 'string') {
  //     window.open(uri);
  //   } else {
  //     link.href = uri;
  //     link.download = filename;
  //     this.accountForFirefox(this.clickLink, link);
  //   }
  // }
  // clickLink(link) {
  //   link.click();
  // }
  // accountForFirefox(click, link) { // wrapper function
  //   document.body.appendChild(link);
  //   click(link);
  //   document.body.removeChild(link);
  // }

  //not tested save and DataURIToBlob methods
  // save() {
  // ip = "http://localhost/fileupload/"
  //     const file = this.DataURIToBlob(this.imgBase64)
  //     const formData = new FormData();
  //     formData.append('file', file, 'image.png')
  //     let url = "upload2.php"
  //     this.http.post(this.ip + url, formData).subscribe(data => {


  //     })
  // }
  // DataURIToBlob(dataURI: string) {
  //     const splitDataURI = dataURI.split(',')
  //     const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
  //     const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

  //     const ia = new Uint8Array(byteString.length)
  //     for (let i = 0; i < byteString.length; i++)
  //         ia[i] = byteString.charCodeAt(i)

  //         return new Blob([ia], { type: mimeString })
  // }

  // downloadimage() {
  //   /*var container = document.getElementById("image-wrap");*/ /*specific element on page*/
  //   var container = document.getElementById("htmltoimage");; /* full page */
  //   html2canvas(document.body).then(function (canvas) {
  //     var link = document.createElement("a");
  //     document.body.appendChild(link);
  //     link.download = "html_image.jpg";
  //     link.href = canvas.toDataURL();
  //     link.target = '_blank';
  //     link.click();
  //   });
  // }

}

