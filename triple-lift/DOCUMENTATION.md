# TripleLift
## General Compatibility
|Feature|  |
|---|---|
| Consent | yes |
| Native Ad Support | No |
| SafeFrame Support | No |
| PMP Support | yes |
 
## Browser Compatibility
| Browser |  |
|--- |---|
| Chrome | yes |
| Edge | yes |
| Firefox | yes |
| Internet Explorer 9 | yes |
| Internet Explorer 10 | yes |
| Internet Explorer 11 | yes |
| Safari | yes |
| Mobile Chrome | yes |
| Mobile Safari | yes |
| UC Browser | yes |
| Samsung Internet | yes |
| Opera | yes |
 
## Adapter Information
| Info | |
|---|---|
| Partner Id | TripleLiftHtb |
| Ad Server Responds in (Cents, Dollars, etc) | cents |
| Bid Type (Gross / Net) | net |
| GAM Key (Open Market) | ix_tpl_cpm |
| GAM Key (Private Market) | ix_tpl_cpm |
| Ad Server URLs | https://tlx.3lift.com/header/auction |
| Slot Mapping Style (Size / Multiple Sizes / Slot) | slot |
| Request Architecture (MRA / SRA) | MRA |
 
## Currencies Supported
 
## Bid Request Information
### Parameters
| Key | Required | Type | Description |
|---|---|---|---|
| inv_code | true | string | supply inventory code |
| lib | true | string | supply source ("ix") |
| size | true | string | supply dimensions (e.g. "300x250") |
| referrer | true | string | document referrer URL |
| v | true | number | adapter version number |
 
### Example
```
HTTP GET https://tlx.3lift.com/header/auction?inv_code=DailyBeast_ROS_Desktop_728x90&lib=ix&fe=0&size=728x90&referrer=https%3A%2F%2Fwww.thedailybeast.com%2Fukrainian-plane-crash-in-iran-raises-issue-of-flaw-in-another-boeing-737-model%3Fref%3Dwrap&v=2.1
```
 
## Bid Response Information
### Bid Example
```javascript
{
    "ad": "[HTML AD MARKUP]",
    "cpm": 3.651,
    "crid": "3335_18160_T4915441",
    "height": 250,
    "imp_id": "1",
    "tl_source": "tlx",
    "width": 300
}
```
### Pass Example
```javascript
 {"status":"no_bid"}
```
 
## Configuration Information
### Configuration Keys
| Key | Required | Type | Description |
|---|---|---|---|
| inventoryCode | yes | string | placement identifier |
| sizes | yes | array | ad slot dimensions |
### Example
```javascript
{
    "inventoryCode": "DailyBeast_ROS_Desktop_300x250",
    "sizes": [[300, 250]]
}
```
