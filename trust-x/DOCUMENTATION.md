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
| Ad Server URLs | http(s)://sofia.trustx.org/hb |
| Slot Mapping Sytle (Size / Multiple Sizes / Slot) | Slot |
| Request Architecture (MRA / SRA) | SRA |
 
## Bid Request Information
### Parameters
| Key | Required | Type | Description |
|---|---|---|---|
| auids | Yes | string | Comma separated adslot IDs  |
| u | No | string | Site page adslots are on |
| pt | No | string | Represents the price type |
| cb | No | string | JavaScript function to wrap response with, if empty or absent pure JSON will be returned |
| wtimeout | No | number | Represents wrapper timeout value in milliseconds. Is obtained via wrapper API on page and wrapper load |
| gdpr_consent | No | string | Shows whether GDPR regulations should apply to the user or not |
| gdpr_applies | No | string | Shows whether the user has given its consent based on IAB consent policy |
 
### Example
```javascript
 https://sofia.trustx.org/hb?auids=44%2C9045&u=http%3A%2F%2Flocalhost%3A5837%2Fpublic%2Fdebugger%2Fadapter-debugger.html&cb=window.headertag.TrustXHtb.adResponseCallbacks._0RXiEn86&gdpr_consent=TEST_GDPR_CONSENT_STRING&gdpr_applies=1&wtimeout=5000
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
| auid | Yes | string | The publisher's ad unit ID in YocHtb adapter |
### Example
```javascript
 {
     "adSlotId": "45"
 }
```
