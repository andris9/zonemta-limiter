# zonemta-limiter

Limiter plugin for [ZoneMTA](https://github.com/zone-eu/zone-mta). Install this to avoid accidental messagebombs where the same sender is sending excessive mail to the same recipient.

## Setup

Add this as a dependency for your ZoneMTA app

```
npm install zonemta-limiter --save
```

Add a configuration entry in the "plugins" section of your ZoneMTA app

```json
...
  "plugins": {
    "modules/zonemta-limiter": {
        "enabled": "sender",
        "prefix": "zl:",
        "limit": 100,
        "windowSize": 1800,
        "debug": false
    }
  }
...
```

Where

*   _prefix_ is the prefix for redis keys
*   _limit_ is the allowed messages in a time window. After this limit is reached, messages are dropped until window opens again
*   _windowSize_ is the time window in seconds
*   _debug_ if true then does not drop messages, only logs errors

## License

European Union Public License 1.1 ([details](http://ec.europa.eu/idabc/eupl.html))
