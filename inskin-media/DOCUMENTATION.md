# Inskin Media
## General Compatibility
|Feature|  |
|---|---|
| Consent | Yes |
| Native Ad Support | No |
| SafeFrame Support | No |
| PMP Support | No |
 
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
| Partner Id | InskinMediaHtb |
| Ad Server Responds in (Cents, Dollars, etc) | Dollars |
| Bid Type (Gross / Net) | Net |
| GAM Key (Open Market) | |
| GAM Key (Private Market) | |
| Ad Server URLs | http(s)://mfad.inskinad.com/api/v2 |
| Slot Mapping Sytle (Size / Multiple Sizes / Slot) | Slot |
| Request Architecture (MRA / SRA) | MRA |
 
## Currencies Supported
 
 USD

## Bid Request Information
### Parameters
| Key | Required | Type | Description |
|---|---|---|---|
| siteId | Yes | string | Publishers Inskin Site ID |
| networkId | Yes | string | Publishers Inskin Network ID |

 
### Example
POST https://mfad.inskinad.com/api/v2
```javascript
{"placements":[{"divName":"2abf8e3cff001d","adTypes":[23,123,4,5,9,163,2163,3006],"networkId":"9874","siteId":"1059494"}],"time":1549028000436,"user":{},"url":"http://test.url.here","enableBotFiltering":true,"includePricingData":true,"parallel":true,"networkId":"9874","siteId":"1059494"}
```
 
## Bid Response Information
### Bid Example
```javascript
 {
    "user": {
        "key": "ue1-7e3c61234ba04cb9913e1a531f854c0e"
    },
    "decisions": {
        "2abf8e3cff001d": {
            "adId": 123456,
            "creativeId": 123456,
            "flightId": 123456,
            "campaignId": 123456,
            "clickUrl": "https://mfad.inskinad.com/r?e=click",
            "impressionUrl": "https://mfad.inskinad.com/i.gif?e=impression",
            "contents": [
                {
                    "type": "raw",
                    "data": {
                        "example" : "creativeInfo"
                    },
                    "body": "<script>'Test Ad Content'</script>",
                    "customTemplate": "xxx"
                }
            ],
            "height": 250,
            "width": 300,
            "events": [],
            "pricing": {
                "price": 20,
                "clearPrice": 20,
                "revenue": 0.02,
                "rateType": 2,
                "eCPM": 20
            }
        }
    }
}
```
### Pass Example
```javascript
{
    "user": {
        "key": "ue1-7e3c61234ba04cb9913e1a531f854c0e"
    },
    "decisions": {
        "ad": null
    }
} 
```
 
## Configuration Information
### Configuration Keys
| Key | Required | Type | Description |
|---|---|---|---|
| siteId | Yes | string | Publishers Inskin Site ID |
| networkId | Yes | string | Publishers Inskin Network ID |
### Example
```javascript
 {
     "siteId" : "1059494",
     "networkId": "9874"
 }
```