# WKND AEM Persisted GraphQL Queries

This app fetches WKND content from Adobe Experience Manager via **persisted GraphQL queries**.

- **Production:** GraphQL is executed against the AEM **Publish** instance (`AEM_PUBLISH_URL`). No Author URL or auth needed.
- **Preview mode:** When the server is started with preview mode enabled (`AEM_PREVIEW_MODE=true`), GraphQL is executed against the AEM **Author** instance (`AEM_AUTHOR_URL`) so editors can see draft content.
- **Assets:** Image and asset URLs always use the **Publish** instance.

The data layer returns empty lists when requests fail so the app still builds and runs; content appears once AEM is reachable.

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `AEM_PUBLISH_URL` | No | Base URL of the AEM **Publish** instance. Used for **GraphQL in production** and for all image/asset URLs. If unset, no requests are made and the app shows fallback text. |
| `AEM_AUTHOR_URL` | When preview mode is on | Base URL of the AEM **Author** instance. Only used to execute GraphQL when `AEM_PREVIEW_MODE` is `true`. Example: `https://author-p125048-e1847106.adobeaemcloud.com` |
| `AEM_PREVIEW_MODE` | No | Set to `true` or `1` to use Author for GraphQL (preview/draft content). Omit or `false` for production (Publish). |

Execution URL pattern:

- **GraphQL (production):** `{AEM_PUBLISH_URL}/graphql/execute.json/wknd-shared/{query-name}`  
- **GraphQL (preview):** `{AEM_AUTHOR_URL}/graphql/execute.json/wknd-shared/{query-name}`  
- **Assets:** `{AEM_PUBLISH_URL}{_path}` or `{AEM_PUBLISH_URL}{_dynamicUrl}`

---

## 1. `adventures-all`

**Purpose:** Retrieves a list of all Adventures.

**Endpoint:**  
`GET {AEM_PUBLISH_URL or AEM_AUTHOR_URL in preview}/graphql/execute.json/wknd-shared/adventures-all`

**Optional query variables:**

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `offset` | Int | — | Pagination offset |
| `limit` | Int | — | Max number of items |
| `sort` | String | — | Sort expression, e.g. `"activity DESC, title ASC"` |
| `imageFormat` | AssetTransformFormat | JPG | Image format |
| `imageWidth` | Int | 1200 | Image width |
| `imageQuality` | Int | 80 | Image quality (0–100) |

**Query (reference):**

```graphql
query (
  $offset: Int,
  $limit: Int,
  $sort: String,
  $imageFormat: AssetTransformFormat = JPG,
  $imageWidth: Int = 1200,
  $imageQuality: Int = 80
) {
  adventureList(
    offset: $offset
    limit: $limit
    sort: $sort
    _assetTransform: {
      format: $imageFormat
      width: $imageWidth
      quality: $imageQuality
      preferWebp: true
    }
  ) {
    items {
      _path
      slug
      title
      activity
      price
      tripLength
      primaryImage {
        ... on ImageRef {
          _path
          _dynamicUrl
        }
      }
    }
  }
}
```

**Response shape:** `{ data: { adventureList: { items: AdventureListItem[] } } }`

---

## 2. `adventure-by-path`

**Purpose:** Get a single Adventure by its content path (full body, description, itinerary).

**Endpoint:**  
`GET {AEM_PUBLISH_URL or AEM_AUTHOR_URL in preview}/graphql/execute.json/wknd-shared/adventure-by-path`  
With variable: `adventurePath` (required).

**Required query variables:**

| Variable | Type | Description |
|----------|------|-------------|
| `adventurePath` | String! | Full path to the adventure, e.g. `/content/dam/wknd-shared/en/adventures/bali-surf-camp/bali-surf-camp` |

**Optional query variables:**

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `imageFormat` | AssetTransformFormat | JPG | Image format |
| `imageSeoName` | String | — | SEO-friendly image name |
| `imageWidth` | Int | 1200 | Image width |
| `imageQuality` | Int | 80 | Image quality (0–100) |

**Query (reference):**

