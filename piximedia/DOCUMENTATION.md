# Piximedia
## General Compatibility
|Feature|  |
|---|---|
| Consent | Yes |
| Native Ad Support | No |
| SafeFrame Support | Yes |
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
| UC Browser | Yes |
| Samsung Internet | Yes |
| Opera | Yes |
 
## Adapter Information
| Info | |
|---|---|
| Partner Id | PiximediaHtb |
| Ad Server Responds in (Cents, Dollars, etc) | Euros |
| Bid Type (Gross / Net) | Net |
| GAM Key (Open Market) | ix_pix_cpm |
| GAM Key (Private Market) | ix_pix_cpm |
| Ad Server URLs | //ad.piximedia.com/hbie |
| Slot Mapping Style (Size / Multiple Sizes / Slot) | Slot |
| Request Architecture (MRA / SRA) | SRA |
 
## Currencies Supported
 
## Bid Request Information
### Parameters
| Key | Required | Type | Description |
| id | Yes | string | The ID of the request |
| site | Yes | object | An object representing the site, as in an RTB bid request |
| imp | Yes | object | An object representing the impression, as in an RTB bid request |
| device | Yes | object | An object representing the device, as in an RTB bid request |
| regs | No | object | An object representing the regulatory informations, as in an RTB bid request |
| user | No | object | An object representing the user, as in an RTB bid request |
| | | | |
 
### Example
```javascript
{"id":"zoXlM8P7","site":{"page":"http://localhost:5837/public/tester/system-tester.html","domain":"http://localhost","name":"localhost"},"imp":[{"id":"htSlotDesktopAId","ext":{"piximedia":{"siteId":"PIXIMEDIA","placementId":"INDEX_EXCHANGE","positionId":"mpu"}},"banner":{"w":300,"h":250}},{"id":"htSlotDesktopAId","ext":{"piximedia":{"siteId":"PIXIMEDIA","placementId":"INDEX_EXCHANGE","positionId":"mpu"}},"banner":{"w":300,"h":600}},{"id":"htSlotDesktopAId","ext":{"piximedia":{"siteId":"PIXIMEDIA","placementId":"INDEX_EXCHANGE","positionId":"top"}},"banner":{"w":728,"h":90}}],"device":{"ua":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3823.0 Safari/537.36","language":"en-GB"},"regs":{"ext":{"gdpr":0}},"user":{"ext":{"consent":""}}}
```
 
## Bid Response Information
### Bid Example
```javascript
{"cur":"EUR","id":"mqGdK1Sf","seatbid":[{"bid":[{"impid":"htSlotDesktopAId","price":200,"width":"300","height":"250","crid":"371134","adm":"<div id=\"default-creative\"></div>"},{"impid":"htSlotDesktopAId","price":200,"width":"300","height":"600","crid":"371134","adm":"<div id=\"default-creative\"></div>"}]}]}
```
### Pass Example
An empty content with a 204 HTTP status is returned when no bids is made on a request.
 
## Configuration Information
### Configuration Keys
| Key | Required | Type | Description |
|---|---|---|---|
| siteId | Yes | String | The site ID, assigned by Piximedia. |
| placementId | Yes | String | The placement ID, assigned by Piximedia. |
| positionId | Yes | String | The position ID, assigned by Piximedia. |
| | | | |
### Example
```javascript
{
    "siteId": "PIXIMEDIA",
    "placementId": "INDEX_EXCHANGE",
    "positionId": "top"
}
```
