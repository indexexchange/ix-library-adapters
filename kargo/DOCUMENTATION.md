# Kargo
## General Compatibility
|Feature|  |
|---|---|
| Consent | No |
| Native Ad Support | Yes |
| SafeFrame Support | No |
| PMP Support | Yes |

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
| UC Browser | Yes |
| Samsung Internet | Yes |
| Opera | Yes |

## Adapter Information
| Info | |
|---|---|
| Partner Id | KargoHtb |
| Ad Server Responds in (Cents, Dollars, etc) | dollars |
| Bid Type (Gross / Net) | Net |
| GAM Key (Open Market) | ix_karg_om |
| GAM Key (Private Market) | ix_karg_pm |
| Ad Server URLs | krk.kargo.com |
| Slot Mapping Sytle (Size / Multiple Sizes / Slot) | slot |
| Request Architecture (MRA / SRA) | SRA |

## Currencies Supported
- USD

## Bid Request Information
### Parameters
| Key | Required | Type | Description |
|---|---|---|---|
| sessionId | true | UUID | UUID tied to this instance of an adapter load |
| timeout | true | integer | timeout for request |
| adSlotIDs | true | array of UUIDs | slots for bid request |
| timestamp | true | unix timestamp | browser time |
| userIDs | true | user IDs object | all user ID data (see below) |
| krux | true | krux segments object | all krux segment data (see below) |
| pageURL | true | url | current page URL |
| rawCRB | true | string | unparsed cookie data |
| rawCRBLocalStorage | true | string | unparsed localstorage data |

### Example
```javascript
{
    "sessionId": "5a7dc9bc-0687-4c03-b522-6171572f5453",
    "timeout": 700,
    "adSlotIDs": [
        "fb60875e-8c44-42f2-ae7d-93e0ac1b7256",
        "70c4df18-79c9-4b58-8236-6a5db8122f8d",
        "9afef9d7-9779-4cff-a9bb-c6aff11fb0b9"
    ],
    "timestamp": 1553717189498,
    "userIDs": {
        "kargoID": "",
        "clientID": "",
        "tdID": "",
        "idlEnv": "",
        "identityData": null,
        "crbIDs": {},
        "optOut": false,
        "usp": "1YNN"
    },
    "krux": {
        "userID": null,
        "segments": []
    },
    "pageURL": "https://www.gamespot.com/",
    "rawCRB": null,
    "rawCRBLocalStorage" : null
}
```

## Bid Response Information
### Bid Example
```javascript
{
    "fb60875e-8c44-42f2-ae7d-93e0ac1b7256": {
        "cpm": 4.23,
        "adm": "<html>AD MARKUP HERE</html>",
        "width": 0,
        "height": 0,
        "bidID": "d0d1b2a4-017f-47c6-97ff-ec2320cf4465",
        "id": "fb60875e-8c44-42f2-ae7d-93e0ac1b7256",
        "receivedTracker": "//krk.kargo.com/api/v1/event/received?ctx=dK5BrTSB2...",
        "targetingPrefix": "300x250_",
        "targetingCustom": "",
        "pricing": {
            "floor": 0,
            "buckets": [
                {
                    "max": 2000,
                    "step": 5
                },
                {
                    "max": 5000,
                    "step": 100
                }
            ]
        }
    },
    "70c4df18-79c9-4b58-8236-6a5db8122f8d": {
        "cpm": 4.23,
        "adm": "<html>AD MARKUP HERE</html>",
        "width": 0,
        "height": 0,
        "bidID": "42f784de-2b47-460b-9b8d-d3092a1ef05d",
        "id": "70c4df18-79c9-4b58-8236-6a5db8122f8d",
        "receivedTracker": "//krk.kargo.com/api/v1/event/received?ctx=oci4v...",
        "targetingPrefix": "300x250_",
        "targetingCustom": "",
        "pricing": {
            "floor": 0,
            "buckets": [
                {
                    "max": 2000,
                    "step": 5
                },
                {
                    "max": 5000,
                    "step": 100
                }
            ]
        }
    },
    "9afef9d7-9779-4cff-a9bb-c6aff11fb0b9": {
        "cpm": 0.72,
        "adm": "<html>AD MARKUP HERE</html>",
        "width": 320,
        "height": 50,
        "bidID": "3b046cc6-f505-4ff7-ab51-41d199ef351b",
        "id": "9afef9d7-9779-4cff-a9bb-c6aff11fb0b9",
        "receivedTracker": "//krk.kargo.com/api/v1/event/received?ctx=rUt5uXO...",
        "targetingPrefix": "320x50_",
        "targetingCustom": "",
        "pricing": {
            "floor": 0,
            "buckets": [
                {
                    "max": 2000,
                    "step": 5
                },
                {
                    "max": 5000,
                    "step": 100
                }
            ]
        }
    }
}
```
### Pass Example
```javascript
{}
```

## Configuration Information
### Configuration Keys
| Key | Required | Type | Description |
|---|---|---|---|
| xslots | true | map | ad slots |
| mapping | true | map | map of units to ad slots |
| timeout | true | int | timeout for requests |
| bidTransformer | true | object | index bid transformation config |
### Example
```javascript
{
    xSlots: {
        1: {
            adSlotId: "e0e5bfd8-514d-4e73-9c09-a559fe5d89df"
        },
        2: {
            adSlotId: "1e976be9-c60f-413a-8e1a-047fc5b87296"
        }
    }
}
```
