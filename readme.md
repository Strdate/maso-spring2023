# MaSo 2023

Game available at <https://maso2023.herokuapp.com/> (czech only).

## Development setup

If you are new to Node.js development here is [detailed setup](./docs/linux-setup.md).

### Prerequisites

- install Node.js release 14.20.1 (<https://nodejs.org/en/>)

- install meteor

```bash
Linux:
curl https://install.meteor.com/ | sh

Windows:
npm install -g meteor
```

### Setup

Clone repository

```bash
git clone https://gitea.ks.matfyz.cz/MaSo/maso-solid.git
```

Install packages

```bash
meteor npm install
```

Run automatically reloaded development server (Services like postgres, redis, ...
are run in a docker container automatically, but you might run into port collision problems.)

```bash
meteor
```

## APIs

Authentication

```bash
/api/login

Provide 'username' and 'password' as x-www-form-urlencoded

Returns
{
    "status": "success",
    "data": {
        "authToken": "...",
        "userId": "..."
    }
}
```

You need to provide each subsequent request with these headers

```bash
X-Auth-Token
X-User-Id
```

### Results

```bash
GET /api/games/:gameCode/results

Returns

[
    {
        "place": 1,
        "solvedTasksCount": 42,
        "stampsCount": 15,
        "money": 100,
        "_id": "W2TKMD7y4rLxtyEBN",
        "name": "Zelí",
        "number": 5,
        "isBot": false,
        "collectionsCount": 5,
        "score": {
            "stamps": 135,
            "bonus": 268,
            "tasks": 126,
            "total": 529
        }
    },
]
```

Relevant information are place, number (team number), solvedTasksCount, bestCardName, score.total

### Team import

```bash
POST /api/games/:gameCode/teams

Body:
[
    {
        number: 123,
        externalId: "abc",
        naeme: "foo"
    }
]

```

## Contributing

We're preparing this project to be contributor friendly. Unfortunately it's not the case yet,
but if you're interested already, please ping us at maso@mff.cuni.cz. You don't
even have to be a developer, we seek all people interested in math and additional ways of
educating children.