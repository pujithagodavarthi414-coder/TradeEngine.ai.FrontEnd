import { Component, OnInit } from '@angular/core';
import { createElement, Event, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { DocumentEditor, FormatType } from '@syncfusion/ej2-angular-documenteditor';
import { Button } from '@syncfusion/ej2-angular-buttons';
import { DropDownButton, ItemModel } from '@syncfusion/ej2-angular-splitbuttons';
import { MenuEventArgs } from '@syncfusion/ej2-angular-navigations';
import { DocumentService } from 'src/app/services/document.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
/**
 * Represents document editor title bar.
 */@Component({
    selector: 'app-titlebar',
    template: ''
})
export class TitlebarComponent {
    tileBarDiv: HTMLElement;
    documentTitle: HTMLElement;
    documentTitleContentEditor: HTMLElement;
    export: DropDownButton = new DropDownButton;
    print: Button;
    open: Button = new Button;
    documentEditor: DocumentEditor;
    isRtl: boolean;
    constructor(element: HTMLElement, docEditor: DocumentEditor, isShareNeeded: Boolean, private service: DocumentService, private http: HttpClient) {
        this.isRtl = false;
        //initializes title bar elements.
        this.tileBarDiv = element;
        this.documentEditor = docEditor;
        this.initializeTitleBar(isShareNeeded);
        this.wireEvents();
    }

    
    private initializeTitleBar = (isShareNeeded: Boolean): void => {
        let downloadText: string;
        let downloadToolTip: string;
        let printText: string;
        let printToolTip: string;
        let openText: string;
        let documentTileText: string;
        if (!this.isRtl) {
            // downloadText = 'Save as';
            // downloadToolTip = 'Save as this document.';
            printText = 'Print';
            printToolTip = 'Print this document (Ctrl+P).';
            openText = 'Open';
            documentTileText = 'Document Name. Click or tap to rename this document.';
        } else {
            downloadText = 'تحميل';
            downloadToolTip = 'تحميل هذا المستند';
            printText = 'طباعه';
            printToolTip = 'طباعه هذا المستند (Ctrl + P)';
            openText = 'فتح';
            documentTileText = 'اسم المستند. انقر أو اضغط لأعاده تسميه هذا المستند';
        }
        // tslint:disable-next-line:max-line-length
        this.documentTitle = createElement('label', { id: 'documenteditor_title_name', styles: 'font-weight:400;text-overflow:ellipsis;white-space:pre;overflow:hidden;user-select:none;cursor:text' });
        let iconCss: string = 'e-de-padding-right';
        let btnFloatStyle: string = 'float:right;';
        let titleCss: string = '';
        if (this.isRtl) {
            iconCss = 'e-de-padding-right-rtal';
            btnFloatStyle = 'float:left;';
            titleCss = 'float:right;';
        }
        // tslint:disable-next-line:max-line-length
        this.documentTitleContentEditor = createElement('div', { id: 'documenteditor_title_contentEditor', className: 'single-line', styles: titleCss });
        this.documentTitleContentEditor.appendChild(this.documentTitle);
        this.tileBarDiv.appendChild(this.documentTitleContentEditor);
        this.documentTitleContentEditor.setAttribute('title', 'Document Name. Click or tap to rename this document.');
        let btnStyles: string = btnFloatStyle + 'background: transparent;box-shadow:none; font-family: inherit;border-color: transparent;'
            + 'border-radius: 2px;color:inherit;font-size:12px;text-transform:capitalize;margin-top:4px;height:28px;font-weight:400;'
            + 'margin-top: 2px;';
        // tslint:disable-next-line:max-line-length
        this.print = this.addButton('fa fa-print ' + iconCss, printText, btnStyles, 'de-print', printToolTip, false) as Button;
        this.open = this.addButton('e-de-icon-Open ' + iconCss, openText, btnStyles, 'de-open', documentTileText, false) as Button;
        let items: ItemModel[] = [
            { text: 'Microsoft Word (.docx)', id: 'word' },
            { text: 'Syncfusion Document Text (.sfdt)', id: 'sfdt' },
            { text: 'Syncfusion Document Text (.hmtl)', id: 'html' },

        ];
        // tslint:disable-next-line:max-line-length
        // this.export = this.addButton('e-de-icon-Download ' + iconCss, downloadText, btnStyles, 'documenteditor-share', downloadToolTip, true, items) as DropDownButton;
        if (!isShareNeeded) {
            this.export.element.style.display = 'none';
        } else {
            this.open.element.style.display = 'none';
        }
    }
    private setTooltipForPopup(): void {
        // tslint:disable-next-line:max-line-length
        document.getElementById('documenteditor-share-popup')?.querySelectorAll('li')[0].setAttribute('title', 'Download a copy of this document to your computer as a DOCX file.');
        // tslint:disable-next-line:max-line-length
        document.getElementById('documenteditor-share-popup')?.querySelectorAll('li')[1].setAttribute('title', 'Download a copy of this document to your computer as an SFDT file.');
        document.getElementById('documenteditor-share-popup')?.querySelectorAll('li')[1].setAttribute('title', 'Download a copy of this document to your computer as an HTML file.');

    }
    private wireEvents = (): void => {
        this.print.element.addEventListener('click', this.onPrint);
        this.open.element.addEventListener('click', (e: Event) => {
            if ((e.target as HTMLInputElement).id === 'de-open') {
                let fileUpload: HTMLInputElement = document.getElementById('uploadfileButton') as HTMLInputElement;
                fileUpload.value = '';
                fileUpload.click();
            }
        });
        this.documentTitleContentEditor.addEventListener('keydown', (e: any) => {
            if (e.keyCode === 13) {
                e.preventDefault();
                this.documentTitleContentEditor.contentEditable = 'false';
                if (this.documentTitleContentEditor.textContent === '') {
                    this.documentTitleContentEditor.textContent = 'Document1';
                }
            }
        });
        this.documentTitleContentEditor.addEventListener('blur', (): void => {
            if (this.documentTitleContentEditor.textContent === '') {
                this.documentTitleContentEditor.textContent = 'Document1';
            }
            this.documentTitleContentEditor.contentEditable = 'false';
            let data = ""
            this.documentEditor.documentName = data;
        });
        this.documentTitleContentEditor.addEventListener('click', (): void => {
            this.updateDocumentEditorTitle();
        });
    }
    private updateDocumentEditorTitle = (): void => {
        this.documentTitleContentEditor.contentEditable = 'true';
        this.documentTitleContentEditor.focus();
        window.getSelection()?.selectAllChildren(this.documentTitleContentEditor);
    }
    // Updates document title.
    public updateDocumentTitle = (): void => {
        if (this.documentEditor.documentName === '') {
            this.documentEditor.documentName = 'Untitled';
        }
        this.documentTitle.textContent = this.documentEditor.documentName;
    }
    public getHeight(): number {
        return this.tileBarDiv.offsetHeight + 4;
    }
    // tslint:disable-next-line:max-line-length
    private addButton(iconClass: string, btnText: string, styles: string, id: string, tooltipText: string, isDropDown: boolean, items?: ItemModel[]): Button | DropDownButton {
        let button: HTMLButtonElement = createElement('button', { id: id, styles: styles }) as HTMLButtonElement;
        this.tileBarDiv.appendChild(button);
        button.setAttribute('title', tooltipText);
        if (isDropDown) {
            // tslint:disable-next-line:max-line-length
            let dropButton: DropDownButton = new DropDownButton({ select: this.onExportClick, items: items, iconCss: iconClass, cssClass: 'e-caret-hide', content: btnText, open: (): void => { this.setTooltipForPopup(); } }, button);
            return dropButton;
        } else {
            let ejButton: Button = new Button({ iconCss: iconClass, content: btnText }, button);
            return ejButton;
        }
    }
    private onPrint = (): void => {
        this.documentEditor.print();
    }
    private onExportClick = (args: MenuEventArgs): void => {
        let value = args.item.id;
        switch (value) {
            case 'word':
                this.save('Docx');
                break;
            case 'sfdt':
                this.save('Sfdt');
                break;
            case 'html':
                this.save('Html');
                break;
            case 'pdf':
                this.save('Pdf');
                break;
        }
    }
    private save = (format: string): void => {
        // this.saveAsPDF(format);
        this.savefile(format)
    }
    saveAsPDF(data: any): void {
        var obj = this;
        var label: any;

        //          fetch('file:///D:/nxus-world/pdfdesigner/NxusWorld/sourcecode/NxusPDFHTMLDesigner/PDFHTMLDesigner/ConvertedFiles/1675076873594_sample-one.html')
        //   .then(res => res.blob()) // Gets the response and returns it as a blob
        //   .then(blob => {
        //     // Here's where you get access to the blob
        //     // And you can use it for whatever you want
        //     // Like calling ref().put(blob)
        // console.log("/*/***",blob)
        //     // Here, I use it to make an image appear on the page
        //     let objectURL = URL.createObjectURL(blob);
        //     let myImage = new Image();
        //     myImage.src = objectURL;
        // });
        this.documentEditor.saveAsBlob(data).then((exportedDocument: Blob) => {

            if (data == "Docx") {
                label = '.docx';
            }
            if (data == "Sfdt") {
                label = '.sfdt'
            }
            if (data == "Html") {
                label = '.html'
            }
            //  The blob can be processed further 
            var fileName = obj.documentEditor.documentName + label;
            var formData = new FormData();
            var filetype = exportedDocument.type;
            formData.append('file', exportedDocument);
            var httpRequest = new XMLHttpRequest();
            console.log("exported document", exportedDocument);
            console.log("files formdata", formData)
            obj.service.uploadFileUrl(formData, 0, 1, fileName, filetype, null).subscribe((response: any) => {
                if (response.success) {
                    // blocks[responseIndex]
                    // responseIndex = responseIndex + 1;
                    // if (putBlocks.length == responseIndex) {
                    // var list = putBlocks.map(function (el: any) { return el.index }).join(',');
                    obj.service.getBlobUrl(1, fileName, 0, filetype, null).subscribe((response1: any) => {
                        if (response1.success) {
                            console.log("response", response1)
                        }
                    });

                    // }
                }
            })

            // var fileSize = exportedDocument?.size;
            // var fileName = this.documentEditor.documentName + label;
            // var filetype = exportedDocument?.type;
            // var blockSizeInKB = 1024;
            // var blockSize = blockSizeInKB * 1024;
            // var blocks :any =[];
            // var offset = 0;
            // var index = 0;
            // var list = "";
            // console.log(fileName, fileSize)
            // while (offset < fileSize) {
            //     var start = offset;
            //     var end = Math.min(offset + blockSize, fileSize);
            //     blocks.push({
            //         filetype: filetype,
            //         index: index,
            //         start: start,
            //         end: end,
            //         name: fileName
            //     });
            //     list += index + ",";
            //     offset = end;
            //     index++;
            // }
            // console.log("block", blocks)
            // var putBlocks :any = [];
            // var responseIndex = 0;
            // let moduleTypeId = 1;
            // var ser = this;

            // // blocks.sort().forEach((block: any) => {
            //     var fd = new FormData();
            //     fd.append("file", exportedDocument);
            //     const reader = new FileReader();

            //     console.log("blob-file", exportedDocument)
            //     reader.readAsDataURL(exportedDocument);
            //     reader.onloadend = () => {
            //       let base64data = reader.result;
            //       console.log(reader.result)
            //     }
            // this.service.uploadFileUrl(fd, 1, moduleTypeId, fileName, filetype, null).subscribe((response: any) => {
            //     if (response.success) {
            //         // blocks[responseIndex]
            //         // responseIndex = responseIndex + 1;
            //         // if (putBlocks.length == responseIndex) {
            //             // var list = putBlocks.map(function (el: any) { return el.index }).join(',');
            //             this.service.getBlobUrl(moduleTypeId, fileName, list, filetype, null).subscribe((response1: any) => {
            //                 if (response1.success) {
            //                     console.log("response", response1)
            //                 } 
            //             });

            //         // }
            //     }
            // })

        });
    }

    uploadEventHandler(files: any) {
        // var filesdata = 
        // this.documentEditor.save(this.documentEditor.documentName === '' ? 'example' : this.documentEditor.documentName, "sfdt" as FormatType);
        var filesd = new File([files], this.documentEditor.documentName);
        console.log("****", filesd)
        console.log(files)
        var file = filesd;
        var fileSize = file?.size;
        var fileName = file?.name;
        var filetype = file?.type;
        var blockSizeInKB = 1024;
        var blockSize = blockSizeInKB * 1024;
        var blocks: any = [];
        var offset = 0;
        var index = 0;
        var list = "";
        console.log(fileName, fileSize)
        while (offset < fileSize) {
            var start = offset;
            var end = Math.min(offset + blockSize, fileSize);
            blocks.push({
                filetype: filetype,
                index: index,
                start: start,
                end: end,
                name: fileName
            });
            list += index + ",";
            offset = end;
            index++;
        }
        console.log("block", blocks)
        var putBlocks: any = [];
        var responseIndex = 0;
        let moduleTypeId = 1;
        var ser = this;

        // blocks.sort().forEach((block: any) => {
        var blob = file
        var fd = new FormData();
        fd.append("file", file);
        console.log("blob-file", file)
        this.service.uploadFileUrl(fd, 1, moduleTypeId, fileName, filetype, null).subscribe((response: any) => {
            if (response.success) {
                // blocks[responseIndex]
                // responseIndex = responseIndex + 1;
                // if (putBlocks.length == responseIndex) {
                // var list = putBlocks.map(function (el: any) { return el.index }).join(',');
                this.service.getBlobUrl(moduleTypeId, fileName, list, filetype, null).subscribe((response1: any) => {
                    if (response1.success) {
                        console.log("response", response1)
                    }
                });

                // }
            }
        })
        // })
    }

    onExportToHtml() {

        var sfdt = { content: this.documentEditor.selection.selectAll() };
        console.log(JSON.stringify(sfdt), this.documentEditor.documentName)
        const body = {
            "sfdtString": "Getting Started (1)",
            "filetype": "html"
        }

    }
    
    savefile(data: any): void {
        var obj = this;
        var label: any;
        fetch('D:/nxus-world/pdfdesigner/NxusWorld/sourcecode/NxusPDFHTMLDesigner/PDFHTMLDesigner/ConvertedFiles/1675225545821_Getting%20Started.html')
            .then(res => res.blob()) // Gets the response and returns it as a blob
            .then(blob => {
                // Here's where you get access to the blob
                // And you can use it for whatever you want
                // Like calling ref().put(blob)
                console.log("/*/***", blob)

                // Here, I use it to make an image appear on the page
                let objectURL = URL.createObjectURL(blob);
                let myImage = new Image();
                myImage.src = objectURL;
                //    this.documentEditor.saveAsBlob(data).then( (exportedDocument: Blob) =>{ 

                if (data == "Docx") {
                    label = '.docx';
                }
                if (data == "Sfdt") {
                    label = '.sfdt'
                }
                // The blob can be processed further 
                var fileName = obj.documentEditor.documentName + '.sfdt';
                var formData = new FormData();
                var filetype = "";
                formData.append('file', blob);
                var httpRequest = new XMLHttpRequest();
                console.log("exported document", blob);
                console.log("files formdata", formData)
                obj.service.uploadFileUrl(formData, 0, 1, fileName, filetype, null).subscribe((response: any) => {
                    if (response.success) {
                        obj.service.getBlobUrl(1, fileName, 0, filetype, null).subscribe((response1: any) => {
                            if (response1.success) {
                                console.log("response", response1)
                            }
                        });
                    }
                })
            });

    }
}
