```mermaid
erDiagram
  users ||--o{ bookings : ""
  venues ||--o{ bookings : ""
  users ||--o{ reviews : ""
  bookings ||--o| reviews : ""

  users {
    serial id PK
    varchar login UK
    text password_hash
    varchar full_name
    varchar phone
    varchar email
  }

  venues {
    serial id PK
    varchar name
    varchar type
    int capacity
  }

  bookings {
    serial id PK
    int user_id FK
    int venue_id FK
    timestamptz banquet_date
    varchar payment_method
    varchar status
  }

  reviews {
    serial id PK
    int user_id FK
    int booking_id FK
    text text
    smallint rating
  }
```
