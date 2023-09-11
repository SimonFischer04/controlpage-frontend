import {FrontendField} from "./frontend-field";
import {FullViewDTO} from "../../../gen";

export interface FrontendFullView extends FullViewDTO {
  fields?: FrontendField[][];
}
