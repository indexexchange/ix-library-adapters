# Brightcom
## General Compatibility
| Feature | |
|---|---|
| Consent | No |
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
| Partner Id | BrightcomHtb |
| Ad Server Responds in (Cents, Dollars, etc) | Dollars |
| Bid Type (Gross / Net) | Net |
| GAM Key (Open Market) | ix_bri_cpm |
| GAM Key (Private Market) | ix_bri_cpm |
| Ad Server URLs | //brightcombid.marphezis.com/hb |
| Slot Mapping Sytle (Size / Multiple Sizes / Slot) | Multiple Sizes |
| Request Architecture (MRA / SRA) | SRA |

## Currencies Supported
USD

## Bid Request Information
### Parameters
| Key | Required | Type | Description |
|---|---|---|---|
| imp | Yes | Object[] | The list of ad slot config objects. See [Ad Slot Parameters](#slot-params) |
| site | Yes | Object | Site information Object. See [Site Parameters](#site-params) |
| device | Yes | Object | Device information Object. See [Device Parameters](#device-params) |

<a name="site-params"></a>Site Parameters

| Key | Required | Type | Description |
|---|---|---|---|
| domain | Yes | String | The page hostname |
| page | Yes | String | The full page url |
| publisher.id | Yes | String | Publisher id |

<a name="device-params"></a>Device Parameters

| Key | Required | Type | Description |
|---|---|---|---|
| devicetype | Yes | Int | 1 if the device is mobile, 3 if the device is connected TV, 2 otherwise |
| w | Yes | Int | Screen width |
| h | Yes | Int | Screen height |

<a name="slot-params"></a>Ad Slot Parameters

| Key | Required | Type | Description |
|---|---|---|---|
| id | Yes | String | The ad slot placementId |
| tagid | Yes | String | The ad slot tag id |
| bidfloor | No | Number | Bid floor |
| banner.format | Yes | Object[] | Ad slot sizes |

### Example
```
http://brightcombid.marphezis.com/hb?cb=12313133
```
POST Payload
```javascript
{
    "id": "7ba5a917936b33",
    "imp": [
        {
            "id": "283a9f4cd2415d",
            "banner": {
                "format": [
                    {
                        "w": 300,
                        "h": 250
                    },
                    {
                        "w": 728,
                        "h": 90
                    }
                ],
            },
            "tagid": "div-gpt-ad-1460505748561-0",
            "bidfloor": 0.05
        }
    ],
    "site": {
        "domain": "example.com",
        "page": "http://example.com/page.html",
        "publisher": {
            "id": "2141020"
        }
    },
    "device": {
        "devicetype": 1,
        "w": 375,
        "h": 812
    },
}
```

## Bid Response Information
### Bid Example
```javascript
[
    {
        "id": "376874781",
        "adm": "<div>Ad</div>",
        "impid": "283a9f4cd2415d",
        "nurl": "//trk.diamondminebubble.com/h.html?e=hb_before_creative_renders&ho=2140340&ty=j&si=728x90&ta=16577&cd=cdn.marphezis.com&raid=7ba5a917936b33&rimid=283a9f4cd2415d&rbid=376874781&cb=55555",
        "price": 1.00,
        "w": 728,
        "h": 90
    },
    {
        "id": "376874782",
        "adm": "<div>Ad</div>",
        "impid": "283a9f4cd2415e",
        "nurl": "//trk.diamondminebubble.com/h.html?e=hb_before_creative_renders&ho=2140340&ty=j&si=468x60&ta=16577&cd=cdn.marphezis.com&raid=7ba5a917936b33&rimid=283a9f4cd2415d&rbid=376874781&cb=66666",
        "price": 2.00,
        "w": 468,
        "h": 60
    }
]
```
### Pass Example
```
[
    {
        "id": "376874781",
        "adm": "<div>Ad</div>",
        "impid": "283a9f4cd2415d",
        "nurl": "//trk.diamondminebubble.com/h.html?e=hb_before_creative_renders&ho=2140340&ty=j&si=728x90&ta=16577&cd=cdn.marphezis.com&raid=7ba5a917936b33&rimid=283a9f4cd2415d&rbid=376874781&cb=11111",
        "price": 0,
        "w": 728,
        "h": 90
    }
]
```
May return HTTP status code - 204 No Content

## Configuration Information
### Configuration Keys
| Key | Required | Type | Description |
|---|---|---|---|
| publisherId | Yes | String | Publisher ID |
| placementId | Yes | String | Placement ID |
| bidfloor | No | Number | Bid floor |
| sizes | Yes | Int[][] | Ad slot sizes |
### Example
```javascript
{
    "publisherId": "2141020",
    "xSlots": {
        1: {
            "placementId": "283a9f4cd2415d",
            "bidfloor": 1,
            "sizes": [[728, 90], [468, 60]]
        }
    }
}
```
