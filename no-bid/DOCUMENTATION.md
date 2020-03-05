# NoBid
## General Compatibility
|Feature|  |
|---|---|
| Consent | Yes  |
| Native Ad Support | Yes |
| SafeFrame Support | No |
| PMP Support | Yes |
 
## Browser Compatibility
| Browser | Yes |
|--- |---|
| Chrome | Yes |
| Edge | Yes |
| Firefox | Yes |
| Internet Explorer 9 | Yes |
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
| Partner Id | NoBidHtb |
| Ad Server Responds in (Cents, Dollars, etc) | Dollars |
| Bid Type (Gross / Net) | Net |
| GAM Key (Open Market) | ix_nob_om |
| GAM Key (Private Market) | ix_nob_pm |
| Ad Server URLs | ads.servenobid.com/adreq |
| Slot Mapping Style (Size / Multiple Sizes / Slot) | slot |
| Request Architecture (MRA / SRA) | MRA |
 
## Currencies Supported
USD
 
## Bid Request Information
### Parameters
The request is made in Ajax with a POST method
The following fields are the parameters in the posted object.
| Key | Required | Type | Description |
|---|---|---|---|
| sid | Yes | long | Site ID. Contact your NoBid account manager to give you your Site ID. |
| a | Yes | object | Ad sizes requested and their corresponding slot IDs. |
| l | No | string | Full page URL. |
| tt | No | string | Title of the page. |
| t | No | string | User Data/Time. |
| tz | No | int | Time zone. |
| r | No | string | Screen resolution. |
| gdpr | No | object | GDPR info. |
| usp | No | object | CCPA/US privacy info. |
| schain | No | object | Supply chain info. |
| coppa | No | object | COPPA info. |
 
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
| siteId | true | Long | ID value of the NoBid Site |
### Example
```javascript
 
```

## Test Configuration
(Test configuration or methodology that can be used to retrieve & render a test creative from NoBid's platform)
```javascript
 
```
