//? if(FEATURES.GPT_LINE_ITEMS) {
shellInterface.PulsePointHtb = {
    render: SpaceCamp.services.RenderService.renderDfpAd.bind(null, 'PulsePointHtb')
};
shellInterface.PP = {
    render: shellInterface.PulsePointHtb.render
};
//? }
