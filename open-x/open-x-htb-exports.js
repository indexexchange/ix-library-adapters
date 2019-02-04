shellInterface.OpenXHtb = {
    adResponseCallbacks: {},
    version: '2.1.2'
};

//? if(FEATURES.GPT_LINE_ITEMS) {
shellInterface.OpenXHtb.render = SpaceCamp.services.RenderService.renderDfpAd.bind(null, 'OpenXHtb');

/* Backwards-compatible alternate function name */
shellInterface.OpenXModule = {
    render: shellInterface.OpenXHtb.render
};
//? }

if (__directInterface.Layers.PartnersLayer.Partners.OpenXHtb) {
    shellInterface.OpenXHtb = shellInterface.OpenXHtb || {};
    shellInterface.OpenXHtb.adResponseCallbacks = __directInterface.Layers.PartnersLayer.Partners.OpenXHtb.adResponseCallbacks;
    shellInterface.OpenXHtb.version = __directInterface.Layers.PartnersLayer.Partners.OpenXHtb.version;
}
