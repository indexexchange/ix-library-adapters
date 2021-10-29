# The Media Grid
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
| Partner Id | TheMediaGridHtb |
| Ad Server Responds in (Cents, Dollars, etc) | Dollars |
| Bid Type (Gross / Net) | Net |
| GAM Key (Open Market) | ix_grid_cpm |
| GAM Key (Private Market) | ix_grid_cpm |
| Ad Server URLs | http(s)://grid.bidswitch.net/hbjson |
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
| uid | Yes | string | The publisher's ad unit ID in TheMediaGrid adapter |
| sizes | Yes | Array of 2 element arrays | List of ad sizes |
| bidFloor | No | Number | Floor of the impression opportunity. If present in the request overrides XML info |
| keywords | No | String | Keywords object |
| | | | |
### Example
```javascript
 
```

## Test Configuration
(Test configuration or methodology that can be used to retrieve & render a test creative from The Media Grid's platform)
```javascript
 
```
