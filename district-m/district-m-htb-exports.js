//? if(FEATURES.GPT_LINE_ITEMS) {
shellInterface.DistrictMHtb = {
    render: SpaceCamp.services.RenderService.renderDfpAd.bind(null, 'DistrictMHtb')
}

/* Existing creatives use window.pbjs.renderDismAd */
window.pbjs = window.pbjs || {};
window.pbjs.renderDismAd = SpaceCamp.services.RenderService.renderDfpAd.bind(null, 'DistrictMHtb');
//? }

if (__directInterface.Layers.PartnersLayer.Partners.DistrictMHtb) {
    shellInterface.DistrictMHtb = shellInterface.DistrictMHtb || {};
    shellInterface.DistrictMHtb.adResponseCallback = __directInterface.Layers.PartnersLayer.Partners.DistrictMHtb.adResponseCallback;
}
