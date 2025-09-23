import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageProperties } from '../globaldependencies/constants/localstorage-properties';
import { CreateForm } from '../models/createForm';
import { FormCreationService } from '../services/form-creation.service';
import { FormService } from '../services/formService';

@Component({
  selector: 'app-view-form-component',
  templateUrl: './view-form.component.html'
})
export class ViewsFormComponent implements OnInit {
  getFormModel: CreateForm;
  formModelDetails: any;
  currentDialog: any;
  userId: any;
  formBgColor: any;
  @Input() set formid(id: any) {
    this.getFormDetails(id);
  }
  isFormLoaded: boolean = false;
  form: any;
  formName: any;
  constructor(private formService: FormService, public cdRef: ChangeDetectorRef, private cookieService: CookieService, private formCreationService: FormCreationService) {
    this.form = { components: [] };
    // this.form=JSON.parse( "{\"components\":[{\"label\":\"hidden component\",\"mask\":false,\"tableView\":true,\"alwaysEnabled\":false,\"type\":\"hidden\",\"input\":true,\"key\":\"hiddenComponent\",\"validate\":{\"customMessage\":\"\",\"json\":\"\"},\"conditional\":{\"show\":\"\",\"when\":\"\",\"json\":\"\"},\"encrypted\":false,\"properties\":{},\"customConditional\":\"\",\"logic\":[],\"attributes\":{},\"reorder\":false},{\"label\":\"Container\",\"mask\":false,\"tableView\":true,\"alwaysEnabled\":false,\"type\":\"container\",\"input\":true,\"key\":\"container2\",\"validate\":{\"customMessage\":\"\",\"json\":\"\"},\"conditional\":{\"show\":\"\",\"when\":\"\",\"json\":\"\"},\"components\":[{\"label\":\"Text Field\",\"showWordCount\":false,\"showCharCount\":false,\"tableView\":true,\"alwaysEnabled\":false,\"type\":\"textfield\",\"input\":true,\"key\":\"textField2\",\"defaultValue\":\"\",\"validate\":{\"customMessage\":\"\",\"json\":\"\"},\"conditional\":{\"show\":\"\",\"when\":\"\",\"json\":\"\"},\"widget\":{\"type\":\"\"},\"reorder\":false,\"inputFormat\":\"plain\",\"encrypted\":false,\"properties\":{},\"customConditional\":\"\",\"logic\":[],\"attributes\":{}}],\"reorder\":false,\"encrypted\":false,\"properties\":{},\"customConditional\":\"\",\"logic\":[],\"attributes\":{}},{\"label\":\"Data Grid\",\"disableAddingRemovingRows\":false,\"addAnother\":\"\",\"addAnotherPosition\":\"bottom\",\"removePlacement\":\"col\",\"defaultOpen\":false,\"layoutFixed\":false,\"enableRowGroups\":false,\"reorder\":false,\"mask\":false,\"tableView\":true,\"alwaysEnabled\":false,\"type\":\"datagrid\",\"input\":true,\"key\":\"dataGrid2\",\"defaultValue\":[{},{}],\"validate\":{\"customMessage\":\"\",\"json\":\"\"},\"conditional\":{\"show\":\"\",\"when\":\"\",\"json\":\"\"},\"components\":[{\"label\":\"Number\",\"mask\":false,\"tableView\":true,\"alwaysEnabled\":false,\"type\":\"number\",\"input\":true,\"key\":\"number2\",\"validate\":{\"customMessage\":\"\",\"json\":\"\"},\"conditional\":{\"show\":\"\",\"when\":\"\",\"json\":\"\"},\"reorder\":false,\"delimiter\":false,\"requireDecimal\":false,\"encrypted\":false,\"properties\":{},\"customConditional\":\"\",\"logic\":[],\"attributes\":{},\"row\":\"0-0\"}],\"encrypted\":false,\"properties\":{},\"customConditional\":\"\",\"logic\":[],\"attributes\":{},\"groupToggle\":false},{\"label\":\"Data Map\",\"keyLabel\":\"\",\"mask\":false,\"tableView\":true,\"alwaysEnabled\":false,\"type\":\"datamap\",\"input\":true,\"key\":\"dataMap2\",\"validate\":{\"customMessage\":\"\",\"json\":\"\"},\"conditional\":{\"show\":\"\",\"when\":\"\",\"json\":\"\"},\"valueComponent\":{\"type\":\"textfield\",\"key\":\"value\",\"label\":\"Value\",\"defaultValue\":\"Value\",\"input\":true,\"tableView\":true},\"encrypted\":false,\"reorder\":false,\"properties\":{},\"customConditional\":\"\",\"logic\":[],\"attributes\":{}},{\"label\":\"Edit Grid\",\"reorder\":false,\"mask\":false,\"tableView\":true,\"alwaysEnabled\":false,\"type\":\"editgrid\",\"input\":true,\"key\":\"editGrid2\",\"validate\":{\"customMessage\":\"\",\"json\":\"\"},\"conditional\":{\"show\":\"\",\"when\":\"\",\"json\":\"\"},\"components\":[{\"label\":\"Number\",\"mask\":false,\"tableView\":true,\"alwaysEnabled\":false,\"type\":\"number\",\"input\":true,\"key\":\"number3\",\"validate\":{\"customMessage\":\"\",\"json\":\"\"},\"conditional\":{\"show\":\"\",\"when\":\"\",\"json\":\"\"},\"reorder\":false,\"delimiter\":false,\"requireDecimal\":false,\"encrypted\":false,\"properties\":{},\"customConditional\":\"\",\"logic\":[],\"attributes\":{}}],\"rowClass\":\"\",\"addAnother\":\"\",\"modal\":false,\"saveRow\":\"\",\"encrypted\":false,\"properties\":{},\"customConditional\":\"\",\"logic\":[],\"attributes\":{}},{\"type\":\"button\",\"label\":\"Submit\",\"key\":\"submit\",\"disableOnInvalid\":true,\"theme\":\"primary\",\"input\":true,\"tableView\":true}]}");
    // this.formName="formName";
  }

