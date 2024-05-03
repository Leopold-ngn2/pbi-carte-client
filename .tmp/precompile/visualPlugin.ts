import { Visual } from "../../src/visual";
import powerbiVisualsApi from "powerbi-visuals-api";
import IVisualPlugin = powerbiVisualsApi.visuals.plugins.IVisualPlugin;
import VisualConstructorOptions = powerbiVisualsApi.extensibility.visual.VisualConstructorOptions;
import DialogConstructorOptions = powerbiVisualsApi.extensibility.visual.DialogConstructorOptions;
var powerbiKey: any = "powerbi";
var powerbi: any = window[powerbiKey];
var CarteLeadsCA131710DDBF4568AF35D83E9C1B01B1: IVisualPlugin = {
    name: 'CarteLeadsCA131710DDBF4568AF35D83E9C1B01B1',
    displayName: 'Carte des leads',
    class: 'Visual',
    apiVersion: '5.1.0',
    create: (options: VisualConstructorOptions) => {
        if (Visual) {
            return new Visual(options);
        }
        throw 'Visual instance not found';
    },
    createModalDialog: (dialogId: string, options: DialogConstructorOptions, initialState: object) => {
        const dialogRegistry = globalThis.dialogRegistry;
        if (dialogId in dialogRegistry) {
            new dialogRegistry[dialogId](options, initialState);
        }
    },
    custom: true
};
if (typeof powerbi !== "undefined") {
    powerbi.visuals = powerbi.visuals || {};
    powerbi.visuals.plugins = powerbi.visuals.plugins || {};
    powerbi.visuals.plugins["CarteLeadsCA131710DDBF4568AF35D83E9C1B01B1"] = CarteLeadsCA131710DDBF4568AF35D83E9C1B01B1;
}
export default CarteLeadsCA131710DDBF4568AF35D83E9C1B01B1;