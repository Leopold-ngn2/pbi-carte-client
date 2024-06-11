import "./../style/visual.less";
import "./../style/leaflet.less";
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster/dist/leaflet.markercluster';
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
export declare class Visual implements IVisual {
    private host;
    private container;
    private map;
    private basemap;
    private completeLayer;
    private rayonLeadLayer;
    private leadIcon;
    private clientIcon;
    private prospectIcon;
    constructor(options: VisualConstructorOptions);
    update(options: VisualUpdateOptions): void;
    destroy(): void;
}
