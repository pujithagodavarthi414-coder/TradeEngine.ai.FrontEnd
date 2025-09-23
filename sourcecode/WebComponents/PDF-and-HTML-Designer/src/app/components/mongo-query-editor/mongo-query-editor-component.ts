import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { DocumentService } from 'src/app/services/document.service';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { ToastrService } from 'ngx-toastr';
import * as _ from "underscore";
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-mongo-query-editor',
  templateUrl: './mongo-query-editor-component.html'
})
export class MongoQueryEditorComponent implements OnInit {
  @ViewChild("addDataSourceDialog") addDataSourceDialog: TemplateRef<any>;
  @ViewChild("mongoParamValues") mongoParamValues: TemplateRef<any>;
  @ViewChild("mongoParamTypes") mongoParamTypes: TemplateRef<any>;
  @ViewChild('addDataSourceFirstField', { static: false }) addDataSourceFirstField!: ElementRef;
  @ViewChild('addParameterFirstField', { static: false }) addParameterFirstField!: ElementRef;
  @ViewChild('addParameterTypeFirstField', { static: false }) addParameterTypeFirstField!: ElementRef;

  @Input("templateId")
  set _templateId(data: any) {
    this.templateId = data;
  };

  @Input("editDataSourceValues")
  set _editDataSourceValues(data: any) {
    this.openAddDataSource();
    if (data != null) {
      this.editDataSourceId = data.id;
      this.addDataSourceForm.controls['dataSource'].setValue(data.dataSourceName);
      this.addDataSourceForm.controls['mongoQuery'].setValue(data.mongoQuery);
      this.mongoQueryParams = data.mongoParamsType;
      this.mongoQueryDummyValues = data.mongoDummyParams;
    }
  };


  @Output() refreshTreeData = new EventEmitter();
  @Output() closeDataSource = new EventEmitter();

  templateId: any;
  addDataSourceForm: FormGroup;
  //addDataSource: boolean = false;
  //addDataSourceForm: FormGroup;
  TemplateNameForm: FormGroup;
  addMongoQueryParamsForm: FormGroup;
  addMongoQueryDummyParamsForm: FormGroup;
  //  mongoQueryParams:{ name: string; type: string }[] = [{name:'Contact number' , type:'string'},{name:'Invoice number' , type:'string'}];
  //  mongoQueryDummyValues:{ name: string; value: string }[] = [{name:'Contact number' , value:'8735834753'},{name:'Invoice number' , value:'3425624245'}];
  mongoQueryParams: { name: string; type: string }[] = [];
  mongoQueryDummyValues: { name: string; value: string }[] = [];
  showaddMongoQueryParams: boolean = false;
  showaddMongoQueryDummyValues: boolean = false;
  addDataSourceFormSubmitted: boolean = false;
  savedDataSource: any;
  tempMenuItems: any = [];
  newTemplateId: string = Guid.create().toString();
  editDataSourceId: any = null;
  editMongoParamtypeIndex: any = null;
  editmongoQueryDummyValueIndex: any = null;
  anyOperationInProgress: boolean = false;
  saveDataSourceClicked: boolean = false;
  saveMongoQueryParamsFormClicked: boolean = false;
  saveMongoQueryDummyParamsFormClicked: boolean = false;
  addDataSourceDialogId: string;
  addMongoParamTypeDialogId: string;
  addMongoParamValueDialogId: string;
  //mongoDataTypes = ["Array","Binary","Boolean","Code","Date","Decimal128","Double","Int32","Int64","MaxKey","MinKey","Null","Object","ObjectId","BSONRegExp","String","BSONSymbol","TimeStamp","undefined"];

  mongoDataTypes = ["Array", "Binary", "Boolean", "Date", "Decimal", "Double", "Int", "Null", "Object", "ObjectId", "BSONRegExp", "String", "TimeStamp"];

  constructor(private service: DocumentService, private http: HttpClient, private toastr: ToastrService, private cdRef: ChangeDetectorRef,
    public dataSourceDialog: MatDialog, public mongoParamTypeDialog: MatDialog, public mongoParamValuesDialog: MatDialog) {

  }

  ngOnInit() {
    // this.openAddDataSource();
    //this.initilaizeTarget();
  }

  openAddDataSourceDialog() {
    this.addDataSourceDialogId = "add-data-source-popup";
    const dialogRef = this.dataSourceDialog.open(this.addDataSourceDialog, {
      width: "50%",
      maxHeight: "90vh",
      disableClose: true,
      id: this.addDataSourceDialogId,
      //data: { items: applications }
    });

  }

  ngAfterViewInit(): void {
    this.openAddDataSourceDialog();
  }


