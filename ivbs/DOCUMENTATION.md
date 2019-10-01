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
| Internet Explorer 10 | No |
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
{ 
   "location":"http://localhost:5837/public/debugger/adapter-debugger.html",
   "videoAdHtmlId":1,
   "showFallback":false,
   "ivbsCampIdsLocal":"15",
   "bidParamsJson":"{\"placementIds\":[\"div-gpt-ad-1438287399331-0\"],\"auctionStartTime\":1569930625433,\"bidVersion\":3}",
   "capCounts":"",
   "vId":"2ah6zji8",
   "width":2133,
   "height":1041,
   "noc":false,
   "oi":"2",
   "kw":"Ad,Displayer"
}
```
 
## Bid Response Information
### Bid Example
```javascript
{ 
   "videoAdContentResult":{ 
      "Ads":[ 
         { 
            "VideoExposedId":"7d50e20c-080c-47bc-909c-86d5452370b3",
            "HtmlString":"<div>Ad</div>",
            "IsTrafficCampaign":true,
            "Token":"hV20gKImg-2yaEcNNX6Lil8VCcYDOSou2BQXr9EDh9VE7QrsEwVNiIE8jPtSt2uWrNWZiWJGKSGQcfykW4kcVg%3d%3d",
            "TrackingScript":"<script></script>",
            "OverlayType":"V8_inbound_maximized",
            "GA":"&utm_campaign=15&utm_medium=Desktop&utm_source=1",
            "BidPrice":0,
         }
      ],
      "AdReason":null,
      "Log":"\r\n  *** Searching for campaign scenarios. Total available: 3\r\n     (s:11) is not in target period|\r\n     (s:16) is not in target period|\r\n     (s:18) is not in target period|\r\n\r\n  Selected a total of 0 scenarios to run\r\n",
      "PageId":-5,
      "PublisherUrlId":30,
      "BlockingScript":<script></script>,
      "FallbackScript":null,
      "CmpSettings":{ 
         "AutoOI":false,
         "Reason":"PageUnknownType",
         "ConsentPop":null
      },
      "LocalizedAdvertiserTitle":"ADVERTISEMENT",
      "LanguageCode":"en",
      "Zone":"OTHER",
      "UserDeviceType":1,
      "BrokerApis":[ 

      ],
      "SendAdRequest":true,
      "BidModel":{ 
         "PlacementId":"div-gpt-ad-1438287399331-0",
         "CreativeHtml":"<script id='ivCrHtmlS'> (function() { var i = top.invibes = top.invibes || {}; if (i.creativeHtmlRan) { return; } i.creativeHtmlRan = true;  var d = top.document; var e = d.getElementById('divVideoStepAdTop') || d.getElementById('divVideoStepAdTop2') || d.getElementById('divVideoStepAdBottom'); if (e) e.parentNode.removeChild(e); var s = document.getElementById('ivCrHtmlS'); var d = document.createElement('div'); d.setAttribute('id', 'divVideoStepAdTop'); d.className += 'divVideoStep'; s.parentNode.insertBefore(d, s); var j = window.invibes = window.invibes || { }; j.getlinkUrl = 'http://localhost/KWEB.Website/Scripts/getlinks/getlink.desktop.js'; var t = document.createElement('script'); t.src = 'http://localhost/KWEB.Website/Scripts/getlinks/getlink.desktop.js'; s.parentNode.insertBefore(t, s); }()) </script>",
         "AuctionStartTime":1569920302029,
         "PreloadScripts":null,
         "BidVersion":3,
         "Width":null,
         "Height":null
      },
      "VideoAdDisplayOption":"AlwaysShowForAll",
   }
}
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