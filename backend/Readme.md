# Enterprise AI Knowledge Assistant --- Backend

A FastAPI-based backend for an **Enterprise AI Knowledge Assistant**
that provides:

-   JWT-based authentication
-   Role-Based Access Control (RBAC)
-   Enterprise document management
-   Department-aware document access
-   Confidentiality and access-scope permissions
-   Supabase Storage for uploaded files
-   PostgreSQL + SQLAlchemy for application metadata
-   Redis + ARQ for asynchronous document indexing
-   ChromaDB for vector storage
-   Google Gemini for embeddings and grounded answer generation
-   Query auditing
-   User feedback
-   Admin analytics
-   Global exception handling

> **Documentation note:** This README describes the behavior implemented
> in the uploaded backend source code. Where an implementation detail
> differs from the intended security/design behavior, it is explicitly
> called out in the **Implementation Notes / Important Findings**
> section.

------------------------------------------------------------------------

## 1. High-Level Architecture

``` text
                           ┌─────────────────────┐
                           │      Frontend       │
                           └──────────┬──────────┘
                                      │ HTTP/JSON
                                      ▼
                           ┌─────────────────────┐
                           │      FastAPI        │
                           │   /api/* endpoints  │
                           └──────────┬──────────┘
                                      │
                 ┌────────────────────┼────────────────────┐
                 │                    │                    │
                 ▼                    ▼                    ▼
          ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
          │ PostgreSQL  │      │   Supabase  │      │    Redis    │
          │ Users/Docs/ │      │   Storage   │      │    Queue    │
          │ Audit/etc.  │      │   Files     │      │    / ARQ    │
          └─────────────┘      └─────────────┘      └──────┬──────┘
                                                            │
                                                            ▼
                                                     ┌─────────────┐
                                                     │ ARQ Worker  │
                                                     │ Indexing    │
                                                     └──────┬──────┘
                                                            │
                                                            ▼
                                                     ┌─────────────┐
                                                     │ PDF parsing │
                                                     │ Chunking    │
                                                     │ Embeddings  │
                                                     └──────┬──────┘
                                                            │
                                                            ▼
                                                     ┌─────────────┐
                                                     │  ChromaDB   │
                                                     │ Vector DB   │
                                                     └──────┬──────┘
                                                            │
                                      User Query             │
                           ┌────────────────────────────────┘
                           ▼
                    ┌───────────────┐
                    │ Similarity    │
                    │ Search        │
                    └──────┬────────┘
                           ▼
                    ┌───────────────┐
                    │ Permission    │
                    │ Filtering     │
                    └──────┬────────┘
                           ▼
                    ┌───────────────┐
                    │ Gemini LLM    │
                    │ Grounded      │
                    │ Synthesis     │
                    └──────┬────────┘
                           ▼
                    ┌───────────────┐
                    │ Answer +      │
                    │ Citations     │
                    └───────────────┘
```

------------------------------------------------------------------------

# 2. Technology Stack

| Layer | Technology |
|:---|:---|
| API Framework | FastAPI |
| Language | Python |
| ORM | SQLAlchemy |
| Database | PostgreSQL |
| File Storage | Supabase Storage |
| Authentication | JWT / PyJWT |
| Password Hashing | pwdlib |
| Validation | Pydantic / Pydantic Settings |
| Background Jobs | ARQ |
| Queue | Redis |
| Vector Database | ChromaDB |
| Embeddings | Google Gemini Embeddings |
| LLM | Google Gemini |
| PDF Parsing | PyMuPDF |
| Text Extraction / Legacy Pipeline | pypdf |
| Chunking | RecursiveCharacterTextSplitter |
| API Server | Uvicorn |
| Containerization | Docker / Docker Compose |

------------------------------------------------------------------------

# 3. Project Structure

