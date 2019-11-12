# AppNexus
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
| Partner Id | AppNexusHtb |
| Ad Server Responds in (Cents, Dollars, etc) | Dollars |
| Bid Type (Gross / Net) | Net |
| GAM Key (Open Market) | ix_apnx_om |
| GAM Key (Private Market) | ix_apnx_dealid |
| Ad Server URLs | ib.adnxs.com/ut/v3/prebid |
| Slot Mapping Style (Size / Multiple Sizes / Slot) | slot |
| Request Architecture (MRA / SRA) | SRA |
 
## Currencies Supported
 
## Bid Request Information
### Parameters
| Key | Required | Type | Description |
|---|---|---|---|
| sdk | true | Object | Contains version information on adapter |
| hb_source | true | Number | Identifies type of source making the header bid request; has to be 2 |
| referrer_detection | true | Object | Contains referrer values of the current page |
| tags | true | Object[] | Contains information about the requested placement |
| gdpr_consent | false | Object | Contains consent related information on user |
 
### Example
```javascript
{
  "sdk":{
    "version":"2.4.0"
  },
  "hb_source":2,
  "referrer_detection":{
    "rd_ifs":null,
    "rd_ref":"http%3A%2F%2Ftest.mysite.com%2Fpage",
    "rd_stk":"http%3A%2F%2Ftest.mysite.com%2Fpage",
    "rd_top":null
  },
  "tags":[{
    "ad_types":["banner"],
    "allow_smaller_sizes":false,
    "disable_psa":true,
    "id":15901268,
    "prebid": true,
    "primary_size":{
      "width":300,
      "height":250
    },
    "sizes":[{
      "width":300,
      "height":250
    },{
      "width":300,
      "height":600
    }],
    "use_pmt_rule":false,
    "uuid":"17qp84z7oQh8Jb",
    "keywords":[{
      "key":"music",
      "value":["classical","piano"]
    }]
  }],
  "gdpr_consent":{
    "consent_required":false,
    "consent_string":""
  }
}
```
 
## Bid Response Information
### Bid Example
```javascript
{
  "version":"3.0.0",
  "tags":[{
    "uuid":"FuChJH7uQfH27U",
    "tag_id":15901268,
    "auction_id":"9174316675967095506",
    "nobid":false,
    "no_ad_url":"https://no-adurl.com/here",
    "timeout_ms":0,
    "ad_profile_id":1182765,
    "rtb_video_fallback":false,
    "ads":[{
      "content_source":"rtb",
      "ad_type":"banner",
      "buyer_member_id":9325,
      "advertiser_id":2605453,
      "creative_id":100232340,
      "media_type_id":1,
      "media_subtype_id":1,
      "cpm":2.000000,
      "cpm_publisher_currency":2.000000,
      "is_bin_price_applied":false,
      "publisher_currency_code":"$",
      "brand_category_id":0,
      "client_initiated_ad_counting":true,
      "rtb":{
        "banner":{
          "content":"<div>creative code here</div>",
          "width":300,
          "height":250
        },
        "trackers":[{
          "impression_urls":["http://imp.trackingUrl.com/here"],
          "video_events":{}
        }]
      }
    }]
  }]
}

```
### Pass Example
```javascript
{
  "version":"3.0.0",
  "tags":[{
    "uuid":"Po1q0qT7WHkFF3",
    "tag_id":15901268,
    "auction_id":"1509876687615451168",
    "nobid":true,
    "ad_profile_id":1182765
  }]
}
```
 
## Configuration Information
### Configuration Keys
| Key | Required | Type | Description |
|---|---|---|---|
| placmentId | true | String | ID value of the AppNexus placement |
| sizes | true | Array of 2 element arrays | List of all corresponding ad sizes for this slot |
| keywords | false | map of keynames and keyvalue arrays | map of keyword related data; a keyname can have mulitple keyvalues |
| allowSmallerSizes | false | Boolean | If enabled, ads smaller than the values in your `sizes` array will be allowed to serve.  Defaults to false |
| usePaymentRule | false | Boolean | If enabled, AppNeuxs will return net price after publisher payment rules have been applied.  Defaults to false |

### Example
```javascript
{
  "placementId": "15894224",
  "sizes": [[300, 250], [300, 600], [300, 300]],
  "keywords": {
    "music": ["rock", "jazz"]
  },
  "allowSmallerSizes": true,
  "usePaymentRule": false
}
```