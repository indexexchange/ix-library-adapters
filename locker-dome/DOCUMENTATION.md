# LockerDome
## General Compatibility
|Feature|  |
|---|---|
| Consent | Yes |
| Native Ad Support | No |
| SafeFrame Support | Yes  |
| PMP Support | No |

## Browser Compatibility
| Browser |  |
|--- |---|
| Chrome | Yes  |
| Edge | Yes |
| Firefox | Yes |
| Internet Explorer 9 | No |
| Internet Explorer 10 | Yes |
| Internet Explorer 11 | Yes |
| Safari | Yes  |
| Mobile Chrome | Yes |
| Mobile Safari | Yes |
| UC Browser | Yes |
| Samsung Internet | Yes |
| Opera | Yes |

## Adapter Information
| Info | |
|---|---|
| Partner Id | LockerDomeHtb |
| Ad Server Responds in (Cents, Dollars, etc) | Dollars |
| Bid Type (Gross / Net) | Net |
| GAM Key (Open Market) | ix_lkdm_cpm |
| GAM Key (Private Market) | ix_lkdm_cpm |
| Ad Server URLs | https://lockerdome.com/ladbid/indexexchange |
| Slot Mapping Style (Size / Multiple Sizes / Slot) | Slot |
| Request Architecture (MRA / SRA) | FSRA |

## Currencies Supported

USD

## Bid Request Information
### Parameters
| Key | Required | Type | Description |
|---|---|---|---|
| bidRequests | Yes | object | An array of objects representing bid requests, each containing the associated `adUnitId` and `requestId` |
| gdpr | No | object | An object noting whether GDPR applies (`applies` key) and the consent string (`consent` key) |
| url | No | string | The URL of the current page |
| referrer | No | string | The current page's referrer |

### Example
```javascript
{"url":"https://localhost:5838/public/debugger/adapter-debugger.html","referrer":"https://localhost:5838/public/debugger/adapter-debugger.html","gdpr":{"applies":true,"consent":"TEST_GDPR_CONSENT_STRING"},"bidRequests":[{"adUnitId":"10809467961050726","requestId":"_hK5vIC5I"}]}

```

## Bid Response Information
### Bid Example
```javascript
{"bids":[{"requestId":"_hK5vIC5I","cpm":1,"width":300,"height":250,"creativeId":"10809467961050726","currency":"USD","ad":"<html><body style=\"margin:0px;\"><iframe scrolling=\"no\" frameBorder=\"0\" seamless width=\"300\" height=\"250\" style=\"width: 300px; height: 250px\" src=\"https://lockerdome.com/ladrender/10809467961050726?imp=Plr%2B7pHP%2B1YVw6ODoIN1FPCKvtVvXlos8kRzCJaMKJa9B%2F8fk6KndwjK%2BKX8mz4v%2FR0Q7v9rE7bQGva0rUKgAvEAWRmO%2B3gV57RcNOI6CiB6PmRCzhb1IkojMJ5SmzI53RCQZo%2FVl39E9Ig7tHPZLMO0taRaVtAxwjwuQrZzs779Zrg92MBh0RZ1yzT08Qy1t5sfr3fWyyXpYomLcWNC9Drh7NgDdp77IG4utcKlAjFvrnDRsOIQKFFn%2FhqPgQjH5PSFPYyXAtNtWUxM1pJKugdZi0iCkssaNV72zdAAYn2yyVA3tg35AFJp5LUsKnWqXz6RJV4wC66jM43KgseYoGStV5x6yY%2BDuvKN8p62plf%2BOnceMU0HNJgPPhyWqzBtci3qmy5BkvWuebzqjK9hp45pKPV%2Bxj0ou2GreTuT1b7wuB6cdiJ%2BrNC2n9464xKrUe09AvmM1EY1qJ88NP91IZI1UcKcG7dKzQoihfXS8m%2B2zcIdLoCnIz%2BbfRzA2KnNloIR0IhLI1NMTjsZ7eMkkSRxboL42pgIIUThQXIk4Xk3YaFDv%2FtWnEKQlNetVZCN4SNFa%2Bwjuu0UnYM3XiZyViHm5RCkfiXqPV3vCP6fk5nTGI2n2aUJYn8KSl8UH5ePM86%2FugIhVBzYi%2FZkQlXVZ%2Fl3HJZ33zRDLWsxAEnWS4TGtwZ8D%2BAbtwch4AjpSOQgsaxU5Gj3blDq28iQiFNiXknUFun8U%2B%2FcLM829qqE3CSl%2FednnrT8I%2FmW%2BH1pUwwUuEBZeZRr0jpgViA0%2B79sYvo4XAYoQRYrZeqg0E2v7f7eyrrSwSCmiUHuTP6f9mjbmnIEazn5wyNyypWqnFSQALY9pS9pHBzIXt0V5rP1Vh5AYem2eriVDyLaFZ15EQak33NOQbW1pQhgzkw844HHd9t%2BR4NUAleLOI5xJHoSEFEeDBCAmNDHCSocu3jkmy7c4jqQ0PLRC%2FPcYnXMugXZjcSp9tuCZvBmwussN%2FIhmB5HN7kbRa57IskzjzqY9M48EiAqRPfejTVof6LubXHHnx2aARt62w55yBps5HYewGuuNAPhK4tMMPuELsNkjs3T\"></iframe></body></html>","netRevenue":true,"ttl":60}]}
```
### Pass Example
```javascript
{
    bids: []
}
```

## Configuration Information
### Configuration Keys
| Key | Required | Type | Description |
|---|---|---|---|
| adUnitId  | Yes | String | Identifier for the LockerDome ad unit |
### Example
```javascript
{
    "adUnitId": "11154591702270566"
}
```
