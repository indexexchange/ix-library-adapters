//? if(FEATURES.GPT_LINE_ITEMS) {
shellInterface.AppNexusHtb = {
    render: SpaceCamp.services.RenderService.renderDfpAd.bind(null, 'AppNexusHtb')
};

/* Existing creatives use window.pbjs.renderApnxAd */
window.pbjs = window.pbjs || {};
window.pbjs.renderApnxAd = SpaceCamp.services.RenderService.renderDfpAd.bind(null, 'AppNexusHtb');
//? }

if (__directInterface.Layers.PartnersLayer.Partners.AppNexusHtb) {
    shellInterface.AppNexusHtb = shellInterface.AppNexusHtb || {};
    shellInterface.AppNexusHtb.adResponseCallback = __directInterface.Layers.PartnersLayer.Partners.AppNexusHtb.adResponseCallback;
}
