import {HorizontalAlignment} from "./horizontal-alignment";
import {VerticalAlignment} from "./vertical-alignment";

export interface StyledText {
  id: number;
  text: string;
  horizontalAlignment: HorizontalAlignment;
  verticalAlignment: VerticalAlignment;
  color: string;
}
