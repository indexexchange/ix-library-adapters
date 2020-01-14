# AJA
## General Compatibility
|Feature|  |
|---|---|
| Consent | No |
| Native Ad Support | No |
| SafeFrame Support | No |
| PMP Support | No |
 
## Browser Compatibility
| Browser |  |
|--- |---|
| Chrome | Yes |
| Edge | Yes |
| Firefox | Yes |
| Internet Explorer 9 | ? |
| Internet Explorer 10 | Yes |
| Internet Explorer 11 | Yes |
| Safari | Yes |
| Mobile Chrome | Yes |
| Mobile Safari | Yes |
| UC Browser | ? |
| Samsung Internet | ? |
| Opera | Yes |
 
## Adapter Information
| Info | |
|---|---|
| Partner Id | AJAHtb |
| Ad Server Responds in (Cents, Dollars, etc) | Dollars or JPY |
| Bid Type (Gross / Net) | Net |
| GAM Key (Open Market) | ix_aja_cpm |
| GAM Key (Private Market) | ix_aja_cpm |
| Ad Server URLs |  |
| Slot Mapping Style (Size / Multiple Sizes / Slot) | Slot |
| Request Architecture (MRA / SRA) | MRA |
 
## Currencies Supported
 
## Bid Request Information
### Parameters
| Key | Required | Type | Description |
|---|---|---|---|
| asi | Yes | String | AJA ad spot id |
 
### Example
```javascript
http://ad.as.amanad.adtdp.com/v2/ixw?asi=abc123&prebid_id=hoge 
```
 
## Bid Response Information
### Bid Example
```javascript
{
  "is_ad_return": true,
  "ad": {
    "ad_type": 1,
    "banner": {
      "w": 320,
      "h": 100,
      "tag": "<script></script>",
      "imps": [],
      "inviews"":[]
    },
    "prebid_id": "HogeSlot",
    "price": 100,
    "currency": "JPY",
    "creative_id": "10410582"
  },
  "syncs": [],
  "sync_htmls": []
}
```
### Pass Example
```javascript
{
  "is_ad_return": false
} 
```
 
## Configuration Information
### Configuration Keys
| Key | Required | Type | Description |
|---|---|---|---|
| asi | Yes | String | AJA ad spot id |
### Example
```javascript
{
  asi: "abc123"
} 
```
