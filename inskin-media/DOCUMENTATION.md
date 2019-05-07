# Inskin Media
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
| GAM Key (Open Market) | ix_ism_cpm |
| GAM Key (Private Market) | ix_ism_cpm, ix_ism_dealid|
| Ad Server URLs | http(s)://mfad.inskinad.com/api/v2 |
| Slot Mapping Sytle (Size / Multiple Sizes / Slot) | Slot |
| Request Architecture (MRA / SRA) | SRA |
 
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
{
    "time": 1557238103130,
    "user": {},
    "url": "http://localhost:5837/public/debugger/adapter-debugger.html",
    "referrer": "http://localhost:5837/public/debugger/adapter-debugger.html",
    "enableBotFiltering": true,
    "includePricingData": true,
    "consent": {
        "gdprVendorId": 150,
        "gdprConsentString": "TEST_GDPR_CONSENT_STRING",
        "gdprConsentRequired": true
    },
    "placements": [{
        "networkId": "9874",
        "siteId": "1048383",
        "divName": "n3ik7dk2",/*xSlotName*/
        "adTypes": [5, 9, 163, 2163, 3006],
        "eventIds": [40, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295],
        "properties": {
            "screenWidth": 1920,
            "screenHeight": 1080
        }
    }]
}
```
 
## Bid Response Information
### Bid Example
```javascript
{
    "user": {
        "key": "ue1-20831c4203e6414fb175c3da7f0a57ee"
    },
    "decisions": {
        "Oj2BSfze": {/*xSlotName*/
            "adId": n3ik7dk2,
            "creativeId": 5307845,
            "flightId": 7887391,
            "campaignId": 673897,
            "priorityId": 89381,
            "clickUrl": "http://mfad.inskinad.com/r?e=clickUrl",
            "impressionUrl": "http://mfad.inskinad.com/i.gif?e=impressionId",
            "contents": [{
                "type": "raw",
                "data": {
                    "example": "creativeInfo"
                },
                "body": "<script>'Test Ad Content'</script>",
                "customTemplate": "xxx"
            }],
            "height": 250,
            "width": 300,
            "events": [{
                /* custom events*/
                "id": 40,
                "url": "http://mfad.inskinad.com/e.gif?e=eventTracking"
            }],
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
        "key": "ue1-0ab8bc018ae34e9a91f946cbe098050f"
    },
    "decisions": {
        "n3ik7dk2": null/*xSlotName*/
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