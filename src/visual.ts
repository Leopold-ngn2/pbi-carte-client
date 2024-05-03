import "./../style/visual.less";
import "./../style/leaflet.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import DataView = powerbi.DataView;
import IVisualHost = powerbi.extensibility.IVisualHost;
type Selection<T extends d3.BaseType> = d3.Selection<T, any, any, any>;
import * as d3 from "d3";
import * as L from "leaflet";

export class Visual implements IVisual {
  private container: Selection<HTMLElement>;
  private map: L.Map;
  private basemap: L.TileLayer;
  private markerLayer: L.LayerGroup<L.Marker>;

  constructor(options: VisualConstructorOptions) {
    this.container = d3.select(options.element)
    .append('div').classed('container', true);
    this.container
      .append("div")
      .attr("id", function (d, i) {
        return "map";
    });
    this.basemap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png');
    this.map = L.map('map');
    this.map.setView([46.978343, -0.837974], 6)
    this.basemap.addTo(this.map);
    this.markerLayer = L.layerGroup();
    this.markerLayer.addTo(this.map)
  }

  public update(options: VisualUpdateOptions) {
            this.markerLayer.clearLayers();

            options.dataViews[0].table.rows.forEach(
                (row) => {
                this.markerLayer.addLayer(L.marker([+row[0], +row[1]]).bindPopup(`
                <h3 id="popup_title">${row[3]}</h3>
                <ul id="popup_list">
                <li><span class="popup_list_field">Rayon leads = </span>${row[2]}</li>
                <li><span class="popup_list_field">Prospect : </span>${row[4]}</li>
                <li><span class="popup_list_field">Famille tarifaire : </span>${row[6]}</li>
                <li><span class="popup_list_field">Lead : </span>${row[5]}</li>
                <li><span class="popup_list_field">Date dernière action commerciale : </span>${new Date(""+row[7]).toDateString()}</li>
                <li><span class="popup_list_field">Date dernière commande : </span>${new Date(""+row[8]).toDateString()}</li>
                <li><span class="popup_list_field">Nombre de devis (6 Mois glissants) : </span>${row[9]}</li>
                </ul>
                `))
                this.markerLayer.addLayer(L.circle([+row[0], +row[1]], {radius: +row[2] * 1000, color: "#60a6f3", weight: 1}))
                }
            )
            this.map.addLayer(this.markerLayer);
  }
  
  public destroy() {
        this.map.remove();
    }
}