  onBeforeOpen = function (args: any): void {
    // setting maxHeight to the Dialog.
    args.maxHeight = '720px';
  }
  openAddDataSource() {
    //this.addDataSource = true;
    this.addDataSourceForm = new FormGroup({
      dataSource: new FormControl("",
        Validators.compose([
          Validators.required
        ])
      ),
      mongoQuery: new FormControl("",
        Validators.compose([
          Validators.required
        ])
      ),
    });
    setTimeout(() => {
      this.addDataSourceFirstField.nativeElement.focus();
    }, 1000);
  }

  saveDataSource() {
    if (this.anyOperationInProgress != true) {
      //this.saveDataSourceClicked = true;
      this.anyOperationInProgress = true;
      if (this.addDataSourceForm.valid
        // && this.mongoQueryParams.length && this.mongoQueryDummyValues.length
      ) {
        var newGuid = Guid.create().toString();
        // var dataSourceMongoQuery = this.addDataSourceForm.value;
        // dataSourceMongoQuery.dataSource = dataSourceMongoQuery.dataSource.trimStart().trimEnd();
        // dataSourceMongoQuery.mongoQuery = dataSourceMongoQuery.mongoQuery.trimStart().trimEnd();
        var dataSourceDetails = {
          _id: this.editDataSourceId ? this.editDataSourceId : newGuid,
          templateId: this.templateId ? this.templateId : this.newTemplateId,
          dataSourceMongoQuery: this.addDataSourceForm.value,
          dataSorceParamsType: this.mongoQueryParams,
          dataSourceDummyParamValues: this.mongoQueryDummyValues,
          update: this.editDataSourceId ? true : false,
          archive: false
        };
        this.service.saveDataSource(dataSourceDetails).subscribe((responsedata: any) => {
          if (responsedata.success == true && responsedata.data != null) {
            this.savedDataSource = responsedata.data;
            this.toastr.success('Data source saved successfully');

            let response = this.savedDataSource;
            this.refreshTreeData.emit(true);
            this.closeAddDataSourceDialog();
          } else {
            if (responsedata.success === false) {
              const validationMessage = responsedata.apiResponseMessages[0].message;
              this.toastr.error(validationMessage);
            }
          }
          this.anyOperationInProgress = false;
        })
      }
      // else if (this.mongoQueryParams.length == 0) {
      //   this.anyOperationInProgress = false;
      //   this.toastr.error("Please provide mongo query parameters");
      // }
      // else if (this.mongoQueryDummyValues.length == 0) {
      //   this.anyOperationInProgress = false;
      //   this.toastr.error("Please provide mongo query dummy parameters");
      // }
    }
  }

  closeAddDataSourceDialog() {
    this.saveDataSourceClicked = false;
    //this.addDataSource = false;
    this.closeDataSource.emit(true);
    this.closeMongoQueryParams();
    this.closeMongoQueryDummyValues();
    this.mongoQueryParams = [];
    this.mongoQueryDummyValues = [];
    this.editDataSourceId = null;
    let docDialog = this.dataSourceDialog.getDialogById(this.addDataSourceDialogId);
    docDialog.close();
  }

  saveMongoQueryParamsForm() {
    this.saveMongoQueryParamsFormClicked = true;
    var inputModel = this.addMongoQueryParamsForm.value;
    var mongoQueryForm = this.addDataSourceForm.value;
    inputModel.parameterName = inputModel.parameterName.trimStart().trimEnd();
    inputModel.parameterType = inputModel.parameterType.trimStart().trimEnd();
    if (mongoQueryForm.mongoQuery.includes("%" + inputModel.parameterName + "%")) {
      var findvalue = this.findValue(this.mongoQueryDummyValues, inputModel.parameterName)
      if (findvalue.length > 0) {
        this.toastr.error("'" + inputModel.parameterName + "'" + " Parameter data type can not be changed after adding dummy value");
      }
      else {
        if (this.editMongoParamtypeIndex != null) {
          this.mongoQueryParams[this.editMongoParamtypeIndex] = { name: inputModel.parameterName, type: inputModel.parameterType };
        }
        else {
          this.mongoQueryParams.push({ name: inputModel.parameterName.trimStart().trimEnd(), type: inputModel.parameterType.trimStart().trimEnd() });
        }
        this.closeMongoQueryParams();
      }
    }
    else {
      this.toastr.error("Parameter name  " + "'" + inputModel.parameterName + "'" + " is not exists as a mongo parameter in the query");
    }
  }


  findValue(arr, value) {
    return _.filter(arr, function (object) {
      return object['name'].toLowerCase().indexOf(value.toLowerCase()) >= 0;
    });
  }

