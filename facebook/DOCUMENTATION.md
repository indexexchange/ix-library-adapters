# facebook
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
| Edge |  |
| Firefox |  |
| Internet Explorer 9 |  |
| Internet Explorer 10 |  |
| Internet Explorer 11 |  |
| Safari |  |
| Mobile Chrome | |
| Mobile Safari | |
| UC Browser | |
| Samsung Internet | |
| Opera | |

## Adapter Information
| Info | |
|---|---|
| Partner Id | FacebookHtb |
| Ad Server Responds in (Cents, Dollars, etc) | Dollars |
| Bid Type (Gross / Net) | Net |
| GAM Key (Open Market) | ix_fb_om |
| Slot Mapping Style (Size / Multiple Sizes / Slot) | Slot |
| Request Architecture (MRA / SRA) | FSRA |

## Currencies Supported
USD

## Bid Request Information
### Parameters
| Key | Required | Type | Description |
|---|---|---|---|
| id | Yes | String | Auction Identifier |
| imp | Yes | Array | Slots available for bid |
| device | Yes | Object | Device user agent info |
| at | Yes | Integer | Hardcoded value 1 |
| test | No | Integer | Enable testing |
| site | Yes | Object | Page url and publisher Id |
| ext | Yes | Object | Platform and SDK version |

### Example
```javascript
{
    "id": "ZU6O8wvRcuqyRV4KwS2Dpu3j0",
    "imp": [
        {
            banner: {
            	w: 300,
            	h: 250
            },
            id: "mrect_slot_id",
            tagid: "2354122411472512_2484913318393420"
        },
        {
            native: {
            	w: -1,
                h: -1,
                ext : {
                    native_container: '<style>...</style>\n<div class="thirdPartyRoot">...</div>'
                }
            },
            id: "native_slot_id",
            tagid: "2354122411472512_2484910865060332"
        },
        {
            banner: {
            	w: 300,
            	h: 250
            },
            id: "fullwidth_slot_id",
            tagid: "2354122411472512_2484913841726701"
        },
        {
            banner: {
            	w: 320,
            	h: 50
            },
            id: "banner_slot_id",
            tagid: "2354122411472512_2484911998393552"
        }
    ],
    "device": {
        "ua": "Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Mobile Safari/537.36"
    },
    "at": 1,
    "test": 0,
    "site": {
        "page": "https://example.com/example.html",
        "publisher": {
            "id": "2354122411472512"
        }
    },
    "ext": {
        "platformid": "2061185240785516",
        "sdk_version": "6.0.web",
        "platform_version": "2.15.0",
        "adapter_version": "2.2.0"
    }
}
```

## Bid Response Information
### Bid Example
```javascript
{
   "id": "ZU6O8wvRcuqyRV4KwS2Dpu3j0",
   "seatbid": [
      {
         "bid": [
            {
               "id": "5826584836937535825",
               "impid": "mrect_slot_id",
               "price": 1.88,
               "adm": "<div>Ad Creative Tag</div>",
               "nurl": "https://win.url",
               "lurl": "https://loss.url"
            },
            {
               "id": "361364155794510129",
               "impid": "native_slot_id",
               "price": 2.30,
               "adm": "<div>Ad Creative Tag</div>",
               "nurl": "https://win.url",
               "lurl": "https://loss.url"
            },
            {
               "id": "1674542330225841425",
               "impid": "fullwidth_slot_id",
               "price": 1.15,
               "adm": "<div>Ad Creative Tag</div>",
               "nurl": "https://win.url",
               "lurl": "https://loss.url"
            },
            {
               "id": "7641894214533665105",
               "impid": "banner_slot_id",
               "price": 4.56,
               "adm": "<div>Ad Creative Tag</div>",
               "nurl": "https://win.url",
               "lurl": "https://loss.url"
            },
         ]
      }
   ],
   "bidid": "8211403287449087426",
   "cur": "USD"
}
```
### Pass Example
```javascript
HTTP status code - 204 No Content
```

## Configuration Information
### Configuration Keys
| Key | Required | Type | Description |
|---|---|---|---|
| placementId | Yes | String | The placement ID of ad unit obtained through FB Monetisation Manager |
| size | Yes | Array | Size of the ad unit. Banner: [320, 50], MRect/Fullwidth: [300, 250],  Native: [Custom, Custom] |
| adFormat | No | String | "native" if the ad unit and the placement ID is for a native unit |
### Example
a) Medium Rectangle and Fullwidth:
```javascript
{
    placementId: "2354122411472512_2484913318393420",
    size: [300, 250]
}
```
b) Banner:
```javascript
{
    placementId: "2354122411472512_2484911998393552",
    size: [320, 50]
}
```
c) Native (Include 'nativeAssets' in adapter level configuration containing div and style):
Native Doc: https://developers.facebook.com/docs/audience-network/web/nativeformat
```javascript
{
    placementId: "2354122411472512_2484910865060332",
    size: [custom, custom],
    adFormat: "native"
}
nativeAssets: '<style>...</style>\n<div class="thirdPartyRoot">...</div>'
```

