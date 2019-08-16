# AOL
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
| Partner Id | AOLHtb |
| Ad Server Responds in (Cents, Dollars, etc) | Dollars |
| Bid Type (Gross / Net) | Net |
| GAM Key (Open Market) | ix_aol_cpm |
| GAM Key (Private Market) | ix_aol_cpm |
| Ad Server URLs | https://adserver-(as&#124;eu&#124;us).adtech.advertising.com/pubapi |
| Slot Mapping Style (Size / Multiple Sizes / Slot) | Multiple Sizes |
| Request Architecture (MRA / SRA) | MRA |
 
## Currencies Supported
 
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
{
    id: '135118129423453799',
    seatbid: [
      {
        bid: [
          {
            id: '135118129423453799',
            price: '0.59',
            adm: 'ADMARKUP FOUND HERE',
            crid: '19992723',
            w: 300,
            h: 250
          }
        ]
      }
    ],
    ext: {}
  }
```
### Pass Example
```javascript
 {
    id: '135118129423453799',
    seatbid: [],
    nbr: 1
  };
```
 
## Configuration Information
### Configuration Keys
| Key | Required | Type | Description |
|---|---|---|---|
| networkId | Yes |  string | The network identifier assigned to the publisher. |
| region | Yes |  string | The ad serving region associated to the network. One of 'eu', 'us' and 'asia' |
| placementId | Yes |  string | The placement identifier |
### Example
```javascript
 {
    region: 'us',
    networkId: '9599.1',
    xSlots: {
      1: {
        placementId: '4601516'
      }
    }
  }
```

## Test Configuration
(Test configuration or methodology that can be used to retrieve & render a test creative from AOL's platform)
```javascript
 
```