  ngOnInit() { }
  getFormDetails(id) {
    this.getFormModel = new CreateForm();
    this.getFormModel.Id = id;
    this.formCreationService
      .GetGenericForms(this.getFormModel)
      .subscribe((result: any) => {
        this.formModelDetails = result.data;
        this.formName = this.formModelDetails[0].formName;
        this.formBgColor = this.formModelDetails[0].formBgColor ;
        let formOutput = JSON.parse(this.formModelDetails[0].formJson);
        let updatedNewComponents = [];
        if (formOutput) {
          let components = formOutput.Components;
          components.forEach((comp) => {
            console.log(comp);
            let values = [];
            let keys = Object.keys(comp);
            keys.forEach((key) => {
              values.push(comp[key]);
              let updatedKeyName = key.charAt(0).toLowerCase() + key.substring(1);
              console.log(updatedKeyName);
              let idx = keys.indexOf(key);
              if (idx > -1) {
                keys[idx] = updatedKeyName;
              }
            })
            var updatedModel = {};
            for (let i = 0; i < keys.length; i++) {
              updatedModel[keys[i]] = values[i];
            }
            updatedNewComponents.push(updatedModel);
          })
        }
        console.log(updatedNewComponents);
        this.form.components = updatedNewComponents;
        this.form = this.getcaseObj(this.form)

        this.userId = this.cookieService.get(LocalStorageProperties.CurrentUserId)
        // this.disableTexbox();
        this.isFormLoaded = true;
        this.cdRef.detectChanges();
      });
  }
  getcaseObj(obj) {
    var objects = [];
    for (var i in obj) {
      if (!obj.hasOwnProperty(i)) continue;
      if (typeof obj[i] == 'object') {
        objects = objects.concat(this.getcaseObj(obj[i]));
      } else if (i) {
        var updatedNewComponents = [], components;
        components = obj.components;
        if(components && components.length >=1){
        components.forEach((comp) => {
          let values = [];
          let keys = Object.keys(comp);
          keys.forEach((key) => {
            values.push(comp[key]);
            let updatedKeyName = key.charAt(0).toLowerCase() + key.substring(1);
            console.log(updatedKeyName);
            let idx = keys.indexOf(key);
            if (idx > -1) {
              keys[idx] = updatedKeyName;
            }
          })
          var updatedModel = {};
          for (let i = 0; i < keys.length; i++) {
            updatedModel[keys[i]] = values[i];
          }
          updatedNewComponents.push(updatedModel);
        })
      }
        obj.components = updatedNewComponents;
      }
    }
    return obj;
  }
  disableTexbox() {
    var permissionComponents = ['textfield', 'textarea', 'number', 'select', 'button', 'phonenumber', 'currency', 'signature', 'myfileuploads','livesimageupload' ,'myCustomSelect' , 'table' , 'well'];
    var inputFormJson = this.form;
    // inputFormJson = this.getObjects(inputFormJson, 'type', this.userId, false, ['textfield', 'textarea', 'number', 'select', 'button', 'phonenumber', 'currency', 'signature', 'myfileuploads' ,'myCustomSelect' , 'table' , 'well']);
    for (var i = 0; i < inputFormJson.components.length; i++) {
      var data = {
        isEdit: null,
        isView: null
      }
      if ((permissionComponents.includes(inputFormJson.components[i].type) == true) && inputFormJson.components[i].userEdit && inputFormJson.components[i].userView) {

        for (var j1 = 0; j1 < inputFormJson.components[i].userView.length; j1++) {
          if (inputFormJson.components[i].userView[j1].toLowerCase() == this.userId.toLowerCase()) {
            inputFormJson.components[i].disabled = true;
            data.isEdit = true;
          }
        }
        for (var j = 0; j < inputFormJson.components[i].userEdit.length; j++) {
          if (inputFormJson.components[i].userEdit[j].toLowerCase() == this.userId.toLowerCase()) {
            inputFormJson.components[i].disabled = false;
            data.isView = true;
          }
        }
        if ((permissionComponents.includes(inputFormJson.components[i].type) == true) && (data.isEdit != true && data.isView != true)) {
          inputFormJson.components[i].hidden = true;
        }
      }
      else if (inputFormJson.components[i].userEdit && (permissionComponents.includes(inputFormJson.components[i].type) == true)) {
        for (var j = 0; j < inputFormJson.components[i].userEdit.length; j++) {
          if (inputFormJson.components[i].userEdit[j].toLowerCase() == this.userId.toLowerCase()) {
            inputFormJson.components[i].disabled = false;
          } else if (inputFormJson.components[i].disabled == false) {
            inputFormJson.components[i].hidden = true;
          }
        }

      }
      else if (inputFormJson.components[i].userView && (permissionComponents.includes(inputFormJson.components[i].type) == true)) {
        for (var j = 0; j < inputFormJson.components[i].userView.length; j++) {
          if (inputFormJson.components[i].userView[j].toLowerCase() == this.userId.toLowerCase()) {
            inputFormJson.components[i].disabled = true;
          }
          else if (inputFormJson.components[i].disabled == true) {
            inputFormJson.components[i].hidden = false;
          }
        }
      }
      else if ((permissionComponents.includes(inputFormJson.components[i].type) == true) && !inputFormJson.components[i].userEdit && !inputFormJson.components[i].userView) {
        inputFormJson.components[i].hidden = true;
      }
      else if (inputFormJson.components[i].type == 'table' || (inputFormJson.components[i].type == 'layout')) {
        if (inputFormJson.components[i].userView || inputFormJson.components[i].userEdit) {
          if (inputFormJson.components[i].userView) {
            if (inputFormJson.components[i].userView.includes(this.userId)) {
              for (var n = 0; n < inputFormJson.components[i].rows.length; n++) {
                for (var s = 0; s < inputFormJson.components[i].rows[n].length; s++) {
                  for (var k in inputFormJson.components[i].rows[n][s].components) {
                    if (inputFormJson.components[i].rows[n][s].components[k].userView) {
                      inputFormJson.components[i].rows[n][s].components[k].disabled = inputFormJson.components[i].rows[n][s].components[k].userView.includes(this.userId) ? true : false;
                    } else if (inputFormJson.components[i].rows[n][s].components[k].userEdit) {
                      inputFormJson.components[i].rows[n][s].components[k].disabled = inputFormJson.components[i].rows[n][s].components[k].userEdit.includes(this.userId) ? false : true;
                    }
                    else {
                      inputFormJson.components[i].rows[n][s].components[k].disabled = true;
                    }
                  }
                }
              }
            }else{
              for (var n = 0; n < inputFormJson.components[i].rows.length; n++) {
                for (var s = 0; s < inputFormJson.components[i].rows[n].length; s++) {
                  for (var k in inputFormJson.components[i].rows[n][s].components) {
                    if (inputFormJson.components[i].rows[n][s].components[k].userView) {
                      inputFormJson.components[i].rows[n][s].components[k].disabled = inputFormJson.components[i].rows[n][s].components[k].userView.includes(this.userId) ? true : false;
                    } else if (inputFormJson.components[i].rows[n][s].components[k].userEdit) {
                      inputFormJson.components[i].rows[n][s].components[k].disabled = inputFormJson.components[i].rows[n][s].components[k].userEdit.includes(this.userId) ? false : true;
                    }
                    else {
                      inputFormJson.components[i].rows[n][s].components[k].disabled = true;
                    }
                  }
                }
              }
            }
          }
          else if (inputFormJson.components[i].userEdit) {
            if (inputFormJson.components[i].userEdit.includes(this.userId)) {
              for (var n = 0; n < inputFormJson.components[i].rows.length; n++) {
                for (var s = 0; s < inputFormJson.components[i].rows[n].length; s++) {
                  for (var k in inputFormJson.components[i].rows[n][s].components) {
                    
                    if (inputFormJson.components[i].rows[n][s].components[k].userView) {
                      inputFormJson.components[i].rows[n][s].components[k].disabled = inputFormJson.components[i].rows[n][s].components[k].userView.includes(this.userId) ? true : false;
                    } else if (inputFormJson.components[i].rows[n][s].components[k].userEdit) {
                      inputFormJson.components[i].rows[n][s].components[k].disabled = inputFormJson.components[i].rows[n][s].components[k].userEdit.includes(this.userId) ? false : true;
                    }
                    else {
                      inputFormJson.components[i].rows[n][s].components[k].disabled = false;
                    }
                  }
                }
              }
            }
            else{
              for (var s = 0; s < inputFormJson.components[i].rows[n].length; s++) {
                for (var k in inputFormJson.components[i].rows[n][s].components) {
                  if (inputFormJson.components[i].rows[n][s].components[k].userView) {
                    inputFormJson.components[i].rows[n][s].components[k].disabled = inputFormJson.components[i].rows[n][s].components[k].userView.includes(this.userId) ? true : false;
                  } else if (inputFormJson.components[i].rows[n][s].components[k].userEdit) {
                    inputFormJson.components[i].rows[n][s].components[k].disabled = inputFormJson.components[i].rows[n][s].components[k].userEdit.includes(this.userId) ? false : true;
                  }
                  else {
                    inputFormJson.components[i].rows[n][s].components[k].disabled = false;
                  }
                }
              }
            }
          }
        }
        else if (inputFormJson.components[i].rows) {
          for (var n = 0; n < inputFormJson.components[i].rows.length; n++) {
            for (var s = 0; s < inputFormJson.components[i].rows[n].length; s++) {
              for (var k in inputFormJson.components[i].rows[n][s].components) {
                if (permissionComponents.includes(inputFormJson.components[i].rows[n][s].components[k].type)) {
                  if (inputFormJson.components[i].rows[n][s].components[k].userView) {
                    inputFormJson.components[i].rows[n][s].components[k].disabled = inputFormJson.components[i].rows[n][s].components[k].userView.includes(this.userId) ? true : false;
                  }
                  else if (inputFormJson.components[i].rows[n][s].components[k].userEdit) {
                    inputFormJson.components[i].rows[n][s].components[k].disabled = inputFormJson.components[i].rows[n][s].components[k].userEdit.includes(this.userId) ? false : true;
                  }
                  else {
                    inputFormJson.components[i].rows[n][s].components[k].hidden = true;
                  }
                }
              }
            }
          }
        }
        else if (inputFormJson.components[i].columns) {
          for (var n = 0; n < inputFormJson.components[i].columns.length; n++) {
            for (var s = 0; s < inputFormJson.components[i].columns[n].length; s++) {
              for (var k in inputFormJson.components[i].columns[n][s].components) {
                if (permissionComponents.includes(inputFormJson.components[i].columns[n][s].components[k].type)) {
                  if (inputFormJson.components[i].columns[n][s].components[k].userView) {
                    inputFormJson.components[i].columns[n][s].components[k].disabled = inputFormJson.components[i].columns[n][s].components[k].userView.includes(this.userId) ? true : false;
                  }
                  else if (inputFormJson.components[i].columns[n][s].components[k].userEdit.includes(this.userId)) {
                    inputFormJson.components[i].columns[n][s].components[k].disabled = inputFormJson.components[i].columns[n][s].components[k].userEdit.includes(this.userId) ? false : true;
                  }
                  else {
                    inputFormJson.components[i].columns[n][s].components[k].hidden = true;
                  }
                }
              }
            }
          }
        }
      }
    }
    this.form = { components: inputFormJson.components }
  }
  
}
