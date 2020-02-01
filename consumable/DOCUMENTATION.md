# Consumable
## General Compatibility
|Feature|  |
|---|---|
| Consent | Yes |
| Native Ad Support | Yes |
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
| UC Browser | No |
| Samsung Internet | No |
| Opera | Yes |
 
## Adapter Information
| Info | |
|---|---|
| Partner Id | ConsumableHtb |
| Ad Server Responds in (Cents, Dollars, etc) | Dollars |
| Bid Type (Gross / Net) | Net |
| GAM Key (Open Market) | ix_cnsm_id |
| GAM Key (Private Market) | ix_cnsm_dealid |
| Ad Server URLs | serverbid.com |
| Slot Mapping Style (Size / Multiple Sizes / Slot) | Size |
| Request Architecture (MRA / SRA) | SRA |
 
## Currencies Supported
USD $
 
## Bid Request Information
### Parameters
| Key | Required | Type | Description |
|---|---|---|---|
| `placements` | Yes | `Array\<Placement\>` | List of ad placements (slots) to bid on |
| `time` | Yes | `Integer` | Time and date of the request as milliseconds elapsed since January 1, 1970 |
| `user` | Yes | `Object` | Currently always an empty object |
| `url` | Yes | `String` | URL of the current page |
| `referrer` | No | `String` | URL of the referrer |
| `enableBotFiltering` | Yes | `Boolean` | Always `true` |
| `includePricingData` | Yes | `Boolean` | Always `true` |
| `parallel` | Yes | `Boolean` | Always `true` |

### Placement
| Key | Required | Type | Description |
| --- | --- | --- | --- |
| `divName` | Yes | `String` | Name of the slot to bid on |
| `adTypes` | Yes | `Array\<Integer\>` | List of IDs that determines possible ad sizes |
| `siteId` | Yes | `String` | Fixed identifier supplied by Consumable |
| `networkId` | Yes | `String` | Fixed identifier supplied by Consumable |
| `zoneIds` | No | `Array\<Integer\>` | List of fixed identifiers supplied by Consumable
| `unitId` | No | `String` | Fixed identifier supplied by Consumable |
| `unitName` | No | `String` | Fixed identifier supplied by Consumable |
 
### Example
```json
{  
   "placements":[  
      {  
         "divName": "28cbf8f87b7d5",
         "adTypes": [5],
         "siteId": "1035514",
         "networkId": "9969",
         "zoneIds": [188825],
         "unitId": "4508",
         "unitName": "cnsmbl-audio-320x50-slider"
      }
   ],
   "time": 1538599207715,
   "user": {},
   "url": "http://example.com/page/path",
   "referrer": "http://example.com/another/page",
   "enableBotFiltering": true,
   "includePricingData": true,
   "parallel": true  
}
```

 
## Bid Response Information
### Bid Example
```json
{  
   "decisions":{  
      "2e53ecd4a29b06":{  
         "adId":-7176956978374674467,
         "impressionUrl":"https://e.serverbid.com/i/?i=ARAAAAAAAAAAcP...",
         "contents":[  
            {  
               "body":"<script src=\"https://nym1-ib.adnxs.com/ab?e=wqT...\"></script>",
               "data":null,
               "type":"rtb"
            }
         ],
         "height":250,
         "width":300,
         "pricing":{  
            "clearPrice":0.3075,
            "eCPM":0.0,
            "price":0.0,
            "rateType":2,
            "revenue":0.0
         }
      }
   }
}
```

### Pass Example
```json
{
    "user": {
        "key": "ad39231daeb043f2a9610414f08394b5"
    },
    "decisions": {
        "2e53ecd4a29b06": null
    }
}
```
 
## Configuration Information
### Configuration Keys
| Key | Required | Type | Description |
|---|---|---|---|
| `networkId` | Yes | `String` | Network ID (supplied by Consumable) |
| `siteId` | Yes | `String` | Site ID (supplied by Consumable) |
| `zoneIds` | No | `Array\<Integer\>` | Zone IDs (supplied by Consumable) |
| `unitId` | Yes | `String` | Unit ID (supplied by Consumable) |
| `unitName` | Yes | `String` | Unit Name (supplied by Consumable) |
| `sizes` | Yes | `Array\<\[Integer, Integer\]\>` | Possible sizes of the ad in pixels (`\[width, height\]`) |

### Example
```
{
    "networkId": "9969",
    "siteId": "1029010",
    "zoneIds": [187327],
    "unitId": "4508",
    "unitName": "cnsmbl-audio-320x50-slider",
    "sizes": [[320, 50]]
}
```