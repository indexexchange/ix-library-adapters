/**
 *  This file contains any necessary functions that need to be exposed to the outside world.
 *  Things like (render functions) will be exposed by adding them to the shellInterface variable, under the partners
 *  profile name. This function will then be accessible through the window.headertag.AppNexusNetworkHtb object.
 *  If necessary for backwards compatibility with old creatives, you can also add things directly to the
 *  window namespace here, but this is discouraged if it's not strictly needed.
 */

//? if(FEATURES.GPT_LINE_ITEMS) {
  shellInterface.AppNexusNetworkHtb = {
    render: SpaceCamp.services.RenderService.renderDfpAd.bind(null, 'AppNexusNetworkHtb')
};

/* Existing creatives use window.pbjs.renderApnxAd */
window.pbjs = window.pbjs || {};
window.pbjs.renderApnxAd = SpaceCamp.services.RenderService.renderDfpAd.bind(null, 'AppNexusNetworkHtb');
//? }

if (__directInterface.Layers.PartnersLayer.Partners.AppNexusNetworkHtb) {
    shellInterface.AppNexusNetworkHtb = shellInterface.AppNexusNetworkHtb || {};
    shellInterface.AppNexusNetworkHtb.adResponseCallback = __directInterface.Layers.PartnersLayer.Partners.AppNexusNetworkHtb.adResponseCallback;
}
