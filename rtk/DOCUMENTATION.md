# Rtk
## General Compatibility
|Feature|  |
|---|---|
| Consent | Yes |
| Native Ad Support | No |
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
| Partner Id | RtkHtb |
| Ad Server Responds in (Cents, Dollars, etc) | hundreds of a cent |
| Bid Type (Gross / Net) | Net |
| GAM Key (Open Market) | `ix_rtk_cpm` |
| GAM Key (Private Market) | `ix_rtk_dealid` |
| Ad Server URLs | `bidder.rtk.io` |
| Slot Mapping Style (Size / Multiple Sizes / Slot) | slot |
| Request Architecture (MRA / SRA) | SRA |
 
## Currencies Supported

- Dollars 
 
## Bid Request Information
### Parameters
| Key | Required | Type | Description |
|---|---|---|---|
| `ai` | yes | string | The rtk auction ID |
| `sc` | yes | string | The rtk shortcode | 
| `categories` | no |  array | Deal ID Categories |
 
### Example
```javascript
https://bidder.rtk.io/0000/1234/aardvark?1234=1234&jsonp=false&rtkreferer=http%3A%2F%2Flocalhost%3A5837%2Fpublic%2Fdebugger%2Fadapter-debugger.html&categories=sport&gdpr=true&consent=TEST_GDPR_CONSENT_STRING&w=875&h=497
```
 
## Bid Response Information
### Bid Example
```javascript
[
    {
        "ex": "demo_exchange", 
        "width": 300, 
        "cpm": 1.0, 
        "cid": "1234", 
        "media": "banner", 
        "adm": "<html>.....</html>", 
        "id": "1234", 
        "height": 250
    }
]
```
### Pass Example
```javascript
200 OK 
```
 
## Configuration Information
### Configuration Keys
| Key | Required | Type | Description |
|---|---|---|---|
| `ai` | yes | string | The rtk auction ID |
| `sc` | yes | string | The rtk shortcode | 
| `categories` | no |  array | Deal ID Categories |
| `host` | no | string | custom ALIAS for the bidder hostname | 

### Example
```javascript
{
    "ai": "0000",
    "sc": "1234",
    "categories": ["sport"],
    "host": "somealias.com"
}
```
