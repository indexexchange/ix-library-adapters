# EMX Digital
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
| UC Browser | No |
| Samsung Internet | Yes |
| Opera | Yes |

## Adapter Information
| Info | |
|---|---|
| Partner Id | BRealTimeHtb |
| Ad Server Responds in (Cents, Dollars, etc) | |
| Bid Type (Gross / Net) | |
| GAM Key (Open Market) | ix_brt_cpm |
| GAM Key (Private Market) | ix_brt_dealid |
| Ad Server URLs | emxdgt |
| Slot Mapping Style (Size / Multiple Sizes / Slot) | Slot |
| Request Architecture (MRA / SRA) | SRA |

## Currencies Supported
USD

## Bid Request Information
### Parameters
| Key | Required | Type | Description |
|---|---|---|---|
| imp | Yes | []Imp{} | Array of each Slot info in request |
| page | Yes | String | The full page url |
| domain | Yes | String | The page hostname |
| secure | Yes | Int | 1 if the page is secure, 0 otherwise |
| referrer | Yes | String | The page referrer |
| gdpr | No | Int | 1 if GDPR applies, 0 otherwise |
| gdprConsent | No | String | The GDPR encoded consent string |


### Example
```javascript
{
    id: "35742fd7-1d55-4a3c-825c-5b35e0e64d51",
    imp: [{
        id: 1234,
        banner: {
            format: [{
                w: 728,
                h: 90
            }],
            w: 728,
            h: 90
        },
        tagid: '74072',
        secure: 1,
        bidfloor: 0.01
    }],
    site: {
        domain: "www.test.com",
        page: "https://www.test.com/",
        ref: ""
    },
    version: "3.0.0"
}
```

## Bid Response Information
### Bid Example
200 OK
```javascript
{
    id: r.id,
    seatbid: [
        {
            bid: [
                {
                    adm: creative || '<div id="1"></div>',
                    id: r.imp[0].id,
                    ttl: 300,
                    crid: '94395500',
                    w: 300,
                    price: 2.00,
                    adid: '94395500',
                    h: 250
                }
            ],
            seat: '1356'
        },
        {
            bid: [
                {
                    adm: creative || '<div id="2"></div>',
                    id: r.imp[1].id,
                    ttl: 300,
                    crid: '41975016',
                    w: 728,
                    price: 2.00,
                    adid: '41975016',
                    h: 90
                }
            ],
            seat: '1356'
        }
    ]
};
```
### Pass Example
204 Response

## Configuration Information
### Configuration Keys
| Key | Required | Type | Description |
|---|---|---|---|
| tagid | Yes | String | EMX Digital exchange ID |
| bidfloor | Yes | Number | Bid floor |
| sizes | Yes | Int[][] | Ad slot sizes |

### Example
```javascript
{
    "tagid": "74072",
    "bidfloor": 0.01,
    "sizes": [[728, 90], [300, 250]]
}
```