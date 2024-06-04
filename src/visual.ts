import "./../style/visual.less";
import "./../style/leaflet.less";
import * as L from "leaflet";
import * as d3 from "d3";
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster/dist/leaflet.markercluster';

import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import IVisual = powerbi.extensibility.visual.IVisual;
type Selection<T extends d3.BaseType> = d3.Selection<T, any, any, any>;

export class Visual implements IVisual {
  private host: IVisualHost;
  private container: Selection<HTMLElement>;
  private map: L.Map;
  private basemap: L.TileLayer;
  private completeLayer: L.LayerGroup<L.Marker>;
  /*
  private leadLayer: L.LayerGroup<L.Marker>;
  private clientLayer: L.LayerGroup<L.Marker>;
  private prospectLayer: L.LayerGroup<L.Marker>;
  */
  private leadIcon: L.Icon;
  private clientIcon: L.Icon;
  private prospectIcon: L.Icon;

  constructor(options: VisualConstructorOptions) {
    this.host = options.host;
    this.container = d3.select(options.element)
     .append('div').classed('container', true)
    this.container
     .append("div")
     .attr("id", function (d, i) {
       return "map";
     })

    this.basemap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png');
    this.map = L.map('map');
    this.map.setView([46.978343, -0.837974], 6)
    this.basemap.addTo(this.map);
    //@ts-ignore
    this.completeLayer = L.markerClusterGroup({disableClusteringAtZoom: 9});
    this.completeLayer.addTo(this.map)
    /*
    //@ts-ignore
    this.leadLayer = L.layerGroup();
    this.leadLayer.addTo(this.completeLayer)
    this.leadLayer.addTo(this.map)
    //@ts-ignore
    this.clientLayer = L.layerGroup();
    this.clientLayer.addTo(this.completeLayer)
    this.clientLayer.addTo(this.map)
    //@ts-ignore
    this.prospectLayer = L.layerGroup();
    this.prospectLayer.addTo(this.completeLayer)
    this.prospectLayer.addTo(this.map)
*/
    const baseMaps = {
      "OpenStreetMap": this.basemap
    };
    const overlayMaps = {
      "Tout": this.completeLayer,
      /*"Leads": this.leadLayer,
      "Clients": this.clientLayer,
      "Prospects": this.prospectLayer*/
    };
    L.control.layers(baseMaps, overlayMaps).addTo(this.map);
    this.leadIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    this.clientIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    this.prospectIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  }

  public update(options: VisualUpdateOptions) {
    //this.leadLayer.clearLayers();
    //this.clientLayer.clearLayers();
    //this.prospectLayer.clearLayers();
    this.completeLayer.clearLayers();
    let categories = options.dataViews[0].categorical.categories;
    categories[0].values.forEach(
      (value, i) => {
        const popup = `
                <h3 id="popup_title">${categories[2].values[i]}</h3>
                <ul id="popup_list">
                <li><span class="popup_list_field">CA sur l'année : </span>${Math.round(+options.dataViews[0].categorical.values[1]?.values[i] || 0)} €</li>
                <li><a id="id_${categories[16].values[i]}" href="https://10.90.40.45:8443/CochiseWeb/dm1/gererClient/gererClient.do?cmd=consulterClient&id=${categories[16].values[i]}" target="_blank">Ouvrir la fiche client</a></li>
                <li><a href="https://10.90.40.45:8443/CochiseWeb/dm1/afficherTableauDeBord/afficherTableauDeBord.do?cmd=validateInstanceEntite&idUCTableauDeBord=tableauDeBord_SIB_0009&idInstanceEntite=${categories[16].values[i]}" target="_blank">Ouvrir dans le TDB synthèse client</a></li>
                <li><span class="popup_list_field">Rayon leads : </span>${categories[3].values[i]} km</li>
                <li><span class="popup_list_field">Prospect : </span>${categories[4].values[i]}</li>
                <li><span class="popup_list_field">Famille tarifaire : </span>${categories[5].values[i]}</li>
                <li><span class="popup_list_field">Lead : </span>${categories[6].values[i]}</li>
                <li><span class="popup_list_field">Date dernière action commerciale : </span>${categories[7].values[i] ? new Date(String(categories[7].values[i])).toLocaleDateString() : "Aucune"}</li>
                <li><span class="popup_list_field">Date dernière commande : </span>${categories[8].values[i] ? new Date(String(categories[8].values[i])).toLocaleDateString() : "Aucune"}</li>
                <li><span class="popup_list_field">Nombre de devis (6MG) : </span>${options.dataViews[0].categorical.values[0]?.values[i] || '0'}</li>
                <li><span class="popup_list_field">Gammes de lead : </span>
                <ul>
                  <li><span class="">${(categories[9] && categories[10].values[i] ==='Oui') ? categories[9].source.displayName : ''}</span></li>
                  <li><span class="">${(categories[10] && categories[10].values[i] ==='Oui') ? categories[10].source.displayName : ''}</span></li>
                  <li><span class="">${(categories[11] && categories[11].values[i] ==='Oui') ? categories[11].source.displayName : ''}</span></li>
                  <li><span class="">${(categories[12] && categories[12].values[i] ==='Oui') ? categories[12].source.displayName : ''}</span></li>
                  <li><span class="">${(categories[13] && categories[13].values[i] ==='Oui') ? categories[13].source.displayName : ''}</span></li>
                  <li><span class="">${(categories[14] && categories[14].values[i] ==='Oui') ? categories[14].source.displayName : ''}</span></li>
                  <li><span class="">${(categories[15] && categories[15].values[i] ==='Oui') ? categories[15].source.displayName : ''}</span></li>
                </ul>
                </li>
                </ul>
                `
        if (categories[6].values[i] === 'Oui') {
          this.completeLayer.addLayer(L.marker([+categories[1].values[i], +categories[0].values[i]], { icon: this.leadIcon }).bindPopup(popup))
          this.completeLayer.addLayer(L.circle([+categories[1].values[i], +categories[0].values[i]], { radius: +categories[3].values[i] * 1000, color: "#982E40", weight: 1 }))
        }
        if (categories[4].values[i] === 'Oui') {
          this.completeLayer.addLayer(L.marker([+categories[1].values[i], +categories[0].values[i]], { icon: this.prospectIcon }).bindPopup(popup))
        }
        if (categories[6].values[i] === 'Non' && categories[4].values[i] === 'Non') {
          this.completeLayer.addLayer(L.marker([+categories[1].values[i], +categories[0].values[i]], { icon: this.clientIcon }).bindPopup(popup))
        }
        
        /*
        document.querySelector(`#id_${categories[16].values[i]}`).addEventListener('click', () => {
          this.host.launchUrl(`https://10.90.40.45:8443/CochiseWeb/dm1/gererClient/gererClient.do?cmd=consulterClient&id=${categories[16].values[i]}`);
        })
        */
      }
    )
    this.map.addLayer(this.completeLayer);
    //this.map.addLayer(this.leadLayer);
    //this.map.addLayer(this.prospectLayer);
    //this.map.addLayer(this.clientLayer);
  }

  public destroy() {
    this.map.remove();
  }
}