``` text
backend_for_zip/
│
├── config/
│   ├── arq_config.py              # Redis/ARQ worker configuration
│   ├── db_config.py               # SQLAlchemy engine/session
│   ├── env_config.py              # Environment variables
│   ├── llm_config.py              # Gemini client
│   ├── logger_config.py           # Application logger
│   └── supabase_config.py         # Supabase client
│
├── routes/
│   └── main_route.py              # Central API router
│
├── src/
│   ├── auth/
│   │   ├── auth_router.py
│   │   ├── auth_schema.py
│   │   └── auth_service.py
│   │
│   ├── users/
│   │   ├── users_router.py
│   │   ├── user_model.py
│   │   ├── user_schema.py
│   │   └── user_service.py
│   │
│   ├── documents/
│   │   ├── document_router.py
│   │   ├── document_model.py
│   │   ├── document_schema.py
│   │   └── document_service.py
│   │
│   ├── retrieval/
│   │   ├── retrieval_router.py
│   │   ├── retrieval_schema.py
│   │   └── retrieval_service.py
│   │
│   ├── feedback/
│   │   ├── feedback_router.py
│   │   ├── feedback_model.py
│   │   ├── feedback_schema.py
│   │   └── feedback_service.py
│   │
│   ├── audit/
│   │   ├── audit_model.py
│   │   └── audit_service.py
│   │
│   └── analytics/
│       ├── analytics_router.py
│       └── analytics_service.py
│
├── genAI/
│   ├── app.py
│   ├── ai_workflows/
│   │   ├── citation_builder/
│   │   ├── grounded_synthesis/
│   │   ├── query_classification/
│   │   └── rag_retrieval/
│   │
│   └── ingestion_pipeline/
│       └── embedding_jobs/
│
├── services/
│   ├── uploadDocument_service.py  # Supabase file upload
│   ├── indexing_service.py        # Legacy/local vector pipeline
│   ├── background_service.py      # ARQ indexing worker
│   └── llm_service.py             # Gemini generation
│
├── utils/
│   ├── exception_handler.py
│   ├── jwt_util.py
│   ├── password_util.py
│   ├── permission_util.py
│   ├── prompt_util.py
│   └── rbac_util.py
│
├── main.py
├── dockerfile
├── docker-compose.yml
├── requirements.txt
└── .env.example
```

------------------------------------------------------------------------

# 4. Base URL

All application APIs are mounted under:

``` text
/api
```

Therefore:

``` text
Authentication:
POST /api/auth/signin

Users:
GET /api/user/

Documents:
POST /api/document/

Query:
POST /api/query/

Feedback:
POST /api/feedback/

Analytics:
GET /api/analytics/
```

Health check is outside `/api`:

``` text
GET /health
```

------------------------------------------------------------------------

# 5. Authentication

The backend uses **JWT Bearer authentication**.

After successful login, the backend returns:

``` json
{
  "success": true,
  "message": "Login successfully",
  "data": {
    "access_token": "<JWT_TOKEN>",
    "token_type": "Bearer"
  }
}
```

Use the token for protected APIs:

``` http
Authorization: Bearer <JWT_TOKEN>
```

The JWT contains:

``` text
id
role
department
exp
```

The token is validated by:

``` text
utils/jwt_util.py
```

------------------------------------------------------------------------

# 6. Roles

The application defines three application roles.

| Role | Description |
|:---|:---|
| `ADMIN` | Full administrative access |
| `KNOWLEDGE_OWNER` | Manages enterprise knowledge/documents within permitted department rules |
| `EMPLOYEE` | Searches the knowledge base and manages their own feedback |

The RBAC dependency implementation is:

``` python
admin_only = RBAC(["ADMIN"])

knowledge_owner_only = RBAC(["ADMIN", "KNOWLEDGE_OWNER"])

employee_only = RBAC(["ADMIN", "KNOWLEDGE_OWNER", "EMPLOYEE"])
```

This means:

-   `ADMIN` can pass every role dependency.
-   `KNOWLEDGE_OWNER` can access employee-level and knowledge-owner
    APIs.
-   `EMPLOYEE` can access employee-level APIs only.

------------------------------------------------------------------------

# 7. Department Model

The application user model supports:

``` text
HR
ENGINEERING
FINANCE
SALES
MARKETING
LEGAL
OPERATIONS
IT
PROCUREMENT
```

The document itself stores `department` as a string.

The department is important for document authorization when:

``` text
access_scope = DEPARTMENT
```

In that case the requesting user's department must match the document
department.

------------------------------------------------------------------------

# 8. Document Types

The backend defines the following document types:

| Document Type | Meaning |
|:---|:---|
| `SOP` | Standard Operating Procedure |
| `HR_POLICY` | HR policy or employee policy |
| `PROJECT_MANUAL` | Project/manual documentation |
| `ENGINEERING_GUIDE` | Engineering/technical guide |
| `SALES_DOCUMENT` | Sales/business document |
| `OTHER` | Other enterprise documentation |

### Important

`document_type` is currently stored as metadata.

The authorization function does **not** currently use `document_type` to
decide access.

Access is currently based on:

1.  User role
2.  Document confidentiality
3.  Document access scope
4.  Department, when the scope is `DEPARTMENT`
5.  Owner, when the scope is `OWNER`

------------------------------------------------------------------------

# 9. Document Confidentiality

Documents support four confidentiality levels:

| Confidentiality | Meaning |
|:---|:---|
| `PUBLIC` | Broadly accessible |
| `INTERNAL` | Normal internal company information |
| `CONFIDENTIAL` | Restricted business information |
| `RESTRICTED` | Highly restricted information |

The permission levels implemented in `permission_context_builder()` are:

### ADMIN

``` text
PUBLIC
INTERNAL
CONFIDENTIAL
RESTRICTED
```

### KNOWLEDGE_OWNER

