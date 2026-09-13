# CKD QPR – Plant, Sales Order and Invoice Business Rules

## 1. Overall Entity Relationship

```text
Plant
  │
  └── 1 : Many ──→ Departments
                       │
                       └── 1 : Many ──→ Employees
```
1. A Plant can have multiple Departments.
2. Each Department belongs to one Plant.
3. A Department can have multiple Employees.
4. Each Employee belongs to one Department.

```text
Plant
  │
  └── 1 : Many ──→ Sales Orders
                       │
                       └── 1 : Many ──→ Sales Order Items
                                            │
                                            └── Many : 1 ──→ Model Family
```


1. Each Sales Order belongs to one Plant.
2. A Sales Order can contain multiple Sales Order Items.
3. Each Sales Order Item belongs to one Sales Order.
4. A Model Family can be associated with multiple Sales Order Items.
5. Each Sales Order Item is associated with one Model Family.

```text

Sales Order
  │
  └── 1 : 1 ──→ Invoice

  ```