  openMongoQueryParams() {
    this.showaddMongoQueryParams = true;
    this.editMongoParamtypeIndex = null;
    this.addMongoQueryParamsForm = new FormGroup({
      parameterName: new FormControl("",
        Validators.compose([
          Validators.required
        ])
      ),
      parameterType: new FormControl("",
        Validators.compose([
          Validators.required
        ])
      ),
    });

    this.addMongoParamTypeDialogId = "add-mongo-param-type";
    const dialogRef = this.mongoParamTypeDialog.open(this.mongoParamTypes, {
      width: "28%",
      maxHeight: "60vh",
      disableClose: true,
      id: this.addMongoParamTypeDialogId,
    });
    setTimeout(() => {
      this.addParameterFirstField.nativeElement.focus();
    }, 1000);

  }
  editMongoParamtype(data, index) {
    this.openMongoQueryParams();
    this.editMongoParamtypeIndex = index;
    this.addMongoQueryParamsForm.controls['parameterName'].setValue(data.name);
    this.addMongoQueryParamsForm.controls['parameterType'].setValue(data.type);
  }
  archiveMongoParamtype(index) {
    this.mongoQueryParams.splice(index, 1);
  }

  editmongoQueryDummyValues(data, index) {
    this.openMongoQueryDummyValues();
    this.editmongoQueryDummyValueIndex = index;
    this.addMongoQueryDummyParamsForm.controls['parameterName'].setValue(data.name);
    this.addMongoQueryDummyParamsForm.controls['parameterValue'].setValue(data.value);
  }
  archivemongoQueryDummyValues(index) {
    this.mongoQueryDummyValues.splice(index, 1);
  }

  saveMongoQueryDummyParamsForm() {
    var inputModel = this.addMongoQueryDummyParamsForm.value;
    inputModel.parameterName = inputModel.parameterName.trimStart().trimEnd();
    inputModel.parameterValue = inputModel.parameterValue.trimStart().trimEnd();
    var dataTypeOfParam = this.mongoQueryParams.find(o => o.name === inputModel.parameterName);
    if (dataTypeOfParam != null) {
      var isValidDummyValue = this.validateDummyValue(inputModel.parameterValue, dataTypeOfParam?.type);
      if (isValidDummyValue) {
        if (this.editmongoQueryDummyValueIndex != null) {
          this.mongoQueryDummyValues[this.editmongoQueryDummyValueIndex] = { name: inputModel.parameterName, value: inputModel.parameterValue };
        }
        else {
          this.mongoQueryDummyValues.push({ name: inputModel.parameterName, value: inputModel.parameterValue });
        }
        this.closeMongoQueryDummyValues();
      }
      else {
        if (dataTypeOfParam?.type == "Date") {
          this.toastr.error("Dummy value " + "'" + inputModel.parameterValue + "'" + " is not in the Date format YYYY-MM-DD ");
        }
        else if (dataTypeOfParam?.type == "TimeStamp") {
          this.toastr.error("Dummy value " + "'" + inputModel.parameterValue + "'" + " is not in the TimeStamp format YYYY-MM-DDTHH:mm:ss.SSSZ ");
        }
        else {
          this.toastr.error("Dummy value " + "'" + inputModel.parameterValue + "'" + " is not of type " + dataTypeOfParam?.type);
        }
      }
    }
    else {
      this.toastr.error("Parameter name  " + "'" + inputModel.parameterName + "'" + " is not exists");
    }
  }

  closeMongoQueryParams() {
    this.showaddMongoQueryParams = false;
    this.saveMongoQueryParamsFormClicked = false;
    let mongoParmTypeDialog = this.mongoParamTypeDialog.getDialogById(this.addMongoParamTypeDialogId);
    if (mongoParmTypeDialog) {
      mongoParmTypeDialog.close();
    }
  }
  openMongoQueryDummyValues() {
    if (this.mongoQueryParams.length) {
      this.showaddMongoQueryDummyValues = true;
      this.editmongoQueryDummyValueIndex = null;
      this.addMongoQueryDummyParamsForm = new FormGroup({
        parameterName: new FormControl("",
          Validators.compose([
            Validators.required
          ])
        ),
        parameterValue: new FormControl("",
          Validators.compose([
            Validators.required
          ])
        ),
      });

      this.addMongoParamValueDialogId = "add-mongo-param-value";
      const dialogRef = this.mongoParamValuesDialog.open(this.mongoParamValues, {
        width: "28%",
        maxHeight: "60vh",
        disableClose: true,
        id: this.addMongoParamValueDialogId,
      });
      setTimeout(() => {
        this.addParameterTypeFirstField.nativeElement.focus();
      }, 1000);

    }
    else {
      this.toastr.error("Please enter mongo parameters type");
    }
  }
  closeMongoQueryDummyValues() {
    this.showaddMongoQueryDummyValues = false;
    this.saveMongoQueryDummyParamsFormClicked = false;

    let mongoParmValueDialog = this.mongoParamValuesDialog.getDialogById(this.addMongoParamValueDialogId);
    if (mongoParmValueDialog) {
      mongoParmValueDialog.close();
    }
  }


