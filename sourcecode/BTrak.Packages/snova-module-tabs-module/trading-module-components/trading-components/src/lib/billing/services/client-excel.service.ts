import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
//import * as StyleUtils from "xlsx-style";
import { Observable } from "rxjs";

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class ClientExcelService {
  constructor() { }
  public exportAsExcelFile(json: any[], excelFileName: string): void {

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    worksheet['A1'].v = 'First Name';
    worksheet['B1'].v = 'Last Name';
    worksheet['C1'].v = 'Full Name';
    worksheet['D1'].v = 'Email';
    worksheet['E1'].v = 'Company Name';
    worksheet['F1'].v = 'Company Website';
    worksheet['G1'].v = 'Mobile No';
    worksheet['H1'].v = 'Street';
    worksheet['I1'].v = 'City';
    worksheet['J1'].v = 'Zip Code';
    worksheet['K1'].v = 'State';
    worksheet['L1'].v = 'Country Name';
    worksheet['M1'].v = 'Project Name';
    worksheet['N1'].v = 'Note';

    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}