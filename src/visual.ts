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
            console.log(options.dataViews[0].categorical.categories);
            let categories = options.dataViews[0].categorical.categories;

            categories[0].values.forEach(
                (value, i) => {
                this.markerLayer.addLayer(L.marker([+categories[1].values[i], +categories[0].values[i]]).bindPopup(`
                <h3 id="popup_title">${categories[2].values[i]} - CA : ${Math.round(+options.dataViews[0].categorical.values[1].values[i])} €</h3>
                <ul id="popup_list">
                <li><span class="popup_list_field">Rayon leads : </span>${categories[3].values[i]} km</li>
                <li><span class="popup_list_field">Prospect : </span>${categories[4].values[i]}</li>
                <li><span class="popup_list_field">Famille tarifaire : </span>${categories[5].values[i]}</li>
                <li><span class="popup_list_field">Lead : </span>${categories[6].values[i]}</li>
                <li><span class="popup_list_field">Date dernière action commerciale : </span>${new Date(""+categories[7].values[i]).toDateString()}</li>
                <li><span class="popup_list_field">Date dernière commande : </span>${new Date(""+categories[8].values[i]).toDateString()}</li>
                <li><span class="popup_list_field">Nombre de devis : </span>${options.dataViews[0].categorical.values[0].values[i]}</li>
                </ul>
                `))
                this.markerLayer.addLayer(L.circle([+categories[1].values[i], +categories[0].values[i]], {radius: +categories[3].values[i] * 1000, color: "#60a6f3", weight: 1}))
                }
            )
            this.map.addLayer(this.markerLayer);
  }
  
  public destroy() {
        this.map.remove();
    }
}