``` text
PUBLIC
INTERNAL
CONFIDENTIAL
```

### EMPLOYEE

``` text
PUBLIC
INTERNAL
```

------------------------------------------------------------------------

# 10. Document Access Scope

Documents support three access scopes:

| Scope | Rule |
|:---|:---|
| `ALL` | Anyone who passes the role/confidentiality rules can access |
| `DEPARTMENT` | User department must equal document department |
| `OWNER` | User ID must equal document owner ID |

The core permission logic is:

``` text
ADMIN
  └── Full document access

Non-admin
  ├── Check confidentiality
  │
  └── Check access scope
       ├── ALL → allow
       ├── DEPARTMENT → user.department == document.department
       └── OWNER → user.id == document.owner_id
```

------------------------------------------------------------------------

# 11. Document Permission Matrix

The effective document permission model is:

| User Role | PUBLIC | INTERNAL | CONFIDENTIAL | RESTRICTED |
|:---|:---:|:---:|:---:|:---:|
| **ADMIN** | ✅ | ✅ | ✅ | ✅ |
| **KNOWLEDGE_OWNER** | ✅ | ✅ | ✅ | ❌ |
| **EMPLOYEE** | ✅ | ✅ | ❌ | ❌ |

The confidentiality check is combined with the access-scope check.

For example:

``` text
Employee + INTERNAL + ALL
    → Allowed

Employee + INTERNAL + DEPARTMENT
    → Allowed only for same department

Employee + CONFIDENTIAL + ALL
    → Denied

Knowledge Owner + CONFIDENTIAL + OWNER
    → Allowed only if owner_id == current user id

Admin + RESTRICTED + any scope
    → Allowed
```

------------------------------------------------------------------------

# 12. API Access Matrix

## Authentication APIs

| Method | Endpoint | ADMIN | KNOWLEDGE_OWNER | EMPLOYEE | Auth |
|:---:|:---|:---:|:---:|:---:|:---:|
| **POST** | `/api/auth/signup` | Public | Public | Public | No |
| **POST** | `/api/auth/signup/admin` | Public* | Public* | Public* | No |
| **POST** | `/api/auth/signup/knowledgeOwner` | Public* | Public* | Public* | No |
| **POST** | `/api/auth/signin` | Public | Public | Public | No |

`*` The source code currently does **not** attach an authentication/RBAC
dependency to the admin and knowledge-owner signup endpoints. Therefore
they are technically public unless another network/API gateway rule
protects them.

------------------------------------------------------------------------

## User APIs

| Method | Endpoint | ADMIN | KNOWLEDGE_OWNER | EMPLOYEE |
|:---:|:---|:---:|:---:|:---:|
| **GET** | `/api/user/{id}` | ✅ | ✅ | ✅ |
| **GET** | `/api/user/` | ✅ | ❌ | ❌ |
| **PATCH** | `/api/user/{user_id}` | ✅ | ❌ | ❌ |
| **DELETE** | `/api/user/{user_id}` | ✅ | ❌ | ❌ |

------------------------------------------------------------------------

## Document APIs

The document router has a router-level dependency:

``` text
knowledge_owner_only
```

Therefore employees cannot access the document-management APIs.

| Method | Endpoint | ADMIN | KNOWLEDGE_OWNER | EMPLOYEE |
|:---:|:---|:---:|:---:|:---:|
| **POST** | `/api/document/` | ✅ | ✅ | ❌ |
| **GET** | `/api/document/` | ✅ | ✅ | ❌ |
| **GET** | `/api/document/{id}` | ✅ | ✅ | ❌ |
| **PATCH** | `/api/document/{id}` | ✅ | ✅ | ❌ |
| **DELETE** | `/api/document/{id}` | ✅ | ❌ | ❌ |
| **GET** | `/api/document/vector-db` | ✅ | ✅ | ❌ |
| **POST** | `/api/document/indexing/{id}` | ✅ | ✅ | ❌ |
| **GET** | `/api/document/ingestion-status/{document_id}` | ✅ | ✅ | ❌ |

### Upload-specific department rule

For document upload:

``` text
ADMIN
    → Can upload for any department

KNOWLEDGE_OWNER
    → Can upload only for their own department

EMPLOYEE
    → Cannot upload
```

------------------------------------------------------------------------

## Query API

| Method | Endpoint | ADMIN | KNOWLEDGE_OWNER | EMPLOYEE |
|:---:|:---|:---:|:---:|:---:|
| **POST** | `/api/query/` | ✅ | ✅ | ✅ |

All three roles can ask knowledge questions.

However, the query engine applies document-level permission filtering
before sending document context to Gemini.

------------------------------------------------------------------------

## Feedback APIs

