export interface Group {
  id: number;
  name: string;
  childGroups: Group[];
  parentGroup: Group;
}
