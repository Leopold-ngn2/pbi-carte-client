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
  private markerLayer: L.LayerGroup<L.CircleMarker>;

  constructor(options: VisualConstructorOptions) {
    /*
    head[0].append(
      '<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.5/leaflet.js"></script>'
    );
    */
    this.container = d3.select(options.element)
    .append('div').classed('container', true);
    this.container
      .append("div")
      .attr("id", function (d, i) {
        return "map";
    });

      this.basemap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png');

      this.map = L.map('map');

      this.map.setView([46.978343, -0.837974], 8)

      this.basemap.addTo(this.map);

      L.marker([46.978343, -0.837974]).addTo(this.map)
      L.circle([46.978343, -0.837974], { radius: 1000 }).addTo(this.map)

      //this.map.addLayer(this.basemap);
  }

  public update(options: VisualUpdateOptions) {
    // =  'height', options.viewport.height
   // .css('width', options.viewport.width);


    /*
        let dataView: DataView = options.dataViews[0];
        let width: number = options.viewport.width;
        let height: number = options.viewport.height;
        this.svg.attr("width", width);
        this.svg.attr("height", height);
        let radius: number = Math.min(width, height) / 2.2;
        this.circle
            .style("fill", "white")
            .style("fill-opacity", 0.5)
            .style("stroke", "black")
            .style("stroke-width", 2)
            .attr("r", radius)
            .attr("cx", width / 2)
            .attr("cy", height / 2);
        let fontSizeValue: number = Math.min(width, height) / 5;
        this.textValue
            .text(<string>dataView.single.value)
            .attr("x", "50%")
            .attr("y", "50%")
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .style("font-size", fontSizeValue + "px");
        let fontSizeLabel: number = fontSizeValue / 4;
        this.textLabel
            .text(dataView.metadata.columns[0].displayName)
            .attr("x", "50%")
            .attr("y", height / 2)
            .attr("dy", fontSizeValue / 1.2)
            .attr("text-anchor", "middle")
            .style("font-size", fontSizeLabel + "px");
        */

  }
  
  public destroy() {
    this.map.remove();
    }
    
}