| Method | Endpoint | ADMIN | KNOWLEDGE_OWNER | EMPLOYEE |
|:---:|:---|:---:|:---:|:---:|
| **POST** | `/api/feedback/` | ✅ | ✅ | ✅ |
| **GET** | `/api/feedback/` | ✅ | ✅ | ✅ |
| **GET** | `/api/feedback/admin` | ✅ | ❌ | ❌ |
| **GET** | `/api/feedback/details/{feedback_id}` | ✅ | ✅ | ✅ |

Users can only retrieve their own feedback/details through the normal
feedback APIs.

Admins can retrieve all feedback.

------------------------------------------------------------------------

## Analytics API

| Method | Endpoint | ADMIN | KNOWLEDGE_OWNER | EMPLOYEE |
|:---:|:---|:---:|:---:|:---:|
| **GET** | `/api/analytics/` | ✅ | ❌ | ❌ |

------------------------------------------------------------------------

# 13. Detailed API Documentation

# 13.1 Health Check

### `GET /health`

Checks whether the FastAPI application is running.

### Authentication

None.

### Response

``` json
{
  "server is in good health"
}
```

------------------------------------------------------------------------

# 13.2 Employee Signup

### `POST /api/auth/signup`

Creates a normal employee account.

### Access

Currently public.

### Request

``` json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "department": "ENGINEERING"
}
```

### Validation

-   Name: 2--100 characters
-   Email: valid email format
-   Password: 8--128 characters
-   Department: must be a supported `Department` enum

### Behavior

1.  Check whether email already exists.
2.  Hash password.
3.  Create user.
4.  Set role to `EMPLOYEE`.
5.  Save user in PostgreSQL.
6.  Return user information.

### Response

``` json
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "department": "ENGINEERING"
  }
}
```

------------------------------------------------------------------------

# 13.3 Admin Signup

### `POST /api/auth/signup/admin`

Creates a user with:

``` text
role = ADMIN
```

### Access

Technically public in the current implementation.

### Request

Same as employee signup.

### Important Security Note

In a production enterprise system this endpoint should normally be
protected by an existing administrator, bootstrap secret,
deployment-time provisioning process, or disabled after the first admin
is created.

------------------------------------------------------------------------

# 13.4 Knowledge Owner Signup

### `POST /api/auth/signup/knowledgeOwner`

Creates:

``` text
role = KNOWLEDGE_OWNER
```

### Access

Technically public in the current implementation.

### Important Security Note

This endpoint should normally be protected so that arbitrary clients
cannot create knowledge-owner accounts.

------------------------------------------------------------------------

# 13.5 Sign In

### `POST /api/auth/signin`

Authenticates a user and generates a JWT.

### Request

``` json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

### Behavior

1.  Find user by email.
2.  Verify password hash.
3.  Generate JWT.
4.  Store user ID, role and department in token.
5.  Return Bearer token.

### Response

``` json
{
  "success": true,
  "message": "Login successfully",
  "data": {
    "access_token": "eyJ...",
    "token_type": "Bearer"
  }
}
```

------------------------------------------------------------------------

# 13.6 Get User

### `GET /api/user/{id}`

Gets a non-deleted user.

### Access

``` text
ADMIN
KNOWLEDGE_OWNER
EMPLOYEE
```

### Example

``` text
GET /api/user/15
Authorization: Bearer <token>
```

### Behavior

The service searches:

``` text
User.id == requested ID
AND
User.is_deleted == false
```

------------------------------------------------------------------------

# 13.7 Get Employees

### `GET /api/user/`

Returns all active users whose role is `EMPLOYEE`.

### Access

``` text
ADMIN only
```

### Behavior

Filters:

``` text
role = EMPLOYEE
is_deleted = false
```

------------------------------------------------------------------------

# 13.8 Update User

### `PATCH /api/user/{user_id}`

Updates:

-   name
-   email
-   department

### Access

``` text
ADMIN only
```

### Request

``` json
{
  "name": "John Updated",
  "department": "IT"
}
```

Only provided fields are updated.

------------------------------------------------------------------------

# 13.9 Delete User

### `DELETE /api/user/{user_id}`

Performs a soft delete.

### Access

``` text
ADMIN only
```

The service sets:

``` text
is_deleted = true
```

The user record is not physically deleted.

------------------------------------------------------------------------

# 13.10 Upload Document

### `POST /api/document/`

Uploads an enterprise document.

### Access

``` text
ADMIN
KNOWLEDGE_OWNER
```

Employees are denied.

### Multipart fields

``` text
title
document_type
confidentiality
access_scope
source_system
department
file
```

### Supported upload file extensions

The upload service accepts:

``` text
.pdf
.docx
.txt
```

### Document metadata example

``` text
title = Engineering Coding SOP
document_type = SOP
confidentiality = INTERNAL
access_scope = DEPARTMENT
source_system = false
department = ENGINEERING
```

### Upload flow

``` text
Client
  ↓
