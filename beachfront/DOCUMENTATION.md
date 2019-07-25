# Beachfront
## General Compatibility
| Feature | |
|---|---|
| Consent | Yes |
| Native Ad Support | No |
| SafeFrame Support | Yes |
| PMP Support | No |

## Browser Compatibility
| Browser | |
|---|---|
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
| Samsung Internet | Yes |
| Opera | Yes |

## Adapter Information
| Info | |
|---|---|
| Partner Id | BeachfrontHtb |
| Ad Server Responds in (Cents, Dollars, etc) | Dollars |
| Bid Type (Gross / Net) | Net |
| GAM Key (Open Market) | ix_bft_cpm |
| GAM Key (Private Market) | ix_bft_cpm |
| Ad Server URLs | //display.bfmio.com/prebid_display |
| Slot Mapping Style (Size / Multiple Sizes / Slot) | Multiple Sizes |
| Request Architecture (MRA / SRA) | SRA |

## Currencies Supported
USD

## Bid Request Information
### Parameters
| Key | Required | Type | Description |
|---|---|---|---|
| slots | Yes | Object[] | The list of ad slot config objects. See [Ad Slot Parameters](#slot-params) |
| page | Yes | String | The full page url |
| domain | Yes | String | The page hostname |
| search | Yes | String | The page query params |
| secure | Yes | Int | 1 if the page is secure, 0 otherwise |
| referrer | Yes | String | The page referrer |
| ua | Yes | String | The device user agent |
| deviceOs | No | String | The OS of the device |
| isMobile | No | Int | 1 if the device is mobile, 0 otherwise |
| dnt | No | Int | 1 if do not track is enabled, 0 otherwise |
| adapterVersion | No | String | Header bidding adapter version |
| adapterName | No | String | Header bidding adapter name |
| gdpr | No | Int | 1 if GDPR applies, 0 otherwise |
| gdprConsent | No | String | The GDPR encoded consent string |

<a name="slot-params"></a>Ad Slot Parameters

| Key | Required | Type | Description |
|---|---|---|---|
| slot | Yes | String | The ad slot name |
| id | Yes | String | Beachfront exchange ID |
| bidfloor | Yes | Number | Bid floor |
| sizes | Yes | Object[] | Ad slot sizes |

### Example
```
http://display.bfmio.com/prebid_display?cb=4p8ou44g
```
POST Payload
```javascript
{
    "slots": [
        {
            "slot": "ziUHMUKM",
            "id": "3b16770b-17af-4d22-daff-9606bdf2c9c3",
            "bidfloor": 0.01,
            "sizes": [
                {
                    "w": 728,
                    "h": 90
                },
                {
                    "w": 300,
                    "h": 250
                }
            ]
        }
    ],
    "page": "http://www.example.com/page.html?key=val",
    "domain": "www.example.com",
    "search": "?key=val",
    "secure": 0,
    "referrer": "http://www.example.com/page.html?key=val",
    "ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.28 Safari/537.36",
    "deviceOs": "Mac OS X",
    "isMobile": 0,
    "dnt": 0,
    "adapterVersion": "1.2",
    "adapterName": "BFIO_IX",
    "gdpr": 1,
    "gdprConsent": "TEST_GDPR_CONSENT_STRING"
}
```

## Bid Response Information
### Bid Example
```javascript
[
    {
        "slot": "1",
        "w": 728,
        "h": 90,
        "price": 3.03,
        "crid": "crid_1",
        "adm": "<div>Ad</div>"
    },
    {
        "slot": "2",
        "w": 300,
        "h": 250,
        "price": 3.02,
        "crid": "crid_2",
        "adm": "<div>Ad</div>"
    }
]
```
### Pass Example
```
[
    {
        "sync": "\/\/sync.bfmio.com\/sync_iframe?ifpl=5&ifg=1&id=Display+Prebid+Integration+Exchange&gdpr=1&gc=TEST_GDPR_CONSENT_STRING&gce=1&cb=1546528538932"
    }
]
```
May return HTTP status code - 204 No Content

## Configuration Information
### Configuration Keys
| Key | Required | Type | Description |
|---|---|---|---|
| appId | Yes | String | Beachfront exchange ID |
| bidfloor | Yes | Number | Bid floor |
| sizes | Yes | Int[][] | Ad slot sizes |
### Example
```javascript
{
    "appId": "3b16770b-17af-4d22-daff-9606bdf2c9c3",
    "bidfloor": 0.01,
    "sizes": [[728, 90], [300, 250]]
}
```
