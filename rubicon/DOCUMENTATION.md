# Rubicon
## General Compatibility
|Feature|  |
|---|---|
| Consent |  |
| Native Ad Support |  |
| SafeFrame Support |  |
| PMP Support | |
 
## Browser Compatibility
| Browser |  |
|--- |---|
| Chrome |  |
| Edge |  |
| Firefox |  |
| Internet Explorer 9 |  |
| Internet Explorer 10 |  |
| Internet Explorer 11 |  |
| Safari |  |
| Mobile Chrome | |
| Mobile Safari | |
| UC Browser | |
| Samsung Internet | |
| Opera | |
 
## Adapter Information
| Info | |
|---|---|
| Partner Id | RubiconHtb |
| Ad Server Responds in (Cents, Dollars, etc) | |
| Bid Type (Gross / Net) | |
| GAM Key (Open Market) | |
| GAM Key (Private Market) | |
| Ad Server URLs | |
| Slot Mapping Style (Size / Multiple Sizes / Slot) | |
| Request Architecture (MRA / SRA) | |
 
## Currencies Supported
 
## Bid Request Information
### Parameters
| Key | Required | Type | Description |
|---|---|---|---|
| gdpr | No | object | An object noting whether GDPR applies (`applies` field) and the consent string (`consent` field) |
| us_privacy | No | object | An object noting the USP consent string (`consent` field) |
| | | | |
 
### Example
```json
{ 
  "url": "https://localhost:5838/public/debugger/adapter-debugger.html",
  "referrer": "https://localhost:5838/public/debugger/adapter-debugger.html",
  "gdpr": {
    "applies": true,
    "consent": "TEST_GDPR_CONSENT_STRING"
  },
  "us_privacy": {
    "consent": "TEST_USP_CONSENT_STRING"
  },
  "bidRequests": [{
      "adUnitId": "10809467961050726",
      "requestId": "_hK5vIC5I"
  }]
}
```
 
## Bid Response Information
### Bid Example
```javascript
 
```
### Pass Example
```javascript
 
```
 
## Configuration Information
### Configuration Keys
| Key | Required | Type | Description |
|---|---|---|---|
| | | | |
### Example
```javascript
 
```
