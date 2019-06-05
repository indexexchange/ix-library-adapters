//? if (FEATURES.GPT_LINE_ITEMS) {
shellInterface.YocHtb = {
    render: SpaceCamp.services.RenderService.renderDfpAd.bind(null, 'YocHtb')
};
//? }

if (__directInterface.Layers.PartnersLayer.Partners.YocHtb) {
    shellInterface.YocHtb = shellInterface.YocHtb || {};
    shellInterface.YocHtb.adResponseCallbacks = __directInterface.Layers.PartnersLayer.Partners.YocHtb.adResponseCallbacks;
}