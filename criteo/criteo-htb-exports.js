//? if(FEATURES.GPT_LINE_ITEMS) {
shellInterface.CriteoHtb = {
    render: SpaceCamp.services.RenderService.renderDfpAd.bind(null, 'CriteoHtb')
};
shellInterface.CriteoModule = {
    render: shellInterface.CriteoHtb.render
};

//? }
