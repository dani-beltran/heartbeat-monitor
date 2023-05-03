# be-tech-test (1.0.0)



## GET /metrics
(internal) Get current process metrics


### Responses
#### Status: 200
Prometheus metrics in text-based format
- contentType: text/plain
- body: {}


## GET /
List of app groups. The number of app instances of each group will only consider the active app instances (the ones that have sent a heartbeat recently).


### Query Params
- limit: number
  - default: 1000


### Responses
#### Status: 200
- contentType: application/json
- body: array
  - items: object
    - group: string
    - instances: number
    - createdAt: string
      - format: date-time
    - updatedAt: string
      - format: date-time


## GET /{group}
List of active app instances within a group, being actives the ones that have sent a heartbeat recently


### Query Params
- limit: number
  - default: 1000


### Body Params
- group: string


### Responses
#### Status: 200
- contentType: application/json
- body: array
  - items: object
    - id: string
    - group: string
    - createdAt: string
      - format: date-time
    - updatedAt: string
      - format: date-time
    - meta: object


## POST /{group}/{id}
Register an app instance in a group. If the app instance is already registered, it will be updated.


### Body Params
- meta: object
- id: string
  - format: uuid
- group: string


### Responses
#### Status: 200
- contentType: application/json
- body: object
  - id: string
  - group: string
  - createdAt: string
    - format: date-time
  - updatedAt: string
    - format: date-time
  - meta: object


## DELETE /{group}/{id}
Unregister an app instance from a group.


### Body Params
- id: string
  - format: uuid
- group: string


### Responses
#### Status: 200
- contentType: application/json
- body: {}