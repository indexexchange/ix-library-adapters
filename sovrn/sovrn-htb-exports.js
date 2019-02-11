//? if(FEATURES.GPT_LINE_ITEMS) {
shellInterface.SovrnHtb = {
    render: SpaceCamp.services.RenderService.renderDfpAd.bind(null, 'SovrnHtb')
}

/* backwards-compatible render function name */
window.sovrn_render = SpaceCamp.services.RenderService.renderDfpAd.bind(null, 'SovrnHtb');
//? }

if (__directInterface.Layers.PartnersLayer.Partners.SovrnHtb) {
    shellInterface.SovrnHtb = shellInterface.SovrnHtb || {};
    shellInterface.SovrnHtb.adResponseCallback = __directInterface.Layers.PartnersLayer.Partners.SovrnHtb.adResponseCallback;
}