FastAPI multipart request
  ↓
Role check
  ↓
Department authorization
  ↓
File extension validation
  ↓
Supabase Storage upload
  ↓
Create Document row in PostgreSQL
  ↓
Return document metadata
```

### Department authorization

``` text
ADMIN
  → department can be any department

KNOWLEDGE_OWNER
  → requested department must equal user's department
```

------------------------------------------------------------------------

# 13.11 List Documents

### `GET /api/document/`

Returns documents ordered by newest upload first.

### Access

``` text
ADMIN
KNOWLEDGE_OWNER
```

### Important

The current service returns all database documents to these roles.

It does **not** apply `can_access_document()` filtering here.

Therefore the list API's authorization behavior is broader than the
query/RAG authorization behavior.

------------------------------------------------------------------------

# 13.12 Get Document

### `GET /api/document/{id}`

Returns a document by ID.

### Access

``` text
ADMIN
KNOWLEDGE_OWNER
```

### Important

The current endpoint does not call `can_access_document()` before
returning the document.

Therefore confidentiality/access-scope rules are enforced in the RAG
query path, but not consistently on this metadata endpoint.

------------------------------------------------------------------------

# 13.13 Update Document

### `PATCH /api/document/{id}`

Updates document metadata and optionally replaces the file.

### Access

``` text
ADMIN
KNOWLEDGE_OWNER
```

### Updatable metadata

``` text
title
document_type
confidentiality
access_scope
source_system
```

### Optional file

A replacement file can be uploaded.

The new file is uploaded to Supabase and its path replaces the existing
`file_path`.

------------------------------------------------------------------------

# 13.14 Delete Document

### `DELETE /api/document/{id}`

Deletes the document database record.

### Access

``` text
ADMIN only
```

### Current behavior

The service performs:

``` python
db.delete(document)
db.commit()
```

### Important

The current implementation does not explicitly delete:

-   Supabase Storage object
-   ChromaDB vectors/chunks

Therefore production cleanup should be added so deleting a document also
removes its associated physical/vector data.

------------------------------------------------------------------------

# 13.15 Get Vector Database

### `GET /api/document/vector-db`

Returns the current Chroma vector-store contents using
`vector_store.get()`.

### Access

``` text
ADMIN
KNOWLEDGE_OWNER
```

### Purpose

Primarily a debugging/inspection endpoint.

### Security consideration

This endpoint should normally be restricted further because vector data
can expose indexed document content and metadata.

------------------------------------------------------------------------

# 13.16 Start Document Indexing

### `POST /api/document/indexing/{id}`

Queues document indexing.

### Access

``` text
ADMIN
KNOWLEDGE_OWNER
```

### Behavior

1.  Find document.
2.  Reject if already `PROCESSING`.
3.  Set status to `QUEUED`.
4.  Publish ARQ job to Redis.
5.  Worker later downloads the document.
6.  Worker extracts text.
7.  Text is chunked.
8.  Gemini embeddings are generated.
9.  Chunks and metadata are stored in ChromaDB.
10. Document status becomes `COMPLETED`.

### Response

``` json
{
  "success": true,
  "message": "Indexing job queued successfully",
  "data": null
}
```

------------------------------------------------------------------------

# 13.17 Ingestion Status

### `GET /api/document/ingestion-status/{document_id}`

Returns the current indexing status.

### Access

``` text
ADMIN
KNOWLEDGE_OWNER
```

### Possible statuses

``` text
UPLOADED
QUEUED
PROCESSING
COMPLETED
FAILED
```

------------------------------------------------------------------------

# 13.18 Enterprise Query / RAG

### `POST /api/query/`

This is the main AI Knowledge Assistant endpoint.

### Access

``` text
ADMIN
KNOWLEDGE_OWNER
EMPLOYEE
```

### Request

``` json
{
  "question": "What is the engineering deployment process?"
}
```

### End-to-end flow

``` text
Question
   ↓
JWT identity
   ↓
User role + department
   ↓
Chroma similarity search
   ↓
Top 20 candidate chunks
   ↓
Document permission filtering
   ↓
Similarity threshold filtering
   ↓
Context construction
   ↓
Grounded Gemini prompt
   ↓
Structured Gemini response
   ↓
Audit log
   ↓
Answer + citations
```

### Search

The engine performs:

``` text
similarity_search_with_score(
    query=query,
    k=20
)
```

The initial vector search is not department-filtered.

After retrieval, every candidate document is passed through:

``` text
can_access_document()
```

### Permission filtering

For every retrieved chunk:

``` text
1. Is user ADMIN?
   → allow

2. Is confidentiality permitted?
   → otherwise deny

3. Is access_scope ALL?
   → allow

4. Is access_scope DEPARTMENT?
   → compare document.department with user.department

5. Is access_scope OWNER?
   → compare document.owner_id with user.id
