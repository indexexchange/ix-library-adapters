# Concert
## General Compatibility
| Feature           |       |
|-------------------|-------|
| Consent           | Yes   |
| Native Ad Support | ?     |
| SafeFrame Support | No(?) |
| PMP Support       | ?     |

## Browser Compatibility
| Browser              |   |
|----------------------|---|
| Chrome               | Y |
| Edge                 | ? |
| Firefox              | ? |
| Internet Explorer 9  | ? |
| Internet Explorer 10 | ? |
| Internet Explorer 11 | ? |
| Safari               | ? |
| Mobile Chrome        | ? |
| Mobile Safari        | ? |
| UC Browser           | ? |
| Samsung Internet     | ? |
| Opera                | ? |

## Adapter Information
| Info                                              |                         |
|---------------------------------------------------|-------------------------|
| Partner Id                                        | ConcertHtb              |
| Ad Server Responds in (Cents, Dollars, etc)       | Dollars                 |
| Bid Type (Gross / Net)                            | Net                     |
| GAM Key (Open Market)                             | ix_con_cpm              |
| GAM Key (Private Market)                          | ix_con_cpm              |
| Ad Server URLs                                    | bids.concert.io/bids/ix |
| Slot Mapping Style (Size / Multiple Sizes / Slot) | Multiple Sizes (?)      |
| Request Architecture (MRA / SRA / FSRA)           | FSRA                    |

## Currencies Supported

USD

## Bid Request Information

| Key        | Required | Type   | Description                           |
|------------|----------|--------|---------------------------------------|
| callbackId | Yes      | String | Generated identifier for this request |
| meta       | Yes      | Object | See below                             |
| slots      | Yes      | Array  | See below                             |

#### `slots` elements

`slots` object, above, is an array of these objects:

| Key       | Required | Type                      | Description                                                     |
|-----------|----------|---------------------------|-----------------------------------------------------------------|
| partnerId | Yes      | String                    | Partner's identifier/name                                       |
| name      | Yes      | String                    | Slot Name                                                       |
| sizes     | Yes      | [[Integer, Integer], ...] | Array of ad sizes (which are arrays of width and height values) |

#### `meta` object

| Key            | Required | Type              | Description                                                                                                  |
|----------------|----------|-------------------|--------------------------------------------------------------------------------------------------------------|
| adapterVersion | Yes      | String            | Version number of the Concert/Index Exchange adapter                                                         |
| pageUrl        | Yes      | String            | URL of the page making the request                                                                           |
| screen         | Yes      | String            | Screen dimensions, as a string formatted as `<width>x<height>`                                               |
| uid            | Yes      | String or Boolean | An identifier generated for the user, or `false` if "opted-out"                                              |
| optedOut       | Yes      | Boolean           | Whether user has opted-out of user identification                                                            |
| uspConsent     | No       | String            | Consent string for USPrivacy/CCPA                                                                            |
| gdprApplies    | No       | Integer           | Integer representing boolean, if GDPR legislation applies                                                    |
| gdprConsent    | No       | String            | Consent string for GDPR                                                                                      |
| debug          | No       | Boolean           | Whether or not to return debugging data for this request; set by a query string param of `debug_concert_ads` |

### Example
```javascript
{
  "callbackId": "4woTD0mj",
  "meta": {
    "optedOut": true,
    "uid": false,
    "screen": "1920x1200",
    "pageUrl": "https://dailyplanet.com",
    "adapterVersion": "2.0.0"
  },
  "slots": [
    {
      "partnerId": "index_exchange",
      "sizes": [[1030, 590], [620, 366], [620, 371], [620,415]],
      "name": "IRKUKZzN"
    },
    {
      "partnerId": "index_exchange",
      "sizes": [[1030, 590], [620, 366], [620, 371], [620,415]],
      "name": "C9xSqX3I"
    }
  ]
}
```

## Bid Response Information
### Bid Example
```javascript
{
  "bids": [
    {
      "ad": "<div><!--- creative code ---></div>",
      "bidId": "IRKUKZzN",
      "ttl": 360,
      "creativeId": "249410258972|a02bfc00-9cc6-11ea-b703-1d739003d32b",
      "netRevenue": false,
      "currency": "USD",
      "cpm": 6,
      "width": "1030",
      "height": "590"
    }
  ],
  "debug": [
    {
      "requestUrl": "https://securepubads.g.doubleclick.net/gampad/......",
      "creativeTag": "<div><!--- creative code ---></div>",
      "lineItemId": "1234218915",
      "creativeId": "56789258972",
      "delayedImpression": "https://securepubads.g.doubleclick.net/pcs/view?xai=.........",
      "headers": {
        // ....
      },
      "cpm": 6,
      "width": "1030",
      "height": "590",
      "targeting": {
        // ...
      },
      "concertRid": "a02bfc00-8bb5-11ea-b703-1d739003d32b",
      "partnerMethod": "partnerId",
      "adUnitPath": "...",
      "partnerId": "...",
      "bidId": "416c959a7c51bb57",
      "sizes": [["1030", "590"], ["620", "366"], ["620", "371"], ["620", "415"]],
      "transactionId": "b1f76484-bf00-47fe-a31d-926d594c500e"
    }
  ]
}
```

### Pass Example
```javascript
{
  bids: []
}
```

## Configuration Information
### Configuration Keys
| Key       | Required | Type   | Description                                        |
|-----------|----------|--------|----------------------------------------------------|
| partnerId | Yes      | String | Identifier of partner bidding, provided by Concert |

### Example
```javascript
{
 "partnerId": "daily_planet"
}
```

## Test Configuration
(Test configuration or methodology that can be used to retrieve & render a test creative from Concert's platform)
```javascript
???
```