  validateDummyValue(value, type): boolean {
    try {
      if (value != null) {
        if (type == "Array") {
          var myArr = JSON.parse(value);
          return myArr && myArr[0] ? true : false;
        }
        if (type == "Binary") {
          return /^[0-1]+$/.test(value);
        }
        if (type == "Boolean" && (value == "true" || value == "false")) {
          return true;
        }
        if (type == "Date") {
          return this.isValidDate(value);
        }
        if (type == "Decimal") {
          return !isNaN(Number(value));
        }
        if (type == "Double") {
          return !isNaN(Number(value));;
        }
        if (type == "Int") {
          // return Number.isInteger(Number(value));
          return this.isValidInt(value);
        }
        // if(type=="MaxKey")
        // {
        //   return true;
        // }
        // if(type=="MinKey")
        // {
        //   return true;
        // }
        if (type == "Null" && value == "null") {
          return true;
        }
        if (type == "Object") {
          // var obj = JSON.parse(value);
          // if(obj !== null && obj.constructor.name === "Object")
          // {
          // return true;
          // }
          return this.isMongoObject(value);
        }
        if (type == "ObjectId") {
          return this.validateMongoDBObjectId(value);
        }
        if (type == "BSONRegExp") {
          return this.validateMongoDBBSONRegExp(value);
        }
        if (type == "String") {
          return true;
        }
        // if(type=="BSONSymbol")
        // {
        //   return true;
        // }
        if (type == "TimeStamp") {
          return this.validateMongoDBTimestamp(value);
        }
        // if(type=="undefined")
        // {
        //   return true;
        // }
      }
      return false;
    }
    catch (e) {
      console.log(e);
      return false;
    }
  }

  isMongoObject(input: string): boolean {
    try {
      const parsedObject = eval('(' + input + ')');
      if (typeof parsedObject === 'object' && parsedObject !== null && !Array.isArray(parsedObject)) {
        for (const key in parsedObject) {
          if (!key.match(/^[a-zA-Z_$][a-zA-Z_$0-9]*$/)) {
            return false;
          }
        }
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  isValidDate(dateString) {
    var regEx = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regEx)) return false;  // Invalid format
    var d = new Date(dateString);
    var dNum = d.getTime();
    if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
    return d.toISOString().slice(0, 10) === dateString;
  }

  isValidInt(int) {
    var regEx = /^\d+$/;
    if (int.match(regEx)) {
      return true;
    }
    else {
      return false;
    }
  }


  isValidTimestamp(_timestamp) {
    const newTimestamp = new Date(_timestamp).getTime();
    return this.isNumeric(newTimestamp);
  }

  validateMongoDBTimestamp(timestamp: string): boolean {
    const timestampRegex = /^(\d{4})-(0[1-9]|1[0-2])-([0-2]\d|3[01])T([01]\d|2[0-3]):([0-5]\d):([0-5]\d)\.\d{3}Z$/;

    if (!timestampRegex.test(timestamp)) {
      return false; // Invalid format
    }

    const dateParts = timestamp.split(/[-T:.Z]/).map(Number);
    const year = dateParts[0];
    const month = dateParts[1] - 1; // Month is zero-based in JavaScript Date object
    const day = dateParts[2];

    const date = new Date(year, month, day);
    const isValidDate = date.getFullYear() === year &&
      date.getMonth() === month &&
      date.getDate() === day;

    return isValidDate;
  }

  validateMongoDBBSONRegExp(value: string): boolean {
    //const bsonRegExpRegex = /^\/[^/]+\/[gimsuy]*$/;
    const bsonRegExpRegex = /^\/.+\/[gimsuy]*$/

    if (!bsonRegExpRegex.test(value)) {
      return false;
    }

    return true;
  }

  validateMongoDBObjectId(value: string): boolean {
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    const objectId = value.toLowerCase();

    if (!objectIdRegex.test(objectId)) {
      return false;
    }

    // Check if all components are zero
    const isAllZero = /^[0]{24}$/.test(objectId);
    if (isAllZero) {
      return false;
    }

    return true;
  }

  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
}

