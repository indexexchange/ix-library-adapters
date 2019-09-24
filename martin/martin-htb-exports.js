//? if (FEATURES.GPT_LINE_ITEMS) {
shellInterface.MartinHtb = {
    render: SpaceCamp.services.RenderService.renderDfpAd.bind(null, 'MartinHtb')
};
//? }

if (__directInterface.Layers.PartnersLayer.Partners.MartinHtb) {
    shellInterface.MartinHtb = shellInterface.MartinHtb || {};
    shellInterface.MartinHtb.adResponseCallbacks = __directInterface.Layers.PartnersLayer.Partners.MartinHtb.adResponseCallbacks;
}
