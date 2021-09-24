# Bitcoin bot

## Usage:

1.  clone the repository

2.       npm install

3.  create a config.env file from the tamplate './config/TMP.config.env'

4.  create your API keys on the coinbase pro, do not forget to set API key priviliges to trade

5.  put your API keys to the config.env file

6.  edit this file './config/job.json' to change bot options (default behaviour is: buy BTC for 10 EUR in 5 am morning every Monday, Wednesday and Friday)

7.       npm start

## Job settings:

       [
           {
                "minute": "0",
                "hour": "5",
                "dayOfMonth": "*",
                "month": "*",
                "dayOfWeek": "1,3,5",
                "orderData": {
                    "funds": "10",
                    "type": "market",
                    "side": "buy",
                    "product_id": "BTC-EUR"
                }
                "id":"1"
            }
        ]

For orderData specification visit https://docs.pro.coinbase.com/#place-a-new-order

## Cron Syntax

This is a quick reference to cron syntax and also shows the options supported by node-cron.

### Allowed fields

```
 # ┌────────────── second (optional)
 # │ ┌──────────── minute
 # │ │ ┌────────── hour
 # │ │ │ ┌──────── day of month
 # │ │ │ │ ┌────── month
 # │ │ │ │ │ ┌──── day of week
 # │ │ │ │ │ │
 # │ │ │ │ │ │
 # * * * * * *
```

### Allowed values

| field        | value                             |
| ------------ | --------------------------------- |
| second       | 0-59                              |
| minute       | 0-59                              |
| hour         | 0-23                              |
| day of month | 1-31                              |
| month        | 1-12 (or names)                   |
| day of week  | 0-7 (or names, 0 or 7 are sunday) |

#### Using multiples values

You may use multiples values separated by comma:
