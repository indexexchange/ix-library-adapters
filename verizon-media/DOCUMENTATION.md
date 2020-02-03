# Verizon Media
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
| Internet Explorer 9 | No  |
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
| Partner Id | VerizonMediaHtb |
| Ad Server Responds in (Cents, Dollars, etc) | Dollars |
| Bid Type (Gross / Net) | Net |
| GAM Key (Open Market) | ix_vzm_cpm |
| GAM Key (Private Market) | ix_vzm_cpm |
| Ad Server URLs | https://c2shb.ssp.yahoo.com/bidRequest? |
| Slot Mapping Style (Size / Multiple Sizes / Slot) | Multiple Sizes |
| Request Architecture (MRA / SRA) | MRA |
 
## Currencies Supported
 
## Bid Request Information

### Parameters
| Key | Required | Type | Description |
|---|---|---|---|
| dcn | true | String | Distribution Channel Number - the unique site/publisher ID for VZM SSP |
| pos | true | String | The position/placement ID that is required to be filled |
| secure | true | Number | Numerical flag indicating if the request is secure. MUST be 1 |
| gdpr | true | Number | 0 or 1 to signify if GDPR consent applies |
| euconsent | true | String | Encoded consent string of the user (for GDPR) |
| us_privacy | false | String | Encoded consent string of the user (for USP/CCPA) |
 
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
  }
```
 
## Configuration Information
### Configuration Keys
| Key | Required | Type | Description |
|---|---|---|---|
| dcn | Yes | string | Distribution Channel Number (aka site ID) provided to the publisher |
| pos | Yes | string | Position identifier |
### Example
```javascript
 {
        dcn: '2c9d2b4f015f5f7dd437918a83ea020c',
        xSlots: {
            1: {
                pos: 'hb_index_leader1'
            }
        }
    }
```

## Test Configuration
(Test configuration or methodology that can be used to retrieve & render a test creative from Verizon Media's platform)
```javascript
 
```