```

Only authorized documents are passed into the LLM context.

### Similarity filtering

Authorized results are filtered using:

``` text
score <= 0.85
```

If no result satisfies the threshold, the first authorized result is
used as a fallback.

### LLM grounding

The prompt instructs Gemini to:

-   Answer only from supplied context.
-   Avoid outside knowledge.
-   State that information was not found if the context does not contain
    the answer.
-   Provide citations where possible.

------------------------------------------------------------------------

# 13.19 Query Response

The structured response contains:

``` json
{
  "answer": "...",
  "confidence_score": 0.92,
  "citations": [
    {
      "document_name": "Engineering SOP",
      "page_number": 4,
      "department": "ENGINEERING",
      "matched_passage": "..."
    }
  ],
  "recommended_action": "..."
}
```

The response schema is:

``` text
GroundedResponseSchema
├── answer
├── confidence_score
├── citations[]
└── recommended_action
```

------------------------------------------------------------------------

# 13.20 Query Auditing

Every query attempts to create an audit record.

The audit captures:

``` text
user_id
question
answer
retrieved_documents
response_time_ms
status
created_at
```

Possible audit statuses:

``` text
SUCCESS
NO_ANSWER
FAILED
```

Retrieved document information includes fields such as:

``` text
rank
document_id
document_name
department
owner
page_number
chunk_id
distance
text
```

This provides traceability for:

-   Which documents were retrieved
-   Which user asked the question
-   How long the query took
-   Whether the system produced an answer

------------------------------------------------------------------------

# 13.21 Create Feedback

### `POST /api/feedback/`

Allows a user to rate an AI response.

### Access

``` text
ADMIN
KNOWLEDGE_OWNER
EMPLOYEE
```

### Request

``` json
{
  "audit_id": 25,
  "rating": "HELPFUL",
  "comment": "The answer was accurate and useful."
}
```

### Ratings

``` text
HELPFUL
NOT_HELPFUL
```

### Security

The service verifies that the referenced audit belongs to the current
user.

This prevents a user from attaching feedback to another user's audit.

------------------------------------------------------------------------

# 13.22 Get My Feedback

### `GET /api/feedback/?page=1`

Returns feedback created by the current user.

### Access

``` text
ADMIN
KNOWLEDGE_OWNER
EMPLOYEE
```

### Pagination

Current page size:

``` text
10
```

Example:

``` text
GET /api/feedback/?page=2
```

------------------------------------------------------------------------

# 13.23 Get All Feedback

### `GET /api/feedback/admin?page=1`

Returns all feedback.

### Access

``` text
ADMIN only
```

### Pagination

``` text
10 records per page
```

------------------------------------------------------------------------

# 13.24 Get Feedback Details

### `GET /api/feedback/details/{feedback_id}`

Returns a feedback record together with associated audit information.

### Access

``` text
ADMIN
KNOWLEDGE_OWNER
EMPLOYEE
```

### Ownership rule

The service checks:

``` text
feedback.id == feedback_id
AND
feedback.user_id == current_user.id
```

Therefore a normal user can only retrieve their own feedback.

------------------------------------------------------------------------

# 13.25 Analytics

### `GET /api/analytics/`

Returns admin dashboard metrics.

### Access

``` text
ADMIN only
```

### Metrics returned

``` text
total_documents
completed_documents
failed_documents

total_queries
successful_answers
no_answer

total_feedback
helpful_feedback
not_helpful_feedback

average_response_time
```

### Example

``` json
{
  "total_documents": 100,
  "completed_documents": 92,
  "failed_documents": 3,
  "total_queries": 850,
  "successful_answers": 730,
  "no_answer": 120,
  "total_feedback": 200,
  "helpful_feedback": 170,
  "not_helpful_feedback": 30,
  "average_response_time": 1240.45
}
```

------------------------------------------------------------------------

# 14. Complete Document Lifecycle

``` text
                 Upload
                   │
                   ▼
             ┌───────────┐
             │  UPLOADED │
             └─────┬─────┘
                   │
             Start indexing
                   │
                   ▼
             ┌───────────┐
             │   QUEUED  │
             └─────┬─────┘
                   │
               ARQ Worker
                   │
                   ▼
             ┌───────────┐
             │ PROCESSING│
             └─────┬─────┘
                   │
            Extract PDF text
                   │
                 Chunk
                   │
               Embedding
                   │
              Store Chroma
                   │
          ┌────────┴────────┐
          ▼                 ▼
    ┌───────────┐      ┌────────┐
    │ COMPLETED │      │ FAILED │
    └───────────┘      └────────┘
```

------------------------------------------------------------------------

# 15. Document Indexing Pipeline

The current active indexing path is:

``` text
Supabase Storage
      ↓
ARQ Worker
      ↓
Download file bytes
      ↓
