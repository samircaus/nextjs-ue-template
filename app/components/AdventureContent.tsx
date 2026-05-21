import Image from "next/image";
import Link from "next/link";
import { getImageUrl, isWkndImageUrl } from "@/lib/data";
import { aemRichTextJsonToHtml } from "@/lib/render-rich-text";
import type { WkndAdventureDetail, WkndRichText } from "@/lib/types";
import { aueResource } from "@/lib/universal-editor";

const proseClass =
  "prose prose-zinc max-w-none dark:prose-invert prose-headings:font-semibold prose-p:text-zinc-600 dark:prose-p:text-zinc-400 prose-a:text-zinc-900 dark:prose-a:text-zinc-50";

function richTextToHtml(value: WkndRichText | null | undefined): string {
  if (!value) return "";
  if (value.html) return value.html;
  if (value.json != null) return aemRichTextJsonToHtml(value.json);
  return "";
}

type AdventureFieldProp = "description" | "itinerary" | "gearList";

const FIELD_BLOCKS: {
  id: string;
  prop: AdventureFieldProp;
  label: string;
  heading?: string;
}[] = [
  { id: "adventure-description", prop: "description", label: "Description" },
  { id: "adventure-itinerary", prop: "itinerary", label: "Itinerary", heading: "Itinerary" },
  { id: "adventure-gear-list", prop: "gearList", label: "Gear list", heading: "What to bring" },
];

function AdventureFieldBlock({
  adventureResource,
  label,
  heading,
  prop,
  value,
}: {
  adventureResource: string;
  label: string;
  heading?: string;
  prop: AdventureFieldProp;
  value: WkndRichText | null | undefined;
}) {
  const html = richTextToHtml(value);
  const ueField = {
    "data-aue-prop": prop,
    "data-aue-type": "richtext",
    "data-aue-label": label,
  } as const;

  return (
    <div
      data-aue-resource={adventureResource}
      data-aue-type="component"
      data-aue-model="adventure"
      data-aue-label={label}
    >
      {heading ? (
        <section className="border-t border-zinc-200 pt-16 dark:border-zinc-800">
          <h2 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {heading}
          </h2>
          {html ? (
            <div className={proseClass} dangerouslySetInnerHTML={{ __html: html }} {...ueField} />
          ) : value?.plaintext ? (
            <div className={proseClass} {...ueField}>
              <p className="whitespace-pre-wrap">{value.plaintext}</p>
            </div>
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-400" {...ueField}>
              Add {label.toLowerCase()} content.
            </p>
          )}
        </section>
      ) : (
        <div className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          {html ? (
            <div
              className={`${proseClass} prose-p:leading-relaxed`}
              dangerouslySetInnerHTML={{ __html: html }}
              {...ueField}
            />
          ) : value?.plaintext ? (
            <div className={proseClass} {...ueField}>
              <p className="whitespace-pre-wrap">{value.plaintext}</p>
            </div>
          ) : (
            <p {...ueField}>
              Experience this adventure. Add a description in Universal Editor.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/** Read-only preview of adventures linked inside `description` richtext (GraphQL `_references`). */
function RelatedAdventurePreview({ adventure }: { adventure: WkndAdventureDetail }) {
  const imageUrl = getImageUrl(adventure.primaryImage);

  return (
    <Link
      href={`/adventures/${adventure.slug}`}
      className="flex gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
    >
      {imageUrl ? (
        <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-200 dark:bg-zinc-800">
          <Image
            src={imageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="112px"
            unoptimized={isWkndImageUrl(imageUrl)}
          />
        </div>
      ) : null}
      <div className="min-w-0">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{adventure.title}</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {adventure.tripLength} — ${adventure.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}

export interface AdventureContentProps {
  adventure: WkndAdventureDetail;
  adventureResource: string;
  /**
   * GraphQL-only: fragment references resolved from links inside `description`
   * (not a CF model field — cannot Add/remove via a `_references` prop).
   */
  references?: WkndAdventureDetail[] | null;
}

/**
 * UE container for richtext fields on the current Adventure CF (description,
 * itinerary, gearList). Select "Adventure content" in the Content Tree to Add blocks.
 */
export default function AdventureContent({
  adventure,
  adventureResource,
  references,
}: AdventureContentProps) {
  const linkedFromDescription =
    references?.filter((r) => r._path !== adventure._path) ?? [];

  return (
    <>
      <div
        data-aue-resource={adventureResource}
        data-aue-type="container"
        data-aue-filter="adventure-content-filter"
        data-aue-label="Adventure content"
        className="space-y-0"
      >
        {FIELD_BLOCKS.map((block) => (
          <AdventureFieldBlock
            key={block.id}
            adventureResource={adventureResource}
            label={block.label}
            heading={block.heading}
            prop={block.prop}
            value={adventure[block.prop]}
          />
        ))}
      </div>

      {linkedFromDescription.length > 0 ? (
        <section
          className="border-t border-zinc-200 pt-16 dark:border-zinc-800"
          aria-label="Related trips from description"
        >
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Related trips
          </h2>
          <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
            Linked from the Description field (fragment references in richtext). Edit
            links in Universal Editor via the Description block, not Add here.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {linkedFromDescription.map((ref) => (
              <RelatedAdventurePreview key={ref._path} adventure={ref} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
