# PubMatic
## General Compatibility
|Feature|  |
| Consent | Yes |
| Native Ad Support | Yes |
| SafeFrame Support | Yes |
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
| Safari | Yes |
| Mobile Chrome | Yes |
| Mobile Safari | Yes |
| UC Browser | |
| Samsung Internet | |
| Opera | |
 
## Adapter Information
| Info | |
|---|---|
| Partner Id | PubMaticHtb |
| Ad Server Responds in (Cents, Dollars, etc) | Dollars |
| Bid Type (Gross / Net) | Net |
| GAM Key (Open Market) | |
| GAM Key (Private Market) | |
| Ad Server URLs | https://hbopenbid.pubmatic.com/translator? |
| Slot Mapping Style (Size / Multiple Sizes / Slot) |  |
| Request Architecture (MRA / SRA) | SRA |
 
## Currencies Supported
 USD
 
## Bid Request Information
### Parameters
| Key | Required | Type | Description |
|id|Yes|String| Identifier |
|at|Yes|Integer| Value passed 1 |
|cur|No|String[]| Value passed USD |
|imp|Yes|Object| ortb request contains information of slots and impressions |
|site|No|Object| object contains information of page,publisher,ref and domain |
|device|Yes|Object| object contains information of browser, w,h of device,DONOTTRACK flag,language and geo |
|user|No|Object| object contains information of gender, yob, userIds |
|ext|No|Object| object contains information of wrapper profile and version info |
 
### Example
```javascript
 {
 	"id": "1564573643412",
 	"at": 1,
 	"cur": ["USD"],
 	"imp": [{
 		"id": "51c2a4cbb621a3",
 		"tagid": "Div1",
 		"secure": 0,
 		"ext": {},
 		"bidfloorcur": "USD",
 		"banner": {
 			"pos": 0,
 			"w": 728,
 			"h": 90,
 			"topframe": 1,
 			"format": [{
 				"w": 300,
 				"h": 250
 			}, {
 				"w": 160,
 				"h": 600
 			}]
 		}
 	}, {
 		"id": "6e546349bfaf43",
 		"tagid": "Div2",
 		"secure": 0,
 		"ext": {},
 		"bidfloorcur": "USD",
 		"banner": {
 			"pos": 0,
 			"w": 300,
 			"h": 250,
 			"topframe": 1,
 			"format": [{
 				"w": 728,
 				"h": 90
 			}, {
 				"w": 160,
 				"h": 600
 			}]
 		}
 	}, {
 		"id": "79cb09ecbb934c",
 		"tagid": "Div3",
 		"secure": 0,
 		"ext": {},
 		"bidfloorcur": "USD",
 		"banner": {
 			"pos": 0,
 			"w": 160,
 			"h": 600,
 			"topframe": 1,
 			"format": [{
 				"w": 300,
 				"h": 250
 			}, {
 				"w": 728,
 				"h": 90
 			}]
 		}
 	}],
 	"site": {
 		"page": "http://example.com/example.html",
 		"ref": "http://example.com/example.html",
 		"publisher": {
 			"id": "5890"
 		},
 		"domain": "example.com"
 	},
 	"device": {
 		"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.87 Safari/537.36",
 		"js": 1,
 		"dnt": 0,
 		"h": 900,
 		"w": 1440,
 		"language": "en-GB",
 		"geo": {}
 	},
 	"user": {
 		"geo": {}
 	},
 	"ext": {
 		"wrapper": {
 			"profile": 1967,
 			"version": 1,
 			"wiid": "d4d8fbb0-c284-4b41-b515-5077b8af2e2b-ufeed",
 			"wv": "prebid_prebid_2.8.0",
 			"transactionId": "a7e544a8-db2b-48a4-bfd3-31f5eb1fcf45",
 			"wp": "pbjs"
 		}
 	}
 }
```
 
## Bid Response Information
### Bid Example
```javascript
 {
	"id": "1564573643412",
	"cur": "USD",
	"seatbid": [{
		"bid": [{
			"id": "51c2a4cbb621a3",
			"impid": "51c2a4cbb621a3",
			"adm": "<span class=\"PubAPIAd\"></span><img alt='here is your ad' src=\"https://via.placeholder.com/728x90.png\"></img>\"",
			"price": 9.309814626996301,
			"w": 728,
			"h": 90,
			"cid": "test1",
			"crid": "test2"
		}, {
			"id": "6e546349bfaf43",
			"impid": "6e546349bfaf43",
			"adm": "<span class=\"PubAPIAd\"></span><img alt='here is your ad' src=\"https://via.placeholder.com/300x250.png\"></img>\"",
			"price": 8.32536578204677,
			"w": 300,
			"h": 250,
			"cid": "test1",
			"crid": "test2"
		}, {
			"id": "79cb09ecbb934c",
			"impid": "79cb09ecbb934c",
			"adm": "<span class=\"PubAPIAd\"></span><img alt='here is your ad' src=\"https://via.placeholder.com/160x600.png\"></img>\"",
			"price": 10.376773877046142,
			"w": 160,
			"h": 600,
			"cid": "test1",
			"crid": "test2"
		}]
	}]
}
```
### Pass Example
```javascript
 
```
 
## Configuration Information
### Configuration Keys
| Key | Required | Type | Description |
|publisherId|Yes|string|Publisher ID|
|adSlot|No|string | adSlot Information|
|pmzoneid|No|string|Comma separated zone ids|
|lat|No|string|latitude|
|lon|No|string|longitude|
|yob|No|string|Year of Birth|
|gender|No|string|Gender Information|
|kadfloor|No|string|Kad Floor value for bid|
### Example
```javascript
 {
        publisherId: '156209',      
        adSlot: 'pubmatic_test2',   
        pmzoneid: 'zone1, zone11',  
        lat: '40.712775',           
        lon: '-74.005973',          
        yob: '1982',                
        kadpageurl: 'www.test.com', 							
        gender: 'M',                
        kadfloor: '0.50',           
      }
```