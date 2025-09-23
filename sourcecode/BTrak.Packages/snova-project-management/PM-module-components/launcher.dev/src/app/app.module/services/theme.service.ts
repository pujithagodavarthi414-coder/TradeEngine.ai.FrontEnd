import { Injectable } from "@angular/core";
import * as domHelper from "../helpers/dom.helper";

interface ITheme {
  name: string,
  baseColor?: string,
  isActive?: boolean
}

@Injectable()
export class ThemeService {
  egretThemes = [{
    name: 'egret-blue',
    baseColor: '#247ba0',
    isActive: false,
    companyThemeId: 'FD2ABC0F-F8D7-47C4-A7BD-BAA637E14BD5'
  },
  {
    name: "egret-btrak",
    baseColor: "#3da8b5",
    isActive: true,
    companyThemeId: '752471EB-94F4-4A33-8C3B-6E0A8D42F0D1'
  },
  {
    name: 'egret-lime-green',
    baseColor: '#3ca956',
    isActive: false,
    companyThemeId: 'B5769B53-4718-4DFD-9201-E03C4D3A665E'
  },
  {
    name: 'egret-indigo',
    baseColor: '#3f51b5',
    isActive: false,
    companyThemeId: '9BC13630-98FE-4498-8557-465E4C64F444'
  },
  {
    name: 'egret-dark-blue',
    baseColor: '#0074A6',
    isActive: false,
    companyThemeId: 'A0C5B5F6-E9EA-442B-AFFB-77B9F631421E'
  },
  {
    name: 'egret-very-dark-magenta',
    baseColor: '#561f55',
    isActive: false,
    companyThemeId: 'DE636C82-4CB6-4F84-8730-CF2B9D9C39D4'
  },
  {
    name: "egret-grayish-cyan",
    baseColor: "#9fa8a3",
    isActive: false,
    companyThemeId: '0929D35A-3573-4B06-93FB-C7D46AAFA918'
  },
  {
    name: "egret-desaturated-pink",
    baseColor: "#59323c",
    isActive: false,
    companyThemeId: '576E2F5C-22DE-4D90-A21E-1ACA1364DC72'
  },
  {
    name: 'egret-desaturated-dark-cyan',
    baseColor: '#4e7b68 ',
    isActive: false,
    companyThemeId: 'C00FFAB9-6451-4820-A53B-CC4FFB6E07F0'
  },
  {
    name: 'egret-desaturated-orange',
    baseColor: '#a68572',
    isActive: false,
    companyThemeId: 'F3F05E52-6310-4C26-BE8C-690BA6380739'
  },
  {
    name: 'egret-soft-red',
    baseColor: '#eb6f7b',
    isActive: false,
    companyThemeId: '81CC4F29-5561-4FC8-AE72-A4F6C84B134E'
  },
  {
    name: 'egret-dark-yellow',
    baseColor: '#a89344',
    isActive: false,
    companyThemeId: '3F1FEFA0-977C-4DFA-B989-8CCD7E8D9047'
  },
  {
    name: 'egret-strong-blue',
    baseColor: '#06acc1',
    isActive: false,
    companyThemeId: 'A30D4C15-F90E-461D-A46B-17DBAEFEF70E'
  },
  {
    name: 'egret-dark-grayish-green',
    baseColor: '#9dab86',
    isActive: false,
    companyThemeId: '41692008-E752-40C2-B603-CF5570B32743'
  },
  {
    name: 'egret-moderate-orange',
    baseColor: '#d5763f',
    isActive: false,
    companyThemeId: 'EE551928-63C1-449A-97FB-B06361F82466'
  },
  {
    name: 'egret-bright-red',
    baseColor: '#fa4252',
    isActive: false,
    companyThemeId: '4C7E967D-27C0-4FF8-A73B-C654D3BFC2A8'
  },
  {
    name: 'egret-dark-moderate-violet',
    baseColor: '#662E8F',
    isActive: false,
    companyThemeId: '10A47983-A043-44DF-9242-3BD5FF282208'
  },
  {
    name: 'egret-grayish-blue',
    baseColor: '#4b4e52',
    isActive: false,
    companyThemeId: '32BE8C7C-94AA-4F6D-B28E-D4DCF8B20609'
  },
  {
    name: 'egret-rebecca-purple',
    baseColor: '#662E8F',
    isActive: false,
    companyThemeId: '3E8A43CD-57D2-48FA-AD6B-4089845DC656'
  },
  {
    name: 'egret-bright-blue',
    baseColor: '#002060',
    isActive: false,
    companyThemeId: 'F6006F47-700C-4FC1-AE03-2242A212C836'
  }
  ];
  activatedThemeName: String;
  constructor() {
  }
  changeTheme(theme) {

    const themeColors = this.egretThemes;
    const filteredThemes = themeColors.filter((color) => {
      return color.companyThemeId.toLowerCase() === theme.companyThemeId.toLowerCase()
    })
    theme = filteredThemes[0];
    localStorage.setItem('themeColor', theme.baseColor)
    domHelper.changeTheme(this.egretThemes, theme.name);
    this.egretThemes.forEach((t) => {
      t.isActive = false;
      if (t.name === theme.name) {
        t.isActive = true;
        this.activatedThemeName = theme.name;
      }
    });
  }
}
