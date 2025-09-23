export class PositionModel {
    positionName : string;
    commodity: string;
    openingBalance: any;
    ytDgross : any;
    ytDgross1: any;
    ytDgross2: any;
    ytDgross3: any;
    ytDgross4: any;
    ytDgross5: any;
    ytDgross6: any;
    ytDgross7: any;
    totalGross: any;
    netClosing : any;
    netOpening : any;
    dayChange : any;
    dayChangeMtm : any;
    dailyMTM : any;
    dayPAndL : any;
    mtdpAndL : any;
    ytdRealisedPAndL : any;
    ytdUnRealisedPAndL : any;
    ytdTotalPAndL : any;
    childrenCount: number;
    groupName : string;
    isExpanded: boolean;
    subGroupName : string;
    isRowExpanded : boolean;
    children: PositionModel[];
    isGroupBy : boolean;
    isBold: boolean;
    isHide : boolean;
    commodityKey: string;
    totalGrossText: string;
    ytDgrossText : string;
    companyName: string;
    dayChangeMtmValue: any;
    dailyMTMValue: any;
    netOpeningText: any;
    
}

export class  GroupBy {
    groupName: string;
    isGroupBy: boolean;
}

export class Group {
    level = 0;
    parent: Group;
    expanded = true;
  }

