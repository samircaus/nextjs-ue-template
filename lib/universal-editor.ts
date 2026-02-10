/**
 * Universal Editor instrumentation helpers.
 * @see https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/developing/universal-editor/attributes-types
 */

/** Builds the AEM resource URN for Content Fragments (used by data-aue-resource). */
export function aueResource(contentFragmentPath: string): string {
  const path = contentFragmentPath.replace(/\/$/, "");
  return `urn:aemconnection:${path}/jcr:content/data/master`;
}
