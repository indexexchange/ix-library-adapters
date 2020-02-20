# RTB House
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
| UC Browser | Yes |
| Samsung Internet | Yes |
| Opera | Yes |
 
## Adapter Information
| Info | |
|---|---|
| Partner Id | RTBHouseHtb |
| Ad Server Responds in (Cents, Dollars, etc) | Dollars |
| Bid Type (Gross / Net) | Net |
| GAM Key (Open Market) | n/a |
| GAM Key (Private Market) | n/a |
| Ad Server URLs | https://ixwrapper-c2s-[eu/sin/us].creativecdn.com/bidder/ixwrapper/bids|
| Slot Mapping Style (Size / Multiple Sizes / Slot) | Multiple Sizes |
| Request Architecture (MRA / SRA) | SRA |

## Currencies Supported
USD
 
## Bid Request Information
### Parameters
| Key | Required | Type | Description |
|---|---|---|---|
|id|true|string|Unique ID of the bid request, provided by the exchange|
|imp|true|object array|Array of Imp objects|
|site|true|object|Details via a Site object about the publisher’s website.|
|cur|false|string array|Array of allowed currencies for bids on this bid request using ISO-4217 alpha codes.|
|test|false|boolean|Indicator of test mode in which auctions are not billable, where 0 = live mode, 1 = test mode|
|source|false|object|A Source object that provides data about the inventory source and which entity makes the final decision.|
|regs|false|object|A Regs object that specifies any industry, legal, or governmental regulations in force for this request.|
user|false|object|Contains GDPR consent if applicable.|
### Example
```javascript
{
    "id": "239a341e-d919-4a05-a2f1-b0dd22943882",
    "imp": [{
        "id": "301a387bd0aac8",
        "banner": {
            "w": 300,
            "h": 250,
            "format": [{
                "w": 300,
                "h": 250
            }]
        }],
    "site": {
        "publisher": {
            "id": "XNEdtxheGMSt"
        },
        "page": "https://www.example.com/article.htm",
        "name": "https://www.example.com"
    },
    "cur": ["USD"],
    "test": 0,
    "source": {
        "tid": "7b231fc6-bfd9-4d09-8cf0-392d8a953ab3"
    },
    "regs": {
        "ext": {
            "gdpr": 1
        }
    },
    "user": {
        "ext": {
            "consent": "BOpgyIWOpgyI5BIABCPLCs-AAAAsJr_7__7-_9_-_f__9uj3Or_v_f__30ccL59v_B_jv-_7fi_20jV4u_1vft9yfk1-7ctD3tp505iakivXmqdeb9v_nz3_9phP78k89r7337Ew-v83o8LzBAI"
        }
    }
}
```
 
## Bid Response Information
### Bid Example
```javascript
[{
    "id": "20191104_hc3t0daLl0e6zs3RcwQt",
    "impid": "301a387bd0aac8",
    "price": 3.9384033712732855,
    "adid": "3aZh9mMlUJkW57mUB4kN",
    "adm": "<iframe src=\"https://ams.creativecdn.com/imp-delivery?tkn=asLc4XObULbbdGV-XXJpHJqMfRo6hESgynrjzsANo2Xtc4N_cPGUoMLuTPfOMf53Mem7HhNS-xgjbYXvt1cP54yi2mvtcQd_FinGoAhPaYFjfhDC33pkTfXYT5VIJtkE-6w5JGEoVYdQP24609Xw2lj6-eJUoxod4qkOgjNE-m9aBXArGcS8Ej-eCrqN8Of2zysFAvfMXWdTUgNOUQhNqOObrAV5kAzBU5vXB_M3eoeb_-2sxXu2A1tmaIZsb9fUoDM--pejLBfTdSsEBCMw4RMWGwzdc_ShFGZta8TuzAXYgaD3Zc13UAnbclGUrZQyQTiIyzB9m98H6Q8uGFBfbTySLg4uqnA9TWVe6dcZdQQx_Upc78-f8oeLkQ8ovzPDWdcFYnaGNIoPvsoB6OxZ_w&amp;curl=https%3A%2F%2Fams.creativecdn.com%2Fclicks%3Fid%3D20191104_hc3t0daLl0e6zs3RcwQt%26t%3D1572884537914%26s%3Dxyz%26p%3D0fcgNmmYF48HK6fXZcma%26c%3DdH7Yk9plMI2QrA05L0TT%26tdc%3Dams%26%7BEXTRA_CLICK_PARAMS%7D&amp;lurl=%7BOFFER_URL%7D&amp;tdc=ams\" width=\"300\" height=\"250\" scrolling=\"no\" frameBorder=\"0\"></iframe><img src=\"https://ams.creativecdn.com/win-notify?tkn=asLc4XObULbbdGV-XXJpHJqMfRo6hESgynrjzsANo2Xtc4N_cPGUoMLuTPfOMf53Mem7HhNS-xgjbYXvt1cP54yi2mvtcQd_FinGoAhPaYFjfhDC33pkTfXYT5VIJtkE-6w5JGEoVYdQP24609Xw2lj6-eJUoxod4qkOgjNE-m9aBXArGcS8Ej-eCrqN8Of2zysFAvfMXWdTUgNOUQhNqOObrAV5kAzBU5vXB_M3eoeb_-2sxXu2A1tmaIZsb9fUoDM--pejLBfTdSsEBCMw4RMWGwzdc_ShFGZta8TuzAXYgaD3Zc13UAnbclGUrZQyQTiIyzB9m98H6Q8uGFBfbTySLg4uqnA9TWVe6dcZdQQx_Upc78-f8oeLkQ8ovzPDWdcFYnaGNIoPvsoB6OxZ_w&amp;tdc=ams&amp;wp=3.9384033712732855\" width=\"1\" height=\"1\" style=\"position:fixed;\">",
    "adomain": ["rtbhouse.com"],
    "cid": "dH7Yk9plMI2QrA05L0TT",
    "w": 300,
    "h": 250
}] 
```
### Pass Example
204 Status Code
 
## Configuration Information
### Configuration Keys
| Key | Required | Type | Description |
|---|---|---|---|
|region|true|string|region specific for a bidding to happen, values: ix-wrapper-[eu/us/sin] (Europe/USA/Singapore)|
|publisherId|true|string|publisher-specific key|
|bidfloor|false|number|minimal bid value, Dollars|
### Example
```javascript
{
    region: "ix-wrapper-eu",
    publisherId: "_TEST_ID", 
    bidfloor: 0.01
}
```

## Test Configuration
Set "test": 1 in bid request parameters to receive bid response with sample 300x250 creative.
```javascript
{"test": 1} 
```
