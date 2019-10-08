# Martin
## General Compatibility
|Feature|  |
|---|---|
| Consent | No |
| Native Ad Support | No |
| SafeFrame Support | No |
| PMP Support | Yes |
 
## Browser Compatibility
| Browser |  |
|--- |---|
| Chrome | Yes |
| Edge | Yes |
| Firefox | Yes |
| Internet Explorer 9 |  |
| Internet Explorer 10 |  |
| Internet Explorer 11 |  |
| Safari |  |
| Mobile Chrome | |
| Mobile Safari | |
| UC Browser | |
| Samsung Internet | |
| Opera | |
 
## Adapter Information
| Info | |
|---|---|
| Partner Id | MartinHtb |
| Ad Server Responds in (Cents, Dollars, etc) | Dollars |
| Bid Type (Gross / Net) | Net |
| GAM Key (Open Market) | ix_mar_cpm |
| GAM Key (Private Market) | ix_mar_cpm |
| Ad Server URLs | https://east.martin.ai/bid/index, https://west.martin.ai/bid/index |
| Slot Mapping Style (Size / Multiple Sizes / Slot) | Slot |
| Request Architecture (MRA / SRA) | MRA |
 
## Currencies Supported
 
## Bid Request Information
### Parameters
| Key | Required | Type | Description |
|---|---|---|---|
|id|Yes|String| Identifier |
|cur|No|String[]| Default Value USD (Hardcoded) |
|imp|Yes|Object| An OpenRTB impression object  |
|site|No|Object| An OpenRTB site object with information about site and publisher |
|device|Yes|Object| An OpenRTB device object with information about device capabilities and geo |
|user|No|Object| An OpenRTB user object |
 
### Example
```javascript
 {
 	"id": "123",
 	"at": 1,
 	"cur": ["USD"],
 	"imp": [{
 		"id": "456",
 		"banner": {
 			"w": 300,
 			"h": 250,
 			"format": [{
 				"w": 300,
 				"h": 250
 			}]
 		}
 	}],
 	"site": {
 		"page": "http://example.com/example.html",
 		"ref": "http://example.com/example.html",
 		"publisher": {
 			"id": "123"
 		},
 		"domain": "example.com"
 	},
 	"device": {
 		"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.87 Safari/537.36",
 		"js": 1,
 		"dnt": 0,
 		"h": 900,
 		"w": 1440,
 		"language": "en-US",
 		"geo": {
       "lat": 12.34,
			 "lon": 56.78,
			 "country": "USA",
			 "region": "OH",
			 "zip": "45202"
     }
 	},
 	"user": {
 	}
 }
```
 
## Bid Response Information
### Bid Example
```javascript
 {
	"id": "123",
	"cur": "USD",
	"seatbid": [{
		"bid": [{
			"id": "456",
			"impid": "789",
			"adm": "<a href=\"https://martin.ai\"><img id=\"123\" src=\"https://martin.ai\"></a>",
			"price": 3.00,
			"w": 300,
			"h": 250
		}]
	}]
}
```
### Pass Example
`HTTP Status 204 (No Content)`
 
## Configuration Information
### Configuration Keys
| Key | Required | Type | Description |
|---|---|---|---|
|publisherId|Yes|string|Publisher ID|
|lat|No|string|latitude|
|lon|No|string|longitude|
|country|No|string|3 letter country code using ISO-3166-1-alpha-3|
|region|No|string|2 letter region code using ISO-3166-2|
|zip|No|string|Zip or postal code|
### Example
```javascript
 
```

## Test Configuration
(Test configuration or methodology that can be used to retrieve & render a test creative from Martin's platform)
```javascript
 {
        "publisherId": "156209",
        "lat": "40.712775",
				"lon": "-74.005973",
				"country": "USA",
				"region": "OH",
				"zip": "45202"
      }
```
