# Consumable
## General Compatibility
|Feature|  |
|---|---|
| Consent | No |
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
| unitId | Yes | Integer | |
| unitName | Yes | Integer | |
| siteId | Yes | Integer | |
| networkId | Yes | Integer | |
| zoneIds | Yes | Array   | |
 
### Example
```json
{  
   "placements":[  
      {  
         "divName":"28cbf8f87b7d5",
         "adTypes":[5],
         "siteId":"1035514",
         "networkId":"9969",
         "zoneIds":[188825]
      }
   ],
   "time":1538599207715,
   "user":{  

   },
   "url":"http://domain.com/",
   "referrer":"http://domain.com/index.html",
   "enableBotFiltering":true,
   "includePricingData":true,
   "parallel":true  
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
| networkId | Yes | String | Network ID |
| siteId | Yes | String | Site ID |
| zoneIds | Yes | Array\<Integer\> | Zone IDs |
| unitId | Yes | String | Unit ID |
| unitName | Yes | String | Unit Name |
| sizes | Yes | Array\<\[Integer, Integer\]\> | Possible sizes of the ad in pixels (\[width, height\]) |

### Example
Not sure how this is different than the bid request parameters.
