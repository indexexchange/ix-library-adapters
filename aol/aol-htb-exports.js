//? if(FEATURES.GPT_LINE_ITEMS) {
shellInterface.AolHtb = {
    render: SpaceCamp.services.RenderService.renderDfpAd.bind(null, 'AolHtb')
};
shellInterface.AolModule = {
    render: SpaceCamp.services.RenderService.renderDfpAd.bind(null, 'AolHtb')
};
//? }

if (__directInterface.Layers.PartnersLayer.Partners.AolHtb) {
    shellInterface.AolHtb = shellInterface.AolHtb || {};
    shellInterface.AolHtb.adResponseCallbacks = __directInterface.Layers.PartnersLayer.Partners.AolHtb.adResponseCallbacks;
}
