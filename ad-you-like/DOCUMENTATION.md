# AdYouLike

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
| Internet Explorer 9 | Yes |
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
| Partner Id | AdYouLikeHtb |
| Ad Server Responds in | Dollars |
| Slot Mapping Style | Slot |
| Request Architecture (MRA / SRA) | SRA |
 
## Currencies Supported
 USD
 
## Configuration Information
### Configuration Keys
| Key | Required | Type | Description |
|---|---|---|---|
| placementId | Yes | String | Identifier for this ad placement in AdYouLike's platform |
| size | Yes | Int[][] | Compatible size list for current placement |
### Example
```javascript
{	 
	"placementId":"<yourPlacementId>",
	"sizes": [[300,250]]
}
```

## Test Configuration
(Test configuration or methodology that can be used to retrieve & render a test creative from AdYouLike's platform)
```javascript
 
{	 
  "placementId":"c1be58c5b3ced5f984a8a0b82b24dddf",
  "sizes": [[300,250]]
}
  
```
