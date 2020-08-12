# 33Across
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
| Internet Explorer 9 | Yes |
| Internet Explorer 10 | Yes |
| Internet Explorer 11 | Yes |
| Safari | Yes |
| Mobile Chrome | Yes |
| Mobile Safari | Yes |
| UC Browser | |
| Samsung Internet | |
| Opera | |

## Adapter Information
| Info | |
|---|---|
| Partner Id | ThirtyThreeAcrossHtb |
| Ad Server Responds in (Cents, Dollars, etc) | Dollars |
| Bid Type (Gross / Net) | Net |
| GAM Key (Open Market) | ix_thi_cpm |
| GAM Key (Private Market) | ix_thi_cpm |
| Ad Server URLs | https://ssc.33across.com/api/v1/hb |
| Slot Mapping Style (Size / Multiple Sizes / Slot) | Multiple Sizes |
| Request Architecture (MRA / SRA) | MRA |

## Currencies Supported

## Bid Request Information
### Parameters
| Key | Required | Type | Description |
|---|---|---|---|
|id|Yes|String| Bid request identifier |
|imp|Yes|Object| ORTB imp object describes the information of an ad placement/slot |
|site|Yes|Object| ORTB site object describes the information of publisher id, page, and ref |
|user|No|Object| ORTB user object describes the information of user consent |
|regs|No|Object| ORTB regs object describes the information about GDPR eligibility |
|ext|No|Object| HB wrapper name and version info |

### Example
```javascript
{
  "id": "1ebc969f-97fe-479f-9e2c-c93f517ed8f0",
  "imp": [{
    "bid": [{
      "id": "c758487f-9635-429b-aa5f-3294263eac8",
      "banner": {
        "format": [
          {
            "w": 300,
            "h": 250
          },
          {
            "w": 160,
            "h": 600
          }
        ],
        "ext": {
          "ttx": {
            "viewability": {
              "amount": 62,
            }
          }
        }
      },
      "ext": {
        "ttx": {
          "prod": "siab"
        }
      },
      "bidfloor": 0.01
    }]
  }],
  "site": {
    "id": "dasVc823UaK5vsm367O",
    "page": "http://example.com/example.html",
    "ref": "http://example.com/example.html"
  },
  "user": {
    "ext": {
      "consent": ''
    }
  },
  "regs": {
    "ext": {
      "gdpr": 0
    }
  },
  "ext": {
    "ttx": {
      "caller": [
        {
          "name": 'index',
          "version": '2.0.0'
        }
      ]
    }
  }
}
```

## Bid Response Information
### Bid Example
```javascript
{
  "id": "1ebc969f-97fe-479f-9e2c-c93f517ed8f0",
  "cur": "USD",
  "seatbid": [{
    "bid": [{
      "id": "c758487f-9635-429b-aa5f-3294263eac8",
      "impid": "c758487f-9635-429b-aa5f-3294263eac8",
      "adm": "<div>creative content<div>",
      "price": 1.234567,
      "w": 300,
      "h": 250
    }]
  }]
}
```

### Pass Example
```javascript
{
  "id": "1ebc969f-97fe-479f-9e2c-c93f517ed8f0",
  "seatbid": []
}
```

## Configuration Information
### Configuration Keys
| Key | Required | Type | Description |
|---|---|---|---|
|siteId|Yes|string| Publisher/site identifier |
|productId|Yes|string| 33Across Product type, 'siab' or 'inview'  |
|sizes|Yes| Array[] | An array of array representation of the size of the ad unit, like [[width1, height1],[width2, height2]] |
|bidfloor|No|number| Minimum bid for this impression expressed in dollars |
|test|No|number| Indicator of test mode in which auctions are not billable, where 0 = live mode, 1 = test mode  |

### Example
```javascript
{
  siteId: 'dasVc823UaK5vsm367O',
  xSlots: {
    1: {
      productId: 'siab',
      sizes: [[300, 250], [160, 600]],
      bidfloor: 0.1
    }
  },
  test: 0
}
```

## Test Configuration
(Test configuration or methodology that can be used to retrieve & render a test creative from 33Across' platform)
```javascript
{
  siteId: 'dasVc823UaK5vsm367O',
  xSlots: {
    1: {
      productId: 'siab',
      sizes: [[300, 250], [160, 600]],
      bidfloor: 0.1
    }
  },
  test: 1 // By setting the value to 1, Ad Server will return a sample bid for testing
}
```
