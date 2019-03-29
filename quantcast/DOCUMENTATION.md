# Quantcast
## General Compatibility
| Feature           |     |
|-------------------|-----|
| Consent           | YES |
| Native Ad Support | NO  |
| SafeFrame Support | YES |
| PMP Support       | NO  |

## Browser Compatibility
| Browser              | Compatible |
|----------------------|------------|
| Chrome               | YES        |
| Edge                 | YES        |
| Firefox              | YES        |
| Internet Explorer 9  | NO         |
| Internet Explorer 10 | YES        |
| Internet Explorer 11 | YES        |
| Safari               | YES        |
| Mobile Chrome        | YES        |
| Mobile Safari        | YES        |
| UC Browser           | YES        |
| Samsung Internet     | YES        |
| Opera                | YES        |

## Adapter Information
| Info                                              |                |
|---------------------------------------------------|----------------|
| Partner Id                                        | QuantcastHtb   |
| Ad Server Responds in (Cents, Dollars, etc)       | Dollars        |
| Bid Type (Gross / Net)                            | Gross          |
| GAM Key (Open Market)                             | N/A            |
| GAM Key (Private Market)                          | N/A            |
| Ad Server URLs                                    | N/A            |
| Slot Mapping Sytle (Size / Multiple Sizes / Slot) | Multiple Sizes |
| Request Architecture (MRA / SRA)                  | MRA            |

## Currencies Supported
USD

## Adapter Information
### Configuration Keys
| Key         | Required | Type   | Description                                  |
|-------------|----------|--------|----------------------------------------------|
| publisherId | Required | String | Quantcast provided publisher ID              |
| bidFloor    | Optional | Number | Default bid floor                            |
| adPos       | Optional | Number | Default ad position                          |
| battr       | Optional | Array  | Default array of blocked creative attributes |

## Slot Information
### Configuration Keys
| Key      | Required | Type   | Description                                        |
|----------|----------|--------|----------------------------------------------------|
| bidFloor | Optional | Number | Bid floor for this slot                            |
| adPos    | Optional | Number | Ad position for this slot                          |
| battr    | Optional | Array  | Array of blocked creative attributes for this slot |
| sizes    | Optional | Array  | Array of different sizes for this slot             |