Temporary PDF file
      ↓
PyMuPDFLoader
      ↓
Page extraction
      ↓
RecursiveCharacterTextSplitter
      ↓
Chunk size = 1000
      ↓
Chunk overlap = 200
      ↓
Gemini Embeddings
      ↓
ChromaDB
```

Each indexed chunk contains metadata such as:

``` json
{
  "document_id": 12,
  "title": "Engineering SOP",
  "department": "ENGINEERING",
  "owner_id": 7,
  "access_scope": "DEPARTMENT",
  "confidentiality": "INTERNAL",
  "page_number": 4,
  "chunk_id": "12_4_0"
}
```

This metadata is essential because the RAG query uses it to enforce
authorization.

------------------------------------------------------------------------

# 16. RAG Permission Flow

The most important security flow in the AI query path is:

``` text
User
 │
 │ JWT
 ▼
role + department + user_id
 │
 ▼
Chroma similarity search
 │
 │ top 20 candidate chunks
 ▼
Document metadata
 │
 ▼
permission_context_builder()
 │
 ▼
can_access_document()
 │
 ├── ADMIN → allow
 │
 ├── confidentiality check
 │
 └── access_scope check
       ├── ALL
       ├── DEPARTMENT
       └── OWNER
 │
 ▼
Authorized chunks only
 │
 ▼
Gemini
 │
 ▼
Grounded answer
```

This is important because the application does **not** simply trust
vector similarity. It performs a second authorization decision using
document metadata before context is sent to the LLM.

------------------------------------------------------------------------

# 17. Permission Context by Role

The intended permission context is:

## ADMIN

``` python
{
    "can_access_all_documents": True,
    "allowed_confidentiality": [
        "PUBLIC",
        "INTERNAL",
        "CONFIDENTIAL",
        "RESTRICTED"
    ],
    "allowed_access_scope": [
        "ALL",
        "DEPARTMENT",
        "OWNER"
    ]
}
```

## KNOWLEDGE_OWNER

``` python
{
    "can_access_all_documents": False,
    "allowed_confidentiality": [
        "PUBLIC",
        "INTERNAL",
        "CONFIDENTIAL"
    ],
    "allowed_access_scope": [
        "ALL",
        "DEPARTMENT",
        "OWNER"
    ]
}
```

## EMPLOYEE

``` python
{
    "can_access_all_documents": False,
    "allowed_confidentiality": [
        "PUBLIC",
        "INTERNAL"
    ],
    "allowed_access_scope": [
        "ALL",
        "DEPARTMENT"
    ]
}
```

------------------------------------------------------------------------

# 18. Database Models

## Users

``` text
users
├── id
├── name
├── email
├── password
├── role
├── department
└── is_deleted
```

Roles:

``` text
ADMIN
KNOWLEDGE_OWNER
EMPLOYEE
```

------------------------------------------------------------------------

## Documents

``` text
documents
├── id
├── title
├── department
├── owner_id
├── file_path
├── status
├── document_type
├── confidentiality
├── access_scope
├── source_system
├── is_deleted
├── uploaded_at
└── updated_at
```

------------------------------------------------------------------------

## Audit Logs

``` text
audit_logs
├── id
├── user_id
├── question
├── answer
├── retrieved_documents
├── response_time_ms
├── status
└── created_at
```

------------------------------------------------------------------------

## Feedback

``` text
feedback
├── id
├── user_id
├── audit_id
├── rating
├── comment
├── created_at
└── updated_at
```

------------------------------------------------------------------------

# 19. Exception Handling

The application registers global handlers for:

### HTTP exceptions

Returns:

``` json
{
  "success": false,
  "message": "Permission denied",
  "data": null
}
```

### Validation errors

Returns:

``` json
{
  "success": false,
  "message": "Validation Error",
  "data": {
    "field": "Field validation message"
  }
}
```

### Unexpected exceptions

Returns:

``` json
{
  "success": false,
  "message": "Internal Server Error",
  "data": null
}
```

------------------------------------------------------------------------

# 20. Environment Variables

The backend expects the following environment variables:

``` env
DATABASE_URL=

SECRET_KEY=
ALGORITHM=
ACCESS_TOKEN_EXPIRE_MINUTES=

SUPABASE_URL=
SUPABASE_KEY=
SUPABASE_BUCKET=

REDIS_HOST=
REDIS_PORT=
REDIS_LOCAL_HOST=

