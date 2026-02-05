# Product Backlog

See see [Notes & Definitions](#notes--definitions) for information on how to understand and use this document.

Please find log of [Key Decisions](#key-decisions) and [Current Blockers](#current-blockers) at the bottom of the document.

## Prioritised Backlog

Items are ordered by priority. Higher items should be worked on first.

### **F-006:** Basic table state machine and CRUD actions

- **Priority:** High
- **Estimate:** Medium
- **Technical Feature:**
  - In the `Table` class:
    - Implement state machine to reflect table state

    - Implement function to sync table (with `TableRequirement` as declaration) in AWS

    - Implement mechanism to poll AWS for table information - possibly using worker thread

### **F-004:** Implement entity modelling

- **Priority:** High
- **Estimate:** Simple
- **Technical Feature:**
  - Implement an identity function to define a schema for any entity, given `Table` class as input
    - The table class will determine the mandatory and non-madatory keys

    - The table class will determine what table to act on when CRUDQ operations are performed

### **F-005:** Implement entity CRUDQ operations

- **Priority:** High
- **Estimate:** Simple
- **Technical Feature:**
  - Implement the ability to **insert** an entity in the table
    - Return complete representation of the inserted item

  - Implement the ability to **delete** an entity from the table given the necessary keys
    - Return null to indicate deletion

  - Implement the ability to **update** an item given the necessary keys
    - Return complete representation of the updated item

  - Implement the ability to **read** an item given the necessary keys
    - Return complete representation of the item

  - Implement the ability to make **_basic_ queries**
    - Return complete representation of items that fit the query as an array type

## Icebox

Items that are not yet prioritised, likely awaiting further refinement:

## Completed

Items that have been successfully implemented:

### **F-001:** Set up AWS DynamoDB emulator for local development and testing

- **Priority:** Critical
- **Estimate:** Simple
- **Technical Feature:**
  - Implement development infrastructure to create, start, stop, and clean up AWS DynamoDB emulation

  - Use [LocalStack](https://www.localstack.cloud/) Docker image and Docker Compose for orchestration

### **F-002:** Add support for LSIs and GSIs

- **Priority:** High
- **Estimate:** Simple
- **Technical Feature:**
  - Add Local Secondary Index (LSI) abstraction on `TableRequirement` schema

  - Add Global Secondary Index (GSI) abstraction on `TableRequirement` schema

  - Ensure maximum type inference

### **F-003:** Basic table CRUD actions

- **Priority:** High
- **Estimate:** Simple
- **Technical Feature:**
  - In the `Table` class:
    - Implement function to create the table (from `TableRequirement`) in AWS

    - Implement function to get table information from AWS

## Notes & Definitions

### Story Format

- **User Stories:**
  **`US-XXX`** format, written as "As a [role], I want [feature] so that [benefit]"

- **Features:**
  **`F-XXX`** format, technical features without direct user-facing benefit

- **Spikes:**
  **`SPIKE-XXX`** format, time-boxed research tasks

### Priority Levels

- **Critical:**
  Blocks other work or is essential for MVP

- **High:**
  Core functionality needed for product to be useful

- **Medium:**
  Important but not essential for initial release

- **Low:**
  Nice to have, can be deferred

### Estimation

Story points in hours (rough estimates):

- **Simple:** 1-3 hours
- **Medium:** 4-8 hours
- **Complex:** 9-16 hours
- **Very Complex:** 16+ hours (consider breaking down)

## Key Decisions

## Current Blockers

_None_
