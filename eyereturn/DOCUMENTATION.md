# Eyereturn
## General Compatibility
|Feature|  |
|---|---|
| Consent | no |
| Native Ad Support |  |
| SafeFrame Support |  |
| PMP Support | |
 
## Browser Compatibility
| Browser |  |
|--- |---|
| Chrome | yes |
| Edge |  |
| Firefox | yes |
| Internet Explorer 9 |  |
| Internet Explorer 10 |  |
| Internet Explorer 11 |  |
| Safari | yes |
| Mobile Chrome | |
| Mobile Safari | |
| UC Browser | |
| Samsung Internet | |
| Opera | |
 
## Adapter Information
| Info | |
|---|---|
| Partner Id | EyereturnHtb |
| Ad Server Responds in (Cents, Dollars, etc) | Dollars |
| Bid Type (Gross / Net) | |
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