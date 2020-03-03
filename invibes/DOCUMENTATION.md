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
| Request Architecture (MRA / SRA) | MRA  |
 
## Currencies Supported
EUR
 
## Bid Request Information
### Parameters
| Key | Required | Type | Description |
|---|---|---|---|
|location | YES | string |Page url |
|bidParamsJson | YES | string |Bid request information such as placementIds, bidVersion |
|vId | YES | string |Generated id unique for this page load |
|lid | NO | User Id |
|oi | NO | Consent value |
|kw | NO | Page meta keywords |
 
### Example
HTTP GET https://bid.videoste.com/bid/videoadcontent?location=https%3A%2F%2Fdemo.videostepstage.com%2Fqa%2Fprebid.html&bidParamsJson=%7B%22placementIds%22%3A%5B%22div-gpt-ad-1460505748561-0%22%5D%2C%22auctionStartTime%22%3A1582884520278%2C%22bidVersion%22%3A2%7D&capCounts=&vId=5yh3ot6q&oi=2&kw=Europe1&lId=307zskt8mmss&
 
## Bid Response Information
### Bid Example
```javascript
{ 
   "videoAdContentResult":{ 
      "Ads":[ 
         { 
            "VideoExposedId":"7d50e20c-080c-47bc-909c-86d5452370b3",
            "HtmlString":"<div>Ad</div>",
            "Token":"hV20gKImg-2yaEcNNX6Lil8VCcYDOSou2BQXr9EDh9VE7QrsEwVNiIE8jPtSt2uWrNWZiWJGKSGQcfykW4kcVg%3d%3d",
            "TrackingScript":"<script></script>",
            "OverlayType":"V8_inbound_maximized",
            "GA":"&utm_campaign=15&utm_medium=Desktop&utm_source=1",
            "BidPrice":1,
         }
      ],
      "BlockingScript":<script></script>,
      "Zone":"OTHER",
      "UserDeviceType":1,
      "BidModel":{ 
         "PlacementId":"div-gpt-ad-1438287399331-0",
         "CreativeHtml":"<script id='ivCrHtmlS'> (function() { var i = top.invibes = top.invibes || {}; if (i.creativeHtmlRan) { return; } i.creativeHtmlRan = true;  var d = top.document; var e = d.getElementById('divVideoStepAdTop') || d.getElementById('divVideoStepAdTop2') || d.getElementById('divVideoStepAdBottom'); if (e) e.parentNode.removeChild(e); var s = document.getElementById('ivCrHtmlS'); var d = document.createElement('div'); d.setAttribute('id', 'divVideoStepAdTop'); d.className += 'divVideoStep'; s.parentNode.insertBefore(d, s); var j = window.invibes = window.invibes || { }; j.getlinkUrl = 'http://localhost/KWEB.Website/Scripts/getlinks/getlink.desktop.js'; var t = document.createElement('script'); t.src = 'http://localhost/KWEB.Website/Scripts/getlinks/getlink.desktop.js'; s.parentNode.insertBefore(t, s); }()) </script>",
         "AuctionStartTime":1569920302029,
         "BidVersion":3,
         "Width":null,
         "Height":null
      }
   }
}
```
### Pass Example
```javascript
{ 
   "videoAdContentResult":{ 
      "Ads":[],
      "BlockingScript":<script></script>,
      "BidModel":{ 
         "PlacementId":"div-gpt-ad-1438287399331-0",
         "CreativeHtml":"",
         "AuctionStartTime":1569920302029,
         "BidVersion":3
      }
   }
}
```
 
## Configuration Information
### Configuration Keys
| Key | Required | Type | Description |
|---|---|---|---|
| placementId| Yes| string | Id of the ad placement, that must match with config on Invibes side |
| customEndpoint| No| string | Replaces the default bid request endpoint |
| sizes| No| array | Ad slot dimensions |
### Example
```javascript
{
    "placementId": "div-gpt-ad-1438287399331-0",
	"customEndpoint": "//bid2.videostep.com/bid/videoadcontent"
    "sizes": [[300, 250]]
}
```