# CKD QPR Business Rules

## 1. Overall Entity Relationship

## Entity Relationship

```text
Model Group
     │
     └── 1 : Many ──→ Model Families
                          │
                          └── 1 : Many ──→ HU Containers
                                               │
                                               └── 1 : Many ──→ Parts
```

1. A Model Group can have multiple Model Families.
2. Each Model Family belongs to one Model Group.
3. A Model Family can have multiple HU Containers.
4. Each HU Container belongs to one Model Family.
5. A HU Container can contain multiple Parts.
6. Each Part belongs to one HU Container.


## 2. HU Container

### Entity Relationship 

```text

Model Family
     │
     └── 1 : Many ──→ HU Containers
                          │
                          └── 1 : Many ──→ Parts
```

1. A Model Family can have multiple HU Containers.

2. Each HU Container represents one commodity/system.

3. A HU Container contains the parts associated with that particular commodity/system.

4. A Part has a quantity representing the quantity required
   for the assembly of that commodity.

5. A HU Container belongs to one Model Family.

## Example

Model Family: Classic 350

HU-1001
Commodity: Engine System

Parts:
- Cylinder Head Assembly - 1
- Crankcase Assembly - 1
- Piston Assembly - 1
- Connecting Rod - 1
- Engine Gasket Set - 1