/**
 * WKND content types (aligned with future GraphQL schema)
 */

export interface WkndImage {
  _path: string;
  _dynamicUrl: string;
}

export interface WkndAuthor {
  firstName: string;
  lastName: string;
  profilePicture?: WkndImage | null;
}

export interface WkndArticleListItem {
  _path: string;
  title: string;
  slug: string;
  featuredImage: WkndImage | null;
  authorFragment: WkndAuthor;
}

/** Rich text from AEM: may be html (pre-rendered) or json (fragment structure). */
export interface WkndRichText {
  html?: string;
  plaintext?: string;
  json?: unknown;
}

export interface WkndArticleWithContent extends WkndArticleListItem {
  main?: WkndRichText | null;
}

export interface WkndAdventure {
  _path: string;
  slug: string;
  title: string;
  activity: string;
  price: number;
  tripLength: string;
  primaryImage: WkndImage | null;
}

/** Adventure detail from adventure-by-path (description, itinerary, etc.). */
export interface WkndAdventureDetail extends WkndAdventure {
  description?: WkndRichText | null;
  adventureType?: string;
  groupSize?: string;
  difficulty?: string;
  itinerary?: WkndRichText | null;
}
