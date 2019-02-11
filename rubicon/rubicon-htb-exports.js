//? if(FEATURES.GPT_LINE_ITEMS) {
shellInterface.RubiconHtb = {
    render: SpaceCamp.services.RenderService.renderDfpAd.bind(null, 'RubiconHtb')
};

//?     if (FEATURES.RUBICON_LINE_ITEMS) {
window.top.rubicontag = window.top.rubicontag || {};
window.top.rubicontag.renderCreative = SpaceCamp.services.RenderService.renderRubiconAd.bind(null, 'RubiconHtb');
//?     }
//? }
