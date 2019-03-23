# Nano Interactive
## General Compatibility
|Feature|  |
|---|---|
| Consent | N |
| Native Ad Support | N |
| SafeFrame Support | Y |
| PMP Support | N|
 
## Browser Compatibility
| Browser |  |
|--- |---|
| Chrome | Y |
| Edge | Y |
| Firefox | Y |
| Internet Explorer 9 |  N|
| Internet Explorer 10 | Y |
| Internet Explorer 11 | Y |
| Safari | Y |
| Mobile Chrome | Y|
| Mobile Safari | Y |
| UC Browser | N|
| Samsung Internet |Y |
| Opera |Y |
 
## Adapter Information
| Info | |
|---|---|
| Partner Id | NanoInteractiveHtb |
| Ad Server Responds in (Cents, Dollars, etc) | EUR |
| Bid Type (Gross / Net) | Net|
| GAM Key (Open Market) | ix_nano_cpm |
| GAM Key (Private Market) |ix_nano_cpm |
| Ad Server URLs | ad.audiencemanager.de/hb|
| Slot Mapping Sytle (Size / Multiple Sizes / Slot) | Multiple Sizes|
| Request Architecture (MRA / SRA) | SRA |
 
## Currencies Supported
 EUR
## Bid Request Information
### Parameters
| Key | Required | Type | Description |
|---|---|---|---|
|pid|Yes|String|Placement id|
|nq|No|String|User's search query|
|name|No|String|name of the query param extracted from the url of the search. For example: if your web page url is http://some-domain.dev/?search=some_search the value of the name param will be “search”|
|category|No|String|IAB Category of the web page. Please check category under https://www.iab.com/wp-content/uploads/2016/07/IABTechLab_Content_Taxonomy_2016-07.xls |
|subId|No|String|Sub ID or Label provided by the Publisher, it can be any string value. Most common use is on Reporting, where you can group by subId string value.|
|sizes|Yes|String[]|String array of sizes in 'WidthxHeight' format
|bidId|Yes|String|unique bid identifier|
|ref|No|String| HTTP referrer|
|cors|Yes|String|domain|
|loc|Yes|String|full page url|
 
### Example
```javascript
 //https://www.audiencemanager.de/hb
 
 // post payload
 [
     {
     'pid': '58bfec94eb0a1916fa380163',
     'nq': ['header bidding'],
     'category': ['shopping','holiday shopping'],
     'subId': 'a123bfds',
     'ref': null,
     'sizes': ['728x90'],
     'bidId': '2d8d3cd69d3f47',
     'cors': 'http://localhost:8080',
     'loc': 'http://localhost:8080/pages/prebid/'
    }, {
     'pid': '58bfec94eb0a1916fa380163',
     'nq': ['header bidding'],
     'category': [null],
     'subId': null,
     'ref': null,
     'sizes': ['300x250'],
     'bidId': '3c543d8921752a',
     'cors': 'http://localhost:8080',
     'loc': 'http://localhost:8080/pages/prebid/'
    }
 ]
 
```
 
