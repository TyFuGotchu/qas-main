export function JsonLdScript({ data }: { data: object | object[] }) {
  const json = JSON.stringify(
    Array.isArray(data) ? data : data
  );
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}