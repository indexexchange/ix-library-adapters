# bRealTime
## General Compatibility
|Feature|  |
|---|---|
| Consent | Yes |
| Native Ad Support | No  |
| SafeFrame Support | Yes  |
| PMP Support | Yes |

## Browser Compatibility
| Browser |  |
|--- |---|
| Chrome | Yes  |
| Edge | Yes  |
| Firefox | Yes  |
| Internet Explorer 9 | Yes  |
| Internet Explorer 10 | Yes  |
| Internet Explorer 11 | Yes  |
| Safari | Yes  |
| Mobile Chrome | Yes |
| Mobile Safari | Yes |
| UC Browser | Yes |
| Samsung Internet | Yes |
| Opera | Yes |

## Adapter Information
| Info | |
|---|---|
| Partner Id | EmxDigitalHtb |
| Ad Server Responds in (Cents, Dollars, etc) | Dollars |
| Bid Type (Gross / Net) | Net |
| GAM Key (Open Market) | ix_emx_cpm |
| GAM Key (Private Market) | ix_emx_cpm |
| Ad Server URLs | emxdgt.com |
| Slot Mapping Sytle (Size / Multiple Sizes / Slot) | Slot |
| Request Architecture (MRA / SRA) | SRA |

## Currencies Supported
USD

## Bid Request Information
### Parameters
| Key | Required | Type | Description |
|---|---|---|---|
| tagid | Yes | string | id per slot  |
| bidfloor | No | string | floor cpm per slot |

### Example
```javascript
{"id":"XgLyyMjK","imp":[{"banner":{"format":[{"w":728,"h":90}],"w":728,"h":90},"tagid":"25692","secure":1,"id":"_hYEyH1vM"}],"site":{"domain":"www.cnn.com","page":"http://www.cnn.com/somearticlecategory/somearticlepage.html"}}
```

## Bid Response Information
### Bid Example
```javascript
{"id":"XgLyyMjK","seatbid":[{"bid":[{"adm":"this is an ad!","id":"_hYEyH1vM","ttl":300,"crid":"41975016","w":728,"price":11.3645,"adid":"41975016","h":90}],"seat":"1356"}]}
```
### Pass Example
```javascript

```

## Configuration Information
### Configuration Keys
| Key | Required | Type | Description |
|---|---|---|---|
| | | | |
### Example
```javascript

```