## Bid Response Information
### Bid Example
```javascript
 [
     {
         'id': '2d8d3cd69d3f47',
         'bidderCode': 'nanointeractive',
         'cpm': 1.35,
         'width': 728,
         'height': 90,
         'ad': '<div style="width:728px"><div class="nanoBanner"><div class="banner-buttons"><label class="adsByNano">AdChoices<\/label><a class="infoLink" href="https:\/\/www.nanointeractive.com\/privacy" target="_blank"><img width="14" height="14" class="icons" src="https:\/\/cdn.audiencemanager.de\/images\/info.svg"\/><\/a><div class="closeBtn" onclick="removeBanner(event)"><img width="14" height="14" class="icons" src="https:\/\/cdn.audiencemanager.de\/images\/close.svg"\/><\/div><\/div><a target="_blank"href="https:\/\/klk.audiencemanager.de\/log\/ad\/click?id=5bd2e94b0ae89946e94ca722&adId=6615ccc6185d77bc038c470e807f9b39&alg=insist-mcam-ron&rp=insist&hb=1&pubid=58bfec94eb0a1916fa380162&pid=58bfec94eb0a1916fa380163&subId=&cb=1548175159&redirectUrl="><img src="https:\/\/cdn.audiencemanager.de\/images\/1a3febb85c37077b0277e0e23cc589da.jpg"height="90"width="728"border="0"><\/a><img src="https:\/\/anz.audiencemanager.de\/log\/ad\/impression?id=5bd2e94b0ae89946e94ca722&adId=6615ccc6185d77bc038c470e807f9b39&alg=insist-mcam-ron&rp=insist&hb=1&hbp=1.3499999642372&pubid=58bfec94eb0a1916fa380162&pid=58bfec94eb0a1916fa380163&subId=&cb=1548178021" style="display:none;"><\/div><style>.icons{height:11px;width:11px;background-color:white;padding:2px;opacity:0.4} .icons:hover{opacity:0.9;} .nanoBanner {position: relative} .banner-buttons{position:absolute;font-size:12px;background-color:transparent;right:0;top:-2px;display:flex;padding:4px 2px 2px 1px;border-radius:4px;height:14px}.adsByNano{display:none;color:#40bfbc}.banner-buttons .closeBtn,.banner-buttons .infoLink{margin-left:3px;color:#40bfbc}.banner-buttons:hover .adsByNano{display:inline-block}.banner-buttons .closeBtn:hover{color:#40bfbc;cursor:pointer}<\/style><script>function removeBanner(n){for(var e=(n=n||window.event).target||n.srcElement;!e.classList.contains("nanoBanner");e=e.parentNode);e.style="visibility:hidden"}<\/script><\/div>',
         'ttl': 360,
         'creativeId': '6615ccc6185d77bc038c470e807f9b39',
         'netRevenue': false,
         'currency': 'EUR'
     }, {
         'id': '3c543d8921752a',
         'bidderCode': 'nanointeractive',
         'cpm': 0.05,
         'width': 300,
         'height': 250,
         'ad': '<div style="width:300px"><div class="nanoBanner"><div class="banner-buttons"><label class="adsByNano">AdChoices<\/label><a class="infoLink" href="https:\/\/www.nanointeractive.com\/privacy" target="_blank"><img width="14" height="14" class="icons" src="https:\/\/cdn.audiencemanager.de\/images\/info.svg"\/><\/a><div class="closeBtn" onclick="removeBanner(event)"><img width="14" height="14" class="icons" src="https:\/\/cdn.audiencemanager.de\/images\/close.svg"\/><\/div><\/div><div style="width:300px;height:250px;overflow: hidden;"><a href="https:\/\/klk.audiencemanager.de\/log\/ad\/click?id=5b9277250ae8990ae110f522&adId=b4be30748bdf9227b032bc71bda8f577&alg=insist-mcam-ron&rp=insist&hb=1&pubid=58bfec94eb0a1916fa380162&pid=58bfec94eb0a1916fa380163&subId=&cb=1548175544&redirectUrl=" target="_blank"><img width=300 height=250 style="border:1px solid red"  src="https:\/\/cdn.audiencemanager.de\/images\/dd507f1e517556effc07907dad348f2c.png?advid=59cb8f26eb0a192a9c505542&cmpid=59cb9191eb0a194849681122" \/><\/a><\/div><img src="https:\/\/anz.audiencemanager.de\/log\/ad\/impression?id=5b9277250ae8990ae110f522&adId=b4be30748bdf9227b032bc71bda8f577&alg=insist-mcam-ron&rp=insist&hb=1&hbp=0.050000000745058&pubid=58bfec94eb0a1916fa380162&pid=58bfec94eb0a1916fa380163&subId=&cb=1548176813" style="display:none;"><\/div><style>.icons{height:11px;width:11px;background-color:white;padding:2px;opacity:0.4} .icons:hover{opacity:0.9;} .nanoBanner {position: relative} .banner-buttons{position:absolute;font-size:12px;background-color:transparent;right:0;top:-2px;display:flex;padding:4px 2px 2px 1px;border-radius:4px;height:14px}.adsByNano{display:none;color:#40bfbc}.banner-buttons .closeBtn,.banner-buttons .infoLink{margin-left:3px;color:#40bfbc}.banner-buttons:hover .adsByNano{display:inline-block}.banner-buttons .closeBtn:hover{color:#40bfbc;cursor:pointer}<\/style><script>function removeBanner(n){for(var e=(n=n||window.event).target||n.srcElement;!e.classList.contains("nanoBanner");e=e.parentNode);e.style="visibility:hidden"}<\/script><\/div>',
         'ttl': 360,
         'creativeId': 'b4be30748bdf9227b032bc71bda8f577',
         'netRevenue': false,
         'currency': 'EUR'
     }
 ]
```
### Pass Example
```javascript
 [
      {
          'id': '2d8d3cd69d3f47',
          'bidderCode': 'nanointeractive',
          'cpm': 0,
          'width': 728,
          'height': 90,
          'ad': null,
          'ttl': 360,
          'creativeId': null,
          'netRevenue': false,
          'currency': 'EUR'
      }, {
          'id': '3c543d8921752a',
          'bidderCode': 'nanointeractive',
          'cpm': 0,
          'width': 300,
          'height': 250,
          'ad': null,
          'ttl': 360,
          'creativeId': null,
          'netRevenue': false,
          'currency': 'EUR'
      }
  ]
```
 
## Configuration Information
### Configuration Keys
 Key | Required | Type | Description |
|---|---|---|---|
|pid|Yes|String|Placement id|
|nq|No|String|User's search query|
|name|No|String|name of the query param extracted from the url of the search. For example: if your web page url is http://some-domain.dev/?search=some_search the value of the name param will be “search”|
|category|No|String|IAB Category of the web page. Please check category under https://www.iab.com/wp-content/uploads/2016/07/IABTechLab_Content_Taxonomy_2016-07.xls |
|subId|No|String|Sub ID or Label provided by the Publisher, it can be any string value. Most common use is on Reporting, where you can group by subId string value.|

### Example
```javascript
 {
   publisherId: "ab3423a",
   {
     pid: "471141",
     sizes: ["300x250"]
   }
 } 
```
