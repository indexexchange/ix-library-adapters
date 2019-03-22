//? if(FEATURES.GPT_LINE_ITEMS) {
shellInterface.UWGHtb = {
    render: SpaceCamp.services.RenderService.renderDfpAd.bind(null, 'UWGHtb')
};

/* Existing creatives use window.pbjs.renderApnxAd */
window.pbjs = window.pbjs || {};
window.pbjs.renderApnxAd = SpaceCamp.services.RenderService.renderDfpAd.bind(null, 'UWGHtb');
//? }

if (__directInterface.Layers.PartnersLayer.Partners.UWGHtb) {
    shellInterface.UWGHtb = shellInterface.UWGHtb || {};
    shellInterface.UWGHtb.adResponseCallback = __directInterface.Layers.PartnersLayer.Partners.UWGHtb.adResponseCallback;
}