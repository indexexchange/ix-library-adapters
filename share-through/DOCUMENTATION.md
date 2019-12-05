# ShareThrough
## General Compatibility
|Feature|  |
|---|---|
| Consent | X |
| Native Ad Support | X |
| SafeFrame Support |  |
| PMP Support | |

## Browser Compatibility
| Browser |  |
|--- |---|
| Chrome | X |
| Edge | X |
| Firefox | X |
| Internet Explorer 9 |  |
| Internet Explorer 10 |  |
| Internet Explorer 11 | X |
| Safari | X |
| Mobile Chrome | X |
| Mobile Safari | X |
| UC Browser | |
| Samsung Internet | |
| Opera | |

## Adapter Information
| Info | |
|---|---|
| Partner Id | ShareThroughHtb |
| Ad Server Responds in (Cents, Dollars, etc) | Dollars |
| Bid Type (Gross / Net) | Net |
| GAM Key (Open Market) | |
| GAM Key (Private Market) | |
| Ad Server URLs | btlr.sharethrough.com/t6oivhQt/v1 |
| Slot Mapping Style (Size / Multiple Sizes / Slot) | Slot |
| Request Architecture (MRA / SRA) | MRA |

## Currencies Supported

## Bid Request Information
### Parameters
| Key | Required | Type | Description |
|---|---|---|---|
| | | | |

### Example
```javascript
{
  placement_key: "abc123",
  bidId: "_fakeBidId",
  instant_play_capable: "true",
  hbSource: "indexExchange",
  hbVersion: "2.2.0",
  cbust: System.now()
};
```

## Bid Response Information
### Bid Example
```javascript

```
### Pass Example
```javascript
```

## Configuration Information
### Configuration Keys
| Key | Required | Type | Description |
|---|---|---|---|
| placementKey | True | String | Unique ad slot identifier |

### Example
```javascript
{
    timeout: 1000,
    xSlots: {
      1: {
        placementKey: "abc123",
        sizes: [[1, 1]]
      }
    },
    mapping: {
      htSlot1: ["1"]
    }
};

```
