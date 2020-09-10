# conversant
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
| Internet Explorer 9 |  |
| Internet Explorer 10 | Yes |
| Internet Explorer 11 | Yes |
| Safari | Yes |
| Mobile Chrome | Yes |
| Mobile Safari | Yes |
| UC Browser | |
| Samsung Internet | Yes |
| Opera | Yes |
 
## Adapter Information
| Info | |
|---|---|
| Partner Id | ConversantHtb |
| Ad Server Responds in (Cents, Dollars, etc) | Dollars |
| Bid Type (Gross / Net) | Net |
| GAM Key (Open Market) | ix_conv_cpm |
| GAM Key (Private Market) | ix_conv_cpm |
| Ad Server URLs | web.hb.ad.cpe.dotomi.com |
| Slot Mapping Style (Size / Multiple Sizes / Slot) | Slot |
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
 
```
### Pass Example
```javascript
 
```
 
## Configuration Information
### Configuration Keys
| Key | Required | Type | Description |
|---|---|---|---|
| siteId | Yes | String | Conversant site id |
| sizes | Yes | Array of 2 element arrays | List of ad sizes |
| placementId | No | String | placement id |
| bidfloor | No | Number | Optional bid floor |
| position | No | Number | Ad position on screen |
### Example
```javascript
 
```

## Test Configuration
(Test configuration or methodology that can be used to retrieve & render a test creative from conversant's platform)
```javascript
 
```
