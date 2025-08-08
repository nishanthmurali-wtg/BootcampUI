import {Department} from "./department.model";

export interface Employee {
  id: number;
  nameFirst: string;
  nameLast: string;
  departments: Department[];
}
