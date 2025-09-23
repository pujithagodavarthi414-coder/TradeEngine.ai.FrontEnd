import { SearchTaskType } from "../components/menu/searchTask.enum";
import { RecentSearchType } from '../enum/recentSearchType.enum';

export class RecentSearchModel {
    public recentSearch: string;
    public createdDateTime: Date;
    public itemId: string;
    public recentSearchType: RecentSearchType;
  }

  export class SearchTaskTypeModel {
    public id: string;
    public name: string;
    public uniquename: string;
    public type: SearchTaskType
  }