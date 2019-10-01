# Invibes
## General Compatibility
|Feature|  |
|---|---|
| Consent | Yes |
| Native Ad Support | No |
| SafeFrame Support | No |
| PMP Support | No |
 
## Browser Compatibility
| Browser |  |
|--- |---|
| Chrome | Yes |
| Edge | Yes |
| Firefox | Yes |
| Internet Explorer 9 | No |
| Internet Explorer 10 | Yes |
| Internet Explorer 11 | Yes |
| Safari | Yes |
| Mobile Chrome | Yes |
| Mobile Safari | Yes |
| UC Browser | No |
| Samsung Internet | Yes |
| Opera | Yes |
 
## Adapter Information
| Info | |
|---|---|
| Partner Id | InvibesHtb |
| Ad Server Responds in (Cents, Dollars, etc) | Euros |
| Bid Type (Gross / Net) | Gross |
| GAM Key (Open Market) | ix_ivbs_cpm |
| GAM Key (Private Market) | ix_ivbs_cpm |
| Ad Server URLs | //bid.videostep.com/bid/videoadcontent |
| Slot Mapping Sytle (Size / Multiple Sizes / Slot) | Slot |
| Request Architecture (MRA / SRA) | FSRA |
 
## Currencies Supported
EUR
 
## Bid Request Information
### Parameters
| Key | Required | Type | Description |
|---|---|---|---|
|placementIds | YES | Array |The ad placement name |
 
### Example
```javascript
 {"method":"GET","url":"http://localhost/KWEB.Website/bid/videoadcontent","data":{"location":"http://localhost:5837/public/debugger/adapter-debugger.html","videoAdHtmlId":1,"showFallback":false,"ivbsCampIdsLocal":"15","bidParamsJson":"{\"placementIds\":[\"div-gpt-ad-1438287399331-0\"],\"auctionStartTime\":1569917804510,\"bidVersion\":3}","capCounts":"","vId":"5wvbiacr","width":2133,"height":1041,"noc":false,"oi":"2","kw":"Ad,Displayer"},"bidRequests":[{"partnerId":"InvibesHtb","partnerStatsId":"IVBS","htSlot":{},"ref":{},"xSlotRef":{"placementIds":["div-gpt-ad-1438287399331-0"]},"xSlotName":"vtxPSwZ1","requestId":"_H6JGiSdA","identityData":{"AdserverOrgIp":{"data":{"source":"adserver.org","uids":[{"id":"TEST_ADSRVR_ORG_STRING",}]}}}}],"contentType":"application/json"}
```
 
