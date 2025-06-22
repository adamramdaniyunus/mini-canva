import { ElementComponent } from "./Element.type";

export type CanvasType = {
    id: string;
    project_id: string;
    width: number;
    height: number;
    components: ElementComponent[];
    background_color: string;
    background_image: string;
    preview_url:string;
}