```graphql
query getAdventureByPath(
  $adventurePath: String!,
  $imageFormat: AssetTransformFormat = JPG,
  $imageSeoName: String,
  $imageWidth: Int = 1200,
  $imageQuality: Int = 80
) {
  adventureByPath(
    _path: $adventurePath
    _assetTransform: {
      format: $imageFormat
      seoName: $imageSeoName
      width: $imageWidth
      quality: $imageQuality
      preferWebp: true
    }
  ) {
    item {
      _path
      title
      slug
      description {
        json
        plaintext
        html
      }
      adventureType
      tripLength
      activity
      groupSize
      difficulty
      price
      primaryImage {
        ... on ImageRef {
          _path
          _dynamicUrl
        }
      }
      itinerary {
        json
        plaintext
        html
      }
    }
  }
}
```

**Response shape:** `{ data: { adventureByPath: { item: AdventureByPathItem | null } } }`

---

## 2b. `adventure-by-slug`

**Purpose:** Get a single Adventure by slug (full body, description, itinerary). Slug is unique in the Content Fragment Model, so one item is expected.

**Endpoint:**  
`GET {AEM_PUBLISH_URL or AEM_AUTHOR_URL in preview}/graphql/execute.json/wknd-shared/adventure-by-slug`  
With variable: `slug` (required).

**Required query variables:**

| Variable | Type | Description |
|----------|------|-------------|
| `slug` | String! | Adventure slug, e.g. `bali-surf-camp` |

**Optional query variables:**

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `imageFormat` | AssetTransformFormat | JPG | Image format |
| `imageSeoName` | String | — | SEO-friendly image name |
| `imageWidth` | Int | 1200 | Image width |
| `imageQuality` | Int | 80 | Image quality (0–100) |

**Query (reference):**

```graphql
query (
  $slug: String!,
  $imageFormat: AssetTransformFormat = JPG,
  $imageSeoName: String,
  $imageWidth: Int = 1200,
  $imageQuality: Int = 80
) {
  adventureList(
    filter: { slug: { _expressions: [{ value: $slug }] } }
    _assetTransform: {
      format: $imageFormat
      seoName: $imageSeoName
      width: $imageWidth
      quality: $imageQuality
      preferWebp: true
    }
  ) {
    items {
      _path
      title
      slug
      activity
      adventureType
      price
      tripLength
      groupSize
      difficulty
      primaryImage { ... on ImageRef { _path _dynamicUrl } }
      description { json plaintext html }
      itinerary { json plaintext html }
    }
  }
}
```

**Response shape:** `{ data: { adventureList: { items: AdventureDetail[] } } }` (expect one item).

---

## 3. `articles-all`

**Purpose:** Retrieves all Articles (including referenced Author model) with optional pagination.

**Endpoint:**  
`GET {AEM_PUBLISH_URL or AEM_AUTHOR_URL in preview}/graphql/execute.json/wknd-shared/articles-all`

**Optional query variables:**

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `first` | Int | — | Page size (cursor-based) |
| `after` | String | — | Cursor for next page |
| `imageFormat` | AssetTransformFormat | PNG | Image format |
| `imageWidth` | Int | 1200 | Image width |
| `imageQuality` | Int | 80 | Image quality (0–100) |

**Query (reference):**

```graphql
query getAllArticles(
  $first: Int,
  $after: String,
  $imageFormat: AssetTransformFormat = PNG,
  $imageWidth: Int = 1200,
  $imageQuality: Int = 80
) {
  articlePaginated(
    sort: "title ASC"
    first: $first
    after: $after
    _assetTransform: {
      format: $imageFormat
      width: $imageWidth
      quality: $imageQuality
      preferWebp: true
    }
  ) {
    edges {
      cursor
      node {
        _path
        title
        slug
        featuredImage {
          ... on ImageRef {
            _path
            _dynamicUrl
          }
        }
        authorFragment {
          firstName
          lastName
          profilePicture {
            ... on ImageRef {
              _path
              _dynamicUrl
            }
          }
        }
      }
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
```

**Response shape:** `{ data: { articlePaginated: { edges: { cursor, node }[], pageInfo } } }`

---

## 4. `article-by-path`

**Purpose:** Retrieves a single Article by path (including main content and author).

**Endpoint:**  
`GET {AEM_PUBLISH_URL or AEM_AUTHOR_URL in preview}/graphql/execute.json/wknd-shared/article-by-path`  
With variable: `articlePath` (required).

**Required query variables:**

