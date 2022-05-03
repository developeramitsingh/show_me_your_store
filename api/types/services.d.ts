declare interface IGetAllData {
    count: number;
    data: IProducts[];
}

declare interface IQueryInterface {
  query: any;
  limit: number;
  offset: number;
  sort: any;
}