## Bid Response Information
### Bid Example
```javascript
 {"videoAdContentResult":{"Ads":[{"VideoExposedId":"7d50e20c-080c-47bc-909c-86d5452370b3","HtmlString":"<div id=\"divMosaic+[HtmlId]\" style=\"max-width:480px;min-width:400px;margin:0 auto;;\" class=\"ivbsGeneral\" [attrs]>\n<link href='https://fonts.googleapis.com/css?family=Open+Sans|Source+Sans+Pro|Oswald|Lato|Roboto:400,100,300,500|Lora:400,400italic|Raleway|' rel='stylesheet' type='text/css'>\n<style>\n.ivThumbContainer{\n  overflow: unset;\n}\n.ivSticky {\n    height: 148px;\n}\n.ivStickyLeft{\n  z-index: 999999;\n    width: 50%;\n    height: 100%;\n    margin: 0;\n    background: url(//demo.invibes.com/qa/images/blue.jpg) -1px center no-repeat #fff;\n    float:left;\n}\n .ivStickyActive #mainImage{\n   z-index: 9999999;\n} \n.ivThumbContainer #ivStickyLeft{\n  background: none!important;\n} \n.ivRightImage{\n    height: 123px;\n    background: url(//demo.invibes.com/qa/images/blue.jpg) center center no-repeat;\n    background-size: cover;\n    position: absolute;\n    width: 52%;\n    right: 0;\n    bottom: 0;\n}\n#mainImage{\n  height: 100%;\n  background: #000;\n  background-size:cover;\n  position: absolute;\n  width: 49%;\n  background: url(//demo.invibes.com/qa/images/blue.jpg) -1px center no-repeat #fff;\n  background-size: cover;\n  transition: opacity 1s ease-in;\n  border-right: 5px solid #fff;\n  \n}\n  .ivPlay.ivFlashyMaxi {\n    position:absolute;\n    margin: 0;\n    left: 0;\n    top: 0;\n    width: 100%;\n    height: 275px;\n    border: 0;\n  }\n  .ivPlay {\n    width: 51.3%;\n    height: 101%;\n    margin-left: 48.4%;\n    border-left: 3px solid #fff;\n  }\n</style>\n\n<div class=\"ivThumbContainer\" id=\"ivThumbContainer\">\n    <div class=\"ivbsThumbWrapper\" style=\"cursor:pointer; position: relative; height: 276px;\">\n      <a outgoing-href=\"https://www.invibes.com/fr/fr/l\" class=\"ivbsAnchor\" rel=\"nofollow\" target=\"_blank\" style=\"text-decoration: none !important;\">\n       <div class=\"ivRightImage\" id=\"ivRightImage\"></div>\n       <div class=\"mainImage\" id=\"mainImage\"></div>\n       </a>\n       <div class=\"ivStickyWrapper\">\n    <div class=\"ivSticky\">\n      <a outgoing-href=\"https://www.invibes.com/fr/fr/l\" class=\"ivbsAnchor\" rel=\"nofollow\" target=\"_blank\" style=\"text-decoration: none !important;\">\n      <div class=\"ivStickyLeft\" id=\"ivStickyLeft\" ></div>\n         <div class=\"ivPlay\">\n           <div onclick=\"clickSticky()\" id=\"ivbsToggleSound\"></div>\n          <video id=\"ivbsVid\" playsinline src=\"//video.r66net.com/Audi/audi360p.mp4\" muted style=\"width: 100%;height:100%\">\n          </video>\n          <div class=\"ivStickyClose\"></div>\n        </div>\n        </a>\n      </div>\n      </div>      \n     <script>\n          new invibes.Play({\n            video: document.getElementById('ivbsVid'),\n            id: 'mainVideoId',\n            //playOnView: true,\n            toggleMuteBtn: document.getElementById('ivbsToggleSound')\n          });\n        </script>\n    </div>\n    <a outgoing-href=\"https://www.invibes.com/fr/fr/l\" class=\"ivbsAnchor\" rel=\"nofollow\" target=\"_blank\" style=\"text-decoration: none !important;\">\n    <div class=\"ivbsDescription\" style=\"padding: 10px; background: #fff;position: relative;\">\n      <p style=\"font-family: sans-serif;font-weight: 600;font-size: 20px;line-height: 24px;color:#333;text-align:left;text-transform: none;overflow:hidden;padding: 0;margin: 0 0 2px;cursor: text;box-sizing: content-box;\">xxxx </p>\n      <span class=\"moreBtn\" style=\"position: absolute;bottom: 10px;right: 10px;color: #fff;border-radius: 3px;font-family: 'Open Sans',sans-serif;font-size: 14px;font-weight: 600;display: block;overflow: hidden;cursor: pointer;background: rgba(0, 0, 0, 0.75);padding: 11px 16px;line-height: 14px;\">Voir +  </span>\n      <p style=\"font-family: 'Roboto', sans-serif;font-weight: 300;font-size: 14px;line-height: 18px;color:#333;text-align:left;text-transform: none;overflow:hidden;padding: 0;margin: 0;cursor: text;box-sizing: content-box;margin-right: 70px;\">yyyy</p>\n    </div>\n  </a>\n</div>\n</div>\n<script>\n  function clickSticky() {\n    var element = document.getElementById(\"mainImage\");\n    element.classList.toggle(\"zindex\");\n    \n     var element = document.getElementById(\"ivStickyLeft\");\n    element.classList.toggle(\"hidden\");\n    \n    var element = document.getElementById(\"ivRightImage\");\n    element.classList.toggle(\"zindex\");\n}\n</script>\n<script>\n var stickyTarget = invibes.adDiv.querySelector('.ivStickyWrapper');\n    var stickyClose = invibes.adDiv.querySelector('.ivStickyClose');\n    stickyTarget.addEventListener('click', function(){\n      stickyClose.click();\n    });\n    var sticky = new invibes.Sticky({\n      el: invibes.adDiv.querySelector('.ivSticky'),\n      topMargin: 5,\n\t    bottomMargin: 5,\n      closeBtn: invibes.adDiv.querySelector('.ivStickyClose'),\n      closeDelay: 4000,\n      noStickyOnZoom: 0, //default 0\n      endStickyPromise: invibes.videoCompletion({\n        el: 'ivbsVid',\n        //time: 5\n        percent: 100\n      })\n    });\n    sticky.start();\n</script>\n","IsTrafficCampaign":true,"Token":"hV20gKImg-2yaEcNNX6Lil8VCcYDOSou2BQXr9EDh9VE7QrsEwVNiIE8jPtSt2uWrNWZiWJGKSGQcfykW4kcVg%3d%3d","TrackingScript":"(function() {\r\n var url = \"google.ro?provider=1\".\r\n replace(\"[timestamp]\", Math.ceil(Math.random() * 1e9) );\r\nvar elem = document.createElement(\"img\");\r\nelem.setAttribute(\"src\", url);\r\nelem.setAttribute(\"height\", \"1\");\r\nelem.setAttribute(\"width\", \"1\");\r\nelem.setAttribute(\"style\", \"position:absolute;\");\r\nwindow.document.body.appendChild(elem);\r\n})();\r\n\r\n(function() {\r\n var url = \"google.ro?provider=3\".\r\n replace(\"[timestamp]\", Math.ceil(Math.random() * 1e9) );\r\nvar elem = document.createElement(\"img\");\r\nelem.setAttribute(\"src\", url);\r\nelem.setAttribute(\"height\", \"1\");\r\nelem.setAttribute(\"width\", \"1\");\r\nelem.setAttribute(\"style\", \"position:absolute;\");\r\nwindow.document.body.appendChild(elem);\r\n})();","OverlayType":"V8_inbound_maximized","GA":"&utm_campaign=15&utm_medium=Desktop&utm_source=1","InvoiceOnBoxOpen":false,"BidPrice":0,"MinPercentageForAdview":1,"VisiElementId":null,"IABVisiAppliesToEntireAd":false,"ElementIABDuration":9,"ElementIABPercent":99,"InfeedIABDuration":1,"InfeedIABPercent":50,"PlayVOnIabSettings":true,"SendQ0AsStartEvt":true,"MinVideoVisiPercentToPlay":50,"PlayForeverAfterView":true,"VisiPercent":null,"VisiDuration":null,"ViewCapping":{"C":15,"T":1},"ClickDelay":999,"PlayVAfterC":true,"SendAdViewOnResponse":false,"VideoCompletionTime":0.04,"HasInspiredBy":false,"Sticky":null,"EwebToken":"YBdQ1Jz8c7hzPr78ujcOimEyS3KS3OahHGFKc4aUqLs%3d","UData":null,"DmpScript":null,"CotargetingScript":null,"BvOptVotes":null,"COptions":0,"CampaignGeoTag":null,"CustomInfo":null,"HasPopupHtml":false,"ResourceHintsList":null}],"AdReason":null,"Log":"\r\n  *** Searching for campaign scenarios. Total available: 3\r\n     (s:11) is not in target period|\r\n     (s:16) is not in target period|\r\n     (s:18) is not in target period|\r\n\r\n  Selected a total of 0 scenarios to run\r\n","PageId":-5,"PublisherUrlId":30,"BlockingScript":" if(\"101\"==\"\" || \"172\"==\"\") {\r\nif(100 * Math.random() <= 7) {\r\n(function(i,s,o,g,r,a,m){i[\"GoogleAnalyticsObject\"]=r;i[r]=i[r]||function(){ (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o), m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m) })(window,document,\"script\",\"https://www.google-analytics.com/analytics.js\",\"ivga\");\r\n\r\nivga(\"create\", \"UA-23945050-17\", \"auto\");\r\nivga(\"set\", \"campaignName\", \"\");\r\nivga(\"set\", \"campaignSource\", \"ivbs\");\r\nivga(\"set\", \"campaignMedium\", \"Desktop\");\r\nivga(\"set\", \"campaignContent\", \"30\");\r\nivga(\"send\", \"pageview\"); }}","FallbackScript":null,"SecondsToWaitForVideoAdScroll":null,"CmpSettings":{"AutoOI":false,"Reason":"PageUnknownType","ConsentPop":null},"LocalizedAdvertiserTitle":"ADVERTISEMENT","MinPercentageForAdview":null,"StickyCFIDelay":null,"AskGeoInfo":false,"ArticlePageUrl":null,"TeaserFormattingHtml":null,"LanguageCode":"en","Zone":"OTHER","UserDeviceType":1,"BrokerApis":[],"SendAdRequest":true,"BidModel":{"PlacementId":"div-gpt-ad-1438287399331-0","CreativeHtml":"<script id='ivCrHtmlS'> (function() { var i = top.invibes = top.invibes || {}; if (i.creativeHtmlRan) { return; } i.creativeHtmlRan = true;  var d = top.document; var e = d.getElementById('divVideoStepAdTop') || d.getElementById('divVideoStepAdTop2') || d.getElementById('divVideoStepAdBottom'); if (e) e.parentNode.removeChild(e); var s = document.getElementById('ivCrHtmlS'); var d = document.createElement('div'); d.setAttribute('id', 'divVideoStepAdTop'); d.className += 'divVideoStep'; s.parentNode.insertBefore(d, s); var j = window.invibes = window.invibes || { }; j.getlinkUrl = 'http://localhost/KWEB.Website/Scripts/getlinks/getlink.desktop.js'; var t = document.createElement('script'); t.src = 'http://localhost/KWEB.Website/Scripts/getlinks/getlink.desktop.js'; s.parentNode.insertBefore(t, s); }()) </script>","AuctionStartTime":1569920302029,"PreloadScripts":null,"BidVersion":3,"Width":null,"Height":null},"VideoAdDisplayOption":"AlwaysShowForAll","AdPlacements":null,"Scenarios":null}}
```
### Pass Example
```javascript
 {
    placementIds: []
}
```
 
## Configuration Information
### Configuration Keys
| Key | Required | Type | Description |
|---|---|---|---|
| placementIds| Yes| Array | |
### Example
```javascript
 
```