| Variable | Type | Description |
|----------|------|-------------|
| `articlePath` | String! | Full path to the article, e.g. `/content/dam/wknd-shared/en/magazine/alaska-adventure/alaskan-adventures` |

**Optional query variables:**

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `imageFormat` | AssetTransformFormat | PNG | Image format |
| `imageSeoName` | String | — | SEO-friendly image name |
| `imageWidth` | Int | 1200 | Image width |
| `imageQuality` | Int | 80 | Image quality (0–100) |

**Query (reference):**

```graphql
query getArticleByPath(
  $articlePath: String!,
  $imageFormat: AssetTransformFormat = PNG,
  $imageSeoName: String,
  $imageWidth: Int = 1200,
  $imageQuality: Int = 80
) {
  articleByPath(
    _path: $articlePath
    _assetTransform: {
      format: $imageFormat
      seoName: $imageSeoName
      width: $imageWidth
      quality: $imageQuality
      preferWebp: true
    }
  ) {
    item {
      _path
      title
      slug
      main {
        json
        html
      }
      featuredImage {
        ... on ImageRef {
          _path
          _dynamicUrl
        }
      }
      authorFragment {
        firstName
        lastName
        profilePicture {
          ... on ImageRef {
            _path
            _dynamicUrl
          }
        }
      }
    }
  }
}
```

**Response shape:** `{ data: { articleByPath: { item: ArticleByPathItem | null } } }`

---

## 4b. `article-by-slug`

**Purpose:** Returns an Article based on its slug. Slug is unique in the Content Fragment Model, so only a single Content Fragment is expected. The app calls this persisted query by name; the query below must be registered in AEM as `article-by-slug`.

**Endpoint:**  
`GET {AEM_PUBLISH_URL or AEM_AUTHOR_URL in preview}/graphql/execute.json/wknd-shared/article-by-slug`  
With variable: `slug` (required).

**Required query variables:**

| Variable | Type | Description |
|----------|------|-------------|
| `slug` | String! | Article slug, e.g. `alaskan-adventures` |

**Optional query variables:**

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `imageFormat` | AssetTransformFormat | PNG | Image format |
| `imageSeoName` | String | — | SEO-friendly image name |
| `imageWidth` | Int | 1200 | Image width |
| `imageQuality` | Int | 80 | Image quality (0–100) |

**Query to register in AEM (persisted query name: `article-by-slug`):**

```graphql
# Returns an Article based on it's slug.
#
# Required query variables:
# - {"slug": "alaskan-adventures"}
#
# Optional query variables:
# - {
#     "imageFormat": "PNG",
#     "imageSeoName": "my-article",
#     "imageWidth": 1400,
#     "imageQuality": 95
#   }
#
# This query returns an article list but since the slug property is set to be unique
# in the Content Fragment Model, only a single Content Fragment is expected.

query getArticleBySlug($slug: String!, $imageFormat: AssetTransformFormat=PNG, $imageSeoName: String, $imageWidth: Int=1200, $imageQuality: Int=80) {
  articleList(
    filter: {slug: {_expressions: [{value: $slug}]}}
    _assetTransform: {
      format: $imageFormat
      seoName: $imageSeoName
      width: $imageWidth
      quality: $imageQuality
      preferWebp: true
    }
  ) {
    items {
      _path
      title
      slug
      main {
        html
      }
      featuredImage {
        ... on ImageRef {
          _path
          _dynamicUrl
        }
      }
      authorFragment {
        firstName
        lastName
        profilePicture {
          ... on ImageRef {
            _path
            _dynamicUrl
          }
        }
      }
    }
  }
}
```

**Response shape:** `{ data: { articleList: { items: ArticleWithContent[] } } }` (expect one item). The app uses `main.html` directly for the article body.

---

## Variable encoding (GET requests)

Persisted queries are executed with **GET**. Variables are appended to the path as:

`;var1=value1;var2=value2`

The entire suffix (including `;`, `=`, and values) must be UTF-8 encoded (e.g. `%3B` for `;`, `%3D` for `=`, `%2F` for `/`). The app’s AEM client (`lib/aem-client.ts`) performs this encoding when calling `executePersistedQuery()`.

Reference: [Encoding the query URL](https://experienceleague.adobe.com/docs/experience-manager-cloud-service/content/headless/graphql-api/persisted-queries.html#encoding-query-url).
