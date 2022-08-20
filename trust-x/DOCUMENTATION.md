# TrustX
## General Compatibility
|Feature|  |
|---|---|
| Consent | Yes |
| Native Ad Support | No |
| SafeFrame Support | Yes |
| PMP Support | Yes |
 
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
| UC Browser | Yes |
| Samsung Internet | Yes |
| Opera | Yes |
 
## Adapter Information
| Info | |
|---|---|
| Partner Id | TrustXHtb |
| Ad Server Responds in (Cents, Dollars, etc) | Dollars |
| Bid Type (Gross / Net) | Net |
| GAM Key (Open Market) | ix_trstx_cpm |
| GAM Key (Private Market) | ix_trstx_cpm |
| Ad Server URLs | http(s)://grid.bidswitch.net/hbjson?sp=trustx |
| Slot Mapping Sytle (Size / Multiple Sizes / Slot) | Slot |
| Request Architecture (MRA / SRA) | SRA |

## Currencies Supported
USD

## Bid Request Information
### Parameters
| Key | Required | Type | Description |
|---|---|---|---|
| | | | |

### Example
```javascript

```
 
## Bid Response Information
### Bid Example
```javascript
 {"seatbid":[{"bid":[{"price":0.6,"auid":903536,"h":480,"adomain":["trustx.com"],"adm":"<html><body>Test Ad content</body></html>","w":320,"dealid":11}],"seat":"1"}]}
```
### Pass Example
```javascript
 {}
```
 
## Configuration Information
### Configuration Keys
| Key | Required | Type | Description |
|---|---|---|---|
| adSlotId | Yes | string | The publisher's ad unit ID in TrustX adapter |
| sizes | Yes | Array of 2 element arrays | List of ad sizes |
| bidFloor | No | Number | Floor of the impression opportunity. If present in the request overrides XML info |
| keywords | No | String | Keywords object |
### Example
```javascript
 {
     "adSlotId": "45"
 }
```
