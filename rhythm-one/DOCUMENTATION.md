# RhythmOne
## General Compatibility
|Feature|  |
|---|---|
| Consent | Y |
| Native Ad Support | N |
| SafeFrame Support | N |
| PMP Support | N |
 
## Browser Compatibility
| Browser |  |
|--- |---|
| Chrome | Y |
| Edge | Y |
| Firefox | Y |
| Internet Explorer 9 | Y |
| Internet Explorer 10 | Y |
| Internet Explorer 11 | Y |
| Safari | Y |
| Mobile Chrome | Y |
| Mobile Safari | Y |
| UC Browser | Y |
| Samsung Internet | Won't Test |
| Opera | Y |
 
## Adapter Information
| Info | |
|---|---|
| Partner Id | RhythmOneHtb |
| Ad Server Responds in (Cents, Dollars, etc) | Dollars |
| Bid Type (Gross / Net) | Net|
| GAM Key (Open Market) | ix_rone_cpm |
| GAM Key (Private Market) | ix_rone_cpm |
| Ad Server URLs | http(s)://tag.1rx.io/rmp/{placementId}/0/mvo?z=1r|
| Slot Mapping Sytle (Size / Multiple Sizes / Slot) | Multiple Sizes |
| Request Architecture (MRA / SRA) | SRA |
 
## Currencies Supported
USD

## Bid Request Information
### Parameters
| Key | Required | Type | Description |
|---|---|---|---|
| placementId | Yes | String |
| w | Yes | Number | width of the slot
| h | Yes | Number | height of the slot
| imp | Optional | String | slot id
| zone | Optional | String | Defaults to '1r' if not provided
| path | Optional | String | Defaults to 'mvo' if not provided
| adtype | Optional | String | Possible values - Video or Banner, defaults to banner

### Example
```javascript
http://tag.1rx.io/rmp/{placementId}/0/mvo?z=1r&gdpr=true&gdpr_consent=BOXhxMMOXhxMMABABAENB5-AAAAid7_______9______9uz_Gv_v_f__33e8__9v_l_7_-___u_-33d4-_1vf99yfm1-7ftr3tp_87ues2_Xur_959__3z3_EA&domain=localhost&url=http%3A%2F%2Flocalhost%3A5837%2Fpublic%2Fdebugger%2Fadapter-debugger.html&title=Adapter%20Debugger&dsh=1080&dsw=1920&tz=-330&dtype=2&flash=0&imp=lnav4HzH&w=300&h=250&floor=100&t=d&ht=indexExchange
```
 
## Bid Response Information
### Bid Example
```javascript
 {
  "id" : "ffffffff-ffc7-72d3-47a1-0167350072d3",
  "seatbid" : [ {
    "bid" : [ {
      "id" : "ffffffff-ffc7-72d3-47a1-0167350072d3",
      "impid" : "lnav4HzH",
      "price" : 100.01000000,
      "adm" : "<div>Ad Creative Content<div>",
      "adomain" : [ "amazon.com" ],
      "cid" : "470040",
      "crid" : "cr-1104-j2d83qqn",
      "h" : 250,
      "w" : 300
    } ],
    "seat" : "470013"
  } ],
  "bidid" : "ffffffff-ffc7-72d3-47a1-0167350072d3"
}
```

### Pass Example
```javascript
Returns HTTP status code - 204 No Content
```

## Configuration Information
### Configuration Keys
| Key | Required | Type | Description |
|---|---|---|---|
| placementId| Yes | String| ad placement identifier|
| zone| Optional | String| |
| path| Optional | String| |
| floor| Optional | String| in dollar |
| adType| Optional | String| video/banner|
| sizes| Yes | Array| an array of array representation of the size of the ad unit, like [width, height] ||
### Example
```javascript
 {
  "placementId": "471141",
  "zone": "1r",
  "path": "mvo",
  "floor": "100",
  "adType": "video",
  "sizes": [[300, 450]]
}
```
