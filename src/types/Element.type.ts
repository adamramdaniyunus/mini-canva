export type ElementComponent = {
  id: number;
  name: string;
  type: string;
  height: number;
  width: number;
  z_index: number;
  color: string;
  image: string;
  top?: number;
  left?: number;
  rotation?: number;
  text?: string;
  font_size?: number;
  font_family?: string;
  font_italic?: boolean;
  font_bold?: boolean;
  align?: "left" | "center" | "right" | "justify";
  uuid: string;
}
