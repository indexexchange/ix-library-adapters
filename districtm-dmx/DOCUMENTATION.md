# DistrictmDmx
## General Compatibility
|Feature|  |
|---|---|
| Consent | yes |
| Native Ad Support | yes |
| SafeFrame Support | no |
| PMP Support | no |
 
## Browser Compatibility
| Browser |  |
|--- |---|
| Chrome | x |
| Edge | x |
| Firefox | x |
| Internet Explorer 9 | x |
| Internet Explorer 10 | x |
| Internet Explorer 11 | x |
| Safari | x |
| Mobile Chrome | x |
| Mobile Safari | x |
| UC Browser | x |
| Samsung Internet | x |
| Opera | x |
 
## Adapter Information
| Info | |
|---|---|
| Partner Id | DistrictmDmxHtb |
| Ad Server Responds in (Cents, Dollars, etc) | Dollars|
| Bid Type (Gross / Net) | net |
| GAM Key (Open Market) | ix_dis_cpm |
| GAM Key (Private Market) | ix_dis_cpm |
| Ad Server URLs | |
| Slot Mapping Style (Size / Multiple Sizes / Slot) | Multiple Sizes |
| Request Architecture (MRA / SRA) | SRA |
 
## Currencies Supported
```text

USD only

```

 
## Bid Request Information
### Parameters
| Key | Required | Type | Description |
|---|---|---|---|
|dmxid |yes |string| naming for placement|
|memberid|yes|string|Publisher ID|
|sizes|yes|array|placement size |

### Endpoint URL

```text
https://dmx.districtm.io/b/v1
```
 
### Example
```javascript
 {
    "id":"TDeLqaJAvWsjEImH",
    "cur":["USD"],
    "tmax":1000,
    "site":
        {
        "publisher":
            {
                "id":"100156"
            }
        },
    "imp":[
        {
            "id":"hZYs5ZmtDDOqwVJz",
            "tagid":"264543",
            "secure":1,
            "banner":
            {
                "topframe":1,
                "w":300,
                "h":250,
                "format":
                [
                    {
                        "w":300,"h":250
                    }
                    ]
            }
            }]
}
```
 
## Bid Response Information
### Bid Example
```javascript
 {
    "id":"TDeLqaJAvWsjEImH",
    "seatbid":
    [
        {
            "bid":
            [
                {
                    "adm":"[ADS]",
                    "id":"76-c77b6dff_1MbO47n7DfACFNG4QMXcCwthW1E-1",
                    "impid":"hZYs5ZmtDDOqwVJz",
                    "price":0.3657,
                    "adomain":["steve.com","steve.org"],
                    "crid":"76_15574"}],"seat":"10000"}]}

```
### Pass Example
```javascript
 
```
 
## Configuration Information
### Configuration Keys
| Key | Required | Type | Description |
|---|---|---|---|
|dmxid |yes |string| naming for placement|
|memberid|yes|string|Publisher ID|
|sizes|yes|array|placement size |