GEMINI_API_KEY=
```

Never commit real credentials into Git.

------------------------------------------------------------------------

# 21. Running Locally

## Install dependencies

``` bash
python -m venv venv
```

### Windows

``` powershell
venv\Scripts\activate
```

### Linux/macOS

``` bash
source venv/bin/activate
```

Install:

``` bash
pip install -r requirements.txt
```

------------------------------------------------------------------------

## Configure `.env`

Create:

``` text
.env
```

and provide the required environment variables.

------------------------------------------------------------------------

## Start FastAPI

From the backend root:

``` bash
uvicorn main:app --reload
```

API:

``` text
http://localhost:8000
```

Swagger:

``` text
http://localhost:8000/docs
```

ReDoc:

``` text
http://localhost:8000/redoc
```

Health:

``` text
http://localhost:8000/health
```

------------------------------------------------------------------------

# 22. Docker Deployment

The project contains:

``` text
dockerfile
docker-compose.yml
```

The Compose stack contains:

``` text
api
worker
redis
```

Start:

``` bash
docker compose up --build
```

Services:

``` text
FastAPI → port 8000
Redis   → port 6379
ARQ     → background indexing worker
```

A shared Docker volume is used for:

``` text
genAI/vector_db
```

so API and worker can access the Chroma vector database.

------------------------------------------------------------------------

# 23. Recommended API Usage Sequence

A typical enterprise workflow is:

``` text
1. Admin creates/provisions users
        ↓
2. User signs in
        ↓
3. JWT token returned
        ↓
4. Admin/Knowledge Owner uploads document
        ↓
5. Document metadata saved
        ↓
6. Start indexing
        ↓
7. Document status = QUEUED
        ↓
8. ARQ worker processes document
        ↓
9. Status = PROCESSING
        ↓
10. PDF text extracted
        ↓
11. Text chunked
        ↓
12. Embeddings generated
        ↓
13. Chunks stored in ChromaDB
        ↓
14. Status = COMPLETED
        ↓
15. Employee asks question
        ↓
16. Vector similarity search
        ↓
17. Permission filtering
        ↓
18. Authorized context sent to Gemini
        ↓
19. Grounded answer + citations
        ↓
20. Audit record created
        ↓
21. User can submit feedback
        ↓
22. Admin can view analytics
```

------------------------------------------------------------------------

# 24. API Summary Table

| # | Method | Endpoint | Purpose | Access |
|---:|:---:|:---|:---|:---|
| 1 | GET | `/health` | Health check | Public |
| 2 | POST | `/api/auth/signup` | Create employee | Public |
| 3 | POST | `/api/auth/signup/admin` | Create admin | Public in current code |
| 4 | POST | `/api/auth/signup/knowledgeOwner` | Create knowledge owner | Public in current code |
| 5 | POST | `/api/auth/signin` | Login | Public |
| 6 | GET | `/api/user/{id}` | Get user | All authenticated roles |
| 7 | GET | `/api/user/` | List employees | Admin |
| 8 | PATCH | `/api/user/{user_id}` | Update user | Admin |
| 9 | DELETE | `/api/user/{user_id}` | Soft-delete user | Admin |
| 10 | POST | `/api/document/` | Upload document | Admin, Knowledge Owner |
| 11 | GET | `/api/document/` | List documents | Admin, Knowledge Owner |
| 12 | GET | `/api/document/{id}` | Get document | Admin, Knowledge Owner |
| 13 | PATCH | `/api/document/{id}` | Update document | Admin, Knowledge Owner |
| 14 | DELETE | `/api/document/{id}` | Delete document | Admin |
| 15 | GET | `/api/document/vector-db` | Inspect vector DB | Admin, Knowledge Owner |
| 16 | POST | `/api/document/indexing/{id}` | Queue indexing | Admin, Knowledge Owner |
| 17 | GET | `/api/document/ingestion-status/{id}` | Check indexing status | Admin, Knowledge Owner |
| 18 | POST | `/api/query/` | AI/RAG query | All authenticated roles |
| 19 | POST | `/api/feedback/` | Submit feedback | All authenticated roles |
| 20 | GET | `/api/feedback/` | Get own feedback | All authenticated roles |
| 21 | GET | `/api/feedback/admin` | Get all feedback | Admin |
| 22 | GET | `/api/feedback/details/{id}` | Get own feedback detail | All authenticated roles |
| 23 | GET | `/api/analytics/` | Admin metrics | Admin |
------------------------------------------------------------------------



# 27. Recommended Production Permission Model

The intended enterprise policy can be summarized as:

``` text
ADMIN
 ├── Manage users
 ├── Manage all documents
 ├── Access all confidentiality levels
 ├── Access analytics
 ├── Access all feedback
 └── Query all authorized enterprise knowledge

KNOWLEDGE_OWNER
 ├── Upload knowledge
 ├── Manage knowledge within assigned department
 ├── Access PUBLIC/INTERNAL/CONFIDENTIAL
 ├── Query authorized knowledge
 └── Submit/view own feedback

EMPLOYEE
 ├── Sign in
 ├── Query authorized enterprise knowledge
 ├── Access PUBLIC/INTERNAL according to scope
 └── Submit/view own feedback
```
