# Eyereturn
## General Compatibility
|Feature|  |
|---|---|
| Consent | no |
| Native Ad Support | no |
| SafeFrame Support | no |
| PMP Support | yes |
 
## Browser Compatibility
| Browser |  |
|--- |---|
| Chrome | yes |
| Edge |  |
| Firefox | yes |
| Internet Explorer 9 |  |
| Internet Explorer 10 |  |
| Internet Explorer 11 | yes |
| Safari | yes |
| Mobile Chrome | yes |
| Mobile Safari | yes |
| UC Browser | |
| Samsung Internet | |
| Opera | |
 
## Adapter Information
| Info | |
|---|---|
| Partner Id | EyereturnHtb |
| Ad Server Responds in (Cents, Dollars, etc) | Dollars |
| Bid Type (Gross / Net) | Net |
| GAM Key (Open Market) | |
| GAM Key (Private Market) | |
| Ad Server URLs | https://prometheus-ix.eyereturn.com/prometheus/bid, https://p3.eyereturn.com/|
| Slot Mapping Style (Size / Multiple Sizes / Slot) | Slot |
| Request Architecture (MRA / SRA) | MRA |
 
## Currencies Supported
 
## Bid Request Information
### Parameters
| Key | Required | Type | Description |
|---|---|---|---|
| ad_slot | yes | object | container for ad slot properties |
| ad_slot.width | yes | int | width of ad slot |
| ad_slot.height | yes | int | height of ad slot |
| request_id | yes | string | unique id for the request |
| site | yes | object | container for site properties |
| site.url | yes | string | the url of the page the ad will be served on |
| site.referrer | yes |  string | the referrer for the page the ad will be served on |
 
### Example
```javascript
Request URL: https://prometheus-ix.eyereturn.com/prometheus/bid
Request Method: POST
Request Payload: {"ad_slot":[{"width":300,"height":250}],"request_id":"_BOOepaBY","site":{"url":"http://localhost:5837/public/debugger/adapter-debugger.html","referrer":"http://localhost:5837/public/debugger/adapter-debugger.html"}}
```
 
## Bid Response Information
### Bid Example
```javascript
{  
   "request_id":"_BOOepaBY",
   "seat_bid":[  
      {  
         "impression_id":"143cfde9-9440-11e9-9db8-e9ebbc124bb0",
         "bid_price":2,
         "width":300,
         "height":250,
         "ad_domain":[  
            "www.eyereturn.com"
         ],
         "creative":"\u003cscript type=\"text/javascript\" src=\"https://p3.eyereturn.com/ed/21/?7560718\u0026cid=338557\u0026tid=7560718\u0026oid=_BOOepaBY\u0026iid=143cfde9-9440-11e9-9db8-e9ebbc124bb0\u0026p=2000000\u0026bd2=FDz96pRAEemduOnrvBJLsDLd20dGGU1nx7EuGQ\u0026rnd=4201654098330007225\u0026ex=ChAKC251bV9kZXZpY2VzEgEx\"\u003e\u003c/script\u003e"
      }
   ],
   "deal":""
}
 
```
### Pass Example
```javascript
{
    "request_id": "FA2F43C00DD40E23",
    "seat_bid": [],
    "deal": ""
} 
```
 
## Configuration Information
### Configuration Keys
| Key | Required | Type | Description |
|---|---|---|---|
| | | | |
### Example
```javascript
 
```
