import "./../style/visual.less";
import "./../style/leaflet.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
export declare class Visual implements IVisual {
    private container;
    private map;
    private basemap;
    private leadLayer;
    private clientLayer;
    private prospectLayer;
    private leadIcon;
    private clientIcon;
    private prospectIcon;
    constructor(options: VisualConstructorOptions);
    update(options: VisualUpdateOptions): void;
    destroy(): void;
}
